import React from 'react';

const offerings = [
  {
    title: 'Research-Grade Insights',
    desc: 'Every learning path comes with structured research, not speculative calls.',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    gradient: 'from-blue-500 to-indigo-600',
  },
  {
    title: 'Ethics-First Advisory',
    desc: 'No unrealistic returns—just disciplined processes and transparent communication.',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    title: 'Human Support System',
    desc: 'Community, mentorship, and real conversations instead of generic FAQs.',
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
    gradient: 'from-purple-500 to-violet-600',
  },
  {
    title: 'Multi-Asset Literacy',
    desc: 'We cover equities, commodities, currency and risk so you build true versatility.',
    icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    gradient: 'from-cyan-500 to-blue-600',
  },
  {
    title: 'Women & Youth Focus',
    desc: 'Financial literacy tracks created for underrepresented groups.',
    icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
    gradient: 'from-pink-500 to-rose-600',
  },
  {
    title: 'Practical Trading Routines',
    desc: 'Frameworks rooted in risk awareness, journaling and capital preservation.',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
    gradient: 'from-amber-500 to-orange-600',
  },
];

const WhatWeDo: React.FC = () => {
  return (
    <section id="what-we-do" className="scroll-mt-24 mb-12">
      <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-2xl p-6 sm:p-10">

        {/* background blobs */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 pointer-events-none" />
        <div className="absolute -top-20 right-10 w-64 h-64 bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-20 left-10 w-64 h-64 bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative">

          {/* Header */}
          <div className="text-center mb-10 space-y-3">
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.5em] text-white/60">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              What we do
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              People-powered learning for thoughtful traders.
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full" />
            <p className="text-sm sm:text-base text-white/70 max-w-2xl mx-auto">
              We blend research-driven insights, ethical practices, and human mentorship
              so you can navigate markets with clarity, calm, and conviction.
            </p>
          </div>

          {/* Cards grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {offerings.map((item) => (
              <div
                key={item.title}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 flex gap-4 items-start hover:border-white/20 transition-all duration-300"
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
                  <h3 className="text-base font-semibold text-white">{item.title}</h3>
                  <p className="text-sm text-white/70 mt-1 leading-relaxed">{item.desc}</p>
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