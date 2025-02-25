'use client';
import Link from 'next/link';
import { PublicHeader, PublicFooter } from '@/components/SharedLayout';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col pt-[81px]">
      <PublicHeader />
      
      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative overflow-hidden min-h-[90vh]">
          {/* Background decorations */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Dotted grid */}
            <div 
              className="absolute inset-0"
              style={{
                backgroundImage: 'radial-gradient(circle, #475569 2px, transparent 2px)',
                backgroundSize: '24px 24px',
                opacity: '0.2'
              }}
            />
            
            {/* Glowing orbs */}
            {/* Top right purple-blue */}
            <div 
              className="absolute -right-1/4 -top-1/4 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 blur-3xl animate-pulse"
              style={{ animationDuration: '4s' }}
            />
            {/* Top left green-cyan */}
            <div 
              className="absolute -left-1/4 -top-1/3 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 blur-3xl animate-pulse"
              style={{ animationDuration: '7s' }}
            />
            {/* Center-right indigo-violet */}
            <div 
              className="absolute right-1/4 top-1/2 w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-indigo-500/20 to-violet-400/20 blur-3xl animate-pulse"
              style={{ animationDuration: '5s' }}
            />
            {/* Bottom left blue-teal */}
            <div 
              className="absolute -left-1/4 top-2/3 w-[800px] h-[800px] rounded-full bg-gradient-to-tr from-blue-500/20 to-teal-400/20 blur-3xl animate-pulse"
              style={{ animationDuration: '6s' }}
            />
            {/* Center small pink-purple */}
            <div 
              className="absolute left-1/3 top-1/4 w-[400px] h-[400px] rounded-full bg-gradient-to-r from-pink-400/20 to-purple-400/20 blur-3xl animate-pulse"
              style={{ animationDuration: '8s' }}
            />
            {/* Center-bottom cyan-blue */}
            <div 
              className="absolute left-1/2 top-3/4 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-cyan-400/10 to-blue-400/10 blur-3xl animate-pulse"
              style={{ animationDuration: '5.5s' }}
            />
          </div>

          {/* Gradient fade overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/0 to-white pointer-events-none z-10" />

          <div className="relative isolate z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-48 md:pt-40 md:pb-56 flex items-center min-h-[90vh]">
            <div className="text-center w-full">
              <h1 className="relative z-20 text-4xl tracking-tight font-extrabold text-gray-700 sm:text-5xl md:text-6xl lg:text-7xl">
                <span className="block leading-tight text-gray-700">Take control of your</span>
                <span className="block mt-2 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent leading-tight pb-1">
                  daily spending
                </span>
              </h1>
              
              <p className="mt-6 max-w-md mx-auto text-lg text-gray-600 sm:text-xl md:mt-8 md:max-w-3xl relative">
                Cashday helps you manage your money between paydays. Set budgets, track expenses, and make your money last longer.
              </p>

              {/* Hero button and login link */}
              <div className="mt-10 max-w-md mx-auto sm:flex flex-col items-center sm:justify-center md:mt-12 relative">
                {/* Button glow effect */}
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-200"></div>
                  <Link
                    href="/login?mode=signup"
                    className="relative w-full sm:w-auto inline-flex items-center justify-center px-10 py-5 bg-blue-600 border border-transparent text-lg font-bold rounded-xl text-white hover:bg-blue-700 transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg"
                  >
                    Get Started — It's Free
                  </Link>
                </div>
                
                {/* Login link */}
                <Link
                  href="/login"
                  className="mt-6 text-gray-600 hover:text-gray-900 text-base font-medium transition-colors"
                >
                  Have an account? Login here
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="relative isolate z-20 py-32 bg-white overflow-hidden">
          {/* Background decorations */}
          <div className="absolute inset-0">
            {/* Dotted grid */}
            <div 
              className="absolute inset-0"
              style={{
                backgroundImage: 'radial-gradient(circle, #475569 2px, transparent 2px)',
                backgroundSize: '24px 24px',
                opacity: '0.2'
              }}
            />
          </div>

          {/* Gradient fades */}
          <div className="absolute inset-0 bg-gradient-to-b from-white via-white/0 to-white pointer-events-none z-10" />

          {/* Content */}
          <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative z-20 text-center max-w-3xl mx-auto">
              <h2 className="text-4xl font-extrabold tracking-tight text-gray-700 sm:text-5xl">
                <span className="block leading-tight text-gray-700">Everything you need to</span>
                <span className="block mt-1 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent leading-tight pb-1">
                  manage your money
                </span>
              </h2>
              <p className="mt-6 text-xl text-gray-500 leading-relaxed">
                Simple, intuitive tools to help you stay on top of your finances and make your money work harder for you.
              </p>
            </div>

            <div className="mt-20">
              <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
                {/* Feature 1 */}
                <div className="flex flex-col items-center text-center p-8 bg-white rounded-2xl border border-gray-200 transition-all duration-200 hover:shadow-lg hover:border-blue-200">
                  <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-inner">
                    <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="mt-8 text-2xl font-semibold text-gray-900">Daily Budget Tracking</h3>
                  <p className="mt-4 text-lg text-gray-500 leading-relaxed">
                    Know exactly how much you can spend each day until your next payday. Stay on track with smart daily limits.
                  </p>
                </div>

                {/* Feature 2 */}
                <div className="flex flex-col items-center text-center p-8 bg-white rounded-2xl border border-gray-200 transition-all duration-200 hover:shadow-lg hover:border-blue-200">
                  <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-inner">
                    <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="mt-8 text-2xl font-semibold text-gray-900">Smart Categories</h3>
                  <p className="mt-4 text-lg text-gray-500 leading-relaxed">
                    Organize your spending with intelligent expense categories. Get insights into where your money goes.
                  </p>
                </div>

                {/* Feature 3 */}
                <div className="flex flex-col items-center text-center p-8 bg-white rounded-2xl border border-gray-200 transition-all duration-200 hover:shadow-lg hover:border-blue-200">
                  <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-inner">
                    <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="mt-8 text-2xl font-semibold text-gray-900">Insightful Reports</h3>
                  <p className="mt-4 text-lg text-gray-500 leading-relaxed">
                    Get detailed insights into your spending patterns and habits. Make informed decisions about your money.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section - Matching hero style */}
        <div className="relative overflow-hidden">
          {/* Background decorations */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Dotted grid */}
            <div 
              className="absolute inset-0"
              style={{
                backgroundImage: 'radial-gradient(circle, #475569 2px, transparent 2px)',
                backgroundSize: '24px 24px',
                opacity: '0.2'
              }}
            />
            
            {/* Glowing orbs */}
            <div 
              className="absolute -right-1/4 bottom-0 w-[700px] h-[700px] rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 blur-3xl animate-pulse"
              style={{ animationDuration: '4s' }}
            />
            <div 
              className="absolute -left-1/4 bottom-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 blur-3xl animate-pulse"
              style={{ animationDuration: '7s' }}
            />
            <div 
              className="absolute right-1/3 bottom-1/3 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-pink-400/20 to-purple-400/20 blur-3xl animate-pulse"
              style={{ animationDuration: '5s' }}
            />
          </div>

          {/* Gradient fade overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-white/0 via-white/0 to-white pointer-events-none z-10" />

          <div className="relative isolate z-20 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
            <div className="text-center">
              <h2 className="relative z-20 text-4xl tracking-tight font-extrabold text-gray-700 sm:text-5xl md:text-6xl">
                <span className="block leading-tight text-gray-700">Ready to take control?</span>
                <span className="block mt-2 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent leading-tight pb-1">
                  Start using Cashday today
                </span>
              </h2>
              <p className="mt-8 text-lg text-gray-600 sm:text-xl md:mt-10 max-w-2xl mx-auto">
                Join thousands of users who are managing their money better with Cashday.
              </p>
              <div className="mt-10 sm:flex sm:justify-center relative">
                {/* Button glow effect */}
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-200"></div>
                  <Link
                    href="/login?mode=signup"
                    className="relative w-full sm:w-auto inline-flex items-center justify-center px-10 py-5 bg-blue-600 border border-transparent text-lg font-bold rounded-xl text-white hover:bg-blue-700 transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg"
                  >
                    Sign up for free
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter centered />
    </div>
  );
}
