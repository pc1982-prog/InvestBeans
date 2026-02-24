import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp, TrendingDown, Calendar, Users, Building2,
  CheckCircle, Clock, AlertCircle, ArrowRight, Star, Target,
  Award, Shield, Zap, BarChart3, FileText, ExternalLink,
  Search, IndianRupee, ChevronRight, Plus, X, Edit3,
  Save, Trash2, Loader2, RefreshCw, ArrowLeft, ChevronDown,
} from 'lucide-react';
import  Header  from '@/components/Header';
import Footer from '@/components/Footer';

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
const IPO_ENDPOINT = `${API_BASE}/ipo`;

// ─── TYPES ────────────────────────────────────────────────────────────────────
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

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
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
  'Healthcare','Real Estate','Telecom','Insurance','Chemicals','Textiles',
  'Retail','Logistics','Media & Entertainment','Other',
];

const BLANK: Omit<IPO,'_id'> = {
  companyName:'', logo:'', industry:'', status:'upcoming',
  category:'Mainboard', exchange:'NSE / BSE',
  openDate:'', closeDate:'', allotmentDate:'', refundDate:'', listingDate:'',
  priceRange:'', lotSize:0, issueSize:'', minInvestment:'',
  subscriptionStatus:'', listingGain:null, gmp:null, rating:3, rhpLink:'',
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function autoLogo(name: string) {
  return name.split(' ').slice(0,2).map(w=>w[0]).join('').toUpperCase().slice(0,2);
}
async function callAPI(url: string, opts?: RequestInit) {
  const res = await fetch(url, { headers: {'Content-Type':'application/json'}, credentials:'include', ...opts });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || `Error ${res.status}`);
  return json.data;
}

