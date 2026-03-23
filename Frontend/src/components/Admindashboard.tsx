/**
 * AdminDashboard.tsx
 * Full light/dark mode · Fully mobile responsive · Production ready
 * Security: renders blank <div/> for non-admins
 */
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/controllers/AuthContext";
import { useTheme } from "@/controllers/Themecontext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Users, ShieldCheck, IndianRupee, CheckCircle2, XCircle,
  AlertCircle, Search, RefreshCw, Crown, Mail, Chrome,
  Gift, Trash2, Eye, EyeOff, X, BookOpen, BarChart3,
  Lightbulb, Menu, ChevronDown, ArrowLeft,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Subscription {
  plan: string; amount: number; currency: string;
  status: "active"|"expired"|"revoked"|"pending";
  startDate: string; endDate: string;
  daysRemaining: number; razorpayPaymentId: string | null;
}
interface AdminUser {
  _id: string; name: string; email: string;
  image: string | null; authType: "google"|"email";
  isAdmin: boolean; createdAt: string;
  subscription: Subscription | null;
}
interface AdminStats {
  totalUsers: number; googleUsers: number; emailUsers: number;
  activeSubscriptions: number; totalSubscriptions: number;
  totalRevenue: number; planBreakdown: Record<string,number>;
}

// ─── Plan config (matches PricingPlan.tsx) ────────────────────────────────────
const PLAN_CFG: Record<string,{ color:string; icon:any; label:string }> = {
  foundation: { color:"#22c55e", icon:BookOpen,  label:"Foundation" },
  command:    { color:"#3b82f6", icon:BarChart3,  label:"Command"    },
  edge:       { color:"#a855f7", icon:Lightbulb, label:"Edge"       },
  free:       { color:"#94a3b8", icon:Crown,     label:"Free"       },
  basic:      { color:"#60a5fa", icon:Crown,     label:"Basic"      },
  pro:        { color:"#5194F6", icon:Crown,     label:"Pro"        },
  elite:      { color:"#f59e0b", icon:Crown,     label:"Elite"      },
};
const getPlan = (key?:string) => PLAN_CFG[key||""] ?? PLAN_CFG.free;

const STS: Record<string,{bg:string;text:string;label:string}> = {
  active:  {bg:"rgba(34,197,94,0.12)",  text:"#16a34a", label:"Active"  },
  expired: {bg:"rgba(239,68,68,0.10)",  text:"#dc2626", label:"Expired" },
  revoked: {bg:"rgba(239,68,68,0.10)",  text:"#dc2626", label:"Revoked" },
  pending: {bg:"rgba(234,179,8,0.12)",  text:"#ca8a04", label:"Pending" },
};

// ─── Theme ────────────────────────────────────────────────────────────────────
const tok = (light:boolean) => ({
  pageBg:   light?"#f1f5f9":"#070d1a",
  cardBg:   light?"#ffffff":"#0f1829",
  cardBg2:  light?"#f8fafc":"#111e30",
  border:   light?"rgba(226,232,240,0.9)":"rgba(255,255,255,0.07)",
  text:     light?"#0f172a":"#e2e8f0",
  muted:    light?"#64748b":"#64748b",
  inputBg:  light?"#ffffff":"#0a1220",
  accentBg: light?"rgba(81,148,246,0.08)":"rgba(81,148,246,0.12)",
  accentBdr:"rgba(81,148,246,0.25)",
  shadow:   light?"0 1px 4px rgba(0,0,0,0.07)":"0 1px 4px rgba(0,0,0,0.4)",
});

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n:number) =>
  new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(n);
const fmtD = (d:string) =>
  new Date(d).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"});
const ini = (name:string) =>
  name.split(" ").slice(0,2).map(w=>w[0]).join("").toUpperCase();

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({icon:Icon,label,value,sub,color,t}:any) => (
  <div style={{
    background:t.cardBg, border:`1px solid ${t.border}`,
    borderRadius:14, padding:"16px 18px", boxShadow:t.shadow,
  }}>
    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
      <div style={{
        width:34,height:34,borderRadius:10,
        background:`${color}18`,border:`1px solid ${color}30`,
        display:"flex",alignItems:"center",justifyContent:"center",
      }}>
        <Icon size={15} color={color}/>
      </div>
      <span style={{fontSize:11,fontWeight:600,color:t.muted,letterSpacing:"0.03em"}}>{label}</span>
    </div>
    <div style={{fontSize:24,fontWeight:800,color:t.text,letterSpacing:"-0.5px",lineHeight:1}}>{value}</div>
    {sub&&<div style={{fontSize:11,color:t.muted,marginTop:4}}>{sub}</div>}
  </div>
);

