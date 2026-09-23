import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  { q: 'Who is required to register a property?', a: 'Any owner of a residential, commercial, industrial, or government property who wants a verified digital address and the ability to link an electricity account to it.' },
  { q: 'What documents do I need?', a: 'Proof of ownership (title, deed, or allocation letter), a valid photo ID, and clear photographs of the property. Tenants can be added as occupants by the owner.' },
  { q: 'How long does verification take?', a: 'Submissions are queued for review by a field agent covering your local government area. Most verifications conclude within ten working days of a complete submission.' },
  { q: 'What is a digital address ID?', a: 'A unique, permanent identifier tied to your property\u2019s exact location — street, house number, and GPS coordinates — with a QR code that resolves to a verified record.' },
  { q: 'How is my tariff band decided?', a: 'Your band is set by the average daily hours of supply your feeder receives, as published by your distribution company under NERC\u2019s Service Based Tariff structure.' },
  { q: 'I was billed on an estimate. What can I do?', a: 'You can dispute an estimated bill from your dashboard once your account is set up. Disputes are logged with a reference number and tracked until resolved.' },
  { q: 'Who can see my records?', a: 'Only you, the field agent assigned to your case, and administrators with a specific reason to access it — every view is written to an audit log.' },
  { q: 'Is there a charge to register?', a: 'Property and address registration is free for citizens. Connection, reconnection, and service fees are billed separately and shown before you pay.' },
];

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="mx-auto max-w-3xl">
      {faqs.map((item, i) => {
        const open = openIndex === i;
        return (
          <div key={item.q} className="border-b border-border">
            <button
              onClick={() => setOpenIndex(open ? null : i)}
              className="flex w-full items-center justify-between gap-4 py-5 text-left"
              aria-expanded={open}
            >
              <span className="font-medium">{item.q}</span>
              <ChevronDown size={18} className={`shrink-0 text-ink-muted transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>
            {open && <p className="pb-5 pr-8 text-sm text-ink-muted">{item.a}</p>}
          </div>
        );
      })}
    </div>
  );
}
