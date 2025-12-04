import React, { useState } from 'react';
import MobileFrame from './MobileFrame';
import BottomNav from '../instagram/components/BottomNav';
import CreatePostModal from '../instagram/components/CreatePostModal';
import InstagramHeader from '../instagram/components/InstagramHeader';

const Layout = ({ children }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreateClick = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
  };

  return (
    <MobileFrame>
      <div className="h-full flex flex-col relative">
        {/* Header - positioned at top of mobile frame */}
        <div className="relative z-50 bg-black/95 backdrop-blur-sm">
          <InstagramHeader />
        </div>
        
        {/* Main content - Fill available space */}
        <main className="flex-1 overflow-hidden bg-black/80">
          <div className="h-full overflow-y-auto">
            {children}
          </div>
        </main>
        
        {/* Bottom Navigation - positioned at bottom of mobile frame */}
        <div className="relative z-50 bg-black/95 backdrop-blur-sm">
          <BottomNav onCreateClick={handleCreateClick} />
        </div>
      </div>
      
      {/* Create Post Modal */}
      {isCreateModalOpen && (
        <CreatePostModal onClose={handleCloseModal} />
      )}
    </MobileFrame>
  );
};

export default Layout;