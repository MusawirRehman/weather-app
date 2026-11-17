export default function LoadingSpinner({ text }) {
  return (
    <div className="center-state">
      <div className="spinner" aria-hidden />
      {text && <p className="muted">{text}</p>}
    </div>
  );
}
