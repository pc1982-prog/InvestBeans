import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-950/95 text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-slate-950/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Georgia, serif' }}>
                InvestBeans
              </h1>
              <p className="text-sm text-white/50 mt-1">Your privacy matters to us</p>
            </div>
            <a 
              href="/" 
              className="text-sm text-[#5194F6] hover:text-[#7ab8fa] transition-colors font-medium"
            >
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
            <svg 
              className="w-12 h-12 text-[#5194F6]" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
              />
            </svg>
            <h1 className="text-5xl font-bold text-white" style={{ fontFamily: 'Georgia, serif' }}>
              Privacy Policy
            </h1>
          </div>
          <p className="text-lg text-white/50">
            Last Updated: February 5, 2026
          </p>
          <div className="mt-6 h-1 w-24 bg-gradient-to-r from-[#5194F6] to-[#3a7de0] rounded-full"></div>
        </div>

        {/* Introduction */}
        <section className="mb-12 rounded-xl p-8 border border-white/10 bg-white/5 backdrop-blur-sm">
          <p className="text-lg text-white/70 leading-relaxed">
            At InvestBeans, we are committed to protecting your privacy and ensuring the security of your personal information. 
            This Privacy Policy explains how we collect, use, disclose, and safeguard your data when you use our platform. 
            We believe in transparency and want you to understand your rights and our practices.
          </p>
        </section>

        {/* Privacy Sections */}
        <div className="space-y-10">
          {/* Section 1 */}
          <section className="group">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[#5194F6]/15 flex items-center justify-center text-[#5194F6] font-bold text-xl group-hover:bg-[#5194F6] group-hover:text-white transition-colors duration-300">
                1
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                  Information We Collect
                </h2>
                <div className="prose prose-invert max-w-none text-white/70 leading-relaxed space-y-4">
                  <p className="font-semibold text-white">Personal Information You Provide:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Account Information:</strong> Name, email address, phone number, username, and password</li>
                    <li><strong>Profile Information:</strong> Investment experience level, trading preferences, financial goals</li>
                    <li><strong>Payment Information:</strong> Billing details, payment method information (processed securely through third-party payment processors)</li>
                    <li><strong>Communication Data:</strong> Messages sent through our platform, feedback, and support inquiries</li>
                  </ul>
                  
                  <p className="font-semibold text-white mt-6">Information Collected Automatically:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Usage Data:</strong> Pages visited, features used, time spent on platform, interaction patterns</li>
                    <li><strong>Device Information:</strong> IP address, browser type, operating system, device identifiers</li>
                    <li><strong>Cookies and Tracking:</strong> We use cookies and similar technologies to enhance your experience</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section className="group">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[#5194F6]/15 flex items-center justify-center text-[#5194F6] font-bold text-xl group-hover:bg-[#5194F6] group-hover:text-white transition-colors duration-300">
                2
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                  How We Use Your Information
                </h2>
                <div className="prose prose-invert max-w-none text-white/70 leading-relaxed space-y-4">
                  <p>We use the information we collect for the following purposes:</p>
                  
                  <div className="bg-[#5194F6]/08 rounded-lg p-6 border-l-4 border-[#5194F6] space-y-3">
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

          {/* Section 3 */}
          <section className="group">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[#5194F6]/15 flex items-center justify-center text-[#5194F6] font-bold text-xl group-hover:bg-[#5194F6] group-hover:text-white transition-colors duration-300">
                3
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                  Information Sharing and Disclosure
                </h2>
                <div className="prose prose-invert max-w-none text-white/70 leading-relaxed space-y-4">
                  <p>
                    We respect your privacy and do not sell your personal information. We may share your information only 
                    in the following circumstances:
                  </p>
                  
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>Service Providers:</strong> We work with trusted third-party providers who assist with payment 
                      processing, email delivery, analytics, and hosting services. These providers are bound by confidentiality 
                      agreements and can only use your information to perform services on our behalf.
                    </li>
                    <li>
                      <strong>Legal Requirements:</strong> We may disclose information when required by law, court order, or 
                      government request, or to protect the rights, property, or safety of InvestBeans, our users, or others.
                    </li>
                    <li>
                      <strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your 
                      information may be transferred as part of that transaction.
                    </li>
                    <li>
                      <strong>With Your Consent:</strong> We may share your information with third parties when you explicitly 
                      consent to such sharing.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="group">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[#5194F6]/15 flex items-center justify-center text-[#5194F6] font-bold text-xl group-hover:bg-[#5194F6] group-hover:text-white transition-colors duration-300">
                4
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                  Data Security
                </h2>
                <div className="prose prose-invert max-w-none text-white/70 leading-relaxed space-y-4">
                  <p>
                    We implement robust security measures to protect your personal information from unauthorized access, 
                    alteration, disclosure, or destruction. Our security practices include:
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-lg p-5 border border-white/10">
                      <div className="font-semibold text-white mb-2">🔒 Encryption</div>
                      <p className="text-sm">SSL/TLS encryption for data transmission</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-5 border border-white/10">
                      <div className="font-semibold text-white mb-2">🛡️ Access Controls</div>
                      <p className="text-sm">Restricted access to personal data</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-5 border border-white/10">
                      <div className="font-semibold text-white mb-2">🔐 Secure Storage</div>
                      <p className="text-sm">Encrypted databases and secure servers</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-5 border border-white/10">
                      <div className="font-semibold text-white mb-2">👁️ Monitoring</div>
                      <p className="text-sm">Regular security audits and monitoring</p>
                    </div>
                  </div>
                  
                  <p className="bg-amber-500/10 border-l-4 border-amber-400/60 p-4 rounded-r mt-4 text-white/70">
                    While we strive to protect your information, no method of transmission over the internet or electronic 
                    storage is 100% secure. We cannot guarantee absolute security but are committed to maintaining the highest 
                    standards of data protection.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section className="group">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[#5194F6]/15 flex items-center justify-center text-[#5194F6] font-bold text-xl group-hover:bg-[#5194F6] group-hover:text-white transition-colors duration-300">
                5
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                  Your Privacy Rights
                </h2>
                <div className="prose prose-invert max-w-none text-white/70 leading-relaxed space-y-4">
                  <p>You have the following rights regarding your personal information:</p>
                  
                  <div className="space-y-4">
                    <div className="bg-white/5 rounded-lg p-5 border-l-4 border-[#5194F6]">
                      <h3 className="font-semibold text-white mb-2">Right to Access</h3>
                      <p className="text-sm">Request a copy of the personal information we hold about you</p>
                    </div>
                    
                    <div className="bg-white/5 rounded-lg p-5 border-l-4 border-[#5194F6]">
                      <h3 className="font-semibold text-white mb-2">Right to Correction</h3>
                      <p className="text-sm">Request correction of inaccurate or incomplete information</p>
                    </div>
                    
                    <div className="bg-white/5 rounded-lg p-5 border-l-4 border-[#5194F6]">
                      <h3 className="font-semibold text-white mb-2">Right to Deletion</h3>
                      <p className="text-sm">Request deletion of your personal information, subject to certain exceptions</p>
                    </div>
                    
                    <div className="bg-white/5 rounded-lg p-5 border-l-4 border-[#5194F6]">
                      <h3 className="font-semibold text-white mb-2">Right to Opt-Out</h3>
                      <p className="text-sm">Unsubscribe from marketing communications at any time</p>
                    </div>
                    
                    <div className="bg-white/5 rounded-lg p-5 border-l-4 border-[#5194F6]">
                      <h3 className="font-semibold text-white mb-2">Right to Data Portability</h3>
                      <p className="text-sm">Request your data in a structured, commonly used format</p>
                    </div>
                  </div>
                  
                  <p className="mt-6">
                    To exercise any of these rights, please contact us at privacy@investbeans.com. We will respond to your 
                    request within 30 days.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 6 */}
          <section className="group">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[#5194F6]/15 flex items-center justify-center text-[#5194F6] font-bold text-xl group-hover:bg-[#5194F6] group-hover:text-white transition-colors duration-300">
                6
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                  Cookies and Tracking Technologies
                </h2>
                <div className="prose prose-invert max-w-none text-white/70 leading-relaxed space-y-4">
                  <p>
                    We use cookies and similar tracking technologies to enhance your experience on InvestBeans. Cookies are 
                    small text files stored on your device that help us remember your preferences and understand how you use 
                    our platform.
                  </p>
                  
                  <p className="font-semibold text-white">Types of cookies we use:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Essential Cookies:</strong> Required for basic platform functionality and security</li>
                    <li><strong>Performance Cookies:</strong> Help us understand how visitors interact with our platform</li>
                    <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
                    <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements (with your consent)</li>
                  </ul>
                  
                  <p>
                    You can control cookies through your browser settings. However, disabling certain cookies may affect your 
                    ability to use some features of our platform.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 7 */}
          <section className="group">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[#5194F6]/15 flex items-center justify-center text-[#5194F6] font-bold text-xl group-hover:bg-[#5194F6] group-hover:text-white transition-colors duration-300">
                7
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                  Data Retention
                </h2>
                <div className="prose prose-invert max-w-none text-white/70 leading-relaxed space-y-4">
                  <p>
                    We retain your personal information for as long as necessary to provide our services and fulfill the purposes 
                    outlined in this Privacy Policy. When you close your account, we will delete or anonymize your information, 
                    except where we are required to retain it for legal, regulatory, or legitimate business purposes.
                  </p>
                  <p>
                    Typical retention periods include account information for the duration of your active subscription plus 7 years 
                    for financial records, and usage data for up to 2 years for analytics purposes.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 8 */}
          <section className="group">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[#5194F6]/15 flex items-center justify-center text-[#5194F6] font-bold text-xl group-hover:bg-[#5194F6] group-hover:text-white transition-colors duration-300">
                8
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                  Children's Privacy
                </h2>
                <div className="prose prose-invert max-w-none text-white/70 leading-relaxed space-y-4">
                  <p className="bg-red-500/10 border-l-4 border-red-500/60 p-4 rounded-r text-white/70">
                    InvestBeans is not intended for users under the age of 18. We do not knowingly collect personal information 
                    from children. If we become aware that we have inadvertently collected information from a child under 18, 
                    we will take steps to delete that information promptly.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 9 */}
          <section className="group">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[#5194F6]/15 flex items-center justify-center text-[#5194F6] font-bold text-xl group-hover:bg-[#5194F6] group-hover:text-white transition-colors duration-300">
                9
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                  International Data Transfers
                </h2>
                <div className="prose prose-invert max-w-none text-white/70 leading-relaxed space-y-4">
                  <p>
                    Your information may be transferred to and processed in countries other than your country of residence. 
                    We ensure that appropriate safeguards are in place to protect your information in accordance with this 
                    Privacy Policy and applicable data protection laws.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 10 */}
          <section className="group">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[#5194F6]/15 flex items-center justify-center text-[#5194F6] font-bold text-xl group-hover:bg-[#5194F6] group-hover:text-white transition-colors duration-300">
                10
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                  Changes to This Privacy Policy
                </h2>
                <div className="prose prose-invert max-w-none text-white/70 leading-relaxed space-y-4">
                  <p>
                    We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. 
                    We will notify you of any material changes by posting the updated policy on our platform and updating the 
                    "Last Updated" date. Your continued use of InvestBeans after such changes constitutes acceptance of the 
                    updated Privacy Policy.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section className="group">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[#5194F6]/15 flex items-center justify-center text-[#5194F6] font-bold text-xl group-hover:bg-[#5194F6] group-hover:text-white transition-colors duration-300">
                11
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                  Contact Us
                </h2>
                <div className="prose prose-invert max-w-none text-white/70 leading-relaxed space-y-4">
                  <p>
                    If you have questions or concerns about this Privacy Policy or our data practices, please contact us:
                  </p>
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
        <div className="mt-16 p-6 rounded-xl border border-[#5194F6]/25 bg-white/5">
          <p className="text-sm text-white/70 leading-relaxed">
            <strong className="text-[#5194F6]">Your Trust Matters:</strong> At InvestBeans, we are committed to protecting 
            your privacy and handling your data responsibly. We believe in transparency and will always be clear about how 
            we use your information. If you have any questions, we're here to help.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-slate-950/90 mt-24">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-600">
              © 2026 InvestBeans. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="/terms-of-service" className="text-white/50 hover:text-[#5194F6] transition-colors">
                Terms of Service
              </a>
              <a href="/help-center" className="text-white/50 hover:text-[#5194F6] transition-colors">
                Help Center
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}