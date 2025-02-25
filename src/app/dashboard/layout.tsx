'use client';
import Sidebar from '@/components/Sidebar';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/firebase/config';
import { signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import { doc, getDoc } from 'firebase/firestore';

function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-6 w-[100vw]">
      <div className="px-6">
        <div className="flex justify-end items-center gap-6">
          <span className="text-gray-500">cashday.app © {new Date().getFullYear()}</span>
          <a href="#" className="text-gray-500 hover:text-gray-700 transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="text-gray-500 hover:text-gray-700 transition-colors">
            Terms of Service
          </a>
          <a href="#" className="text-gray-500 hover:text-gray-700 transition-colors">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUserEmail(user.email);
        // Fetch user document to get first name
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setFirstName(userDoc.data().firstName);
        }
      } else {
        router.push('/');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <CurrencyProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Mobile Header */}
        <div className="md:hidden fixed top-0 left-0 right-0 z-20 bg-white border-b border-gray-200">
          <div className="px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-gray-400">Welcome,</span>
                <span className="text-gray-700 font-semibold">{firstName || 'User'}</span>
              </div>
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <>
          <div 
            className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-30 transition-opacity duration-300 ${
              isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div 
            className={`fixed inset-y-0 left-0 w-64 bg-white z-40 transform transition-all duration-300 ease-in-out ${
              isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                  Cashday.app
                </span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-3 mb-6 px-4">
                <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-400">Welcome,</span>
                  <span className="text-gray-700 font-semibold">{firstName || 'User'}</span>
                </div>
              </div>
              <Sidebar isMobile />
              <button
                onClick={handleLogout}
                className="mt-4 w-full bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg transition-colors border border-gray-200 flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </>
        
        {/* Main content wrapper */}
        <div className="min-h-screen md:pl-64 bg-gray-100 flex flex-col">
          {/* Desktop header */}
          <nav className="hidden md:block fixed top-0 left-64 right-0 z-10 bg-white/80 backdrop-blur-lg border-b border-gray-200">
            <div className="px-6">
              <div className="flex justify-between h-[81px] items-center">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-gray-400">Welcome,</span>
                    <span className="text-gray-700 font-semibold">{firstName || 'User'}</span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg transition-colors border border-gray-200 flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </div>
          </nav>

          {/* Page content */}
          <main className="flex-1 px-6 pt-[81px] md:pt-[81px]">
            <div className="py-6">
              {children}
            </div>
          </main>

          {/* Footer */}
          <div className="w-[100vw] md:ml-[-16rem]">
            <Footer />
          </div>
        </div>
      </div>
    </CurrencyProvider>
  );
} 