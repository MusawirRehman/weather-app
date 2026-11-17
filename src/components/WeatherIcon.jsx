/**
 * Weather condition icon: real image from the weather API when available,
 * emoji fallback otherwise.
 */
export default function WeatherIcon({ src, emoji, size, className = "" }) {
  if (src) {
    return (
      <img
        src={src}
        alt={emoji}
        loading="lazy"
        className={`wicon ${className}`}
        style={size ? { width: size, height: size } : undefined}
      />
    );
  }
  return (
    <span className={className} aria-hidden style={size ? { fontSize: size } : undefined}>
      {emoji}
    </span>
  );
}
