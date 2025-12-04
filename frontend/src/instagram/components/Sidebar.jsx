import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  Home, 
  Search, 
  PlusSquare, 
  User,
  Instagram,
  Compass,
  Clapperboard,
  MessageCircle
} from 'lucide-react';

const Sidebar = ({ onCreateClick }) => {
  const location = useLocation();
  const { currentUser } = useSelector(state => state.auth);

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Search', path: '/search' },
    { icon: Compass, label: 'Explore', path: '/explore' },
    { icon: Clapperboard, label: 'Reels', path: '/reels' },
    { icon: MessageCircle, label: 'Messages', path: '/messages' },
    { icon: PlusSquare, label: 'Create', onClick: onCreateClick },
    { icon: User, label: 'Profile', path: `/profile/${currentUser?._id}` }
  ];

  return (
    <nav className="fixed left-0 top-0 h-full w-64 bg-white border-r border-instagram-border z-10">
      <div className="flex flex-col p-6">
        {/* Logo */}
        <div className="flex items-center mb-8">
          <Instagram className="h-8 w-8 mr-2" />
          <span className="text-2xl font-bold">Instagram</span>
        </div>

        {/* Navigation Items */}
        <div className="flex flex-col space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.path && location.pathname === item.path;

            if (item.onClick) {
              return (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className="flex items-center p-3 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Icon className="h-6 w-6 mr-4" />
                  <span className="text-lg">{item.label}</span>
                </button>
              );
            }

            return (
              <Link
                key={item.label}
                to={item.path}
                className={`flex items-center p-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-gray-100 font-bold' 
                    : 'hover:bg-gray-100'
                }`}
              >
                <Icon 
                  className={`h-6 w-6 mr-4 ${isActive ? 'fill-current' : ''}`} 
                />
                <span className="text-lg">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;