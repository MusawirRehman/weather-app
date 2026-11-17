/** Interactive OpenStreetMap card centered on the searched place */
export default function MapCard({ place, t }) {
  if (!place?.lat || !place?.lon) return null;

  const bbox = `${place.lon - 1.5},${place.lat - 1},${place.lon + 1.5},${place.lat + 1}`;
  const embed = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${place.lat},${place.lon}`;
  const full = `https://www.openstreetmap.org/?mlat=${place.lat}&mlon=${place.lon}#map=10/${place.lat}/${place.lon}`;

  return (
    <section id="map" className="card fade-up">
      <h2 className="card-title">{t.map}</h2>
      <iframe
        title={t.map}
        className="map-frame"
        src={embed}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <a
        className="map-link"
        href={full}
        target="_blank"
        rel="noreferrer"
      >
        {t.openMap} ↗
      </a>
    </section>
  );
}
