import { useEffect, useMemo, useRef, useState } from "react";
import { useDebounce } from "../hooks/useDebounce";
import { searchPlaces } from "../api/weatherApi";
import { searchLocal } from "../data/pakistanLocations";

const TYPE_ICONS = { country: "🌍", province: "🗺️", city: "🏙️", district: "📍", place: "🌐" };

/**
 * Search box with grouped autocomplete:
 * Countries -> Provinces -> Cities -> Districts -> Worldwide (API)
 * Supports keyboard navigation (↑ ↓ Enter Esc) and "use my location".
 */
export default function SearchBar({
  onSelect,
  lang,
  t,
  recents,
  onRecent,
  onClearRecents,
  onLocate,
  locating,
  locError,
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [groups, setGroups] = useState([]);
  const [searching, setSearching] = useState(false);
  const [active, setActive] = useState(-1);
  const debounced = useDebounce(query, 250);
  const boxRef = useRef(null);
  const inputRef = useRef(null);

  // Search local dataset + worldwide API as the user types
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const q = debounced.trim();
      if (!q) {
        setGroups([]);
        setSearching(false);
        return;
      }
      setSearching(true);
      const local = searchLocal(q);
      let apiItems = [];
      try {
        apiItems = await searchPlaces(q);
      } catch {
        apiItems = [];
      }
      if (cancelled) return;
      setGroups(
        groupResults(local, apiItems, {
          countries: t.countries,
          provinces: t.provinces,
          cities: t.cities,
          districts: t.districts,
          worldwide: t.worldwide,
        })
      );
      setSearching(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [debounced, t]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => setActive(-1), [groups]);

  const flat = useMemo(() => groups.flatMap((g) => g.items), [groups]);

  const pick = (item) => {
    setQuery("");
    setOpen(false);
    setGroups([]);
    setActive(-1);
    onSelect(item);
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, flat.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, -1));
    } else if (e.key === "Enter") {
      if (active >= 0 && flat[active]) pick(flat[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const showDropdown = open && (searching || groups.length > 0);

  return (
    <div className="search-wrap" ref={boxRef}>
      <div className="search-box">
        <span className="search-icon" aria-hidden>🔎</span>
        <input
          ref={inputRef}
          className="search-input"
          type="text"
          value={query}
          placeholder={t.searchPlaceholder}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          aria-label={t.searchPlaceholder}
          autoComplete="off"
          spellCheck="false"
        />
        {query && (
          <button
            type="button"
            className="search-clear"
            aria-label="Clear search"
            onClick={() => {
              setQuery("");
              setGroups([]);
              inputRef.current?.focus();
            }}
          >
            ✕
          </button>
        )}
        <button
          type="button"
          className="locate-btn"
          title={t.useMyLocation}
          aria-label={t.useMyLocation}
          onClick={onLocate}
          disabled={locating}
        >
          {locating ? "⏳" : "📍"}
        </button>
      </div>

      {showDropdown && (
        <div className="dropdown" role="listbox">
          {searching && groups.length === 0 && <div className="dd-item muted">{t.searching}</div>}
          {!searching && groups.length === 0 && <div className="dd-item muted">{t.noResults}</div>}
          {groups.map((g) => (
            <div className="dd-group" key={g.title}>
              <div className="dd-title">{g.title}</div>
              {g.items.map((item) => {
                const idx = flat.indexOf(item);
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="option"
                    aria-selected={active === idx}
                    className={`dd-item ${active === idx ? "active" : ""}`}
                    onMouseEnter={() => setActive(idx)}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      pick(item);
                    }}
                  >
                    <span className="dd-icon" aria-hidden>{TYPE_ICONS[item.type] ?? "📍"}</span>
                    <span className="dd-text">
                      <span className="dd-name">{lang === "ur" && item.nameUr ? item.nameUr : item.name}</span>
                      {(item.admin1 || item.country) && (
                        <span className="dd-sub">
                          {[item.admin1, item.admin2, item.country].filter(Boolean).join(" • ")}
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {!query && recents.length > 0 && (
        <div className="recents">
          <span className="recents-label">{t.recent}</span>
          {recents.map((r) => (
            <button key={r.key} type="button" className="chip" onClick={() => onRecent(r)}>
              🕘 {r.name}
            </button>
          ))}
          <button type="button" className="chip chip-clear" onClick={onClearRecents}>
            {t.clearRecent}
          </button>
        </div>
      )}

      {locError && <div className="loc-error">{t.locationDenied}</div>}
    </div>
  );
}

/** Merge local Pakistan matches with worldwide API matches, grouped by type */
function groupResults(local, apiItems, titles) {
  const buckets = { country: [], province: [], city: [], district: [] };
  for (const item of local) buckets[item.type]?.push(item);

  const groups = [];
  for (const type of ["country", "province", "city", "district"]) {
    if (buckets[type].length) groups.push({ title: titles[`${type}s`] ?? type, items: buckets[type] });
  }

  const seen = new Set(local.map((l) => l.name.toLowerCase()));
  const rest = apiItems.filter((a) => !seen.has(a.name.toLowerCase()));
  if (rest.length) groups.push({ title: titles.worldwide, items: rest });

  return groups;
}
