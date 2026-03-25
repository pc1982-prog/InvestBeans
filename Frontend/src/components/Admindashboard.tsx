
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/controllers/AuthContext";
import { useTheme } from "@/controllers/Themecontext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Users, ShieldCheck, IndianRupee, CheckCircle2, XCircle,
  Search, RefreshCw, Crown, Mail, Chrome,
  Gift, Trash2, BookOpen, BarChart3, Lightbulb,
  Menu, ArrowLeft, X, UserPlus, Clock, CalendarDays,
  BadgeCheck, Hourglass, TrendingUp,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Subscription {
  plan: string; amount: number; currency: string;
  status: "active"|"expired"|"revoked"|"pending"|"pending_email";
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
  pendingEmailGrants?: number;
}

// ─── Plan config ──────────────────────────────────────────────────────────────
const PLAN_CFG: Record<string,{color:string;gradient:string;icon:any;label:string}> = {
  foundation: {color:"#22c55e",gradient:"135deg,#22c55e,#16a34a",icon:BookOpen, label:"Foundation"},
  command:    {color:"#3b82f6",gradient:"135deg,#3b82f6,#2563eb",icon:BarChart3, label:"Command"  },
  edge:       {color:"#a855f7",gradient:"135deg,#a855f7,#7c3aed",icon:Lightbulb,label:"Edge"     },
  free:       {color:"#94a3b8",gradient:"135deg,#94a3b8,#64748b",icon:Crown,    label:"Free"     },
  basic:      {color:"#60a5fa",gradient:"135deg,#60a5fa,#3b82f6",icon:Crown,    label:"Basic"    },
  pro:        {color:"#5194F6",gradient:"135deg,#5194F6,#3a7de0",icon:Crown,    label:"Pro"      },
  elite:      {color:"#f59e0b",gradient:"135deg,#f59e0b,#d97706",icon:Crown,    label:"Elite"    },
};
const getPlan = (key?:string) => PLAN_CFG[key||""] ?? PLAN_CFG.free;

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
  shadow2:  light?"0 4px 20px rgba(0,0,0,0.08)":"0 4px 20px rgba(0,0,0,0.4)",
});

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt  = (n:number) =>
  new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(n);
const fmtD = (d:string) =>
  new Date(d).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"});
const ini  = (name:string) =>
  name.split(" ").slice(0,2).map(w=>w[0]).join("").toUpperCase();

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({icon:Icon,label,value,sub,color,t}:any) => (
  <div style={{background:t.cardBg,border:`1px solid ${t.border}`,borderRadius:14,padding:"16px 18px",boxShadow:t.shadow}}>
    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
      <div style={{width:34,height:34,borderRadius:10,background:`${color}18`,border:`1px solid ${color}30`,display:"flex",alignItems:"center",justifyContent:"center"}}>
        <Icon size={15} color={color}/>
      </div>
      <span style={{fontSize:11,fontWeight:600,color:t.muted,letterSpacing:"0.03em"}}>{label}</span>
    </div>
    <div style={{fontSize:24,fontWeight:800,color:t.text,letterSpacing:"-0.5px",lineHeight:1}}>{value}</div>
    {sub&&<div style={{fontSize:11,color:t.muted,marginTop:4}}>{sub}</div>}
  </div>
);

