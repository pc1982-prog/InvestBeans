import React from 'react';
import { useTheme } from '@/controllers/Themecontext';

const offerings = [
  {
    title: 'Market Intelligence',
    desc: 'Dashboards and research that translate market complexity into clear context.',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    gradient: 'from-blue-500 to-indigo-600',
  },
  {
    title: 'Stock & Sector Research',
    desc: 'Structured evaluation of stocks, sectors, and themes using repeatable frameworks.',
    icon: 'M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z',
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    title: 'Education & Skill Development',
    desc: 'Beginner-to-advanced learning paths designed for traders and long-term investors.',
    icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253',
    gradient: 'from-purple-500 to-violet-600',
  },
  {
    title: 'Tools & Decision Frameworks',
    desc: 'Risk-first models that support disciplined, process-driven market participation.',
    icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
    gradient: 'from-cyan-500 to-blue-600',
  },
];

const WhatWeDo: React.FC = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  return (
    <section id="what-we-do" className="scroll-mt-24 mb-12">
      <div className={`relative overflow-hidden rounded-[32px] p-6 sm:p-10 ${isLight ? "bg-white border border-gray-100 shadow-xl" : "border border-white/10 bg-white/5 backdrop-blur-2xl"}`}>

        {/* background blobs */}
        <div className={`absolute inset-0 bg-gradient-to-br pointer-events-none ${isLight ? "from-blue-50/50 via-transparent to-purple-50/30" : "from-blue-500/10 via-transparent to-purple-500/10"}`} />
        <div className="absolute -top-20 right-10 w-64 h-64 bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-20 left-10 w-64 h-64 bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative">

          {/* Header */}
          <div className="text-center mb-10 space-y-3">
            <span className={`inline-flex items-center gap-2 text-xs uppercase tracking-[0.5em] ${isLight ? "text-gray-400" : "text-white/60"}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              Our Services
            </span>
            <h2 className={`text-3xl sm:text-4xl font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
              What We Do
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full" />
            <p className={`text-sm sm:text-base max-w-2xl mx-auto ${isLight ? "text-gray-500" : "text-white/70"}`}>
              Research-led tools, structured education, and intelligent frameworks designed to support every stage of your market journey.
            </p>
          </div>

          {/* Cards grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            {offerings.map((item) => (
              <div
                key={item.title}
                className={`group relative overflow-hidden rounded-2xl p-5 flex gap-4 items-start transition-all duration-300 ${isLight ? "border border-gray-100 bg-gray-50 hover:bg-white hover:border-gray-200 hover:shadow-md" : "border border-white/10 bg-white/5 hover:border-white/20"}`}
              >
                {/* subtle hover glow */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-[0.06] bg-gradient-to-br ${item.gradient} pointer-events-none rounded-2xl transition-opacity duration-500`} />

                {/* icon */}
                <div className={`flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform duration-300`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                </div>

                {/* text */}
                <div>
                  <h3 className={`text-base font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>{item.title}</h3>
                  <p className={`text-sm mt-1 leading-relaxed ${isLight ? "text-gray-500" : "text-white/70"}`}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default WhatWeDo;