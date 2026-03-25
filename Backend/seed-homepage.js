import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI;
const DB_NAME = "InvestBeans";

// ── Inline schemas ───────────────────────────────────────────────────────────

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  refreshToken: String,
}, { timestamps: true });

const ipoSchema = new mongoose.Schema({
  companyName: String, logo: String, logoUrl: String, logoPublicId: String,
  industry: String,
  status: { type: String, enum: ["upcoming", "open", "closed"], default: "upcoming" },
  category: { type: String, enum: ["Mainboard", "SME"], default: "Mainboard" },
  exchange: { type: String, default: "NSE / BSE" },
  openDate: String, closeDate: String, allotmentDate: String,
  refundDate: String, upiDate: String, listingDate: String,
  priceRange: String, lotSize: Number, issueSize: String, minInvestment: String,
  subscriptionStatus: String, listingGain: Number, gmp: Number,
  rating: { type: Number, default: 3 }, rhpLink: String,
  swot: {
    strengths: [String], weaknesses: [String],
    opportunities: [String], threats: [String],
  },
}, { timestamps: true });

const insightSchema = new mongoose.Schema({
  title: String, description: String,
  investBeansInsight: {
    summary: String, marketSignificance: String, impactArea: String,
    stocksImpacted: String, shortTermView: String, longTermView: String,
    keyRisk: String, impactScore: { type: Number, default: 5 },
  },
  credits: { source: String, author: String, url: String, publishedDate: Date },
  sentiment: { type: String, enum: ["positive", "negative", "neutral"], default: "neutral" },
  category: String,
  marketType: { type: String, enum: ["domestic", "global", "commodities"] },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  likedBy: [mongoose.Schema.Types.ObjectId],
  readTime: { type: String, default: "5 min read" },
  isPublished: { type: Boolean, default: true },
  publishedAt: { type: Date, default: Date.now },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

const testimonialSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  name: String, role: String, company: String, avatar: String,
  rating: { type: Number, min: 1, max: 5 },
  preview: String, fullText: String,
  tag: { type: String, default: "General" },
  source: { type: String, default: "InvestBeans" },
  approved: { type: Boolean, default: true },
}, { timestamps: true });