// ─── Grant Modal ──────────────────────────────────────────────────────────────
const GrantModal = ({target,t,onClose,onGrant}:any) => {
  const [plan,setPlan] = useState("command");
  const [days,setDays] = useState(30);
  const [amt,setAmt]   = useState(0);
  const [busy,setBusy] = useState(false);
  const inp:React.CSSProperties = {
    width:"100%",padding:"9px 12px",borderRadius:10,
    background:t.inputBg,border:`1px solid ${t.border}`,
    color:t.text,fontSize:13,outline:"none",boxSizing:"border-box",marginBottom:12,
  };
  const submit = async () => {
    setBusy(true);
    await onGrant(target.userId,{plan,durationDays:days,amount:amt});
    setBusy(false); onClose();
  };
  return (
    <div style={{
      position:"fixed",inset:0,zIndex:9999,
      background:"rgba(0,0,0,0.55)",backdropFilter:"blur(4px)",
      display:"flex",alignItems:"center",justifyContent:"center",padding:16,
    }} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{
        background:t.cardBg,border:`1px solid ${t.border}`,
        borderRadius:20,padding:"24px 20px",width:"100%",maxWidth:400,
        boxShadow:"0 24px 60px rgba(0,0,0,0.35)",
      }}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:18}}>
          <div>
            <div style={{fontSize:16,fontWeight:700,color:t.text}}>Grant Subscription</div>
            <div style={{fontSize:12,color:t.muted,marginTop:2}}>
              for <span style={{color:"#5194F6",fontWeight:600}}>{target.name}</span>
            </div>
          </div>
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:t.muted,padding:4}}>
            <X size={18}/>
          </button>
        </div>

        <div style={{fontSize:10,fontWeight:700,color:t.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:8}}>
          Select Plan
        </div>
        <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>
          {["foundation","command","edge"].map(p=>{
            const c=getPlan(p);
            return (
              <button key={p} onClick={()=>setPlan(p)} style={{
                flex:1,minWidth:80,padding:"9px 4px",borderRadius:10,cursor:"pointer",
                fontSize:12,fontWeight:700,
                background:plan===p?c.color:`${c.color}15`,
                color:plan===p?"white":c.color,
                border:`1.5px solid ${plan===p?c.color:`${c.color}30`}`,
                display:"flex",flexDirection:"column",alignItems:"center",gap:3,transition:"all 0.15s",
              }}>
                <c.icon size={13}/>{c.label}
              </button>
            );
          })}
        </div>

        <div style={{fontSize:10,fontWeight:700,color:t.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:6}}>
          Duration (days)
        </div>
        <input type="number" min={1} value={days} onChange={e=>setDays(+e.target.value)} style={inp}/>

        <div style={{fontSize:10,fontWeight:700,color:t.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:6}}>
          Amount ₹ (0 = free grant)
        </div>
        <input type="number" min={0} value={amt} onChange={e=>setAmt(+e.target.value)} style={{...inp,marginBottom:18}}/>

        <div style={{display:"flex",gap:8}}>
          <button onClick={onClose} style={{
            flex:1,padding:"11px 0",borderRadius:12,cursor:"pointer",
            background:t.accentBg,border:`1px solid ${t.accentBdr}`,
            color:"#5194F6",fontSize:13,fontWeight:600,
          }}>Cancel</button>
          <button onClick={submit} disabled={busy} style={{
            flex:2,padding:"11px 0",borderRadius:12,cursor:"pointer",
            background:"linear-gradient(135deg,#5194F6,#3a7de0)",
            border:"none",color:"white",fontSize:13,fontWeight:700,opacity:busy?0.6:1,
          }}>
            {busy?"Granting…":`Grant ${getPlan(plan).label} — ${days}d`}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Desktop User Row ─────────────────────────────────────────────────────────
