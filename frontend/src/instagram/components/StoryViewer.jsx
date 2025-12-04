import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Heart, Send, MoreHorizontal, Volume2, VolumeX } from 'lucide-react';
import { trackInteraction, trackViewDuration } from '../../services/analyticsApi';
import FollowButton from './FollowButton';

const StoryViewer = ({ stories, initialIndex = 0, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [viewStartTime, setViewStartTime] = useState(Date.now());
  const progressIntervalRef = useRef(null);
  const videoRef = useRef(null);

  const currentStory = stories[currentIndex];
  const duration = currentStory?.duration || 5; // seconds
  const progressIncrement = 100 / (duration * 10); // 10 updates per second

  useEffect(() => {
    setViewStartTime(Date.now());
    setProgress(0);
    
    // Track story view
    if (currentStory) {
      trackInteraction(currentStory._id, 'story', 'view');
    }

    return () => {
      // Track view duration when component unmounts or story changes
      if (currentStory) {
        const duration = Date.now() - viewStartTime;
        trackViewDuration(currentStory._id, 'story', duration);
      }
    };
  }, [currentIndex, currentStory]);

  useEffect(() => {
    if (!isPaused && !progressIntervalRef.current) {
      progressIntervalRef.current = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + progressIncrement;
          if (newProgress >= 100) {
            handleNext();
            return 0;
          }
          return newProgress;
        });
      }, 100);
    } else if (isPaused && progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    };
  }, [isPaused, progressIncrement]);

  const handleNext = () => {
    // Track view duration before switching
    if (currentStory) {
      const duration = Date.now() - viewStartTime;
      trackViewDuration(currentStory._id, 'story', duration);
    }

    if (currentIndex < stories.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    // Track view duration before switching
    if (currentStory) {
      const duration = Date.now() - viewStartTime;
      trackViewDuration(currentStory._id, 'story', duration);
    }

    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    } else {
      onClose();
    }
  };

  const handleTap = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    
    if (x < width / 2) {
      handlePrevious();
    } else {
      handleNext();
    }
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
    
    if (videoRef.current) {
      if (isPaused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const storyTime = new Date(timestamp);
    const diffInHours = Math.floor((now - storyTime) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'now';
    if (diffInHours < 24) return `${diffInHours}h`;
    return '1d';
  };

  if (!currentStory) return null;

  return (
    <div className="absolute inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center">
      {/* Story Progress Bars */}
      <div className="absolute top-4 left-4 right-4 z-10">
        <div className="flex space-x-1">
          {stories.map((_, index) => (
            <div key={index} className="flex-1 h-0.5 bg-white bg-opacity-30 rounded">
              <div 
                className="h-full bg-white rounded transition-all duration-100"
                style={{
                  width: index < currentIndex ? '100%' : 
                         index === currentIndex ? `${progress}%` : '0%'
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Story Header */}
      <div className="absolute top-8 left-4 right-4 z-10 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img
            src={currentStory.author?.profilePictureUrl || 'https://via.placeholder.com/40'}
            alt={currentStory.author?.username}
            className="w-8 h-8 rounded-full border border-white"
          />
          <span className="text-white font-medium text-sm">
            {currentStory.author?.username}
          </span>
          <span className="text-white text-opacity-80 text-sm">
            {formatTimestamp(currentStory.createdAt)}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {currentStory.mediaType === 'video' && (
            <button
              onClick={toggleMute}
              className="p-2 bg-black bg-opacity-50 rounded-full"
            >
              {isMuted ? 
                <VolumeX className="w-5 h-5 text-white" /> : 
                <Volume2 className="w-5 h-5 text-white" />
              }
            </button>
          )}
          <button className="p-2 bg-black bg-opacity-50 rounded-full">
            <MoreHorizontal className="w-5 h-5 text-white" />
          </button>
          <button 
            onClick={onClose}
            className="p-2 bg-black bg-opacity-50 rounded-full"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Story Content */}
      <div 
        className="w-full h-full flex items-center justify-center cursor-pointer"
        onClick={handleTap}
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {currentStory.mediaType === 'video' ? (
          <video
            ref={videoRef}
            src={currentStory.mediaUrl}
            className="max-w-full max-h-full object-contain"
            autoPlay
            muted={isMuted}
            playsInline
          />
        ) : (
          <img
            src={currentStory.mediaUrl}
            alt="Story"
            className="max-w-full max-h-full object-contain"
          />
        )}

        {/* Caption Overlay */}
        {currentStory.caption && (
          <div className="absolute bottom-20 left-4 right-4 z-10">
            <p className="text-white text-sm bg-black bg-opacity-50 rounded-lg p-3">
              {currentStory.caption}
            </p>
          </div>
        )}
      </div>

      {/* Navigation Arrows (Desktop) */}
      <button
        onClick={handlePrevious}
        className="hidden md:block absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-all"
        style={{ zIndex: 20 }}
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={handleNext}
        className="hidden md:block absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-all"
        style={{ zIndex: 20 }}
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Story Interaction Bar */}
      <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center space-x-3">
        <div className="flex-1 bg-black bg-opacity-20 rounded-full px-4 py-2 backdrop-blur-sm">
          <input
            type="text"
            placeholder="Send message"
            className="w-full bg-transparent text-white placeholder-white placeholder-opacity-70 outline-none text-sm"
          />
        </div>
        <button className="p-3 bg-black bg-opacity-20 rounded-full backdrop-blur-sm">
          <Heart className="w-5 h-5 text-white" />
        </button>
        <button className="p-3 bg-black bg-opacity-20 rounded-full backdrop-blur-sm">
          <Send className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
};

export default StoryViewer;