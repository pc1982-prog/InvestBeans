import React, { useEffect } from 'react';
import Layout from '@/components/Layout';
import { useLocation } from 'react-router-dom';
import {
  BookOpen,
  GraduationCap,
  Video,
  Award,
  Lock,
  BookMarked,
  Play,
  FileText,
  ChevronRight,
  Star,
} from 'lucide-react';

// ---- Data ----

const financialItems = [
  {
    id: 'financial-ebooks',
    icon: BookOpen,
    title: 'E-books',
    tag: 'Financial',
    tagColor: 'bg-blue-100 text-blue-700',
    description: 'In-depth financial guides, market deep-dives, and comprehensive investment references curated by InvestBeans experts.',
    isPaid: true,
    items: [
      { title: 'Fundamentals of Equity Investing', pages: '120 pages', level: 'Beginner' },
      { title: 'Advanced Portfolio Management', pages: '200 pages', level: 'Advanced' },
      { title: 'Global Markets Decoded', pages: '160 pages', level: 'Intermediate' },
    ],
    accent: 'from-blue-500 to-indigo-600',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    id: 'financial-tutorials',
    icon: Video,
    title: 'Tutorials',
    tag: 'Financial',
    tagColor: 'bg-blue-100 text-blue-700',
    description: 'Step-by-step video walkthroughs on reading charts, fundamental analysis, options strategies, and more.',
    isPaid: false,
    items: [
      { title: 'How to Read a Balance Sheet', duration: '18 min', level: 'Beginner' },
      { title: 'Technical Analysis Masterclass', duration: '45 min', level: 'Intermediate' },
      { title: 'Options Trading Explained', duration: '32 min', level: 'Advanced' },
    ],
    accent: 'from-emerald-500 to-teal-600',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
  },
  {
    id: 'financial-certifications',
    icon: Award,
    title: 'Certifications',
    tag: 'Financial',
    tagColor: 'bg-blue-100 text-blue-700',
    description: 'Earn verifiable InvestBeans certificates that validate your financial market knowledge and trading skills.',
    isPaid: true,
    items: [
      { title: 'Certified Equity Analyst', duration: '6 weeks', level: 'Intermediate' },
      { title: 'Options & Derivatives Professional', duration: '8 weeks', level: 'Advanced' },
      { title: 'Personal Finance Essentials', duration: '3 weeks', level: 'Beginner' },
    ],
    accent: 'from-amber-500 to-orange-600',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
  },
];

