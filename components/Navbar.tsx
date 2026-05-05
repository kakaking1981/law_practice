'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Search, BarChart3, LogOut, BookOpen, Home } from 'lucide-react';

interface NavbarProps {
  showSearch?: boolean;
  showStats?: boolean;
}

export default function Navbar({ showSearch = true, showStats = true }: NavbarProps) {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => router.push('/')}
            className="flex items-center space-x-2 hover:text-blue-600 transition-colors"
          >
            <Home className="w-5 h-5 text-blue-600" />
            <span className="text-lg font-bold text-gray-800">法考助手</span>
          </button>

          <div className="flex items-center space-x-4">
            {showSearch && (
              <button
                onClick={() => router.push('/search')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Search className="w-5 h-5 text-gray-600" />
              </button>
            )}
            {showStats && (
              <button
                onClick={() => router.push('/stats')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <BarChart3 className="w-5 h-5 text-gray-600" />
              </button>
            )}
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="退出登录"
            >
              <LogOut className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
