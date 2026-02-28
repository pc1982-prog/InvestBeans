import React, { useEffect } from 'react';
import Layout from '@/components/Layout';
import { useLocation } from 'react-router-dom';
import { useTheme } from '@/controllers/Themecontext';
import {
  BookOpen, GraduationCap, Video, Award, Lock, BookMarked,
  Play, ChevronRight, Star, Zap, TrendingUp, Users, ArrowRight, Sparkles,
} from 'lucide-react';

// ── Data ─────────────────────────────────────────────────────────────────────

const financialItems = [
  {
    id: 'financial-ebooks', icon: BookOpen, title: 'E-books', tag: 'Financial',
    description: 'In-depth financial guides, market deep-dives, and comprehensive investment references curated by InvestBeans experts.',
    isPaid: true,
    items: [
      { title: 'Fundamentals of Equity Investing', meta: '120 pages', level: 'Beginner' },
      { title: 'Advanced Portfolio Management',    meta: '200 pages', level: 'Advanced' },
      { title: 'Global Markets Decoded',           meta: '160 pages', level: 'Intermediate' },
    ],
    accent: 'from-blue-500 to-indigo-600', accentRaw: '#3B82F6', iconColor: '#60A5FA',
  },
  {
    id: 'financial-tutorials', icon: Video, title: 'Tutorials', tag: 'Financial',
    description: 'Step-by-step video walkthroughs on reading charts, fundamental analysis, options strategies, and more.',
    isPaid: false,
    items: [
      { title: 'How to Read a Balance Sheet',    meta: '18 min', level: 'Beginner' },
      { title: 'Technical Analysis Masterclass', meta: '45 min', level: 'Intermediate' },
      { title: 'Options Trading Explained',      meta: '32 min', level: 'Advanced' },
    ],
    accent: 'from-emerald-500 to-teal-600', accentRaw: '#10B981', iconColor: '#34D399',
  },
  {
    id: 'financial-certifications', icon: Award, title: 'Certifications', tag: 'Financial',
    description: 'Earn verifiable InvestBeans certificates that validate your financial market knowledge and trading skills.',
    isPaid: true,
    items: [
      { title: 'Certified Equity Analyst',           meta: '6 weeks', level: 'Intermediate' },
      { title: 'Options & Derivatives Professional', meta: '8 weeks', level: 'Advanced' },
      { title: 'Personal Finance Essentials',        meta: '3 weeks', level: 'Beginner' },
    ],
    accent: 'from-amber-500 to-orange-600', accentRaw: '#D4A843', iconColor: '#F59E0B',
  },
];

const nonFinancialItems = [
  {
    id: 'nonfinancial-ebooks', icon: BookMarked, title: 'E-books', tag: 'Non-Financial',
    description: 'Books on productivity, behavioral economics, decision-making, and the mindset needed to become a better investor.',
    isPaid: true,
    items: [
      { title: 'The Psychology of Money',      meta: '95 pages',  level: 'All Levels' },
      { title: 'Thinking in Bets',             meta: '140 pages', level: 'Intermediate' },
      { title: 'Habits of Successful Traders', meta: '110 pages', level: 'Beginner' },
    ],
    accent: 'from-purple-500 to-violet-600', accentRaw: '#8B5CF6', iconColor: '#A78BFA',
  },
  {
    id: 'nonfinancial-tutorials', icon: Play, title: 'Tutorials', tag: 'Non-Financial',
    description: 'Video tutorials on mindset, time management, productivity tools, and life skills that complement your investing journey.',
    isPaid: false,
    items: [
      { title: 'Building an Investor Mindset',  meta: '22 min', level: 'Beginner' },
      { title: 'Managing Risk Psychologically', meta: '30 min', level: 'Intermediate' },
      { title: 'Productivity for Traders',      meta: '20 min', level: 'All Levels' },
    ],
    accent: 'from-rose-500 to-pink-600', accentRaw: '#F43F5E', iconColor: '#FB7185',
  },
];

const stats = [
  { icon: BookOpen,   label: 'Resources',     value: '120+' },
  { icon: Users,      label: 'Learners',       value: '18K+' },
  { icon: Award,      label: 'Certifications', value: '3'    },
  { icon: TrendingUp, label: 'Avg Rating',     value: '4.8★' },
];

const levelStyle: Record<string, { bg: string; text: string }> = {
  Beginner:     { bg: 'rgba(16,185,129,0.12)',  text: '#34D399' },
  Intermediate: { bg: 'rgba(245,158,11,0.12)',  text: '#FBBF24' },
  Advanced:     { bg: 'rgba(239,68,68,0.12)',   text: '#F87171' },
  'All Levels': { bg: 'rgba(148,163,184,0.12)', text: '#94A3B8' },
};

