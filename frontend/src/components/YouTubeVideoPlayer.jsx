import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import YouTubeAdPlayer from './YouTubeAdPlayer';

// Simple icon components
const Play = () => <span>▶️</span>;
const Pause = () => <span>⏸️</span>;
const Volume2 = () => <span>🔊</span>;
const VolumeX = () => <span>🔇</span>;
const Maximize = () => <span>⛶</span>;
const Settings = () => <span>⚙️</span>;
const MoreHorizontal = () => <span>⋯</span>;

const YouTubeVideoPlayer = ({ video, onVideoEnd, autoplay = false }) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  
  // Advertisement related states
  const [currentAd, setCurrentAd] = useState(null);
  const [showingAd, setShowingAd] = useState(false);
  const [adLoading, setAdLoading] = useState(false);
  const [hasPlayedPreRoll, setHasPlayedPreRoll] = useState(false);
  
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const controlsTimeout = useRef(null);
  const progressInterval = useRef(null);

  // Load pre-roll advertisement when component mounts (only once)
  useEffect(() => {
    if (!hasPlayedPreRoll && video && !adLoading && !currentAd) {
      loadPreRollAd();
    }
  }, [video, hasPlayedPreRoll]);

  // Auto-play logic
  useEffect(() => {
    if (autoplay && !showingAd && videoRef.current && hasPlayedPreRoll) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  }, [autoplay, showingAd, hasPlayedPreRoll]);

  // Progress tracking
  useEffect(() => {
    if (isPlaying && !showingAd) {
      progressInterval.current = setInterval(() => {
        if (videoRef.current) {
          setCurrentTime(videoRef.current.currentTime);
          
          // Check if video ended
          if (videoRef.current.ended) {
            handleVideoEnd();
          }
        }
      }, 100);
    } else {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [isPlaying, showingAd]);

  const loadPreRollAd = async () => {
    setAdLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/ads/youtube?category=${video.category || 'general'}`);
      const data = await response.json();
      
      if (data.ad) {
        setCurrentAd(data.ad);
        setShowingAd(true);
      } else {
        // No ad available, proceed with video
        setHasPlayedPreRoll(true);
      }
    } catch (error) {
      console.log('Backend not available - using fallback advertisement');
      // Use a working fallback ad with a real video URL
      const fallbackAd = {
        id: 'fallback-ad-1',
        title: 'Revolutionary Laptop Experience',
        description: 'Transform your digital workflow with our revolutionary laptop series. Advanced AI features, lightning-fast SSD storage, and professional-grade graphics.',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        duration: 30,
        advertiser: {
          name: 'Digital Innovation Corp',
          website: 'https://digital-innovation.example.com'
        },
        skipAfter: 5,
        isSkippable: true,
        showShopNow: true,
        shopNowUrl: 'https://digital-innovation.example.com/laptops',
        shopNowText: 'Get Yours Today!'
      };
      
      setCurrentAd(fallbackAd);
      setShowingAd(true);
    } finally {
      setAdLoading(false);
    }
  };

  const handleAdComplete = () => {
    setShowingAd(false);
    setCurrentAd(null);
    setHasPlayedPreRoll(true);
    
    // Start the main video automatically after ad
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(error => {
          console.log('Auto-play after ad failed:', error);
        });
        setIsPlaying(true);
      }
    }, 300);
  };

  const handleAdSkip = () => {
    handleAdComplete();
  };

  const handleShopNowClick = (url) => {
    console.log('Shop now clicked:', url);
    // Analytics can be tracked here
  };

  const handlePlayPause = () => {
    if (showingAd) return; // Don't allow play/pause during ads
    
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

  const handleVolumeChange = (newVolume) => {
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const handleProgressClick = (e) => {
    if (showingAd || !videoRef.current) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleFullscreenToggle = () => {
    if (!document.fullscreenElement) {
      playerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    setCurrentTime(duration);
    onVideoEnd?.();
  };

  const handleMouseMove = () => {
    setShowControls(true);
    clearTimeout(controlsTimeout.current);
    controlsTimeout.current = setTimeout(() => {
      if (isPlaying && !showingAd) {
        setShowControls(false);
      }
    }, 3000);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  if (!video) {
    return (
      <div className="w-full aspect-video bg-gray-900 flex items-center justify-center">
        <p className="text-white">No video selected</p>
      </div>
    );
  }

  return (
    <div 
      ref={playerRef}
      className="relative w-full bg-black group"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Main Video Player */}
      <div className="relative w-full aspect-video">
        <video
          ref={videoRef}
          src={video.videoUrl}
          className="w-full h-full object-contain"
          muted={isMuted}
          onLoadedMetadata={handleLoadedMetadata}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={handleVideoEnd}
          playsInline
        />

        {/* Loading State */}
        {adLoading && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
              <p>Loading advertisement...</p>
            </div>
          </div>
        )}

        {/* Video Controls Overlay */}
        {!showingAd && (
          <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0'
          }`}>
            
            {/* Center Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Button
                onClick={handlePlayPause}
                variant="ghost"
                size="lg"
                className={`w-16 h-16 rounded-full bg-black/40 hover:bg-black/60 text-white transition-opacity ${
                  isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
                }`}
              >
                {isPlaying ? <Pause /> : <Play />}
              </Button>
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
              
              {/* Progress Bar */}
              <div 
                className="w-full h-1 bg-gray-600 rounded cursor-pointer hover:h-2 transition-all"
                onClick={handleProgressClick}
              >
                <div 
                  className="h-full bg-red-600 rounded transition-all"
                  style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                />
              </div>
              
              {/* Control Buttons */}
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center space-x-4">
                  <Button onClick={handlePlayPause} variant="ghost" size="sm" className="text-white hover:bg-white/20">
                    {isPlaying ? <Pause /> : <Play />}
                  </Button>
                  
                  <Button onClick={handleMuteToggle} variant="ghost" size="sm" className="text-white hover:bg-white/20">
                    {isMuted ? <VolumeX /> : <Volume2 />}
                  </Button>
                  
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                    className="w-20 h-1 bg-gray-600 rounded appearance-none slider"
                  />
                  
                  <span className="text-sm">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                    <Settings />
                  </Button>
                  
                  <Button onClick={handleFullscreenToggle} variant="ghost" size="sm" className="text-white hover:bg-white/20">
                    <Maximize />
                  </Button>
                  
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                    <MoreHorizontal />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Advertisement Player Overlay */}
      <YouTubeAdPlayer
        ad={currentAd}
        isVisible={showingAd}
        onAdComplete={handleAdComplete}
        onAdSkip={handleAdSkip}
        onShopNowClick={handleShopNowClick}
      />

      {/* Video Info */}
      {!showingAd && (
        <div className="p-4 bg-white">
          <h2 className="text-xl font-bold mb-2">{video.title}</h2>
          <div className="flex items-center justify-between text-gray-600 text-sm mb-2">
            <span>{video.views?.toLocaleString()} views</span>
            <div className="flex items-center space-x-4">
              <span>{video.likes?.toLocaleString()} likes</span>
              <span>{video.commentCount?.toLocaleString()} comments</span>
            </div>
          </div>
          <p className="text-gray-700">{video.description}</p>
        </div>
      )}


    </div>
  );
};

export default YouTubeVideoPlayer;