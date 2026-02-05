import React from 'react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Georgia, serif' }}>
                InvestBeans
              </h1>
              <p className="text-sm text-slate-600 mt-1">People-powered learning for thoughtful traders</p>
            </div>
            <a 
              href="/" 
              className="text-sm text-blue-600 hover:text-blue-700 transition-colors font-medium"
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
          <h1 className="text-5xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'Georgia, serif' }}>
            Terms of Service
          </h1>
          <p className="text-lg text-slate-600">
            Last Updated: February 5, 2026
          </p>
          <div className="mt-6 h-1 w-24 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
        </div>

        {/* Introduction */}
        <section className="mb-12 bg-white rounded-xl p-8 shadow-sm border border-slate-100">
          <p className="text-lg text-slate-700 leading-relaxed">
            Welcome to InvestBeans. By accessing or using our platform, you agree to be bound by these Terms of Service. 
            Please read them carefully. These terms govern your use of our educational services, research insights, and 
            mentorship programs designed to help you navigate financial markets with clarity and conviction.
          </p>
        </section>

        {/* Terms Sections */}
        <div className="space-y-10">
          {/* Section 1 */}
          <section className="group">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                1
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                  Acceptance of Terms
                </h2>
                <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-4">
                  <p>
                    By creating an account, accessing our content, or using any of our services, you acknowledge that you 
                    have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy.
                  </p>
                  <p>
                    If you do not agree with any part of these terms, you must not use our services. We reserve the right 
                    to modify these terms at any time, and your continued use of InvestBeans constitutes acceptance of 
                    those changes.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section className="group">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                2
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                  Educational Services
                </h2>
                <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-4">
                  <p>
                    InvestBeans provides educational content, research insights, and mentorship programs related to trading 
                    and investing in national and international markets. Our services are designed for educational purposes only.
                  </p>
                  <p className="font-semibold text-slate-900 bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r">
                    <strong>Important Disclaimer:</strong> We do not provide financial advice, investment recommendations, 
                    or guarantees of returns. All content is for informational and educational purposes. You are solely 
                    responsible for your investment decisions.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="group">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                3
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                  User Responsibilities
                </h2>
                <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-4">
                  <p>As a user of InvestBeans, you agree to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Provide accurate and complete information during registration</li>
                    <li>Maintain the confidentiality of your account credentials</li>
                    <li>Use our services in compliance with all applicable laws and regulations</li>
                    <li>Not share your account access with others</li>
                    <li>Conduct your own due diligence before making any investment decisions</li>
                    <li>Not use our platform for any illegal or unauthorized purposes</li>
                    <li>Respect intellectual property rights of all content provided</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="group">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                4
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                  Risk Disclosure
                </h2>
                <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-4">
                  <p className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r">
                    <strong>Trading and investing in financial markets carries significant risk.</strong> Past performance 
                    does not guarantee future results. You may lose some or all of your invested capital. Never invest money 
                    you cannot afford to lose.
                  </p>
                  <p>
                    InvestBeans does not guarantee any specific outcomes from using our educational materials or mentorship 
                    programs. Market conditions are unpredictable, and all investments carry inherent risks.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section className="group">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                5
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                  Intellectual Property
                </h2>
                <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-4">
                  <p>
                    All content on InvestBeans, including but not limited to text, graphics, logos, videos, research reports, 
                    and software, is the property of InvestBeans or its content suppliers and is protected by copyright, 
                    trademark, and other intellectual property laws.
                  </p>
                  <p>
                    You may access and use our content for personal, non-commercial educational purposes only. You may not 
                    reproduce, distribute, modify, or create derivative works without our express written permission.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 6 */}
          <section className="group">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                6
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                  Payment and Subscriptions
                </h2>
                <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-4">
                  <p>
                    Certain services on InvestBeans may require payment. By subscribing to paid services, you agree to pay 
                    all applicable fees and charges. Subscription fees are billed in advance and are non-refundable except 
                    as required by law or as explicitly stated in our refund policy.
                  </p>
                  <p>
                    You may cancel your subscription at any time, but you will continue to have access until the end of 
                    your current billing period. No refunds will be provided for partial subscription periods.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 7 */}
          <section className="group">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                7
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                  Limitation of Liability
                </h2>
                <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-4">
                  <p>
                    To the maximum extent permitted by law, InvestBeans and its directors, employees, partners, and affiliates 
                    shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including 
                    loss of profits, data, or other intangible losses resulting from:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Your use or inability to use our services</li>
                    <li>Any investment decisions made based on our educational content</li>
                    <li>Unauthorized access to or alteration of your data</li>
                    <li>Any other matter relating to our services</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Section 8 */}
          <section className="group">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                8
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                  Termination
                </h2>
                <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-4">
                  <p>
                    We reserve the right to suspend or terminate your access to InvestBeans at any time, without notice, 
                    for conduct that we believe violates these Terms of Service, is harmful to other users, or is otherwise 
                    objectionable.
                  </p>
                  <p>
                    Upon termination, your right to use our services will immediately cease. All provisions of these Terms 
                    which by their nature should survive termination shall survive, including ownership provisions, warranty 
                    disclaimers, and limitations of liability.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 9 */}
          <section className="group">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                9
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                  Governing Law
                </h2>
                <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-4">
                  <p>
                    These Terms of Service shall be governed by and construed in accordance with the laws of India, without 
                    regard to its conflict of law provisions. Any disputes arising from these terms shall be subject to the 
                    exclusive jurisdiction of the courts in [Your City, State].
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 10 */}
          <section className="group">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                10
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                  Contact Information
                </h2>
                <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-4">
                  <p>
                    If you have any questions about these Terms of Service, please contact us at:
                  </p>
                  <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                    <p className="font-semibold text-slate-900 mb-2">InvestBeans</p>
                    <p className="text-slate-700">Email: legal@investbeans.com</p>
                    <p className="text-slate-700">Support: support@investbeans.com</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer Notice */}
        <div className="mt-16 p-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-white">
          <p className="text-sm leading-relaxed">
            By using InvestBeans, you acknowledge that you have read, understood, and agree to be bound by these Terms 
            of Service. We recommend printing or saving a copy of these terms for your records.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white mt-24">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-600">
              © 2026 InvestBeans. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="/privacy-policy" className="text-slate-600 hover:text-blue-600 transition-colors">
                Privacy Policy
              </a>
              <a href="/help-center" className="text-slate-600 hover:text-blue-600 transition-colors">
                Help Center
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}