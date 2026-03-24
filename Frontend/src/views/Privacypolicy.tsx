import React from 'react';
import { useTheme } from '@/controllers/Themecontext';

export default function PrivacyPolicy() {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  // ── Shared token helpers ──────────────────────────────────────────
  const t1  = isLight ? 'text-gray-900'   : 'text-white';
  const t2  = isLight ? 'text-gray-600'   : 'text-white/70';
  const t3  = isLight ? 'text-gray-400'   : 'text-white/50';
  const sectionCard = isLight
    ? 'border border-gray-100 bg-white shadow-sm'
    : 'border border-white/10 bg-white/5 backdrop-blur-sm';
  const innerCard = isLight
    ? 'bg-gray-50 border border-gray-100'
    : 'bg-white/5 border border-white/10';
  const accentCard = isLight
    ? 'bg-blue-50 border-l-4 border-[#5194F6]'
    : 'bg-[#5194F6]/08 border-l-4 border-[#5194F6]';
  const numberBadge = `flex-shrink-0 w-12 h-12 rounded-lg bg-[#5194F6]/15 flex items-center justify-center text-[#5194F6] font-bold text-xl group-hover:bg-[#5194F6] group-hover:text-white transition-colors duration-300`;

  return (
    <div className={`min-h-screen ${isLight ? 'bg-[#f5f4f0] text-gray-900' : 'bg-slate-950/95 text-white'}`}>

      {/* Header */}
      <header className={`border-b backdrop-blur-sm sticky top-0 z-50 ${isLight ? 'border-gray-100 bg-white/95' : 'border-white/10 bg-slate-950/90'}`}>
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-2xl font-bold ${t1}`} style={{ fontFamily: 'Georgia, serif' }}>
                InvestBeans
              </h1>
              <p className={`text-sm mt-1 ${t3}`}>Your privacy matters to us</p>
            </div>
            <a href="/" className="text-sm text-[#5194F6] hover:text-[#3a7de0] transition-colors font-medium">
              ← Back to Home
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-16">

        {/* Title Section */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <svg className="w-12 h-12 text-[#5194F6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <h1 className={`text-5xl font-bold ${t1}`} style={{ fontFamily: 'Georgia, serif' }}>
              Privacy Policy
            </h1>
          </div>
          <p className={`text-lg ${t3}`}>Effective Date: [Insert Date] &nbsp;|&nbsp; Last Updated: [Insert Date]</p>
          <div className="mt-6 h-1 w-24 bg-gradient-to-r from-[#5194F6] to-[#3a7de0] rounded-full" />
        </div>

        {/* Legal Framework Banner */}
        <div className={`mb-10 rounded-xl p-5 flex flex-wrap gap-3 items-center ${isLight ? 'bg-blue-50 border border-blue-100' : 'bg-[#5194F6]/10 border border-[#5194F6]/20'}`}>
          <span className={`text-sm font-semibold ${t1}`}>Governed by Indian Law:</span>
          {['Information Technology Act, 2000', 'IT (SPDI) Rules, 2011', 'DPDP Act, 2023'].map(law => (
            <span key={law} className="text-xs bg-[#5194F6]/15 text-[#5194F6] font-medium px-3 py-1 rounded-full">{law}</span>
          ))}
        </div>

        {/* Introduction */}
        <section className={`mb-12 rounded-xl p-8 ${sectionCard}`}>
          <p className={`text-lg leading-relaxed ${t2}`}>
            This Privacy Policy ("Policy") is issued by <strong className={t1}>InvestBeans</strong>, a proprietorship firm based in India ("we," "our," "us").
            This Policy governs how we collect, use, store, process, and disclose personal data in compliance with applicable Indian laws.
            By accessing our website, mobile applications, or any services ("Services"), you agree to this Policy.
          </p>
        </section>

        {/* Sections */}
        <div className="space-y-10">

          {/* 1 – Regulatory Position & SEBI Disclaimer */}
          <section className="group">
            <div className="flex items-start gap-4">
              <div className={numberBadge}>1</div>
              <div className="flex-1">
                <h2 className={`text-2xl font-bold mb-4 ${t1}`} style={{ fontFamily: 'Georgia, serif' }}>
                  Regulatory Position &amp; SEBI Disclaimer
                </h2>
                <div className={`space-y-4 leading-relaxed ${t2}`}>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>InvestBeans provides <strong>financial education, research insights, and general market information.</strong></li>
                    <li>We do <strong>not</strong> execute trades on behalf of clients.</li>
                    <li>We do <strong>not</strong> hold client funds or securities.</li>
                    <li>Any information shared is for <strong>educational and informational purposes only.</strong></li>
                  </ul>
                  <div className={`rounded-lg p-5 mt-4 border-l-4 border-amber-400 ${isLight ? 'bg-amber-50 text-amber-900' : 'bg-amber-500/10 text-white/80'}`}>
                    <p className="font-semibold mb-2">⚠️ SEBI Registration Notice</p>
                    <p className="text-sm">
                      We are NISM-certified and are in the process of obtaining SEBI registration. Until such registration is obtained:
                    </p>
                    <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                      <li>No content should be construed as investment advice or recommendation under SEBI regulations.</li>
                      <li>Users are advised to consult a SEBI-registered investment advisor before making any investment decisions.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 2 – Information We Collect */}
          <section className="group">
            <div className="flex items-start gap-4">
              <div className={numberBadge}>2</div>
              <div className="flex-1">
                <h2 className={`text-2xl font-bold mb-4 ${t1}`} style={{ fontFamily: 'Georgia, serif' }}>
                  Information We Collect
                </h2>
                <div className={`space-y-6 leading-relaxed ${t2}`}>

                  <div className={`rounded-lg p-5 ${innerCard}`}>
                    <p className={`font-semibold mb-3 ${t1}`}>2.1 Personal Data</p>
                    <ul className="list-disc pl-6 space-y-1 text-sm">
                      <li>Name</li>
                      <li>Email address</li>
                      <li>Phone number</li>
                      <li>Date of birth</li>
                      <li>Risk profile &amp; investment preferences</li>
                    </ul>
                  </div>

                  <div className={`rounded-lg p-5 ${innerCard}`}>
                    <p className={`font-semibold mb-2 ${t1}`}>2.2 Sensitive Personal Data</p>
                    <p className="text-sm mb-2 italic">Collected only when necessary and with explicit consent:</p>
                    <ul className="list-disc pl-6 space-y-1 text-sm">
                      <li>Financial capacity information</li>
                      <li>Account-related data (if voluntarily shared)</li>
                    </ul>
                  </div>

                  <div className={`rounded-lg p-5 ${innerCard}`}>
                    <p className={`font-semibold mb-3 ${t1}`}>2.3 Non-Personal Data</p>
                    <ul className="list-disc pl-6 space-y-1 text-sm">
                      <li>IP address</li>
                      <li>Device and browser details</li>
                      <li>Usage analytics</li>
                      <li>Cookies and tracking data</li>
                    </ul>
                  </div>

                </div>
              </div>
            </div>
          </section>

          {/* 3 – How We Use Your Data */}
          <section className="group">
            <div className="flex items-start gap-4">
              <div className={numberBadge}>3</div>
              <div className="flex-1">
                <h2 className={`text-2xl font-bold mb-4 ${t1}`} style={{ fontFamily: 'Georgia, serif' }}>
                  How We Use Your Data
                </h2>
                <div className={`space-y-3 leading-relaxed ${t2}`}>
                  <p>We use your data to:</p>
                  <div className={`rounded-lg p-6 space-y-3 ${accentCard}`}>
                    <p><strong>✓ Educational Content:</strong> Provide educational content and market insights</p>
                    <p><strong>✓ Personalization:</strong> Personalize learning and trading experience</p>
                    <p><strong>✓ Communication:</strong> Share updates, newsletters, and alerts</p>
                    <p><strong>✓ Platform Improvement:</strong> Improve platform performance</p>
                    <p><strong>✓ Security:</strong> Ensure security and prevent fraud</p>
                    <p><strong>✓ Legal Compliance:</strong> Comply with legal obligations</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 4 – Communication Platforms */}
          <section className="group">
            <div className="flex items-start gap-4">
              <div className={numberBadge}>4</div>
              <div className="flex-1">
                <h2 className={`text-2xl font-bold mb-4 ${t1}`} style={{ fontFamily: 'Georgia, serif' }}>
                  Communication Platforms
                </h2>
                <div className={`space-y-4 leading-relaxed ${t2}`}>
                  <p>By registering with InvestBeans, you consent to receive communications via:</p>
                  <div className="grid md:grid-cols-3 gap-4">
                    {[
                      { icon: '💬', label: 'WhatsApp' },
                      { icon: '📢', label: 'Telegram Channels / Groups' },
                      { icon: '📧', label: 'Email & SMS' },
                    ].map(item => (
                      <div key={item.label} className={`rounded-lg p-4 text-center ${innerCard}`}>
                        <div className="text-2xl mb-2">{item.icon}</div>
                        <p className={`font-medium text-sm ${t1}`}>{item.label}</p>
                      </div>
                    ))}
                  </div>
                  <div className={`rounded-lg p-5 border-l-4 border-amber-400 ${isLight ? 'bg-amber-50 text-amber-900' : 'bg-amber-500/10 text-white/80'}`}>
                    <p className="font-semibold mb-2">⚠️ Important</p>
                    <ul className="list-disc pl-5 text-sm space-y-1">
                      <li>Messages shared are informational and educational in nature.</li>
                      <li>They should not be treated as buy/sell recommendations.</li>
                      <li>We are not responsible for trades executed based on such communications.</li>
                    </ul>
                    <p className="text-sm mt-3">Users may <strong>opt-out</strong> at any time.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 5 – AI & Algorithm Usage Disclaimer */}
          <section className="group">
            <div className="flex items-start gap-4">
              <div className={numberBadge}>5</div>
              <div className="flex-1">
                <h2 className={`text-2xl font-bold mb-4 ${t1}`} style={{ fontFamily: 'Georgia, serif' }}>
                  AI &amp; Algorithm Usage Disclaimer
                </h2>
                <div className={`space-y-4 leading-relaxed ${t2}`}>
                  <p>InvestBeans may use AI tools, algorithms, or data models to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Analyze market trends</li>
                    <li>Generate insights or summaries</li>
                    <li>Improve user experience</li>
                  </ul>
                  <div className={`rounded-lg p-5 border-l-4 border-[#5194F6] ${isLight ? 'bg-blue-50' : 'bg-white/5'}`}>
                    <p className={`font-semibold mb-2 ${t1}`}>Disclaimer</p>
                    <ul className="list-disc pl-5 text-sm space-y-1">
                      <li>Outputs are <strong>indicative, not guaranteed.</strong></li>
                      <li>Markets are inherently uncertain.</li>
                      <li>Users should apply <strong>independent judgment</strong> before acting on any AI-generated content.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 6 – Data Sharing */}
          <section className="group">
            <div className="flex items-start gap-4">
              <div className={numberBadge}>6</div>
              <div className="flex-1">
                <h2 className={`text-2xl font-bold mb-4 ${t1}`} style={{ fontFamily: 'Georgia, serif' }}>
                  Data Sharing
                </h2>
                <div className={`space-y-4 leading-relaxed ${t2}`}>
                  <p className={`font-semibold text-green-600`}>✅ We do not sell your data.</p>
                  <p>We may share data with:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Technology and service providers</strong></li>
                    <li><strong>Analytics tools</strong></li>
                    <li><strong>Legal or regulatory authorities</strong> (when required by law)</li>
                  </ul>
                  <p>All third parties are bound by confidentiality obligations.</p>
                </div>
              </div>
            </div>
          </section>

          {/* 7 – Data Retention */}
          <section className="group">
            <div className="flex items-start gap-4">
              <div className={numberBadge}>7</div>
              <div className="flex-1">
                <h2 className={`text-2xl font-bold mb-4 ${t1}`} style={{ fontFamily: 'Georgia, serif' }}>
                  Data Retention
                </h2>
                <div className={`space-y-4 leading-relaxed ${t2}`}>
                  <p>We retain your data only for:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Service delivery purposes</li>
                    <li>Legal and compliance requirements</li>
                  </ul>
                  <p>Data is <strong>deleted or anonymized</strong> when no longer required.</p>
                </div>
              </div>
            </div>
          </section>

          {/* 8 – Data Security */}
          <section className="group">
            <div className="flex items-start gap-4">
              <div className={numberBadge}>8</div>
              <div className="flex-1">
                <h2 className={`text-2xl font-bold mb-4 ${t1}`} style={{ fontFamily: 'Georgia, serif' }}>
                  Data Security
                </h2>
                <div className={`space-y-4 leading-relaxed ${t2}`}>
                  <p>We implement reasonable security measures including:</p>
                  <div className="grid md:grid-cols-3 gap-4">
                    {[
                      { icon: '🔒', title: 'Encryption', desc: 'Data encrypted in transit and at rest' },
                      { icon: '🖥️', title: 'Secure Servers', desc: 'Hosted on protected infrastructure' },
                      { icon: '🔑', title: 'Access Controls', desc: 'Restricted access to personal data' },
                    ].map(item => (
                      <div key={item.title} className={`rounded-lg p-5 ${innerCard}`}>
                        <div className={`font-semibold mb-2 ${t1}`}>{item.icon} {item.title}</div>
                        <p className="text-sm">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                  <p className={`border-l-4 border-amber-400/60 p-4 rounded-r mt-2 text-sm ${isLight ? 'bg-amber-50 text-amber-800' : 'bg-amber-500/10 text-white/70'}`}>
                    No digital system is 100% secure. We are committed to maintaining high standards of data protection.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 9 – Your Rights (DPDP Act, 2023) */}
          <section className="group">
            <div className="flex items-start gap-4">
              <div className={numberBadge}>9</div>
              <div className="flex-1">
                <h2 className={`text-2xl font-bold mb-4 ${t1}`} style={{ fontFamily: 'Georgia, serif' }}>
                  Your Rights <span className={`text-base font-normal ${t3}`}>(DPDP Act, 2023)</span>
                </h2>
                <div className={`space-y-4 leading-relaxed ${t2}`}>
                  <p>Under the Digital Personal Data Protection Act, 2023, you have the right to:</p>
                  <div className="space-y-3">
                    {[
                      { title: 'Access Your Data', desc: 'Request a copy of the personal information we hold about you.' },
                      { title: 'Correct Inaccuracies', desc: 'Request correction of inaccurate or incomplete data.' },
                      { title: 'Request Deletion', desc: 'Request deletion of your personal information, subject to legal exceptions.' },
                      { title: 'Withdraw Consent', desc: 'Withdraw consent for data processing at any time.' },
                      { title: 'File Grievances', desc: 'Lodge a complaint with our Grievance Officer or the Data Protection Board.' },
                    ].map(item => (
                      <div key={item.title} className={`rounded-lg p-5 border-l-4 border-[#5194F6] ${isLight ? 'bg-blue-50' : 'bg-white/5'}`}>
                        <h3 className={`font-semibold mb-1 ${t1}`}>{item.title}</h3>
                        <p className="text-sm">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm mt-2">
                    To exercise any of these rights, please contact us at{' '}
                    <a href="mailto:support@investbeans.com" className="text-[#5194F6] hover:underline font-medium">support@investbeans.com</a>.
                    We will respond within 30 days.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 10 – Cookies Policy */}
          <section className="group">
            <div className="flex items-start gap-4">
              <div className={numberBadge}>10</div>
              <div className="flex-1">
                <h2 className={`text-2xl font-bold mb-4 ${t1}`} style={{ fontFamily: 'Georgia, serif' }}>
                  Cookies Policy
                </h2>
                <div className={`space-y-4 leading-relaxed ${t2}`}>
                  <p>We use cookies to enhance experience and analyze platform performance.</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Essential Cookies:</strong> Required for basic platform functionality and security</li>
                    <li><strong>Performance Cookies:</strong> Help us understand how visitors interact with our platform</li>
                    <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
                  </ul>
                  <p>You may disable cookies via your browser settings. However, disabling certain cookies may affect some features.</p>
                </div>
              </div>
            </div>
          </section>

          {/* 11 – Third-Party Links */}
          <section className="group">
            <div className="flex items-start gap-4">
              <div className={numberBadge}>11</div>
              <div className="flex-1">
                <h2 className={`text-2xl font-bold mb-4 ${t1}`} style={{ fontFamily: 'Georgia, serif' }}>
                  Third-Party Links
                </h2>
                <div className={`space-y-4 leading-relaxed ${t2}`}>
                  <p>
                    We may link to brokers or external platforms. We are <strong>not responsible</strong> for their privacy practices.
                    Please review the privacy policies of any third-party sites you visit.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 12 – Children's Privacy */}
          <section className="group">
            <div className="flex items-start gap-4">
              <div className={numberBadge}>12</div>
              <div className="flex-1">
                <h2 className={`text-2xl font-bold mb-4 ${t1}`} style={{ fontFamily: 'Georgia, serif' }}>
                  Children's Privacy
                </h2>
                <div className={`space-y-4 leading-relaxed ${t2}`}>
                  <p className={`border-l-4 border-red-500 p-4 rounded-r ${isLight ? 'bg-red-50 text-red-800' : 'bg-red-500/10 text-white/70'}`}>
                    Our Services are not intended for individuals under the age of 18. We do not knowingly collect personal information from minors.
                    If we become aware that we have collected data from a child under 18, we will delete that information promptly.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 13 – Grievance Officer */}
          <section className="group">
            <div className="flex items-start gap-4">
              <div className={numberBadge}>13</div>
              <div className="flex-1">
                <h2 className={`text-2xl font-bold mb-4 ${t1}`} style={{ fontFamily: 'Georgia, serif' }}>
                  Grievance Officer
                </h2>
                <div className={`space-y-4 leading-relaxed ${t2}`}>
                  <p>As required under Indian law, we have appointed a Grievance Officer:</p>
                  <div className={`rounded-lg p-6 ${innerCard}`}>
                    <div className="space-y-2 text-sm">
                      <p><strong className={t1}>Name:</strong> [Insert Name]</p>
                      <p>
                        <strong className={t1}>Email:</strong>{' '}
                        <a href="mailto:support@investbeans.com" className="text-[#5194F6] hover:underline">support@investbeans.com</a>
                      </p>
                      <p><strong className={t1}>Contact:</strong> [Insert Phone]</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 14 – Limitation of Liability */}
          <section className="group">
            <div className="flex items-start gap-4">
              <div className={numberBadge}>14</div>
              <div className="flex-1">
                <h2 className={`text-2xl font-bold mb-4 ${t1}`} style={{ fontFamily: 'Georgia, serif' }}>
                  Limitation of Liability
                </h2>
                <div className={`space-y-4 leading-relaxed ${t2}`}>
                  <p>InvestBeans shall <strong>not be liable</strong> for:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Any financial losses</li>
                    <li>Trading decisions made by users</li>
                    <li>Reliance on platform content or AI-generated insights</li>
                  </ul>
                  <p className={`border-l-4 border-red-500 p-4 rounded-r text-sm ${isLight ? 'bg-red-50 text-red-800' : 'bg-red-500/10 text-white/70'}`}>
                    All market participation is at the user's own risk.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 15 – Policy Updates */}
          <section className="group">
            <div className="flex items-start gap-4">
              <div className={numberBadge}>15</div>
              <div className="flex-1">
                <h2 className={`text-2xl font-bold mb-4 ${t1}`} style={{ fontFamily: 'Georgia, serif' }}>
                  Policy Updates
                </h2>
                <div className={`space-y-4 leading-relaxed ${t2}`}>
                  <p>
                    We may update this Policy at any time to reflect changes in our practices or legal requirements.
                    Continued usage of our Services after any update implies acceptance of the revised Policy.
                    We will update the "Effective Date" at the top of this page accordingly.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 16 – Contact Us */}
          <section className="group">
            <div className="flex items-start gap-4">
              <div className={numberBadge}>16</div>
              <div className="flex-1">
                <h2 className={`text-2xl font-bold mb-4 ${t1}`} style={{ fontFamily: 'Georgia, serif' }}>
                  Contact Us
                </h2>
                <div className={`space-y-4 leading-relaxed ${t2}`}>
                  <p>If you have questions or concerns about this Privacy Policy or our data practices, please contact us:</p>
                  <div className="bg-gradient-to-r from-[#5194F6] to-[#3a7de0] rounded-lg p-6 text-white">
                    <p className="font-semibold mb-3">InvestBeans</p>
                    <p className="mb-2">📧 Email: <a href="mailto:support@investbeans.com" className="underline hover:opacity-80">support@investbeans.com</a></p>
                    <p>📞 Phone: [Insert Phone]</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* Privacy Highlights Card */}
        <div className={`mt-16 p-6 rounded-xl border border-[#5194F6]/25 ${isLight ? 'bg-blue-50' : 'bg-white/5'}`}>
          <p className={`font-semibold mb-4 text-[#5194F6]`}>🔐 Privacy Highlights</p>
          <div className="grid md:grid-cols-2 gap-3">
            {[
              'Your data is secure (सुरक्षित)',
              "We don't sell your data",
              'Used only to improve your experience',
              'You can request deletion anytime',
              'Educational insights, not financial advice',
              'Compliant with DPDP Act, 2023',
            ].map(item => (
              <p key={item} className={`text-sm flex items-start gap-2 ${t2}`}>
                <span className="text-green-500 font-bold mt-0.5">✓</span> {item}
              </p>
            ))}
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className={`border-t mt-24 ${isLight ? 'border-gray-100 bg-gray-50' : 'border-white/10 bg-slate-950/90'}`}>
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className={`text-sm ${t3}`}>© 2026 InvestBeans. All rights reserved.</p>
            <div className="flex gap-6 text-sm">
              <a href="/terms-of-service" className={`transition-colors hover:text-[#5194F6] ${t3}`}>Terms of Service</a>
              <a href="/help-center" className={`transition-colors hover:text-[#5194F6] ${t3}`}>Help Center</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}