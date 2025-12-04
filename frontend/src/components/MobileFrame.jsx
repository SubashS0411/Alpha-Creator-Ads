import React from 'react';

const MobileFrame = ({ children, backgroundColor = 'bg-black', showWallpaper = true }) => {
  return (
    <div className="min-h-screen flex justify-center items-center" style={{
      background: 'url("/assests/image.png") center center / cover no-repeat'
    }}>
      {/* Mobile Phone Frame */}
      <div 
        className="relative overflow-hidden"
        style={{
          width: '375px',
          height: '667px',
          background: showWallpaper ? 'url("/assests/wallpaper.jpg") center center / cover no-repeat' : backgroundColor,
          borderRadius: '35px',
          border: '8px solid #000000',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
        }}
      >
        {/* Status Bar */}
        <div className="h-6 bg-gradient-to-r from-black/20 to-black/10 flex justify-between items-center px-4 text-white text-sm font-medium relative">
          <span className="font-semibold">{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
          
          {/* Camera Module - Fixed on all pages */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-black rounded-full border border-gray-700 shadow-inner z-[9999]">
            <div className="absolute inset-0.5 bg-gray-900 rounded-full">
              <div className="absolute inset-1 bg-blue-900/30 rounded-full"></div>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <span>📶</span>
            <span>🔋</span>
            <span>67%</span>
          </div>
        </div>
        
        {/* Content Area - Full height minus status bar */}
        <div className="relative" style={{ height: 'calc(100% - 24px)' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default MobileFrame;