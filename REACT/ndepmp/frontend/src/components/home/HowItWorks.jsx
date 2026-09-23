const steps = [
  { title: 'Create your account', text: 'Sign up and verify your email address.' },
  { title: 'Submit the property', text: 'Add the location, ownership documents, and photographs of the building.' },
  { title: 'Officer verification', text: 'A field agent reviews your submission and confirms the details on site.' },
  { title: 'Receive your IDs', text: 'Your certificate, digital address, and meter linkage are issued.' },
];

export function HowItWorks() {
  return (
    <section className="bg-canvas-alt py-20">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="font-display text-3xl font-semibold sm:text-4xl">How registration works</h2>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <div key={step.title}>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white">
                {i + 1}
              </span>
              <h3 className="mt-4 font-display text-base font-semibold">{step.title}</h3>
              <p className="mt-1.5 text-sm text-ink-muted">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
