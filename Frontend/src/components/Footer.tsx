import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-navy to-navy-light text-white py-16 mt-20 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>

      {/* Disclaimer Section */}
      <div className="container mx-auto px-6 mb-6 relative z-15">
        <p className="text-sm md:text-base text-left leading-relaxed opacity-100">
          <span className="font-bold text-accent">Disclaimer:</span> InvestBeans provides educational content only and does not offer personalized investment advice. 
          All trading and investing decisions are the sole responsibility of the individual. 
          Investments in financial markets are subject to risk, and past performance does not indicate future results.
        </p>
        <hr className="border-white/20 mt-4" />
      </div>

      <div className="container mx-auto px-6 relative z-15">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">
              Invest<span className="text-accent">Beans</span>
            </h3>
            <p className="text-sm opacity-100 leading-relaxed mb-6 max-w-md">
              Your trusted source for market insights, analysis, and investment wisdom. 
              Empowering investors with data-driven decisions since 2024.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-accent rounded-lg flex items-center justify-center transition-all hover:scale-110">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-accent rounded-lg flex items-center justify-center transition-all hover:scale-110">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-accent rounded-lg flex items-center justify-center transition-all hover:scale-110">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-accent rounded-lg flex items-center justify-center transition-all hover:scale-110">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-accent">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="opacity-80 hover:opacity-100 hover:text-accent transition-all hover:translate-x-1 inline-block">Home</a></li>
              <li><a href="#" className="opacity-80 hover:opacity-100 hover:text-accent transition-all hover:translate-x-1 inline-block">Markets</a></li>
              <li><a href="#" className="opacity-80 hover:opacity-100 hover:text-accent transition-all hover:translate-x-1 inline-block">Dashboard</a></li>
              <li><a href="#" className="opacity-80 hover:opacity-100 hover:text-accent transition-all hover:translate-x-1 inline-block">Insights</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-accent">Resources</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="opacity-80 hover:opacity-100 hover:text-accent transition-all hover:translate-x-1 inline-block">Blog</a></li>
              <li><a href="#" className="opacity-80 hover:opacity-100 hover:text-accent transition-all hover:translate-x-1 inline-block">Help Center</a></li>
              <li><a href="#" className="opacity-80 hover:opacity-100 hover:text-accent transition-all hover:translate-x-1 inline-block">Privacy Policy</a></li>
              <li><a href="#" className="opacity-80 hover:opacity-100 hover:text-accent transition-all hover:translate-x-1 inline-block">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8">
          <p className="text-center text-sm opacity-70">
            © 2024 InvestBeans. All rights reserved. Built with ❤️ for smart investors.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
