export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading">
      <div className="sk-tiles">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton sk-tile" />
        ))}
      </div>
      <div className="skeleton sk-row" />
    </div>
  );
}
