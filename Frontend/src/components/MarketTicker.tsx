// import { TrendingUp, TrendingDown, ChevronLeft, ChevronRight } from "lucide-react";
// import { useState, useRef, useEffect } from "react";
// import { IndexQuote } from "@/services/globalMarkets/types";

// interface MarketTickerProps {
//   usMarkets?: IndexQuote[];
//   europeMarkets?: IndexQuote[];
//   asiaMarkets?: IndexQuote[];
// }

// const MarketTicker = ({ usMarkets = [], europeMarkets = [], asiaMarkets = [] }: MarketTickerProps) => {
//   const [isPaused, setIsPaused] = useState(false);
//   const tickerRef = useRef<HTMLDivElement>(null);
//   const animationRef = useRef<number>();

//   // Combine all markets with safety checks
//   const allMarkets = [...(usMarkets || []), ...(europeMarkets || []), ...(asiaMarkets || [])].map(market => ({
//     name: market.name,
//     value: market.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
//     change: `${market.changePercent > 0 ? '+' : ''}${market.changePercent.toFixed(2)}%`,
//     isPositive: market.changePercent >= 0
//   }));

//   // Auto-scroll animation
//   useEffect(() => {
//     const startAnimation = () => {
//       if (tickerRef.current && !isPaused && allMarkets.length > 0) {
//         const element = tickerRef.current;
//         const scrollWidth = element.scrollWidth;
//         const clientWidth = element.clientWidth;
//         const maxScroll = scrollWidth - clientWidth;
        
//         let currentScroll = element.scrollLeft;
        
//         const animate = () => {
//           if (!isPaused && tickerRef.current) {
//             currentScroll += 0.5;
//             if (currentScroll >= maxScroll / 2) {
//               currentScroll = 0;
//             }
//             element.scrollLeft = currentScroll;
//             animationRef.current = requestAnimationFrame(animate);
//           }
//         };
        
//         animationRef.current = requestAnimationFrame(animate);
//       }
//     };

//     startAnimation();

//     return () => {
//       if (animationRef.current) {
//         cancelAnimationFrame(animationRef.current);
//       }
//     };
//   }, [isPaused, allMarkets.length]);

//   const scrollLeft = () => {
//     if (tickerRef.current) {
//       tickerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
//     }
//   };

//   const scrollRight = () => {
//     if (tickerRef.current) {
//       tickerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
//     }
//   };

//   if (allMarkets.length === 0) {
//     return null;
//   }

//   return (
//     <div className="relative flex items-center">
//       {/* Left Arrow */}
//       <button
//         onClick={scrollLeft}
//         className="absolute left-2 z-10 bg-navy/80 hover:bg-navy text-white p-1 rounded-full transition-colors"
//         onMouseEnter={() => setIsPaused(true)}
//         onMouseLeave={() => setIsPaused(false)}
//       >
//         <ChevronLeft className="w-4 h-4" />
//       </button>

//       {/* Ticker Content */}
//       <div className="flex-1 overflow-hidden mx-10">
//         <div 
//           ref={tickerRef}
//           className="flex items-center gap-8 overflow-x-auto scrollbar-hide"
//           onMouseEnter={() => setIsPaused(true)}
//           onMouseLeave={() => setIsPaused(false)}
//           style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
//         >
//           {/* First set of markets */}
//           {allMarkets.map((market, index) => (
//             <div key={`${market.name}-${index}`} className="flex items-center gap-4 whitespace-nowrap group hover:scale-105 transition-transform">
//               <div className="flex items-center gap-2">
//                 <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">{market.name}</span>
//                 <span className="font-bold text-base text-white">{market.value}</span>
//               </div>
//               <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
//                 market.isPositive 
//                   ? "bg-green-500/30 text-green-100 border border-green-400/50" 
//                   : "bg-red-500/30 text-red-100 border border-red-400/50"
//               }`}>
//                 {market.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
//                 {market.change}
//               </div>
//             </div>
//           ))}
//           {/* Duplicate set for continuous scrolling */}
//           {allMarkets.map((market, index) => (
//             <div key={`${market.name}-dup-${index}`} className="flex items-center gap-4 whitespace-nowrap group hover:scale-105 transition-transform">
//               <div className="flex items-center gap-2">
//                 <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">{market.name}</span>
//                 <span className="font-bold text-base text-white">{market.value}</span>
//               </div>
//               <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
//                 market.isPositive 
//                   ? "bg-green-500/30 text-green-100 border border-green-400/50" 
//                   : "bg-red-500/30 text-red-100 border border-red-400/50"
//               }`}>
//                 {market.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
//                 {market.change}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Right Arrow */}
//       <button
//         onClick={scrollRight}
//         className="absolute right-2 z-10 bg-navy/80 hover:bg-navy text-white p-1 rounded-full transition-colors"
//         onMouseEnter={() => setIsPaused(true)}
//         onMouseLeave={() => setIsPaused(false)}
//       >
//         <ChevronRight className="w-4 h-4" />
//       </button>
//     </div>
//   );
// };

// export default MarketTicker;