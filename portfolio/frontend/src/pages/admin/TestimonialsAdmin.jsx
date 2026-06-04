import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { db } from '../../services/api.js';

const empty = { name: '', role: '', company: '', avatar: '', quote: '', rating: 5, approved: true };

export default function TestimonialsAdmin() {
  const [items,   setItems]   = useState([]);
  const [editing, setEditing] = useState(null);
  const [form,    setForm]    = useState(empty);

  const load = () => setItems(db.testimonials.all().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  useEffect(() => { load(); }, []);

  const submit = (e) => {
    e.preventDefault();
    if (editing) db.testimonials.update(editing, form);
    else db.testimonials.create(form);
    toast.success('Saved');
    setForm(empty);
    setEditing(null);
    load();
  };

  const edit   = (t) => { setEditing(t._id); setForm({ ...empty, ...t }); };
  const remove = (id) => { if (confirm('Delete?')) { db.testimonials.remove(id); load(); } };
  const toggle = (t) => { db.testimonials.update(t._id, { approved: !t.approved }); load(); };

  return (
    <div>
      <h1 className="h2">Testimonials</h1>
      <form onSubmit={submit} className="grid md:grid-cols-2 gap-3 mt-6">
        {['name', 'role', 'company', 'avatar'].map((k) => (
          <input key={k} placeholder={k} value={form[k] || ''}
            onChange={(e) => setForm({ ...form, [k]: e.target.value })}
            className="bg-transparent border border-white/10 rounded-lg px-3 py-2" />
        ))}
        <textarea placeholder="quote" value={form.quote} rows={3}
          onChange={(e) => setForm({ ...form, quote: e.target.value })}
          className="md:col-span-2 bg-transparent border border-white/10 rounded-lg px-3 py-2" />
        <label className="flex items-center gap-2 text-sm text-muted">
          Rating:
          <input type="number" min={1} max={5} value={form.rating}
            onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
            className="w-16 bg-transparent border border-white/10 rounded px-2 py-1" />
        </label>
        <label className="flex items-center gap-2 text-sm text-muted">
          <input type="checkbox" checked={!!form.approved} onChange={(e) => setForm({ ...form, approved: e.target.checked })} />
          Approved (visible on site)
        </label>
        <div className="md:col-span-2 flex gap-3">
          <button className="btn-magnetic">{editing ? 'Update' : 'Create'}</button>
          {editing && <button type="button" onClick={() => { setEditing(null); setForm(empty); }} className="text-muted">Cancel</button>}
        </div>
      </form>
      <ul className="mt-10 divide-y divide-white/5">
        {items.map((t) => (
          <li key={t._id} className={`py-4 flex items-start justify-between gap-3 ${!t.approved ? 'opacity-50' : ''}`}>
            <div>
              <div className="font-medium">{t.name} <span className="text-muted text-sm">— {t.role}{t.company ? `, ${t.company}` : ''}</span></div>
              <p className="text-sm text-muted mt-1 italic">"{t.quote}"</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => toggle(t)} className="text-xs text-neon-cyan">{t.approved ? 'Hide' : 'Show'}</button>
              <button onClick={() => edit(t)} className="text-xs text-neon-cyan">Edit</button>
              <button onClick={() => remove(t._id)} className="text-xs text-neon-magenta">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
