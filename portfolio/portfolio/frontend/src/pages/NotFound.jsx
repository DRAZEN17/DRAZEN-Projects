import { Link } from 'react-router-dom';
export default function NotFound() {
  return (
    <section className="section pt-40 text-center">
      <p className="eyebrow">404</p>
      <h1 className="h1 mt-4">Lost in the grid.</h1>
      <Link to="/" className="text-neon-cyan mt-8 inline-block">← Back home</Link>
    </section>
  );
}
