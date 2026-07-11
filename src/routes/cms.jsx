import { useEffect, useMemo, useRef, useState } from "react";
import {
  Plus, Pencil, Trash2, X, Search, RefreshCw, TreePine,
  MapPin, AlertTriangle, Check, Inbox, Loader2,
} from "lucide-react";

/* ------------------------------------------------------------------ *
 * Timber Ledger — Woods inventory CMS
 * Wired to the live MyWoods API.
 * ------------------------------------------------------------------ */

const API = "https://testbackend-fdpd.onrender.com/api/woods";

const TYPES = ["hardwood", "softwood", "engineered", "other"];

/* Map wood colour names → swatches */
const COLOR_MAP = [
  ["dark brown", "#4b2e18"], ["reddish", "#7c3a26"], ["light red", "#b34a3a"],
  ["red", "#8b3a2b"], ["light brown", "#c19a6b"], ["golden", "#c9902e"],
  ["honey", "#cf9b3c"], ["yellow", "#d4b56b"], ["cream", "#e6d8b8"],
  ["white", "#ece2cb"], ["black", "#2a2320"], ["grey", "#8c857c"],
  ["gray", "#8c857c"], ["olive", "#6b7a4b"], ["green", "#5f7a4b"],
  ["pink", "#c98a7a"], ["purple", "#6b4e7a"], ["orange", "#c4702e"],
  ["tan", "#c49a6c"], ["brown", "#8b5a2b"],
];

function resolveColor(name = "") {
  const n = String(name).toLowerCase();
  for (const [key, hex] of COLOR_MAP) if (n.includes(key)) return hex;
  return "#b08d5b";
}

function readableInk(hex) {
  const c = hex.replace("#", "");
  const r = parseInt(c.slice(0, 2), 16), g = parseInt(c.slice(2, 4), 16), b = parseInt(c.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 150 ? "#33291f" : "#f6f1e7";
}

const inr = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 });

const BLANK = { name: "", type: "hardwood", description: "", color: "", density: "", origin: "", pricePerUnit: "", available: true };

const SEED = [
  { _id: "s1", name: "Teak", type: "hardwood", description: "Prized hardwood, naturally oily and weather-resistant.", color: "Golden brown", density: 660, origin: "Kerala, India", pricePerUnit: 3200, available: true },
  { _id: "s2", name: "Sheesham", type: "hardwood", description: "Indian rosewood with rich, interlocked grain.", color: "Dark brown", density: 780, origin: "Punjab, India", pricePerUnit: 2100, available: true },
  { _id: "s3", name: "Mango", type: "hardwood", description: "Sustainable, fast-growing wood with warm tones.", color: "Light brown", density: 550, origin: "Uttar Pradesh, India", pricePerUnit: 950, available: false },
  { _id: "s4", name: "Deodar", type: "softwood", description: "Aromatic Himalayan cedar, rot-resistant softwood.", color: "Honey", density: 510, origin: "Himachal Pradesh, India", pricePerUnit: 1250, available: true },
  { _id: "s5", name: "Walnut", type: "hardwood", description: "Fine-grained, luxurious wood for furniture and veneer.", color: "Dark brown", density: 640, origin: "Jammu & Kashmir, India", pricePerUnit: 4100, available: true },
];

const normalize = (r, i = 0) => ({ ...BLANK, ...r, _id: r._id ?? r.id ?? null, id: r._id ?? r.id ?? `row-${i}` });

const toPayload = (d) => ({
  name: d.name.trim(),
  type: d.type || "hardwood",
  origin: d.origin.trim(),
  color: d.color.trim(),
  density: d.density === "" ? null : Number(d.density),
  pricePerUnit: d.pricePerUnit === "" ? null : Number(d.pricePerUnit),
  description: d.description.trim(),
  available: !!d.available,
});

