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
  Download,
  ExternalLink,
  Filter,
  Search
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
  subscriptionStatus?: string;
  listingGain?: number;
  gmp?: number;
  rating: number;
}

const IPOSection = () => {
  const [activeTab, setActiveTab] = useState<IPOStatus>('open');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIPO, setSelectedIPO] = useState<IPO | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Realistic IPO Data - Extended with International & Famous Indian
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
      priceRange: "₹475 - ₹500",
      lotSize: 30,
      issueSize: "₹3,042 Cr",
      subscriptionStatus: "69.43x",
      listingGain: 140,
      gmp: 650,
      rating: 5
    },
    {
      id: 2,
      companyName: "Ideaforge Technology Ltd",
      logo: "IF",
      industry: "Defense & Aerospace",
      status: "listed",
      openDate: "Jun 26, 2023",
      closeDate: "Jun 29, 2023",
      listingDate: "Jul 07, 2023",
      priceRange: "₹638 - ₹672",
      lotSize: 22,
      issueSize: "₹567 Cr",
      subscriptionStatus: "35.24x",
      listingGain: 52,
      gmp: 1050,
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
      priceRange: "₹308 - ₹324",
      lotSize: 46,
      issueSize: "₹1,701 Cr",
      subscriptionStatus: "12.5x (Day 1)",
      gmp: 65,
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
      priceRange: "₹102 - ₹108",
      lotSize: 138,
      issueSize: "₹212 Cr",
      subscriptionStatus: "8.2x (Day 2)",
      gmp: 18,
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
      priceRange: "₹425 - ₹450",
      lotSize: 33,
      issueSize: "₹1,291 Cr",
      gmp: 85,
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
      priceRange: "₹72 - ₹76",
      lotSize: 195,
      issueSize: "₹5,500 Cr",
      gmp: 12,
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
      listingDate: "Jan 24, 2026",
      priceRange: "₹960 - ₹1,008",
      lotSize: 14,
      issueSize: "₹1,952 Cr",
      subscriptionStatus: "67.87x",
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
      priceRange: "₹1,427 - ₹1,503",
      lotSize: 9,
      issueSize: "₹4,321 Cr",
      gmp: 245,
      rating: 5
    },
    // NEW FAMOUS INDIAN IPOs
    {
      id: 9,
      companyName: "Zomato Ltd",
      logo: "ZO",
      industry: "Food Delivery & Tech",
      status: "listed",
      openDate: "Jul 14, 2021",
      closeDate: "Jul 16, 2021",
      listingDate: "Jul 23, 2021",
      priceRange: "₹72 - ₹76",
      lotSize: 195,
      issueSize: "₹9,375 Cr",
      subscriptionStatus: "38.25x",
      listingGain: 53,
      gmp: 28,
      rating: 4
    },
    {
      id: 10,
      companyName: "Paytm (One97 Comm)",
      logo: "PT",
      industry: "Fintech & Payments",
      status: "listed",
      openDate: "Nov 08, 2021",
      closeDate: "Nov 10, 2021",
      listingDate: "Nov 18, 2021",
      priceRange: "₹2,080 - ₹2,150",
      lotSize: 6,
      issueSize: "₹18,300 Cr",
      subscriptionStatus: "1.73x",
      listingGain: -27,
      gmp: -250,
      rating: 3
    },
    {
      id: 11,
      companyName: "LIC (Life Insurance Corp)",
      logo: "LI",
      industry: "Insurance",
      status: "listed",
      openDate: "May 04, 2022",
      closeDate: "May 09, 2022",
      listingDate: "May 17, 2022",
      priceRange: "₹902 - ₹949",
      lotSize: 15,
      issueSize: "₹21,008 Cr",
      subscriptionStatus: "2.95x",
      listingGain: -8,
      gmp: 50,
      rating: 4
    },
    {
      id: 12,
      companyName: "Nykaa (FSN E-Commerce)",
      logo: "NY",
      industry: "E-Commerce & Beauty",
      status: "listed",
      openDate: "Oct 28, 2021",
      closeDate: "Nov 01, 2021",
      listingDate: "Nov 10, 2021",
      priceRange: "₹1,085 - ₹1,125",
      lotSize: 13,
      issueSize: "₹5,352 Cr",
      subscriptionStatus: "82x",
      listingGain: 79,
      gmp: 350,
      rating: 5
    },
    // INTERNATIONAL IPOs
    {
      id: 13,
      companyName: "Arm Holdings (UK)",
      logo: "AR",
      industry: "Semiconductor Design",
      status: "listed",
      openDate: "Sep 13, 2023",
      closeDate: "Sep 13, 2023",
      listingDate: "Sep 14, 2023",
      priceRange: "$47 - $51",
      lotSize: 100,
      issueSize: "$4.87 Billion",
      subscriptionStatus: "10x Oversubscribed",
      listingGain: 25,
      gmp: 12,
      rating: 5
    }
  ];

  const filteredIPOs = ipoData.filter(ipo => 
    ipo.status === activeTab && 
    ipo.companyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: IPOStatus) => {
    const badges = {
      upcoming: { bg: 'bg-blue-500/10', text: 'text-blue-500', icon: <Clock className="w-3 h-3" />, label: 'Upcoming' },
      open: { bg: 'bg-green-500/10', text: 'text-green-500', icon: <CheckCircle className="w-3 h-3" />, label: 'Open Now' },
      closed: { bg: 'bg-orange-500/10', text: 'text-orange-500', icon: <AlertCircle className="w-3 h-3" />, label: 'Closed' },
      listed: { bg: 'bg-purple-500/10', text: 'text-purple-500', icon: <TrendingUp className="w-3 h-3" />, label: 'Listed' }
    };
    
    const badge = badges[status];
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>
        {badge.icon}
        {badge.label}
      </span>
    );
  };

  const getRatingStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <Star 
        key={index} 
        className={`w-4 h-4 ${index < rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'}`} 
      />
    ));
  };

  const openModal = (ipo: IPO) => {
    setSelectedIPO(ipo);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedIPO(null), 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-navy via-navy-light to-accent py-16 md:py-24">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
        
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
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <Building2 className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{ipoData.filter(i => i.status === 'open').length}</div>
                <div className="text-sm text-white/80">Open Now</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <Clock className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{ipoData.filter(i => i.status === 'upcoming').length}</div>
                <div className="text-sm text-white/80">Upcoming</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{ipoData.filter(i => i.status === 'listed').length}</div>
                <div className="text-sm text-white/80">Listed</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <Award className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">8+</div>
                <div className="text-sm text-white/80">This Month</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        {/* Filters & Search */}
        <div className="mb-8 space-y-4">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 justify-center">
            {(['open', 'upcoming', 'closed', 'listed'] as IPOStatus[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-lg font-semibold text-sm transition-all ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-accent to-accent/80 text-white shadow-lg'
                    : 'bg-card text-muted-foreground hover:bg-card/80'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)} IPOs
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search IPOs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>
        </div>

        {/* IPO Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIPOs.map((ipo) => (
            <div
              key={ipo.id}
              className="bg-card rounded-2xl border border-border shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group hover:-translate-y-1"
            >
              {/* Card Header */}
              <div className="bg-gradient-to-br from-navy/5 to-accent/5 p-6 border-b border-border">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-navy flex items-center justify-center text-white font-bold text-lg">
                      {ipo.logo}
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground text-lg leading-tight">
                        {ipo.companyName}
                      </h3>
                      <p className="text-sm text-muted-foreground">{ipo.industry}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  {getStatusBadge(ipo.status)}
                  <div className="flex items-center gap-1">
                    {getRatingStars(ipo.rating)}
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-4">
                {/* Price Range */}
                <div className="flex items-center justify-between p-3 bg-accent/5 rounded-lg">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-sm">Price Range</span>
                  </div>
                  <span className="font-bold text-foreground">{ipo.priceRange}</span>
                </div>

                {/* Dates */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Open Date
                    </span>
                    <span className="font-medium text-foreground">{ipo.openDate}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Close Date
                    </span>
                    <span className="font-medium text-foreground">{ipo.closeDate}</span>
                  </div>
                  {ipo.listingDate && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        Listing Date
                      </span>
                      <span className="font-medium text-foreground">{ipo.listingDate}</span>
                    </div>
                  )}
                </div>

                {/* Key Details */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-background rounded-lg">
                    <div className="text-xs text-muted-foreground mb-1">Lot Size</div>
                    <div className="font-bold text-foreground">{ipo.lotSize} Shares</div>
                  </div>
                  <div className="p-3 bg-background rounded-lg">
                    <div className="text-xs text-muted-foreground mb-1">Issue Size</div>
                    <div className="font-bold text-foreground">{ipo.issueSize}</div>
                  </div>
                </div>

                {/* Subscription Status */}
                {ipo.subscriptionStatus && (
                  <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-green-700 dark:text-green-400 font-medium flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        Subscription
                      </span>
                      <span className="font-bold text-green-700 dark:text-green-400">
                        {ipo.subscriptionStatus}
                      </span>
                    </div>
                  </div>
                )}

                {/* GMP */}
                {ipo.gmp && (
                  <div className="flex items-center justify-between p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <span className="text-sm text-blue-700 dark:text-blue-400 font-medium flex items-center gap-1">
                      <Target className="w-4 h-4" />
                      Grey Market Premium
                    </span>
                    <span className="font-bold text-blue-700 dark:text-blue-400">
                      +₹{ipo.gmp}
                    </span>
                  </div>
                )}

                {/* Listing Gain */}
                {ipo.listingGain && (
                  <div className={`flex items-center justify-between p-3 rounded-lg ${
                    ipo.listingGain > 0 
                      ? 'bg-green-500/10 border border-green-500/20' 
                      : 'bg-red-500/10 border border-red-500/20'
                  }`}>
                    <span className={`text-sm font-medium flex items-center gap-1 ${
                      ipo.listingGain > 0 ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'
                    }`}>
                      {ipo.listingGain > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      Listing Gain
                    </span>
                    <span className={`font-bold ${
                      ipo.listingGain > 0 ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'
                    }`}>
                      {ipo.listingGain > 0 ? '+' : ''}{ipo.listingGain}%
                    </span>
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="p-6 pt-0">
                <button 
                  onClick={() => openModal(ipo)}
                  className="w-full py-3 px-4 bg-gradient-to-r from-accent to-accent/80 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
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

        {/* Info Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 p-6 rounded-2xl border border-blue-500/20">
            <Shield className="w-10 h-10 text-blue-500 mb-4" />
            <h3 className="text-lg font-bold text-foreground mb-2">Safe Investment</h3>
            <p className="text-sm text-muted-foreground">
              Research thoroughly and invest in SEBI-regulated IPOs with complete transparency.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 p-6 rounded-2xl border border-green-500/20">
            <BarChart3 className="w-10 h-10 text-green-500 mb-4" />
            <h3 className="text-lg font-bold text-foreground mb-2">Real-Time Data</h3>
            <p className="text-sm text-muted-foreground">
              Get live subscription status, GMP updates, and listing performance tracking.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 p-6 rounded-2xl border border-purple-500/20">
            <FileText className="w-10 h-10 text-purple-500 mb-4" />
            <h3 className="text-lg font-bold text-foreground mb-2">Expert Analysis</h3>
            <p className="text-sm text-muted-foreground">
              Access detailed IPO reviews, financials, and expert recommendations.
            </p>
          </div>
        </div>
      </section>

      {/* Modal */}
      {isModalOpen && selectedIPO && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div 
            className="bg-card rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-border animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-br from-navy to-accent p-6 border-b border-border/50 backdrop-blur-sm z-10">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-navy font-bold text-2xl shadow-lg">
                    {selectedIPO.logo}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">
                      {selectedIPO.companyName}
                    </h2>
                    <p className="text-white/80">{selectedIPO.industry}</p>
                    <div className="flex items-center gap-2 mt-2">
                      {getStatusBadge(selectedIPO.status)}
                      <div className="flex items-center gap-1">
                        {getRatingStars(selectedIPO.rating)}
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Key Highlights */}
              <div>
                <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-accent" />
                  Key Highlights
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-accent/10 to-accent/5 p-4 rounded-xl border border-accent/20">
                    <div className="flex items-center gap-2 text-accent mb-2">
                      <DollarSign className="w-5 h-5" />
                      <span className="text-sm font-medium">Price Range</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">{selectedIPO.priceRange}</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 p-4 rounded-xl border border-blue-500/20">
                    <div className="flex items-center gap-2 text-blue-500 mb-2">
                      <Building2 className="w-5 h-5" />
                      <span className="text-sm font-medium">Issue Size</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">{selectedIPO.issueSize}</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 p-4 rounded-xl border border-green-500/20">
                    <div className="flex items-center gap-2 text-green-500 mb-2">
                      <Users className="w-5 h-5" />
                      <span className="text-sm font-medium">Lot Size</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">{selectedIPO.lotSize} Shares</p>
                  </div>
                  
                  {selectedIPO.gmp && (
                    <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 p-4 rounded-xl border border-purple-500/20">
                      <div className="flex items-center gap-2 text-purple-500 mb-2">
                        <Target className="w-5 h-5" />
                        <span className="text-sm font-medium">Grey Market Premium</span>
                      </div>
                      <p className="text-2xl font-bold text-foreground">+₹{selectedIPO.gmp}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-accent" />
                  IPO Timeline
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-background rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">Open Date</p>
                        <p className="text-sm text-muted-foreground">IPO subscription starts</p>
                      </div>
                    </div>
                    <span className="font-bold text-foreground">{selectedIPO.openDate}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-background rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-orange-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">Close Date</p>
                        <p className="text-sm text-muted-foreground">Last day to apply</p>
                      </div>
                    </div>
                    <span className="font-bold text-foreground">{selectedIPO.closeDate}</span>
                  </div>
                  
                  {selectedIPO.listingDate && (
                    <div className="flex items-center justify-between p-4 bg-background rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                          <TrendingUp className="w-5 h-5 text-purple-500" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">Listing Date</p>
                          <p className="text-sm text-muted-foreground">Stock exchange debut</p>
                        </div>
                      </div>
                      <span className="font-bold text-foreground">{selectedIPO.listingDate}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Performance Metrics */}
              {(selectedIPO.subscriptionStatus || selectedIPO.listingGain) && (
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-accent" />
                    Performance Metrics
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedIPO.subscriptionStatus && (
                      <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 p-5 rounded-xl border border-green-500/20">
                        <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-2">
                          <Users className="w-5 h-5" />
                          <span className="font-semibold">Subscription Status</span>
                        </div>
                        <p className="text-3xl font-bold text-green-700 dark:text-green-400">
                          {selectedIPO.subscriptionStatus}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">Times subscribed</p>
                      </div>
                    )}
                    
                    {selectedIPO.listingGain !== undefined && (
                      <div className={`p-5 rounded-xl border ${
                        selectedIPO.listingGain > 0 
                          ? 'bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20' 
                          : 'bg-gradient-to-br from-red-500/10 to-red-500/5 border-red-500/20'
                      }`}>
                        <div className={`flex items-center gap-2 mb-2 ${
                          selectedIPO.listingGain > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                        }`}>
                          {selectedIPO.listingGain > 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                          <span className="font-semibold">Listing Gain/Loss</span>
                        </div>
                        <p className={`text-3xl font-bold ${
                          selectedIPO.listingGain > 0 ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'
                        }`}>
                          {selectedIPO.listingGain > 0 ? '+' : ''}{selectedIPO.listingGain}%
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">On listing day</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Investment Calculator */}
              <div className="bg-gradient-to-br from-navy/5 to-accent/5 p-5 rounded-xl border border-accent/20">
                <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-accent" />
                  Minimum Investment Required
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Lot Size</p>
                    <p className="text-xl font-bold text-foreground">{selectedIPO.lotSize} shares</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Min. Amount</p>
                    <p className="text-xl font-bold text-accent">
                      {selectedIPO.priceRange.includes('$') ? '$' : '₹'}
                      {(selectedIPO.lotSize * parseInt(selectedIPO.priceRange.split('-')[1].replace(/[^0-9]/g, ''))).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button className="flex-1 py-3 px-6 bg-gradient-to-r from-accent to-accent/80 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2">
                  <FileText className="w-5 h-5" />
                  Download Prospectus
                </button>
                <button className="flex-1 py-3 px-6 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2">
                  <ExternalLink className="w-5 h-5" />
                  Apply Now
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