const nonFinancialItems = [
  {
    id: 'nonfinancial-ebooks',
    icon: BookMarked,
    title: 'E-books',
    tag: 'Non-Financial',
    tagColor: 'bg-purple-100 text-purple-700',
    description: 'Books on productivity, behavioral economics, decision-making, and the mindset needed to become a better investor.',
    isPaid: true,
    items: [
      { title: 'The Psychology of Money', pages: '95 pages', level: 'All Levels' },
      { title: 'Thinking in Bets', pages: '140 pages', level: 'Intermediate' },
      { title: 'Habits of Successful Traders', pages: '110 pages', level: 'Beginner' },
    ],
    accent: 'from-purple-500 to-violet-600',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
  {
    id: 'nonfinancial-tutorials',
    icon: Play,
    title: 'Tutorials',
    tag: 'Non-Financial',
    tagColor: 'bg-purple-100 text-purple-700',
    description: 'Video tutorials on mindset, time management, productivity tools, and life skills that complement your investing journey.',
    isPaid: false,
    items: [
      { title: 'Building an Investor Mindset', duration: '22 min', level: 'Beginner' },
      { title: 'Managing Risk Psychologically', duration: '30 min', level: 'Intermediate' },
      { title: 'Productivity for Traders', duration: '20 min', level: 'All Levels' },
    ],
    accent: 'from-rose-500 to-pink-600',
    iconBg: 'bg-rose-100',
    iconColor: 'text-rose-600',
  },
];

// ---- Sub-components ----

const SectionTag = ({ label, colorClass }: { label: string; colorClass: string }) => (
  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${colorClass}`}>
    {label}
  </span>
);

const ItemRow = ({ title, meta, level }: { title: string; meta: string; level: string }) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0 group">
    <div className="flex items-center gap-3">
      <div className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-accent transition-colors" />
      <span className="text-sm font-medium text-gray-700 group-hover:text-navy transition-colors">{title}</span>
    </div>
    <div className="flex items-center gap-2 text-xs text-gray-400">
      <span>{meta}</span>
      <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-500">{level}</span>
    </div>
  </div>
);

const LearnCard = ({
  id, icon: Icon, title, tag, tagColor, description, isPaid, items, accent, iconBg, iconColor,
}: (typeof financialItems)[0]) => (
  <div
    id={id}
    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col"
    style={{ scrollMarginTop: '120px' }}
  >
    {/* Card header gradient strip */}
    <div className={`h-1.5 w-full bg-gradient-to-r ${accent}`} />

    <div className="p-6 flex flex-col flex-1">
      {/* Icon + Badge row */}
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <SectionTag label={tag} colorClass={tagColor} />
          {isPaid ? (
            <span className="flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
              <Lock className="w-3 h-3" /> Premium
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
              <Star className="w-3 h-3" /> Free
            </span>
          )}
        </div>
      </div>

      <h3 className="text-xl font-bold text-navy mb-2">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed mb-5">{description}</p>

      {/* Items list */}
      <div className="flex-1 mb-5">
        {items.map((item) => (
          <ItemRow
            key={item.title}
            title={item.title}
            meta={'pages' in item ? item.pages : item.duration}
            level={item.level}
          />
        ))}
      </div>

      {/* CTA */}
      <button className={`w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r ${accent} hover:opacity-90 transition-opacity flex items-center justify-center gap-2`}>
        {isPaid ? 'Unlock Access' : 'Start Learning'}
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  </div>
);

// ---- Main Page ----

const EducationView = () => {
  const location = useLocation();

  // Scroll to hash on mount or hash change
  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.replace('#', ''));
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
      }
    }
  }, [location.hash]);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero */}
        <div className="bg-gradient-to-br from-navy via-navy/95 to-navy/90 text-white py-16 px-6">
          <div className="container mx-auto text-center max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm font-medium mb-6 border border-white/20">
              <GraduationCap className="w-4 h-4 text-accent" />
              InvestBeans Learning Hub
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Level Up Your <span className="text-accent">Knowledge</span>
            </h1>
            <p className="text-lg text-white/70 leading-relaxed">
              From financial fundamentals to personal growth — everything you need to become a sharper, more confident investor.
            </p>
          </div>
        </div>

        {/* Quick Nav Pills */}
        <div className="bg-white border-b border-gray-100 sticky top-[120px] z-30 shadow-sm">
          <div className="container mx-auto px-6 py-3 flex gap-3 overflow-x-auto scrollbar-hide">
            <a href="#financial" className="flex-none px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold hover:bg-blue-100 transition flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" /> Financial
            </a>
            <a href="#financial-ebooks" className="flex-none px-4 py-1.5 rounded-full bg-gray-100 text-gray-600 text-sm font-medium hover:bg-gray-200 transition">E-books</a>
            <a href="#financial-tutorials" className="flex-none px-4 py-1.5 rounded-full bg-gray-100 text-gray-600 text-sm font-medium hover:bg-gray-200 transition">Tutorials</a>
            <a href="#financial-certifications" className="flex-none px-4 py-1.5 rounded-full bg-gray-100 text-gray-600 text-sm font-medium hover:bg-gray-200 transition">Certifications</a>
            <div className="flex-none w-px bg-gray-200 mx-1" />
            <a href="#nonfinancial" className="flex-none px-4 py-1.5 rounded-full bg-purple-50 text-purple-700 text-sm font-semibold hover:bg-purple-100 transition flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5" /> Non-Financial
            </a>
            <a href="#nonfinancial-ebooks" className="flex-none px-4 py-1.5 rounded-full bg-gray-100 text-gray-600 text-sm font-medium hover:bg-gray-200 transition">E-books</a>
            <a href="#nonfinancial-tutorials" className="flex-none px-4 py-1.5 rounded-full bg-gray-100 text-gray-600 text-sm font-medium hover:bg-gray-200 transition">Tutorials</a>
          </div>
        </div>

        <div className="container mx-auto px-6 py-14 space-y-16">
          {/* Financial Section */}
          <section id="financial" style={{ scrollMarginTop: '170px' }}>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-navy">Financial</h2>
                <p className="text-sm text-gray-500">Master markets, analysis, and investment strategies</p>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-blue-200 to-transparent ml-4" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {financialItems.map((item) => (
                <LearnCard key={item.id} {...item} />
              ))}
            </div>
          </section>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-200" />
            <div className="flex items-center gap-2 text-sm text-gray-400 font-medium">
              <FileText className="w-4 h-4" />
              More to explore
            </div>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Non-Financial Section */}
          <section id="nonfinancial" style={{ scrollMarginTop: '170px' }}>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-navy">Non-Financial</h2>
                <p className="text-sm text-gray-500">Mindset, psychology, and personal growth for investors</p>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-purple-200 to-transparent ml-4" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
              {nonFinancialItems.map((item) => (
                <LearnCard key={item.id} {...item} />
              ))}
            </div>
          </section>

          {/* CTA Banner */}
          <div className="bg-gradient-to-r from-navy to-navy/90 rounded-2xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-2">Ready to Start Learning?</h2>
            <p className="text-white/70 mb-6 max-w-xl mx-auto">
              Join thousands of investors growing their knowledge with InvestBeans' curated content.
            </p>
            <button className="bg-accent text-white px-8 py-3 rounded-xl font-semibold hover:bg-accent/90 transition-colors">
              Browse All Resources
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EducationView;