// ── ItemRow ───────────────────────────────────────────────────────────────────

function ItemRow({ title, meta, level, accentRaw, isLight }: {
  title: string; meta: string; level: string; accentRaw: string; isLight: boolean;
}) {
  const ls = levelStyle[level] ?? levelStyle['All Levels'];
  return (
    <div className="flex items-center justify-between py-3 group transition-all"
      style={{ borderBottom: isLight ? '1px solid rgba(13,37,64,0.07)' : '1px solid rgba(255,255,255,0.06)' }}>
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 transition-all duration-300 group-hover:scale-125"
          style={{ background: accentRaw }} />
        <span className="text-sm font-medium truncate"
          style={{ color: isLight ? 'rgba(13,37,64,0.80)' : 'rgba(255,255,255,0.80)' }}>{title}</span>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
        <span className="text-xs" style={{ color: isLight ? 'rgba(13,37,64,0.45)' : 'rgba(148,163,184,0.8)' }}>{meta}</span>
        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
          style={{ background: ls.bg, color: ls.text }}>{level}</span>
      </div>
    </div>
  );
}

// ── LearnCard ────────────────────────────────────────────────────────────────

function LearnCard({ id, icon: Icon, title, tag, description, isPaid, items, accent, accentRaw, iconColor, isLight }: any) {
  const isFinancial = tag === 'Financial';
  return (
    <div id={id}
      className="rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1"
      style={{
        background: isLight ? 'rgba(255,255,255,0.80)' : 'rgba(255,255,255,0.04)',
        border: isLight ? '1px solid rgba(13,37,64,0.10)' : '1px solid rgba(255,255,255,0.08)',
        boxShadow: isLight ? '0 2px 12px rgba(13,37,64,0.06)' : 'none',
        scrollMarginTop: '140px',
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = `${accentRaw}55`)}
      onMouseLeave={e => (e.currentTarget.style.borderColor = isLight ? 'rgba(13,37,64,0.10)' : 'rgba(255,255,255,0.08)')}>

      <div className={`h-1 w-full bg-gradient-to-r ${accent}`} />

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-4">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center"
            style={{ background: `${accentRaw}18`, border: `1px solid ${accentRaw}30` }}>
            <Icon style={{ color: iconColor }} className="w-5 h-5" />
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold"
              style={isFinancial
                ? { background: 'rgba(59,130,246,0.12)', color: '#60A5FA' }
                : { background: 'rgba(139,92,246,0.12)', color: '#A78BFA' }}>
              {tag}
            </span>
            {isPaid ? (
              <span className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
                style={{ background: 'rgba(212,168,67,0.12)', color: '#D4A843', border: '1px solid rgba(212,168,67,0.25)' }}>
                <Lock className="w-2.5 h-2.5" /> Premium
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
                style={{ background: 'rgba(16,185,129,0.12)', color: '#34D399', border: '1px solid rgba(16,185,129,0.25)' }}>
                <Star className="w-2.5 h-2.5" /> Free
              </span>
            )}
          </div>
        </div>

        <h3 className="text-lg font-bold mb-1.5 leading-snug"
          style={{ color: isLight ? '#0D2540' : '#fff' }}>{title}</h3>
        <p className="text-sm leading-relaxed mb-5"
          style={{ color: isLight ? 'rgba(13,37,64,0.55)' : 'rgba(148,163,184,0.9)' }}>{description}</p>

        <div className="flex-1 mb-5">
          {items.map((item: any) => (
            <ItemRow key={item.title} title={item.title} meta={item.meta}
              level={item.level} accentRaw={accentRaw} isLight={isLight} />
          ))}
        </div>

        <button className={`w-full py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r ${accent} hover:opacity-90 transition-all flex items-center justify-center gap-2 group/btn`}>
          {isPaid ? 'Unlock Access' : 'Start Learning'}
          <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}

// ── SectionHeader ─────────────────────────────────────────────────────────────

function SectionHeader({ icon: Icon, title, subtitle, iconColor, accentColor, isLight }: any) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${accentColor}18`, border: `1px solid ${accentColor}30` }}>
        <Icon style={{ color: accentColor }} className="w-5 h-5" />
      </div>
      <div>
        <h2 className="text-2xl font-bold" style={{ color: isLight ? '#0D2540' : '#fff' }}>{title}</h2>
        <p className="text-sm mt-0.5"
          style={{ color: isLight ? 'rgba(13,37,64,0.50)' : 'rgba(148,163,184,0.8)' }}>{subtitle}</p>
      </div>
      <div className="flex-1 h-px ml-4"
        style={{ background: `linear-gradient(to right, ${accentColor}40, transparent)` }} />
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

const EducationView = () => {
  const location = useLocation();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.replace('#', ''));
      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }
  }, [location.hash]);

  return (
    <Layout>
      <div className="min-h-screen" style={{
        background: isLight
          ? 'linear-gradient(160deg,#dce8f7 0%,#e8f2fd 45%,#dce8f7 100%)'
          : 'linear-gradient(160deg,#0c1a2e 0%,#0e2038 45%,#0b1825 100%)',
      }}>

        {/* HERO */}
        <section className="relative overflow-hidden pt-12 pb-8 md:pt-16 md:pb-10" style={{
          background: isLight
            ? 'linear-gradient(135deg,#edf5fe 0%,#dce8f7 50%,#e8f2fd 100%)'
            : 'linear-gradient(135deg,#0a1628 0%,#0e2038 50%,#0c1a2e 100%)',
          borderBottom: isLight ? '1px solid rgba(13,37,64,0.10)' : '1px solid rgba(255,255,255,0.06)',
        }}>
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-[120px] pointer-events-none"
            style={{ background: 'radial-gradient(circle,rgba(212,168,67,0.10) 0%,transparent 70%)' }} />
          <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full blur-[100px] pointer-events-none"
            style={{ background: 'radial-gradient(circle,rgba(59,130,246,0.08) 0%,transparent 70%)' }} />

          <div className="container mx-auto px-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5"
              style={{ background: 'rgba(212,168,67,0.10)', border: '1px solid rgba(212,168,67,0.20)' }}>
              <Zap className="w-3.5 h-3.5 text-[#D4A843]" />
              <span className="text-xs font-medium text-[#D4A843]">InvestBeans Learning Hub</span>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
              <div className="max-w-2xl">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4"
                  style={{ color: isLight ? '#0D2540' : '#fff' }}>
                  Level Up Your{' '}
                  <span style={{
                    background: 'linear-gradient(135deg,#D4A843,#F0C84A)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  }}>Knowledge</span>
                </h1>
                <p className="text-base md:text-lg leading-relaxed"
                  style={{ color: isLight ? 'rgba(13,37,64,0.60)' : 'rgba(148,163,184,0.9)' }}>
                  From financial fundamentals to personal growth — everything you need to become a sharper, more confident investor.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 lg:flex-shrink-0">
                {stats.map(({ icon: StatIcon, label, value }) => (
                  <div key={label} className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl" style={{
                    background: isLight ? 'rgba(13,37,64,0.05)' : 'rgba(255,255,255,0.05)',
                    border: isLight ? '1px solid rgba(13,37,64,0.10)' : '1px solid rgba(255,255,255,0.10)',
                  }}>
                    <StatIcon className="w-4 h-4 text-[#D4A843]" />
                    <div>
                      <p className="text-base font-bold leading-none" style={{ color: isLight ? '#0D2540' : '#fff' }}>{value}</p>
                      <p className="text-[11px] mt-0.5" style={{ color: isLight ? 'rgba(13,37,64,0.50)' : 'rgba(148,163,184,0.8)' }}>{label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* STICKY NAV */}
        <div className="sticky top-[68px] z-30 shadow-sm backdrop-blur-md" style={{
          background: isLight ? 'rgba(236,245,254,0.92)' : 'rgba(10,22,40,0.92)',
          borderBottom: isLight ? '1px solid rgba(13,37,64,0.08)' : '1px solid rgba(255,255,255,0.07)',
        }}>
          <div className="container mx-auto px-6 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
            {[
              { href: '#financial',               label: '📈 Financial',      color: '#3B82F6', active: true },
              { href: '#financial-ebooks',        label: 'E-books' },
              { href: '#financial-tutorials',     label: 'Tutorials' },
              { href: '#financial-certifications',label: 'Certifications' },
              { href: null, label: '|' },
              { href: '#nonfinancial',            label: '🧠 Non-Financial',  color: '#8B5CF6', active: true },
              { href: '#nonfinancial-ebooks',     label: 'E-books' },
              { href: '#nonfinancial-tutorials',  label: 'Tutorials' },
            ].map((nav, i) =>
              nav.href === null ? (
                <div key={i} className="w-px flex-none mx-1 self-stretch"
                  style={{ background: isLight ? 'rgba(13,37,64,0.12)' : 'rgba(255,255,255,0.10)' }} />
              ) : (
                <a key={i} href={nav.href}
                  className="flex-none px-3.5 py-1.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap"
                  style={(nav as any).active && (nav as any).color
                    ? { background: `${(nav as any).color}18`, color: (nav as any).color, border: `1px solid ${(nav as any).color}30` }
                    : {
                        background: isLight ? 'rgba(13,37,64,0.05)' : 'rgba(255,255,255,0.05)',
                        color: isLight ? 'rgba(13,37,64,0.65)' : 'rgba(148,163,184,0.9)',
                        border: isLight ? '1px solid rgba(13,37,64,0.08)' : '1px solid rgba(255,255,255,0.08)',
                      }}>
                  {nav.label}
                </a>
              )
            )}
          </div>
        </div>

        {/* MAIN */}
        <div className="container mx-auto px-6 py-12 space-y-16">

          <section id="financial" style={{ scrollMarginTop: '170px' }}>
            <SectionHeader icon={BookOpen} title="Financial"
              subtitle="Master markets, analysis & investment strategies"
              iconColor="#3B82F6" accentColor="#3B82F6" isLight={isLight} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {financialItems.map(item => <LearnCard key={item.id} {...item} isLight={isLight} />)}
            </div>
          </section>

          <div className="flex items-center gap-4">
            <div className="flex-1 h-px" style={{ background: isLight ? 'rgba(13,37,64,0.10)' : 'rgba(255,255,255,0.08)' }} />
            <div className="flex items-center gap-2 text-sm font-medium px-4 py-1.5 rounded-full" style={{
              color: isLight ? 'rgba(13,37,64,0.50)' : 'rgba(148,163,184,0.7)',
              background: isLight ? 'rgba(13,37,64,0.04)' : 'rgba(255,255,255,0.04)',
              border: isLight ? '1px solid rgba(13,37,64,0.08)' : '1px solid rgba(255,255,255,0.07)',
            }}>
              <Sparkles className="w-3.5 h-3.5 text-[#D4A843]" /> More to explore
            </div>
            <div className="flex-1 h-px" style={{ background: isLight ? 'rgba(13,37,64,0.10)' : 'rgba(255,255,255,0.08)' }} />
          </div>

          <section id="nonfinancial" style={{ scrollMarginTop: '170px' }}>
            <SectionHeader icon={GraduationCap} title="Non-Financial"
              subtitle="Mindset, psychology & personal growth for investors"
              iconColor="#8B5CF6" accentColor="#8B5CF6" isLight={isLight} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl">
              {nonFinancialItems.map(item => <LearnCard key={item.id} {...item} isLight={isLight} />)}
            </div>
          </section>

          {/* CTA Banner */}
          <div className="relative rounded-2xl overflow-hidden p-8 md:p-10 text-center" style={{
            background: isLight ? 'linear-gradient(135deg,#edf5fe,#dce8f7)' : 'linear-gradient(135deg,#0a1628 0%,#0e2038 100%)',
            border: isLight ? '1px solid rgba(13,37,64,0.10)' : '1px solid rgba(212,168,67,0.15)',
          }}>
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at 50% 0%,rgba(212,168,67,0.12) 0%,transparent 60%)' }} />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4"
                style={{ background: 'rgba(212,168,67,0.10)', border: '1px solid rgba(212,168,67,0.20)' }}>
                <Zap className="w-3.5 h-3.5 text-[#D4A843]" />
                <span className="text-xs font-semibold text-[#D4A843]">Start Today</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: isLight ? '#0D2540' : '#fff' }}>
                Ready to Start Learning?
              </h2>
              <p className="mb-7 max-w-xl mx-auto text-sm md:text-base"
                style={{ color: isLight ? 'rgba(13,37,64,0.55)' : 'rgba(148,163,184,0.9)' }}>
                Join <strong style={{ color: isLight ? '#0D2540' : '#fff' }}>18,000+</strong> investors growing their
                knowledge with InvestBeans' curated content.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button className="inline-flex items-center gap-2 px-7 py-3 rounded-xl font-bold text-sm text-[#0c1a2e] hover:shadow-xl transition-all hover:-translate-y-0.5 group"
                  style={{ background: 'linear-gradient(135deg,#D4A843,#C4941E)' }}>
                  Browse All Resources
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
                <button className="inline-flex items-center gap-2 px-7 py-3 rounded-xl font-bold text-sm transition-all hover:-translate-y-0.5"
                  style={{
                    background: isLight ? 'rgba(13,37,64,0.06)' : 'rgba(255,255,255,0.07)',
                    border: isLight ? '1px solid rgba(13,37,64,0.12)' : '1px solid rgba(255,255,255,0.12)',
                    color: isLight ? '#0D2540' : '#fff',
                  }}>
                  View Free Content
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default EducationView;