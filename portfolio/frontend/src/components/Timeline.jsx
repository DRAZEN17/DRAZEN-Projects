export default function Timeline({ items }) {
  return (
    <ol className="relative border-s border-white/10 ps-8 space-y-10">
      {items.map((it, i) => (
        <li key={i} className="relative">
          <span className="absolute -start-[34px] top-1 grid place-items-center h-6 w-6 rounded-full bg-bg border border-neon-cyan/60 shadow-glow text-xs font-mono">{i + 1}</span>
          <div className="text-xs font-mono text-neon-cyan">{it.period}</div>
          <h4 className="font-display text-xl mt-1">{it.title} <span className="text-muted text-base">· {it.company}</span></h4>
          <p className="text-muted mt-2 max-w-2xl">{it.description}</p>
        </li>
      ))}
    </ol>
  );
}