const UserRow = ({u,t,expanded,onExpand,onGrant,onRevoke}:any) => {
  const sub  = u.subscription;
  const plan = getPlan(sub?.plan);
  const sts  = STS[sub?.status||""]||null;
  const c:React.CSSProperties = {padding:"13px 16px",verticalAlign:"middle"};

  return (
    <>
      <tr style={{borderBottom:`1px solid ${t.border}`,background:expanded?t.accentBg:"transparent",transition:"background 0.15s"}}>
        <td style={c}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{
              width:34,height:34,borderRadius:"50%",flexShrink:0,overflow:"hidden",
              background:`${plan.color}20`,border:`1.5px solid ${plan.color}30`,
              display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:12,fontWeight:700,color:plan.color,
            }}>
              {u.image?<img src={u.image} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:ini(u.name)}
            </div>
            <div>
              <div style={{display:"flex",alignItems:"center",gap:5}}>
                <span style={{fontSize:13,fontWeight:600,color:t.text}}>{u.name}</span>
                {u.isAdmin&&<span style={{fontSize:9,fontWeight:800,color:"#f59e0b",background:"rgba(245,158,11,0.12)",borderRadius:4,padding:"1px 5px",textTransform:"uppercase"}}>ADMIN</span>}
              </div>
              <span style={{fontSize:11,color:t.muted}}>{u.email}</span>
            </div>
          </div>
        </td>
        <td style={c}>
          <span style={{
            display:"inline-flex",alignItems:"center",gap:4,fontSize:11,fontWeight:600,
            padding:"3px 9px",borderRadius:20,
            background:u.authType==="google"?"rgba(52,168,83,0.1)":t.accentBg,
            color:u.authType==="google"?"#16a34a":"#5194F6",
          }}>
            {u.authType==="google"?<Chrome size={10}/>:<Mail size={10}/>}
            {u.authType==="google"?"Google":"Email"}
          </span>
        </td>
        <td style={c}>
          {sub?(
            <div>
              <span style={{display:"inline-flex",alignItems:"center",gap:4,fontSize:11,fontWeight:700,padding:"3px 9px",borderRadius:20,background:`${plan.color}15`,color:plan.color}}>
                <plan.icon size={10}/>{plan.label}
              </span>
              <div style={{fontSize:11,color:t.muted,marginTop:3}}>{fmt(sub.amount)} · {sub.daysRemaining}d left</div>
            </div>
          ):<span style={{fontSize:12,color:t.muted}}>—</span>}
        </td>
        <td style={c}>
          {sts?(
            <span style={{display:"inline-flex",alignItems:"center",gap:4,fontSize:11,fontWeight:600,padding:"3px 9px",borderRadius:20,background:sts.bg,color:sts.text}}>
              {sub?.status==="active"?<CheckCircle2 size={11}/>:sub?.status==="pending"?<AlertCircle size={11}/>:<XCircle size={11}/>}
              {sts.label}
            </span>
          ):<span style={{fontSize:12,color:t.muted}}>No plan</span>}
        </td>
        <td style={c}><span style={{fontSize:12,color:t.muted}}>{fmtD(u.createdAt)}</span></td>
        <td style={{...c,whiteSpace:"nowrap"}}>
          <div style={{display:"flex",gap:6}}>
            <button onClick={()=>onExpand(u._id)} style={{padding:"5px 9px",borderRadius:8,cursor:"pointer",fontSize:11,fontWeight:600,background:t.accentBg,border:`1px solid ${t.accentBdr}`,color:"#5194F6",display:"flex",alignItems:"center",gap:3}}>
              {expanded?<EyeOff size={11}/>:<Eye size={11}/>}{expanded?"Hide":"View"}
            </button>
            <button onClick={()=>onGrant(u._id,u.name)} style={{padding:"5px 9px",borderRadius:8,cursor:"pointer",fontSize:11,fontWeight:600,background:"rgba(34,197,94,0.1)",border:"1px solid rgba(34,197,94,0.2)",color:"#16a34a",display:"flex",alignItems:"center",gap:3}}>
              <Gift size={11}/>Grant
            </button>
            {sub?.status==="active"&&(
              <button onClick={()=>onRevoke(u._id)} style={{padding:"5px 8px",borderRadius:8,cursor:"pointer",background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.2)",color:"#dc2626",display:"flex",alignItems:"center"}}>
                <Trash2 size={11}/>
              </button>
            )}
          </div>
        </td>
      </tr>
      {expanded&&(
        <tr style={{background:t.accentBg}}>
          <td colSpan={6} style={{padding:"12px 24px 16px"}}>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:14}}>
              {[
                {l:"User ID",v:u._id,mono:true},
                {l:"Auth",v:u.authType==="google"?"Google OAuth":"Email / Password"},
                {l:"Registered",v:fmtD(u.createdAt)},
                ...(sub?[
                  {l:"Plan",v:getPlan(sub.plan).label},
                  {l:"Amount paid",v:fmt(sub.amount)},
                  {l:"Starts",v:fmtD(sub.startDate)},
                  {l:"Expires",v:fmtD(sub.endDate)},
                  {l:"Days remaining",v:`${sub.daysRemaining} days`},
                  ...(sub.razorpayPaymentId?[{l:"Razorpay ID",v:sub.razorpayPaymentId,mono:true}]:[{l:"Source",v:"Admin granted"}]),
                ]:[{l:"Subscription",v:"No active plan"}]),
              ].map(({l,v,mono}:any)=>(
                <div key={l}>
                  <div style={{fontSize:10,fontWeight:700,color:t.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:2}}>{l}</div>
                  <div style={{fontSize:12,color:t.text,fontFamily:mono?"monospace":"inherit",wordBreak:"break-all"}}>{v}</div>
                </div>
              ))}
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

// ─── Mobile User Card ─────────────────────────────────────────────────────────
const MobileCard = ({u,t,onGrant,onRevoke}:any) => {
  const [open,setOpen] = useState(false);
  const sub  = u.subscription;
  const plan = getPlan(sub?.plan);
  const sts  = STS[sub?.status||""]||null;
  return (
    <div style={{background:t.cardBg,border:`1px solid ${t.border}`,borderRadius:14,overflow:"hidden",marginBottom:10,boxShadow:t.shadow}}>
      <div style={{padding:"13px 15px",cursor:"pointer",display:"flex",alignItems:"center",gap:11}} onClick={()=>setOpen(o=>!o)}>
        <div style={{
          width:38,height:38,borderRadius:"50%",flexShrink:0,overflow:"hidden",
          background:`${plan.color}20`,border:`1.5px solid ${plan.color}30`,
          display:"flex",alignItems:"center",justifyContent:"center",
          fontSize:13,fontWeight:700,color:plan.color,
        }}>
          {u.image?<img src={u.image} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:ini(u.name)}
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",alignItems:"center",gap:5,flexWrap:"wrap"}}>
            <span style={{fontSize:13,fontWeight:700,color:t.text}}>{u.name}</span>
            {u.isAdmin&&<span style={{fontSize:9,fontWeight:800,color:"#f59e0b",background:"rgba(245,158,11,0.12)",borderRadius:4,padding:"1px 5px",textTransform:"uppercase"}}>ADMIN</span>}
          </div>
          <div style={{fontSize:11,color:t.muted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{u.email}</div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:7,flexShrink:0}}>
          {sub&&sts&&<span style={{fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:20,background:sts.bg,color:sts.text}}>{sts.label}</span>}
          {sub&&<span style={{fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:20,background:`${plan.color}15`,color:plan.color}}>{plan.label}</span>}
          <ChevronDown size={15} color={t.muted} style={{transform:open?"rotate(180deg)":"none",transition:"transform 0.2s"}}/>
        </div>
      </div>
      {open&&(
        <div style={{borderTop:`1px solid ${t.border}`,padding:"14px 15px"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
            {[
              {l:"Auth",v:u.authType==="google"?"Google":"Email"},
              {l:"Joined",v:fmtD(u.createdAt)},
              ...(sub?[
                {l:"Amount",v:fmt(sub.amount)},
                {l:"Expires",v:fmtD(sub.endDate)},
                {l:"Days left",v:`${sub.daysRemaining}d`},
                {l:"Status",v:sts?.label||"—"},
              ]:[]),
            ].map(({l,v}:any)=>(
              <div key={l}>
                <div style={{fontSize:10,fontWeight:700,color:t.muted,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:2}}>{l}</div>
                <div style={{fontSize:12,color:t.text,fontWeight:500}}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>onGrant(u._id,u.name)} style={{
              flex:1,padding:"9px 0",borderRadius:10,cursor:"pointer",fontSize:12,fontWeight:700,
              background:"rgba(34,197,94,0.1)",border:"1px solid rgba(34,197,94,0.2)",color:"#16a34a",
              display:"flex",alignItems:"center",justifyContent:"center",gap:5,
            }}>
              <Gift size={13}/>Grant Plan
            </button>
            {sub?.status==="active"&&(
              <button onClick={()=>onRevoke(u._id)} style={{
                padding:"9px 14px",borderRadius:10,cursor:"pointer",fontSize:12,fontWeight:600,
                background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.2)",color:"#dc2626",
                display:"flex",alignItems:"center",gap:4,
              }}>
                <Trash2 size={13}/>Revoke
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const { isAdmin, user } = useAuth();
  const { theme } = useTheme();
  const navigate  = useNavigate();
  const isLight   = theme === "light";
  const t         = tok(isLight);

  const [users,setUsers]     = useState<AdminUser[]>([]);
  const [stats,setStats]     = useState<AdminStats|null>(null);
  const [loading,setLoading] = useState(true);
  const [search,setSearch]   = useState("");
  const [fAuth,setFAuth]     = useState<"all"|"google"|"email">("all");
  const [fSub,setFSub]       = useState<"all"|"active"|"none">("all");
  const [sortBy,setSortBy]   = useState<"date"|"name"|"plan">("date");
  const [expId,setExpId]     = useState<string|null>(null);
  const [grantT,setGrantT]   = useState<{userId:string;name:string}|null>(null);
  const [isMobile,setIsMobile] = useState(window.innerWidth < 768);
  const [navOpen,setNavOpen]   = useState(false);

  if (!isAdmin) return <div/>;

  const API    = import.meta.env.VITE_API_URL || "";
  const SEG    = import.meta.env.VITE_ADMIN_SEGMENT || "xp-insights-42";
  const ADMIN  = `${API}/api/v1/${SEG}`;

  useEffect(()=>{
    const fn=()=>setIsMobile(window.innerWidth<768);
    window.addEventListener("resize",fn);
    return ()=>window.removeEventListener("resize",fn);
  },[]);

  const load = useCallback(async()=>{
    setLoading(true);
    try {
      const [ur,sr] = await Promise.all([
        axios.get(`${ADMIN}/users`,{withCredentials:true}),
        axios.get(`${ADMIN}/stats`,{withCredentials:true}),
      ]);
      setUsers(ur.data.data.users||[]);
      setStats(sr.data.data);
    } catch(e){console.error(e);}
    finally{setLoading(false);}
  },[ADMIN]);

  useEffect(()=>{load();},[load]);

  const doGrant = async(userId:string,body:any)=>{
    await axios.patch(`${ADMIN}/subscription/${userId}`,body,{withCredentials:true});
    await load();
  };
  const doRevoke = async(userId:string)=>{
    if(!confirm("Revoke subscription?")) return;
    await axios.delete(`${ADMIN}/subscription/${userId}`,{withCredentials:true});
    await load();
  };

  const filtered = users.filter(u=>{
    const q=search.toLowerCase();
    if(q&&!u.name.toLowerCase().includes(q)&&!u.email.toLowerCase().includes(q)) return false;
    if(fAuth!=="all"&&u.authType!==fAuth) return false;
    if(fSub==="active"&&u.subscription?.status!=="active") return false;
    if(fSub==="none"&&u.subscription!==null) return false;
    return true;
  }).sort((a,b)=>{
    if(sortBy==="date") return new Date(b.createdAt).getTime()-new Date(a.createdAt).getTime();
    if(sortBy==="name") return a.name.localeCompare(b.name);
    const o=["edge","command","foundation","free",""];
    return o.indexOf(a.subscription?.plan||"")-o.indexOf(b.subscription?.plan||"");
  });

  const pill=(active:boolean,color:string):React.CSSProperties=>({
    padding:"6px 13px",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:600,
    border:"none",background:active?color:`${color}12`,
    color:active?"white":color,transition:"all 0.15s",
  });

  return (
    <div style={{background:t.pageBg,minHeight:"100vh",fontFamily:"system-ui,-apple-system,sans-serif"}}>
      {/* ── Navbar ── */}
      <div style={{
        background:t.cardBg,borderBottom:`1px solid ${t.border}`,
        padding:"0 20px",position:"sticky",top:0,zIndex:100,boxShadow:t.shadow,
      }}>
        <div style={{maxWidth:1280,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",height:56}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:32,height:32,borderRadius:9,background:"linear-gradient(135deg,#5194F6,#3a7de0)",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <ShieldCheck size={16} color="white"/>
            </div>
            <div>
              <div style={{fontSize:14,fontWeight:800,color:t.text,lineHeight:1}}>Admin Panel</div>
              <div style={{fontSize:10,color:t.muted}}>InvestBeans</div>
            </div>
          </div>

          {!isMobile?(
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:12,color:t.muted}}>
                Logged in as <strong style={{color:"#5194F6"}}>{user?.email}</strong>
              </span>
              <button onClick={load} disabled={loading} style={{
                display:"flex",alignItems:"center",gap:5,padding:"7px 13px",borderRadius:10,cursor:"pointer",
                background:t.accentBg,border:`1px solid ${t.accentBdr}`,color:"#5194F6",fontSize:12,fontWeight:600,
                opacity:loading?0.5:1,
              }}>
                <RefreshCw size={12} style={{animation:loading?"spin 1s linear infinite":"none"}}/>Refresh
              </button>
              <button onClick={()=>navigate("/")} style={{
                display:"flex",alignItems:"center",gap:5,padding:"7px 13px",borderRadius:10,cursor:"pointer",
                background:"transparent",border:`1px solid ${t.border}`,color:t.muted,fontSize:12,fontWeight:600,
              }}>
                <ArrowLeft size={12}/>Home
              </button>
            </div>
          ):(
            <button onClick={()=>setNavOpen(o=>!o)} style={{background:"none",border:"none",cursor:"pointer",color:t.text,padding:6}}>
              {navOpen?<X size={20}/>:<Menu size={20}/>}
            </button>
          )}
        </div>
        {isMobile&&navOpen&&(
          <div style={{borderTop:`1px solid ${t.border}`,padding:"12px 0 14px",display:"flex",flexDirection:"column",gap:8}}>
            <span style={{fontSize:12,color:t.muted}}><strong style={{color:"#5194F6"}}>{user?.email}</strong></span>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>{load();setNavOpen(false);}} style={{flex:1,padding:"8px 0",borderRadius:10,cursor:"pointer",background:t.accentBg,border:`1px solid ${t.accentBdr}`,color:"#5194F6",fontSize:12,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
                <RefreshCw size={12}/>Refresh
              </button>
              <button onClick={()=>navigate("/")} style={{flex:1,padding:"8px 0",borderRadius:10,cursor:"pointer",background:"transparent",border:`1px solid ${t.border}`,color:t.muted,fontSize:12,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
                <ArrowLeft size={12}/>Home
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Body ── */}
      <div style={{maxWidth:1280,margin:"0 auto",padding:isMobile?"14px 12px":"22px 20px"}}>

        {/* Stats */}
        {stats&&(
          <div style={{
            display:"grid",
            gridTemplateColumns:isMobile?"repeat(2,1fr)":"repeat(auto-fit,minmax(175px,1fr))",
            gap:12,marginBottom:18,
          }}>
            <StatCard t={t} icon={Users}        label="Total Users"    value={stats.totalUsers}              sub={`${stats.googleUsers}G · ${stats.emailUsers}E`} color="#5194F6"/>
            <StatCard t={t} icon={Chrome}       label="Google Users"   value={stats.googleUsers}             sub="OAuth"          color="#34a853"/>
            <StatCard t={t} icon={CheckCircle2} label="Active Plans"   value={stats.activeSubscriptions}     sub={`of ${stats.totalSubscriptions}`} color="#22c55e"/>
            <StatCard t={t} icon={IndianRupee}  label="Revenue"        value={fmt(stats.totalRevenue)}       sub="Active subs"    color="#f59e0b"/>
            {Object.entries(stats.planBreakdown).map(([p,n])=>(
              <StatCard key={p} t={t} icon={getPlan(p).icon} label={`${getPlan(p).label} subscribers`} value={n} color={getPlan(p).color}/>
            ))}
          </div>
        )}

        {/* Filters */}
        <div style={{
          background:t.cardBg,border:`1px solid ${t.border}`,borderRadius:14,
          padding:isMobile?"12px 13px":"14px 18px",marginBottom:14,
          display:"flex",flexWrap:"wrap",gap:9,alignItems:"center",boxShadow:t.shadow,
        }}>
          <div style={{position:"relative",flex:"1 1 180px",minWidth:150}}>
            <Search size={13} style={{position:"absolute",left:9,top:"50%",transform:"translateY(-50%)",color:t.muted}}/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search users…" style={{
              width:"100%",padding:"8px 10px 8px 28px",background:t.inputBg,border:`1px solid ${t.border}`,
              borderRadius:10,color:t.text,fontSize:13,outline:"none",boxSizing:"border-box",
            }}/>
          </div>
          <div style={{display:"flex",gap:4}}>
            {(["all","google","email"]as const).map(f=>(
              <button key={f} onClick={()=>setFAuth(f)} style={pill(fAuth===f,"#5194F6")}>
                {f==="all"?"All":f.charAt(0).toUpperCase()+f.slice(1)}
              </button>
            ))}
          </div>
          <div style={{display:"flex",gap:4}}>
            {(["all","active","none"]as const).map(f=>(
              <button key={f} onClick={()=>setFSub(f)} style={pill(fSub===f,"#22c55e")}>
                {f==="all"?"All Plans":f==="active"?"Active":"No Plan"}
              </button>
            ))}
          </div>
          <select value={sortBy} onChange={e=>setSortBy(e.target.value as any)} style={{
            padding:"7px 10px",borderRadius:10,fontSize:12,cursor:"pointer",
            background:t.inputBg,border:`1px solid ${t.border}`,color:t.text,outline:"none",
          }}>
            <option value="date">Newest</option>
            <option value="name">Name A–Z</option>
            <option value="plan">Plan tier</option>
          </select>
          <span style={{marginLeft:"auto",fontSize:12,color:t.muted,whiteSpace:"nowrap"}}>
            {filtered.length} / {users.length}
          </span>
        </div>

        {/* List */}
        {loading?(
          <div style={{background:t.cardBg,border:`1px solid ${t.border}`,borderRadius:14,padding:"60px 20px",textAlign:"center"}}>
            <RefreshCw size={24} color={t.muted} style={{animation:"spin 1s linear infinite",margin:"0 auto 12px",display:"block"}}/>
            <div style={{fontSize:13,color:t.muted}}>Loading users…</div>
          </div>
        ):filtered.length===0?(
          <div style={{background:t.cardBg,border:`1px solid ${t.border}`,borderRadius:14,padding:"60px 20px",textAlign:"center"}}>
            <Users size={28} color={t.muted} style={{margin:"0 auto 12px",display:"block",opacity:0.3}}/>
            <div style={{fontSize:13,color:t.muted}}>No users match filters</div>
          </div>
        ):isMobile?(
          filtered.map(u=>(
            <MobileCard key={u._id} u={u} t={t}
              onGrant={(id:string,name:string)=>setGrantT({userId:id,name})}
              onRevoke={doRevoke}
            />
          ))
        ):(
          <div style={{background:t.cardBg,border:`1px solid ${t.border}`,borderRadius:14,overflow:"hidden",boxShadow:t.shadow}}>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",minWidth:760}}>
                <thead>
                  <tr style={{borderBottom:`1px solid ${t.border}`,background:t.cardBg2}}>
                    {["User","Auth","Plan","Status","Joined","Actions"].map(h=>(
                      <th key={h} style={{padding:"12px 16px",textAlign:"left",fontSize:11,fontWeight:700,color:t.muted,textTransform:"uppercase",letterSpacing:"0.06em"}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(u=>(
                    <UserRow key={u._id} u={u} t={t}
                      expanded={expId===u._id}
                      onExpand={(id:string)=>setExpId(expId===id?null:id)}
                      onGrant={(id:string,name:string)=>setGrantT({userId:id,name})}
                      onRevoke={doRevoke}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {grantT&&<GrantModal target={grantT} t={t} onClose={()=>setGrantT(null)} onGrant={doGrant}/>}
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </div>
  );
}