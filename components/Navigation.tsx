'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**COMPONENT**/
export default function Navigation() {
  /**HOOKS**/
  const pathname = usePathname();

  /**HELPERS**/
  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-[#181a20] border-b border-[#2b3139] sticky top-0 z-50">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 sm:space-x-8">
            <Link href="/" className="text-[#f0b90b] text-lg sm:text-xl font-bold hover:text-[#fcd535] transition-colors">
              Abdelrahman DEV
            </Link>
            
            {/* Navigation Links */}
            <div className="flex space-x-1">
              <Link
                href="/order-book"
                className={`px-2 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                  isActive('/order-book')
                    ? 'bg-[#2b3139] text-[#f0b90b]'
                    : 'text-[#848e9c] hover:text-white hover:bg-[#2b3139]'
                }`}
              >
                <span className="hidden sm:inline">Order Book</span>
                <span className="sm:hidden">Book</span>
              </Link>
              <Link
                href="/market-trades"
                className={`px-2 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                  isActive('/market-trades')
                    ? 'bg-[#2b3139] text-[#f0b90b]'
                    : 'text-[#848e9c] hover:text-white hover:bg-[#2b3139]'
                }`}
              >
                <span className="hidden sm:inline">Market Trades</span>
                <span className="sm:hidden">Trades</span>
              </Link>
            </div>
          </div>

          {/* Symbol Info */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            <span className="text-white font-semibold text-sm sm:text-lg">BTC/USDT</span>
            <span className="hidden sm:inline text-[#848e9c] text-sm">Live</span>
            <span className="sm:hidden w-2 h-2 bg-[#0ecb81] rounded-full animate-pulse"></span>
          </div>
        </div>
      </div>
    </nav>
  );
}

