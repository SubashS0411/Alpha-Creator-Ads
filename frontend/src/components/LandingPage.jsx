import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Instagram, Youtube, Github } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  const apps = [
    {
      id: 'instagram',
      name: 'Instagram Clone',
      description: 'Social media app with posts, stories, likes and comments',
      icon: Instagram,
      color: 'from-purple-600 to-pink-600',
      path: '/instagram'
    },
    {
      id: 'youtube',
      name: 'YouTube Clone',
      description: 'Video streaming platform (Coming Soon)',
      icon: Youtube,
      color: 'from-red-600 to-red-700',
      path: '/youtube',
      disabled: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Mobile Phone Frame */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-sm mx-auto bg-black rounded-3xl overflow-hidden shadow-2xl border border-gray-800">
          {/* Status Bar */}
          <div className="flex items-center justify-between px-6 py-2 text-white text-sm bg-black">
            <div className="flex items-center space-x-1">
              <span className="font-semibold">9:41</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-xs">📶</span>
              <span className="text-xs">📶</span>
              <span className="text-xs">🔋</span>
            </div>
          </div>

          {/* Header */}
          <div className="px-6 py-8 text-center border-b border-gray-800">
            <div className="flex items-center justify-center mb-4">
              <Github className="h-8 w-8 text-blue-400 mr-2" />
              <h1 className="text-2xl font-bold">App Collection</h1>
            </div>
            <p className="text-gray-400 text-sm">
              Select an app to explore
            </p>
          </div>

          {/* Apps Grid */}
          <div className="p-6 space-y-4">
            {apps.map((app) => {
              const Icon = app.icon;
              return (
                <button
                  key={app.id}
                  onClick={() => !app.disabled && navigate(app.path)}
                  disabled={app.disabled}
                  className={`w-full p-6 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                    app.disabled 
                      ? 'bg-gray-800 opacity-50 cursor-not-allowed' 
                      : `bg-gradient-to-r ${app.color} hover:shadow-lg`
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="text-lg font-semibold text-white">
                        {app.name}
                      </h3>
                      <p className="text-sm text-white/80 mt-1">
                        {app.description}
                      </p>
                    </div>
                    {!app.disabled && (
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 text-center border-t border-gray-800">
            <p className="text-xs text-gray-500">
              Built with React, Node.js & MongoDB
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;