/* --------------------------- API Helpers --------------------------- */
async function apiList() {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 6000);
  try {
    const res = await fetch(API, { signal: ctrl.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally { clearTimeout(t); }
}

async function apiCreate(payload) {
  const res = await fetch(API, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function apiUpdate(id, payload) {
  const res = await fetch(`${API}/${id}`, {
    method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json().catch(() => ({}));
}

async function apiDelete(id) {
  const res = await fetch(`${API}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}

/* ============================ Main CMS Component ============================ */
export default function CMS() {
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | live | sample
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState(null);         // {mode, item}
  const [toast, setToast] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const showToast = (msg, tone = "ok") => {
    setToast({ msg, tone });
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast(null), 2800);
  };

  const load = async () => {
    setStatus("loading");
    try {
      const json = await apiList();
      if (Array.isArray(json)) {
        setRows(json.map(normalize));
        setStatus("live");
      } else {
        throw new Error("bad shape");
      }
    } catch (err) {
      console.error("API Error - falling back to seeds:", err);
      setRows(SEED.map(normalize));
      setStatus("sample");
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      [r.name, r.origin, r.color, r.type, r.description].some((v) => String(v ?? "").toLowerCase().includes(q))
    );
  }, [rows, query]);

  const handleSave = async (draft) => {
    const payload = toPayload(draft);
    const isEdit = !!draft._id;
    try {
      if (isEdit) {
        await apiUpdate(draft._id, payload);
        setRows((prev) => prev.map((r) => (r._id === draft._id ? { ...draft, ...payload } : r)));
        showToast(`Updated “${payload.name}”`);
      } else {
        const created = await apiCreate(payload);
        const row = created && created._id ? normalize(created) : normalize({ ...payload, _id: `local-${Date.now()}` });
        setRows((prev) => [row, ...prev]);
        showToast(`Added “${payload.name}”`);
      }
    } catch (err) {
      if (isEdit) {
        setRows((prev) => prev.map((r) => (r._id === draft._id ? normalize({ ...r, ...payload }) : r)));
      } else {
        setRows((prev) => [normalize({ ...payload, _id: `local-${Date.now()}` }), ...prev]);
      }
      showToast("API Offline — saved locally", "warn");
    } finally {
      setModal(null);
    }
  };

  const handleDelete = async (item) => {
    setDeletingId(item._id);
    try {
      if (item._id && !String(item._id).startsWith("local-") && !String(item._id).startsWith("s")) {
        await apiDelete(item._id);
      }
      setRows((prev) => prev.filter((r) => r._id !== item._id));
      showToast(`Removed “${item.name}”`, "danger");
    } catch {
      setRows((prev) => prev.filter((r) => r._id !== item._id));
      showToast("API Offline — removed locally", "warn");
    } finally {
      setDeletingId(null);
      setModal(null);
    }
  };

  return (
    <div className="tl-app">
      <style>{CSS}</style>

      {/* Masthead */}
      <header className="tl-mast">
        <div className="tl-mast-in">
          <div className="tl-brand">
            <span className="tl-mark"><TreePine size={20} strokeWidth={1.6} /></span>
            <div>
              <h1 className="tl-word">Timber Ledger</h1>
              <p className="tl-sub">CMS Inventory Control</p>
            </div>
          </div>
          <div className="tl-mast-meta">
            <StatusPill status={status} />
            <span className="tl-count">{rows.length} <em>species</em></span>
          </div>
        </div>
        <div className="tl-grain" aria-hidden />
      </header>

      {/* Toolbar */}
      <div className="tl-wrap">
        <div className="tl-toolbar">
          <div className="tl-search">
            <Search size={16} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, origin, type, color…"
              aria-label="Search woods"
            />
            {query && <button className="tl-clear" onClick={() => setQuery("")} aria-label="Clear search"><X size={14} /></button>}
          </div>
          <div className="tl-tools-right">
            <button className="tl-ghost" onClick={load} title="Reload from API">
              <RefreshCw size={15} className={status === "loading" ? "tl-spin" : ""} /> Refresh
            </button>
            <button className="tl-primary" onClick={() => setModal({ mode: "add", item: { ...BLANK } })}>
              <Plus size={16} /> Add Wood Species
            </button>
          </div>
        </div>

        {/* Table Card */}
        <div className="tl-card">
          <div className="tl-scroll">
            <table className="tl-table">
              <thead>
                <tr>
                  <th className="tl-col-name">Name</th>
                  <th>Type</th>
                  <th>Colour</th>
                  <th className="tl-num">Density <span className="tl-unit">kg/m³</span></th>
                  <th>Origin</th>
                  <th className="tl-num">Price per unit</th>
                  <th>Stock</th>
                  <th className="tl-actions-head">Actions</th>
                </tr>
              </thead>
              <tbody>
                {status === "loading" && <SkeletonRows />}

                {status !== "loading" && filtered.map((item) => {
                  const hex = resolveColor(item.color);
                  return (
                    <tr key={item.id} className={deletingId === item._id ? "tl-row-leaving" : ""}>
                      <td className="tl-col-name">
                        <span className="tl-name">{item.name}</span>
                        {item.description && <span className="tl-name-sub">{item.description}</span>}
                      </td>
                      <td><TypeChip type={item.type} /></td>
                      <td>
                        <span className="tl-swatch" style={{ background: hex, color: readableInk(hex) }}>
                          <span className="tl-dot" style={{ background: hex }} />
                          {item.color || "—"}
                        </span>
                      </td>
                      <td className="tl-num tl-fig">{item.density !== "" && item.density != null ? item.density : "—"}</td>
                      <td className="tl-origin"><MapPin size={13} /> {item.origin || <span className="tl-empty">—</span>}</td>
                      <td className="tl-num tl-fig tl-price">
                        {item.pricePerUnit !== "" && item.pricePerUnit != null
                          ? <><span className="tl-rupee">₹</span>{inr.format(item.pricePerUnit)}</>
                          : "—"}
                      </td>
                      <td><StockBadge available={item.available} /></td>
                      <td>
                        <div className="tl-row-actions">
                          <button className="tl-edit" onClick={() => setModal({ mode: "edit", item: { ...item } })}>
                            <Pencil size={14} /> Edit
                          </button>
                          <button className="tl-delete" onClick={() => setModal({ mode: "delete", item })} disabled={deletingId === item._id}>
                            {deletingId === item._id ? <Loader2 size={14} className="tl-spin" /> : <Trash2 size={14} />} Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {status !== "loading" && filtered.length === 0 && (
                  <tr>
                    <td colSpan={8}>
                      <div className="tl-emptystate">
                        <Inbox size={30} strokeWidth={1.4} />
                        {query
                          ? <><p>No woods match “{query}”.</p><button className="tl-linkbtn" onClick={() => setQuery("")}>Clear search</button></>
                          : <><p>The inventory is empty.</p><button className="tl-linkbtn" onClick={() => setModal({ mode: "add", item: { ...BLANK } })}>Add the first wood species</button></>}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <p className="tl-foot">
          {status === "sample" && "Showing sample local data because the live backend API was offline or taking too long. Click Refresh to reload."}
          {status === "live" && "Successfully connected to live backend API. Changes write back directly."}
        </p>
      </div>

      {/* Modals */}
      {modal?.mode === "add" && <FormModal title="Add Wood Species" submitLabel="Add Species" initial={modal.item} onClose={() => setModal(null)} onSubmit={handleSave} />}
      {modal?.mode === "edit" && <FormModal title="Edit Wood Species" submitLabel="Save Changes" initial={modal.item} onClose={() => setModal(null)} onSubmit={handleSave} />}
      {modal?.mode === "delete" && <DeleteModal item={modal.item} busy={deletingId === modal.item._id} onClose={() => setModal(null)} onConfirm={() => handleDelete(modal.item)} />}

      {/* Toast notifications */}
      {toast && (
        <div className={`tl-toast ${toast.tone === "danger" ? "tl-toast-danger" : ""} ${toast.tone === "warn" ? "tl-toast-warn" : ""}`} role="status">
          {toast.tone === "danger" ? <Trash2 size={15} /> : toast.tone === "warn" ? <AlertTriangle size={15} /> : <Check size={15} />}
          {toast.msg}
        </div>
      )}
    </div>
  );
}


/* ---------------------------- Subcomponents ---------------------------- */
function TypeChip({ type = "" }) {
  const t = String(type).toLowerCase() || "—";
  return <span className={`tl-type tl-type-${TYPES.includes(t) ? t : "other"}`}>{t}</span>;
}

function StockBadge({ available }) {
  return (
    <span className={`tl-stock ${available ? "tl-stock-in" : "tl-stock-out"}`}>
      <i /> {available ? "Available" : "Out of Stock"}
    </span>
  );
}

function StatusPill({ status }) {
  const map = {
    loading: ["Loading Data...", "tl-pill-load"],
    live: ["Live Database", "tl-pill-live"],
    sample: ["Offline Preview", "tl-pill-sample"],
  };
  const [label, cls] = map[status] ?? map.sample;
  return <span className={`tl-pill ${cls}`}><i /> {label}</span>;
}

function SkeletonRows() {
  return Array.from({ length: 5 }).map((_, i) => (
    <tr key={i}>
      {Array.from({ length: 8 }).map((__, j) => (
        <td key={j}><span className="tl-skel" style={{ width: `${40 + ((i + j) % 5) * 12}%` }} /></td>
      ))}
    </tr>
  ));
}

function FormModal({ title, submitLabel, initial, onClose, onSubmit }) {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const firstRef = useRef(null);

  useEffect(() => { firstRef.current?.focus(); }, []);
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && !submitting && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, submitting]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const err = {};
    if (!form.name.trim()) err.name = "Name is required.";
    if (form.density !== "" && isNaN(Number(form.density))) err.density = "Density must be a valid number.";
    if (form.pricePerUnit !== "" && isNaN(Number(form.pricePerUnit))) err.pricePerUnit = "Price must be a valid number.";
    else if (Number(form.pricePerUnit) < 0) err.pricePerUnit = "Price cannot be negative.";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const submit = async () => {
    if (submitting || !validate()) return;
    setSubmitting(true);
    await onSubmit(form);
  };

  const preview = resolveColor(form.color);

  return (
    <Overlay onClose={() => !submitting && onClose()}>
      <div className="tl-modal" role="dialog" aria-modal="true" aria-label={title}>
        <div className="tl-modal-head">
          <h2>{title}</h2>
          <button className="tl-x" onClick={onClose} disabled={submitting} aria-label="Close"><X size={18} /></button>
        </div>

        <div className="tl-modal-body">
          <Field label="Species Name" error={errors.name}>
            <input ref={firstRef} value={form.name} onChange={set("name")} placeholder="e.g. White Oak" />
          </Field>

          <div className="tl-grid2">
            <Field label="Wood Category">
              <select value={form.type} onChange={set("type")}>
                {TYPES.map((t) => <option key={t} value={t}>{t[0].toUpperCase() + t.slice(1)}</option>)}
              </select>
            </Field>
            <Field label="Stock Status">
              <button
                type="button"
                className={`tl-switch ${form.available ? "tl-switch-on" : ""}`}
                onClick={() => setForm((f) => ({ ...f, available: !f.available }))}
                aria-pressed={form.available}
              >
                <span className="tl-switch-knob" />
                <span className="tl-switch-label">{form.available ? "In stock" : "Out of stock"}</span>
              </button>
            </Field>
          </div>

          <Field label="Description">
            <textarea rows={2} value={form.description} onChange={set("description")} placeholder="Short description of properties, grain, and uses..." />
          </Field>

          <div className="tl-grid2">
            <Field label="Material Color Swatch">
              <div className="tl-color-input">
                <span className="tl-dot tl-dot-lg" style={{ background: preview }} />
                <input value={form.color} onChange={set("color")} placeholder="e.g. Reddish brown" />
              </div>
            </Field>
            <Field label="Density (kg/m³)" error={errors.density}>
              <input value={form.density} onChange={set("density")} inputMode="decimal" placeholder="e.g. 740" />
            </Field>
          </div>

          <div className="tl-grid2">
            <Field label="Origin Region">
              <input value={form.origin} onChange={set("origin")} placeholder="e.g. Kashmir, India" />
            </Field>
            <Field label="Price per Unit (₹)" error={errors.pricePerUnit}>
              <input value={form.pricePerUnit} onChange={set("pricePerUnit")} inputMode="decimal" placeholder="e.g. 1850" />
            </Field>
          </div>
        </div>

        <div className="tl-modal-foot">
          <button className="tl-ghost" onClick={onClose} disabled={submitting}>Cancel</button>
          <button className="tl-primary" onClick={submit} disabled={submitting}>
            {submitting ? <><Loader2 size={16} className="tl-spin" /> Saving...</> : submitLabel}
          </button>
        </div>
      </div>
    </Overlay>
  );
}

function Field({ label, error, children }) {
  return (
    <label className={`tl-field ${error ? "tl-field-err" : ""}`}>
      <span className="tl-label">{label}</span>
      {children}
      {error && <span className="tl-err">{error}</span>}
    </label>
  );
}

function DeleteModal({ item, busy, onClose, onConfirm }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && !busy && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, busy]);

  return (
    <Overlay onClose={() => !busy && onClose()}>
      <div className="tl-modal tl-modal-sm" role="alertdialog" aria-modal="true" aria-label="Confirm delete">
        <div className="tl-danger-icon"><AlertTriangle size={22} /></div>
        <h2 className="tl-danger-title">Delete Species?</h2>
        <p className="tl-danger-text">
          <strong>{item.name}</strong> will be permanently removed from the ledger. This action is irreversible.
        </p>
        <div className="tl-modal-foot tl-center">
          <button className="tl-ghost" onClick={onClose} disabled={busy}>Keep it</button>
          <button className="tl-delete tl-delete-solid" onClick={onConfirm} disabled={busy}>
            {busy ? <><Loader2 size={15} className="tl-spin" /> Deleting...</> : <><Trash2 size={15} /> Delete</>}
          </button>
        </div>
      </div>
    </Overlay>
  );
}

function Overlay({ onClose, children }) {
  return (
    <div className="tl-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      {children}
    </div>
  );
}

/* ================================ CMS Dedicated CSS ================================ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,900&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap');

.tl-app {
  --bark: #0a1b10; 
  --paper: #f5f1e8; 
  --card: #ffffff; 
  --ink: #1a261e;
  --muted: #607567; 
  --line: #e5ddd0; 
  --moss: #1b4327; 
  --moss-d: #0f2a18;
  --amber: #c69248; 
  --brick: #a43a2b; 
  --brick-d: #8c2a1c; 
  --tan: #fbfaf8;
  font-family: 'Inter', system-ui, sans-serif; 
  color: var(--ink);
  background: var(--paper);
  background-image: radial-gradient(circle at 12% -10%, #edf4ef 0%, transparent 40%);
  min-height: 80vh; 
  padding-bottom: 64px; 
  -webkit-font-smoothing: antialiased;
}
.tl-app * { box-sizing: border-box; }

/* Masthead */
.tl-mast { position: relative; background: var(--bark); color: #f5f1e8; overflow: hidden; }
.tl-mast-in { max-width: 1160px; margin: 0 auto; padding: 24px 28px;
  display: flex; align-items: center; justify-content: space-between; gap: 16px; position: relative; z-index: 2; }
.tl-brand { display: flex; align-items: center; gap: 14px; }
.tl-mark { width: 42px; height: 42px; border-radius: 12px; display: grid; place-items: center;
  color: var(--amber); background: rgba(198, 146, 72, 0.12); border: 1px solid rgba(198, 146, 72, 0.28); }
.tl-word { font-family: 'Fraunces', serif; font-weight: 600; font-size: 26px; line-height: 1; margin: 0; color: #ffffff; }
.tl-sub { margin: 6px 0 0; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: var(--amber); }
.tl-mast-meta { display: flex; align-items: center; gap: 16px; }
.tl-count { font-family: 'JetBrains Mono', monospace; font-size: 15px; color: #ffffff; white-space: nowrap; }
.tl-count em { font-style: normal; color: var(--amber); font-size: 12px; margin-left: 3px; }
.tl-grain { position: absolute; inset: 0; z-index: 1; opacity: 0.4;
  background: repeating-linear-gradient(92deg, rgba(255,255,255,.01) 0 2px, transparent 2px 7px),
             radial-gradient(120% 60% at 80% 120%, rgba(198,146,72,.08), transparent 60%); }

/* Pills */
.tl-pill { display: inline-flex; align-items: center; gap: 6px; font-size: 11.5px; font-weight: 600; padding: 4px 12px; border-radius: 999px; }
.tl-pill i { width: 6px; height: 6px; border-radius: 50%; display: inline-block; }
.tl-pill-live { background: rgba(45, 107, 65, 0.16); color: #8fd6a4; } .tl-pill-live i { background: #52b774; }
.tl-pill-sample { background: rgba(198, 146, 72, 0.14); color: var(--amber); } .tl-pill-sample i { background: var(--amber); }
.tl-pill-load { background: rgba(255,255,255,.1); color: #cbbfa8; } .tl-pill-load i { background: #cbbfa8; animation: tl-pulse 1s infinite; }
@keyframes tl-pulse { 50% { opacity: .3; } }

/* Wrap + Toolbar */
.tl-wrap { max-width: 1160px; margin: 0 auto; padding: 0 28px; }
.tl-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 14px; flex-wrap: wrap; margin: 30px 0 20px; }
.tl-search { position: relative; display: flex; align-items: center; gap: 8px; flex: 1; min-width: 220px; max-width: 420px;
  background: var(--card); border: 1px solid var(--line); border-radius: 12px; padding: 0 12px; height: 44px; color: var(--muted); box-shadow: 0 1px 3px rgba(10,27,16,.04); }
.tl-search input { border: 0; outline: 0; background: transparent; flex: 1; font-size: 14px; color: var(--ink); font-family: inherit; }
.tl-search input::placeholder { color: #889a8f; }
.tl-search:focus-within { border-color: var(--amber); box-shadow: 0 0 0 3px rgba(198,146,72,.15); }
.tl-clear { border: 0; background: #e5ddd0; color: var(--muted); width: 20px; height: 20px; border-radius: 6px; display: grid; place-items: center; cursor: pointer; }
.tl-tools-right { display: flex; align-items: center; gap: 10px; }

/* Buttons */
.tl-primary, .tl-ghost, .tl-edit, .tl-delete, .tl-linkbtn { font-family: inherit; cursor: pointer; display: inline-flex; align-items: center; gap: 7px;
  font-weight: 600; font-size: 14px; border-radius: 10px; border: 1px solid transparent; transition: all .15s ease; }
.tl-primary { background: var(--moss); color: #fff; padding: 0 20px; height: 44px; box-shadow: 0 4px 12px rgba(27,67,39,.18); }
.tl-primary:hover { background: var(--moss-d); transform: translateY(-1px); }
.tl-ghost { background: var(--card); color: var(--ink); border-color: var(--line); padding: 0 16px; height: 44px; }
.tl-ghost:hover { background: var(--tan); border-color: #dcd0bc; }
button:disabled { opacity: .6; cursor: not-allowed; transform: none !important; }

/* Card + Table */
.tl-card { background: var(--card); border: 1px solid var(--line); border-radius: 16px; overflow: hidden; box-shadow: 0 12px 36px -12px rgba(10,27,16,.1); }
.tl-scroll { overflow-x: auto; }
.tl-table { width: 100%; border-collapse: collapse; min-width: 1000px; font-size: 14px; }
.tl-table thead th { background: #faf8f5; color: var(--muted); text-align: left; font-weight: 600; font-size: 11px; letter-spacing: .08em; text-transform: uppercase;
  padding: 16px 20px; border-bottom: 1px solid var(--line); white-space: nowrap; }
.tl-table th.tl-num, .tl-table td.tl-num { text-align: right; }
.tl-unit { display: block; font-size: 9.5px; color: #889a8f; font-weight: 500; letter-spacing: .05em; margin-top: 1px; }
.tl-actions-head { text-align: center; }
.tl-table tbody td { padding: 16px 20px; border-bottom: 1px solid #f3ede2; vertical-align: middle; color: #2e3e34; }
.tl-table tbody tr { transition: background .18s ease, opacity .25s ease; }
.tl-table tbody tr:hover { background: #faf9f6; }
.tl-table tbody tr:hover td.tl-col-name { box-shadow: inset 3px 0 0 var(--amber); }
.tl-table tbody tr:last-child td { border-bottom: 0; }
.tl-row-leaving { opacity: .4; }
.tl-name { font-weight: 600; color: var(--ink); display: block; }
.tl-name-sub { display: block; font-size: 12.5px; color: var(--muted); margin-top: 2px; max-width: 260px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.tl-empty { color: #b2c2b7; }
.tl-fig { font-family: 'JetBrains Mono', monospace; font-size: 13.5px; color: #1e2c22; font-variant-numeric: tabular-nums; }
.tl-price { font-weight: 600; } .tl-rupee { color: var(--muted); margin-right: 2px; font-weight: 500; }
.tl-origin { white-space: nowrap; color: #2e3e34; } .tl-origin svg { color: var(--amber); vertical-align: -2px; margin-right: 4px; }

/* Colour Swatch Chip */
.tl-swatch { display: inline-flex; align-items: center; gap: 7px; padding: 4px 12px 4px 8px; border-radius: 999px; font-size: 12px; font-weight: 600;
  border: 1px solid rgba(0,0,0,.06); box-shadow: inset 0 0 0 1px rgba(255,255,255,.15); white-space: nowrap; }
.tl-dot { width: 12px; height: 12px; border-radius: 50%; box-shadow: 0 0 0 1px rgba(0,0,0,.12) inset, 0 1px 1px rgba(0,0,0,.15); flex: none; }
.tl-dot-lg { width: 18px; height: 18px; }

/* Type Chip */
.tl-type { display: inline-block; padding: 3px 10px; border-radius: 7px; font-size: 11.5px; font-weight: 600; text-transform: capitalize; letter-spacing: .02em; border: 1px solid transparent; }
.tl-type-hardwood { background: #fdf5ea; color: #a5742e; border-color: #f7e6cf; }
.tl-type-softwood { background: #edf4ef; color: var(--forest-light); border-color: #d1e5d7; }
.tl-type-engineered { background: #eef4f8; color: #3e5c86; border-color: #d3e2f0; }
.tl-type-other { background: #f5f1e8; color: #6a756b; border-color: #e5ddd0; }

/* Stock Badge */
.tl-stock { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600; padding: 3px 10px; border-radius: 999px; white-space: nowrap; }
.tl-stock i { width: 6px; height: 6px; border-radius: 50%; }
.tl-stock-in { background: #edf4ef; color: var(--forest-light); } .tl-stock-in i { background: #3c9258; }
.tl-stock-out { background: #fbf0ee; color: var(--brick); } .tl-stock-out i { background: var(--brick); }

/* Row Actions */
.tl-row-actions { display: flex; align-items: center; justify-content: center; gap: 8px; }
.tl-edit { background: var(--card); color: #2e3e34; border-color: var(--line); padding: 7px 12px; }
.tl-edit:hover { background: var(--tan); border-color: #dcd0bc; transform: translateY(-1px); }
.tl-delete { background: #fbf0ee; color: var(--brick); border-color: #f0d5d0; padding: 7px 12px; }
.tl-delete:hover { background: #f7e4e0; transform: translateY(-1px); }
.tl-delete-solid { background: var(--brick); color: #fff; border-color: transparent; padding: 0 20px; height: 44px; }
.tl-delete-solid:hover { background: var(--brick-d); }

/* Empty State */
.tl-emptystate { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 52px 20px; color: var(--muted); text-align: center; }
.tl-emptystate svg { color: #b2c2b7; }
.tl-emptystate p { margin: 0; font-size: 15px; }
.tl-linkbtn { background: none; border: 0; color: var(--forest-light); font-weight: 600; padding: 0; font-size: 14px; cursor: pointer; text-decoration: underline; }

/* Skeleton */
.tl-skel { display: block; height: 12px; border-radius: 6px; background: linear-gradient(90deg,#efe8d9,#f7f2e8,#efe8d9); background-size: 200% 100%; animation: tl-shimmer 1.3s infinite; }
@keyframes tl-shimmer { to { background-position: -200% 0; } }

.tl-foot { max-width: 1160px; margin: 16px 2px 0; font-size: 13px; color: var(--muted); }

/* Overlay + Modal */
.tl-overlay { position: fixed; inset: 0; background: rgba(10,27,16,.55); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; padding: 20px; z-index: 50; animation: tl-fade .18s ease; }
@keyframes tl-fade { from { opacity: 0; } }
.tl-modal { background: var(--card); width: min(560px,100%); border-radius: 18px; overflow: hidden; box-shadow: 0 30px 70px -20px rgba(10,27,16,.5); border: 1px solid var(--line); animation: tl-pop .2s cubic-bezier(.2,.9,.3,1.2); }
.tl-modal-sm { width: min(420px,100%); padding: 28px; text-align: center; }
@keyframes tl-pop { from { transform: translateY(10px) scale(.97); opacity: 0; } }
.tl-modal-head { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; border-bottom: 1px solid var(--line); background: #faf8f5; }
.tl-modal-head h2 { margin: 0; font-family: 'Fraunces', serif; font-weight: 600; font-size: 20px; color: var(--moss-d); }
.tl-x { border: 0; background: #e5ddd0; color: var(--muted); width: 32px; height: 32px; border-radius: 9px; display: grid; place-items: center; cursor: pointer; }
.tl-x:hover { background: #dcd0bc; }
.tl-modal-body { padding: 24px; display: flex; flex-direction: column; gap: 16px; max-height: min(66vh,560px); overflow-y: auto; }
.tl-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.tl-field { display: flex; flex-direction: column; gap: 6px; }
.tl-label { font-size: 13px; font-weight: 600; color: #475a4d; }
.tl-field input, .tl-field textarea, .tl-field select { font-family: inherit; font-size: 14.5px; color: var(--ink); border: 1px solid var(--line); background: var(--tan); border-radius: 10px; padding: 10px 12px; outline: 0; width: 100%; resize: vertical; transition: all 0.2s; }
.tl-field input:focus, .tl-field textarea:focus, .tl-field select:focus { border-color: var(--amber); box-shadow: 0 0 0 3px rgba(198,146,72,.15); background: #fff; }
.tl-field-err input, .tl-field-err textarea { border-color: var(--brick); box-shadow: 0 0 0 3px rgba(164,58,43,.12); }
.tl-err { font-size: 12px; color: var(--brick); font-weight: 500; }
.tl-color-input { display: flex; align-items: center; gap: 9px; border: 1px solid var(--line); background: var(--tan); border-radius: 10px; padding: 0 12px; }
.tl-color-input:focus-within { border-color: var(--amber); box-shadow: 0 0 0 3px rgba(198,146,72,.15); background: #ffffff; }
.tl-color-input input { border: 0; background: transparent; box-shadow: none !important; padding: 10px 0; }

/* Availability Switch */
.tl-switch { display: flex; align-items: center; gap: 10px; border: 1px solid var(--line); background: var(--tan); border-radius: 10px; padding: 9px 12px; cursor: pointer; font-family: inherit; font-size: 13.5px; font-weight: 600; color: #475a4d; width: 100%; transition: .18s; }
.tl-switch-knob { position: relative; width: 34px; height: 20px; border-radius: 999px; background: #c5d2c9; flex: none; transition: .18s; }
.tl-switch-knob::after { content: ""; position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; border-radius: 50%; background: #fff; box-shadow: 0 1px 2px rgba(10,27,16,.25); transition: .18s; }
.tl-switch-on { border-color: #d1e5d7; background: #edf4ef; color: var(--forest-light); }
.tl-switch-on .tl-switch-knob { background: var(--forest-light); }
.tl-switch-on .tl-switch-knob::after { left: 16px; }

.tl-modal-foot { display: flex; justify-content: flex-end; gap: 10px; padding: 18px 24px; border-top: 1px solid var(--line); background: #faf8f5; }
.tl-modal-foot.tl-center { justify-content: center; background: transparent; border: 0; padding: 8px 0 0; }

/* Delete Modal */
.tl-danger-icon { width: 54px; height: 54px; border-radius: 14px; margin: 0 auto 16px; display: grid; place-items: center; background: #fbf0ee; color: var(--brick); }
.tl-danger-title { margin: 0 0 8px; font-family: 'Fraunces', serif; font-weight: 600; font-size: 22px; color: var(--moss-d); }
.tl-danger-text { margin: 0; color: var(--muted); font-size: 14.5px; line-height: 1.55; }
.tl-danger-text strong { color: var(--ink); }

/* Toast */
.tl-toast { position: fixed; left: 50%; bottom: 26px; transform: translateX(-50%); background: var(--bark); color: #ffffff; padding: 12px 20px; border-radius: 12px; font-size: 14px; font-weight: 600;
  display: flex; align-items: center; gap: 9px; box-shadow: 0 16px 40px -12px rgba(10,27,16,.5); z-index: 60; animation: tl-toast .25s ease; }
.tl-toast svg { color: #8fd6a4; }
.tl-toast-danger svg { color: #f4bebe; }
.tl-toast-warn svg { color: var(--amber); }
@keyframes tl-toast { from { transform: translate(-50%,16px); opacity: 0; } }

.tl-spin { animation: tl-rot 1s linear infinite; }
@keyframes tl-rot { to { transform: rotate(360deg); } }

@media (max-width: 640px) {
  .tl-mast-in { padding: 18px; flex-wrap: wrap; }
  .tl-wrap { padding: 0 16px; }
  .tl-word { font-size: 22px; }
  .tl-grid2 { grid-template-columns: 1fr; }
  .tl-toolbar { margin: 20px 0 14px; }
}
@media (prefers-reduced-motion: reduce) { .tl-app * { animation: none !important; transition: none !important; } }
`;
