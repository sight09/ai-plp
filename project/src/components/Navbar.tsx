import React from 'react';
import { 
  Home, 
  Upload, 
  Search, 
  FileEdit, 
  Briefcase, 
  Crown, 
  Sun, 
  Moon,
  User,
  LogOut,
  CreditCard
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { PremiumButton } from './PremiumButton';

interface NavbarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onPageChange }) => {
  const { user, appUser, signOut } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'upload', label: 'Upload Resume', icon: Upload },
    { id: 'matches', label: 'Find Matches', icon: Search },
    { id: 'rewrite', label: 'Rewrite CV', icon: FileEdit },
    { id: 'post-job', label: 'Post Job', icon: Briefcase },
    { id: 'premium', label: 'Premium', icon: Crown },
    { id: 'payments', label: 'Payments', icon: CreditCard },
  ];

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              JobAI
            </h1>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                const isPremium = item.id === 'rewrite' && !appUser?.premium;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => onPageChange(item.id)}
                    className={`
                      px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2 transition-all duration-200
                      ${isActive 
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' 
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
                      }
                      ${isPremium ? 'relative' : ''}
                    `}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                    {isPremium && (
                      <Crown size={14} className="text-yellow-500 ml-1" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* User menu */}
            {user ? (
              <div className="flex items-center space-x-3">
                {!appUser?.premium && (
                  <PremiumButton variant="secondary" size="sm" />
                )}
                <div className="flex items-center space-x-2">
                  <User size={20} className="text-gray-600 dark:text-gray-300" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {user.email}
                  </span>
                  {appUser?.premium && (
                    <Crown size={16} className="text-yellow-500" />
                  )}
                </div>
                <button
                  onClick={signOut}
                  className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => onPageChange('auth')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Sign In
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-3">
          <div className="flex flex-wrap gap-2">
            {navItems.slice(0, 4).map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  className={`
                    px-3 py-2 rounded-md text-xs font-medium flex items-center space-x-1 transition-all
                    ${isActive 
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' 
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
                    }
                  `}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};