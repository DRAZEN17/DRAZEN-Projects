export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-20">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted">
        <div>© {new Date().getFullYear()} — Own your stack.</div>
        <div className="flex items-center gap-6">
          <a href="https://github.com/DRAZEN17/DRAZEN-Projects" target="_blank" rel="noreferrer" className="hover:text-white">GitHub</a>
          <a href="mailto:drazen90sea@gmail.com" className="hover:text-white">Email</a>
        </div>
      </div>
    </footer>
  );
}
