import React, { useEffect, useRef, useState } from 'react';
import { X, Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Volume2, VolumeX, Play, Pause } from 'lucide-react';
import { trackViewDuration, trackInteraction } from '../../services/analyticsApi';
import FollowButton from './FollowButton';

const VideoViewer = ({ videos, initialIndex = 0, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isMuted, setIsMuted] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const viewStartTimeRef = useRef(null);

  const currentVideo = videos[currentIndex];

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    viewStartTimeRef.current = Date.now();
    video.play().catch(console.error);

    // Track video view
    if (currentVideo) {
      trackInteraction(currentVideo._id, 'video', 'view');
    }

    return () => {
      // Track view duration when component unmounts or video changes
      if (currentVideo && viewStartTimeRef.current) {
        const duration = Date.now() - viewStartTimeRef.current;
        if (duration > 1000) {
          trackViewDuration(currentVideo._id, 'video', duration);
        }
      }
    };
  }, [currentIndex, currentVideo]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const itemHeight = container.clientHeight;
      const newIndex = Math.round(scrollTop / itemHeight);
      
      if (newIndex !== currentIndex) {
        // Track duration for previous video
        if (viewStartTimeRef.current) {
          const duration = Date.now() - viewStartTimeRef.current;
          if (duration > 1000) {
            trackViewDuration(videos[currentIndex]._id, 'video', duration);
          }
        }
        
        setCurrentIndex(newIndex);
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [currentIndex, videos]);

  const handleVideoClick = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPaused(false);
    } else {
      video.pause();
      setIsPaused(true);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const handleLike = async () => {
    try {
      await trackInteraction(currentVideo._id, 'video', 'like');
    } catch (error) {
      console.warn('Like tracking failed:', error);
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

  if (!currentVideo) return null;

  return (
    <div className="absolute inset-0 bg-black bg-opacity-95 z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 text-white z-10">
        <button onClick={onClose} className="p-2">
          <X className="h-6 w-6" />
        </button>
        <div className="flex-1 text-center">
          <span className="text-sm">{currentIndex + 1} / {videos.length}</span>
        </div>
        <button onClick={toggleMute} className="p-2">
          {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
        </button>
      </div>

      {/* Video Container */}
      <div className="flex-1 relative">
        <div 
          ref={containerRef}
          className="h-full overflow-y-scroll snap-y snap-mandatory"
          style={{ scrollSnapType: 'y mandatory' }}
        >
          {videos.map((video, index) => (
            <div key={video._id} className="h-full flex items-center justify-center snap-start snap-always">
              {index === currentIndex && (
                <>
                  <video
                    ref={videoRef}
                    src={video.mediaUrl || video.imageUrl}
                    className="w-full h-full object-contain cursor-pointer"
                    loop
                    muted={isMuted}
                    playsInline
                    onClick={handleVideoClick}
                  />
                  
                  {/* Pause Indicator */}
                  {isPaused && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-20 h-20 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                        <Play className="w-8 h-8 text-white ml-1" />
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>

        {/* Right Side Actions */}
        <div className="absolute bottom-16 right-3 flex flex-col items-center space-y-4 z-10">
          <button onClick={handleLike} className="flex flex-col items-center">
            <Heart className="h-7 w-7 text-white drop-shadow-lg" />
            <span className="text-white text-[10px] mt-0.5 font-medium drop-shadow-lg">
              {formatNumber(currentVideo.likesCount || 0)}
            </span>
          </button>

          <button className="flex flex-col items-center">
            <MessageCircle className="h-7 w-7 text-white drop-shadow-lg" />
            <span className="text-white text-[10px] mt-0.5 font-medium drop-shadow-lg">
              {formatNumber(currentVideo.commentsCount || 0)}
            </span>
          </button>

          <button className="flex flex-col items-center">
            <Send className="h-7 w-7 text-white drop-shadow-lg" />
          </button>

          <button className="flex flex-col items-center">
            <Bookmark className="h-7 w-7 text-white drop-shadow-lg" />
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
              src={currentVideo.author?.profilePictureUrl || 'https://via.placeholder.com/40'}
              alt={currentVideo.author?.username}
              className="w-8 h-8 rounded-full border-2 border-white mr-2"
            />
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-sm drop-shadow-lg">
                  @{currentVideo.author?.username || 'user'}
                </span>
                <FollowButton 
                  user={currentVideo.author} 
                  variant="outline" 
                  size="sm"
                />
              </div>
            </div>
          </div>
          
          {/* Caption */}
          {currentVideo.caption && (
            <div className="mb-2 text-xs drop-shadow-lg max-w-[200px]">
              <p className="line-clamp-2">{currentVideo.caption}</p>
            </div>
          )}
          
          {/* Location */}
          {currentVideo.location && (
            <div className="text-xs opacity-90 drop-shadow-lg">
              📍 {currentVideo.location}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoViewer;