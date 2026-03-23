"use client";

import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/controllers/AuthContext";
import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  ChevronDown,
  User,
  LogOut,
  Shield,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  ChevronLeft,
  Sun,
  Moon,
  Flame,
  Package,
  Globe,
  Activity,
  Lightbulb,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGlobalMarkets } from "@/hooks/useGlobalMarkets";
import { useTheme } from '@/controllers/Themecontext'

// ─── Hook: smooth hover dropdown (no blink) ───────────────────────────────────
function useHoverDropdown(closeDelay = 150) {
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const enter = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setOpen(true);
  }, []);

  const leave = useCallback(() => {
    timer.current = setTimeout(() => setOpen(false), closeDelay);
  }, [closeDelay]);

  const toggle = useCallback(() => setOpen((s) => !s), []);
  const close = useCallback(() => setOpen(false), []);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );

  return { open, setOpen, enter, leave, toggle, close };
}

// ─── Market Ticker ─────────────────────────────────────────────────────────────
const MarketTickerInline = () => {
  const { data } = useGlobalMarkets();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [isPaused, setIsPaused] = useState(false);
  const tickerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const navigate = useNavigate();

  const allMarkets = [
    ...(data?.indices.us || []),
    ...(data?.indices.europe || []),
    ...(data?.indices.asia || []),
  ].map((market) => ({
    symbol: market.symbol,
    name: market.name,
    value: market.price.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
    change: `${market.changePercent > 0 ? "+" : ""}${market.changePercent.toFixed(2)}%`,
    isPositive: market.changePercent >= 0,
  }));

  useEffect(() => {
    if (!tickerRef.current || isPaused || allMarkets.length === 0) return;
    const element = tickerRef.current;
    let currentScroll = element.scrollLeft;
    const animate = () => {
      if (!isPaused && tickerRef.current) {
        const maxScroll = element.scrollWidth - element.clientWidth;
        currentScroll += 0.5;
        if (currentScroll >= maxScroll / 2) currentScroll = 0;
        element.scrollLeft = currentScroll;
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPaused, allMarkets.length]);

  if (allMarkets.length === 0) return null;

  const btnCls = isLight
    ? "absolute z-10 bg-slate-200/80 hover:bg-slate-300 text-slate-500 hover:text-slate-800 p-1 rounded-full transition-colors"
    : "absolute z-10 bg-white/10 hover:bg-white/20 text-white/70 hover:text-white p-1 rounded-full transition-colors";

  return (
    <div className="relative flex items-center">
      <button
        onClick={() => tickerRef.current?.scrollBy({ left: -200, behavior: "smooth" })}
        className={`${btnCls} left-2`}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <div className="flex-1 overflow-hidden mx-10">
        <div
          ref={tickerRef}
          className="flex items-center gap-8 overflow-x-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {[...allMarkets, ...allMarkets].map((market, index) => (
            <div
              key={`${market.name}-${index}`}
              onClick={() =>
                navigate("/global", {
                  state: { symbol: market.symbol, name: market.name },
                })
              }
              className="flex items-center gap-4 whitespace-nowrap group hover:scale-110 transition-transform cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span
                  className="text-sm font-medium transition-colors group-hover:text-[#5194F6]"
                  style={{ color: isLight ? "rgba(30,58,95,0.65)" : "rgba(255,255,255,0.65)" }}
                >
                  {market.name}
                </span>
                <span
                  className="font-bold text-sm"
                  style={{ color: isLight ? "#0d1b2a" : "rgba(255,255,255,0.92)" }}
                >
                  {market.value}
                </span>
              </div>
              <div className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                market.isPositive
                  ? isLight
                    ? "bg-emerald-100 text-emerald-700 border border-emerald-300/60"
                    : "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30"
                  : isLight
                    ? "bg-red-100 text-red-700 border border-red-300/60"
                    : "bg-red-500/20 text-red-300 border border-red-400/30"
              }`}>
                {market.isPositive ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {market.change}
              </div>
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={() => tickerRef.current?.scrollBy({ left: 200, behavior: "smooth" })}
        className={`${btnCls} right-2`}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

// ─── Shared dropdown pieces ────────────────────────────────────────────────────
const DropSection = ({ label, theme }: { label: string; theme: "dark" | "light" }) => (
  <p className={`text-[10px] font-bold uppercase tracking-widest px-3 pt-2 pb-0.5 ${
    theme === "light" ? "text-navy/45" : "text-white/40"
  }`}>{label}</p>
);

const DropLink = ({
  to,
  onClick,
  children,
  theme,
}: {
  to: string;
  onClick?: () => void;
  children: React.ReactNode;
  theme: "dark" | "light";
}) => (
  <DropdownMenuItem asChild>
    <Link
      to={to}
      onClick={onClick}
      className="block px-3 py-1.5 rounded-md text-[13px] font-medium transition cursor-pointer"
      style={{ color: theme === "light" ? "rgba(30,58,95,0.80)" : "rgba(200,223,248,0.80)" }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.color = "#5194F6";
        (e.currentTarget as HTMLElement).style.background = "rgba(78,145,246,0.10)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.color = theme === "light" ? "rgba(30,58,95,0.80)" : "rgba(200,223,248,0.80)";
        (e.currentTarget as HTMLElement).style.background = "transparent";
      }}
    >
      {children}
    </Link>
  </DropdownMenuItem>
);

const DropBtn = ({
  onClick,
  children,
  theme,
}: {
  onClick: () => void;
  children: React.ReactNode;
  theme: "dark" | "light";
}) => (
  <DropdownMenuItem asChild>
    <button
      onClick={onClick}
      className="w-full text-left px-3 py-1.5 text-[13px] rounded-md transition cursor-pointer"
      style={{ color: theme === "light" ? "rgba(30,58,95,0.80)" : "rgba(200,223,248,0.80)" }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.color = "#5194F6";
        (e.currentTarget as HTMLElement).style.background = "rgba(78,145,246,0.10)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.color = theme === "light" ? "rgba(30,58,95,0.80)" : "rgba(200,223,248,0.80)";
        (e.currentTarget as HTMLElement).style.background = "transparent";
      }}
    >
      {children}
    </button>
  </DropdownMenuItem>
);

// ── Commodity tab link — goes to /markets?tab=TAB_ID ──────────────────────────
const CommodityTabLink = ({
  to,
  icon: Icon,
  label,
  desc,
  onClick,
  theme,
}: {
  to: string;
  icon: React.ElementType;
  label: string;
  desc: string;
  onClick?: () => void;
  theme: "dark" | "light";
}) => {
  const navigate = useNavigate();
  return (
    <DropdownMenuItem asChild>
      <button
        onClick={() => { onClick?.(); navigate(to); }}
        className="w-full text-left px-3 py-2 rounded-md transition cursor-pointer flex items-center gap-2.5"
        style={{ color: theme === "light" ? "rgba(30,58,95,0.80)" : "rgba(200,223,248,0.80)" }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.color = "#5194F6";
          (e.currentTarget as HTMLElement).style.background = "rgba(78,145,246,0.10)";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.color = theme === "light" ? "rgba(30,58,95,0.80)" : "rgba(200,223,248,0.80)";
          (e.currentTarget as HTMLElement).style.background = "transparent";
        }}
      >
        <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
          style={{ background: "rgba(81,148,246,0.12)" }}>
          <Icon className="w-3.5 h-3.5" style={{ color: "#5194F6" }} />
        </div>
        <div className="min-w-0">
          <p className="text-[13px] font-medium leading-none">{label}</p>
          <p className="text-[10px] mt-0.5 opacity-60 truncate">{desc}</p>
        </div>
      </button>
    </DropdownMenuItem>
  );
};

// ─── Desktop nav item wrapper — handles hover without blink ───────────────────
const NavItem = ({
  label,
  dd,
  children,
  theme,
  href,
}: {
  label: string;
  dd: ReturnType<typeof useHoverDropdown>;
  children: React.ReactNode;
  theme: "dark" | "light";
  href?: string;
}) => {
  const navigate = useNavigate();
  return (
    <li onMouseEnter={dd.enter} onMouseLeave={dd.leave}>
      <DropdownMenu open={dd.open} onOpenChange={dd.setOpen}>
        <DropdownMenuTrigger asChild>
          <button
            className="text-[13.5px] font-medium transition-colors px-2 py-1 rounded-md flex items-center gap-0.5 focus:outline-none whitespace-nowrap"
            style={{ color: theme === "light" ? "#1e3a5f" : "#c8dff8" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#5194F6"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = theme === "light" ? "#1e3a5f" : "#c8dff8"; }}
            onClick={() => {
              if (href) { dd.close(); navigate(href); }
              else dd.toggle();
            }}
          >
            {label}
            <ChevronDown
              className={`w-3.5 h-3.5 opacity-60 transition-transform duration-200 ml-0.5 ${dd.open ? "rotate-180" : ""}`}
              onMouseDown={(e) => { e.stopPropagation(); dd.toggle(); }}
            />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          sideOffset={5}
          className={`p-1.5 rounded-xl shadow-lg border backdrop-blur-xl ${
            theme === "light"
              ? "bg-white/96 text-navy ring-1 ring-black/[0.07] border-slate-200/80"
              : "bg-[#101528]/98 text-white ring-1 ring-[#1C3656]/70 border-[#1C3656]/50"
          }`}
        >
          {children}
        </DropdownMenuContent>
      </DropdownMenu>
    </li>
  );
};

// ─── Header ───────────────────────────────────────────────────────────────────
const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";

  function scrollToSection(id: string) {
    if (location.pathname === "/team") {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    navigate("/team");
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
  }

  const { isAuthenticated, signOut, user, isAdmin, showToast } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Desktop dropdowns — each has its own smooth hover state
  const about      = useHoverDropdown();
  const segments   = useHoverDropdown();
  const commodities = useHoverDropdown();
  const dashboards = useHoverDropdown();
  const learn      = useHoverDropdown();
  const events     = useHoverDropdown();
  const help       = useHoverDropdown();
  const userMenu   = useHoverDropdown();

  // Mobile accordions
  const [mobileAboutOpen,      setMobileAboutOpen]      = useState(false);
  const [mobileSegmentsOpen,   setMobileSegmentsOpen]   = useState(false);
  const [mobileCommodOpen,     setMobileCommodOpen]     = useState(false);
  const [mobileDashboardsOpen, setMobileDashboardsOpen] = useState(false);
  const [mobileLearnOpen,      setMobileLearnOpen]      = useState(false);
  const [mobileEventsOpen,     setMobileEventsOpen]     = useState(false);
  const [mobileHelpOpen,       setMobileHelpOpen]       = useState(false);

  const closeMobile = () => setIsMobileMenuOpen(false);

  const getUserInitials = () => {
    if (!user?.name) return "U";
    const names = user.name.split(" ");
    return names.length >= 2
      ? `${names[0][0]}${names[1][0]}`.toUpperCase()
      : user.name.substring(0, 2).toUpperCase();
  };

  const handleSignOut = async () => {
    await signOut(() => {
      showToast("Logged out successfully. See you soon!", "success");
      setTimeout(() => navigate("/"), 1000);
    });
  };

  // ── Mobile accordion component ──────────────────────────────────────────────
  const MobileAccordion = ({
    label,
    isOpen,
    toggle,
    children,
  }: {
    label: string;
    isOpen: boolean;
    toggle: () => void;
    children: React.ReactNode;
  }) => (
    <li className="rounded-md overflow-hidden">
      <button
        onClick={toggle}
        className="w-full flex items-center justify-between font-medium py-3 px-3 rounded-md transition-colors"
        style={{ color: isLight ? "#1e3a5f" : "#c8dff8" }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#5194F6"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = isLight ? "#1e3a5f" : "#c8dff8"; }}
      >
        <span>{label}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-[max-height,opacity] duration-200 ease-in-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div
          className={`rounded-md border px-2 py-2 space-y-0.5 mb-1 ${
            isLight
              ? "bg-slate-100 border-slate-200"
              : "bg-[#1C3656]/40 border-[#1C3656]/70"
          }`}
        >
          {children}
        </div>
      </div>
    </li>
  );

  const MobileLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
    <Link
      to={to}
      className="block font-medium py-2 px-3 rounded-md text-sm transition-colors"
      style={{ color: isLight ? "rgba(30,58,95,0.80)" : "rgba(200,223,248,0.90)" }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#5194F6"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = isLight ? "rgba(30,58,95,0.80)" : "rgba(200,223,248,0.90)"; }}
      onClick={closeMobile}
    >
      {children}
    </Link>
  );

  const MobileSectionLabel = ({ label }: { label: string }) => (
    <p
      className={`text-[10px] font-bold uppercase tracking-widest px-3 pt-2 pb-0.5 ${
        isLight ? "text-navy/40" : "text-white/30"
      }`}
    >
      {label}
    </p>
  );

  const MobileScrollBtn = ({ id, children }: { id: string; children: React.ReactNode }) => (
    <button
      onClick={() => { scrollToSection(id); closeMobile(); }}
      className="block font-medium py-2 px-3 rounded-md w-full text-left text-sm transition-colors"
      style={{ color: isLight ? "rgba(30,58,95,0.80)" : "rgba(200,223,248,0.90)" }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#5194F6"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = isLight ? "rgba(30,58,95,0.80)" : "rgba(200,223,248,0.90)"; }}
    >
      {children}
    </button>
  );

  // ── Theme-aware class helpers ─────────────────────────────────────────────
  const headerBg = isLight
    ? "bg-white text-[#1e3a5f] shadow-sm border-b border-slate-200"
    : "bg-[#101528] text-white shadow-lg border-b border-[#1C3656]/70";

  const tickerBg = isLight
    ? "bg-white py-1.5 sm:py-2.5 border-b border-slate-200"
    : "bg-[#0b0f1e] py-1.5 sm:py-2.5 border-b border-[#1C3656]/50";

  const mobileBg = isLight
    ? "md:hidden bg-white border-t border-slate-200"
    : "md:hidden bg-[#101528] border-t border-[#1C3656]/70";

  const userBtnCls = isLight
    ? "p-2.5 rounded-full bg-navy/8 hover:bg-navy/15 transition-all hover:scale-110"
    : "p-2.5 rounded-full bg-[#1C3656]/60 hover:bg-[#1C3656] text-[#5194F6] transition-all hover:scale-110 border border-[#1C3656]";

  const userIconCls = isLight ? "text-navy" : "text-[#5194F6]";

  const dropdownContentCls = isLight
    ? "min-w-[160px] p-2 bg-white/96 text-navy rounded-xl shadow-lg ring-1 ring-black/[0.07] border border-slate-200/80 backdrop-blur-xl"
    : "min-w-[160px] p-2 bg-[#101528]/98 text-white rounded-xl shadow-lg ring-1 ring-[#1C3656]/70 border border-[#1C3656]/50 backdrop-blur-xl";

  // ── Commodities tab definitions (matching CommoditiesView tabs) ───────────
  const COMMODITY_TABS = [
    { id: "domestic",     label: "Domestic Commodities", desc: "MCX · Gold · Silver · Crude · NatGas · Copper", icon: Flame    },
    { id: "dom-etfs",     label: "Domestic ETFs",        desc: "NSE/BSE · AMFI NAV · Gold & Silver ETFs",      icon: Package  },
    { id: "global",       label: "Global Commodities",   desc: "CME · COMEX · LME · COT · EIA · OPEC",        icon: Globe    },
    { id: "global-etfs",  label: "Global ETFs",          desc: "GLD · SLV · USO · DBC · TIP · PDBC",          icon: Activity },
    { id: "intelligence", label: "Intelligence Layer",   desc: "Regime · Hedge Engine · Allocation",           icon: Lightbulb},
  ];

  return (
    <div className="sticky top-0 z-50">
      {/* ── Market Ticker Bar ── */}
      <div className={tickerBg}>
        <MarketTickerInline />
      </div>

      <header className={`${headerBg} backdrop-blur-sm`}>
        <nav className="container mx-auto px-3 sm:px-4 md:px-6 py-2 flex items-center justify-between min-h-[52px] sm:min-h-[56px]">

          {/* ── Left: logo + nav ──────────────────────────────────────────── */}
          <div className="flex items-center gap-1.5 sm:gap-3 md:gap-5">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden transition-colors p-1.5 sm:p-2 rounded-md"
              style={{ color: isLight ? "#1e3a5f" : "#c8dff8" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#5194F6"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = isLight ? "#1e3a5f" : "#c8dff8"; }}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <Link to="/" className="flex items-center shrink-0">
              <div className="relative inline-flex items-center shrink-0">
                <img
                  src={isLight ? "/images/investbeans logo-03.png" : "/images/Untitled-6-04.png"}
                  alt="InvestBeans Logo"
                  className={`h-9 sm:h-9 w-auto max-w-[168px] sm:max-w-[180px] md:max-w-none object-contain relative -top-0.5 transition-all ${
                    !isLight ? "brightness-[1.3] contrast-[1.5]" : ""
                  }`}
                />
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: "50%",
                    height: "100%",
                    background: "#5194F6",
                    mixBlendMode: "hue",
                    opacity: 0.85,
                    borderRadius: "0 4px 4px 0",
                    pointerEvents: "none",
                  }}
                />
              </div>
            </Link>

            {/* Desktop nav list */}
            <ul className="hidden md:flex items-center gap-0.5">

              {/* 1. ABOUT */}
              <NavItem label="About" dd={about} theme={theme} href="/team">
                <div className="min-w-[260px]">
                  <DropBtn theme={theme} onClick={() => { scrollToSection("our-story"); about.close(); }}>Our Story</DropBtn>
                  <DropBtn theme={theme} onClick={() => { scrollToSection("mission"); about.close(); }}>Mission, Vision & Values</DropBtn>
                  <DropBtn theme={theme} onClick={() => { scrollToSection("team-members"); about.close(); }}>Team</DropBtn>
                  <DropBtn theme={theme} onClick={() => { scrollToSection("why-us"); about.close(); }}>Why Us</DropBtn>
                  <DropBtn theme={theme} onClick={() => { scrollToSection("what-we-do"); about.close(); }}>What We Do</DropBtn>
                  <DropBtn theme={theme} onClick={() => { scrollToSection("certifications"); about.close(); }}>Trust and Compliance</DropBtn>
                </div>
              </NavItem>

              {/* 2. SEGMENTS */}
              <NavItem label="Segments" dd={segments} theme={theme}>
                <div className="min-w-[200px]">
                  <DropSection label="Equity" theme={theme} />
                  <DropLink to="/domestic" onClick={segments.close} theme={theme}>Domestic</DropLink>
                  <DropLink to="/global"   onClick={segments.close} theme={theme}>Global</DropLink>
                  <DropLink to="/currency" onClick={segments.close} theme={theme}>Currency</DropLink>
                  <DropdownMenuSeparator className="my-1" />
                  <DropSection label="Commodities & ETFs" theme={theme} />
                  {/* Commodities overview — goes to /markets with no tab param */}
                  <DropLink to="/markets" onClick={segments.close} theme={theme}>Overview</DropLink>
                </div>
              </NavItem>

              {/* 3. COMMODITIES & ETFs — dedicated dropdown with all 5 tabs */}
              <NavItem label="Commodities" dd={commodities} theme={theme} href="/markets">
                <div className="min-w-[280px]">
                  <p className={`text-[10px] font-bold uppercase tracking-widest px-3 pt-2 pb-1 ${
                    theme === "light" ? "text-navy/45" : "text-white/40"
                  }`}>Commodities & ETFs</p>

                  {COMMODITY_TABS.map(tab => (
                    <CommodityTabLink
                      key={tab.id}
                      to={`/markets?tab=${tab.id}`}
                      icon={tab.icon}
                      label={tab.label}
                      desc={tab.desc}
                      onClick={commodities.close}
                      theme={theme}
                    />
                  ))}

                  {/* Footer chip inside dropdown */}
                  <div className="mx-2 mt-2 mb-1 px-3 py-2 rounded-lg"
                    style={{ background: "rgba(81,148,246,0.07)", border: "1px solid rgba(81,148,246,0.15)" }}>
                    <p className={`text-[10px] font-medium ${theme === "light" ? "text-slate-500" : "text-slate-400"}`}>
                      Live MCX · AMFI NAV · CFTC COT · EIA · Yahoo Finance
                    </p>
                  </div>
                </div>
              </NavItem>

              {/* 4. LEARN */}
              <NavItem label="Learn" dd={learn} theme={theme} href="/education">
                <div className="min-w-[220px]">
                  <DropSection label="Financial" theme={theme} />
                  <DropLink to="/education#financial-ebooks"        onClick={learn.close} theme={theme}>E-books</DropLink>
                  <DropLink to="/education#financial-tutorials"     onClick={learn.close} theme={theme}>Tutorials</DropLink>
                  <DropLink to="/education#financial-certifications" onClick={learn.close} theme={theme}>Certifications</DropLink>
                  <DropdownMenuSeparator className="my-1" />
                  <DropSection label="Non-Financial" theme={theme} />
                  <DropLink to="/education#nonfinancial-ebooks"     onClick={learn.close} theme={theme}>E-books</DropLink>
                  <DropLink to="/education#nonfinancial-tutorials"  onClick={learn.close} theme={theme}>Tutorials</DropLink>
                </div>
              </NavItem>

              {/* 5. EVENTS */}
              <NavItem label="Events" dd={events} theme={theme}>
                <div className="min-w-[160px]">
                  <DropLink to="/domestic" onClick={events.close} theme={theme}>Domestic</DropLink>
                  <DropLink to="/global"   onClick={events.close} theme={theme}>Global</DropLink>
                </div>
              </NavItem>

              {/* 6. IPO */}
              <li>
                <Link
                  to="/ipos"
                  className="text-[13.5px] font-medium transition-colors px-2 py-1 rounded-md whitespace-nowrap"
                  style={{ color: isLight ? "#1e3a5f" : "#c8dff8" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#5194F6"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = isLight ? "#1e3a5f" : "#c8dff8"; }}
                >IPO</Link>
              </li>

              {/* 7. BLOGS */}
              <li>
                <Link
                  to="/blogs"
                  className="text-[13.5px] font-medium transition-colors px-2 py-1 rounded-md whitespace-nowrap"
                  style={{ color: isLight ? "#1e3a5f" : "#c8dff8" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#5194F6"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = isLight ? "#1e3a5f" : "#c8dff8"; }}
                >Blogs</Link>
              </li>

              {/* 8. HELP */}
              <li>
                <Link
                  to="/help-center"
                  className="text-[13.5px] font-medium transition-colors px-2 py-1 rounded-md whitespace-nowrap"
                  style={{ color: isLight ? "#1e3a5f" : "#c8dff8" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#5194F6"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = isLight ? "#1e3a5f" : "#c8dff8"; }}
                >Help</Link>
              </li>

            </ul>
          </div>

          {/* ── Right: theme toggle + user menu ──────────────────────────── */}
          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">

            {/* ── Dark / Light Toggle ─────────────────────────────────────── */}
            <button
              onClick={toggleTheme}
              aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
              className={`relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#5194F6]/40 ${
                isLight
                  ? "bg-slate-100 hover:bg-slate-200 text-navy shadow-sm border border-slate-300"
                  : "bg-[#1C3656]/60 hover:bg-[#1C3656] text-[#5194F6] border border-[#1C3656]"
              }`}
            >
              {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            {isAuthenticated && user ? (
              <li onMouseEnter={userMenu.enter} onMouseLeave={userMenu.leave} className="list-none">
                <DropdownMenu open={userMenu.open} onOpenChange={userMenu.setOpen}>
                  <DropdownMenuTrigger asChild>
                    <button
                      onClick={userMenu.toggle}
                      className={`relative flex items-center gap-3 p-1.5 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-[#5194F6]/40 ${
                        isLight ? "hover:bg-navy/8" : "hover:bg-[#1C3656]/60"
                      }`}
                    >
                      {/* Admin shield badge — top-right of avatar */}
                      {isAdmin && (
                        <span style={{
                          position: "absolute", top: 0, right: 0,
                          width: 16, height: 16, borderRadius: "50%",
                          background: "linear-gradient(135deg,#f59e0b,#d97706)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          zIndex: 10,
                          border: `2px solid ${isLight ? "white" : "#101528"}`,
                          boxShadow: "0 2px 6px rgba(245,158,11,0.5)",
                        }}>
                          <Shield size={8} color="white" />
                        </span>
                      )}
                      <Avatar className={`h-9 w-9 border-2 ring-2 ${isLight ? "border-slate-300 ring-slate-200" : "border-[#1C3656] ring-[#5194F6]/20"}`}>
                        <AvatarImage src={user?.image} alt={user.name} className="object-cover" />
                        <AvatarFallback className="bg-gradient-to-br from-[#5194F6] to-[#5194F6]/60 text-white font-semibold">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <span className={`hidden md:block text-sm font-medium max-w-[150px] truncate ${isLight ? "text-navy" : "text-white"}`}>
                        {user.name}
                      </span>
                      <ChevronDown className={`hidden md:block w-4 h-4 ${isLight ? "text-navy/60" : "text-white"}`} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    sideOffset={8}
                    className={`min-w-[240px] p-2 rounded-xl shadow-xl ring-1 ${isLight ? "bg-white text-navy ring-black/10" : "bg-[#0f1829] text-white ring-white/10"}`}
                  >
                    <div className={`px-3 py-3 border-b ${isLight ? "border-gray-200" : "border-white/10"}`}>
                      <div className="flex items-center gap-3 mb-2">
                        <Avatar className="h-10 w-10 border-2 border-gray-200">
                          <AvatarImage src={user?.image} alt={user.name} className="object-cover" />
                          <AvatarFallback className="bg-gradient-to-br from-[#5194F6] to-[#5194F6]/60 text-white font-semibold text-sm">
                            {getUserInitials()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-semibold ${isLight ? "text-black" : "text-white"} truncate`}>{user.name}</p>
                          <p className={`text-xs ${isLight ? "text-black" : "text-white"} truncate`}>{user.email}</p>
                        </div>
                      </div>
                      {isAdmin && (
                        <div className="flex items-center gap-1.5 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 text-yellow-700 px-2.5 py-1.5 rounded-lg mt-2">
                          <Shield size={14} className="text-yellow-600" />
                          <span className="text-xs font-bold">Admin Access</span>
                        </div>
                      )}
                    </div>
                    <DropdownMenuItem asChild>
                      <Link
                        to="/dashboard"
                        className={`flex items-center gap-2 w-full px-3 py-2 mt-1 rounded-md text-sm font-medium transition ${isLight ? "hover:bg-[#5194F6]/10 hover:text-[#5194F6]" : "hover:bg-[#5194F6]/15 hover:text-[#5194F6] text-white"}`}
                        onClick={userMenu.close}
                      >
                        <User className="w-4 h-4" /> My Dashboard
                      </Link>
                    </DropdownMenuItem>

                    {/* ── Admin Dashboard — visible only to admins, below My Dashboard ── */}
                    {isAdmin && (
                      <>
                        <DropdownMenuSeparator className={`my-1 ${isLight ? "bg-gray-200" : "bg-white/10"}`} />
                        <DropdownMenuItem asChild>
                          <button
                            onClick={() => { userMenu.close(); navigate(import.meta.env.VITE_ADMIN_ROUTE || "/x7-panel"); }}
                            style={{
                              display: "flex", alignItems: "center", gap: 8,
                              width: "100%", padding: "8px 12px", borderRadius: 8,
                              fontSize: 13, fontWeight: 700, cursor: "pointer",
                              border: "none",
                              background: "linear-gradient(135deg,rgba(245,158,11,0.10),rgba(217,119,6,0.06))",
                              color: "#b45309",
                            }}
                          >
                            <div style={{ width: 22, height: 22, borderRadius: 6, background: "rgba(245,158,11,0.18)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                              <Shield size={12} color="#d97706" />
                            </div>
                            Admin Dashboard
                          </button>
                        </DropdownMenuItem>
                      </>
                    )}

                    <DropdownMenuSeparator className={`my-1 ${isLight ? "bg-gray-200" : "bg-white/10"}`} />
                    <DropdownMenuItem asChild>
                      <button
                        onClick={() => { userMenu.close(); handleSignOut(); }}
                        className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm font-medium hover:bg-destructive/10 text-destructive transition"
                      >
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
            ) : (
              <>
                {/* Desktop guest */}
                <div className="hidden md:block">
                  <li onMouseEnter={userMenu.enter} onMouseLeave={userMenu.leave} className="list-none">
                    <DropdownMenu open={userMenu.open} onOpenChange={userMenu.setOpen}>
                      <DropdownMenuTrigger asChild>
                        <button onClick={userMenu.toggle} className={userBtnCls}>
                          <User className={`w-5 h-5 ${userIconCls}`} />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" sideOffset={8} className={dropdownContentCls}>
                        <DropdownMenuItem asChild>
                          <Link to="/signin" className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-[#5194F6]/10 hover:text-[#5194F6] transition" onClick={userMenu.close}>
                            Login
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/signup" className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-[#5194F6]/10 hover:text-[#5194F6] transition" onClick={userMenu.close}>
                            Sign up
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </li>
                </div>
                {/* Mobile guest */}
                <div className="md:hidden">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className={userBtnCls}>
                        <User className={`w-5 h-5 ${userIconCls}`} />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" sideOffset={8} className={dropdownContentCls}>
                      <DropdownMenuItem asChild>
                        <Link to="/signin" className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-[#5194F6]/10 hover:text-[#5194F6] transition">Login</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/signup" className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-[#5194F6]/10 hover:text-[#5194F6] transition">Sign up</Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </>
            )}
          </div>
        </nav>

        {/* ── Mobile Menu ───────────────────────────────────────────────────────── */}
        {isMobileMenuOpen && (
          <div className={mobileBg}>
            <div className="container mx-auto px-4 py-4">
              <ul className="space-y-1">

                <MobileAccordion label="About" isOpen={mobileAboutOpen} toggle={() => setMobileAboutOpen(s => !s)}>
                  <MobileScrollBtn id="our-story">Our Story</MobileScrollBtn>
                  <MobileScrollBtn id="mission">Mission, Vision & Values</MobileScrollBtn>
                  <MobileScrollBtn id="team-members">Team</MobileScrollBtn>
                  <MobileScrollBtn id="why-us">Why Us</MobileScrollBtn>
                  <MobileScrollBtn id="what-we-do">What We Do</MobileScrollBtn>
                  <MobileScrollBtn id="certifications">Trust and Compliance</MobileScrollBtn>
                </MobileAccordion>

                <MobileAccordion label="Segments" isOpen={mobileSegmentsOpen} toggle={() => setMobileSegmentsOpen(s => !s)}>
                  <MobileSectionLabel label="Equity" />
                  <MobileLink to="/domestic">Domestic</MobileLink>
                  <MobileLink to="/global">Global</MobileLink>
                  <MobileLink to="/currency">Currency</MobileLink>
                </MobileAccordion>

                {/* ── Commodities & ETFs — mobile accordion with all 5 tabs ── */}
                <MobileAccordion label="Commodities & ETFs" isOpen={mobileCommodOpen} toggle={() => setMobileCommodOpen(s => !s)}>
                  <MobileSectionLabel label="Domestic" />
                  <MobileLink to="/markets?tab=domestic">Domestic Commodities</MobileLink>
                  <MobileLink to="/markets?tab=dom-etfs">Domestic ETFs</MobileLink>
                  <MobileSectionLabel label="Global" />
                  <MobileLink to="/markets?tab=global">Global Commodities</MobileLink>
                  <MobileLink to="/markets?tab=global-etfs">Global ETFs</MobileLink>
                  <MobileSectionLabel label="Intelligence" />
                  <MobileLink to="/markets?tab=intelligence">Intelligence Layer</MobileLink>
                </MobileAccordion>

                <MobileAccordion label="Learn" isOpen={mobileLearnOpen} toggle={() => setMobileLearnOpen(s => !s)}>
                  <MobileSectionLabel label="Financial" />
                  <MobileLink to="/education#financial-ebooks">E-books</MobileLink>
                  <MobileLink to="/education#financial-tutorials">Tutorials</MobileLink>
                  <MobileLink to="/education#financial-certifications">Certifications</MobileLink>
                  <MobileSectionLabel label="Non-Financial" />
                  <MobileLink to="/education#nonfinancial-ebooks">E-books</MobileLink>
                  <MobileLink to="/education#nonfinancial-tutorials">Tutorials</MobileLink>
                </MobileAccordion>

                <MobileAccordion label="Events" isOpen={mobileEventsOpen} toggle={() => setMobileEventsOpen(s => !s)}>
                  <MobileLink to="/domestic">Domestic</MobileLink>
                  <MobileLink to="/global">Global</MobileLink>
                </MobileAccordion>

                <li>
                  <Link
                    to="/ipos"
                    className="block font-medium py-3 px-3 rounded-md transition-colors"
                    style={{ color: isLight ? "rgba(30,58,95,0.90)" : "#c8dff8" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#5194F6"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = isLight ? "rgba(30,58,95,0.90)" : "#c8dff8"; }}
                    onClick={closeMobile}
                  >IPO</Link>
                </li>

                <li>
                  <Link
                    to="/blogs"
                    className="block font-medium py-3 px-3 rounded-md transition-colors"
                    style={{ color: isLight ? "rgba(30,58,95,0.90)" : "#c8dff8" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#5194F6"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = isLight ? "rgba(30,58,95,0.90)" : "#c8dff8"; }}
                    onClick={closeMobile}
                  >Blogs</Link>
                </li>

                <MobileAccordion label="Help" isOpen={mobileHelpOpen} toggle={() => setMobileHelpOpen(s => !s)}>
                  <MobileLink to="/help-center">FAQs</MobileLink>
                  <MobileLink to="/help-center">Contact Us</MobileLink>
                </MobileAccordion>

                {isAuthenticated && (
                  <li className="pt-3">
                    <Button
                      onClick={() => { handleSignOut(); closeMobile(); }}
                      className={`w-full font-semibold transition-all shadow-sm ${
                        isLight
                          ? "bg-navy text-white hover:bg-navy/80"
                          : "bg-[#1C3656] text-[#5194F6] border border-[#5194F6]/30 hover:bg-[#5194F6] hover:text-white"
                      }`}
                    >
                      Log out
                    </Button>
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}
      </header>
    </div>
  );
};

export default Header;