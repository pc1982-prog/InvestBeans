import React, { useState } from 'react';

export default function HelpCenter() {
  const [activeCategory, setActiveCategory] = useState('getting-started');
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const categories = [
    { id: 'getting-started', name: 'Getting Started', icon: '🚀' },
    { id: 'account', name: 'Account & Billing', icon: '💳' },
    { id: 'learning', name: 'Learning & Content', icon: '📚' },
    { id: 'trading', name: 'Trading & Markets', icon: '📈' },
    { id: 'technical', name: 'Technical Support', icon: '⚙️' },
    { id: 'security', name: 'Security & Privacy', icon: '🔒' },
  ];

  const faqs = {
    'getting-started': [
      {
        id: 'gs1',
        question: 'What is InvestBeans and how does it work?',
        answer: 'InvestBeans is a people-powered learning platform for thoughtful traders and investors. We blend research-driven insights, ethical practices, and human mentorship to help you navigate both national and international markets with clarity, calm, and conviction. Our platform offers structured courses, live mentorship sessions, market analysis, and a supportive community of learners.'
      },
      {
        id: 'gs2',
        question: 'How do I create an account?',
        answer: 'Creating an account is simple! Click the "Sign Up" button in the top right corner of our homepage. Enter your name, email address, and create a secure password. You\'ll receive a verification email to confirm your account. Once verified, you can start exploring our free content and consider upgrading to access premium features and mentorship programs.'
      },
      {
        id: 'gs3',
        question: 'What knowledge level do I need to join?',
        answer: 'InvestBeans welcomes learners at all levels! Whether you\'re a complete beginner with no trading experience or an intermediate investor looking to refine your strategies, we have content tailored for you. Our courses start with fundamentals and progressively advance to more complex topics. We recommend starting with our "Investing Basics" module if you\'re new to markets.'
      },
      {
        id: 'gs4',
        question: 'What markets do you cover?',
        answer: 'We provide comprehensive education on both national (Indian) and international markets. This includes equity markets (stocks), derivatives (futures and options), commodities, currencies (forex), and global indices. Our content covers market fundamentals, technical and fundamental analysis, risk management, and trading psychology applicable across all these markets.'
      },
    ],
    'account': [
      {
        id: 'acc1',
        question: 'What subscription plans do you offer?',
        answer: 'We offer three subscription tiers: Free (access to basic content and community), Premium (₹2,999/month - includes all courses, weekly market insights, and community access), and Pro (₹4,999/month - everything in Premium plus 1-on-1 mentorship sessions, portfolio reviews, and priority support). Annual plans are available with a 20% discount.'
      },
      {
        id: 'acc2',
        question: 'How do I upgrade or downgrade my subscription?',
        answer: 'To manage your subscription, log into your account and go to Settings > Subscription. From there, you can upgrade to a higher tier (effective immediately) or downgrade (effective at the end of your current billing cycle). If you upgrade mid-cycle, you\'ll only pay the prorated difference for the remaining period.'
      },
      {
        id: 'acc3',
        question: 'What is your refund policy?',
        answer: 'We offer a 7-day money-back guarantee on all paid subscriptions. If you\'re not satisfied within the first 7 days of your subscription, contact our support team for a full refund. After 7 days, subscriptions are non-refundable, but you can cancel at any time to prevent future charges.'
      },
      {
        id: 'acc4',
        question: 'Can I share my account with others?',
        answer: 'Each subscription is for individual use only and tied to a single user account. Account sharing violates our Terms of Service and may result in suspension. However, we do offer family and team plans at discounted rates if you\'d like to provide access to multiple people in your household or organization.'
      },
    ],
    'learning': [
      {
        id: 'learn1',
        question: 'How are your courses structured?',
        answer: 'Our courses follow a progressive learning path with video lessons, reading materials, practical exercises, and quizzes. Each course is divided into modules covering specific topics. You can learn at your own pace, and all content remains accessible as long as your subscription is active. Most courses include downloadable resources and templates you can use in your own trading.'
      },
      {
        id: 'learn2',
        question: 'Do I get certificates upon course completion?',
        answer: 'Yes! Upon completing any course with a passing score on the final assessment, you\'ll receive a digital certificate of completion. This certificate includes your name, course title, completion date, and a unique verification code. You can share these certificates on LinkedIn or include them in your resume.'
      },
      {
        id: 'learn3',
        question: 'How do mentorship sessions work?',
        answer: 'Pro subscribers get access to 1-on-1 mentorship sessions with our experienced trading mentors. You can book sessions through your dashboard based on mentor availability. Sessions are typically 45-60 minutes via video call and can cover portfolio review, trading strategy, risk management, or any specific questions you have. We recommend preparing questions in advance to maximize the value.'
      },
      {
        id: 'learn4',
        question: 'Are your market insights and recommendations guaranteed to be profitable?',
        answer: 'NO. This is extremely important to understand: InvestBeans provides educational content only. We do NOT provide guaranteed returns or specific buy/sell recommendations. All market insights and analysis are for educational purposes to help you develop your own analytical skills. Past performance does not guarantee future results. All investment decisions are solely your responsibility.'
      },
    ],
    'trading': [
      {
        id: 'trade1',
        question: 'Do you provide stock tips or trading signals?',
        answer: 'No, we do not provide stock tips or trading signals. InvestBeans is an educational platform focused on teaching you the skills and knowledge to make informed decisions independently. We teach you analysis methods, risk management principles, and trading psychology so you can develop your own strategy and make your own decisions based on your research.'
      },
      {
        id: 'trade2',
        question: 'How do I open a trading account?',
        answer: 'InvestBeans is an educational platform and does not provide trading accounts. To start trading, you\'ll need to open an account with a registered stockbroker (like Zerodha, Upstox, ICICI Direct, etc. in India, or Interactive Brokers, TD Ameritrade for international markets). We provide guidance on how to choose a broker and what to look for, but you\'ll need to complete the account opening process with your chosen broker.'
      },
      {
        id: 'trade3',
        question: 'What is your approach to risk management?',
        answer: 'Risk management is a core focus at InvestBeans. We teach systematic position sizing, stop-loss strategies, portfolio diversification, and the importance of never risking more than you can afford to lose. Our courses emphasize that protecting capital is more important than making profits. We encourage paper trading (simulation) before risking real money, especially for beginners.'
      },
      {
        id: 'trade4',
        question: 'Can you help me with tax implications of trading?',
        answer: 'While we provide general educational content on tax considerations for traders (like short-term vs long-term capital gains, TDS, etc.), we are not tax advisors. Tax laws are complex and vary based on individual circumstances. We strongly recommend consulting with a qualified chartered accountant or tax professional for personalized advice regarding your specific tax situation.'
      },
    ],
    'technical': [
      {
        id: 'tech1',
        question: 'What devices and browsers are supported?',
        answer: 'InvestBeans works on all modern devices including desktop computers (Windows, Mac, Linux), tablets, and smartphones (iOS and Android). We recommend using the latest versions of Chrome, Firefox, Safari, or Edge browsers for the best experience. Our platform is fully responsive and optimized for mobile learning.'
      },
      {
        id: 'tech2',
        question: 'I\'m having trouble accessing video content. What should I do?',
        answer: 'If videos aren\'t playing, first try refreshing the page and clearing your browser cache. Ensure you have a stable internet connection (we recommend at least 5 Mbps for HD video). Check if your browser allows autoplay and has the latest updates installed. If problems persist, try a different browser or device. You can also download videos for offline viewing (available for Premium and Pro members).'
      },
      {
        id: 'tech3',
        question: 'Can I download course materials for offline access?',
        answer: 'Yes! Premium and Pro subscribers can download video lessons, PDF resources, and worksheets for offline access through our mobile app. Simply tap the download icon next to any content. Downloaded content remains accessible offline but requires periodic connection to verify your active subscription.'
      },
      {
        id: 'tech4',
        question: 'How do I reset my password?',
        answer: 'Click "Forgot Password" on the login page. Enter your registered email address, and we\'ll send you a password reset link. The link is valid for 24 hours. If you don\'t receive the email within a few minutes, check your spam folder. For security reasons, we cannot reset passwords via phone or chat - you must have access to your registered email address.'
      },
    ],
    'security': [
      {
        id: 'sec1',
        question: 'How is my personal information protected?',
        answer: 'We take security seriously. All data transmission is encrypted using SSL/TLS protocols. Your passwords are hashed and never stored in plain text. We use secure servers with regular security audits and backups. Payment information is processed through PCI-compliant payment gateways and never stored on our servers. See our Privacy Policy for complete details on data protection.'
      },
      {
        id: 'sec2',
        question: 'Do you sell my data to third parties?',
        answer: 'Absolutely not. We never sell, rent, or trade your personal information to third parties for marketing purposes. We only share data with trusted service providers who help us operate the platform (like payment processors and email services), and they are bound by strict confidentiality agreements. Your privacy is paramount to us.'
      },
      {
        id: 'sec3',
        question: 'Can I delete my account and data?',
        answer: 'Yes, you have the right to delete your account at any time. Go to Settings > Account > Delete Account. This will permanently remove your personal information from our active databases (though we may retain some data for legal or regulatory requirements for up to 7 years). Please note that account deletion is irreversible and you\'ll lose access to all content, certifications, and purchase history.'
      },
      {
        id: 'sec4',
        question: 'How do I enable two-factor authentication?',
        answer: 'We highly recommend enabling two-factor authentication (2FA) for added security. Go to Settings > Security > Two-Factor Authentication. You can choose SMS-based or app-based (Google Authenticator, Authy) 2FA. Once enabled, you\'ll need to enter a code from your phone in addition to your password when logging in.'
      },
    ],
  };

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50/30 to-cyan-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Georgia, serif' }}>
                InvestBeans Help Center
              </h1>
              <p className="text-sm text-slate-600 mt-1">We're here to help you succeed</p>
            </div>
            <a 
              href="/" 
              className="text-sm text-teal-600 hover:text-teal-700 transition-colors font-medium"
            >
              ← Back to Home
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-6" style={{ fontFamily: 'Georgia, serif' }}>
            How can we help you today?
          </h1>
          <p className="text-xl text-teal-50 mb-8">
            Search our knowledge base or browse categories below
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 pr-12 rounded-xl text-slate-900 text-lg border-2 border-white/20 focus:border-white focus:outline-none shadow-lg"
            />
            <svg 
              className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Quick Actions */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-6" style={{ fontFamily: 'Georgia, serif' }}>
            Quick Actions
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow cursor-pointer">
              <div className="text-4xl mb-3">📧</div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Email Support</h3>
              <p className="text-slate-600 text-sm mb-4">Get help via email within 24 hours</p>
              <a href="mailto:support@investbeans.com" className="text-teal-600 hover:text-teal-700 font-medium text-sm">
                support@investbeans.com →
              </a>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow cursor-pointer">
              <div className="text-4xl mb-3">💬</div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Live Chat</h3>
              <p className="text-slate-600 text-sm mb-4">Chat with us (Mon-Fri, 9 AM - 6 PM IST)</p>
              <button className="text-teal-600 hover:text-teal-700 font-medium text-sm">
                Start Chat →
              </button>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow cursor-pointer">
              <div className="text-4xl mb-3">👥</div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Community Forum</h3>
              <p className="text-slate-600 text-sm mb-4">Ask questions and learn from peers</p>
              <a href="/community" className="text-teal-600 hover:text-teal-700 font-medium text-sm">
                Visit Forum →
              </a>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6" style={{ fontFamily: 'Georgia, serif' }}>
            Browse by Category
          </h2>
          <div className="flex flex-wrap gap-3 mb-8">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-5 py-3 rounded-lg font-medium transition-all ${
                  activeCategory === category.id
                    ? 'bg-teal-600 text-white shadow-lg scale-105'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>

          {/* FAQs for Selected Category */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <h3 className="text-xl font-bold text-slate-900 mb-6">
              {categories.find(c => c.id === activeCategory)?.name} FAQs
            </h3>
            <div className="space-y-4">
              {faqs[activeCategory as keyof typeof faqs].map((faq) => (
                <div key={faq.id} className="border-b border-slate-200 last:border-0">
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full text-left py-4 flex items-center justify-between hover:text-teal-600 transition-colors group"
                  >
                    <span className="font-semibold text-slate-900 group-hover:text-teal-600 pr-4">
                      {faq.question}
                    </span>
                    <svg
                      className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform ${
                        openFaq === faq.id ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openFaq === faq.id && (
                    <div className="pb-6 text-slate-700 leading-relaxed animate-fadeIn">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="bg-gradient-to-r from-teal-600 to-emerald-600 rounded-2xl p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Georgia, serif' }}>
            Still need help?
          </h2>
          <p className="text-xl text-teal-50 mb-8 max-w-2xl mx-auto">
            Can't find what you're looking for? Our support team is ready to assist you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="mailto:support@investbeans.com"
              className="px-8 py-4 bg-white text-teal-600 font-bold rounded-lg hover:bg-teal-50 transition-colors shadow-lg"
            >
              Email Us
            </a>
            <button className="px-8 py-4 bg-teal-700 text-white font-bold rounded-lg hover:bg-teal-800 transition-colors border-2 border-white/20">
              Schedule a Call
            </button>
          </div>
          <div className="mt-8 pt-8 border-t border-white/20">
            <p className="text-teal-100 mb-2">
              <strong>Support Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM IST
            </p>
            <p className="text-teal-100">
              <strong>Average Response Time:</strong> 6-12 hours
            </p>
          </div>
        </section>

        {/* Additional Resources */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-6" style={{ fontFamily: 'Georgia, serif' }}>
            Additional Resources
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center">
                <span className="text-2xl mr-3">📖</span>
                Video Tutorials
              </h3>
              <p className="text-slate-600 mb-4">
                Watch step-by-step guides on using InvestBeans features and getting started with trading education.
              </p>
              <a href="/tutorials" className="text-teal-600 hover:text-teal-700 font-medium">
                Watch Tutorials →
              </a>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center">
                <span className="text-2xl mr-3">📝</span>
                Blog & Articles
              </h3>
              <p className="text-slate-600 mb-4">
                Read insights, tips, and educational content from our team of experienced traders and mentors.
              </p>
              <a href="/blogs" className="text-teal-600 hover:text-teal-700 font-medium">
                Read Blog →
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white mt-24">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-600">
              © 2026 InvestBeans. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="/terms-of-service" className="text-slate-600 hover:text-teal-600 transition-colors">
                Terms of Service
              </a>
              <a href="/privacy-policy" className="text-slate-600 hover:text-teal-600 transition-colors">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}