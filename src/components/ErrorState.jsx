export default function ErrorState({ message, retryText, onRetry }) {
  return (
    <div className="center-state card">
      <span className="error-icon" aria-hidden>⚠️</span>
      <p className="error-text">{message}</p>
      {onRetry && (
        <button type="button" className="btn" onClick={onRetry}>
          {retryText ?? "Retry"}
        </button>
      )}
    </div>
  );
}
