export const KNOWLEDGE_ARTICLES = [
  {
    slug: 'how-registration-works',
    title: 'How property registration works',
    category: 'Getting started',
    summary: 'What happens between submitting your property and getting a certificate.',
    body: 'Submit your property details, ownership documents, and photos. A field agent visits to confirm the details in person, then an administrator reviews the submission. Once approved, you receive a digital address ID, a QR-coded certificate, and can link an electricity account.',
  },
  {
    slug: 'prepaid-vs-postpaid',
    title: 'Prepaid vs. postpaid meters',
    category: 'Electricity',
    summary: 'The practical differences, and how to choose when linking a meter.',
    body: 'Prepaid meters are topped up in advance and cut off automatically when the balance runs out. Postpaid meters bill you after usage based on a monthly reading or estimate. Both are supported when you link a meter to an approved property.',
  },
  {
    slug: 'understanding-tariff-bands',
    title: 'Understanding tariff bands',
    category: 'Billing',
    summary: 'Why your rate depends on hours of supply, not just consumption.',
    body: "Nigeria's Service Based Tariff structure groups feeders into Bands A through E by the minimum daily hours of supply they're guaranteed. Higher bands guarantee more hours and are billed at a higher rate per kWh. Your band is set by your distribution company, not by NDEPMP.",
  },
  {
    slug: 'disputing-an-estimated-bill',
    title: 'Disputing an estimated bill',
    category: 'Billing',
    summary: 'What to do if a bill looks off.',
    body: 'If your meter wasn\u2019t read for a billing cycle, you may receive an estimated bill. You can flag this from your Bills page once the dispute flow is connected to a real billing backend \u2014 for now, file a "Wrong billing" complaint with your account details and we\u2019ll track it.',
  },
  {
    slug: 'what-is-a-digital-address-id',
    title: 'What is a digital address ID?',
    category: 'Getting started',
    summary: 'The unique identifier every approved property receives.',
    body: 'Every approved property gets a permanent address ID tied to its exact street, house number, and GPS coordinates, plus a QR code that resolves to the verified record. It\u2019s designed to replace vague, hard-to-navigate directions with something any agency or utility can check instantly.',
  },
];

export const UPDATES = [
  { id: 1, category: 'announcement', title: 'NDEPMP demo launched', date: '2026-08-01', body: 'This portfolio build is now feature-complete on the frontend, running entirely on mock data in your browser.' },
  { id: 2, category: 'maintenance', title: 'Scheduled maintenance window', date: '2026-08-15', body: 'A maintenance window is planned for late August while the backend phase begins. The System Settings toggle simulates this banner.' },
  { id: 3, category: 'outage', title: 'Sample outage notice \u2014 Ikeja axis', date: '2026-07-28', body: 'Example of how a reported outage would appear here once tied to real complaint data from a distribution company.' },
  { id: 4, category: 'news', title: 'Service Based Tariff bands explained', date: '2026-07-20', body: 'See the Knowledge Base for a plain-language walkthrough of how tariff bands A\u2013E work.' },
];
