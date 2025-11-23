'use client';

import { Button } from "@/components/ui/button";
import { TrendingUp, LineChart, PieChart } from "lucide-react";


const Hero = () => {
  return (
    <section className="gradient-hero text-white py-20 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <div className="flex justify-center items-center gap-3 mb-6">
            <TrendingUp className="w-12 h-12 text-accent" />
            <LineChart className="w-10 h-10 text-accent/80" />
            <PieChart className="w-12 h-12 text-accent" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Baazigar Banein…
            <span className="text-accent"> Sattebaaz Nahi</span>
          </h1>
          
          <p className="text-xl text-white/90 mb-8 leading-relaxed max-w-2xl mx-auto">
            “Our BeansList brings you daily research-backed stock insights — where every pick is powered by analysis, not assumptions”
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-accent hover:bg-accent/90 text-navy font-semibold px-8 py-6 text-lg shadow-glow"
            >
              Start Investing
            </Button>

            {/* Check the BeansList Button */}
         
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-white text-white hover:bg-white hover:text-navy px-8 py-6 text-lg backdrop-blur-sm bg-transparent relative group"
              >
                Check the BeansList
                {/* Tooltip on hover */}
                <span className="absolute left-1/2 -bottom-10 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-white text-navy text-sm font-medium py-1 px-3 rounded-md shadow-lg transition-opacity duration-300 whitespace-nowrap">
                  Built on research, not recommendations.
                </span>
              </Button>
           
          </div>
          
               <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-4xl mx-auto">
            <div className="text-center p-4 rounded-lg backdrop-blur-sm  hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <div className="text-2xl md:text-3xl font-bold text-accent mb-2">+0.85%</div>
              <div className="text-xs md:text-sm text-white/70">🇮🇳 NIFTY vs SENSEX</div>
            </div>
            <div className="text-center p-4 rounded-lg backdrop-blur-sm  hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <div className="text-2xl md:text-3xl font-bold text-accent mb-2">+1.14%</div>
              <div className="text-xs md:text-sm text-white/70">🇺🇸 NASDAQ vs S&P 500</div>
            </div>
            <div className="text-center p-4 rounded-lg backdrop-blur-sm  hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <div className="text-2xl md:text-3xl font-bold text-accent mb-2">+₹1,240</div>
              <div className="text-xs md:text-sm text-white/70"> FII-DII Activity</div>
            </div>
            <div className="text-center p-4 rounded-lg backdrop-blur-sm hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <div className="text-2xl md:text-3xl font-bold text-accent mb-2">84%</div>
              <div className="text-xs md:text-sm text-white/70"> Market Sync Index</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