// ─── Days remaining progress bar ──────────────────────────────────────────────
const DaysBar = ({sub,color,t}:any) => {
  if(!sub) return null;
  const total = Math.ceil((new Date(sub.endDate).getTime()-new Date(sub.startDate).getTime())/86_400_000);
  const pct   = total>0 ? Math.max(0,Math.min(100,(sub.daysRemaining/total)*100)) : 0;
  const barColor = pct>50?"#22c55e":pct>20?"#f59e0b":"#ef4444";
  return (
    <div style={{marginTop:10}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
        <span style={{fontSize:10,fontWeight:600,color:t.muted}}>Time remaining</span>
        <span style={{fontSize:10,fontWeight:700,color:barColor}}>{sub.daysRemaining} days left</span>
      </div>
      <div style={{height:4,borderRadius:99,background:`${color}20`,overflow:"hidden"}}>
        <div style={{height:"100%",borderRadius:99,width:`${pct}%`,background:`linear-gradient(90deg,${barColor},${barColor}88)`,transition:"width 0.5s"}}/>
      </div>
    </div>
  );
};

// ─── Subscribed User Card ─────────────────────────────────────────────────────
const SubscribedUserCard = ({u,t,isMobile,onGrant,onRevoke}:any) => {
  const sub       = u.subscription!;
  const plan      = getPlan(sub.plan);
  const isPending = sub.status==="pending_email";
  const isActive  = sub.status==="active";

  return (
    <div style={{
      background:t.cardBg,
      border:`1px solid ${isActive?`${plan.color}30`:t.border}`,
      borderRadius:16,overflow:"hidden",
      boxShadow:isActive?`0 0 0 1px ${plan.color}15,${t.shadow2}`:t.shadow,
    }}>
      <div style={{height:3,background:`linear-gradient(${plan.gradient})`,opacity:isActive?1:0.35}}/>
      <div style={{padding:"16px 18px"}}>

        {/* User info + plan badge */}
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:12,marginBottom:14}}>
          <div style={{display:"flex",alignItems:"center",gap:10,minWidth:0}}>
            <div style={{
              width:42,height:42,borderRadius:"50%",flexShrink:0,overflow:"hidden",
              background:`linear-gradient(${plan.gradient})`,
              display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:14,fontWeight:800,color:"white",
            }}>
              {u.image?<img src={u.image} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:ini(u.name)}
            </div>
            <div style={{minWidth:0}}>
              <div style={{display:"flex",alignItems:"center",gap:5,flexWrap:"wrap"}}>
                <span style={{fontSize:14,fontWeight:700,color:t.text}}>{u.name}</span>
                {u.isAdmin&&<span style={{fontSize:9,fontWeight:800,color:"#f59e0b",background:"rgba(245,158,11,0.12)",borderRadius:4,padding:"1px 5px",textTransform:"uppercase"}}>ADMIN</span>}
              </div>
              <div style={{fontSize:11,color:t.muted,marginTop:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{u.email}</div>
              <span style={{display:"inline-flex",alignItems:"center",gap:3,fontSize:10,fontWeight:600,marginTop:4,padding:"2px 7px",borderRadius:20,background:u.authType==="google"?"rgba(52,168,83,0.1)":t.accentBg,color:u.authType==="google"?"#16a34a":"#5194F6"}}>
                {u.authType==="google"?<Chrome size={9}/>:<Mail size={9}/>}
                {u.authType==="google"?"Google":"Email"}
              </span>
            </div>
          </div>

          <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:5,flexShrink:0}}>
            <div style={{
              display:"inline-flex",alignItems:"center",gap:5,
              padding:"6px 12px",borderRadius:20,
              background:`linear-gradient(${plan.gradient})`,
              color:"white",fontSize:12,fontWeight:800,
              boxShadow:`0 2px 8px ${plan.color}40`,
            }}>
              <plan.icon size={12}/>{plan.label}
            </div>
            <div style={{
              display:"inline-flex",alignItems:"center",gap:4,
              padding:"3px 9px",borderRadius:20,fontSize:10,fontWeight:700,
              background:isActive?"rgba(34,197,94,0.1)":isPending?"rgba(168,85,247,0.1)":"rgba(239,68,68,0.1)",
              color:isActive?"#16a34a":isPending?"#9333ea":"#dc2626",
              border:isActive?"1px solid rgba(34,197,94,0.2)":isPending?"1px solid rgba(168,85,247,0.2)":"1px solid rgba(239,68,68,0.2)",
            }}>
              {isActive?<><CheckCircle2 size={10}/>Active</>:isPending?<><Clock size={10}/>Pending</>:<><XCircle size={10}/>Inactive</>}
            </div>
          </div>
        </div>

        {/* Detail or pending notice */}
        {isPending?(
          <div style={{padding:"12px 14px",borderRadius:10,background:"rgba(168,85,247,0.08)",border:"1px solid rgba(168,85,247,0.15)",fontSize:12,color:"#9333ea",lineHeight:1.5}}>
            ⏳ Access granted by admin. This plan will activate automatically when the user <strong>signs up or logs in</strong> with this email.
          </div>
        ):(
          <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr 1fr":"repeat(4,1fr)",gap:8}}>
            {[
              {icon:IndianRupee, label:"Amount",  value:fmt(sub.amount),     color:"#f59e0b"},
              {icon:CalendarDays,label:"Started",  value:fmtD(sub.startDate), color:"#3b82f6"},
              {icon:Hourglass,   label:"Expires",  value:fmtD(sub.endDate),   color:"#a855f7"},
              {
                icon:sub.razorpayPaymentId?TrendingUp:BadgeCheck,
                label:"Source",
                value:sub.razorpayPaymentId?"Razorpay":"Admin Grant",
                color:"#22c55e",
              },
            ].map(({icon:Icon,label,value,color})=>(
              <div key={label} style={{background:t.cardBg2,border:`1px solid ${t.border}`,borderRadius:10,padding:"9px 11px"}}>
                <div style={{display:"flex",alignItems:"center",gap:4,marginBottom:4}}>
                  <Icon size={10} color={color}/>
                  <span style={{fontSize:9,fontWeight:700,color:t.muted,textTransform:"uppercase",letterSpacing:"0.06em"}}>{label}</span>
                </div>
                <div style={{fontSize:12,fontWeight:700,color:t.text}}>{value}</div>
              </div>
            ))}
          </div>
        )}

        {isActive&&<DaysBar sub={sub} color={plan.color} t={t}/>}

        <div style={{display:"flex",gap:8,marginTop:14}}>
          <button onClick={()=>onGrant(u._id,u.name)} style={{
            flex:1,padding:"8px 0",borderRadius:10,cursor:"pointer",
            background:"rgba(34,197,94,0.08)",border:"1px solid rgba(34,197,94,0.2)",
            color:"#16a34a",fontSize:12,fontWeight:700,
            display:"flex",alignItems:"center",justifyContent:"center",gap:5,
          }}>
            <Gift size={12}/>Renew / Change
          </button>
          {isActive&&(
            <button onClick={()=>onRevoke(u._id)} style={{
              padding:"8px 14px",borderRadius:10,cursor:"pointer",
              background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.2)",
              color:"#dc2626",fontSize:12,fontWeight:600,
              display:"flex",alignItems:"center",gap:4,
            }}>
              <Trash2 size={12}/>Revoke
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Grant Modal ──────────────────────────────────────────────────────────────
const GrantModal = ({target,t,onClose,onGrant}:any) => {
  const [plan,setPlan]=useState("command");
  const [days,setDays]=useState(30);
  const [amt, setAmt] =useState(0);
  const [busy,setBusy]=useState(false);
  const inp:React.CSSProperties={width:"100%",padding:"9px 12px",borderRadius:10,background:t.inputBg,border:`1px solid ${t.border}`,color:t.text,fontSize:13,outline:"none",boxSizing:"border-box",marginBottom:12};
  return (
    <div style={{position:"fixed",inset:0,zIndex:9999,background:"rgba(0,0,0,0.55)",backdropFilter:"blur(4px)",display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{background:t.cardBg,border:`1px solid ${t.border}`,borderRadius:20,padding:"24px 20px",width:"100%",maxWidth:400,boxShadow:"0 24px 60px rgba(0,0,0,0.35)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:18}}>
          <div>
            <div style={{fontSize:16,fontWeight:700,color:t.text}}>Renew / Change Plan</div>
            <div style={{fontSize:12,color:t.muted,marginTop:2}}>for <span style={{color:"#5194F6",fontWeight:600}}>{target.name}</span></div>
          </div>
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:t.muted,padding:4}}><X size={18}/></button>
        </div>

        <div style={{fontSize:10,fontWeight:700,color:t.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:8}}>Select Plan</div>
        <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>
          {["foundation","command","edge"].map(p=>{const c=getPlan(p);return(
            <button key={p} onClick={()=>setPlan(p)} style={{flex:1,minWidth:80,padding:"9px 4px",borderRadius:10,cursor:"pointer",fontSize:12,fontWeight:700,background:plan===p?c.color:`${c.color}15`,color:plan===p?"white":c.color,border:`1.5px solid ${plan===p?c.color:`${c.color}30`}`,display:"flex",flexDirection:"column",alignItems:"center",gap:3,transition:"all 0.15s"}}>
              <c.icon size={13}/>{c.label}
            </button>
          );})}
        </div>

        <div style={{fontSize:10,fontWeight:700,color:t.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:6}}>Duration (days)</div>
        <div style={{display:"flex",gap:5,marginBottom:8}}>
          {[7,30,90,365].map(d=>(
            <button key={d} onClick={()=>setDays(d)} style={{flex:1,padding:"6px 0",borderRadius:8,cursor:"pointer",fontSize:11,fontWeight:600,background:days===d?"#5194F6":t.accentBg,color:days===d?"white":"#5194F6",border:`1px solid ${days===d?"#5194F6":"rgba(81,148,246,0.25)"}`,transition:"all 0.12s"}}>{d}d</button>
          ))}
        </div>
        <input type="number" min={1} value={days} onChange={e=>setDays(+e.target.value)} style={inp}/>

        <div style={{fontSize:10,fontWeight:700,color:t.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:6}}>Amount ₹ (0 = free grant)</div>
        <input type="number" min={0} value={amt} onChange={e=>setAmt(+e.target.value)} style={{...inp,marginBottom:18}}/>

        <div style={{display:"flex",gap:8}}>
          <button onClick={onClose} style={{flex:1,padding:"11px 0",borderRadius:12,cursor:"pointer",background:t.accentBg,border:`1px solid ${t.accentBdr}`,color:"#5194F6",fontSize:13,fontWeight:600}}>Cancel</button>
          <button disabled={busy} onClick={async()=>{setBusy(true);await onGrant(target.userId,{plan,durationDays:days,amount:amt});setBusy(false);onClose();}}
            style={{flex:2,padding:"11px 0",borderRadius:12,cursor:"pointer",background:`linear-gradient(${getPlan(plan).gradient})`,border:"none",color:"white",fontSize:13,fontWeight:700,opacity:busy?0.6:1}}>
            {busy?"Granting…":`Grant ${getPlan(plan).label} — ${days}d`}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Email Grant Modal ────────────────────────────────────────────────────────
const EmailGrantModal = ({t,onClose,onGrant}:any) => {
  const [email, setEmail] = useState("");
  const [plan,  setPlan]  = useState("command");
  const [days,  setDays]  = useState(30);
  const [amt,   setAmt]   = useState(0);
  const [busy,  setBusy]  = useState(false);
  const [result,setResult]= useState<{success:boolean;message:string}|null>(null);
  const inp:React.CSSProperties={width:"100%",padding:"9px 12px",borderRadius:10,background:t.inputBg,border:`1px solid ${t.border}`,color:t.text,fontSize:13,outline:"none",boxSizing:"border-box",marginBottom:12};

  return (
    <div style={{position:"fixed",inset:0,zIndex:9999,background:"rgba(0,0,0,0.55)",backdropFilter:"blur(4px)",display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{background:t.cardBg,border:`1px solid ${t.border}`,borderRadius:20,padding:"24px 20px",width:"100%",maxWidth:420,boxShadow:"0 24px 60px rgba(0,0,0,0.35)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:18}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:34,height:34,borderRadius:10,background:"linear-gradient(135deg,#a855f7,#7c3aed)",display:"flex",alignItems:"center",justifyContent:"center"}}><UserPlus size={15} color="white"/></div>
            <div>
              <div style={{fontSize:16,fontWeight:700,color:t.text}}>Grant by Email</div>
              <div style={{fontSize:11,color:t.muted}}>Works even if the user hasn't registered yet</div>
            </div>
          </div>
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:t.muted,padding:4}}><X size={18}/></button>
        </div>

        <div style={{fontSize:10,fontWeight:700,color:t.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:6}}>Email Address</div>
        <input type="email" placeholder="user@example.com" value={email} onChange={e=>{setEmail(e.target.value);setResult(null);}} style={inp} disabled={busy}/>

        <div style={{fontSize:10,fontWeight:700,color:t.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:8}}>Select Plan</div>
        <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>
          {["foundation","command","edge"].map(p=>{const c=getPlan(p);return(
            <button key={p} onClick={()=>setPlan(p)} style={{flex:1,minWidth:80,padding:"9px 4px",borderRadius:10,cursor:"pointer",fontSize:12,fontWeight:700,background:plan===p?c.color:`${c.color}15`,color:plan===p?"white":c.color,border:`1.5px solid ${plan===p?c.color:`${c.color}30`}`,display:"flex",flexDirection:"column",alignItems:"center",gap:3,transition:"all 0.15s"}}>
              <c.icon size={13}/>{c.label}
            </button>
          );})}
        </div>

        <div style={{fontSize:10,fontWeight:700,color:t.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:6}}>Duration (days)</div>
        <div style={{display:"flex",gap:5,marginBottom:8}}>
          {[7,30,90,365].map(d=>(
            <button key={d} onClick={()=>setDays(d)} style={{flex:1,padding:"6px 0",borderRadius:8,cursor:"pointer",fontSize:11,fontWeight:600,background:days===d?"#a855f7":t.accentBg,color:days===d?"white":"#a855f7",border:`1px solid ${days===d?"#a855f7":"rgba(168,85,247,0.25)"}`,transition:"all 0.12s"}}>{d}d</button>
          ))}
        </div>
        <input type="number" min={1} value={days} onChange={e=>setDays(+e.target.value)} style={inp}/>

        <div style={{fontSize:10,fontWeight:700,color:t.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:6}}>Amount ₹ (0 = free grant)</div>
        <input type="number" min={0} value={amt} onChange={e=>setAmt(+e.target.value)} style={{...inp,marginBottom:16}}/>

        {result&&(
          <div style={{padding:"10px 14px",borderRadius:10,marginBottom:14,fontSize:12,lineHeight:1.5,background:result.success?"rgba(34,197,94,0.1)":"rgba(239,68,68,0.1)",border:result.success?"1px solid rgba(34,197,94,0.25)":"1px solid rgba(239,68,68,0.25)",color:result.success?"#16a34a":"#dc2626"}}>
            {result.message}
          </div>
        )}

        <div style={{display:"flex",gap:8}}>
          <button onClick={onClose} style={{flex:1,padding:"11px 0",borderRadius:12,cursor:"pointer",background:t.accentBg,border:`1px solid ${t.accentBdr}`,color:"#5194F6",fontSize:13,fontWeight:600}}>
            {result?.success?"Close":"Cancel"}
          </button>
          {!result?.success&&(
            <button
              disabled={busy||!email.trim()}
              onClick={async()=>{
                setBusy(true);setResult(null);
                try{
                  const r=await onGrant({email:email.trim(),plan,durationDays:days,amount:amt});
                  setResult({
                    success:true,
                    message:r?.alreadyRegistered
                      ?`✅ User was already registered — ${getPlan(plan).label} plan activated immediately.`
                      :`⏳ Saved as pending. When "${email.trim()}" signs up or logs in, the ${getPlan(plan).label} plan will activate automatically.`,
                  });
                }catch(err:any){
                  setResult({success:false,message:err?.response?.data?.message||"Something went wrong. Please try again."});
                }
                setBusy(false);
              }}
              style={{flex:2,padding:"11px 0",borderRadius:12,cursor:"pointer",background:"linear-gradient(135deg,#a855f7,#7c3aed)",border:"none",color:"white",fontSize:13,fontWeight:700,opacity:(busy||!email.trim())?0.5:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}
            >
              {busy?<><RefreshCw size={13} style={{animation:"spin 1s linear infinite"}}/>Granting…</>:<><UserPlus size={13}/>Grant {getPlan(plan).label} — {days}d</>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const { isAdmin, user } = useAuth();
  const { theme }  = useTheme();
  const navigate   = useNavigate();
  const isLight    = theme==="light";
  const t          = tok(isLight);

  const API   = import.meta.env.VITE_API_URL || "";
  const SEG   = import.meta.env.VITE_ADMIN_SEGMENT || "xp-insights-42";
  const ADMIN = `${API}/${SEG}`;

  const getAuthHeaders = () => {
    const fromCookie = document.cookie.split(";").map(c=>c.trim()).find(c=>c.startsWith("accessToken="))?.split("=")[1];
    const token = fromCookie||localStorage.getItem("accessToken")||sessionStorage.getItem("accessToken")||"";
    return token?{Authorization:`Bearer ${token}`}:{};
  };

  const [allUsers,     setAllUsers]      = useState<AdminUser[]>([]);
  const [stats,        setStats]         = useState<AdminStats|null>(null);
  const [loading,      setLoading]       = useState(true);
  const [search,       setSearch]        = useState("");
  const [planFilter,   setPlanFilter]    = useState("all");
  const [statusFilter, setStatusFilter]  = useState<"all"|"active"|"pending_email">("all");
  const [grantT,       setGrantT]        = useState<{userId:string;name:string}|null>(null);
  const [emailOpen,    setEmailOpen]     = useState(false);
  const [isMobile,     setIsMobile]      = useState(window.innerWidth<768);
  const [navOpen,      setNavOpen]       = useState(false);

  useEffect(()=>{
    const fn=()=>setIsMobile(window.innerWidth<768);
    window.addEventListener("resize",fn);
    return()=>window.removeEventListener("resize",fn);
  },[]);

  const load = useCallback(async()=>{
    setLoading(true);
    try{
      const cfg={withCredentials:true,headers:getAuthHeaders()};
      const[ur,sr]=await Promise.all([axios.get(`${ADMIN}/users`,cfg),axios.get(`${ADMIN}/stats`,cfg)]);
      setAllUsers(ur.data.data.users||[]);
      setStats(sr.data.data);
    }catch(e){console.error("Admin load error:",e);}
    finally{setLoading(false);}
  },[ADMIN]);

  useEffect(()=>{load();},[load]);
  if(!isAdmin) return <div/>;

  // Only show users who have a subscription
  const subscribedUsers = allUsers.filter(u=>u.subscription!==null);

  const filtered = subscribedUsers.filter(u=>{
    const q=search.toLowerCase();
    if(q&&!u.name.toLowerCase().includes(q)&&!u.email.toLowerCase().includes(q)) return false;
    if(planFilter!=="all"&&u.subscription?.plan!==planFilter) return false;
    if(statusFilter!=="all"&&u.subscription?.status!==statusFilter) return false;
    return true;
  });

  const availablePlans=[...new Set(subscribedUsers.map(u=>u.subscription?.plan).filter(Boolean))];

  const doGrant=async(userId:string,body:any)=>{
    await axios.patch(`${ADMIN}/subscription/${userId}`,body,{withCredentials:true,headers:getAuthHeaders()});
    await load();
  };
  const doEmailGrant=async(body:any)=>{
    const r=await axios.post(`${ADMIN}/subscription/grant`,body,{withCredentials:true,headers:getAuthHeaders()});
    await load();
    return r.data.data;
  };
  const doRevoke=async(userId:string)=>{
    if(!confirm("Revoke this subscription?")) return;
    await axios.delete(`${ADMIN}/subscription/${userId}`,{withCredentials:true,headers:getAuthHeaders()});
    await load();
  };

  const pill=(active:boolean,color:string):React.CSSProperties=>({
    padding:"6px 13px",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:600,
    border:"none",background:active?color:`${color}12`,color:active?"white":color,transition:"all 0.15s",
  });

  return (
    <div style={{background:t.pageBg,minHeight:"100vh",fontFamily:"system-ui,-apple-system,sans-serif"}}>

      {/* Navbar */}
      <div style={{background:t.cardBg,borderBottom:`1px solid ${t.border}`,padding:"0 20px",position:"sticky",top:0,zIndex:100,boxShadow:t.shadow}}>
        <div style={{maxWidth:1280,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",height:56}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:32,height:32,borderRadius:9,background:"linear-gradient(135deg,#5194F6,#3a7de0)",display:"flex",alignItems:"center",justifyContent:"center"}}><ShieldCheck size={16} color="white"/></div>
            <div>
              <div style={{fontSize:14,fontWeight:800,color:t.text,lineHeight:1}}>Admin Panel</div>
              <div style={{fontSize:10,color:t.muted}}>InvestBeans</div>
            </div>
          </div>

          {!isMobile?(
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:12,color:t.muted}}>Logged in as <strong style={{color:"#5194F6"}}>{user?.email}</strong></span>
              <button onClick={()=>setEmailOpen(true)} style={{display:"flex",alignItems:"center",gap:5,padding:"7px 13px",borderRadius:10,cursor:"pointer",background:"linear-gradient(135deg,rgba(168,85,247,0.15),rgba(124,58,237,0.15))",border:"1px solid rgba(168,85,247,0.35)",color:"#a855f7",fontSize:12,fontWeight:700}}>
                <UserPlus size={12}/>Grant by Email
              </button>
              <button onClick={load} disabled={loading} style={{display:"flex",alignItems:"center",gap:5,padding:"7px 13px",borderRadius:10,cursor:"pointer",background:t.accentBg,border:`1px solid ${t.accentBdr}`,color:"#5194F6",fontSize:12,fontWeight:600,opacity:loading?0.5:1}}>
                <RefreshCw size={12} style={{animation:loading?"spin 1s linear infinite":"none"}}/>Refresh
              </button>
              <button onClick={()=>navigate("/")} style={{display:"flex",alignItems:"center",gap:5,padding:"7px 13px",borderRadius:10,cursor:"pointer",background:"transparent",border:`1px solid ${t.border}`,color:t.muted,fontSize:12,fontWeight:600}}>
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
              <button onClick={()=>{setEmailOpen(true);setNavOpen(false);}} style={{flex:1,padding:"8px 0",borderRadius:10,cursor:"pointer",background:"rgba(168,85,247,0.15)",border:"1px solid rgba(168,85,247,0.35)",color:"#a855f7",fontSize:12,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",gap:5}}><UserPlus size={12}/>Grant</button>
              <button onClick={()=>{load();setNavOpen(false);}} style={{flex:1,padding:"8px 0",borderRadius:10,cursor:"pointer",background:t.accentBg,border:`1px solid ${t.accentBdr}`,color:"#5194F6",fontSize:12,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",gap:5}}><RefreshCw size={12}/>Refresh</button>
              <button onClick={()=>navigate("/")} style={{flex:1,padding:"8px 0",borderRadius:10,cursor:"pointer",background:"transparent",border:`1px solid ${t.border}`,color:t.muted,fontSize:12,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",gap:5}}><ArrowLeft size={12}/>Home</button>
            </div>
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{maxWidth:1280,margin:"0 auto",padding:isMobile?"14px 12px":"22px 20px"}}>

        {/* Stats */}
        {stats&&(
          <div style={{display:"grid",gridTemplateColumns:isMobile?"repeat(2,1fr)":"repeat(auto-fit,minmax(175px,1fr))",gap:12,marginBottom:18}}>
            <StatCard t={t} icon={Users}        label="Total Users"     value={stats.totalUsers}          sub={`${stats.googleUsers} Google · ${stats.emailUsers} Email`} color="#5194F6"/>
            <StatCard t={t} icon={CheckCircle2} label="Active Plans"    value={stats.activeSubscriptions} sub={`of ${stats.totalSubscriptions} total`}                    color="#22c55e"/>
            <StatCard t={t} icon={IndianRupee}  label="Revenue"         value={fmt(stats.totalRevenue)}   sub="Active subscribers only"                                   color="#f59e0b"/>
            {(stats.pendingEmailGrants||0)>0&&(
              <StatCard t={t} icon={Clock} label="Pending Grants" value={stats.pendingEmailGrants} sub="Waiting for user to register" color="#a855f7"/>
            )}
            {Object.entries(stats.planBreakdown).map(([p,n])=>(
              <StatCard key={p} t={t} icon={getPlan(p).icon} label={`${getPlan(p).label} Plan`} value={n} sub="subscribers" color={getPlan(p).color}/>
            ))}
          </div>
        )}

        {/* Filter bar */}
        <div style={{background:t.cardBg,border:`1px solid ${t.border}`,borderRadius:14,padding:isMobile?"12px 13px":"14px 18px",marginBottom:14,display:"flex",flexWrap:"wrap",gap:9,alignItems:"center",boxShadow:t.shadow}}>
          <div style={{position:"relative",flex:"1 1 180px",minWidth:150}}>
            <Search size={13} style={{position:"absolute",left:9,top:"50%",transform:"translateY(-50%)",color:t.muted}}/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search subscribers…" style={{width:"100%",padding:"8px 10px 8px 28px",background:t.inputBg,border:`1px solid ${t.border}`,borderRadius:10,color:t.text,fontSize:13,outline:"none",boxSizing:"border-box"}}/>
          </div>
          <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
            <button style={pill(planFilter==="all","#5194F6")} onClick={()=>setPlanFilter("all")}>All Plans</button>
            {availablePlans.map(p=>(
              <button key={p} style={pill(planFilter===p,getPlan(p).color)} onClick={()=>setPlanFilter(planFilter===p?"all":p!)}>{getPlan(p).label}</button>
            ))}
          </div>
          <div style={{display:"flex",gap:4}}>
            {([["all","All","#5194F6"],["active","Active","#22c55e"],["pending_email","Pending","#a855f7"]]as const).map(([v,l,c])=>(
              <button key={v} style={pill(statusFilter===v,c)} onClick={()=>setStatusFilter(v as any)}>{l}</button>
            ))}
          </div>
          <span style={{marginLeft:"auto",fontSize:12,color:t.muted,whiteSpace:"nowrap"}}>{filtered.length} subscriber{filtered.length!==1?"s":""}</span>
        </div>

        {/* Cards */}
        {loading?(
          <div style={{background:t.cardBg,border:`1px solid ${t.border}`,borderRadius:14,padding:"60px 20px",textAlign:"center"}}>
            <RefreshCw size={24} color={t.muted} style={{animation:"spin 1s linear infinite",margin:"0 auto 12px",display:"block"}}/>
            <div style={{fontSize:13,color:t.muted}}>Loading subscribers…</div>
          </div>
        ):filtered.length===0?(
          <div style={{background:t.cardBg,border:`1px solid ${t.border}`,borderRadius:14,padding:"60px 20px",textAlign:"center"}}>
            <Users size={28} color={t.muted} style={{margin:"0 auto 12px",display:"block",opacity:0.3}}/>
            <div style={{fontSize:13,color:t.muted,marginBottom:12}}>
              {subscribedUsers.length===0
                ?"No subscribers yet. Use \"Grant by Email\" to give someone access."
                :"No subscribers match the current filters."}
            </div>
            {subscribedUsers.length===0&&(
              <button onClick={()=>setEmailOpen(true)} style={{padding:"9px 18px",borderRadius:10,cursor:"pointer",background:"linear-gradient(135deg,#a855f7,#7c3aed)",border:"none",color:"white",fontSize:13,fontWeight:700,display:"inline-flex",alignItems:"center",gap:6}}>
                <UserPlus size={13}/>Grant First Subscription
              </button>
            )}
          </div>
        ):(
          <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":filtered.length===1?"minmax(0,560px)":"repeat(auto-fill,minmax(420px,1fr))",gap:14}}>
            {filtered.map(u=>(
              <SubscribedUserCard key={u._id} u={u} t={t} isMobile={isMobile}
                onGrant={(id:string,name:string)=>setGrantT({userId:id,name})}
                onRevoke={doRevoke}
              />
            ))}
          </div>
        )}
      </div>

      {grantT&&<GrantModal target={grantT} t={t} onClose={()=>setGrantT(null)} onGrant={doGrant}/>}
      {emailOpen&&<EmailGrantModal t={t} onClose={()=>setEmailOpen(false)} onGrant={doEmailGrant}/>}
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </div>
  );
}