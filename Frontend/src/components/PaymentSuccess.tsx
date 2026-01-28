import React from 'react';
import { useLocation } from "react-router-dom";

const PaymentSuccess = () => {
    const searchQuery = new URLSearchParams(useLocation().search);
    const referenceNum = searchQuery.get("reference");

    return (
        <>
            <style>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes scaleIn {
                    from {
                        transform: scale(0);
                    }
                    to {
                        transform: scale(1);
                    }
                }
                
                @keyframes drawCircle {
                    from {
                        stroke-dasharray: 166;
                        stroke-dashoffset: 166;
                    }
                    to {
                        stroke-dasharray: 166;
                        stroke-dashoffset: 0;
                    }
                }
                
                @keyframes drawCheck {
                    from {
                        stroke-dasharray: 48;
                        stroke-dashoffset: 48;
                    }
                    to {
                        stroke-dasharray: 48;
                        stroke-dashoffset: 0;
                    }
                }
                
                .animate-fadeInUp {
                    animation: fadeInUp 0.6s ease-out;
                }
                
                .animate-fadeIn {
                    animation: fadeIn 0.6s ease-out forwards;
                }
                
                .animate-scaleIn {
                    animation: scaleIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                }
                
                .animate-drawCircle {
                    animation: drawCircle 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
                }
                
                .animate-drawCheck {
                    stroke-dasharray: 48;
                    stroke-dashoffset: 48;
                    animation: drawCheck 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.4s forwards;
                }
                
                .delay-300 {
                    animation-delay: 0.3s;
                    opacity: 0;
                }
                
                .delay-400 {
                    animation-delay: 0.4s;
                    opacity: 0;
                }
                
                .delay-500 {
                    animation-delay: 0.5s;
                    opacity: 0;
                }
                
                .delay-600 {
                    animation-delay: 0.6s;
                    opacity: 0;
                }
                
                .delay-700 {
                    animation-delay: 0.7s;
                    opacity: 0;
                }
            `}</style>

            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 p-4 sm:p-6 md:p-8 relative overflow-hidden">
                {/* Animated background circles */}
                <div className="absolute top-0 left-0 w-64 h-64 md:w-96 md:h-96 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-48 h-48 md:w-72 md:h-72 bg-white/10 rounded-full translate-x-1/2 translate-y-1/2 animate-pulse"></div>
                
                {/* Success Card */}
                <div className="relative z-10 bg-white rounded-2xl md:rounded-3xl shadow-2xl p-8 sm:p-10 md:p-12 lg:p-14 w-full max-w-md md:max-w-lg animate-fadeInUp">
                    {/* Success Icon */}
                    <div className="flex justify-center mb-6 md:mb-8">
                        <div className="relative">
                            <svg 
                                className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 animate-scaleIn" 
                                viewBox="0 0 52 52" 
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <circle 
                                    className="animate-drawCircle" 
                                    cx="26" 
                                    cy="26" 
                                    r="25" 
                                    fill="none" 
                                    stroke="#10b981" 
                                    strokeWidth="2"
                                />
                                <path 
                                    className="animate-drawCheck" 
                                    fill="none" 
                                    stroke="#10b981" 
                                    strokeWidth="3" 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    d="M14.1 27.2l7.1 7.2 16.7-16.8"
                                />
                            </svg>
                        </div>
                    </div>
                    
                    {/* Heading */}
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 text-center mb-3 md:mb-4 uppercase tracking-wide animate-fadeIn delay-300">
                        Order Successful!
                    </h1>
                    
                    {/* Success Message */}
                    <p className="text-sm sm:text-base md:text-lg text-gray-600 text-center mb-6 md:mb-8 leading-relaxed animate-fadeIn delay-400">
                        Thank you for your purchase. Your order has been confirmed and is being processed.
                    </p>
                    
                    {/* Reference Number */}
                    {referenceNum && (
                        <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-xl md:rounded-2xl p-5 md:p-6 mb-6 md:mb-7 animate-fadeIn delay-500">
                            <span className="block text-xs md:text-sm text-white/90 uppercase tracking-widest font-semibold mb-2">
                                Reference Number
                            </span>
                            <span className="block text-xl sm:text-2xl md:text-3xl text-white font-bold tracking-wider font-mono">
                                {referenceNum}
                            </span>
                        </div>
                    )}
                    
                    {/* Info Box */}
                    <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 md:p-5 mb-6 md:mb-8 flex items-start gap-3 animate-fadeIn delay-600">
                        <svg 
                            className="w-5 h-5 md:w-6 md:h-6 text-blue-500 flex-shrink-0 mt-0.5" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path 
                                d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" 
                                stroke="currentColor" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                            />
                        </svg>
                        <p className="text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed">
                            You will receive a confirmation email shortly with your order details.
                        </p>
                    </div>
                    
                    {/* Home Button */}
                    <button 
                        onClick={() => window.location.href = '/'} 
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-semibold py-3 md:py-4 px-6 md:px-8 rounded-full text-sm md:text-base uppercase tracking-wide shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 active:translate-y-0 animate-fadeIn delay-700"
                    >
                        Return to Home
                    </button>
                </div>
            </div>
        </>
    );
};

export default PaymentSuccess;