import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { projectsService } from '../../services/content.js';
import { api } from '../../services/api.js';

const empty = { title: '', slug: '', description: '', coverImage: '', techStack: '', githubUrl: '', liveUrl: '', featured: false };

export default function ProjectsAdmin() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [previewError, setPreviewError] = useState(false);
  const [previewKey, setPreviewKey] = useState(null);
  const [currentFile, setCurrentFile] = useState(null);
  const [localPreview, setLocalPreview] = useState(null);

  const backendBase = api.defaults?.baseURL ? api.defaults.baseURL.replace(/\/api\/?$/i, '') : 'http://localhost:5000';

  const normalizeCover = (raw) => {
    if (!raw) return '';
    let v = String(raw).trim();
    if (!v) return '';
    // already a full URL
    if (v.startsWith('http://') || v.startsWith('https://')) return v;
    // replace backslashes with slashes and extract filename
    v = v.replace(/\\\\/g, '/').replace(/\\/g, '/');
    const parts = v.split('/').filter(Boolean);
    const filename = parts.length ? parts[parts.length - 1] : v;
    return `${backendBase}/uploads/${encodeURIComponent(filename)}`;
  };

  const load = () => projectsService.list({ limit: 200 }).then((r) => setItems(r.data || []));
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    // If there's a selected file that hasn't been uploaded, upload it first
    if (currentFile) {
      await uploadFile(currentFile);
      // uploadFile will set `form.coverImage` to the backend URL
    }
    const payload = { ...form, techStack: (form.techStack || '').split(',').map((s) => s.trim()).filter(Boolean) };
    try {
      if (editing) await projectsService.update(editing, payload);
      else await projectsService.create(payload);
      toast.success('Saved'); setForm(empty); setEditing(null); load();
    } catch (err) { toast.error(err?.response?.data?.message || 'Error'); }
  };

  const uploadFile = async (file) => {
    if (!file) return;
    // show an immediate local preview while uploading
    try {
      const url = URL.createObjectURL(file);
      setLocalPreview(url);
      setPreviewKey(Date.now());
      setCurrentFile(file);
    } catch (e) {
      // ignore
    }
    const fd = new FormData();
    fd.append('image', file);
    try {
      setUploading(true);
      setProgress(0);
      const res = await api.post('/upload/image', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (ev) => {
          if (ev.total) setProgress(Math.round((ev.loaded / ev.total) * 100));
        },
      });
      setForm((s) => ({ ...s, coverImage: res.data.url }));
      setPreviewKey(Date.now());
      // uploaded to backend, we can clear localFile preview if desired
      setCurrentFile(null);
      if (localPreview) { try { URL.revokeObjectURL(localPreview); } catch (e) {} setLocalPreview(null); }
      toast.success('Uploaded');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 800);
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) uploadFile(file);
  };

  const onDragOver = (e) => { e.preventDefault(); setDragActive(true); };
  const onDragLeave = () => { setDragActive(false); };

  const edit = (p) => {
    setEditing(p._id);
    setForm({ ...empty, ...p, techStack: (p.techStack || []).join(', '), coverImage: normalizeCover(p.coverImage) });
    // clear any transient local preview when loading existing project
    if (localPreview) { try { URL.revokeObjectURL(localPreview); } catch (e) {} setLocalPreview(null); }
    setCurrentFile(null);
    setPreviewKey(Date.now());
  };
  const remove = async (id) => { if (confirm('Delete?')) { await projectsService.remove(id); load(); } };
  const previewUrl = normalizeCover(form.coverImage);
  const displaySrc = localPreview || previewUrl;

  return (
    <div>
      <h1 className="h2">Projects</h1>
      <form onSubmit={submit} className="grid md:grid-cols-2 gap-3 mt-6">
        {['title', 'slug', 'description', 'techStack', 'githubUrl', 'liveUrl'].map((k) => (
          <input key={k} placeholder={k} value={form[k] || ''} onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                 className="bg-transparent border border-white/10 rounded-lg px-3 py-2" />
        ))}
        <input placeholder="coverImage URL" value={form.coverImage || ''} onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
               className="bg-transparent border border-white/10 rounded-lg px-3 py-2" />
        <div className="md:col-span-2">
          <label className="block text-sm text-muted mb-2">Upload image</label>
          <div
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            className={`p-3 border-dashed rounded-lg border ${dragActive ? 'border-neon-cyan/60 bg-white/2' : 'border-white/10'}`}
          >
            <input type="file" accept="image/*" onChange={handleFileInput} />
            <div className="text-xs text-muted mt-2">Drag & drop an image here, or click to choose.</div>
            {uploading && (
              <div className="w-full bg-white/5 rounded-full h-2 mt-3 overflow-hidden">
                <div style={{ width: `${progress}%` }} className="h-2 bg-neon-cyan transition-all" />
              </div>
            )}
            {form.coverImage && (
              <div className="mt-3">
                <img
                  key={previewKey || displaySrc}
                  src={displaySrc}
                  alt="preview"
                  onError={() => setPreviewError(true)}
                  onLoad={() => setPreviewError(false)}
                  className="max-h-40 rounded-lg border border-white/10"
                />
                <div className="mt-2">
                  <a href={displaySrc} target="_blank" rel="noreferrer" className="text-xs text-neon-cyan">Open image in new tab</a>
                  {previewError && <span className="text-xs text-red-400 ml-3">Image failed to load — open in new tab to inspect</span>}
                </div>
              </div>
            )}
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm text-muted">
          <input type="checkbox" checked={!!form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured
        </label>
        <div className="md:col-span-2 flex gap-3">
          <button className="btn-magnetic">{editing ? 'Update' : 'Create'}</button>
          {editing && <button type="button" onClick={() => { setEditing(null); setForm(empty); }} className="text-muted">Cancel</button>}
        </div>
      </form>
      <ul className="mt-10 divide-y divide-white/5">
        {items.map((p) => (
          <li key={p._id} className="py-3 flex items-center justify-between gap-3">
            <div>
              <div className="font-medium">{p.title}</div>
              <div className="text-xs text-muted">{p.slug}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => edit(p)} className="text-xs text-neon-cyan">Edit</button>
              <button onClick={() => remove(p._id)} className="text-xs text-neon-magenta">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
