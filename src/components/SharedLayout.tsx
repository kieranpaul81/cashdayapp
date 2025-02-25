'use client';
import Link from 'next/link';

export function PublicHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-[81px] flex items-center justify-between">
          <Link 
            href="/" 
            className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent"
          >
            Cashday.app
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/login?mode=signup"
              className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

type PublicFooterProps = {
  centered?: boolean;
};

export function PublicFooter({ centered = false }: PublicFooterProps) {
  return (
    <footer className="bg-white border-t border-gray-200 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex gap-6 ${centered ? 'justify-center' : 'justify-end'}`}>
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