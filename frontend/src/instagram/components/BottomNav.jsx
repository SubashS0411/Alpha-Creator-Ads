import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, PlusSquare, Film, User } from 'lucide-react';

const BottomNav = ({ onCreateClick }) => {
  const location = useLocation();

  const navItems = [
    { icon: Home, path: '/instagram/home', label: 'Home' },
    { icon: Search, path: '/instagram/search', label: 'Search' },
    { icon: PlusSquare, path: '/create', label: 'Create' },
    { icon: Film, path: '/instagram/reels', label: 'Reels' },
    { icon: User, path: '/instagram/profile', label: 'Profile' }
  ];

  return (
    <nav className="absolute bottom-0 left-0 right-0 bg-black/90 backdrop-blur-sm border-t border-gray-800 z-50">
      <div className="flex justify-around items-center py-2">
        {navItems.map(({ icon: Icon, path, label }) => {
          const isActive = location.pathname === path || 
            (path === '/instagram/home' && location.pathname === '/instagram');
          
          if (label === 'Create') {
            return (
              <button
                key={label}
                onClick={onCreateClick}
                className={`p-3 transition-colors ${
                  isActive ? 'text-white' : 'text-gray-400'
                }`}
                aria-label={label}
              >
                <Icon className="h-6 w-6" />
              </button>
            );
          }

          return (
            <Link
              key={path}
              to={path}
              className={`p-3 transition-colors ${
                isActive ? 'text-white' : 'text-gray-400'
              }`}
              aria-label={label}
            >
              {label === 'Profile' ? (
                <div className={`w-6 h-6 rounded-full border-2 ${
                  isActive ? 'border-white' : 'border-gray-400'
                } overflow-hidden bg-gray-600 flex items-center justify-center`}>
                  <Icon className="w-4 h-4" />
                </div>
              ) : (
                <Icon 
                  className={`h-6 w-6 ${
                    isActive ? 'fill-current' : ''
                  }`} 
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;