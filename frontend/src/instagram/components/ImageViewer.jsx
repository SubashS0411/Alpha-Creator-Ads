import React, { useEffect, useRef, useState } from 'react';
import { X, Heart, MessageCircle, Send, Bookmark, MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { trackViewDuration, trackInteraction } from '../../services/analyticsApi';
import FollowButton from './FollowButton';

const ImageViewer = ({ images, initialIndex = 0, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const containerRef = useRef(null);
  const viewStartTimeRef = useRef(null);

  const currentImage = images[currentIndex];

  useEffect(() => {
    viewStartTimeRef.current = Date.now();
    
    // Track image view
    if (currentImage) {
      trackInteraction(currentImage._id, 'image', 'view');
      setIsLiked(currentImage.likes?.includes('current_user') || false);
      setLikesCount(currentImage.likesCount || 0);
    }

    return () => {
      // Track view duration when component unmounts or image changes
      if (currentImage && viewStartTimeRef.current) {
        const duration = Date.now() - viewStartTimeRef.current;
        if (duration > 1000) {
          trackViewDuration(currentImage._id, 'image', duration);
        }
      }
    };
  }, [currentIndex, currentImage]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const itemHeight = container.clientHeight;
      const newIndex = Math.round(scrollTop / itemHeight);
      
      if (newIndex !== currentIndex) {
        // Track duration for previous image
        if (viewStartTimeRef.current) {
          const duration = Date.now() - viewStartTimeRef.current;
          if (duration > 1000) {
            trackViewDuration(images[currentIndex]._id, 'image', duration);
          }
        }
        
        setCurrentIndex(newIndex);
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [currentIndex, images]);

  const handleLike = async () => {
    const newLiked = !isLiked;
    setIsLiked(newLiked);
    setLikesCount(prev => newLiked ? prev + 1 : prev - 1);

    try {
      await trackInteraction(currentImage._id, 'image', 'like');
    } catch (error) {
      setIsLiked(!newLiked);
      setLikesCount(prev => newLiked ? prev - 1 : prev + 1);
      console.warn('Like failed:', error);
    }
  };

  const handleSave = async () => {
    const newSaved = !isSaved;
    setIsSaved(newSaved);

    try {
      await trackInteraction(currentImage._id, 'image', 'save');
    } catch (error) {
      console.warn('Save tracking failed:', error);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  if (!currentImage) return null;

  return (
    <div className="absolute inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-3 text-white z-10 bg-black bg-opacity-50">
        <button onClick={onClose} className="p-2">
          <X className="h-6 w-6" />
        </button>
        <div className="flex-1 text-center">
          <span className="text-sm">{currentIndex + 1} / {images.length}</span>
        </div>
        <button className="p-2 opacity-0">
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Image Container */}
      <div className="flex-1 relative">
        <div 
          ref={containerRef}
          className="h-full overflow-y-scroll snap-y snap-mandatory"
          style={{ scrollSnapType: 'y mandatory' }}
        >
          {images.map((image, index) => (
            <div key={image._id} className="h-full flex items-center justify-center snap-start snap-always relative">
              {index === currentIndex && (
                <>
                  <img
                    src={image.mediaUrl || image.imageUrl}
                    alt="Post content"
                    className="max-w-full max-h-full object-contain"
                  />
                </>
              )}
            </div>
          ))}
        </div>

        {/* Navigation Arrows (Desktop) */}
        <button
          onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
          className="hidden md:block absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-all z-10"
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={() => setCurrentIndex(prev => Math.min(images.length - 1, prev + 1))}
          className="hidden md:block absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-all z-10"
          disabled={currentIndex === images.length - 1}
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Right Side Actions */}
        <div className="absolute bottom-16 right-3 flex flex-col items-center space-y-4 z-10">
          <button onClick={handleLike} className="flex flex-col items-center">
            <Heart className={`h-7 w-7 ${isLiked ? 'text-red-500 fill-current' : 'text-white'} drop-shadow-lg`} />
            <span className="text-white text-[10px] mt-0.5 font-medium drop-shadow-lg">
              {formatNumber(likesCount)}
            </span>
          </button>

          <button className="flex flex-col items-center">
            <MessageCircle className="h-7 w-7 text-white drop-shadow-lg" />
            <span className="text-white text-[10px] mt-0.5 font-medium drop-shadow-lg">
              {formatNumber(currentImage.commentsCount || 0)}
            </span>
          </button>

          <button className="flex flex-col items-center">
            <Send className="h-7 w-7 text-white drop-shadow-lg" />
          </button>

          <button onClick={handleSave} className="flex flex-col items-center">
            <Bookmark className={`h-7 w-7 text-white drop-shadow-lg ${isSaved ? 'fill-white' : ''}`} />
          </button>

          <button className="flex flex-col items-center">
            <MoreHorizontal className="h-7 w-7 text-white drop-shadow-lg" />
          </button>
        </div>

        {/* Bottom Info */}
        <div className="absolute bottom-3 left-3 right-16 text-white z-10">
          {/* User Info */}
          <div className="flex items-center mb-2">
            <img
              src={currentImage.author?.profilePictureUrl || 'https://via.placeholder.com/40'}
              alt={currentImage.author?.username}
              className="w-8 h-8 rounded-full border-2 border-white mr-2"
            />
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-sm drop-shadow-lg">
                  @{currentImage.author?.username || 'user'}
                </span>
                <FollowButton 
                  user={currentImage.author} 
                  variant="outline" 
                  size="sm"
                />
              </div>
            </div>
          </div>
          
          {/* Caption */}
          {currentImage.caption && (
            <div className="mb-2 text-xs drop-shadow-lg max-w-[200px]">
              <p className="line-clamp-2">{currentImage.caption}</p>
            </div>
          )}
          
          {/* Location */}
          {currentImage.location && (
            <div className="text-xs opacity-90 drop-shadow-lg">
              📍 {currentImage.location}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageViewer;