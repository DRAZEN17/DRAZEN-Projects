import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { projectsService } from '../../services/content.js';
import { db } from '../../services/api.js';

const empty = {
  title: '', slug: '', description: '', longDescription: '', coverImage: '',
  techStack: '', githubUrl: '', liveUrl: '', featured: false, order: 0,
};

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ProjectsAdmin() {
  const [items,    setItems]    = useState([]);
  const [editing,  setEditing]  = useState(null);
  const [form,     setForm]     = useState(empty);
  const [importUrl, setImportUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const load = () => projectsService.list({ limit: 200 }).then((r) => setItems(r.data || []));
  useEffect(() => { load(); }, []);

  // Export current projects to a downloadable JSON file
  const exportProjects = () => {
    try {
      const data = db.projects.all();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'projects.json';
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Exported projects.json');
    } catch (err) {
      toast.error('Export failed');
    }
  };

  // Import projects from a public JSON URL. This will replace local projects.
  const importFromUrl = async (url) => {
    if (!url) return toast.error('Provide a URL');
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Fetch failed');
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error('Invalid JSON format');

      // wipe existing
      const existing = db.projects.all();
      for (const e of existing) db.projects.remove(e._id);

      // create imported items
      for (const d of data) {
        // strip meta fields that may conflict; create() will add timestamps and ids
        const { _id, createdAt, updatedAt, ...rest } = d;
        db.projects.create(rest);
      }
      load();
      toast.success('Imported projects');
    } catch (err) {
      toast.error(err?.message || 'Import failed');
    }
  };

  const handleFile = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const b64 = await toBase64(file);
      setForm((s) => ({ ...s, coverImage: b64 }));
      toast.success('Image loaded');
    } catch {
      toast.error('Failed to read image');
    } finally {
      setUploading(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      techStack: (form.techStack || '').split(',').map((s) => s.trim()).filter(Boolean),
      order: Number(form.order) || 0,
    };
    try {
      if (editing) await projectsService.update(editing, payload);
      else await projectsService.create(payload);
      toast.success('Saved');
      setForm(empty);
      setEditing(null);
      load();
    } catch (err) {
      toast.error(err?.message || 'Error');
    }
  };

  const edit = (p) => {
    setEditing(p._id);
    setForm({ ...empty, ...p, techStack: (p.techStack || []).join(', ') });
  };

  const remove = async (id) => {
    if (!confirm('Delete?')) return;
    await projectsService.remove(id);
    load();
  };

  return (
    <div>
      <h1 className="h2">Projects</h1>
      <form onSubmit={submit} className="grid md:grid-cols-2 gap-3 mt-6">
        {['title', 'slug', 'description', 'techStack', 'githubUrl', 'liveUrl'].map((k) => (
          <input
            key={k} placeholder={k}
            value={form[k] || ''}
            onChange={(e) => setForm({ ...form, [k]: e.target.value })}
            className="bg-transparent border border-white/10 rounded-lg px-3 py-2"
          />
        ))}
        <textarea
          placeholder="longDescription (optional)"
          value={form.longDescription || ''}
          onChange={(e) => setForm({ ...form, longDescription: e.target.value })}
          rows={3}
          className="md:col-span-2 bg-transparent border border-white/10 rounded-lg px-3 py-2"
        />
        <input
          placeholder="coverImage URL (or upload below)"
          value={typeof form.coverImage === 'string' && form.coverImage.startsWith('data:') ? '[uploaded image]' : (form.coverImage || '')}
          onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
          className="md:col-span-2 bg-transparent border border-white/10 rounded-lg px-3 py-2"
        />

        {/* ── Image upload (base64) ── */}
        <div className="md:col-span-2">
          <label className="block text-sm text-muted mb-2">Upload image (stored locally as base64)</label>
          <div
            onDrop={(e) => { e.preventDefault(); setDragActive(false); handleFile(e.dataTransfer?.files?.[0]); }}
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            className={`p-4 border-dashed rounded-lg border ${dragActive ? 'border-neon-cyan/60 bg-white/2' : 'border-white/10'}`}
          >
            <input type="file" accept="image/*" onChange={(e) => handleFile(e.target.files?.[0])} />
            <div className="text-xs text-muted mt-2">Drag & drop or click to choose. Images are stored as base64 in localStorage.</div>
            {uploading && <div className="text-xs text-neon-cyan mt-2">Processing…</div>}
            {form.coverImage && (
              <img
                src={form.coverImage}
                alt="preview"
                className="mt-3 max-h-40 rounded-lg border border-white/10"
              />
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-muted">
            <input type="checkbox" checked={!!form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured
          </label>
          <input
            type="number" placeholder="order"
            value={form.order ?? 0}
            onChange={(e) => setForm({ ...form, order: e.target.value })}
            className="w-20 bg-transparent border border-white/10 rounded-lg px-2 py-1 text-sm"
          />
        </div>

        <div className="md:col-span-2 flex gap-3">
          <button className="btn-magnetic">{editing ? 'Update' : 'Create'}</button>
          {editing && (
            <button type="button" onClick={() => { setEditing(null); setForm(empty); }} className="text-muted">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="flex items-center gap-3 mt-6">
        <button type="button" onClick={exportProjects} className="btn-magnetic">Export JSON</button>
        <input
          placeholder="Import JSON URL"
          value={importUrl}
          onChange={(e) => setImportUrl(e.target.value)}
          className="bg-transparent border border-white/10 rounded-lg px-3 py-2 flex-1"
        />
        <button type="button" onClick={() => importFromUrl(importUrl)} className="btn-magnetic">Import</button>
      </div>

      <ul className="mt-10 divide-y divide-white/5">
        {items.map((p) => (
          <li key={p._id} className="py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {p.coverImage && (
                <img src={p.coverImage} alt="" className="w-12 h-8 object-cover rounded border border-white/10" />
              )}
              <div>
                <div className="font-medium">{p.title}</div>
                <div className="text-xs text-muted">{p.slug}</div>
              </div>
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
