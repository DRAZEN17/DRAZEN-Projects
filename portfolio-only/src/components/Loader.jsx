export default function Loader() {
  return (
    <div className="fixed inset-0 grid place-items-center bg-bg z-50">
      <div className="flex items-center gap-3">
        <div className="h-3 w-3 rounded-full bg-neon-cyan animate-pulse" />
        <div className="h-3 w-3 rounded-full bg-neon-magenta animate-pulse [animation-delay:120ms]" />
        <div className="h-3 w-3 rounded-full bg-neon-violet animate-pulse [animation-delay:240ms]" />
      </div>
    </div>
  );
}
