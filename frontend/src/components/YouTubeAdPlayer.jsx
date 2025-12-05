import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';

// Simple icon components
const X = () => <span>✕</span>;
const ExternalLink = () => <span>🔗</span>;
const Play = () => <span>▶️</span>;
const Pause = () => <span>⏸️</span>;
const Volume2 = () => <span>🔊</span>;
const VolumeX = () => <span>🔇</span>;

const YouTubeAdPlayer = ({ 
  ad, 
  onAdComplete, 
  onAdSkip, 
  onShopNowClick,
  isVisible = false 
}) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [canSkip, setCanSkip] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showShopNow, setShowShopNow] = useState(false);
  const [adEnded, setAdEnded] = useState(false);
  const videoRef = useRef(null);
  const progressInterval = useRef(null);

  useEffect(() => {
    if (isVisible && ad && videoRef.current) {
      // Auto-play the ad when it becomes visible
      videoRef.current.play();
      setIsPlaying(true);
      
      // Start progress tracking
      progressInterval.current = setInterval(() => {
        if (videoRef.current) {
          const time = videoRef.current.currentTime;
          setCurrentTime(time);
          
          // Show skip button after specified time
          if (time >= ad.skipAfter && ad.isSkippable) {
            setCanSkip(true);
          }
          
          // Show shop now button after 2 seconds
          if (time >= 2 && ad.showShopNow) {
            setShowShopNow(true);
          }
          
          // Check if ad ended
          if (time >= ad.duration - 0.5) {
            setAdEnded(true);
            clearInterval(progressInterval.current);
            setTimeout(() => {
              handleAdComplete();
            }, 500);
          }
        }
      }, 100);

      // Track ad view
      trackAdView();
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [isVisible, ad]);

  const trackAdView = async () => {
    if (!ad || ad.id.includes('fallback')) return; // Skip tracking for fallback ads
    try {
      await fetch(`http://localhost:5000/api/ads/${ad.id}/view`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      // Silently fail for tracking - don't spam console
    }
  };

  const trackAdClick = async (type = 'shop_now') => {
    if (!ad || ad.id.includes('fallback')) return; // Skip tracking for fallback ads
    try {
      await fetch(`http://localhost:5000/api/ads/${ad.id}/click`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ type })
      });
    } catch (error) {
      // Silently fail for tracking - don't spam console
    }
  };

  const trackAdComplete = async (wasSkipped = false) => {
    if (!ad || ad.id.includes('fallback')) return; // Skip tracking for fallback ads
    try {
      await fetch(`http://localhost:5000/api/ads/${ad.id}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          watchTime: currentTime, 
          wasSkipped 
        })
      });
    } catch (error) {
      // Silently fail for tracking - don't spam console
    }
  };

  const handleSkip = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (canSkip && ad.isSkippable) {
      console.log('Skipping ad:', ad.title);
      trackAdComplete(true);
      setAdEnded(true);
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
      onAdSkip?.();
    }
  };

  const handleAdComplete = () => {
    console.log('Ad completed:', ad?.title);
    trackAdComplete(false);
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
    onAdComplete?.();
  };

  const handleShopNowClick = () => {
    trackAdClick('shop_now');
    onShopNowClick?.(ad.shopNowUrl);
    
    // Open shop now URL in new tab
    if (ad.shopNowUrl) {
      window.open(ad.shopNowUrl, '_blank');
    }
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isVisible || !ad) {
    return null;
  }

  return (
    <div className="absolute inset-0 bg-black z-50">
      {/* Video Player - Constrained to mobile viewport */}
      <div className="relative w-full h-full">
        <video
          ref={videoRef}
          src={ad.videoUrl}
          className="w-full h-full object-cover"
          muted={isMuted}
          playsInline
          onEnded={handleAdComplete}
        />
        
        {/* Ad Overlay Controls */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none">
          
          {/* Top Bar - Ad Info */}
          <div className="absolute top-2 left-2 right-2 flex justify-between items-center pointer-events-auto">
            <div className="flex items-center space-x-1 text-white">
              <div className="bg-yellow-500 text-black px-1.5 py-0.5 rounded text-xs font-semibold">
                AD
              </div>
              <span className="text-xs">
                {formatTime(Math.max(0, ad.duration - currentTime))} left
              </span>
            </div>
            
            {/* Skip Button */}
            {canSkip && ad.isSkippable && !adEnded && (
              <Button 
                onClick={handleSkip}
                variant="secondary"
                size="sm"
                className="bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 text-xs px-2 py-1 z-50 cursor-pointer"
                style={{ pointerEvents: 'auto' }}
              >
                <X /> 
                Skip
              </Button>
            )}
            
            {/* Non-skippable countdown */}
            {!canSkip && ad.isSkippable && (
              <div className="text-white text-xs bg-black/60 px-2 py-1 rounded">
                Skip in {Math.max(0, Math.ceil(ad.skipAfter - currentTime))}s
              </div>
            )}
          </div>

          {/* Center Play/Pause Button */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
            <Button
              onClick={handlePlayPause}
              variant="ghost"
              size="md"
              className="w-12 h-12 rounded-full bg-black/40 hover:bg-black/60 text-white"
            >
              {isPlaying ? 
                <Pause /> : 
                <Play />
              }
            </Button>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-2 left-2 right-2 pointer-events-auto">
            
            {/* Progress Bar */}
            <div className="mb-2">
              <Progress 
                value={(currentTime / ad.duration) * 100} 
                className="h-1 bg-gray-600"
              />
            </div>
            
            <div className="flex items-center justify-between">
              
              {/* Left Side - Ad Info */}
              <div className="flex items-center space-x-2 text-white flex-1">
                <Button
                  onClick={handleMuteToggle}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 p-1"
                >
                  {isMuted ? 
                    <VolumeX /> : 
                    <Volume2 />
                  }
                </Button>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold truncate">{ad.title}</h3>
                  <p className="text-xs text-gray-300 truncate">{ad.advertiser.name}</p>
                  {/* Move description here and make it compact */}
                  <p className="text-gray-300 text-xs mt-1 line-clamp-1 truncate opacity-80">
                    {ad.description}
                  </p>
                </div>
              </div>
              
              {/* Right Side - Shop Now Button */}
              {showShopNow && ad.showShopNow && !adEnded && (
                <Button
                  onClick={handleShopNowClick}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3 py-1 rounded text-xs transform transition-all hover:scale-105 shadow-lg ml-2 flex-shrink-0"
                >
                  <ExternalLink /> 
                  {ad.shopNowText}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YouTubeAdPlayer;