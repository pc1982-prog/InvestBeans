import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/controllers/AuthContext';
import { useTheme } from '@/controllers/Themecontext';
import {
  TrendingUp, TrendingDown, Calendar, Users, Building2,
  CheckCircle, Clock, AlertCircle, ArrowRight, Star, Target,
  Award, Shield, Zap, BarChart3, FileText, ExternalLink,
  Search, IndianRupee, ChevronRight, Plus, X, Edit3,
  Save, Trash2, Loader2, RefreshCw,
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
const IPO_ENDPOINT = `${API_BASE}/ipo`;

type IPOStatus = 'upcoming' | 'open' | 'closed' | 'listed';
interface IPO {
  _id: string; companyName: string; logo: string; industry: string;
  status: IPOStatus; openDate: string; closeDate: string;
  listingDate?: string; priceRange: string; lotSize: number;
  issueSize: string; minInvestment: string; subscriptionStatus?: string;
  listingGain?: number | null; gmp?: number | null; allotmentDate?: string;
  refundDate?: string; exchange: string; rating: number; rhpLink?: string; category?: string;
}
interface Counts { open: number; upcoming: number; closed: number; listed: number; total: number; }

const STATUS_CFG = {
  upcoming: { bg: 'bg-blue-500/10',   text: 'text-blue-500',   label: 'Upcoming' },
  open:     { bg: 'bg-green-500/10',  text: 'text-green-500',  label: 'Open Now' },
  closed:   { bg: 'bg-orange-500/10', text: 'text-orange-500', label: 'Closed'   },
  listed:   { bg: 'bg-purple-500/10', text: 'text-purple-500', label: 'Listed'   },
};

const INDUSTRIES = [
  'IT Services','Defence & Aerospace','FMCG & Retail','Automobile Components',
  'Renewable Energy','Electric Vehicles','Pharmaceuticals','Solar Manufacturing',
  'Food Delivery & Tech','E-Commerce & Beauty','Banking & Finance','Infrastructure',
  'Healthcare','Real Estate','Telecom','Insurance','Chemicals','Textiles','Retail',
  'Logistics','Media & Entertainment','Other',
];

const BLANK: Omit<IPO, '_id'> = {
  companyName: '', logo: '', industry: '', status: 'upcoming',
  category: 'Mainboard', exchange: 'NSE / BSE',
  openDate: '', closeDate: '', allotmentDate: '', refundDate: '', listingDate: '',
  priceRange: '', lotSize: 0, issueSize: '', minInvestment: '',
  subscriptionStatus: '', listingGain: null, gmp: null, rating: 3, rhpLink: '',
};

function autoLogo(name: string) {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

// ─── ₹ prefix for single value fields ─────────────────────────────────────────
function RupeeInput({ value, onChange, placeholder, className }: {
  value: string; onChange: (v: string) => void; placeholder?: string; className?: string;
}) {
  return (
    <input
      className={className}
      placeholder={placeholder}
      value={value}
      onChange={e => {
        const raw = e.target.value.replace(/^₹\s*/, '');
        onChange(raw ? `₹${raw}` : '');
      }}
    />
  );
}

// ─── ₹ prefix on BOTH numbers in a price band (e.g. ₹140 – ₹170) ─────────────
function PriceBandInput({ value, onChange, placeholder, className }: {
  value: string; onChange: (v: string) => void; placeholder?: string; className?: string;
}) {
  return (
    <input
      className={className}
      placeholder={placeholder}
      value={value}
      onChange={e => {
        // Strip all ₹ and normalise separator to '-'
        const raw = e.target.value.replace(/₹/g, '').replace(/\s*–\s*/g, '-').trim();
        const parts = raw.split('-');
        if (parts.length >= 2) {
          const p1 = parts[0].trim();
          const p2 = parts.slice(1).join('-').trim();
          onChange(p2 ? `₹${p1} – ₹${p2}` : `₹${p1} –`);
        } else {
          onChange(raw ? `₹${raw}` : '');
        }
      }}
    />
  );
}

async function callAPI(url: string, opts?: RequestInit) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    ...opts,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || `Error ${res.status}`);
  return json.data;
}

