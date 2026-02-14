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
import { useGlobalMarkets } from "@/hooks/useGlobalMarkets";
import { TrendingUp, TrendingDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  ChevronDown,
  User,
  LogOut,
  Shield,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Market Ticker Component (Inline)
const MarketTickerInline = () => {
  const { data } = useGlobalMarkets();
  const [isPaused, setIsPaused] = useState(false);
  const tickerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  // Combine all markets with safety checks
  const allMarkets = [
    ...(data?.indices.us || []),
    ...(data?.indices.europe || []),
    ...(data?.indices.asia || [])
  ].map(market => ({
    name: market.name,
    value: market.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    change: `${market.changePercent > 0 ? '+' : ''}${market.changePercent.toFixed(2)}%`,
    isPositive: market.changePercent >= 0
  }));

  // Auto-scroll animation
  useEffect(() => {
    const startAnimation = () => {
      if (tickerRef.current && !isPaused && allMarkets.length > 0) {
        const element = tickerRef.current;
        const scrollWidth = element.scrollWidth;
        const clientWidth = element.clientWidth;
        const maxScroll = scrollWidth - clientWidth;
        
        let currentScroll = element.scrollLeft;
        
        const animate = () => {
          if (!isPaused && tickerRef.current) {
            currentScroll += 0.5;
            if (currentScroll >= maxScroll / 2) {
              currentScroll = 0;
            }
            element.scrollLeft = currentScroll;
            animationRef.current = requestAnimationFrame(animate);
          }
        };
        
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    startAnimation();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPaused, allMarkets.length]);

  const scrollLeft = () => {
    if (tickerRef.current) {
      tickerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (tickerRef.current) {
      tickerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  if (allMarkets.length === 0) {
    return null;
  }

  return (
    <div className="relative flex items-center">
      {/* Left Arrow */}
      <button
        onClick={scrollLeft}
        className="absolute left-2 z-10 bg-navy/80 hover:bg-navy text-white p-1 rounded-full transition-colors"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Ticker Content */}
      <div className="flex-1 overflow-hidden mx-10">
        <div 
          ref={tickerRef}
          className="flex items-center gap-8 overflow-x-auto scrollbar-hide"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* First set of markets */}
          {allMarkets.map((market, index) => (
            <div key={`${market.name}-${index}`} className="flex items-center gap-4 whitespace-nowrap group hover:scale-105 transition-transform">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">{market.name}</span>
                <span className="font-bold text-base text-white">{market.value}</span>
              </div>
              <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                market.isPositive 
                  ? "bg-green-500/30 text-green-100 border border-green-400/50" 
                  : "bg-red-500/30 text-red-100 border border-red-400/50"
              }`}>
                {market.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {market.change}
              </div>
            </div>
          ))}
          {/* Duplicate set for continuous scrolling */}
          {allMarkets.map((market, index) => (
            <div key={`${market.name}-dup-${index}`} className="flex items-center gap-4 whitespace-nowrap group hover:scale-105 transition-transform">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">{market.name}</span>
                <span className="font-bold text-base text-white">{market.value}</span>
              </div>
              <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                market.isPositive 
                  ? "bg-green-500/30 text-green-100 border border-green-400/50" 
                  : "bg-red-500/30 text-red-100 border border-red-400/50"
              }`}>
                {market.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {market.change}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Arrow */}
      <button
        onClick={scrollRight}
        className="absolute right-2 z-10 bg-navy/80 hover:bg-navy text-white p-1 rounded-full transition-colors"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  function scrollToSection(id: string) {
    if (location.pathname === "/team") {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    navigate("/team");
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
  }

  const { isAuthenticated, signOut, user, isAdmin, showToast } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileMarketsOpen, setMobileMarketsOpen] = useState(false);
  const [mobileDashboardsOpen, setMobileDashboardsOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);

  const [dashboardsOpen, setDashboardsOpen] = useState(false);
  const [marketsOpen, setMarketsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
 

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user?.name) return "U";
    const names = user.name.split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return user.name.substring(0, 2).toUpperCase();
  };

  // Get avatar image - works for both Google and regular users
  const getAvatarImage = () => {
    // For Google users, use the image field
    if (user?.image) {
      return user.image;
    }
    // For regular users, you could add a profile picture upload feature later
    return undefined;
  };

  const handleSignOut = async () => {
    await signOut(() => {
      showToast("Logged out successfully. See you soon!", 'success');
      setTimeout(() => {
        navigate('/');
      }, 1000); 
    });
  };

  return (
    <div className="sticky top-0 z-50">
      {/* Market Ticker - Above Header */}
      <div className="bg-gradient-to-r from-navy via-navy/95 to-navy py-3 border-b border-white/10">
        <MarketTickerInline />
      </div>

      <header className="bg-navy/95 text-white shadow-lg backdrop-blur-sm">
        <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-white hover:text-accent transition-colors p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-accent/40"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>

            <Link to="/" className="text-2xl font-bold group">
              Invest<span className="font-normal text-accent">Beans</span>
            </Link>

            <ul className="hidden md:flex items-center space-x-6">
              <li>
                <DropdownMenu open={aboutOpen} onOpenChange={setAboutOpen}>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="font-medium hover:text-accent transition-colors px-2 py-1 rounded-md flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-accent/40"
                      onMouseEnter={() => setAboutOpen(true)}
                      onMouseLeave={() => setAboutOpen(false)}
                      onClick={() => setAboutOpen((s) => !s)}
                      aria-expanded={aboutOpen}
                    >
                      About
                      <ChevronDown
                        className={`w-4 h-4 opacity-80 transition-transform duration-300 ease-in-out ${
                          aboutOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="start"
                    sideOffset={6}
                    className="min-w-[240px] p-2 bg-white text-navy rounded-xl shadow-xl ring-1 ring-black/10 border border-white/10"
                    onMouseEnter={() => setAboutOpen(true)}
                    onMouseLeave={() => setAboutOpen(false)}
                  >
                    <DropdownMenuItem asChild>
                      <button
                        onClick={() => {
                          scrollToSection("our-story"); 
                          setAboutOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-accent/10 transition flex justify-between items-center"
                      >
                        <span>Our Story & Founder's Journey</span>
                      </button>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <button
                        onClick={() => {
                          scrollToSection("mission");
                          setAboutOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-accent/10 transition"
                      >
                        Mission & Vision
                      </button>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <button
                        onClick={() => {
                          scrollToSection("team-members");
                          setAboutOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-accent/10 transition"
                      >
                        Team & Values
                      </button>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <button
                        onClick={() => {
                          scrollToSection("why-us");
                          setAboutOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-accent/10 transition"
                      >
                        Why Us
                      </button>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <button
                        onClick={() => {
                          scrollToSection("certifications");
                          setAboutOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-accent/10 transition"
                      >
                        Certifications
                      </button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>

              <li>
                <DropdownMenu open={marketsOpen} onOpenChange={setMarketsOpen}>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="font-medium hover:text-accent transition-colors px-2 py-1 rounded-md flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-accent/40"
                      onMouseEnter={() => setMarketsOpen(true)}
                      onMouseLeave={() => setMarketsOpen(false)}
                      onClick={() => setMarketsOpen((s) => !s)}
                      aria-expanded={marketsOpen}
                    >
                      Markets
                      <ChevronDown
                        className={`w-4 h-4 opacity-80 transition-transform duration-300 ease-in-out ${
                          marketsOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="start"
                    sideOffset={6}
                    className="min-w-[180px] p-2 bg-white text-navy rounded-xl shadow-xl ring-1 ring-black/10 border border-white/10"
                    onMouseEnter={() => setMarketsOpen(true)}
                    onMouseLeave={() => setMarketsOpen(false)}
                  >
                    <DropdownMenuItem asChild>
                      <Link
                        to="/global"
                        className="px-3 py-2 text-sm rounded-md hover:bg-accent/10 transition block"
                        onClick={() => setMarketsOpen(false)}
                      >
                        Global
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        to="/domestic"
                        className="px-3 py-2 text-sm rounded-md hover:bg-accent/10 transition block"
                        onClick={() => setMarketsOpen(false)}
                      >
                        Domestic
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        to="/markets"
                        className="px-3 py-2 text-sm rounded-md hover:bg-accent/10 transition block"
                        onClick={() => setMarketsOpen(false)}
                      >
                        Commodities
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>

              <li>
                <DropdownMenu open={dashboardsOpen} onOpenChange={setDashboardsOpen}>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="font-medium hover:text-accent transition-colors px-2 py-1 rounded-md flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-accent/40"
                      onMouseEnter={() => setDashboardsOpen(true)}
                      onMouseLeave={() => setDashboardsOpen(false)}
                      onClick={() => setDashboardsOpen((s) => !s)}
                      aria-expanded={dashboardsOpen}
                    >
                      Dashboards
                      <ChevronDown
                        className={`w-4 h-4 opacity-80 transition-transform duration-300 ease-in-out ${
                          dashboardsOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="start"
                    sideOffset={6}
                    className="min-w-[250px] p-2 bg-white text-navy rounded-xl shadow-xl ring-1 ring-black/10 border border-white/10"
                    onMouseEnter={() => setDashboardsOpen(true)}
                    onMouseLeave={() => setDashboardsOpen(false)}
                  >
                    <DropdownMenuItem asChild>
                      <Link
                        to="/dashboard"
                        className="px-3 py-2 text-sm rounded-md hover:bg-accent/10 transition block"
                        onClick={() => setDashboardsOpen(false)}
                      >
                        InvestBeans Equity / US Stocks
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>

              <li>
                <Link
                  to="/education"
                  className="font-medium hover:text-accent transition-colors px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-accent/40"
                >
                  Education
                </Link>
              </li>

              <li>
                <Link
                  to="/blogs"
                  className="font-medium hover:text-accent transition-colors px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-accent/40"
                >
                  Blogs
                </Link>
              </li>
            </ul>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <DropdownMenu open={userMenuOpen} onOpenChange={setUserMenuOpen}>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-accent/40 rounded-full p-1">
                    <Avatar className="w-9 h-9 ring-2 ring-white/20">
                      <AvatarImage src={getAvatarImage()} alt={user?.name || "User"} />
                      <AvatarFallback className="bg-accent text-white font-semibold">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  sideOffset={8}
                  className="min-w-[220px] p-2 bg-white text-navy rounded-xl shadow-xl ring-1 ring-black/10"
                >
                  <div className="px-3 py-2 mb-2 border-b border-gray-200">
                    <p className="text-sm font-semibold truncate">{user?.name || "User"}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>

                  <DropdownMenuItem asChild>
                    <Link
                      to="/profile"
                      className="px-3 py-2 text-sm rounded-md hover:bg-accent/10 transition flex items-center gap-2"
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>

                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator className="my-1 bg-gray-200" />
                      <DropdownMenuItem asChild>
                        <Link
                          to="/admin"
                          className="px-3 py-2 text-sm rounded-md hover:bg-accent/10 transition flex items-center gap-2"
                        >
                          <Shield className="w-4 h-4" />
                          Admin Panel
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}

                  <DropdownMenuSeparator className="my-1 bg-gray-200" />
                  <DropdownMenuItem asChild>
                    <button
                      onClick={handleSignOut}
                      className="w-full px-3 py-2 text-sm rounded-md hover:bg-red-50 hover:text-red-600 transition flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white font-medium">
                    Log in
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-white text-navy hover:bg-accent hover:text-white font-semibold transition-all shadow-sm">
                    Sign up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-navy/98 backdrop-blur-sm border-t border-white/10 px-6 py-4 shadow-xl">
            <div className="max-h-[70vh] overflow-y-auto overscroll-contain">
              <ul className="space-y-1">
                <li className="rounded-md overflow-hidden">
                  <button
                    onClick={() => setMobileAboutOpen((s) => !s)}
                    className="w-full flex items-center justify-between text-left text-white hover:text-accent transition-colors font-medium py-3 px-3 rounded-md focus:outline-none focus:ring-2 focus:ring-accent/40"
                    aria-expanded={mobileAboutOpen}
                  >
                    <span className="font-medium">About</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-300 ease-in-out ${
                        mobileAboutOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <div
                    className={`mt-1 overflow-hidden transition-[max-height,opacity] duration-200 ease-in-out ${
                      mobileAboutOpen
                        ? "max-h-96 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <ul className="bg-navy/90 rounded-md border border-white/5 px-2 py-2 space-y-1">
                      {[
                        { id: "our-story", label: "Our Story & Founder's Journey" },
                        { id: "mission", label: "Mission & Visions" },
                        { id: "team-members", label: "Team & Values" },
                        { id: "why-us", label: "Why Us" },
                        { id: "certifications", label: "Certifications" },
                      ].map((it) => (
                        <li key={it.id}>
                          <button
                            onClick={() => {
                              scrollToSection(it.id);
                              setIsMobileMenuOpen(false);
                              setMobileAboutOpen(false);
                            }}
                            className="block text-white/90 hover:text-accent transition-colors font-medium py-2 px-3 rounded-md w-full text-left"
                          >
                            {it.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>

                <li className="rounded-md overflow-hidden">
                  <button
                    onClick={() => setMobileMarketsOpen((s) => !s)}
                    className="w-full flex items-center justify-between text-left text-white hover:text-accent transition-colors font-medium py-3 px-3 rounded-md focus:outline-none focus:ring-2 focus:ring-accent/40"
                    aria-expanded={mobileMarketsOpen}
                  >
                    <span className="font-medium">Markets</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-300 ease-in-out ${
                        mobileMarketsOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <div
                    className={`mt-1 overflow-hidden transition-[max-height,opacity] duration-200 ease-in-out ${
                      mobileMarketsOpen
                        ? "max-h-40 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <ul className="bg-navy/90 rounded-md border border-white/5 px-2 py-2 space-y-1">
                      <li>
                        <Link
                          to="/global"
                          className="block text-white/90 hover:text-accent transition-colors font-medium py-2 px-3 rounded-md"
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            setMobileMarketsOpen(false);
                          }}
                        >
                          Global
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/domestic"
                          className="block text-white/90 hover:text-accent transition-colors font-medium py-2 px-3 rounded-md"
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            setMobileMarketsOpen(false);
                          }}
                        >
                          Domestics
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/markets"
                          className="block text-white/90 hover:text-accent transition-colors font-medium py-2 px-3 rounded-md"
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            setMobileMarketsOpen(false);
                          }}
                        >
                          Commodities
                        </Link>
                      </li>
                    </ul>
                  </div>
                </li>

                <li className="rounded-md overflow-hidden">
                  <button
                    onClick={() => setMobileDashboardsOpen((s) => !s)}
                    className="w-full flex items-center justify-between text-left text-white hover:text-accent transition-colors font-medium py-3 px-3 rounded-md focus:outline-none focus:ring-2 focus:ring-accent/40"
                    aria-expanded={mobileDashboardsOpen}
                  >
                    <span className="font-medium">Dashboards</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-300 ease-in-out ${
                        mobileDashboardsOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <div
                    className={`mt-1 overflow-hidden transition-[max-height,opacity] duration-200 ease-in-out ${
                      mobileDashboardsOpen
                        ? "max-h-40 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <ul className="bg-navy/90 rounded-md border border-white/5 px-2 py-2 space-y-1">
                      <li>
                        <Link
                          to="/dashboard"
                          className="block text-white/90 hover:text-accent transition-colors font-medium py-2 px-3 rounded-md"
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            setMobileDashboardsOpen(false);
                          }}
                        >
                          InvestBeans Equity / US Stocks
                        </Link>
                      </li>
                    </ul>
                  </div>
                </li>

                <li>
                  <Link
                    to="/education"
                    className="block text-white hover:text-accent transition-colors font-medium py-3 px-3 rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Education
                  </Link>
                </li>

                <li>
                  <Link
                    to="/blogs"
                    className="block text-white hover:text-accent transition-colors font-medium py-3 px-3 rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Blogs
                  </Link>
                </li>

                <li className="pt-3">
                  {isAuthenticated && (
                    <Button
                      onClick={() => {
                        handleSignOut();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full bg-white text-navy hover:bg-accent hover:text-white font-semibold transition-all shadow-sm"
                    >
                      Log out
                    </Button>
                  )}
                </li>
              </ul>
            </div>
          </div>
        )}
      </header>
    </div>
  );
};

export default Header;