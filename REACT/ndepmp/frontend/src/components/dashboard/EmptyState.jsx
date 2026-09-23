export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-canvas-alt text-ink-muted">
        <Icon size={20} />
      </span>
      <h3 className="mt-4 font-display text-base font-semibold">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-ink-muted">{description}</p>
      {action}
    </div>
  );
}