function StatusBadge({ status }: { status: IPOStatus }) {
  const c = STATUS_CFG[status];
  const Icon = { upcoming: Clock, open: CheckCircle, closed: AlertCircle, listed: TrendingUp }[status];
  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${c.bg} ${c.text}`}>
      <Icon className="w-3 h-3" />{c.label}
    </span>
  );
}

function Stars({ rating, onClick }: { rating: number; onClick?: (n: number) => void }) {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star key={i}
          onClick={() => onClick?.(i + 1)}
          className={`w-3.5 h-3.5 ${i < rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'} ${onClick ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
        />
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// FORM MODAL
// ═══════════════════════════════════════════════════════════════════════════════
function FormModal({
  initial, onSave, onClose, saving,
}: {
  initial?: IPO;
  onSave: (data: Omit<IPO, '_id'>) => Promise<void>;
  onClose: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<Omit<IPO, '_id'>>(initial ? { ...initial } : { ...BLANK });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (key: keyof Omit<IPO, '_id'>, val: any) =>
    setForm(f => ({
      ...f,
      [key]: val,
      ...(key === 'companyName' && !initial ? { logo: autoLogo(val) } : {}),
    }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.companyName.trim()) e.companyName   = 'Company name required';
    if (!form.openDate.trim())    e.openDate       = 'Open date required';
    if (!form.closeDate.trim())   e.closeDate      = 'Close date required';
    if (!form.priceRange.trim())  e.priceRange     = 'Price band required';
    if (!form.issueSize.trim())   e.issueSize      = 'Issue size required';
    if (!form.minInvestment.trim()) e.minInvestment = 'Min investment required';
    if (!form.lotSize || form.lotSize < 1) e.lotSize = 'Lot size must be greater than 0';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const submit = async () => {
    if (!validate()) return;
    await onSave({ ...form, logo: form.logo || autoLogo(form.companyName) });
  };

  const inp = 'w-full rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none transition-colors bg-white/[0.06] border border-white/10 focus:border-[rgba(212,168,67,0.5)]';
  const lbl = 'block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5';
  const err = 'text-red-400 text-xs mt-1';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl" style={{ background: "linear-gradient(135deg,#0e2038 0%,#0c1a2e 100%)", border: "1px solid rgba(255,255,255,0.10)" }} onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 p-5 flex items-center justify-between z-10 rounded-t-2xl" style={{ background: "linear-gradient(135deg,#0a1628,#142640)", borderBottom: "1px solid rgba(212,168,67,0.20)" }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(212,168,67,0.15)", border: "1px solid rgba(212,168,67,0.25)" }}>
              {initial ? <Edit3 className="w-4 h-4 text-[#D4A843]" /> : <Plus className="w-4 h-4 text-[#D4A843]" />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{initial ? 'Edit IPO' : 'Add New IPO'}</h2>
              <p className="text-slate-400 text-xs">* fields are required</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white hover:bg-white/10 rounded-full p-2 transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Company Info */}
          <div className="p-4 rounded-xl space-y-4" style={{ background: "rgba(212,168,67,0.05)", border: "1px solid rgba(212,168,67,0.12)" }}>
            <p className="text-xs font-bold text-[#D4A843] uppercase tracking-wider">Company Info</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className={lbl}>Company Name *</label>
                <input className={inp} placeholder="e.g. Tata Technologies Ltd" value={form.companyName}
                  onChange={e => set('companyName', e.target.value)} />
                {errors.companyName && <p className={err}>{errors.companyName}</p>}
              </div>
              <div>
                <label className={lbl}>Logo (2 chars)</label>
                <input className={inp} placeholder="e.g. TT" maxLength={2} value={form.logo}
                  onChange={e => set('logo', e.target.value.toUpperCase())} />
                <p className="text-xs text-muted-foreground mt-1">Auto-generated from company name</p>
              </div>
              <div>
                <label className={lbl}>Industry</label>
                <select className={inp} value={form.industry} onChange={e => set('industry', e.target.value)}>
                  <option value="">-- Select Industry --</option>
                  {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Classification */}
          <div className="p-4 rounded-xl space-y-3" style={{ background: "rgba(212,168,67,0.05)", border: "1px solid rgba(212,168,67,0.12)" }}>
            <p className="text-xs font-bold text-[#D4A843] uppercase tracking-wider">Classification</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-2">
                <label className={lbl}>Status *</label>
                <select className={inp} value={form.status} onChange={e => set('status', e.target.value as IPOStatus)}>
                  <option value="upcoming">Upcoming</option>
                  <option value="open">Open Now</option>
                  <option value="closed">Closed</option>
                  <option value="listed">Listed</option>
                </select>
              </div>
              <div>
                <label className={lbl}>Exchange</label>
                <select className={inp} value={form.exchange} onChange={e => set('exchange', e.target.value)}>
                  <option>NSE / BSE</option><option>NSE</option><option>BSE</option>
                  <option>NSE SME</option><option>BSE SME</option>
                </select>
              </div>
              <div>
                <label className={lbl}>Category</label>
                <select className={inp} value={form.category} onChange={e => set('category', e.target.value)}>
                  <option>Mainboard</option><option>SME</option>
                </select>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="p-4 rounded-xl space-y-3" style={{ background: "rgba(212,168,67,0.05)", border: "1px solid rgba(212,168,67,0.12)" }}>
            <p className="text-xs font-bold text-[#D4A843] uppercase tracking-wider">Pricing & Size</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className={lbl}>Price Band *</label>
                {/* ← PriceBandInput: adds ₹ before both numbers */}
                <PriceBandInput className={inp} placeholder="₹475 – ₹500" value={form.priceRange}
                  onChange={v => set('priceRange', v)} />
                {errors.priceRange && <p className={err}>{errors.priceRange}</p>}
              </div>
              <div>
                <label className={lbl}>Lot Size (shares) *</label>
                <input type="number" className={inp} placeholder="30" min={1}
                  value={form.lotSize || ''}
                  onChange={e => set('lotSize', parseInt(e.target.value) || 0)} />
                {errors.lotSize && <p className={err}>{errors.lotSize}</p>}
              </div>
              <div>
                <label className={lbl}>Min Investment *</label>
                <RupeeInput className={inp} placeholder="15,000" value={form.minInvestment}
                  onChange={v => set('minInvestment', v)} />
                {errors.minInvestment && <p className={err}>{errors.minInvestment}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className={lbl}>Issue Size *</label>
                <RupeeInput className={inp} placeholder="3,042 Cr" value={form.issueSize}
                  onChange={v => set('issueSize', v)} />
                {errors.issueSize && <p className={err}>{errors.issueSize}</p>}
              </div>
              <div>
                <label className={lbl}>Rating</label>
                <div className="mt-2"><Stars rating={form.rating} onClick={n => set('rating', n)} /></div>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="p-4 rounded-xl space-y-3" style={{ background: "rgba(212,168,67,0.05)", border: "1px solid rgba(212,168,67,0.12)" }}>
            <p className="text-xs font-bold text-[#D4A843] uppercase tracking-wider">Important Dates</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { k: 'openDate',      l: 'Open Date *',       p: 'Jan 29, 2026' },
                { k: 'closeDate',     l: 'Close Date *',      p: 'Feb 02, 2026' },
                { k: 'allotmentDate', l: 'Allotment Date',    p: 'Feb 05, 2026' },
                { k: 'refundDate',    l: 'Refund / UPI Date', p: 'Feb 06, 2026' },
                { k: 'listingDate',   l: 'Listing Date',      p: 'Feb 07, 2026' },
              ].map(({ k, l, p }) => (
                <div key={k}>
                  <label className="block text-xs text-slate-400 mb-1">{l}</label>
                  <input className={inp} placeholder={p}
                    value={(form as any)[k] || ''}
                    onChange={e => set(k as any, e.target.value)} />
                  {errors[k] && <p className={err}>{errors[k]}</p>}
                </div>
              ))}
            </div>
          </div>

          {/* Performance */}
          <div className="p-4 rounded-xl space-y-3" style={{ background: "rgba(212,168,67,0.05)", border: "1px solid rgba(212,168,67,0.12)" }}>
            <div>
              <p className="text-xs font-bold text-[#D4A843] uppercase tracking-wider">Performance Data</p>
              <p className="text-xs text-muted-foreground mt-0.5">Optional — can be updated later</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Subscription</label>
                <input className={inp} placeholder="e.g. 69.43×" value={form.subscriptionStatus || ''}
                  onChange={e => set('subscriptionStatus', e.target.value)} />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">GMP (₹)</label>
                <RupeeInput className={inp} placeholder="650"
                  value={form.gmp != null ? `₹${form.gmp}` : ''}
                  onChange={v => {
                    const num = v.replace(/^₹/, '');
                    set('gmp', num !== '' ? Number(num) : null);
                  }} />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Listing Gain (%)</label>
                <input type="number" className={inp} placeholder="e.g. 140 or -12" value={form.listingGain ?? ''}
                  onChange={e => set('listingGain', e.target.value !== '' ? Number(e.target.value) : null)} />
              </div>
            </div>
          </div>

          <div>
            <label className={lbl}>RHP / DRHP Link (optional)</label>
            <input className={inp} placeholder="https://sebi.gov.in/..." value={form.rhpLink || ''}
              onChange={e => set('rhpLink', e.target.value)} />
          </div>
        </div>

        <div className="sticky bottom-0 p-4 flex gap-3 rounded-b-2xl" style={{ background: "linear-gradient(135deg,#0a1628,#0c1a2e)", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <button onClick={onClose}
            className="flex-1 py-3 rounded-xl text-slate-400 hover:text-white text-sm font-semibold transition-all" style={{ border: "1px solid rgba(255,255,255,0.12)" }}>
            Cancel
          </button>
          <button onClick={submit} disabled={saving}
            className="flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed text-[#0c1a2e] hover:shadow-lg"
            style={{ background: "linear-gradient(135deg,#D4A843,#C4941E)" }}>
            {saving
              ? <><Loader2 className="w-4 h-4 animate-spin text-white" /><span className="text-white">Saving...</span></>
              : <><Save className="w-4 h-4" />{initial ? 'Save Changes' : 'Add IPO'}</>
            }
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// DETAIL MODAL
// ═══════════════════════════════════════════════════════════════════════════════
function DetailModal({
  ipo, onClose, onEdit, onDelete, deleting, isAdmin,
}: {
  ipo: IPO; onClose: () => void; onEdit: () => void; onDelete: () => void; deleting: boolean; isAdmin: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" style={{ background: "linear-gradient(135deg,#0e2038 0%,#0c1a2e 100%)", border: "1px solid rgba(255,255,255,0.10)" }} onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 p-5 md:p-6 z-10 rounded-t-2xl" style={{ background: "linear-gradient(135deg,#0a1628,#142640)", borderBottom: "1px solid rgba(212,168,67,0.20)" }}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-[#D4A843] font-bold text-xl" style={{ background: "rgba(212,168,67,0.15)", border: "2px solid rgba(212,168,67,0.30)" }}>
                {ipo.logo}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white leading-tight">{ipo.companyName}</h2>
                <p className="text-slate-400 text-sm">{ipo.industry} · {ipo.exchange}</p>
                <div className="flex items-center gap-2 mt-2">
                  <StatusBadge status={ipo.status} />
                  {ipo.category && (
                    <span className="text-xs text-slate-400 px-2 py-0.5 rounded-full" style={{ border: "1px solid rgba(255,255,255,0.15)" }}>{ipo.category}</span>
                  )}
                  <Stars rating={ipo.rating} />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {isAdmin && (
                <>
                  <button onClick={onEdit} className="text-slate-400 hover:text-white hover:bg-white/10 rounded-lg p-2 transition-colors" title="Edit">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button onClick={onDelete} disabled={deleting} className="text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg p-2 transition-colors" title="Delete">
                    {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </button>
                </>
              )}
              <button onClick={onClose} className="text-slate-400 hover:text-white hover:bg-white/10 rounded-full p-2 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-5 md:p-6 space-y-6">
          <div>
            <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#D4A843]" />Issue Details
            </h3>
            <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
              {[
                ['Price Band',      ipo.priceRange],
                ['Issue Size',      ipo.issueSize],
                ['Lot Size',        `${ipo.lotSize} shares`],
                ['Min. Investment', ipo.minInvestment],
                ['Exchange',        ipo.exchange],
              ].map(([l, v], i) => (
                <div key={i} className="flex items-center justify-between px-4 py-3 text-sm" style={{ background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.04)" }}>
                  <span className="text-slate-400">{l}</span>
                  <span className="font-semibold text-white">{v}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#D4A843]" />Important Dates
            </h3>
            <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
              {[
                ['Open Date',           ipo.openDate,        'text-emerald-400'],
                ['Close Date',          ipo.closeDate,       'text-orange-400'],
                ...(ipo.allotmentDate ? [['Allotment Date',       ipo.allotmentDate,   'text-blue-400']] : []),
                ...(ipo.refundDate    ? [['Refund / UPI Mandate', ipo.refundDate,      'text-slate-400']] : []),
                ...(ipo.listingDate   ? [['Listing Date',         ipo.listingDate,     'text-purple-400']] : []),
              ].map(([l, v, cls], i) => (
                <div key={i} className="flex items-center justify-between px-4 py-3 text-sm" style={{ background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.04)" }}>
                  <span className="text-muted-foreground">{l}</span>
                  <span className={`font-semibold ${cls}`}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          {(ipo.subscriptionStatus || ipo.gmp || ipo.listingGain != null) && (
            <div>
              <h3 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-accent" />Performance
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {ipo.subscriptionStatus && (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Subscription</p>
                    <p className="text-2xl font-bold text-green-700 dark:text-green-400">{ipo.subscriptionStatus}</p>
                    <p className="text-xs text-muted-foreground">times</p>
                  </div>
                )}
                {ipo.gmp != null && ipo.gmp > 0 && (
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">GMP</p>
                    <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">+₹{ipo.gmp}</p>
                    <p className="text-xs text-muted-foreground">grey market</p>
                  </div>
                )}
                {ipo.listingGain != null && (
                  <div className={`rounded-xl p-4 text-center border ${ipo.listingGain >= 0 ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                    <p className="text-xs text-slate-400 mb-1">Listing Gain</p>
                    <p className={`text-2xl font-bold ${ipo.listingGain >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {ipo.listingGain >= 0 ? '+' : ''}{ipo.listingGain}%
                    </p>
                    <p className="text-xs text-slate-400">on listing day</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="rounded-xl p-4" style={{ background: "rgba(212,168,67,0.05)", border: "1px solid rgba(212,168,67,0.15)" }}>
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-[#D4A843]" />Minimum Investment Required
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400">Lot Size</p>
                <p className="text-lg font-bold text-white">{ipo.lotSize} shares</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400">Amount</p>
                <p className="text-lg font-bold text-[#D4A843]">{ipo.minInvestment}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => ipo.rhpLink ? window.open(ipo.rhpLink, '_blank') : null}
              className="flex-1 py-3 px-4 text-[#0c1a2e] rounded-lg font-semibold text-sm hover:shadow-lg transition-all flex items-center justify-center gap-2"
              style={{ background: "linear-gradient(135deg,#D4A843,#C4941E)" }}>
              <FileText className="w-4 h-4" />View RHP / DRHP
            </button>
            <button className="flex-1 py-3 px-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg font-semibold text-sm hover:shadow-lg transition-all flex items-center justify-center gap-2">
              <ExternalLink className="w-4 h-4" />Apply via ASBA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// IPO CARD  ← taller: min-h-[360px] + increased body padding
// ═══════════════════════════════════════════════════════════════════════════════
function IPOCard({
  ipo, onViewDetail, onEdit, onDelete, isAdmin, isLight,
}: {
  ipo: IPO; onViewDetail: () => void; onEdit: () => void; onDelete: () => void; isAdmin: boolean; isLight?: boolean;
}) {
  return (
    <div className="rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group hover:-translate-y-0.5 flex flex-col min-h-[360px]"
      style={{ background: isLight ? "rgba(255,255,255,0.70)" : "rgba(255,255,255,0.04)", border: isLight ? "1px solid rgba(13,37,64,0.12)" : "1px solid rgba(255,255,255,0.08)" }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(212,168,67,0.40)")}
      onMouseLeave={e => (e.currentTarget.style.borderColor = isLight ? "rgba(13,37,64,0.12)" : "rgba(255,255,255,0.08)")}>

      {/* Header */}
      <div className="px-4 pt-4 pb-3" style={{ borderBottom: isLight ? "1px solid rgba(13,37,64,0.08)" : "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-[#D4A843] font-bold text-xs flex-shrink-0" style={{ background: "linear-gradient(135deg,rgba(212,168,67,0.2),rgba(196,148,30,0.1))", border: "1px solid rgba(212,168,67,0.25)" }}>
              {ipo.logo}
            </div>
            <div className="min-w-0">
              <h3 className={`font-bold text-[13px] leading-tight truncate ${isLight ? "text-navy" : "text-white"}`}>{ipo.companyName}</h3>
              <p className={`text-[11px] mt-0.5 truncate ${isLight ? "text-navy/60" : "text-slate-400"}`}>{ipo.industry || '—'}</p>
            </div>
          </div>
          {isAdmin && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-1">
              <button onClick={e => { e.stopPropagation(); onEdit(); }}
                className="w-6 h-6 rounded-md flex items-center justify-center text-[#D4A843] transition-all" style={{ background: "rgba(212,168,67,0.10)" }}>
                <Edit3 className="w-3 h-3" />
              </button>
              <button onClick={e => { e.stopPropagation(); onDelete(); }}
                className="w-6 h-6 rounded-md flex items-center justify-center text-red-400 transition-all" style={{ background: "rgba(239,68,68,0.10)" }}>
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between">
          <StatusBadge status={ipo.status} />
          <Stars rating={ipo.rating} />
        </div>
      </div>

      {/* Body */}
      <div className="px-4 py-4 flex-1 space-y-3">
        <div className="grid grid-cols-2 gap-x-3 gap-y-3">
          <div>
            <p className={`text-[9px] uppercase tracking-wider ${isLight ? "text-navy/50" : "text-slate-500"}`}>Price Band</p>
            <p className={`text-xs font-bold leading-tight mt-0.5 ${isLight ? "text-navy" : "text-white"}`}>{ipo.priceRange}</p>
          </div>
          <div>
            <p className={`text-[9px] uppercase tracking-wider ${isLight ? "text-navy/50" : "text-slate-500"}`}>Lot Size</p>
            <p className={`text-xs font-semibold leading-tight mt-0.5 ${isLight ? "text-navy" : "text-white"}`}>{ipo.lotSize} shares</p>
          </div>
          <div>
            <p className={`text-[9px] uppercase tracking-wider ${isLight ? "text-navy/50" : "text-slate-500"}`}>Min. Investment</p>
            <p className="text-xs font-bold text-[#D4A843] leading-tight mt-0.5">{ipo.minInvestment}</p>
          </div>
          <div>
            <p className={`text-[9px] uppercase tracking-wider ${isLight ? "text-navy/50" : "text-slate-500"}`}>Issue Size</p>
            <p className={`text-xs font-semibold leading-tight mt-0.5 ${isLight ? "text-navy" : "text-white"}`}>{ipo.issueSize}</p>
          </div>
        </div>

        <div className={`flex items-center gap-1.5 text-[11px] pt-3 ${isLight ? "text-navy/60" : "text-slate-400"}`} style={{ borderTop: isLight ? "1px solid rgba(13,37,64,0.08)" : "1px solid rgba(255,255,255,0.06)" }}>
          <Calendar className="w-3 h-3 flex-shrink-0" />
          <span>{ipo.openDate}</span>
          <span>→</span>
          <span>{ipo.closeDate}</span>
          {ipo.listingDate && <span className="ml-auto text-purple-400 font-medium text-[10px]">{ipo.listingDate}</span>}
        </div>

        {(ipo.subscriptionStatus || (ipo.gmp != null && ipo.gmp > 0) || ipo.listingGain != null) && (
          <div className="flex flex-wrap gap-1 pt-0.5">
            {ipo.subscriptionStatus && (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-green-500/10 border border-green-500/20 rounded-full text-[10px] font-bold text-emerald-400">
                <Users className="w-2.5 h-2.5" />{ipo.subscriptionStatus}
              </span>
            )}
            {ipo.gmp != null && ipo.gmp > 0 && (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] font-bold text-blue-400">
                <Target className="w-2.5 h-2.5" />₹{ipo.gmp}
              </span>
            )}
            {ipo.listingGain != null && (
              <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold border ${ipo.listingGain >= 0 ? 'bg-green-500/10 border-green-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                {ipo.listingGain >= 0 ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                {ipo.listingGain >= 0 ? '+' : ''}{ipo.listingGain}%
              </span>
            )}
            <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] ml-auto ${isLight ? "text-navy/60" : "text-slate-400"}`} style={{ background: isLight ? "rgba(13,37,64,0.06)" : "rgba(255,255,255,0.05)" }}>{ipo.exchange}</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 pb-4 pt-2">
        <button onClick={onViewDetail}
          className="w-full py-2 px-3 text-[#0c1a2e] rounded-lg font-semibold text-xs hover:shadow-md transition-all flex items-center justify-center gap-1.5 group/btn"
          style={{ background: "linear-gradient(135deg,#D4A843,#C4941E)" }}>
          View Details
          <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
const IPOSection = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [ipos,     setIpos]     = useState<IPO[]>([]);
  const [counts,   setCounts]   = useState<Counts>({ open:0, upcoming:0, closed:0, listed:0, total:0 });
  const [activeTab, setActiveTab] = useState<IPOStatus>('open');
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState<string | null>(null);
  const [showAll,  setShowAll]  = useState(false);

  const [selectedIPO, setSelectedIPO] = useState<IPO | null>(null);
  const [detailOpen,  setDetailOpen]  = useState(false);
  const [formOpen,    setFormOpen]    = useState(false);
  const [editIPO,     setEditIPO]     = useState<IPO | null>(null);
  const [saving,      setSaving]      = useState(false);
  const [deleting,    setDeleting]    = useState(false);

  const displayed = showAll ? ipos : ipos.slice(0, 3);

  const fetchIPOs = useCallback(async (tab: IPOStatus) => {
    setLoading(true); setError(null);
    try {
      const data = await callAPI(`${IPO_ENDPOINT}?status=${tab}`);
      setIpos(data.ipos ?? []);
      setCounts(data.counts ?? { open:0, upcoming:0, closed:0, listed:0, total:0 });
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { setShowAll(false); fetchIPOs(activeTab); }, [activeTab, fetchIPOs]);

  const switchTab = (tab: IPOStatus) => {
    setActiveTab(tab); setShowAll(false);
    setTimeout(() => document.getElementById('ipo-list-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
  };

  const handleAdd = async (data: Omit<IPO, '_id'>) => {
    setSaving(true);
    try { await callAPI(IPO_ENDPOINT, { method: 'POST', body: JSON.stringify(data) }); setFormOpen(false); setEditIPO(null); await fetchIPOs(activeTab); }
    catch (e: any) { alert('❌ ' + e.message); } finally { setSaving(false); }
  };

  const handleEdit = async (data: Omit<IPO, '_id'>) => {
    if (!editIPO) return; setSaving(true);
    try { await callAPI(`${IPO_ENDPOINT}/${editIPO._id}`, { method: 'PUT', body: JSON.stringify(data) }); setFormOpen(false); setEditIPO(null); setDetailOpen(false); setSelectedIPO(null); await fetchIPOs(activeTab); }
    catch (e: any) { alert('❌ ' + e.message); } finally { setSaving(false); }
  };

  const handleDelete = async (ipo: IPO) => {
    if (!confirm(`Are you sure you want to delete "${ipo.companyName}"?`)) return; setDeleting(true);
    try { await callAPI(`${IPO_ENDPOINT}/${ipo._id}`, { method: 'DELETE' }); setDetailOpen(false); setSelectedIPO(null); await fetchIPOs(activeTab); }
    catch (e: any) { alert('❌ ' + e.message); } finally { setDeleting(false); }
  };

  return (
    <>
      <div className="min-h-screen" style={{ background: isLight ? "linear-gradient(160deg,#dce8f7 0%,#e8f2fd 45%,#dce8f7 100%)" : "linear-gradient(160deg,#0c1a2e 0%,#0e2038 45%,#0b1825 100%)" }}>

        {/* Hero */}
        <section className=" relative overflow-hidden py-16 md:py-24" style={{ background: isLight ? "linear-gradient(135deg,#edf5fe 0%,#dce8f7 50%,#e8f2fd 100%)" : "linear-gradient(135deg,#0a1628 0%,#0e2038 50%,#0c1a2e 100%)", borderBottom: isLight ? "1px solid rgba(13,37,64,0.1)" : "1px solid rgba(255,255,255,0.06)" }}>
          {/* Ambient glows matching DecodeMarket */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[130px] pointer-events-none" style={{ background: "radial-gradient(circle,rgba(212,168,67,0.10) 0%,transparent 70%)" }} />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[100px] pointer-events-none" style={{ background: "radial-gradient(circle,rgba(56,189,248,0.07) 0%,transparent 70%)" }} />
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ background: "rgba(212,168,67,0.1)", border: "1px solid rgba(212,168,67,0.2)" }}>
                <Zap className="w-4 h-4 text-[#D4A843]" />
                <span className="text-sm font-medium text-[#D4A843]">Live IPO Updates</span>
              </div>
              <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 ${isLight ? "text-navy" : "text-white"}`}>
                Initial Public <span style={{ background: "linear-gradient(135deg,#D4A843,#F0C84A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Offerings</span>
              </h1>
              <p className="text-lg md:text-xl mb-8 leading-relaxed" style={{ color: isLight ? "rgba(13,37,64,0.65)" : "rgba(255,255,255,0.70)" }}>
                Stay updated with latest IPOs, track subscription status in real-time, and make informed investment decisions with comprehensive IPO analysis.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                {([
                  { s: 'open'     as IPOStatus, icon: <Building2  className="w-8 h-8 text-[#D4A843] mx-auto mb-2" /> },
                  { s: 'upcoming' as IPOStatus, icon: <Clock      className="w-8 h-8 text-blue-400   mx-auto mb-2" /> },
                  { s: 'listed'   as IPOStatus, icon: <TrendingUp className="w-8 h-8 text-emerald-400 mx-auto mb-2" /> },
                  { s: 'closed'   as IPOStatus, icon: <Award      className="w-8 h-8 text-purple-400 mx-auto mb-2" /> },
                ]).map(({ s, icon }) => (
                  <button key={s} onClick={() => switchTab(s)}
                    className="rounded-xl p-4 hover:scale-105 transition-all duration-200 cursor-pointer text-center group"
                    style={{ background: isLight ? "rgba(13,37,64,0.05)" : "rgba(255,255,255,0.04)", border: isLight ? "1px solid rgba(13,37,64,0.12)" : "1px solid rgba(255,255,255,0.08)" }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(212,168,67,0.30)")}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = isLight ? "rgba(13,37,64,0.12)" : "rgba(255,255,255,0.08)")}>
                    {icon}
                    <div className={`text-2xl font-bold ${isLight ? "text-navy" : "text-white"}`}>{counts[s]}</div>
                    <div className={`text-sm transition-colors ${isLight ? "text-navy/55 group-hover:text-navy" : "text-slate-400 group-hover:text-white"}`}>{STATUS_CFG[s].label}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* List */}
        <section className="container mx-auto px-4 md:px-6 py-10" id="ipo-list-section">
          {/* ── Controls: mobile-first, desktop single row ── */}
          <div className="mb-6">
            <div className="flex items-center gap-2">
              {/* Tabs — scrollable on mobile, wrap-free */}
              <div className="flex gap-1.5 overflow-x-auto flex-1 pb-0.5" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {(['open','upcoming','closed','listed'] as IPOStatus[]).map(tab => (
                  <button key={tab} onClick={() => { setActiveTab(tab); setShowAll(false); }}
                    className={`flex-shrink-0 px-3.5 py-2 rounded-lg font-semibold text-xs sm:text-sm transition-all ${
                      activeTab === tab
                        ? 'bg-gradient-to-r from-accent to-accent/80 text-white shadow-lg'
                        : 'bg-card text-muted-foreground hover:bg-card/80 border border-border'
                    }`}>
                    {STATUS_CFG[tab].label}
                    <span className="ml-1 opacity-60">({counts[tab]})</span>
                  </button>
                ))}
              </div>

              {/* Right side: Add IPO (desktop only inline) + Refresh */}
              {isAdmin && (
                <button onClick={() => { setEditIPO(null); setFormOpen(true); }}
                  className="hidden sm:flex flex-shrink-0 items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-accent to-accent/80 text-white rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-accent/20 transition-all whitespace-nowrap">
                  <Plus className="w-4 h-4" />Add IPO
                </button>
              )}
              <button onClick={() => fetchIPOs(activeTab)} disabled={loading}
                className="flex-shrink-0 flex items-center justify-center w-9 h-9 bg-card border border-border rounded-xl text-muted-foreground hover:text-foreground transition-all">
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {/* Add IPO — full width below tabs on mobile only */}
            {isAdmin && (
              <button onClick={() => { setEditIPO(null); setFormOpen(true); }}
                className="sm:hidden mt-2 w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-accent to-accent/80 text-white rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-accent/20 transition-all">
                <Plus className="w-4 h-4" />Add IPO
              </button>
            )}
          </div>

          {loading && (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="w-10 h-10 text-accent animate-spin" />
              <p className="text-muted-foreground text-sm">Loading IPOs...</p>
            </div>
          )}

          {error && !loading && (
            <div className="text-center py-16">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Something went wrong</h3>
              <p className="text-sm text-muted-foreground font-mono bg-card px-4 py-2 rounded-lg inline-block mb-4">{error}</p>
              <br />
              <button onClick={() => fetchIPOs(activeTab)}
                className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 bg-accent/10 text-accent border border-accent/20 rounded-xl text-sm font-semibold hover:bg-accent/20 transition-all">
                <RefreshCw className="w-4 h-4" />Try Again
              </button>
            </div>
          )}

          {!loading && !error && ipos.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-10 h-10 text-accent/40" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No {STATUS_CFG[activeTab].label} IPOs found</h3>
              <p className="text-muted-foreground mb-5">{isAdmin ? 'Add your first IPO to get started!' : 'Check back soon for new IPOs.'}</p>
              {isAdmin && (
                <button onClick={() => { setEditIPO(null); setFormOpen(true); }}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-accent to-accent/80 text-white rounded-xl font-bold text-sm hover:shadow-lg transition-all">
                  <Plus className="w-4 h-4" />Add First IPO
                </button>
              )}
            </div>
          )}

          {!loading && !error && ipos.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {displayed.map(ipo => (
                  <IPOCard key={ipo._id} ipo={ipo} isAdmin={isAdmin} isLight={isLight}
                    onViewDetail={() => { setSelectedIPO(ipo); setDetailOpen(true); }}
                    onEdit={() => { setEditIPO(ipo); setFormOpen(true); }}
                    onDelete={() => handleDelete(ipo)}
                  />
                ))}
              </div>

              {ipos.length > 3 && (
                <div className="mt-8 text-center flex items-center justify-center gap-3">
                  <button onClick={() => setShowAll(p => !p)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/20 hover:border-accent/40 transition-all duration-200 group">
                    <span className="text-accent font-semibold text-sm">
                      {showAll ? 'Show Less' : `View All ${ipos.length} IPOs`}
                    </span>
                    <ChevronRight className={`w-4 h-4 text-accent transition-transform duration-200 ${showAll ? 'rotate-90' : 'group-hover:translate-x-1'}`} />
                  </button>
                </div>
              )}

              <div className="mt-4 text-center">
                <button onClick={() => navigate('/ipos')}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-accent to-accent/80 text-white font-bold text-sm hover:shadow-lg hover:shadow-accent/20 transition-all group">
                  Explore All IPOs
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </>
          )}

          {/* Info Cards */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl" style={{ background: "rgba(56,189,248,0.05)", border: "1px solid rgba(56,189,248,0.15)" }}>
              <Shield className="w-10 h-10 text-blue-400 mb-4" />
              <h3 className={`text-lg font-bold mb-2 ${isLight ? "text-navy" : "text-white"}`}>SEBI Regulated</h3>
              <p className={`text-sm ${isLight ? "text-navy/65" : "text-slate-400"}`}>All IPOs listed are SEBI-regulated with complete RHP transparency for informed decisions.</p>
            </div>
            <div className="p-6 rounded-2xl" style={{ background: "rgba(52,211,153,0.05)", border: "1px solid rgba(52,211,153,0.15)" }}>
              <BarChart3 className="w-10 h-10 text-emerald-400 mb-4" />
              <h3 className={`text-lg font-bold mb-2 ${isLight ? "text-navy" : "text-white"}`}>Live GMP & Subscription</h3>
              <p className={`text-sm ${isLight ? "text-navy/65" : "text-slate-400"}`}>Real-time grey market premium, subscription data, and day-wise allotment tracking.</p>
            </div>
            <div className="p-6 rounded-2xl" style={{ background: "rgba(212,168,67,0.05)", border: "1px solid rgba(212,168,67,0.15)" }}>
              <FileText className="w-10 h-10 text-[#D4A843] mb-4" />
              <h3 className={`text-lg font-bold mb-2 ${isLight ? "text-navy" : "text-white"}`}>Expert Analysis</h3>
              <p className={`text-sm ${isLight ? "text-navy/65" : "text-slate-400"}`}>Detailed IPO reviews, DRHP financials, and apply/avoid recommendations from experts.</p>
            </div>
          </div>
        </section>
      </div>

      {detailOpen && selectedIPO && !formOpen && (
        <DetailModal ipo={selectedIPO}
          onClose={() => { setDetailOpen(false); setSelectedIPO(null); }}
          onEdit={() => { setEditIPO(selectedIPO); setFormOpen(true); }}
          onDelete={() => handleDelete(selectedIPO)}
          deleting={deleting} isAdmin={isAdmin}
        />
      )}

      {formOpen && isAdmin && (
        <FormModal initial={editIPO ?? undefined}
          onSave={editIPO ? handleEdit : handleAdd}
          onClose={() => { setFormOpen(false); setEditIPO(null); }}
          saving={saving}
        />
      )}
    </>
  );
};

export default IPOSection;