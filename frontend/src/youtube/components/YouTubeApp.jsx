import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { 
  MdHome, 
  MdAdd, 
  MdAccountCircle,
  MdSearch,
  MdCast,
  MdNotifications
} from 'react-icons/md';
import { SiYoutubeshorts } from 'react-icons/si';
import MobileFrame from '../../components/MobileFrame';
import Home from '../pages/Home';
import Shorts from '../pages/Shorts';
import Search from '../pages/Search';
import Watch from '../pages/Watch';
import Profile from '../pages/Profile';
import Subscriptions from '../pages/Subscriptions';
import Create from '../pages/Create';
import ManageSubscriptions from '../pages/ManageSubscriptions';

// Hardcoded current user ID as per specification
const CURRENT_USER_ID = '674587d123456789abcdef01';

const YouTubeApp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('home');

  // Update active tab based on current route
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('shorts')) setActiveTab('shorts');
    else if (path.includes('subscriptions')) setActiveTab('subscriptions');
    else if (path.includes('profile') || path.includes('you')) setActiveTab('you');
    else if (path.includes('search')) setActiveTab('search');
    else if (path.includes('create')) setActiveTab('create');
    else setActiveTab('home');
  }, [location]);

  const handleTabClick = (tab, path) => {
    setActiveTab(tab);
    navigate(path);
  };

  const isWatchPage = location.pathname.includes('/youtube/watch/');

  return (
    <MobileFrame showWallpaper={true}>
      <div className="text-gray-900 font-roboto h-full flex flex-col bg-white bg-opacity-95">
        {/* Header - Hidden on watch page */}
        {!isWatchPage && (
          <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {/* YouTube Logo */}
            <div className="flex items-center space-x-1">
              <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
                <span className="text-white text-lg font-bold">YT</span>
              </div>
              <span className="text-xl font-medium text-gray-900">YouTube</span>
            </div>
          </div>
          
          {/* Header Icons */}
          <div className="flex items-center space-x-4">
            <MdCast className="w-6 h-6 text-gray-600" />
            <MdNotifications className="w-6 h-6 text-gray-600" />
            <MdSearch 
              className="w-6 h-6 text-gray-600 cursor-pointer" 
              onClick={() => navigate('/youtube/search')}
            />
            {/* User Profile Image */}
            <button 
              onClick={() => navigate('/youtube/you')}
              className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-300 hover:border-red-500 transition-colors"
            >
              <div className="w-full h-full bg-red-600 flex items-center justify-center text-white text-sm font-bold">
                DU
              </div>
            </button>
          </div>
        </header>
      )}

        {/* Main Content */}
        <main className={`${!isWatchPage ? 'pb-16' : ''} flex-1 overflow-hidden`}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/shorts" element={<Shorts />} />
            <Route path="/search" element={<Search />} />
            <Route path="/watch/:videoId" element={<Watch />} />
            <Route path="/subscriptions" element={<Subscriptions />} />
            <Route path="/you" element={<Profile />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/create" element={<Create />} />
            <Route path="/manage-subscriptions" element={<ManageSubscriptions />} />
          </Routes>
        </main>

        {/* Bottom Navigation - Hidden on watch page */}
        {!isWatchPage && (
          <nav className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-1 py-1">
          <div className="flex items-center justify-around">
            {/* Home */}
            <button
              onClick={() => handleTabClick('home', '/youtube/home')}
              className={`flex flex-col items-center p-1 min-w-0 ${
                activeTab === 'home' ? 'text-red-600' : 'text-gray-600'
              }`}
            >
              <MdHome className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] font-medium">Home</span>
            </button>

            {/* Shorts */}
            <button
              onClick={() => handleTabClick('shorts', '/youtube/shorts')}
              className={`flex flex-col items-center p-1 min-w-0 ${
                activeTab === 'shorts' ? 'text-red-600' : 'text-gray-600'
              }`}
            >
              <SiYoutubeshorts className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] font-medium">Shorts</span>
            </button>

            {/* Create */}
            <button
              className="flex flex-col items-center p-1 min-w-0"
              onClick={() => handleTabClick('create', '/youtube/create')}
            >
              <div className="w-5 h-5 mb-0.5 rounded-full bg-gray-900 flex items-center justify-center">
                <MdAdd className="w-3 h-3 text-white" />
              </div>
              <span className="text-[10px] font-medium text-gray-600">Create</span>
            </button>

            {/* Subscriptions */}
            <button
              onClick={() => handleTabClick('subscriptions', '/youtube/subscriptions')}
              className={`flex flex-col items-center p-1 min-w-0 ${
                activeTab === 'subscriptions' ? 'text-red-600' : 'text-gray-600'
              }`}
            >
              <div className="w-5 h-5 mb-0.5 flex flex-col space-y-0.5">
                <div className="h-0.5 bg-current rounded"></div>
                <div className="h-0.5 bg-current rounded"></div>
                <div className="h-0.5 bg-current rounded"></div>
              </div>
              <span className="text-[10px] font-medium">Subscriptions</span>
            </button>

            {/* You */}
            <button
              onClick={() => handleTabClick('you', '/youtube/you')}
              className={`flex flex-col items-center p-1 min-w-0 ${
                activeTab === 'you' ? 'text-red-600' : 'text-gray-600'
              }`}
            >
              <MdAccountCircle className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] font-medium">You</span>
            </button>
          </div>
        </nav>
        )}
      </div>
    </MobileFrame>
  );
};

export default YouTubeApp;