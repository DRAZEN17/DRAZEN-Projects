import { useEffect, useState } from 'react';
import { messagesService } from '../../services/content.js';

export default function MessagesAdmin() {
  const [items, setItems] = useState([]);
  const load = () => messagesService.list().then((r) => setItems(r.data || []));
  useEffect(() => { load(); }, []);

  return (
    <div>
      <h1 className="h2">Messages</h1>
      <ul className="mt-8 space-y-4">
        {items.map((m) => (
          <li key={m._id} className={`glass p-5 ${m.read ? 'opacity-60' : ''}`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{m.name} <span className="text-muted">&lt;{m.email}&gt;</span></div>
                <div className="text-xs text-muted">{new Date(m.createdAt).toLocaleString()}</div>
              </div>
              <div className="flex gap-3 text-xs">
                {!m.read && <button onClick={async () => { await messagesService.markRead(m._id); load(); }} className="text-neon-cyan">Mark read</button>}
                <button onClick={async () => { if (confirm('Delete?')) { await messagesService.remove(m._id); load(); } }} className="text-neon-magenta">Delete</button>
              </div>
            </div>
            {m.subject && <div className="mt-3 font-medium">{m.subject}</div>}
            <p className="mt-2 text-muted whitespace-pre-line">{m.message}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
