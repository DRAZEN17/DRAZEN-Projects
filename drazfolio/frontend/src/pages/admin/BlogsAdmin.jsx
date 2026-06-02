import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { blogsService } from '../../services/content.js';

const empty = { title: '', slug: '', excerpt: '', content: '', coverImage: '', tags: '', published: false };

export default function BlogsAdmin() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);

  const load = () => blogsService.list({ limit: 200 }).then((r) => setItems(r.data || []));
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    const payload = { ...form, tags: form.tags.split(',').map((s) => s.trim()).filter(Boolean) };
    try {
      if (editing) await blogsService.update(editing, payload);
      else await blogsService.create(payload);
      toast.success('Saved'); setForm(empty); setEditing(null); load();
    } catch (err) { toast.error(err?.response?.data?.message || 'Error'); }
  };

  const edit = (b) => { setEditing(b._id); setForm({ ...empty, ...b, tags: (b.tags || []).join(', ') }); };
  const remove = async (id) => { if (confirm('Delete?')) { await blogsService.remove(id); load(); } };

  return (
    <div>
      <h1 className="h2">Blogs</h1>
      <form onSubmit={submit} className="grid gap-3 mt-6">
        {['title', 'slug', 'excerpt', 'coverImage', 'tags'].map((k) => (
          <input key={k} placeholder={k} value={form[k] || ''} onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                 className="bg-transparent border border-white/10 rounded-lg px-3 py-2" />
        ))}
        <textarea placeholder="content (markdown ok)" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}
                  rows={8} className="bg-transparent border border-white/10 rounded-lg px-3 py-2" />
        <label className="flex items-center gap-2 text-sm text-muted">
          <input type="checkbox" checked={!!form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> Published
        </label>
        <div className="flex gap-3"><button className="btn-magnetic">{editing ? 'Update' : 'Create'}</button>
          {editing && <button type="button" onClick={() => { setEditing(null); setForm(empty); }} className="text-muted">Cancel</button>}
        </div>
      </form>
      <ul className="mt-10 divide-y divide-white/5">
        {items.map((b) => (
          <li key={b._id} className="py-3 flex items-center justify-between gap-3">
            <div>
              <div className="font-medium">{b.title} {b.published ? '' : <span className="text-xs text-muted">(draft)</span>}</div>
              <div className="text-xs text-muted">{b.slug}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => edit(b)} className="text-xs text-neon-cyan">Edit</button>
              <button onClick={() => remove(b._id)} className="text-xs text-neon-magenta">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
