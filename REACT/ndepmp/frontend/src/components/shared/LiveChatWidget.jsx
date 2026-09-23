import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Zap } from 'lucide-react';

const GREETING = { from: 'bot', text: "Hi! I'm the NDEPMP assistant. Ask me about registering a property, bills, or complaints." };

function reply(input) {
  const text = input.toLowerCase();
  if (text.includes('bill') || text.includes('pay')) {
    return "Bills show up under Dashboard \u2192 Bills once you've linked a meter. You can pay from there with a provider of your choice.";
  }
  if (text.includes('register') || text.includes('property')) {
    return 'You can register a property from Dashboard \u2192 Properties \u2192 Register a property. A field agent verifies it before approval.';
  }
  if (text.includes('complain') || text.includes('outage') || text.includes('power')) {
    return 'Sorry to hear that. File a complaint from Dashboard \u2192 Complaints \u2014 you\u2019ll get a reference number to track it.';
  }
  if (text.includes('meter')) {
    return 'Meters link to a property once it\u2019s approved. Head to Dashboard \u2192 Electricity to link a prepaid or postpaid meter.';
  }
  if (text.includes('human') || text.includes('agent') || text.includes('call')) {
    return 'For a real person, use the Contact page or request a callback \u2014 this widget is just a scripted demo.';
  }
  return "I'm a NDEPMP assistant, so I only know a few topics: registering a property, bills, meters, and complaints. Try one of those, or use the Contact page for anything else.";
}

export function LiveChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([GREETING]);
  const [input, setInput] = useState('');
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const send = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { from: 'user', text: input.trim() };
    const botMsg = { from: 'bot', text: reply(input.trim()) };
    setMessages((m) => [...m, userMsg, botMsg]);
    setInput('');
  };

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {open && (
        <div className="mb-3 flex h-96 w-80 flex-col overflow-hidden rounded-2xl border border-border bg-canvas shadow-2xl">
          <div className="flex items-center justify-between bg-brand px-4 py-3 text-white">
            <span className="flex items-center gap-2 text-sm font-medium">
              <Zap size={14} /> NDEPMP Assistant
            </span>
            <button onClick={() => setOpen(false)} aria-label="Close chat">
              <X size={16} />
            </button>
          </div>
          <div className="flex-1 space-y-2 overflow-y-auto p-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                  m.from === 'bot' ? 'bg-canvas-alt text-ink' : 'ml-auto bg-brand text-white'
                }`}
              >
                {m.text}
              </div>
            ))}
            <div ref={endRef} />
          </div>
          <form onSubmit={send} className="flex items-center gap-2 border-t border-border p-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message…"
              className="h-9 flex-1 rounded-lg border border-border bg-canvas px-3 text-sm focus:border-brand"
            />
            <button type="submit" className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-white" aria-label="Send">
              <Send size={14} />
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white shadow-xl hover:bg-brand-dark"
        aria-label="Open live chat"
      >
        {open ? <X size={20} /> : <MessageCircle size={20} />}
      </button>
    </div>
  );
}
