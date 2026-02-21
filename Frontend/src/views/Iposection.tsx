import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  DollarSign, 
  Users, 
  Building2, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  ArrowRight,
  Star,
  Target,
  Award,
  Shield,
  Zap,
  BarChart3,
  FileText,
  ExternalLink,
  Search,
  IndianRupee,
  Percent,
  ChevronRight
} from 'lucide-react';

type IPOStatus = 'upcoming' | 'open' | 'closed' | 'listed';

interface IPO {
  id: number;
  companyName: string;
  logo: string;
  industry: string;
  status: IPOStatus;
  openDate: string;
  closeDate: string;
  listingDate?: string;
  priceRange: string;
  lotSize: number;
  issueSize: string;
  minInvestment: string;
  subscriptionStatus?: string;
  listingGain?: number;
  gmp?: number;
  allotmentDate?: string;
  refundDate?: string;
  exchange: string;
  rating: number;
}

const IPOSection = () => {
  const [activeTab, setActiveTab] = useState<IPOStatus>('open');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIPO, setSelectedIPO] = useState<IPO | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ── FIX 3: Indian IPO fields (Zerodha style) ─────────────────────────────
  const ipoData: IPO[] = [
    {
      id: 1,
      companyName: "Tata Technologies Ltd",
      logo: "TT",
      industry: "IT Services",
      status: "listed",
      openDate: "Nov 22, 2023",
      closeDate: "Nov 24, 2023",
      listingDate: "Nov 30, 2023",
      allotmentDate: "Nov 27, 2023",
      refundDate: "Nov 28, 2023",
      priceRange: "₹475 – ₹500",
      lotSize: 30,
      minInvestment: "₹15,000",
      issueSize: "₹3,042 Cr",
      subscriptionStatus: "69.43×",
      listingGain: 140,
      gmp: 650,
      exchange: "NSE / BSE",
      rating: 5
    },
    {
      id: 2,
      companyName: "Ideaforge Technology Ltd",
      logo: "IF",
      industry: "Defence & Aerospace",
      status: "listed",
      openDate: "Jun 26, 2023",
      closeDate: "Jun 29, 2023",
      listingDate: "Jul 07, 2023",
      allotmentDate: "Jul 04, 2023",
      refundDate: "Jul 05, 2023",
      priceRange: "₹638 – ₹672",
      lotSize: 22,
      minInvestment: "₹14,784",
      issueSize: "₹567 Cr",
      subscriptionStatus: "35.24×",
      listingGain: 52,
      gmp: 1050,
      exchange: "NSE / BSE",
      rating: 4
    },
    {
      id: 3,
      companyName: "Honasa Consumer Ltd",
      logo: "HC",
      industry: "FMCG & Retail",
      status: "open",
      openDate: "Jan 29, 2026",
      closeDate: "Feb 02, 2026",
      allotmentDate: "Feb 05, 2026",
      refundDate: "Feb 06, 2026",
      listingDate: "Feb 07, 2026",
      priceRange: "₹308 – ₹324",
      lotSize: 46,
      minInvestment: "₹14,904",
      issueSize: "₹1,701 Cr",
      subscriptionStatus: "12.5× (Day 1)",
      gmp: 65,
      exchange: "NSE / BSE",
      rating: 4
    },
    {
      id: 4,
      companyName: "Aeroflex Industries Ltd",
      logo: "AI",
      industry: "Automobile Components",
      status: "open",
      openDate: "Jan 28, 2026",
      closeDate: "Jan 31, 2026",
      allotmentDate: "Feb 03, 2026",
      refundDate: "Feb 04, 2026",
      listingDate: "Feb 05, 2026",
      priceRange: "₹102 – ₹108",
      lotSize: 138,
      minInvestment: "₹14,904",
      issueSize: "₹212 Cr",
      subscriptionStatus: "8.2× (Day 2)",
      gmp: 18,
      exchange: "NSE / BSE",
      rating: 3
    },
    {
      id: 5,
      companyName: "Premier Energies Ltd",
      logo: "PE",
      industry: "Renewable Energy",
      status: "upcoming",
      openDate: "Feb 05, 2026",
      closeDate: "Feb 07, 2026",
      allotmentDate: "Feb 10, 2026",
      refundDate: "Feb 11, 2026",
      listingDate: "Feb 12, 2026",
      priceRange: "₹425 – ₹450",
      lotSize: 33,
      minInvestment: "₹14,850",
      issueSize: "₹1,291 Cr",
      gmp: 85,
      exchange: "NSE / BSE",
      rating: 5
    },
    {
      id: 6,
      companyName: "Ola Electric Mobility",
      logo: "OE",
      industry: "Electric Vehicles",
      status: "upcoming",
      openDate: "Feb 10, 2026",
      closeDate: "Feb 12, 2026",
      allotmentDate: "Feb 15, 2026",
      refundDate: "Feb 16, 2026",
      listingDate: "Feb 17, 2026",
      priceRange: "₹72 – ₹76",
      lotSize: 195,
      minInvestment: "₹14,820",
      issueSize: "₹5,500 Cr",
      gmp: 12,
      exchange: "NSE / BSE",
      rating: 4
    },
    {
      id: 7,
      companyName: "Emcure Pharmaceuticals",
      logo: "EP",
      industry: "Pharmaceuticals",
      status: "closed",
      openDate: "Jan 15, 2026",
      closeDate: "Jan 17, 2026",
      allotmentDate: "Jan 20, 2026",
      refundDate: "Jan 21, 2026",
      listingDate: "Jan 24, 2026",
      priceRange: "₹960 – ₹1,008",
      lotSize: 14,
      minInvestment: "₹14,112",
      issueSize: "₹1,952 Cr",
      subscriptionStatus: "67.87×",
      exchange: "NSE / BSE",
      rating: 4
    },
    {
      id: 8,
      companyName: "Waaree Energies Ltd",
      logo: "WE",
      industry: "Solar Manufacturing",
      status: "upcoming",
      openDate: "Feb 15, 2026",
      closeDate: "Feb 19, 2026",
      allotmentDate: "Feb 22, 2026",
      refundDate: "Feb 23, 2026",
      listingDate: "Feb 24, 2026",
      priceRange: "₹1,427 – ₹1,503",
      lotSize: 9,
      minInvestment: "₹13,527",
      issueSize: "₹4,321 Cr",
      gmp: 245,
      exchange: "NSE / BSE",
      rating: 5
    },
    {
      id: 9,
      companyName: "Zomato Ltd",
      logo: "ZO",
      industry: "Food Delivery & Tech",
      status: "listed",
      openDate: "Jul 14, 2021",
      closeDate: "Jul 16, 2021",
      listingDate: "Jul 23, 2021",
      allotmentDate: "Jul 20, 2021",
      refundDate: "Jul 21, 2021",
      priceRange: "₹72 – ₹76",
      lotSize: 195,
      minInvestment: "₹14,820",
      issueSize: "₹9,375 Cr",
      subscriptionStatus: "38.25×",
      listingGain: 53,
      gmp: 28,
      exchange: "NSE / BSE",
      rating: 4
    },
    {
      id: 10,
      companyName: "Nykaa (FSN E-Commerce)",
      logo: "NY",
      industry: "E-Commerce & Beauty",
      status: "listed",
      openDate: "Oct 28, 2021",
      closeDate: "Nov 01, 2021",
      listingDate: "Nov 10, 2021",
      allotmentDate: "Nov 05, 2021",
      refundDate: "Nov 08, 2021",
      priceRange: "₹1,085 – ₹1,125",
      lotSize: 13,
      minInvestment: "₹14,625",
      issueSize: "₹5,352 Cr",
      subscriptionStatus: "82×",
      listingGain: 79,
      gmp: 350,
      exchange: "NSE / BSE",
      rating: 5
    },
  ];

  // ── FIX 3: Homepage shows only 3 IPOs ────────────────────────────────────
  const [showAll, setShowAll] = useState(false);

  const filteredIPOs = ipoData.filter(ipo =>
    ipo.status === activeTab &&
    ipo.companyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayedIPOs = showAll ? filteredIPOs : filteredIPOs.slice(0, 3);

  const getStatusConfig = (status: IPOStatus) => ({
    upcoming: { bg: 'bg-blue-500/10', text: 'text-blue-500', icon: <Clock className="w-3 h-3" />, label: 'Upcoming' },
    open:     { bg: 'bg-green-500/10', text: 'text-green-500', icon: <CheckCircle className="w-3 h-3" />, label: 'Open Now' },
    closed:   { bg: 'bg-orange-500/10', text: 'text-orange-500', icon: <AlertCircle className="w-3 h-3" />, label: 'Closed' },
    listed:   { bg: 'bg-purple-500/10', text: 'text-purple-500', icon: <TrendingUp className="w-3 h-3" />, label: 'Listed' },
  }[status]);

  const getStatusBadge = (status: IPOStatus) => {
    const cfg = getStatusConfig(status);
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
        {cfg.icon}{cfg.label}
      </span>
    );
  };

  const getRatingStars = (rating: number) =>
    [...Array(5)].map((_, i) => (
      <Star key={i} className={`w-3.5 h-3.5 ${i < rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'}`} />
    ));

  const openModal = (ipo: IPO) => { setSelectedIPO(ipo); setIsModalOpen(true); };
  const closeModal = () => { setIsModalOpen(false); setTimeout(() => setSelectedIPO(null), 300); };

  // ── FIX 1 & 2 helper: switch tab and scroll to list ──────────────────────
  const switchTab = (tab: IPOStatus) => {
    setActiveTab(tab);
    setShowAll(false);
    setSearchQuery('');
    setTimeout(() => {
      document.getElementById('ipo-list-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">

      {/* ── Hero Section ───────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-r from-navy via-navy-light to-accent py-16 md:py-24">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-6">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium text-white">Live IPO Updates</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Initial Public Offerings
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
              Stay updated with the latest IPOs, track subscription status in real-time,
              and make informed investment decisions with comprehensive IPO analysis.
            </p>

            {/* ── FIX 2: Hero stat tiles are now clickable buttons ────────── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {([
                { status: 'open' as IPOStatus,     icon: <Building2 className="w-8 h-8 text-yellow-400 mx-auto mb-2" />, count: ipoData.filter(i => i.status === 'open').length,     label: 'Open Now' },
                { status: 'upcoming' as IPOStatus, icon: <Clock className="w-8 h-8 text-blue-400 mx-auto mb-2" />,     count: ipoData.filter(i => i.status === 'upcoming').length, label: 'Upcoming' },
                { status: 'listed' as IPOStatus,   icon: <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />, count: ipoData.filter(i => i.status === 'listed').length,  label: 'Listed' },
                { status: 'closed' as IPOStatus,   icon: <Award className="w-8 h-8 text-purple-400 mx-auto mb-2" />,  count: ipoData.filter(i => i.status === 'closed').length,   label: 'Closed' },
              ]).map(({ status, icon, count, label }) => (
                <button
                  key={status}
                  onClick={() => switchTab(status)}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-200 cursor-pointer text-center group"
                >
                  {icon}
                  <div className="text-2xl font-bold text-white">{count}</div>
                  <div className="text-sm text-white/80 group-hover:text-white transition-colors">{label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Content ───────────────────────────────────────────────────── */}
      <section id="ipo-list-section" className="container mx-auto px-4 md:px-6 py-12 md:py-16">

        {/* ── FIX 1: Search bar ABOVE tabs ────────────────────────────────── */}
        <div className="mb-8 space-y-4">

          {/* Search — now first */}
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search IPOs..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setShowAll(false); }}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>

          {/* Tabs — now below search */}
          <div className="flex flex-wrap gap-2 justify-center">
            {(['open', 'upcoming', 'closed', 'listed'] as IPOStatus[]).map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setShowAll(false); }}
                className={`px-6 py-3 rounded-lg font-semibold text-sm transition-all ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-accent to-accent/80 text-white shadow-lg'
                    : 'bg-card text-muted-foreground hover:bg-card/80 border border-border'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)} IPOs
              </button>
            ))}
          </div>
        </div>

        {/* ── FIX 3: IPO Cards — Zerodha-style Indian fields ──────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedIPOs.map((ipo) => (
            <div
              key={ipo.id}
              className="bg-card rounded-2xl border border-border shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group hover:-translate-y-1"
            >
              {/* Card Header */}
              <div className="p-5 border-b border-border">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {ipo.logo}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-foreground text-[15px] leading-tight truncate">{ipo.companyName}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{ipo.industry}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  {getStatusBadge(ipo.status)}
                  <div className="flex items-center gap-0.5">{getRatingStars(ipo.rating)}</div>
                </div>
              </div>

              {/* Card Body — Zerodha-style fields */}
              <div className="p-5 space-y-3">

                {/* Price Band */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Price Band</span>
                  <span className="font-bold text-foreground">{ipo.priceRange}</span>
                </div>

                {/* Lot Size */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Lot Size</span>
                  <span className="font-semibold text-foreground">{ipo.lotSize} shares</span>
                </div>

                {/* Min Investment */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Min. Investment</span>
                  <span className="font-bold text-accent">{ipo.minInvestment}</span>
                </div>

                {/* Issue Size */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Issue Size</span>
                  <span className="font-semibold text-foreground">{ipo.issueSize}</span>
                </div>

                <div className="border-t border-border/50 pt-3 space-y-2">
                  {/* Open / Close Date */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />Open Date</span>
                    <span className="font-medium text-foreground">{ipo.openDate}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />Close Date</span>
                    <span className="font-medium text-foreground">{ipo.closeDate}</span>
                  </div>
                  {ipo.allotmentDate && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" />Allotment</span>
                      <span className="font-medium text-foreground">{ipo.allotmentDate}</span>
                    </div>
                  )}
                  {ipo.listingDate && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5" />Listing Date</span>
                      <span className="font-medium text-foreground">{ipo.listingDate}</span>
                    </div>
                  )}
                </div>

                {/* Subscription */}
                {ipo.subscriptionStatus && (
                  <div className="flex items-center justify-between p-2.5 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <span className="text-xs text-green-700 dark:text-green-400 font-medium flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />Subscription
                    </span>
                    <span className="text-xs font-bold text-green-700 dark:text-green-400">{ipo.subscriptionStatus}</span>
                  </div>
                )}

                {/* GMP */}
                {ipo.gmp && ipo.gmp > 0 && (
                  <div className="flex items-center justify-between p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <span className="text-xs text-blue-700 dark:text-blue-400 font-medium flex items-center gap-1">
                      <Target className="w-3.5 h-3.5" />GMP
                    </span>
                    <span className="text-xs font-bold text-blue-700 dark:text-blue-400">+₹{ipo.gmp}</span>
                  </div>
                )}

                {/* Listing Gain */}
                {ipo.listingGain !== undefined && (
                  <div className={`flex items-center justify-between p-2.5 rounded-lg ${
                    ipo.listingGain >= 0 ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'
                  }`}>
                    <span className={`text-xs font-medium flex items-center gap-1 ${ipo.listingGain >= 0 ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                      {ipo.listingGain >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                      Listing Gain
                    </span>
                    <span className={`text-xs font-bold ${ipo.listingGain >= 0 ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                      {ipo.listingGain >= 0 ? '+' : ''}{ipo.listingGain}%
                    </span>
                  </div>
                )}

                {/* Exchange */}
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                  <span>Exchange</span>
                  <span className="font-semibold text-foreground">{ipo.exchange}</span>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-5 pb-5">
                <button
                  onClick={() => openModal(ipo)}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-accent to-accent/80 text-white rounded-lg font-semibold text-sm hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
                >
                  View Details
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredIPOs.length === 0 && (
          <div className="text-center py-16">
            <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No IPOs Found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
          </div>
        )}

        {/* ── FIX 3: "View All IPOs" tab after 3 cards ────────────────────── */}
        {filteredIPOs.length > 3 && (
          <div className="mt-8 text-center">
            <button
              onClick={() => setShowAll(prev => !prev)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/20 hover:border-accent/40 transition-all duration-200 group"
            >
              <span className="text-accent font-semibold text-sm">
                {showAll ? 'Show Less' : `View All ${filteredIPOs.length} IPOs`}
              </span>
              <ChevronRight className={`w-4 h-4 text-accent transition-transform duration-200 ${showAll ? 'rotate-90' : 'group-hover:translate-x-1'}`} />
            </button>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 p-6 rounded-2xl border border-blue-500/20">
            <Shield className="w-10 h-10 text-blue-500 mb-4" />
            <h3 className="text-lg font-bold text-foreground mb-2">SEBI Regulated</h3>
            <p className="text-sm text-muted-foreground">
              All IPOs listed are SEBI-regulated with complete RHP transparency for informed decisions.
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 p-6 rounded-2xl border border-green-500/20">
            <BarChart3 className="w-10 h-10 text-green-500 mb-4" />
            <h3 className="text-lg font-bold text-foreground mb-2">Live GMP & Subscription</h3>
            <p className="text-sm text-muted-foreground">
              Real-time grey market premium, subscription data, and day-wise allotment tracking.
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 p-6 rounded-2xl border border-purple-500/20">
            <FileText className="w-10 h-10 text-purple-500 mb-4" />
            <h3 className="text-lg font-bold text-foreground mb-2">Expert Analysis</h3>
            <p className="text-sm text-muted-foreground">
              Detailed IPO reviews, DRHP financials, and apply/avoid recommendations from experts.
            </p>
          </div>
        </div>
      </section>

      {/* ── Modal ──────────────────────────────────────────────────────────── */}
      {isModalOpen && selectedIPO && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="bg-card rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-navy to-accent p-5 md:p-6 z-10">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-xl border-2 border-white/30">
                    {selectedIPO.logo}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white leading-tight">{selectedIPO.companyName}</h2>
                    <p className="text-white/70 text-sm">{selectedIPO.industry} · {selectedIPO.exchange}</p>
                    <div className="flex items-center gap-2 mt-2">
                      {getStatusBadge(selectedIPO.status)}
                      <div className="flex items-center gap-0.5">{getRatingStars(selectedIPO.rating)}</div>
                    </div>
                  </div>
                </div>
                <button onClick={closeModal} className="text-white hover:bg-white/20 rounded-full p-2 transition-colors flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-5 md:p-6 space-y-6">
              {/* Key Details — Zerodha style table */}
              <div>
                <h3 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-accent" />Issue Details
                </h3>
                <div className="rounded-xl border border-border overflow-hidden">
                  {[
                    ['Price Band', selectedIPO.priceRange],
                    ['Issue Size', selectedIPO.issueSize],
                    ['Lot Size', `${selectedIPO.lotSize} shares`],
                    ['Min. Investment', selectedIPO.minInvestment],
                    ['Exchange', selectedIPO.exchange],
                  ].map(([label, value], i) => (
                    <div key={i} className={`flex items-center justify-between px-4 py-3 text-sm ${i % 2 === 0 ? 'bg-background' : 'bg-card'}`}>
                      <span className="text-muted-foreground">{label}</span>
                      <span className="font-semibold text-foreground">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Important Dates */}
              <div>
                <h3 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-accent" />Important Dates
                </h3>
                <div className="rounded-xl border border-border overflow-hidden">
                  {[
                    ['Open Date', selectedIPO.openDate, 'text-green-600 dark:text-green-400'],
                    ['Close Date', selectedIPO.closeDate, 'text-orange-600 dark:text-orange-400'],
                    ...(selectedIPO.allotmentDate ? [['Allotment Date', selectedIPO.allotmentDate, 'text-blue-600 dark:text-blue-400']] : []),
                    ...(selectedIPO.refundDate ? [['Refund / UPI Mandate', selectedIPO.refundDate, 'text-muted-foreground']] : []),
                    ...(selectedIPO.listingDate ? [['Listing Date', selectedIPO.listingDate, 'text-purple-600 dark:text-purple-400']] : []),
                  ].map(([label, value, color], i) => (
                    <div key={i} className={`flex items-center justify-between px-4 py-3 text-sm ${i % 2 === 0 ? 'bg-background' : 'bg-card'}`}>
                      <span className="text-muted-foreground">{label}</span>
                      <span className={`font-semibold ${color}`}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance */}
              {(selectedIPO.subscriptionStatus || selectedIPO.listingGain !== undefined || selectedIPO.gmp) && (
                <div>
                  <h3 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-accent" />Performance
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {selectedIPO.subscriptionStatus && (
                      <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center">
                        <p className="text-xs text-muted-foreground mb-1">Subscription</p>
                        <p className="text-2xl font-bold text-green-700 dark:text-green-400">{selectedIPO.subscriptionStatus}</p>
                        <p className="text-xs text-muted-foreground">times</p>
                      </div>
                    )}
                    {selectedIPO.gmp !== undefined && selectedIPO.gmp > 0 && (
                      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-center">
                        <p className="text-xs text-muted-foreground mb-1">GMP</p>
                        <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">+₹{selectedIPO.gmp}</p>
                        <p className="text-xs text-muted-foreground">grey market</p>
                      </div>
                    )}
                    {selectedIPO.listingGain !== undefined && (
                      <div className={`rounded-xl p-4 text-center border ${selectedIPO.listingGain >= 0 ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                        <p className="text-xs text-muted-foreground mb-1">Listing Gain</p>
                        <p className={`text-2xl font-bold ${selectedIPO.listingGain >= 0 ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                          {selectedIPO.listingGain >= 0 ? '+' : ''}{selectedIPO.listingGain}%
                        </p>
                        <p className="text-xs text-muted-foreground">on listing day</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Min Investment Calculator */}
              <div className="bg-accent/5 border border-accent/20 rounded-xl p-4">
                <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                  <IndianRupee className="w-4 h-4 text-accent" />Minimum Investment Required
                </h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Lot Size</p>
                    <p className="text-lg font-bold text-foreground">{selectedIPO.lotSize} shares</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Amount</p>
                    <p className="text-lg font-bold text-accent">{selectedIPO.minInvestment}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button className="flex-1 py-3 px-4 bg-gradient-to-r from-accent to-accent/80 text-white rounded-lg font-semibold text-sm hover:shadow-lg transition-all flex items-center justify-center gap-2">
                  <FileText className="w-4 h-4" />View RHP / DRHP
                </button>
                <button className="flex-1 py-3 px-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold text-sm hover:shadow-lg transition-all flex items-center justify-center gap-2">
                  <ExternalLink className="w-4 h-4" />Apply via ASBA
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IPOSection;