function StatusBadge({ status }: { status: IPOStatus }) {
  const c = STATUS_CFG[status];
  const Icon = { upcoming:Clock, open:CheckCircle, closed:AlertCircle, listed:TrendingUp }[status];
  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${c.bg} ${c.text}`}>
      <Icon className="w-3 h-3" />{c.label}
    </span>
  );
}

function Stars({ rating, onClick }: { rating: number; onClick?: (n:number)=>void }) {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_,i) => (
        <Star key={i} onClick={()=>onClick?.(i+1)}
          className={`w-3.5 h-3.5 ${i<rating?'fill-yellow-500 text-yellow-500':'text-gray-300'} ${onClick?'cursor-pointer':''}`} />
      ))}
    </div>
  );
}

// ─── FORM MODAL ───────────────────────────────────────────────────────────────
function FormModal({ initial, onSave, onClose, saving }: {
  initial?: IPO; onSave: (d:Omit<IPO,'_id'>)=>Promise<void>; onClose:()=>void; saving:boolean;
}) {
  const [form, setForm] = useState<Omit<IPO,'_id'>>(initial ? {...initial} : {...BLANK});
  const [errors, setErrors] = useState<Record<string,string>>({});

  const set = (k: keyof Omit<IPO,'_id'>, v: any) =>
    setForm(f => ({...f, [k]:v, ...(k==='companyName'&&!initial?{logo:autoLogo(v)}:{})}));

  const validate = () => {
    const e: Record<string,string> = {};
    if (!form.companyName.trim()) e.companyName='Company name required';
    if (!form.openDate.trim())    e.openDate='Open date required';
    if (!form.closeDate.trim())   e.closeDate='Close date required';
    if (!form.priceRange.trim())  e.priceRange='Price band required';
    if (!form.issueSize.trim())   e.issueSize='Issue size required';
    if (!form.minInvestment.trim()) e.minInvestment='Min investment required';
    if (!form.lotSize||form.lotSize<1) e.lotSize='Lot size required';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const submit = async () => { if (!validate()) return; await onSave({...form, logo:form.logo||autoLogo(form.companyName)}); };

  const inp = 'w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent/60 transition-colors';
  const lbl = 'block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5';
  const err = 'text-red-500 text-xs mt-1';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-card rounded-2xl border border-border w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl" onClick={e=>e.stopPropagation()}>
        <div className="sticky top-0 bg-gradient-to-r from-navy to-accent p-5 flex items-center justify-between z-10 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              {initial ? <Edit3 className="w-4 h-4 text-white" /> : <Plus className="w-4 h-4 text-white" />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{initial ? 'Edit IPO' : 'Add New IPO'}</h2>
              <p className="text-white/60 text-xs">* fields are required</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5 space-y-5">
          <div className="p-4 rounded-xl bg-accent/5 border border-accent/10 space-y-4">
            <p className="text-xs font-bold text-accent uppercase tracking-wider">Company Info</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className={lbl}>Company Name *</label>
                <input className={inp} placeholder="e.g. Tata Technologies Ltd" value={form.companyName} onChange={e=>set('companyName',e.target.value)} />
                {errors.companyName && <p className={err}>{errors.companyName}</p>}
              </div>
              <div>
                <label className={lbl}>Logo (2 chars)</label>
                <input className={inp} placeholder="e.g. TT" maxLength={2} value={form.logo} onChange={e=>set('logo',e.target.value.toUpperCase())} />
                <p className="text-xs text-muted-foreground mt-1">Auto-generated from company name</p>
              </div>
              <div>
                <label className={lbl}>Industry</label>
                <select className={inp} value={form.industry} onChange={e=>set('industry',e.target.value)}>
                  <option value="">-- Select --</option>
                  {INDUSTRIES.map(i=><option key={i}>{i}</option>)}
                </select>
              </div>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-accent/5 border border-accent/10 space-y-3">
            <p className="text-xs font-bold text-accent uppercase tracking-wider">Classification</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-2">
                <label className={lbl}>Status *</label>
                <select className={inp} value={form.status} onChange={e=>set('status',e.target.value as IPOStatus)}>
                  <option value="upcoming">Upcoming</option><option value="open">Open Now</option>
                  <option value="closed">Closed</option><option value="listed">Listed</option>
                </select>
              </div>
              <div>
                <label className={lbl}>Exchange</label>
                <select className={inp} value={form.exchange} onChange={e=>set('exchange',e.target.value)}>
                  <option>NSE / BSE</option><option>NSE</option><option>BSE</option>
                  <option>NSE SME</option><option>BSE SME</option>
                </select>
              </div>
              <div>
                <label className={lbl}>Category</label>
                <select className={inp} value={form.category} onChange={e=>set('category',e.target.value)}>
                  <option>Mainboard</option><option>SME</option>
                </select>
              </div>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-accent/5 border border-accent/10 space-y-3">
            <p className="text-xs font-bold text-accent uppercase tracking-wider">Pricing & Size</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className={lbl}>Price Band *</label>
                <input className={inp} placeholder="₹475 – ₹500" value={form.priceRange} onChange={e=>set('priceRange',e.target.value)} />
                {errors.priceRange&&<p className={err}>{errors.priceRange}</p>}
              </div>
              <div>
                <label className={lbl}>Lot Size *</label>
                <input type="number" className={inp} placeholder="30" min={1} value={form.lotSize||''} onChange={e=>set('lotSize',parseInt(e.target.value)||0)} />
                {errors.lotSize&&<p className={err}>{errors.lotSize}</p>}
              </div>
              <div>
                <label className={lbl}>Min Investment *</label>
                <input className={inp} placeholder="₹15,000" value={form.minInvestment} onChange={e=>set('minInvestment',e.target.value)} />
                {errors.minInvestment&&<p className={err}>{errors.minInvestment}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className={lbl}>Issue Size *</label>
                <input className={inp} placeholder="₹3,042 Cr" value={form.issueSize} onChange={e=>set('issueSize',e.target.value)} />
                {errors.issueSize&&<p className={err}>{errors.issueSize}</p>}
              </div>
              <div>
                <label className={lbl}>Rating</label>
                <div className="mt-2"><Stars rating={form.rating} onClick={n=>set('rating',n)} /></div>
              </div>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-accent/5 border border-accent/10 space-y-3">
            <p className="text-xs font-bold text-accent uppercase tracking-wider">Important Dates</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                {k:'openDate',l:'Open Date *',p:'Jan 29, 2026'},
                {k:'closeDate',l:'Close Date *',p:'Feb 02, 2026'},
                {k:'allotmentDate',l:'Allotment',p:'Feb 05, 2026'},
                {k:'refundDate',l:'Refund/UPI',p:'Feb 06, 2026'},
                {k:'listingDate',l:'Listing',p:'Feb 07, 2026'},
              ].map(({k,l,p}) => (
                <div key={k}>
                  <label className="block text-xs text-muted-foreground mb-1">{l}</label>
                  <input className={inp} placeholder={p} value={(form as any)[k]||''} onChange={e=>set(k as any,e.target.value)} />
                  {errors[k]&&<p className={err}>{errors[k]}</p>}
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 rounded-xl bg-accent/5 border border-accent/10 space-y-3">
            <p className="text-xs font-bold text-accent uppercase tracking-wider">Performance <span className="text-muted-foreground/50 normal-case font-normal">(optional)</span></p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Subscription</label>
                <input className={inp} placeholder="69.43×" value={form.subscriptionStatus||''} onChange={e=>set('subscriptionStatus',e.target.value)} />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">GMP (₹)</label>
                <input type="number" className={inp} placeholder="650" value={form.gmp??''} onChange={e=>set('gmp',e.target.value!==''?Number(e.target.value):null)} />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Listing Gain (%)</label>
                <input type="number" className={inp} placeholder="140 or -12" value={form.listingGain??''} onChange={e=>set('listingGain',e.target.value!==''?Number(e.target.value):null)} />
              </div>
            </div>
          </div>
          <div>
            <label className={lbl}>RHP / DRHP Link (optional)</label>
            <input className={inp} placeholder="https://..." value={form.rhpLink||''} onChange={e=>set('rhpLink',e.target.value)} />
          </div>
        </div>
        <div className="sticky bottom-0 bg-card border-t border-border p-4 flex gap-3 rounded-b-2xl">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-border text-muted-foreground hover:text-foreground text-sm font-semibold transition-all">Cancel</button>
          <button onClick={submit} disabled={saving}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-accent to-accent/80 text-white text-sm font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-60">
            {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</> : <><Save className="w-4 h-4" />{initial?'Save Changes':'Add IPO'}</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── DETAIL MODAL ─────────────────────────────────────────────────────────────
function DetailModal({ ipo, onClose, onEdit, onDelete, deleting }: {
  ipo: IPO; onClose:()=>void; onEdit:()=>void; onDelete:()=>void; deleting:boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-card rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-border" onClick={e=>e.stopPropagation()}>
        <div className="sticky top-0 bg-gradient-to-r from-navy to-accent p-5 md:p-6 z-10">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-xl border-2 border-white/30">{ipo.logo}</div>
              <div>
                <h2 className="text-xl font-bold text-white leading-tight">{ipo.companyName}</h2>
                <p className="text-white/70 text-sm">{ipo.industry} · {ipo.exchange}</p>
                <div className="flex items-center gap-2 mt-2">
                  <StatusBadge status={ipo.status} />
                  {ipo.category && <span className="text-xs text-white/60 border border-white/20 px-2 py-0.5 rounded-full">{ipo.category}</span>}
                  <Stars rating={ipo.rating} />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button onClick={onEdit} className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"><Edit3 className="w-4 h-4" /></button>
              <button onClick={onDelete} disabled={deleting} className="text-white hover:bg-red-500/30 rounded-lg p-2 transition-colors">
                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              </button>
              <button onClick={onClose} className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"><X className="w-5 h-5" /></button>
            </div>
          </div>
        </div>
        <div className="p-5 md:p-6 space-y-6">
          <div>
            <h3 className="text-base font-bold text-foreground mb-3 flex items-center gap-2"><Zap className="w-4 h-4 text-accent" />Issue Details</h3>
            <div className="rounded-xl border border-border overflow-hidden">
              {[['Price Band',ipo.priceRange],['Issue Size',ipo.issueSize],['Lot Size',`${ipo.lotSize} shares`],['Min. Investment',ipo.minInvestment],['Exchange',ipo.exchange]].map(([l,v],i) => (
                <div key={i} className={`flex items-center justify-between px-4 py-3 text-sm ${i%2===0?'bg-background':'bg-card'}`}>
                  <span className="text-muted-foreground">{l}</span><span className="font-semibold text-foreground">{v}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground mb-3 flex items-center gap-2"><Calendar className="w-4 h-4 text-accent" />Important Dates</h3>
            <div className="rounded-xl border border-border overflow-hidden">
              {[
                ['Open Date',ipo.openDate,'text-green-600 dark:text-green-400'],
                ['Close Date',ipo.closeDate,'text-orange-600 dark:text-orange-400'],
                ...(ipo.allotmentDate?[['Allotment Date',ipo.allotmentDate,'text-blue-600 dark:text-blue-400']]:[]),
                ...(ipo.refundDate?[['Refund / UPI',ipo.refundDate,'text-muted-foreground']]:[]),
                ...(ipo.listingDate?[['Listing Date',ipo.listingDate,'text-purple-600 dark:text-purple-400']]:[]),
              ].map(([l,v,cls],i) => (
                <div key={i} className={`flex items-center justify-between px-4 py-3 text-sm ${i%2===0?'bg-background':'bg-card'}`}>
                  <span className="text-muted-foreground">{l}</span><span className={`font-semibold ${cls}`}>{v}</span>
                </div>
              ))}
            </div>
          </div>
          {(ipo.subscriptionStatus||ipo.gmp||ipo.listingGain!=null) && (
            <div>
              <h3 className="text-base font-bold text-foreground mb-3 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-accent" />Performance</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {ipo.subscriptionStatus && (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Subscription</p>
                    <p className="text-2xl font-bold text-green-700 dark:text-green-400">{ipo.subscriptionStatus}</p>
                    <p className="text-xs text-muted-foreground">times</p>
                  </div>
                )}
                {ipo.gmp!=null&&ipo.gmp>0 && (
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">GMP</p>
                    <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">+₹{ipo.gmp}</p>
                    <p className="text-xs text-muted-foreground">grey market</p>
                  </div>
                )}
                {ipo.listingGain!=null && (
                  <div className={`rounded-xl p-4 text-center border ${ipo.listingGain>=0?'bg-green-500/10 border-green-500/20':'bg-red-500/10 border-red-500/20'}`}>
                    <p className="text-xs text-muted-foreground mb-1">Listing Gain</p>
                    <p className={`text-2xl font-bold ${ipo.listingGain>=0?'text-green-700 dark:text-green-400':'text-red-700 dark:text-red-400'}`}>
                      {ipo.listingGain>=0?'+':''}{ipo.listingGain}%
                    </p>
                    <p className="text-xs text-muted-foreground">on listing day</p>
                  </div>
                )}
              </div>
            </div>
          )}
          <div className="bg-accent/5 border border-accent/20 rounded-xl p-4">
            <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2"><IndianRupee className="w-4 h-4 text-accent" />Minimum Investment</h3>
            <div className="flex items-center justify-between">
              <div><p className="text-xs text-muted-foreground">Lot Size</p><p className="text-lg font-bold text-foreground">{ipo.lotSize} shares</p></div>
              <div className="text-right"><p className="text-xs text-muted-foreground">Amount</p><p className="text-lg font-bold text-accent">{ipo.minInvestment}</p></div>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={()=>ipo.rhpLink?window.open(ipo.rhpLink,'_blank'):null}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-accent to-accent/80 text-white rounded-lg font-semibold text-sm hover:shadow-lg transition-all flex items-center justify-center gap-2">
              <FileText className="w-4 h-4" />View RHP / DRHP
            </button>
            <button className="flex-1 py-3 px-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold text-sm hover:shadow-lg transition-all flex items-center justify-center gap-2">
              <ExternalLink className="w-4 h-4" />Apply via ASBA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── IPO CARD ─────────────────────────────────────────────────────────────────
function IPOCard({ ipo, onViewDetail, onEdit, onDelete }: {
  ipo: IPO; onViewDetail:()=>void; onEdit:()=>void; onDelete:()=>void;
}) {
  return (
    <div className="bg-card rounded-2xl border border-border shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group hover:-translate-y-1 flex flex-col">
      <div className="p-5 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">{ipo.logo}</div>
            <div className="min-w-0">
              <h3 className="font-bold text-foreground text-[15px] leading-tight truncate">{ipo.companyName}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{ipo.industry||'—'}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2">
            <button onClick={e=>{e.stopPropagation();onEdit();}} className="w-7 h-7 rounded-lg bg-accent/10 hover:bg-accent/20 flex items-center justify-center text-accent transition-all"><Edit3 className="w-3.5 h-3.5" /></button>
            <button onClick={e=>{e.stopPropagation();onDelete();}} className="w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center text-red-500 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
          </div>
        </div>
        <div className="flex items-center justify-between"><StatusBadge status={ipo.status} /><Stars rating={ipo.rating} /></div>
      </div>
      <div className="p-5 space-y-3 flex-1">
        {[['Price Band',ipo.priceRange,'font-bold text-foreground'],['Lot Size',`${ipo.lotSize} shares`,'font-semibold text-foreground'],['Min. Investment',ipo.minInvestment,'font-bold text-accent'],['Issue Size',ipo.issueSize,'font-semibold text-foreground']].map(([l,v,c]) => (
          <div key={l} className="flex items-center justify-between text-sm"><span className="text-muted-foreground">{l}</span><span className={c as string}>{v}</span></div>
        ))}
        <div className="border-t border-border/50 pt-3 space-y-2">
          <div className="flex items-center justify-between text-xs"><span className="text-muted-foreground flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />Open</span><span className="font-medium text-foreground">{ipo.openDate}</span></div>
          <div className="flex items-center justify-between text-xs"><span className="text-muted-foreground flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />Close</span><span className="font-medium text-foreground">{ipo.closeDate}</span></div>
          {ipo.listingDate && <div className="flex items-center justify-between text-xs"><span className="text-muted-foreground flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5" />Listing</span><span className="font-medium text-purple-600 dark:text-purple-400">{ipo.listingDate}</span></div>}
        </div>
        {ipo.subscriptionStatus && <div className="flex items-center justify-between p-2.5 bg-green-500/10 border border-green-500/20 rounded-lg"><span className="text-xs text-green-700 dark:text-green-400 font-medium flex items-center gap-1"><Users className="w-3.5 h-3.5" />Subscription</span><span className="text-xs font-bold text-green-700 dark:text-green-400">{ipo.subscriptionStatus}</span></div>}
        {ipo.gmp!=null&&ipo.gmp>0 && <div className="flex items-center justify-between p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-lg"><span className="text-xs text-blue-700 dark:text-blue-400 font-medium flex items-center gap-1"><Target className="w-3.5 h-3.5" />GMP</span><span className="text-xs font-bold text-blue-700 dark:text-blue-400">+₹{ipo.gmp}</span></div>}
        {ipo.listingGain!=null && (
          <div className={`flex items-center justify-between p-2.5 rounded-lg border ${ipo.listingGain>=0?'bg-green-500/10 border-green-500/20':'bg-red-500/10 border-red-500/20'}`}>
            <span className={`text-xs font-medium flex items-center gap-1 ${ipo.listingGain>=0?'text-green-700 dark:text-green-400':'text-red-700 dark:text-red-400'}`}>{ipo.listingGain>=0?<TrendingUp className="w-3.5 h-3.5"/>:<TrendingDown className="w-3.5 h-3.5"/>}Listing Gain</span>
            <span className={`text-xs font-bold ${ipo.listingGain>=0?'text-green-700 dark:text-green-400':'text-red-700 dark:text-red-400'}`}>{ipo.listingGain>=0?'+':''}{ipo.listingGain}%</span>
          </div>
        )}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-1"><span>Exchange</span><span className="font-semibold text-foreground">{ipo.exchange}</span></div>
      </div>
      <div className="px-5 pb-5">
        <button onClick={onViewDetail} className="w-full py-2.5 px-4 bg-gradient-to-r from-accent to-accent/80 text-white rounded-lg font-semibold text-sm hover:shadow-lg transition-all flex items-center justify-center gap-2 group/btn">
          View Details<ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function IPOPage() {
  const navigate = useNavigate();

  const [ipos,     setIpos]     = useState<IPO[]>([]);
  const [counts,   setCounts]   = useState<Counts>({ open:0, upcoming:0, closed:0, listed:0, total:0 });
  const [activeTab, setActiveTab] = useState<IPOStatus>('open');
  const [search,   setSearch]   = useState('');
  const [sortBy,   setSortBy]   = useState<'default'|'gmp'|'rating'>('default');
  const [catFilter, setCatFilter] = useState<''|'Mainboard'|'SME'>('');
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState<string|null>(null);

  const [selectedIPO, setSelectedIPO] = useState<IPO|null>(null);
  const [detailOpen,  setDetailOpen]  = useState(false);
  const [formOpen,    setFormOpen]    = useState(false);
  const [editIPO,     setEditIPO]     = useState<IPO|null>(null);
  const [saving,      setSaving]      = useState(false);
  const [deleting,    setDeleting]    = useState(false);

  const isSearching = search.trim().length > 0;
  const timer = useRef<any>(null);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchIPOs = useCallback(async () => {
    const params = new URLSearchParams();
    if (!isSearching) params.set('status', activeTab);
    else              params.set('search', search.trim());
    if (sortBy !== 'default') params.set('sort', sortBy);
    if (catFilter)            params.set('category', catFilter);

    setLoading(true); setError(null);
    try {
      const data = await callAPI(`${IPO_ENDPOINT}?${params}`);
      setIpos(data.ipos ?? []);
      setCounts(data.counts ?? { open:0, upcoming:0, closed:0, listed:0, total:0 });
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  }, [activeTab, search, sortBy, catFilter, isSearching]);

  useEffect(() => {
    clearTimeout(timer.current);
    timer.current = setTimeout(fetchIPOs, isSearching ? 400 : 0);
    return () => clearTimeout(timer.current);
  }, [fetchIPOs, isSearching]);

  // ── CRUD ───────────────────────────────────────────────────────────────────
  const handleAdd = async (data: Omit<IPO,'_id'>) => {
    setSaving(true);
    try { await callAPI(IPO_ENDPOINT,{method:'POST',body:JSON.stringify(data)}); setFormOpen(false); setEditIPO(null); await fetchIPOs(); }
    catch (e:any) { alert('❌ '+e.message); } finally { setSaving(false); }
  };

  const handleEdit = async (data: Omit<IPO,'_id'>) => {
    if (!editIPO) return;
    setSaving(true);
    try { await callAPI(`${IPO_ENDPOINT}/${editIPO._id}`,{method:'PUT',body:JSON.stringify(data)}); setFormOpen(false); setEditIPO(null); setDetailOpen(false); setSelectedIPO(null); await fetchIPOs(); }
    catch (e:any) { alert('❌ '+e.message); } finally { setSaving(false); }
  };

  const handleDelete = async (ipo: IPO) => {
    if (!confirm(`Are you sure you want to delete "${ipo.companyName}"?`)) return;
    setDeleting(true);
    try { await callAPI(`${IPO_ENDPOINT}/${ipo._id}`,{method:'DELETE'}); setDetailOpen(false); setSelectedIPO(null); await fetchIPOs(); }
    catch (e:any) { alert('❌ '+e.message); } finally { setDeleting(false); }
  };

  return (
    <>
    <Header /> 
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">

        {/* ── Header Banner ────────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-gradient-to-r from-navy via-navy-light to-accent py-12 md:py-16">
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
          <div className="absolute top-0 right-0 w-80 h-80 bg-accent/20 rounded-full blur-3xl pointer-events-none" />

          <div className="container mx-auto px-4 md:px-6 relative z-10">
          

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 mb-3">
                  <Zap className="w-3.5 h-3.5 text-yellow-400" />
                  <span className="text-xs font-medium text-white">Live IPO Tracker</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">All IPOs</h1>
                <p className="text-white/70 mt-1">
                  Total <span className="text-white font-bold">{counts.total}</span> IPOs — NSE / BSE / SME
                </p>
              </div>

              {/* Status count pills */}
              <div className="flex flex-wrap gap-2">
                {(['open','upcoming','closed','listed'] as IPOStatus[]).map(s => (
                  <button key={s} onClick={() => { setActiveTab(s); setSearch(''); }}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                      activeTab===s && !isSearching
                        ? 'bg-white/20 border-white/40 text-white'
                        : 'bg-white/5 border-white/15 text-white/60 hover:bg-white/10'
                    }`}>
                    {STATUS_CFG[s].label} ({counts[s]})
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Main Content ──────────────────────────────────────────────── */}
        <div className="container mx-auto px-4 md:px-6 py-8">

          {/* Controls */}
          <div className="flex flex-col md:flex-row gap-3 mb-6">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type="text" placeholder="Search by company name or industry…" value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-card border border-border rounded-xl pl-10 pr-10 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent/40 transition-all" />
              {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>}
            </div>

            {/* Sort */}
            <div className="relative">
              <select value={sortBy} onChange={e => setSortBy(e.target.value as any)}
                className="appearance-none bg-card border border-border rounded-xl pl-4 pr-9 py-3 text-sm text-foreground focus:outline-none focus:border-accent/40 cursor-pointer">
                <option value="default">Default</option>
                <option value="gmp">Sort: GMP ↓</option>
                <option value="rating">Sort: Rating ↓</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>

            {/* Category */}
            <div className="relative">
              <select value={catFilter} onChange={e => setCatFilter(e.target.value as any)}
                className="appearance-none bg-card border border-border rounded-xl pl-4 pr-9 py-3 text-sm text-foreground focus:outline-none focus:border-accent/40 cursor-pointer">
                <option value="">All Categories</option>
                <option value="Mainboard">Mainboard</option>
                <option value="SME">SME</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>

            <button onClick={fetchIPOs} disabled={loading}
              className="flex items-center gap-2 px-4 py-3 bg-card border border-border rounded-xl text-sm text-muted-foreground hover:text-foreground transition-all">
              <RefreshCw className={`w-4 h-4 ${loading?'animate-spin':''}`} />
            </button>

            <button onClick={() => { setEditIPO(null); setFormOpen(true); }}
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-accent to-accent/80 text-white rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-accent/20 transition-all whitespace-nowrap">
              <Plus className="w-4 h-4" />Add New IPO
            </button>
          </div>

          {/* Search info */}
          {isSearching && !loading && (
            <div className="flex items-center gap-2 mb-5 text-sm text-muted-foreground">
              <Search className="w-4 h-4" />
              <span>Found <strong className="text-foreground">{ipos.length}</strong> IPO{ipos.length !== 1 ? 's' : ''} for "{search}"</span>
              <button onClick={() => setSearch('')} className="ml-2 text-accent hover:underline text-xs">Clear</button>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <Loader2 className="w-10 h-10 text-accent animate-spin" />
              <p className="text-muted-foreground text-sm">Loading IPOs...</p>
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className="text-center py-16">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Something went wrong</h3>
              <p className="text-sm text-muted-foreground font-mono bg-card px-4 py-2 rounded-lg inline-block">{error}</p>
              <br />
              <button onClick={fetchIPOs} className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-accent/10 text-accent border border-accent/20 rounded-xl text-sm font-semibold hover:bg-accent/20 transition-all">
                <RefreshCw className="w-4 h-4" />Try Again
              </button>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && ipos.length === 0 && (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-10 h-10 text-accent/40" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {isSearching ? `No results found for "${search}"` : `No ${STATUS_CFG[activeTab].label} IPOs found`}
              </h3>
              <p className="text-muted-foreground mb-5">Add a new IPO to get started!</p>
              <button onClick={() => { setEditIPO(null); setFormOpen(true); }}
                className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-accent to-accent/80 text-white rounded-xl font-bold text-sm hover:shadow-lg transition-all">
                <Plus className="w-4 h-4" />Add New IPO
              </button>
            </div>
          )}

          {/* ALL Cards — no pagination limit */}
          {!loading && !error && ipos.length > 0 && (
            <>
              <p className="text-sm text-muted-foreground mb-4">
                <span className="text-foreground font-semibold">{ipos.length}</span> IPO{ipos.length !== 1 ? 's' : ''} showing
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {ipos.map(ipo => (
                  <IPOCard key={ipo._id} ipo={ipo}
                    onViewDetail={() => { setSelectedIPO(ipo); setDetailOpen(true); }}
                    onEdit={() => { setEditIPO(ipo); setFormOpen(true); }}
                    onDelete={() => handleDelete(ipo)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      <Footer /> 

      {/* Detail Modal */}
      {detailOpen && selectedIPO && !formOpen && (
        <DetailModal ipo={selectedIPO}
          onClose={() => { setDetailOpen(false); setSelectedIPO(null); }}
          onEdit={() => { setEditIPO(selectedIPO); setFormOpen(true); }}
          onDelete={() => handleDelete(selectedIPO)}
          deleting={deleting}
        />
      )}

      {/* Form Modal */}
      {formOpen && (
        <FormModal
          initial={editIPO ?? undefined}
          onSave={editIPO ? handleEdit : handleAdd}
          onClose={() => { setFormOpen(false); setEditIPO(null); }}
          saving={saving}
        />
      )}
    </>
  );
}