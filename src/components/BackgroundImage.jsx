import { useEffect, useState } from "react";

/**
 * Full-screen background: weather-themed gradient + related photo.
 * Tries each photo in order; falls back to a pure gradient if all fail.
 */
export default function BackgroundImage({ scene }) {
  const gradient = scene?.gradient ?? "linear-gradient(135deg,#0f2027,#203a43,#2c5364)";
  const images = scene?.images ?? [];
  const [idx, setIdx] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setIdx(0);
    setLoaded(false);
    setFailed(false);
  }, [scene]);

  const src = images.length > 0 && !failed ? images[idx] : null;

  return (
    <div className="bg" style={{ background: gradient }}>
      {src && (
        <img
          key={src}
          src={src}
          alt=""
          aria-hidden
          className={`bg-img ${loaded ? "show" : ""}`}
          onLoad={() => setLoaded(true)}
          onError={() => {
            if (idx < images.length - 1) {
              setIdx((i) => i + 1);
              setLoaded(false);
            } else {
              setFailed(true);
            }
          }}
        />
      )}
      <div className="bg-overlay" />
    </div>
  );
}
