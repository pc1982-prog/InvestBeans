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
  const rightBorderCard = isLight
    ? 'bg-blue-50 border-l-4 border-[#5194F6]'
    : 'bg-white/5 border-l-4 border-[#5194F6]';
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
          <p className={`text-lg ${t3}`}>Last Updated: February 5, 2026</p>
          <div className="mt-6 h-1 w-24 bg-gradient-to-r from-[#5194F6] to-[#3a7de0] rounded-full" />
        </div>

        {/* Introduction */}
        <section className={`mb-12 rounded-xl p-8 ${sectionCard}`}>
          <p className={`text-lg leading-relaxed ${t2}`}>
            At InvestBeans, we are committed to protecting your privacy and ensuring the security of your personal information.
            This Privacy Policy explains how we collect, use, disclose, and safeguard your data when you use our platform.
            We believe in transparency and want you to understand your rights and our practices.
          </p>
        </section>

        {/* Sections */}
        <div className="space-y-10">

          {/* 1 – Information We Collect */}
          <section className="group">
            <div className="flex items-start gap-4">
              <div className={numberBadge}>1</div>
              <div className="flex-1">
                <h2 className={`text-2xl font-bold mb-4 ${t1}`} style={{ fontFamily: 'Georgia, serif' }}>
                  Information We Collect
                </h2>
                <div className={`space-y-4 leading-relaxed ${t2}`}>
                  <p className={`font-semibold ${t1}`}>Personal Information You Provide:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Account Information:</strong> Name, email address, phone number, username, and password</li>
                    <li><strong>Profile Information:</strong> Investment experience level, trading preferences, financial goals</li>
                    <li><strong>Payment Information:</strong> Billing details, payment method information (processed securely through third-party payment processors)</li>
                    <li><strong>Communication Data:</strong> Messages sent through our platform, feedback, and support inquiries</li>
                  </ul>
                  <p className={`font-semibold mt-6 ${t1}`}>Information Collected Automatically:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Usage Data:</strong> Pages visited, features used, time spent on platform, interaction patterns</li>
                    <li><strong>Device Information:</strong> IP address, browser type, operating system, device identifiers</li>
                    <li><strong>Cookies and Tracking:</strong> We use cookies and similar technologies to enhance your experience</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* 2 – How We Use Your Information */}
          <section className="group">
            <div className="flex items-start gap-4">
              <div className={numberBadge}>2</div>
              <div className="flex-1">
                <h2 className={`text-2xl font-bold mb-4 ${t1}`} style={{ fontFamily: 'Georgia, serif' }}>
                  How We Use Your Information
                </h2>
                <div className={`space-y-4 leading-relaxed ${t2}`}>
                  <p>We use the information we collect for the following purposes:</p>
                  <div className={`rounded-lg p-6 space-y-3 ${accentCard}`}>
                    <p><strong>✓ Service Delivery:</strong> Provide and maintain our educational platform, mentorship programs, and research insights</p>
                    <p><strong>✓ Personalization:</strong> Customize content and recommendations based on your interests and experience level</p>
                    <p><strong>✓ Communication:</strong> Send you updates, newsletters, educational content, and respond to inquiries</p>
                    <p><strong>✓ Payment Processing:</strong> Process subscriptions and handle billing matters</p>
                    <p><strong>✓ Platform Improvement:</strong> Analyze usage patterns to enhance features and user experience</p>
                    <p><strong>✓ Security:</strong> Detect and prevent fraud, abuse, and security incidents</p>
                    <p><strong>✓ Legal Compliance:</strong> Comply with applicable laws and regulations</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 3 – Information Sharing */}
          <section className="group">
            <div className="flex items-start gap-4">
              <div className={numberBadge}>3</div>
              <div className="flex-1">
                <h2 className={`text-2xl font-bold mb-4 ${t1}`} style={{ fontFamily: 'Georgia, serif' }}>
                  Information Sharing and Disclosure
                </h2>
                <div className={`space-y-4 leading-relaxed ${t2}`}>
                  <p>We respect your privacy and do not sell your personal information. We may share your information only in the following circumstances:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Service Providers:</strong> We work with trusted third-party providers who assist with payment processing, email delivery, analytics, and hosting services.</li>
                    <li><strong>Legal Requirements:</strong> We may disclose information when required by law, court order, or government request.</li>
                    <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred.</li>
                    <li><strong>With Your Consent:</strong> We may share your information with third parties when you explicitly consent.</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* 4 – Data Security */}
          <section className="group">
            <div className="flex items-start gap-4">
              <div className={numberBadge}>4</div>
              <div className="flex-1">
                <h2 className={`text-2xl font-bold mb-4 ${t1}`} style={{ fontFamily: 'Georgia, serif' }}>
                  Data Security
                </h2>
                <div className={`space-y-4 leading-relaxed ${t2}`}>
                  <p>We implement robust security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { icon: '🔒', title: 'Encryption', desc: 'SSL/TLS encryption for data transmission' },
                      { icon: '🛡️', title: 'Access Controls', desc: 'Restricted access to personal data' },
                      { icon: '🔐', title: 'Secure Storage', desc: 'Encrypted databases and secure servers' },
                      { icon: '👁️', title: 'Monitoring', desc: 'Regular security audits and monitoring' },
                    ].map(item => (
                      <div key={item.title} className={`rounded-lg p-5 ${innerCard}`}>
                        <div className={`font-semibold mb-2 ${t1}`}>{item.icon} {item.title}</div>
                        <p className="text-sm">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                  <p className={`border-l-4 border-amber-400/60 p-4 rounded-r mt-4 ${isLight ? 'bg-amber-50 text-amber-800' : 'bg-amber-500/10 text-white/70'}`}>
                    While we strive to protect your information, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security but are committed to maintaining the highest standards of data protection.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 5 – Your Privacy Rights */}
          <section className="group">
            <div className="flex items-start gap-4">
              <div className={numberBadge}>5</div>
              <div className="flex-1">
                <h2 className={`text-2xl font-bold mb-4 ${t1}`} style={{ fontFamily: 'Georgia, serif' }}>
                  Your Privacy Rights
                </h2>
                <div className={`space-y-4 leading-relaxed ${t2}`}>
                  <p>You have the following rights regarding your personal information:</p>
                  <div className="space-y-4">
                    {[
                      { title: 'Right to Access', desc: 'Request a copy of the personal information we hold about you' },
                      { title: 'Right to Correction', desc: 'Request correction of inaccurate or incomplete information' },
                      { title: 'Right to Deletion', desc: 'Request deletion of your personal information, subject to certain exceptions' },
                      { title: 'Right to Opt-Out', desc: 'Unsubscribe from marketing communications at any time' },
                      { title: 'Right to Data Portability', desc: 'Request your data in a structured, commonly used format' },
                    ].map(item => (
                      <div key={item.title} className={`rounded-lg p-5 border-l-4 border-[#5194F6] ${isLight ? 'bg-blue-50' : 'bg-white/5'}`}>
                        <h3 className={`font-semibold mb-2 ${t1}`}>{item.title}</h3>
                        <p className="text-sm">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                  <p className="mt-6">To exercise any of these rights, please contact us at privacy@investbeans.com. We will respond within 30 days.</p>
                </div>
              </div>
            </div>
          </section>

          {/* 6 – Cookies */}
          <section className="group">
            <div className="flex items-start gap-4">
              <div className={numberBadge}>6</div>
              <div className="flex-1">
                <h2 className={`text-2xl font-bold mb-4 ${t1}`} style={{ fontFamily: 'Georgia, serif' }}>
                  Cookies and Tracking Technologies
                </h2>
                <div className={`space-y-4 leading-relaxed ${t2}`}>
                  <p>We use cookies and similar tracking technologies to enhance your experience on InvestBeans.</p>
                  <p className={`font-semibold ${t1}`}>Types of cookies we use:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Essential Cookies:</strong> Required for basic platform functionality and security</li>
                    <li><strong>Performance Cookies:</strong> Help us understand how visitors interact with our platform</li>
                    <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
                    <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements (with your consent)</li>
                  </ul>
                  <p>You can control cookies through your browser settings. However, disabling certain cookies may affect some features.</p>
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
                  <p>We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this Privacy Policy.</p>
                  <p>Typical retention periods include account information for the duration of your active subscription plus 7 years for financial records, and usage data for up to 2 years.</p>
                </div>
              </div>
            </div>
          </section>

          {/* 8 – Children's Privacy */}
          <section className="group">
            <div className="flex items-start gap-4">
              <div className={numberBadge}>8</div>
              <div className="flex-1">
                <h2 className={`text-2xl font-bold mb-4 ${t1}`} style={{ fontFamily: 'Georgia, serif' }}>
                  Children's Privacy
                </h2>
                <div className={`space-y-4 leading-relaxed ${t2}`}>
                  <p className={`border-l-4 border-red-500 p-4 rounded-r ${isLight ? 'bg-red-50 text-red-800' : 'bg-red-500/10 text-white/70'}`}>
                    InvestBeans is not intended for users under the age of 18. We do not knowingly collect personal information from children. If we become aware that we have collected information from a child under 18, we will delete that information promptly.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 9 – International Transfers */}
          <section className="group">
            <div className="flex items-start gap-4">
              <div className={numberBadge}>9</div>
              <div className="flex-1">
                <h2 className={`text-2xl font-bold mb-4 ${t1}`} style={{ fontFamily: 'Georgia, serif' }}>
                  International Data Transfers
                </h2>
                <div className={`space-y-4 leading-relaxed ${t2}`}>
                  <p>Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place in accordance with applicable data protection laws.</p>
                </div>
              </div>
            </div>
          </section>

          {/* 10 – Policy Changes */}
          <section className="group">
            <div className="flex items-start gap-4">
              <div className={numberBadge}>10</div>
              <div className="flex-1">
                <h2 className={`text-2xl font-bold mb-4 ${t1}`} style={{ fontFamily: 'Georgia, serif' }}>
                  Changes to This Privacy Policy
                </h2>
                <div className={`space-y-4 leading-relaxed ${t2}`}>
                  <p>We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes by posting the updated policy and updating the "Last Updated" date.</p>
                </div>
              </div>
            </div>
          </section>

          {/* 11 – Contact */}
          <section className="group">
            <div className="flex items-start gap-4">
              <div className={numberBadge}>11</div>
              <div className="flex-1">
                <h2 className={`text-2xl font-bold mb-4 ${t1}`} style={{ fontFamily: 'Georgia, serif' }}>
                  Contact Us
                </h2>
                <div className={`space-y-4 leading-relaxed ${t2}`}>
                  <p>If you have questions or concerns about this Privacy Policy or our data practices, please contact us:</p>
                  <div className="bg-gradient-to-r from-[#5194F6] to-[#3a7de0] rounded-lg p-6 text-white">
                    <p className="font-semibold mb-3">InvestBeans Privacy Team</p>
                    <p className="mb-2">📧 Email: privacy@investbeans.com</p>
                    <p className="mb-2">📞 Phone: +91 [Your Phone Number]</p>
                    <p>💬 Support: support@investbeans.com</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer Notice */}
        <div className={`mt-16 p-6 rounded-xl border border-[#5194F6]/25 ${isLight ? 'bg-blue-50' : 'bg-white/5'}`}>
          <p className={`text-sm leading-relaxed ${t2}`}>
            <strong className="text-[#5194F6]">Your Trust Matters:</strong> At InvestBeans, we are committed to protecting
            your privacy and handling your data responsibly. We believe in transparency and will always be clear about how
            we use your information. If you have any questions, we're here to help.
          </p>
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