import React, { useState } from 'react';
import { Camera, Heart, MessageCircle } from 'lucide-react';
import Activity from './Activity';
import DirectMessages from './DirectMessages';

const InstagramHeader = () => {
  const [showActivity, setShowActivity] = useState(false);
  const [showMessages, setShowMessages] = useState(false);

  return (
    <>
      <header className="absolute top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="px-3 py-1.5 flex items-center justify-between">
          <div className="flex items-center">
            <Camera className="w-5 h-5 text-black mr-2" />
            <span className="text-black font-semibold text-lg">Instagram</span>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              className="text-black hover:text-gray-600 transition-colors relative"
              onClick={() => setShowActivity(true)}
            >
              <Heart className="w-5 h-5" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></div>
            </button>
            <button 
              className="text-black hover:text-gray-600 transition-colors"
              onClick={() => setShowMessages(true)}
            >
              <MessageCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Activity Modal */}
      <Activity
        isOpen={showActivity}
        onClose={() => setShowActivity(false)}
      />

      {/* Direct Messages Modal */}
      <DirectMessages
        isOpen={showMessages}
        onClose={() => setShowMessages(false)}
      />
    </>
  );
};

export default InstagramHeader;