const beanOfWisdomSchema = new mongoose.Schema({
  avatarText: String, title: String, subtitle: String,
  sectionTitle: String, description: String,
  keyPrinciple: String, quote: String,
  insightTag: String, insightText: String,
  tags: [String],
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", userSchema);
const IPO = mongoose.models.IPO || mongoose.model("IPO", ipoSchema);
const Insight = mongoose.models.Insight || mongoose.model("Insight", insightSchema);
const Testimonial = mongoose.models.Testimonial || mongoose.model("Testimonial", testimonialSchema);
const BeanOfWisdom = mongoose.models.BeanOfWisdom || mongoose.model("BeanOfWisdom", beanOfWisdomSchema);

// ══════════════════════════════════════════════════════════════════════════════
//  SEED USERS (12 users for testimonials)
// ══════════════════════════════════════════════════════════════════════════════

const SEED_USERS = [
  { name: "Rahul Sharma", email: "rahul.seed@investbeans.in", password: "SeedPass123!" },
  { name: "Priya Mehta", email: "priya.seed@investbeans.in", password: "SeedPass123!" },
  { name: "Amit Patel", email: "amit.seed@investbeans.in", password: "SeedPass123!" },
  { name: "Sneha Kapoor", email: "sneha.seed@investbeans.in", password: "SeedPass123!" },
  { name: "Vikram Desai", email: "vikram.seed@investbeans.in", password: "SeedPass123!" },
  { name: "Ananya Reddy", email: "ananya.seed@investbeans.in", password: "SeedPass123!" },
  { name: "Rohan Gupta", email: "rohan.seed@investbeans.in", password: "SeedPass123!" },
  { name: "Kavita Joshi", email: "kavita.seed@investbeans.in", password: "SeedPass123!" },
  { name: "Arjun Nair", email: "arjun.seed@investbeans.in", password: "SeedPass123!" },
  { name: "Deepika Singh", email: "deepika.seed@investbeans.in", password: "SeedPass123!" },
  { name: "Manish Agarwal", email: "manish.seed@investbeans.in", password: "SeedPass123!" },
  { name: "Tanvi Bhatt", email: "tanvi.seed@investbeans.in", password: "SeedPass123!" },
];

// ══════════════════════════════════════════════════════════════════════════════
//  SEED IPOs (10 IPOs)
// ══════════════════════════════════════════════════════════════════════════════

const SEED_IPOS = [
  {
    companyName: "Hexaware Technologies Ltd", logo: "HT", industry: "IT Services", status: "open",
    category: "Mainboard", exchange: "NSE / BSE",
    openDate: "2026-03-20", closeDate: "2026-03-28",
    allotmentDate: "2026-04-01", listingDate: "2026-04-05",
    priceRange: "₹674 – ₹710", lotSize: 21, issueSize: "4,914 Cr",
    minInvestment: "₹14,910", subscriptionStatus: "12.47×", gmp: 85, rating: 4,
    swot: {
      strengths: ["Strong digital transformation capabilities", "Consistent revenue growth of 18% YoY", "Marquee client base including Fortune 500"],
      weaknesses: ["High employee attrition rate", "Dependency on North American market for 65% revenue"],
      opportunities: ["AI/ML services demand growing 40% annually", "Government digitization push in India"],
      threats: ["Intense competition from TCS, Infosys, Wipro", "Rupee appreciation can impact margins"],
    },
  },
  {
    companyName: "Vikram Solar Ltd", logo: "VS", industry: "Solar Manufacturing", status: "open",
    category: "Mainboard", exchange: "NSE / BSE",
    openDate: "2026-03-22", closeDate: "2026-03-27",
    priceRange: "₹320 – ₹340", lotSize: 44, issueSize: "1,850 Cr",
    minInvestment: "₹14,960", gmp: 45, rating: 4, subscriptionStatus: "6.2×",
    swot: {
      strengths: ["India's top 3 solar module manufacturer", "Integrated manufacturing from cells to modules"],
      weaknesses: ["Capital intensive business model", "Thin margins of 6-8%"],
      opportunities: ["India targets 500 GW renewable energy by 2030", "PLI scheme benefits"],
      threats: ["Cheap Chinese imports", "Policy uncertainty on subsidies"],
    },
  },
  {
    companyName: "Ather Energy Ltd", logo: "AE", industry: "Electric Vehicles", status: "upcoming",
    category: "Mainboard", exchange: "NSE / BSE",
    openDate: "2026-04-12", closeDate: "2026-04-16",
    priceRange: "₹555 – ₹585", lotSize: 25, issueSize: "3,100 Cr",
    minInvestment: "₹14,625", gmp: 120, rating: 5,
    swot: {
      strengths: ["Market leader in premium EV scooters", "Strong R&D with in-house battery tech", "Growing charging infrastructure (Ather Grid)"],
      weaknesses: ["Still loss-making, negative EBITDA", "Limited product portfolio"],
      opportunities: ["EV penetration in India still under 5%", "FAME III subsidy expected"],
      threats: ["Competition from Ola, TVS, Bajaj", "Battery raw material price volatility"],
    },
  },
  {
    companyName: "PharmEasy (API Holdings)", logo: "PE", industry: "Healthcare", status: "upcoming",
    category: "Mainboard", exchange: "NSE / BSE",
    openDate: "2026-04-20", closeDate: "2026-04-24",
    priceRange: "₹180 – ₹200", lotSize: 75, issueSize: "6,250 Cr",
    minInvestment: "₹15,000", gmp: 30, rating: 3,
    swot: {
      strengths: ["India's largest e-pharmacy by orders", "Strong last-mile delivery network across 1,000+ cities"],
      weaknesses: ["Significant accumulated losses", "Burn rate still high despite cost cutting"],
      opportunities: ["Online pharma penetration at just 5% in India", "Chronic care subscription model showing traction"],
      threats: ["Regulatory risk on online drug sales", "Competition from Tata 1mg, Flipkart Health"],
    },
  },
  {
    companyName: "boAt (Imagine Marketing)", logo: "BT", industry: "E-Commerce & Beauty", status: "upcoming",
    category: "Mainboard", exchange: "NSE / BSE",
    openDate: "2026-05-05", closeDate: "2026-05-09",
    priceRange: "₹420 – ₹450", lotSize: 33, issueSize: "2,000 Cr",
    minInvestment: "₹14,850", gmp: 65, rating: 4,
    swot: {
      strengths: ["India's #1 wearable brand by market share", "Strong brand recall among Gen Z and millennials", "Asset-light model with outsourced manufacturing"],
      weaknesses: ["Low margins in consumer electronics", "Heavy dependence on online channels"],
      opportunities: ["Smart wearables market growing 35% CAGR", "International expansion into SE Asia and Middle East"],
      threats: ["Chinese competition from Noise, Xiaomi", "Commodity price fluctuation for components"],
    },
  },
  {
    companyName: "Tata Capital Ltd", logo: "TC", industry: "Banking & Finance", status: "closed",
    category: "Mainboard", exchange: "NSE / BSE",
    openDate: "2026-02-10", closeDate: "2026-02-14",
    allotmentDate: "2026-02-18", listingDate: "2026-02-22",
    priceRange: "₹450 – ₹475", lotSize: 31, issueSize: "8,500 Cr",
    minInvestment: "₹14,725", subscriptionStatus: "34.21×",
    listingGain: 28, gmp: 140, rating: 5,
    swot: {
      strengths: ["Tata brand trust and ecosystem", "Diversified lending portfolio", "Strong digital lending platform"],
      weaknesses: ["Higher cost of funds vs banks", "NPA management challenges in SME segment"],
      opportunities: ["Fintech integration growth", "Under-penetrated rural lending"],
      threats: ["RBI regulatory tightening for NBFCs", "Rising interest rate environment"],
    },
  },
  {
    companyName: "Lenskart Solutions Ltd", logo: "LS", industry: "E-Commerce & Beauty", status: "closed",
    category: "Mainboard", exchange: "NSE / BSE",
    openDate: "2026-01-15", closeDate: "2026-01-19",
    allotmentDate: "2026-01-23", listingDate: "2026-01-27",
    priceRange: "₹380 – ₹400", lotSize: 37, issueSize: "5,200 Cr",
    minInvestment: "₹14,800", subscriptionStatus: "18.56×",
    listingGain: 42, gmp: 95, rating: 4,
    swot: {
      strengths: ["India's largest eyewear retailer", "Omnichannel presence: 2,000+ stores + online", "Profitable at EBITDA level"],
      weaknesses: ["High customer acquisition cost", "Competition from Titan Eyeplus"],
      opportunities: ["Only 40% vision correction penetration in India", "International expansion in SE Asia"],
      threats: ["D2C brands entering eyewear space", "Dependency on discretionary spending"],
    },
  },
  {
    companyName: "MapMyIndia (CE Info Systems)", logo: "MI", industry: "IT Services", status: "closed",
    category: "Mainboard", exchange: "NSE / BSE",
    openDate: "2026-01-05", closeDate: "2026-01-09",
    allotmentDate: "2026-01-13", listingDate: "2026-01-17",
    priceRange: "₹900 – ₹950", lotSize: 15, issueSize: "1,540 Cr",
    minInvestment: "₹14,250", subscriptionStatus: "22.8×",
    listingGain: 53, gmp: 200, rating: 5,
    swot: {
      strengths: ["India's Google Maps alternative — deep local mapping", "B2B and B2G revenue streams stable", "Proprietary data set built over 25 years"],
      weaknesses: ["Small revenue base compared to global peers", "High R&D spend"],
      opportunities: ["Autonomous vehicle mapping in India", "Smart city integration contracts"],
      threats: ["Google Maps remains dominant consumer choice", "Government mapping agency competition"],
    },
  },
  {
    companyName: "Swiggy Instamart Retail Ltd", logo: "SI", industry: "Food Delivery & Tech", status: "closed",
    category: "Mainboard", exchange: "NSE / BSE",
    openDate: "2025-12-10", closeDate: "2025-12-14",
    allotmentDate: "2025-12-18", listingDate: "2025-12-22",
    priceRange: "₹280 – ₹310", lotSize: 48, issueSize: "11,300 Cr",
    minInvestment: "₹14,880", subscriptionStatus: "8.9×",
    listingGain: -5, gmp: 10, rating: 3,
    swot: {
      strengths: ["Second largest food delivery platform in India", "Instamart quick commerce growing 80% YoY"],
      weaknesses: ["Still loss-making at net level", "Intense cash burn in quick commerce"],
      opportunities: ["Quick commerce TAM estimated at $50B by 2030", "Advertising revenue stream scaling"],
      threats: ["Zomato well ahead on profitability", "Reliance JioMart, Flipkart Minutes entering space"],
    },
  },
  {
    companyName: "Pristyn Care Ltd", logo: "PC", industry: "Healthcare", status: "upcoming",
    category: "Mainboard", exchange: "NSE / BSE",
    openDate: "2026-04-28", closeDate: "2026-05-02",
    priceRange: "₹260 – ₹280", lotSize: 53, issueSize: "1,400 Cr",
    minInvestment: "₹14,840", gmp: 20, rating: 3,
    swot: {
      strengths: ["India's largest elective surgery platform", "Asset-light model partnering with 800+ hospitals"],
      weaknesses: ["Path to profitability uncertain", "High marketing spend for patient acquisition"],
      opportunities: ["Elective surgery market highly fragmented", "Insurance penetration increasing"],
      threats: ["Hospital chains building own digital funnels", "Regulatory risk on healthcare aggregation"],
    },
  },
];

// ══════════════════════════════════════════════════════════════════════════════
//  SEED INSIGHTS (12 insights)
// ══════════════════════════════════════════════════════════════════════════════

const SEED_INSIGHTS = [
  {
    title: "RBI Holds Repo Rate at 6.5% — Markets React Positively",
    description: "The Reserve Bank of India maintained its benchmark repo rate at 6.5% for the eighth consecutive time, signaling confidence in the inflation trajectory while supporting growth momentum.",
    investBeansInsight: {
      summary: "RBI's status quo on rates is a clear signal that the central bank is comfortable with the current inflation-growth balance. This benefits rate-sensitive sectors.",
      marketSignificance: "Rate stability provides certainty for corporate borrowing costs and housing demand. Banking sector margins remain protected while NBFCs benefit from stable funding costs.",
      impactArea: "Banking, Real Estate, NBFCs, Auto",
      stocksImpacted: "HDFC Bank, SBI, Bajaj Finance, DLF, Godrej Properties, M&M Finance",
      shortTermView: "Positive for equity markets. Bank Nifty likely to outperform. Housing finance stocks may see 3-5% upside.",
      longTermView: "Rate cuts expected in H2 2026. This positions India favorably for foreign capital inflows. Long-term bullish for rate-sensitive sectors.",
      keyRisk: "Global rate divergence — if US Fed delays cuts further, FII flows may moderate despite domestic stability.",
      impactScore: 8,
    },
    credits: { source: "Reserve Bank of India", author: "RBI Monetary Policy Committee", url: "https://rbi.org.in" },
    sentiment: "positive", category: "Monetary Policy", marketType: "domestic",
    views: 1240, likes: 89, readTime: "4 min read",
  },
  {
    title: "NVIDIA Q4 Results Beat Estimates — AI Capex Continues to Surge",
    description: "NVIDIA reported Q4 revenue of $39.2 billion, up 78% YoY, driven by relentless demand for AI training and inference chips. Data center revenue alone crossed $35 billion.",
    investBeansInsight: {
      summary: "NVIDIA's dominance in AI infrastructure is accelerating. The results confirm that enterprise AI spending is not slowing down — it's expanding to new verticals.",
      marketSignificance: "Sets the tone for global tech earnings. Indian IT companies with AI/ML practices (TCS, Infosys, HCL Tech) benefit from downstream demand.",
      impactArea: "Technology, Semiconductors, IT Services",
      stocksImpacted: "NVIDIA, AMD, TSMC, TCS, Infosys, HCL Technologies, KPIT Technologies",
      shortTermView: "US tech rally likely to continue. NASDAQ may test new highs. Indian IT index could see 2-3% follow-through buying.",
      longTermView: "AI infrastructure buildout is a multi-year theme. Companies positioned in AI services and chip design will see sustained revenue growth through 2028.",
      keyRisk: "Valuation stretch — NVIDIA trades at 45x forward earnings. Any guidance miss could trigger sharp correction.",
      impactScore: 9,
    },
    credits: { source: "NVIDIA Investor Relations", author: "Jensen Huang, CEO", url: "https://investor.nvidia.com" },
    sentiment: "positive", category: "Earnings", marketType: "global",
    views: 2100, likes: 156, readTime: "5 min read",
  },
  {
    title: "Gold Breaches ₹78,000/10g — Safe Haven Demand Surges",
    description: "Gold prices in India crossed the ₹78,000 per 10 gram mark for the first time, driven by global uncertainty, central bank buying, and a weakening US dollar.",
    investBeansInsight: {
      summary: "Gold's rally reflects deep structural shifts — central banks globally are diversifying away from USD reserves, and retail investors are increasing allocation to gold as an inflation hedge.",
      marketSignificance: "Record gold prices impact jewellery demand but boost investment demand. Gold ETF inflows at all-time highs. Mining stocks benefit from higher realizations.",
      impactArea: "Commodities, Jewellery, Gold ETFs, Mining",
      stocksImpacted: "Titan Company, Kalyan Jewellers, Muthoot Finance, SBI Gold ETF, HDFC Gold ETF",
      shortTermView: "Gold may consolidate near ₹78,000-80,000 range. Profit booking possible at current levels. Jewellery stocks may face demand headwinds.",
      longTermView: "Structural bull market in gold. Target of ₹85,000-90,000 by year-end looks achievable. Portfolio allocation of 10-15% to gold recommended.",
      keyRisk: "Sharp US dollar recovery or surprise Fed hawkishness could trigger 5-8% correction in gold prices.",
      impactScore: 7,
    },
    credits: { source: "World Gold Council", author: "WGC Research Team" },
    sentiment: "positive", category: "Commodity Analysis", marketType: "commodities",
    views: 890, likes: 67, readTime: "4 min read",
  },
  {
    title: "FII Selling Crosses ₹25,000 Cr in March — Should You Worry?",
    description: "Foreign Institutional Investors have pulled out over ₹25,000 crore from Indian equities in March 2026, marking one of the largest monthly outflows in recent years.",
    investBeansInsight: {
      summary: "FII selling is driven by global portfolio rebalancing, not India-specific concerns. DII and retail flows have absorbed the selling, keeping markets resilient.",
      marketSignificance: "Large FII outflows typically create short-term volatility but have historically been followed by strong recoveries when driven by external factors rather than domestic fundamentals.",
      impactArea: "Broad Market, Large Caps, Financial Services",
      stocksImpacted: "Reliance Industries, HDFC Bank, Infosys, ICICI Bank, Bharti Airtel, L&T",
      shortTermView: "Market may remain range-bound. Large caps with high FII holding (30%+) could face further selling pressure. Mid-caps may outperform.",
      longTermView: "India's growth story intact. FIIs will return when global risk appetite improves. Current levels offer accumulation opportunities in quality names.",
      keyRisk: "If FII selling continues into Q2, it could coincide with election uncertainty and create a deeper 8-12% correction.",
      impactScore: 6,
    },
    credits: { source: "NSDL FII Data", author: "InvestBeans Research" },
    sentiment: "negative", category: "Market Flow Analysis", marketType: "domestic",
    views: 1560, likes: 112, readTime: "6 min read",
  },
  {
    title: "Crude Oil Drops Below $70 — India's Current Account Benefits",
    description: "Brent crude oil prices fell below $70/barrel for the first time since September 2024, driven by demand concerns from China and increased OPEC+ supply.",
    investBeansInsight: {
      summary: "Lower crude prices are unambiguously positive for India — the world's third-largest oil importer. Every $10 drop in crude saves India ~$15 billion in import costs annually.",
      marketSignificance: "Improves India's fiscal deficit outlook, reduces inflation expectations, and strengthens the rupee. Aviation, paint, and chemical companies benefit directly.",
      impactArea: "OMCs, Aviation, Paints, Chemicals, Macro",
      stocksImpacted: "BPCL, HPCL, IOC, InterGlobe Aviation, Asian Paints, Pidilite, Aarti Industries",
      shortTermView: "OMC stocks could rally 8-12%. Aviation stocks already pricing in lower ATF costs. Paint companies may see margin expansion.",
      longTermView: "If crude sustains below $70, India's GDP growth could accelerate by 0.3-0.5%. RBI gets more room for rate cuts.",
      keyRisk: "Geopolitical escalation in Middle East could reverse crude decline rapidly. OPEC+ could announce deeper production cuts.",
      impactScore: 8,
    },
    credits: { source: "Bloomberg Energy", author: "InvestBeans Commodity Desk" },
    sentiment: "positive", category: "Commodity Impact", marketType: "commodities",
    views: 730, likes: 54, readTime: "5 min read",
  },
  {
    title: "Nifty IT Index Surges 4% on Strong TCS, Infosys Guidance",
    description: "The Nifty IT index rallied 4% in a single session after TCS and Infosys both raised FY27 revenue growth guidance, citing strong deal wins in AI transformation and cloud migration.",
    investBeansInsight: {
      summary: "IT sector is showing signs of demand recovery after 5 quarters of muted growth. Deal pipelines are at all-time highs driven by GenAI adoption across BFSI and healthcare verticals.",
      marketSignificance: "IT sector contributes ~15% to Nifty weight. A sustained IT rally could add 500-800 points to Nifty. This also signals global enterprise spending is recovering.",
      impactArea: "IT Services, Technology, BPO",
      stocksImpacted: "TCS, Infosys, HCL Tech, Wipro, Tech Mahindra, L&T Technology, Persistent Systems",
      shortTermView: "IT stocks may see another 5-8% upside as estimates get revised. Mid-cap IT names like Persistent and Coforge could outperform large caps.",
      longTermView: "AI-led demand cycle could last 3-5 years. Indian IT companies are well-positioned to capture $50B+ in incremental AI services revenue by 2028.",
      keyRisk: "US recession fears could cut enterprise IT budgets. H-1B visa policy changes remain a regulatory overhang.",
      impactScore: 7,
    },
    credits: { source: "NSE India", author: "InvestBeans Tech Desk" },
    sentiment: "positive", category: "Sector Analysis", marketType: "domestic",
    views: 980, likes: 78, readTime: "5 min read",
  },
  {
    title: "US Fed Signals Two Rate Cuts in 2026 — Global Markets Rally",
    description: "The Federal Reserve's latest dot plot indicated two 25 bps rate cuts in 2026, citing improving inflation data. The S&P 500 and Dow Jones both hit record highs on the announcement.",
    investBeansInsight: {
      summary: "Fed dovishness removes the biggest overhang for emerging market flows. Lower US rates reduce the cost of global capital and make EM assets more attractive.",
      marketSignificance: "Historically, Fed rate cut cycles have triggered 15-20% rallies in Indian markets. FII flows tend to reverse 2-3 months before the first cut.",
      impactArea: "Global Macro, Emerging Markets, FII Flows",
      stocksImpacted: "HDFC Bank, ICICI Bank, SBI, Reliance Industries, Bharti Airtel, Nifty 50 ETFs",
      shortTermView: "Dollar index likely to weaken. Rupee may strengthen to ₹82-83 range. Bond yields will fall, benefiting banking stocks.",
      longTermView: "Multi-year bull cycle for EMs if Fed delivers on cuts. India could see $30-40B in FII inflows over next 18 months.",
      keyRisk: "Inflation re-acceleration in the US could force Fed to delay or reverse course. Oil price spike could complicate the picture.",
      impactScore: 9,
    },
    credits: { source: "Federal Reserve", author: "FOMC Statement", url: "https://federalreserve.gov" },
    sentiment: "positive", category: "Central Bank Policy", marketType: "global",
    views: 1890, likes: 134, readTime: "5 min read",
  },
  {
    title: "China's GDP Growth Slows to 4.2% — Impact on Indian Markets",
    description: "China's Q1 2026 GDP growth came in at 4.2%, below the 4.8% consensus, raising concerns about the world's second-largest economy and its demand for commodities.",
    investBeansInsight: {
      summary: "China's slowdown is a double-edged sword for India — negative for commodity exporters but positive for India's relative EM positioning as capital rotates from China to India.",
      marketSignificance: "China slowdown reduces global commodity demand (bearish for metals) but strengthens the 'India vs China' FII narrative. India's weight in MSCI EM has been rising.",
      impactArea: "Metals, Mining, EM Flows, Manufacturing",
      stocksImpacted: "Tata Steel, JSW Steel, Hindalco, NMDC, Coal India, Vedanta",
      shortTermView: "Metal stocks may see 5-10% correction. But domestic-focused companies (FMCG, Banking, IT) could benefit from flow rotation.",
      longTermView: "India is the biggest beneficiary of China+1 manufacturing shift. Sectors like electronics, chemicals, and textiles will see multi-year tailwinds.",
      keyRisk: "If China announces massive stimulus, flows could reverse back to Chinese equities rapidly.",
      impactScore: 7,
    },
    credits: { source: "National Bureau of Statistics, China", author: "InvestBeans Global Desk" },
    sentiment: "negative", category: "Global Economy", marketType: "global",
    views: 1120, likes: 82, readTime: "6 min read",
  },
  {
    title: "Silver Outperforms Gold — Why Smart Money is Rotating",
    description: "Silver prices surged 12% in March while gold gained only 4%, with the gold-silver ratio dropping to 75 from 85, indicating a classic rotation into the white metal.",
    investBeansInsight: {
      summary: "Silver's outperformance signals industrial demand recovery, particularly from solar and EV manufacturing. Silver's dual role as precious + industrial metal makes it unique.",
      marketSignificance: "Silver demand from solar panels alone expected to grow 20% YoY. India is the world's 3rd largest solar installer. MCX Silver traders should note the momentum shift.",
      impactArea: "Commodities, Solar, Electronics, Precious Metals",
      stocksImpacted: "Hindustan Zinc, Vedanta, SBI Silver ETF, Nippon Silver ETF",
      shortTermView: "Silver likely to test ₹95,000/kg on MCX. Gold-silver ratio could compress further to 70. Short-term traders should consider silver over gold.",
      longTermView: "Structural demand from green energy + supply constraints make silver a compelling 3-5 year bet. Allocation of 5% to silver recommended.",
      keyRisk: "Industrial recession could collapse silver's premium over gold. Over-leveraged positions on MCX can amplify losses.",
      impactScore: 6,
    },
    credits: { source: "Silver Institute", author: "InvestBeans Commodity Desk" },
    sentiment: "positive", category: "Commodity Analysis", marketType: "commodities",
    views: 650, likes: 48, readTime: "4 min read",
  },
  {
    title: "SEBI Tightens F&O Rules — Retail Losses in Focus",
    description: "SEBI introduced new regulations requiring higher margins, weekly expiry restrictions, and enhanced risk disclosures for F&O trading after a study revealed 93% of retail traders lose money.",
    investBeansInsight: {
      summary: "SEBI's crackdown aims to protect retail investors from speculative F&O losses. While short-term negative for broker volumes, this improves market quality long-term.",
      marketSignificance: "Broker stocks like Angel One, Zerodha's peers may see revenue impact. But reduced speculative activity makes markets more stable for genuine investors.",
      impactArea: "Brokerages, Exchanges, Retail Trading",
      stocksImpacted: "Angel One, ICICI Securities, Motilal Oswal, BSE Ltd, MCX, CDSL",
      shortTermView: "Broker stocks may correct 10-15% on volume concerns. Exchange stocks (BSE, MCX) also face headwinds. Discount brokers most impacted.",
      longTermView: "Healthier market structure benefits long-term equity investors. SIP flows and delivery-based trading will continue to grow regardless of F&O rules.",
      keyRisk: "Overly restrictive regulations could push sophisticated traders to offshore platforms, reducing Indian market liquidity.",
      impactScore: 7,
    },
    credits: { source: "SEBI Circular", author: "Securities and Exchange Board of India", url: "https://sebi.gov.in" },
    sentiment: "neutral", category: "Regulation", marketType: "domestic",
    views: 2340, likes: 187, readTime: "5 min read",
  },
  {
    title: "Natural Gas Prices Spike 15% on Supply Disruptions",
    description: "Henry Hub natural gas futures jumped 15% after unexpected pipeline maintenance in the US Gulf region coincided with higher-than-expected European demand due to a cold snap.",
    investBeansInsight: {
      summary: "Natural gas volatility creates trading opportunities but also raises input costs for Indian fertilizer and power companies. India imports 50% of its LNG requirements.",
      marketSignificance: "Higher gas prices impact city gas distribution companies (IGL, MGL, Gujarat Gas) through reduced margins, and benefit gas producers like ONGC and Oil India.",
      impactArea: "Natural Gas, Fertilizers, Power, City Gas",
      stocksImpacted: "ONGC, Oil India, IGL, MGL, Gujarat Gas, GAIL, Chambal Fertilisers",
      shortTermView: "City gas stocks may see 3-5% correction. ONGC and Oil India could gain 4-6%. Fertilizer subsidy burden on government increases.",
      longTermView: "India's push for natural gas in energy mix (15% target by 2030) means gas infrastructure companies remain long-term picks despite price volatility.",
      keyRisk: "Sustained high gas prices could force government to raise APM gas prices, impacting domestic producers' realization math.",
      impactScore: 5,
    },
    credits: { source: "MCX India", author: "InvestBeans Energy Desk" },
    sentiment: "negative", category: "Energy Markets", marketType: "commodities",
    views: 420, likes: 31, readTime: "4 min read",
  },
  {
    title: "India's Manufacturing PMI Hits 14-Month High at 58.3",
    description: "India's manufacturing PMI surged to 58.3 in March 2026 — a 14-month high — driven by strong new orders, rising exports, and improved business confidence.",
    investBeansInsight: {
      summary: "Robust PMI data confirms India's manufacturing renaissance is real, not just policy rhetoric. New export orders hitting multi-year highs is particularly encouraging.",
      marketSignificance: "Strong PMI supports GDP growth estimates of 7.2%+ for FY27. Manufacturing stocks, capex plays, and infrastructure companies are direct beneficiaries.",
      impactArea: "Manufacturing, Capex, Infrastructure, Defence",
      stocksImpacted: "L&T, Siemens India, ABB India, HAL, BEL, Bharat Forge, Cummins India",
      shortTermView: "Capex and infrastructure stocks may see fresh buying. L&T and Siemens near all-time highs. Defence stocks continue re-rating.",
      longTermView: "India's manufacturing sector could grow from $450B to $1T by 2030. PLI-linked sectors (electronics, pharma, auto) are multi-year compounders.",
      keyRisk: "Global trade tensions or tariff wars could derail export momentum. Rising raw material costs could squeeze manufacturer margins.",
      impactScore: 8,
    },
    credits: { source: "S&P Global PMI", author: "InvestBeans Macro Desk" },
    sentiment: "positive", category: "Economic Data", marketType: "domestic",
    views: 870, likes: 63, readTime: "4 min read",
  },
];

// ══════════════════════════════════════════════════════════════════════════════
//  SEED TESTIMONIALS (12 testimonials)
// ══════════════════════════════════════════════════════════════════════════════

const SEED_TESTIMONIALS = [
  {
    name: "Rahul Sharma", role: "Equity Trader", company: "Independent", avatar: "RS",
    rating: 5, tag: "Trading",
    preview: "InvestBeans has completely transformed how I approach market analysis. The real-time data dashboards and research-backed insights have given me an edge I never had before.",
    fullText: "InvestBeans has completely transformed how I approach market analysis. The real-time data dashboards and research-backed insights have given me an edge I never had before.\n\nBefore InvestBeans, I was spending hours aggregating data from multiple sources — NSE, BSE, global markets, commodities. Now everything is in one unified workspace. The BharatPulse dashboard alone saves me 2 hours daily.\n\nThe IPO analysis section is incredibly detailed. The SWOT breakdowns and GMP tracking helped me make informed decisions on 3 recent IPOs, all of which gave positive listing gains.\n\nHighly recommend for anyone serious about their investment journey.",
  },
  {
    name: "Priya Mehta", role: "Financial Analyst", company: "ICICI Securities", avatar: "PM",
    rating: 5, tag: "Research",
    preview: "The market intelligence and decode market section is outstanding. Every insight is backed by solid research with clear impact analysis. This is professional-grade analysis accessible to everyone.",
    fullText: "The market intelligence and decode market section is outstanding. Every insight is backed by solid research with clear impact analysis. This is professional-grade analysis accessible to everyone.\n\nAs a financial analyst, I'm used to Bloomberg terminals and expensive research subscriptions. InvestBeans provides surprisingly comparable quality at a fraction of the cost.\n\nThe structured format — summary, impact area, stocks impacted, short/long term views — is exactly how institutional research reports are organized. The impact scores help prioritize what to focus on.\n\nI regularly share InvestBeans insights with my team. The quality speaks for itself.",
  },
  {
    name: "Amit Patel", role: "Software Engineer", company: "Google India", avatar: "AP",
    rating: 4, tag: "Investing",
    preview: "As a tech professional who invests on the side, InvestBeans is the perfect balance of depth and simplicity. The dashboards are beautifully designed and the data is always fresh.",
    fullText: "As a tech professional who invests on the side, InvestBeans is the perfect balance of depth and simplicity. The dashboards are beautifully designed and the data is always fresh.\n\nI particularly love the Gold vs Silver tracking with MCX live data, and the India VIX fear gauge. These metrics were previously buried in complex financial terminals.\n\nThe Beans of Wisdom weekly edition is a great way to learn investment principles without information overload. Each week's theme is well-curated.\n\nOne suggestion: would love to see portfolio tracking integration in future updates.",
  },
  {
    name: "Sneha Kapoor", role: "CA & Investment Advisor", company: "Kapoor & Associates", avatar: "SK",
    rating: 5, tag: "Advisory",
    preview: "I recommend InvestBeans to all my clients. The platform's combination of live market data, IPO tracking, and research insights makes it a one-stop solution for informed investing.",
    fullText: "I recommend InvestBeans to all my clients. The platform's combination of live market data, IPO tracking, and research insights makes it a one-stop solution for informed investing.\n\nAs a chartered accountant and investment advisor, I need reliable, comprehensive data. InvestBeans delivers this consistently. The FII/DII flow tracking is particularly useful for understanding institutional behavior.\n\nThe pricing plans are very reasonable — the Command plan at ₹888/month offers more value than many platforms charging 3-5x more. My clients love the Edge plan for the research insights.\n\nThe platform has become an essential part of my advisory practice.",
  },
  {
    name: "Vikram Desai", role: "Retired Banker", company: "Former SBI", avatar: "VD",
    rating: 4, tag: "General",
    preview: "After 35 years in banking, I thought I knew markets well. InvestBeans showed me how much easier investing can be with the right tools. The interface is clean and easy to navigate.",
    fullText: "After 35 years in banking, I thought I knew markets well. InvestBeans showed me how much easier investing can be with the right tools. The interface is clean and easy to navigate.\n\nThe Bharat Stats section gives me everything I need at a glance — Sensex, Nifty, VIX, Gold, Silver, USD/INR, FII/DII flows. No clutter, just data that matters.\n\nI especially appreciate the GIFT Nifty tracking for pre-market sentiment. It helps me plan my trades before the market opens.\n\nFor someone my age who isn't very tech-savvy, the platform is refreshingly intuitive.",
  },
  {
    name: "Ananya Reddy", role: "MBA Student", company: "IIM Bangalore", avatar: "AR",
    rating: 5, tag: "Learning",
    preview: "The Foundation plan is perfect for students learning about markets. The e-books and structured courses have taught me more about investing than my entire MBA finance curriculum.",
    fullText: "The Foundation plan is perfect for students learning about markets. The e-books and structured courses have taught me more about investing than my entire MBA finance curriculum.\n\nWhat sets InvestBeans apart is the practical approach. Instead of just theory, every concept is tied to real market examples. The weekly Beans of Wisdom connects investing principles to actual market events.\n\nThe IPO section helped me understand how to analyze new listings — the SWOT analysis framework is something I now use in my coursework as well.\n\nI've recommended InvestBeans to my entire batch. At ₹111 per course, it's the best investment a student can make.",
  },
  {
    name: "Rohan Gupta", role: "Day Trader", company: "Self-employed", avatar: "RG",
    rating: 5, tag: "Trading",
    preview: "The live market data feeds are incredibly fast. I switched from two other platforms to InvestBeans because the data quality and speed are just superior. The VIX tracking is a game changer.",
    fullText: "The live market data feeds are incredibly fast. I switched from two other platforms to InvestBeans because the data quality and speed are just superior. The VIX tracking is a game changer.\n\nAs a day trader, milliseconds matter. InvestBeans' Kite-powered data feeds give me real-time prices without the lag I experienced on other platforms.\n\nThe market heatmap is my go-to tool for identifying sectoral rotation during market hours. Combined with the FII/DII flow data, I can gauge institutional sentiment in real-time.\n\nThe commodity tracking (Gold, Silver on MCX) is a bonus — I trade Gold futures and having MCX live prices alongside equity data saves me switching between platforms.",
  },
  {
    name: "Kavita Joshi", role: "Mutual Fund Distributor", company: "NJ Wealth Partner", avatar: "KJ",
    rating: 4, tag: "Advisory",
    preview: "My clients always ask me about market conditions before investing in mutual funds. InvestBeans gives me the data and context to answer their questions confidently and professionally.",
    fullText: "My clients always ask me about market conditions before investing in mutual funds. InvestBeans gives me the data and context to answer their questions confidently and professionally.\n\nThe Decode the Market insights are particularly valuable. When a client asks 'Should I invest now or wait?', I can show them the latest market analysis with impact scores and risk assessments.\n\nThe platform's clean design makes it easy to show clients during meetings. It doesn't look like a cluttered trading terminal — it looks professional and trustworthy.\n\nI wish there was a feature to share specific insights directly with clients via WhatsApp or email. That would make my workflow even smoother.",
  },
  {
    name: "Arjun Nair", role: "Product Manager", company: "Flipkart", avatar: "AN",
    rating: 5, tag: "Investing",
    preview: "I love how InvestBeans combines Indian and global market data in one place. The US Stats section alongside Bharat Stats gives me a complete picture for my diversified portfolio.",
    fullText: "I love how InvestBeans combines Indian and global market data in one place. The US Stats section alongside Bharat Stats gives me a complete picture for my diversified portfolio.\n\nI invest in both Indian equities and US stocks through Vested/INDmoney. InvestBeans is the only platform that shows me Nifty, NASDAQ, Gold, and USD/INR all on one screen.\n\nThe IPO tracker is excellent. I participated in the Tata Capital IPO after reading the SWOT analysis on InvestBeans — got 28% listing gain! The risk assessment was spot on.\n\nThe UI/UX is clearly built by someone who understands both finance and design. Clean, fast, and functional.",
  },
  {
    name: "Deepika Singh", role: "Homemaker & Investor", company: "Self", avatar: "DS",
    rating: 4, tag: "General",
    preview: "Started investing during COVID and InvestBeans has been my learning companion. The Beans of Wisdom section is like having a personal finance mentor guiding you every week.",
    fullText: "Started investing during COVID and InvestBeans has been my learning companion. The Beans of Wisdom section is like having a personal finance mentor guiding you every week.\n\nI was always intimidated by stock markets. InvestBeans made it approachable. The Foundation plan e-books explained concepts like PE ratio, dividend yield, and market cycles in simple Hindi-English.\n\nThe live dashboard keeps me updated without needing to watch CNBC all day. I check it twice — morning before market opens (GIFT Nifty) and evening for closing summary.\n\nMy portfolio has grown 22% since I started using InvestBeans. Not all credit goes to the platform, but the informed decisions definitely helped.",
  },
  {
    name: "Manish Agarwal", role: "Commodity Trader", company: "Agarwal Trading Co.", avatar: "MA",
    rating: 5, tag: "Trading",
    preview: "Finally a platform that takes commodities seriously. MCX Gold, Silver, Crude — all with live Kite data. The commodity insights in Decode the Market are top notch.",
    fullText: "Finally a platform that takes commodities seriously. MCX Gold, Silver, Crude — all with live Kite data. The commodity insights in Decode the Market are top notch.\n\nMost financial platforms treat commodities as an afterthought. InvestBeans gives Gold and Silver the same attention as Nifty and Sensex. The 3D brick icons for Gold and Silver bars are a nice design touch.\n\nThe commodity-specific insights in the Decode Market section are invaluable. The recent analysis on Silver outperforming Gold helped me reallocate my positions profitably.\n\nI've been trading commodities for 15 years, and InvestBeans is the best integrated platform I've used for multi-asset analysis.",
  },
  {
    name: "Tanvi Bhatt", role: "Fintech Founder", company: "WealthStack", avatar: "TB",
    rating: 5, tag: "Research",
    preview: "As someone building in fintech, I study every platform in the space. InvestBeans stands out for its data density without visual clutter. The product design is genuinely impressive.",
    fullText: "As someone building in fintech, I study every platform in the space. InvestBeans stands out for its data density without visual clutter. The product design is genuinely impressive.\n\nWhat InvestBeans gets right that many platforms miss: information hierarchy. The most important data (indices, VIX, FII/DII) is front and center. Secondary data is accessible but doesn't compete for attention.\n\nThe research quality in Decode the Market rivals platforms that charge ₹10,000+/month. The structured format (summary → significance → stocks → views → risk) is exactly what investors need.\n\nI've recommended InvestBeans to three other fintech founders. The product-market fit is strong — there's clearly a gap between free finance apps and expensive Bloomberg terminals. InvestBeans fills it perfectly.",
  },
];

// ══════════════════════════════════════════════════════════════════════════════
//  SEED BEANS OF WISDOM
// ══════════════════════════════════════════════════════════════════════════════

const SEED_BEANS = [
  {
    avatarText: "IB",
    title: "The Power of Compounding: Why Starting Early Beats Timing the Market",
    subtitle: "A ₹10,000 monthly SIP started at age 25 grows to ₹3.5 Cr by 60. Started at 35, it's only ₹1.1 Cr — same contribution, 3x less wealth.",
    sectionTitle: "This Week's Financial Principle",
    description: "Albert Einstein called compounding the eighth wonder of the world. In investing, the difference between starting at 25 vs 35 isn't just 10 years — it's 3x the wealth. The math is counterintuitive: your money in the last 10 years of a 35-year SIP earns more than the first 25 years combined. This is why time in the market always beats timing the market.",
    keyPrinciple: "Start today. Not tomorrow. Not next month. The cost of waiting is the wealth you'll never build.",
    quote: "The best time to plant a tree was 20 years ago. The second best time is now. In investing, every day you delay is compounding you surrender.",
    insightTag: "Wealth Building",
    insightText: "At 12% CAGR (Nifty 50 historical average), ₹10,000/month for 35 years becomes ₹3.5 Cr. For 25 years, just ₹1.1 Cr. For 15 years, only ₹40 Lakh. The same ₹10,000 — the only variable is time. Set up your SIPs this week if you haven't already.",
    tags: ["Compounding", "SIP", "Long-term Investing", "Wealth Creation", "Financial Planning"],
  },
  {
    avatarText: "IB",
    title: "Risk Management: The Art of Protecting Capital Before Growing It",
    subtitle: "Warren Buffett's Rule #1: Never lose money. Rule #2: Never forget Rule #1. Position sizing is what separates professionals from gamblers.",
    sectionTitle: "The Discipline That Defines Winners",
    description: "Most retail investors focus on returns. Professional investors focus on risk first. A 50% loss requires a 100% gain just to break even. This asymmetry is why capital preservation is the foundation of all successful investing. The best portfolio managers in the world underperform during bull runs — but they dramatically outperform over full market cycles.",
    keyPrinciple: "Never risk more than 2% of your portfolio on a single trade. Diversification isn't boring — it's survival.",
    quote: "In investing, what is comfortable is rarely profitable, and what is profitable is rarely comfortable. Discipline bridges the gap between the two.",
    insightTag: "Risk Management",
    insightText: "The 2008 crash wiped 60% off the Sensex. Investors who panicked and sold locked in losses. Those who stayed invested recovered within 18 months and went on to 10x returns by 2024. The lesson: volatility is the price of admission for equity returns. Have a plan, follow it, and never invest money you'll need within 3 years.",
    tags: ["Risk Management", "Position Sizing", "Capital Protection", "Discipline", "Portfolio Strategy"],
  },
];

// ── Main Seed Function ───────────────────────────────────────────────────────

async function seed() {
  try {
    const uri = MONGO_URI.includes(`/${DB_NAME}`) ? MONGO_URI : `${MONGO_URI}/${DB_NAME}`;
    await mongoose.connect(uri);
    console.log("Connected to MongoDB\n");

    // 1. Create seed users
    console.log("── Users ──");
    const userIds = [];
    for (const u of SEED_USERS) {
      let existing = await User.findOne({ email: u.email });
      if (!existing) {
        const hashed = await bcrypt.hash(u.password, 10);
        existing = await User.create({ name: u.name, email: u.email, password: hashed });
        console.log(`  + Created: ${u.name}`);
      } else {
        console.log(`  = Exists:  ${u.name}`);
      }
      userIds.push(existing._id);
    }

    // 2. Seed IPOs — clear and re-insert
    console.log("\n── IPOs ──");
    await IPO.deleteMany({});
    await IPO.insertMany(SEED_IPOS);
    console.log(`  + Inserted ${SEED_IPOS.length} IPOs (replaced all)`);

    // 3. Seed Insights — clear and re-insert
    console.log("\n── Insights (Decode the Market) ──");
    await Insight.deleteMany({});
    const insightsWithAuthor = SEED_INSIGHTS.map((insight, i) => ({
      ...insight,
      author: userIds[i % userIds.length],
      publishedAt: new Date(Date.now() - i * 2 * 24 * 60 * 60 * 1000),
    }));
    await Insight.insertMany(insightsWithAuthor);
    console.log(`  + Inserted ${SEED_INSIGHTS.length} insights (replaced all)`);

    // 4. Seed Testimonials — clear and re-insert
    console.log("\n── Testimonials ──");
    await Testimonial.deleteMany({});
    const testimonialsWithUser = SEED_TESTIMONIALS.map((t, i) => ({
      ...t,
      user: userIds[i],
    }));
    await Testimonial.insertMany(testimonialsWithUser);
    console.log(`  + Inserted ${SEED_TESTIMONIALS.length} testimonials (replaced all)`);

    // 5. Seed Beans of Wisdom — clear and re-insert
    console.log("\n── Beans of Wisdom ──");
    await BeanOfWisdom.deleteMany({});
    await BeanOfWisdom.insertMany(SEED_BEANS);
    console.log(`  + Inserted ${SEED_BEANS.length} beans of wisdom (replaced all)`);

    console.log("\n✅ Seed complete! All data refreshed.");
  } catch (err) {
    console.error("Seed error:", err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
