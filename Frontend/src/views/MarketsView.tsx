import React from 'react';
import Layout from '@/components/Layout';

const MarketsView = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-navy mb-4">Markets</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore global financial markets, track real-time data, and discover investment opportunities across different asset classes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Stock Markets */}
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-navy">Stock Markets</h3>
              </div>
              <p className="text-gray-600 mb-4">Track equity markets worldwide with real-time data and analysis.</p>
              <div className="text-sm text-gray-500">
                <span className="text-green-600 font-semibold">+2.4%</span> Today
              </div>
            </div>

            {/* Forex Markets */}
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-navy">Forex Markets</h3>
              </div>
              <p className="text-gray-600 mb-4">Monitor currency pairs and exchange rates across global markets.</p>
              <div className="text-sm text-gray-500">
                <span className="text-blue-600 font-semibold">USD/EUR</span> 0.85
              </div>
            </div>

            {/* Crypto Markets */}
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-navy">Crypto Markets</h3>
              </div>
              <p className="text-gray-600 mb-4">Stay updated with cryptocurrency prices and market trends.</p>
              <div className="text-sm text-gray-500">
                <span className="text-purple-600 font-semibold">BTC</span> $43,250
              </div>
            </div>

            {/* Commodities */}
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-navy">Commodities</h3>
              </div>
              <p className="text-gray-600 mb-4">Track precious metals, energy, and agricultural commodities.</p>
              <div className="text-sm text-gray-500">
                <span className="text-yellow-600 font-semibold">Gold</span> $1,950/oz
              </div>
            </div>

            {/* Bonds */}
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-navy">Bonds</h3>
              </div>
              <p className="text-gray-600 mb-4">Monitor government and corporate bond yields and prices.</p>
              <div className="text-sm text-gray-500">
                <span className="text-indigo-600 font-semibold">10Y Treasury</span> 4.2%
              </div>
            </div>

            {/* Market News */}
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-navy">Market News</h3>
              </div>
              <p className="text-gray-600 mb-4">Latest financial news and market analysis from experts.</p>
              <div className="text-sm text-gray-500">
                <span className="text-red-600 font-semibold">Breaking</span> Fed Rate Decision
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <div className="bg-navy text-white rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-4">Real-Time Market Data</h2>
              <p className="text-lg mb-6 opacity-90">
                Access live market data, advanced charts, and professional analysis tools.
              </p>
              <button className="bg-accent text-white px-8 py-3 rounded-lg font-semibold hover:bg-accent/90 transition-colors">
                Explore Markets
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MarketsView;
