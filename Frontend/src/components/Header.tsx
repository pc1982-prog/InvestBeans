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

  // Ticker adapts to theme
  const btnCls =
    theme === "light"
      ? "absolute z-10 bg-navy/10 hover:bg-navy/20 text-navy p-1 rounded-full transition-colors"
      : "absolute z-10 bg-navy/80 hover:bg-navy text-white p-1 rounded-full transition-colors";

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
                <span className={`text-sm font-medium group-hover:transition-colors ${theme === "light" ? "text-navy/70 group-hover:text-navy" : "text-white/80 group-hover:text-white"}`}>
                  {market.name}
                </span>
                <span className={`font-bold text-base ${theme === "light" ? "text-navy" : "text-white"}`}>{market.value}</span>
              </div>
              <div
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                  market.isPositive
                    ? theme === "light"
                      ? "bg-green-500/15 text-green-700 border border-green-500/40"
                      : "bg-green-500/30 text-green-100 border border-green-400/50"
                    : theme === "light"
                      ? "bg-red-500/15 text-red-600 border border-red-500/40"
                      : "bg-red-500/30 text-red-100 border border-red-400/50"
                }`}
              >
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
  <p
    className={`text-[10px] font-bold uppercase tracking-widest px-3 pt-2 pb-0.5 ${
      theme === "light" ? "text-navy/50" : "text-navy/40"
    }`}
  >
    {label}
  </p>
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
      className={`block px-3 py-2 rounded-md text-sm font-medium hover:bg-accent/10 transition cursor-pointer ${
        theme === "light" ? "text-navy" : "text-navy"
      }`}
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
      className={`w-full text-left px-3 py-2 text-sm rounded-md hover:bg-accent/10 transition cursor-pointer ${
        theme === "light" ? "text-navy" : "text-navy"
      }`}
    >
      {children}
    </button>
  </DropdownMenuItem>
);

// ─── Desktop nav item wrapper — handles hover without blink ───────────────────
const NavItem = ({
  label,
  dd,
  children,
  theme,
}: {
  label: string;
  dd: ReturnType<typeof useHoverDropdown>;
  children: React.ReactNode;
  theme: "dark" | "light";
}) => (
  <li onMouseEnter={dd.enter} onMouseLeave={dd.leave}>
    <DropdownMenu open={dd.open} onOpenChange={dd.setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className={`font-medium hover:text-accent transition-colors px-2 py-1 rounded-md flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-accent/40 whitespace-nowrap ${
            theme === "light" ? "text-navy/90 hover:text-accent" : "text-white hover:text-accent"
          }`}
          onClick={dd.toggle}
        >
          {label}
          <ChevronDown
            className={`w-4 h-4 opacity-80 transition-transform duration-200 ${
              dd.open ? "rotate-180" : ""
            }`}
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        sideOffset={6}
        className={`p-2 rounded-xl shadow-xl border ${
          theme === "light"
            ? "bg-white text-navy ring-1 ring-black/10 border-slate-200"
            : "bg-white text-navy ring-1 ring-black/10 border-white/10"
        }`}
      >
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  </li>
);

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
  const about = useHoverDropdown();
  const segments = useHoverDropdown();
  const dashboards = useHoverDropdown();
  const learn = useHoverDropdown();
  const events = useHoverDropdown();
  const help = useHoverDropdown();
  const userMenu = useHoverDropdown();

  // Mobile accordions
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const [mobileSegmentsOpen, setMobileSegmentsOpen] = useState(false);
  const [mobileDashboardsOpen, setMobileDashboardsOpen] = useState(false);
  const [mobileLearnOpen, setMobileLearnOpen] = useState(false);
  const [mobileEventsOpen, setMobileEventsOpen] = useState(false);
  const [mobileHelpOpen, setMobileHelpOpen] = useState(false);

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
        className={`w-full flex items-center justify-between font-medium py-3 px-3 rounded-md transition-colors ${
          isLight
            ? "text-navy hover:text-accent"
            : "text-white hover:text-accent"
        }`}
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
              : "bg-navy/90 border-white/5"
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
      className={`block font-medium py-2 px-3 rounded-md text-sm transition-colors hover:text-accent ${
        isLight ? "text-navy/80" : "text-white/90"
      }`}
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
      onClick={() => {
        scrollToSection(id);
        closeMobile();
      }}
      className={`block font-medium py-2 px-3 rounded-md w-full text-left text-sm transition-colors hover:text-accent ${
        isLight ? "text-navy/80" : "text-white/90"
      }`}
    >
      {children}
    </button>
  );

  // ── Theme-aware class helpers ─────────────────────────────────────────────
  const headerBg = isLight
    ? "bg-white/95 text-navy shadow-md border-b border-slate-200"
    : "bg-navy/95 text-white shadow-lg";

  const tickerBg = isLight
    ? "bg-white/95 py-3 border-b border-slate-200 shadow-sm"
    : "bg-gradient-to-r from-navy via-navy/95 to-navy py-3 border-b border-white/10";

  const mobileBg = isLight
    ? "md:hidden bg-white border-t border-slate-200"
    : "md:hidden bg-navy border-t border-white/10";

  const mobileIPOBlog = isLight
    ? "block hover:text-accent transition-colors font-medium py-3 px-3 rounded-md text-navy/90"
    : "block text-white hover:text-accent transition-colors font-medium py-3 px-3 rounded-md";

  const userBtnCls = isLight
    ? "p-2.5 rounded-full bg-navy/8 hover:bg-navy/15 transition-all hover:scale-110"
    : "p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-all hover:scale-110";

  const userIconCls = isLight ? "text-navy" : "text-white";

  const dropdownContentCls = isLight
    ? "min-w-[160px] p-2 bg-white text-navy rounded-xl shadow-xl ring-1 ring-black/10 border border-slate-200"
    : "min-w-[160px] p-2 bg-white text-navy rounded-xl shadow-xl ring-1 ring-black/10";

  return (
    <div className="sticky top-0 z-50">
      {/* ── Market Ticker Bar (always dark — industry standard) ── */}
      <div className={tickerBg}>
        <MarketTickerInline />
      </div>

      <header className={`${headerBg} backdrop-blur-sm`}>
        <nav className="container mx-auto px-6 py-3 flex items-center justify-between min-h-[64px]">

          {/* ── Left: logo + nav ──────────────────────────────────────────────── */}
          <div className="flex items-center gap-3 md:gap-5">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden hover:text-accent transition-colors p-2 rounded-md ${
                isLight ? "text-navy" : "text-white"
              }`}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <Link to="/" className="flex items-center shrink-0">
              <img
                src={isLight ? "/images/investbeans logo-03.png" : "/images/Untitled-6-04.png"}
                alt="InvestBeans Logo"
                className={`h-7 w-auto max-w-[150px] md:max-w-none object-contain relative -top-1  ${!isLight ? "filter contrast-125 "  : ""}`}
              />
            </Link>

            {/* Desktop nav list */}
            <ul className="hidden md:flex items-center gap-0.5">

              {/* 1. ABOUT */}
              <NavItem label="About" dd={about} theme={theme}>
                <div className="min-w-[260px]">
                  <DropBtn theme={theme} onClick={() => { scrollToSection("our-story"); about.close(); }}>Our Story & Founder's Journey</DropBtn>
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
                  <DropLink to="/global" onClick={segments.close} theme={theme}>Global</DropLink>
                  <DropLink to="/markets" onClick={segments.close} theme={theme}>Commodities</DropLink>
                  <DropLink to="/markets" onClick={segments.close} theme={theme}>Currency</DropLink>
                </div>
              </NavItem>

              {/* 3. DASHBOARDS */}
              <NavItem label="Dashboards" dd={dashboards} theme={theme}>
                <div className="min-w-[200px]">
                  <DropLink to="/dashboard" onClick={dashboards.close} theme={theme}>Bharat (India)</DropLink>
                  <DropLink to="/dashboard" onClick={dashboards.close} theme={theme}>Global</DropLink>
                  <DropLink to="/dashboard" onClick={dashboards.close} theme={theme}>ETFs</DropLink>
                </div>
              </NavItem>

              {/* 4. LEARN */}
              <NavItem label="Learn" dd={learn} theme={theme}>
                <div className="min-w-[220px]">
                  <DropSection label="Financial" theme={theme} />
                  <DropLink to="/education#financial-ebooks" onClick={learn.close} theme={theme}>E-books</DropLink>
                  <DropLink to="/education#financial-tutorials" onClick={learn.close} theme={theme}>Tutorials</DropLink>
                  <DropLink to="/education#financial-certifications" onClick={learn.close} theme={theme}>Certifications</DropLink>
                  <DropdownMenuSeparator className="my-1" />
                  <DropSection label="Non-Financial" theme={theme} />
                  <DropLink to="/education#nonfinancial-ebooks" onClick={learn.close} theme={theme}>E-books</DropLink>
                  <DropLink to="/education#nonfinancial-tutorials" onClick={learn.close} theme={theme}>Tutorials</DropLink>
                </div>
              </NavItem>

              {/* 5. EVENTS */}
              <NavItem label="Events" dd={events} theme={theme}>
                <div className="min-w-[160px]">
                  <DropLink to="/domestic" onClick={events.close} theme={theme}>Domestic</DropLink>
                  <DropLink to="/global" onClick={events.close} theme={theme}>Global</DropLink>
                </div>
              </NavItem>

              {/* 6. IPO */}
              <li>
                <Link
                  to="/ipos"
                  className={`font-medium hover:text-accent transition-colors px-2 py-1 rounded-md whitespace-nowrap ${
                    isLight ? "text-navy/90" : "text-white"
                  }`}
                >
                  IPO
                </Link>
              </li>

              {/* 7. BLOGS */}
              <li>
                <Link
                  to="/blogs"
                  className={`font-medium hover:text-accent transition-colors px-2 py-1 rounded-md whitespace-nowrap ${
                    isLight ? "text-navy/90" : "text-white"
                  }`}
                >
                  Blogs
                </Link>
              </li>

              {/* 8. HELP */}
              <NavItem label="Help" dd={help} theme={theme}>
                <div className="min-w-[160px]">
                  <DropLink to="/help-center" onClick={help.close} theme={theme}>FAQs</DropLink>
                  <DropLink to="/help-center" onClick={help.close} theme={theme}>Contact Us</DropLink>
                </div>
              </NavItem>

            </ul>
          </div>

          {/* ── Right: theme toggle + user menu ──────────────────────────── */}
          <div className="flex items-center gap-3">

            {/* ── Dark / Light Toggle Button ─────────────────────────────── */}
            <button
              onClick={toggleTheme}
              aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
              className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-accent/40 ${
                isLight
                  ? "bg-slate-100 hover:bg-slate-200 text-navy shadow-sm border border-slate-300"
                  : "bg-white/10 hover:bg-white/20 text-white"
              }`}
            >
              {isLight ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4" />
              )}
            </button>

            {isAuthenticated && user ? (
              <li onMouseEnter={userMenu.enter} onMouseLeave={userMenu.leave} className="list-none">
                <DropdownMenu open={userMenu.open} onOpenChange={userMenu.setOpen}>
                  <DropdownMenuTrigger asChild>
                    <button
                      onClick={userMenu.toggle}
                      className={`flex items-center gap-3 p-1.5 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-accent/40 ${
                        isLight ? "hover:bg-navy/8" : "hover:bg-white/10"
                      }`}
                    >
                      <Avatar className={`h-9 w-9 border-2 ring-2 ${isLight ? "border-slate-300 ring-slate-200" : "border-white/20 ring-white/10"}`}>
                        <AvatarImage src={user?.image} alt={user.name} className="object-cover" />
                        <AvatarFallback className="bg-gradient-to-br from-accent to-accent/80 text-white font-semibold">
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
                    className="min-w-[240px] p-2 bg-white text-navy rounded-xl shadow-xl ring-1 ring-black/10"
                  >
                    <div className="px-3 py-3 border-b border-gray-200">
                      <div className="flex items-center gap-3 mb-2">
                        <Avatar className="h-10 w-10 border-2 border-gray-200">
                          <AvatarImage src={user?.image} alt={user.name} className="object-cover" />
                          <AvatarFallback className="bg-gradient-to-br from-accent to-accent/80 text-white font-semibold text-sm">
                            {getUserInitials()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-navy truncate">{user.name}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                      </div>
                      {isAdmin && (
                        <div className="flex items-center gap-1.5 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 text-yellow-700 px-2.5 py-1.5 rounded-lg mt-2">
                          <Shield size={14} className="text-yellow-600" />
                          <span className="text-xs font-bold">Admin Access</span>
                        </div>
                      )}
                    </div>
                    <DropdownMenuSeparator className="my-2" />
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
                      <DropdownMenuContent
                        align="end"
                        sideOffset={8}
                        className={dropdownContentCls}
                      >
                        <DropdownMenuItem asChild>
                          <Link
                            to="/signin"
                            className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-accent/10 transition"
                            onClick={userMenu.close}
                          >
                            Login
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            to="/signup"
                            className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-accent/10 transition"
                            onClick={userMenu.close}
                          >
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
                    <DropdownMenuContent
                      align="end"
                      sideOffset={8}
                      className={dropdownContentCls}
                    >
                      <DropdownMenuItem asChild>
                        <Link
                          to="/signin"
                          className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-accent/10 transition"
                        >
                          Login
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          to="/signup"
                          className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-accent/10 transition"
                        >
                          Sign up
                        </Link>
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

                <MobileAccordion label="About" isOpen={mobileAboutOpen} toggle={() => setMobileAboutOpen((s) => !s)}>
                  <MobileScrollBtn id="our-story">Our Story & Founder's Journey</MobileScrollBtn>
                  <MobileScrollBtn id="mission">Mission, Vision & Values</MobileScrollBtn>
                  <MobileScrollBtn id="team-members">Team</MobileScrollBtn>
                  <MobileScrollBtn id="why-us">Why Us</MobileScrollBtn>
                  <MobileScrollBtn id="what-we-do">What We Do</MobileScrollBtn>
                  <MobileScrollBtn id="certifications">Trust and Compliance</MobileScrollBtn>
                </MobileAccordion>

                <MobileAccordion label="Segments" isOpen={mobileSegmentsOpen} toggle={() => setMobileSegmentsOpen((s) => !s)}>
                  <MobileSectionLabel label="Equity" />
                  <MobileLink to="/domestic">Domestic</MobileLink>
                  <MobileLink to="/global">Global</MobileLink>
                  <MobileLink to="/markets">Commodities</MobileLink>
                  <MobileLink to="/markets">Currency</MobileLink>
                </MobileAccordion>

                <MobileAccordion label="Dashboards" isOpen={mobileDashboardsOpen} toggle={() => setMobileDashboardsOpen((s) => !s)}>
                  <MobileLink to="/dashboard">Bharat (India)</MobileLink>
                  <MobileLink to="/dashboard">Global</MobileLink>
                  <MobileLink to="/dashboard">ETFs</MobileLink>
                </MobileAccordion>

                <MobileAccordion label="Learn" isOpen={mobileLearnOpen} toggle={() => setMobileLearnOpen((s) => !s)}>
                  <MobileSectionLabel label="Financial" />
                  <MobileLink to="/education#financial-ebooks">E-books</MobileLink>
                  <MobileLink to="/education#financial-tutorials">Tutorials</MobileLink>
                  <MobileLink to="/education#financial-certifications">Certifications</MobileLink>
                  <MobileSectionLabel label="Non-Financial" />
                  <MobileLink to="/education#nonfinancial-ebooks">E-books</MobileLink>
                  <MobileLink to="/education#nonfinancial-tutorials">Tutorials</MobileLink>
                </MobileAccordion>

                <MobileAccordion label="Events" isOpen={mobileEventsOpen} toggle={() => setMobileEventsOpen((s) => !s)}>
                  <MobileLink to="/domestic">Domestic</MobileLink>
                  <MobileLink to="/global">Global</MobileLink>
                </MobileAccordion>

                <li>
                  <Link to="/ipos" className={mobileIPOBlog} onClick={closeMobile}>
                    IPO
                  </Link>
                </li>

                <li>
                  <Link to="/blogs" className={mobileIPOBlog} onClick={closeMobile}>
                    Blogs
                  </Link>
                </li>

                <MobileAccordion label="Help" isOpen={mobileHelpOpen} toggle={() => setMobileHelpOpen((s) => !s)}>
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
                          : "bg-white text-navy hover:bg-accent hover:text-white"
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