import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="boot-error">
      <h1>404</h1>
      <p>That page isn&rsquo;t part of the console.</p>
      <Link className="btn" href="/console/operations">
        Go to Operations
      </Link>
    </div>
  );
}
