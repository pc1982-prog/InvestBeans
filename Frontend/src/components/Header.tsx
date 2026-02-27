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
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGlobalMarkets } from "@/hooks/useGlobalMarkets";

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

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  return { open, setOpen, enter, leave, toggle, close };
}

// ─── Market Ticker ─────────────────────────────────────────────────────────────
const MarketTickerInline = () => {
  const { data } = useGlobalMarkets();
  const [isPaused, setIsPaused] = useState(false);
  const tickerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const navigate = useNavigate(); // ← added

  const allMarkets = [
    ...(data?.indices.us || []),
    ...(data?.indices.europe || []),
    ...(data?.indices.asia || []),
  ].map((market) => ({
    symbol: market.symbol, // ← added
    name: market.name,
    value: market.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
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
    return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current); };
  }, [isPaused, allMarkets.length]);

  if (allMarkets.length === 0) return null;

  return (
    <div className="relative flex items-center">
      <button onClick={() => tickerRef.current?.scrollBy({ left: -200, behavior: "smooth" })} className="absolute left-2 z-10 bg-navy/80 hover:bg-navy text-white p-1 rounded-full transition-colors" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
        <ChevronLeft className="w-4 h-4" />
      </button>
      <div className="flex-1 overflow-hidden mx-10">
        <div ref={tickerRef} className="flex items-center gap-8 overflow-x-auto" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)} style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
          {[...allMarkets, ...allMarkets].map((market, index) => (
            <div
              key={`${market.name}-${index}`}
              onClick={() => navigate('/global', { state: { symbol: market.symbol, name: market.name } })} // ← added
              className="flex items-center gap-4 whitespace-nowrap group hover:scale-110 transition-transform cursor-pointer" // ← scale-105→110, cursor-pointer added
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">{market.name}</span>
                <span className="font-bold text-base text-white">{market.value}</span>
              </div>
              <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${market.isPositive ? "bg-green-500/30 text-green-100 border border-green-400/50" : "bg-red-500/30 text-red-100 border border-red-400/50"}`}>
                {market.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {market.change}
              </div>
            </div>
          ))}
        </div>
      </div>
      <button onClick={() => tickerRef.current?.scrollBy({ left: 200, behavior: "smooth" })} className="absolute right-2 z-10 bg-navy/80 hover:bg-navy text-white p-1 rounded-full transition-colors" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

// ─── Shared dropdown pieces ────────────────────────────────────────────────────
const DropSection = ({ label }: { label: string }) => (
  <p className="text-[10px] font-bold uppercase tracking-widest text-navy/40 px-3 pt-2 pb-0.5">{label}</p>
);

const DropLink = ({ to, onClick, children }: { to: string; onClick?: () => void; children: React.ReactNode }) => (
  <DropdownMenuItem asChild>
    <Link to={to} onClick={onClick} className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-accent/10 transition cursor-pointer">{children}</Link>
  </DropdownMenuItem>
);

const DropBtn = ({ onClick, children }: { onClick: () => void; children: React.ReactNode }) => (
  <DropdownMenuItem asChild>
    <button onClick={onClick} className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-accent/10 transition cursor-pointer">{children}</button>
  </DropdownMenuItem>
);

// ─── Desktop nav item wrapper — handles hover without blink ───────────────────
const NavItem = ({
  label,
  dd,
  children,
}: {
  label: string;
  dd: ReturnType<typeof useHoverDropdown>;
  children: React.ReactNode;
}) => (
  <li onMouseEnter={dd.enter} onMouseLeave={dd.leave}>
    <DropdownMenu open={dd.open} onOpenChange={dd.setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className="font-medium hover:text-accent transition-colors px-2 py-1 rounded-md flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-accent/40 whitespace-nowrap"
          onClick={dd.toggle}
        >
          {label}
          <ChevronDown className={`w-4 h-4 opacity-80 transition-transform duration-200 ${dd.open ? "rotate-180" : ""}`} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        sideOffset={6}
        className="p-2 bg-white text-navy rounded-xl shadow-xl ring-1 ring-black/10 border border-white/10"
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

  function scrollToSection(id: string) {
    if (location.pathname === "/team") {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    navigate("/team");
    setTimeout(() => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }); }, 120);
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
    return names.length >= 2 ? `${names[0][0]}${names[1][0]}`.toUpperCase() : user.name.substring(0, 2).toUpperCase();
  };

  const handleSignOut = async () => {
    await signOut(() => {
      showToast("Logged out successfully. See you soon!", "success");
      setTimeout(() => navigate("/"), 1000);
    });
  };

  // ── Mobile accordion component ──────────────────────────────────────────────
  const MobileAccordion = ({ label, isOpen, toggle, children }: { label: string; isOpen: boolean; toggle: () => void; children: React.ReactNode }) => (
    <li className="rounded-md overflow-hidden">
      <button onClick={toggle} className="w-full flex items-center justify-between text-white hover:text-accent transition-colors font-medium py-3 px-3 rounded-md">
        <span>{label}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      <div className={`overflow-hidden transition-[max-height,opacity] duration-200 ease-in-out ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="bg-navy/90 rounded-md border border-white/5 px-2 py-2 space-y-0.5 mb-1">
          {children}
        </div>
      </div>
    </li>
  );

  const MobileLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
    <Link to={to} className="block text-white/90 hover:text-accent transition-colors font-medium py-2 px-3 rounded-md text-sm" onClick={closeMobile}>{children}</Link>
  );

  const MobileSectionLabel = ({ label }: { label: string }) => (
    <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 px-3 pt-2 pb-0.5">{label}</p>
  );

  const MobileScrollBtn = ({ id, children }: { id: string; children: React.ReactNode }) => (
    <button onClick={() => { scrollToSection(id); closeMobile(); }} className="block text-white/90 hover:text-accent transition-colors font-medium py-2 px-3 rounded-md w-full text-left text-sm">
      {children}
    </button>
  );

  return (
    <div className="sticky top-0 z-50">
      {/* Ticker */}
      <div className="bg-gradient-to-r from-navy via-navy/95 to-navy py-3 border-b border-white/10">
        <MarketTickerInline />
      </div>

      <header className="bg-navy/95 text-white shadow-lg backdrop-blur-sm">
        <nav className="container mx-auto px-6 py-3 flex items-center justify-between min-h-[64px]">

          {/* ── Left: logo + nav ──────────────────────────────────────────────── */}
          <div className="flex items-center gap-3 md:gap-5">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-white hover:text-accent transition-colors p-2 rounded-md" aria-label="Toggle menu">
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <Link to="/"
              className="flex items-center shrink-0" >
              <img src="/images/Untitled-6-04.png" alt="InvestBeans Logo" className="h-7 w-auto object-contain relative -top-1 filter contrast-125" />
            </Link>
          
            {/* Desktop nav list */}
            <ul className="hidden md:flex items-center gap-0.5">

              {/* 1. ABOUT */}
              <NavItem label="About" dd={about}>
                <div className="min-w-[260px]">
                  <DropBtn onClick={() => { scrollToSection("our-story"); about.close(); }}>Our Story & Founder's Journey</DropBtn>
                  <DropBtn onClick={() => { scrollToSection("mission"); about.close(); }}>Mission, Vision & Values</DropBtn>
                  <DropBtn onClick={() => { scrollToSection("team-members"); about.close(); }}>Team</DropBtn>
                  <DropBtn onClick={() => { scrollToSection("why-us"); about.close(); }}>Why Us</DropBtn>
                  <DropBtn onClick={() => { scrollToSection("what-we-do"); about.close(); }}>What We Do</DropBtn>
                  <DropBtn onClick={() => { scrollToSection("certifications"); about.close(); }}>Trust and Compliance</DropBtn>
                </div>
              </NavItem>

              {/* 2. SEGMENTS */}
              <NavItem label="Segments" dd={segments}>
                <div className="min-w-[200px]">
                  <DropSection label="Equity" />
                  <DropLink to="/domestic" onClick={segments.close}>Domestic</DropLink>
                  <DropLink to="/global" onClick={segments.close}>Global</DropLink>
                  <DropLink to="/markets" onClick={segments.close}>Commodities</DropLink>
                  <DropLink to="/markets" onClick={segments.close}>Currency</DropLink>
                </div>
              </NavItem>

              {/* 3. DASHBOARDS */}
              <NavItem label="Dashboards" dd={dashboards}>
                <div className="min-w-[200px]">
                  <DropLink to="/dashboard" onClick={dashboards.close}>Bharat (India)</DropLink>
                  <DropLink to="/dashboard" onClick={dashboards.close}>Global</DropLink>
                  <DropLink to="/dashboard" onClick={dashboards.close}>ETFs</DropLink>
                </div>
              </NavItem>

              {/* 4. LEARN */}
              <NavItem label="Learn" dd={learn}>
                <div className="min-w-[220px]">
                  <DropSection label="Financial" />
                  <DropLink to="/education#financial-ebooks" onClick={learn.close}>E-books</DropLink>
                  <DropLink to="/education#financial-tutorials" onClick={learn.close}>Tutorials</DropLink>
                  <DropLink to="/education#financial-certifications" onClick={learn.close}>Certifications</DropLink>
                  <DropdownMenuSeparator className="my-1" />
                  <DropSection label="Non-Financial" />
                  <DropLink to="/education#nonfinancial-ebooks" onClick={learn.close}>E-books</DropLink>
                  <DropLink to="/education#nonfinancial-tutorials" onClick={learn.close}>Tutorials</DropLink>
                </div>
              </NavItem>

              {/* 5. EVENTS */}
              <NavItem label="Events" dd={events}>
                <div className="min-w-[160px]">
                  <DropLink to="/domestic" onClick={events.close}>Domestic</DropLink>
                  <DropLink to="/global" onClick={events.close}>Global</DropLink>
                </div>
              </NavItem>

              {/* 6. IPO */}
              <li>
                <Link to="/ipos" className="font-medium hover:text-accent transition-colors px-2 py-1 rounded-md whitespace-nowrap">
                  IPO
                </Link>
              </li>

              {/* 7. BLOGS */}
              <li>
                <Link to="/blogs" className="font-medium hover:text-accent transition-colors px-2 py-1 rounded-md whitespace-nowrap">
                  Blogs
                </Link>
              </li>

              {/* 8. HELP */}
              <NavItem label="Help" dd={help}>
                <div className="min-w-[160px]">
                  <DropLink to="/help-center" onClick={help.close}>FAQs</DropLink>
                  <DropLink to="/help-center" onClick={help.close}>Contact Us</DropLink>
                </div>
              </NavItem>

            </ul>
          </div>

          {/* ── Right: user menu ──────────────────────────────────────────────── */}
          <div className="flex items-center gap-4">
            {isAuthenticated && user ? (
              <li onMouseEnter={userMenu.enter} onMouseLeave={userMenu.leave} className="list-none">
                <DropdownMenu open={userMenu.open} onOpenChange={userMenu.setOpen}>
                  <DropdownMenuTrigger asChild>
                    <button onClick={userMenu.toggle} className="flex items-center gap-3 p-1.5 rounded-full hover:bg-white/10 transition-all focus:outline-none focus:ring-2 focus:ring-accent/40">
                      <Avatar className="h-9 w-9 border-2 border-white/20 ring-2 ring-white/10">
                        <AvatarImage src={user?.image} alt={user.name} className="object-cover" />
                        <AvatarFallback className="bg-gradient-to-br from-accent to-accent/80 text-white font-semibold">{getUserInitials()}</AvatarFallback>
                      </Avatar>
                      <span className="hidden md:block text-sm font-medium max-w-[150px] truncate">{user.name}</span>
                      <ChevronDown className="hidden md:block w-4 h-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" sideOffset={8} className="min-w-[240px] p-2 bg-white text-navy rounded-xl shadow-xl ring-1 ring-black/10">
                    <div className="px-3 py-3 border-b border-gray-200">
                      <div className="flex items-center gap-3 mb-2">
                        <Avatar className="h-10 w-10 border-2 border-gray-200">
                          <AvatarImage src={user?.image} alt={user.name} className="object-cover" />
                          <AvatarFallback className="bg-gradient-to-br from-accent to-accent/80 text-white font-semibold text-sm">{getUserInitials()}</AvatarFallback>
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
                      <button onClick={() => { userMenu.close(); handleSignOut(); }} className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm font-medium hover:bg-destructive/10 text-destructive transition">
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
                        <button onClick={userMenu.toggle} className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-all hover:scale-110">
                          <User className="w-5 h-5 text-white" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" sideOffset={8} className="min-w-[160px] p-2 bg-white text-navy rounded-xl shadow-xl ring-1 ring-black/10">
                        <DropdownMenuItem asChild>
                          <Link to="/signin" className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-accent/10 transition" onClick={userMenu.close}>Login</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/signup" className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-accent/10 transition" onClick={userMenu.close}>Sign up</Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </li>
                </div>
                {/* Mobile guest */}
                <div className="md:hidden">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-all hover:scale-110">
                        <User className="w-5 h-5 text-white" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" sideOffset={8} className="min-w-[160px] p-2 bg-white text-navy rounded-xl shadow-xl ring-1 ring-black/10">
                      <DropdownMenuItem asChild>
                        <Link to="/signin" className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-accent/10 transition">Login</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/signup" className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-accent/10 transition">Sign up</Link>
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
          <div className="md:hidden bg-navy border-t border-white/10">
            <div className="container mx-auto px-4 py-4">
              <ul className="space-y-1">

                <MobileAccordion label="About" isOpen={mobileAboutOpen} toggle={() => setMobileAboutOpen(s => !s)}>
                  <MobileScrollBtn id="our-story">Our Story & Founder's Journey</MobileScrollBtn>
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
                  <MobileLink to="/markets">Commodities</MobileLink>
                  <MobileLink to="/markets">Currency</MobileLink>
                </MobileAccordion>

                <MobileAccordion label="Dashboards" isOpen={mobileDashboardsOpen} toggle={() => setMobileDashboardsOpen(s => !s)}>
                  <MobileLink to="/dashboard">Bharat (India)</MobileLink>
                  <MobileLink to="/dashboard">Global</MobileLink>
                  <MobileLink to="/dashboard">ETFs</MobileLink>
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
                  <Link to="/ipos" className="block text-white hover:text-accent transition-colors font-medium py-3 px-3 rounded-md" onClick={closeMobile}>IPO</Link>
                </li>

                <li>
                  <Link to="/blogs" className="block text-white hover:text-accent transition-colors font-medium py-3 px-3 rounded-md" onClick={closeMobile}>Blogs</Link>
                </li>

                <MobileAccordion label="Help" isOpen={mobileHelpOpen} toggle={() => setMobileHelpOpen(s => !s)}>
                  <MobileLink to="/help-center">FAQs</MobileLink>
                  <MobileLink to="/help-center">Contact Us</MobileLink>
                </MobileAccordion>

                {isAuthenticated && (
                  <li className="pt-3">
                    <Button onClick={() => { handleSignOut(); closeMobile(); }} className="w-full bg-white text-navy hover:bg-accent hover:text-white font-semibold transition-all shadow-sm">
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