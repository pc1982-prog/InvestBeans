import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import { useTheme } from "@/controllers/Themecontext"

const Footer = () => {
  const { theme } = useTheme();
  const isLight = theme === "light";

  // ── Theme-aware class helpers ───────────────────────────────────────────
  const footerBg = isLight
    ? "bg-gradient-to-br from-[#dce8f7] to-[#e8f2fd] text-navy py-16 relative overflow-hidden"
    : "bg-gradient-to-br from-navy to-navy-light text-white py-16 relative overflow-hidden";

  const blob1 = isLight
    ? "absolute top-0 left-0 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl"
    : "absolute top-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl";

  const blob2 = isLight
    ? "absolute bottom-0 right-0 w-96 h-96 bg-indigo-300/20 rounded-full blur-3xl"
    : "absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl";

  const disclaimerText = isLight
    ? "text-sm md:text-base text-left leading-relaxed text-navy/80"
    : "text-sm md:text-base text-left leading-relaxed text-white/90";

  const hrCls = isLight
    ? "border-navy/15 mt-4"
    : "border-white/20 mt-4";

  const taglineCls = isLight
    ? "text-sm text-navy/65 leading-relaxed mb-6 max-w-md"
    : "text-sm text-white/85 leading-relaxed mb-6 max-w-md";

  const socialBtnCls = isLight
    ? "w-10 h-10 bg-navy/10 hover:bg-accent rounded-lg flex items-center justify-center transition-all hover:scale-110 text-navy hover:text-white"
    : "w-10 h-10 bg-white/10 hover:bg-accent rounded-lg flex items-center justify-center transition-all hover:scale-110";

  const sectionHeadingCls = isLight
    ? "text-lg font-semibold mb-4 text-accent"
    : "text-lg font-semibold mb-4 text-accent";

  const linkCls = isLight
    ? "text-navy/65 hover:text-accent transition-all hover:translate-x-1 inline-block"
    : "text-white/80 hover:text-white hover:text-accent transition-all hover:translate-x-1 inline-block";

  const borderTopCls = isLight
    ? "border-t border-navy/15 pt-8"
    : "border-t border-white/10 pt-8";

  const copyrightCls = isLight
    ? "text-center text-sm text-navy/60"
    : "text-center text-sm text-white/80";

  return (
    <footer className={footerBg}>
      <div className={blob1}></div>
      <div className={blob2}></div>

      {/* Disclaimer Section */}
      <div className="container mx-auto px-6 mb-6 relative z-15">
        <p className={disclaimerText}>
          <span className="font-bold text-accent">Disclaimer:</span> InvestBeans provides educational content only and does not offer personalized investment advice.
          All trading and investing decisions are the sole responsibility of the individual.
          Investments in financial markets are subject to risk, and past performance does not indicate future results.
        </p>
        <hr className={hrCls} />
      </div>

      <div className="container mx-auto px-6 relative z-15">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          <div className="md:col-span-2">
            <div className="mb-4">
              <img
                src={isLight ? "/images/investbeans logo-03.png" : "/images/logo2.svg"}
                alt="InvestBeans Logo"
                className={`h-10 w-auto object-contain ${!isLight ? "filter contrast-125" : ""}`}
              />
            </div>
            <p className={taglineCls}>
              Your trusted source for market insights, analysis, and investment wisdom.
              Empowering investors with data-driven decisions since 2024.
            </p>
            <div className="flex gap-4">
              <a href="#" className={socialBtnCls}><Facebook className="w-5 h-5" /></a>
              <a href="#" className={socialBtnCls}><Twitter className="w-5 h-5" /></a>
              <a href="#" className={socialBtnCls}><Linkedin className="w-5 h-5" /></a>
              <a href="#" className={socialBtnCls}><Instagram className="w-5 h-5" /></a>
            </div>
          </div>

          <div>
            <h3 className={sectionHeadingCls}>Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className={linkCls}>Home</a></li>
              <li><a href="#" className={linkCls}>Markets</a></li>
              <li><a href="#" className={linkCls}>Dashboard</a></li>
              <li><a href="#" className={linkCls}>Insights</a></li>
            </ul>
          </div>

          <div>
            <h3 className={sectionHeadingCls}>Resources</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="/blogs" className={linkCls}>Blog</a></li>
              <li><a href="/help-center" className={linkCls}>Help Center</a></li>
              <li><a href="/privacy-policy" className={linkCls}>Privacy Policy</a></li>
              <li><a href="/terms-of-service" className={linkCls}>Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className={borderTopCls}>
  <p className={copyrightCls}>
    © 2024 InvestBeans. All rights reserved. 
    Crafted and powered by{" "}
    <a
      href="https://www.strategixworks.com/"
      target="_blank"
      rel="noopener noreferrer"
      className="font-bold tracking-wide hover:underline transition-all duration-200 text-accent "
    >
      Strategix
    </a> — Delivering intelligent digital solutions.
  </p>
</div>
      </div>
    </footer>
  );
};

export default Footer;