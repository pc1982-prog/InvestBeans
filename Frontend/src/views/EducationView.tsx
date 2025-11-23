import React from 'react';
import Layout from '@/components/Layout';

const EducationView = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-navy mb-4">Education Center</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Master the fundamentals of investing with our comprehensive educational resources, courses, and expert insights.
            </p>
          </div>

          {/* Featured Courses */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-navy mb-8">Featured Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-navy mb-2">Investment Fundamentals</h3>
                  <p className="text-gray-600 mb-4">Learn the basics of investing, risk management, and portfolio building.</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Beginner • 4 hours</span>
                    <span className="text-accent font-semibold">Free</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-48 bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
                  <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-navy mb-2">Technical Analysis</h3>
                  <p className="text-gray-600 mb-4">Master chart patterns, indicators, and technical trading strategies.</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Intermediate • 6 hours</span>
                    <span className="text-accent font-semibold">$99</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-48 bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                  <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-navy mb-2">Options Trading</h3>
                  <p className="text-gray-600 mb-4">Advanced strategies for options trading and risk management.</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Advanced • 8 hours</span>
                    <span className="text-accent font-semibold">$199</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Learning Paths */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-navy mb-8">Learning Paths</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-navy">Beginner Path</h3>
                </div>
                <p className="text-gray-600 mb-4">Start your investment journey with fundamental concepts and basic strategies.</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Understanding Financial Markets</li>
                  <li>• Risk vs Reward</li>
                  <li>• Building Your First Portfolio</li>
                  <li>• Investment Psychology</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-navy">Advanced Path</h3>
                </div>
                <p className="text-gray-600 mb-4">Master advanced trading strategies and sophisticated investment techniques.</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Advanced Technical Analysis</li>
                  <li>• Derivatives Trading</li>
                  <li>• Portfolio Optimization</li>
                  <li>• Algorithmic Trading</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Resources */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-navy mb-8">Learning Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-navy mb-2">Video Tutorials</h3>
                <p className="text-gray-600 text-sm">Step-by-step video guides for all skill levels</p>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-navy mb-2">E-Books</h3>
                <p className="text-gray-600 text-sm">Comprehensive guides and reference materials</p>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-navy mb-2">Webinars</h3>
                <p className="text-gray-600 text-sm">Live sessions with market experts</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="bg-navy text-white rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-4">Start Learning Today</h2>
              <p className="text-lg mb-6 opacity-90">
                Join thousands of investors who have improved their skills with our educational content.
              </p>
              <button className="bg-accent text-white px-8 py-3 rounded-lg font-semibold hover:bg-accent/90 transition-colors">
                Browse All Courses
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EducationView;
