import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  MdSearch, 
  MdCameraAlt, 
  MdMenu, 
  MdThumbUp, 
  MdThumbDown, 
  MdComment, 
  MdShare,
  MdVerified,
  MdPlayArrow,
  MdPause,
  MdVolumeUp,
  MdVolumeOff,
  MdSkipNext,
  MdSkipPrevious,
  MdKeyboardArrowUp,
  MdKeyboardArrowDown
} from 'react-icons/md';
import { SiYoutubeshorts } from 'react-icons/si';
import { BiVolumeFull } from 'react-icons/bi';
import { 
  fetchShorts, 
  setCurrentShortIndex, 
  toggleVideoLike, 
  toggleVideoDislike,
  toggleChannelSubscription
} from '../../store/youtubeSlice';

const Shorts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const containerRef = useRef();
  const videoRef = useRef(null);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true); // Start muted for autoplay
  const [isBuffering, setIsBuffering] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isLooping, setIsLooping] = useState(true);
  const [autoplayEnabled, setAutoplayEnabled] = useState(true);

  const { 
    shorts, 
    currentShortIndex, 
    shortsLoading, 
    shortsError,
    likedVideos,
    dislikedVideos,
    subscribedChannels
  } = useSelector(state => state.youtube);

  useEffect(() => {
    dispatch(fetchShorts());
  }, [dispatch]);

  // Auto-play current video
  useEffect(() => {
    if (currentShort && videoRef.current && autoplayEnabled) {
      const timer = setTimeout(() => {
        videoRef.current.play().catch(error => {
          console.log('Auto-play prevented:', error.message);
          setIsPlaying(false);
        });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [currentShort, currentShortIndex, autoplayEnabled]);

  // Handle video ended - move to next or loop
  const handleVideoEnded = () => {
    if (isLooping && currentShorts.length === 1) {
      // Loop single video
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    } else {
      // Move to next video in circular fashion
      const nextIndex = (currentShortIndex + 1) % currentShorts.length;
      dispatch(setCurrentShortIndex(nextIndex));
    }
  };

  // Update progress
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(progress || 0);
    }
  };

  // Generate realistic shorts if none exist
  const generateMockShorts = () => {
    const mockShorts = [
      {
        _id: 'short1',
        title: 'Amazing Coding Tips in 60 Seconds',
        thumbnailUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDQwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNjAwIiBmaWxsPSIjRkYwMDAwIi8+Cjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSIzMCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIj5TaG9ydCAxPC90ZXh0Pgo8L3N2Zz4=',
        videoUrl: '/assests/samplevideos/VID-20251128-WA0001.mp4',
        views: 1200000,
        duration: 45,
        channelId: {
          _id: 'ch1',
          name: 'TechShorts',
          handle: '@techshorts',
          avatarUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjUiIGN5PSIyNSIgcj0iMjUiIGZpbGw9IiMwMDY2Q0MiLz4KPHRleHQgeD0iNTAlIiB5PSI1NSUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjE4IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiPlQ8L3RleHQ+Cjwvc3ZnPg==',
          verified: true
        },
        likes: 45000,
        dislikes: 1200,
        commentCount: 3400
      },
      {
        _id: 'short2',
        title: 'Quick Recipe: 30 Second Pasta',
        thumbnailUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDQwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNjAwIiBmaWxsPSIjMDBBQTAwIi8+Cjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSIzMCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIj5TaG9ydCAyPC90ZXh0Pgo8L3N2Zz4=',
        videoUrl: '/assests/samplevideos/VID-20251128-WA0002.mp4',
        views: 850000,
        duration: 30,
        channelId: {
          _id: 'ch2',
          name: 'QuickCook',
          handle: '@quickcook',
          avatarUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjUiIGN5PSIyNSIgcj0iMjUiIGZpbGw9IiNGRjY2MDAiLz4KPHRleHQgeD0iNTAlIiB5PSI1NSUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjE4IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiPlE8L3RleHQ+Cjwvc3ZnPg==',
          verified: false
        },
        likes: 32000,
        dislikes: 800,
        commentCount: 1200
      }
    ];
    return mockShorts;
  };

  const displayShorts = shorts.length > 0 ? shorts : generateMockShorts();
  const currentShorts = displayShorts || [];
  const currentShort = currentShorts[currentShortIndex] || currentShorts[0] || null;

  // Handle swipe gestures
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientY);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isUpSwipe = distance > 50;
    const isDownSwipe = distance < -50;

    // Circular navigation
    if (isUpSwipe) {
      const nextIndex = (currentShortIndex + 1) % currentShorts.length;
      dispatch(setCurrentShortIndex(nextIndex));
    }
    if (isDownSwipe) {
      const prevIndex = currentShortIndex === 0 ? currentShorts.length - 1 : currentShortIndex - 1;
      dispatch(setCurrentShortIndex(prevIndex));
    }
  };

  // Video control functions
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const navigateToNext = () => {
    const nextIndex = (currentShortIndex + 1) % currentShorts.length;
    dispatch(setCurrentShortIndex(nextIndex));
  };

  const navigateToPrev = () => {
    const prevIndex = currentShortIndex === 0 ? currentShorts.length - 1 : currentShortIndex - 1;
    dispatch(setCurrentShortIndex(prevIndex));
  };

  // Hide controls after inactivity
  useEffect(() => {
    const timer = setTimeout(() => setShowControls(false), 3000);
    return () => clearTimeout(timer);
  }, [showControls]);

  const handleLike = () => {
    if (!currentShort) return;
    const action = likedVideos.includes(currentShort._id) ? 'unlike' : 'like';
    dispatch(toggleVideoLike(currentShort._id));
    // Also update backend
    dispatch({ 
      type: 'youtube/likeVideo', 
      payload: { videoId: currentShort._id, action }
    });
  };

  const handleDislike = () => {
    if (!currentShort) return;
    const action = dislikedVideos.includes(currentShort._id) ? 'remove_dislike' : 'dislike';
    dispatch(toggleVideoDislike(currentShort._id));
    // Also update backend
    dispatch({ 
      type: 'youtube/dislikeVideo', 
      payload: { videoId: currentShort._id, action }
    });
  };

  const handleVideoEnd = () => {
    // Auto-advance to next short in circular fashion
    navigateToNext();
  };

  const handleVideoLoad = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setIsPlaying(true);
      setIsBuffering(false);
    }
  };

  // Auto-play when video changes
  useEffect(() => {
    if (videoRef.current && currentShort) {
      videoRef.current.load();
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch(error => {
            console.log('Autoplay prevented:', error);
            setIsPlaying(false);
          });
      }
    }
  }, [currentShort]);

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const goToNextShort = () => {
    const nextIndex = (currentShortIndex + 1) % displayShorts.length;
    dispatch(setCurrentShortIndex(nextIndex));
  };

  const goToPrevShort = () => {
    const prevIndex = currentShortIndex === 0 ? displayShorts.length - 1 : currentShortIndex - 1;
    dispatch(setCurrentShortIndex(prevIndex));
  };

  const handleSubscribe = () => {
    if (!currentShort) return;
    dispatch(toggleChannelSubscription(currentShort.channelId._id));
  };

  const formatCount = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  if (shortsLoading && shorts.length === 0) {
    return (
      <div className="h-full flex justify-center items-center bg-black">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  if (shortsError) {
    return (
      <div className="h-full flex flex-col justify-center items-center bg-black text-white">
        <p className="mb-4">Error loading Shorts: {shortsError}</p>
        <button 
          onClick={() => dispatch(fetchShorts())}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!currentShort) {
    return (
      <div className="h-full flex flex-col justify-center items-center bg-black text-white p-4">
        <p className="mb-2">No Shorts available</p>
        <p className="text-sm text-gray-400 mb-4">
          Shorts: {shorts.length}, Display: {displayShorts.length}, Index: {currentShortIndex}
        </p>
        <button 
          onClick={() => dispatch(fetchShorts())}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Reload Shorts
        </button>
      </div>
    );
  }

  return (
    <div 
      className="h-full bg-black text-white relative overflow-hidden"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      ref={containerRef}
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-4">
        <div className="flex items-center space-x-2">
          <SiYoutubeshorts className="w-6 h-6 text-red-500" />
          <span className="text-lg font-medium">Shorts</span>
        </div>
        <div className="flex items-center space-x-4">
          <MdSearch className="w-6 h-6" />
          <MdCameraAlt className="w-6 h-6" />
          <MdMenu className="w-6 h-6" />
        </div>
      </div>

      {/* Video Container */}
      <div className="h-full w-full flex items-center justify-center">
        {/* Video Player */}
        <div className="relative w-full h-full max-w-sm mx-auto bg-gray-900">
          <video
            ref={videoRef}
            src={currentShort.videoUrl || '/assests/samplevideos/VID-20251128-WA0001.mp4'}
            className="w-full h-full object-cover"
            poster={currentShort.thumbnailUrl}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            onEnded={handleVideoEnd}
            onLoadStart={handleVideoLoad}
            onCanPlay={() => setIsBuffering(false)}
            onWaiting={() => setIsBuffering(true)}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onClick={handleVideoClick}
            preload="metadata"
          />
          
          {/* Video Controls Overlay */}
          <div 
            className={`absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30 transition-opacity duration-300 ${
              showControls ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={() => setShowControls(true)}
          >
            {/* Play/Pause Button */}
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center">
                <button 
                  onClick={togglePlayPause}
                  className="w-20 h-20 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm"
                >
                  <div className="w-0 h-0 border-l-8 border-l-white border-t-6 border-b-6 border-t-transparent border-b-transparent ml-2"></div>
                </button>
              </div>
            )}
            
            {/* Progress Bar */}
            <div className="absolute bottom-20 left-4 right-16">
              <div className="w-full bg-white/20 rounded-full h-1">
                <div 
                  className="bg-white rounded-full h-1 transition-all duration-100"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
            
            {/* Navigation Arrows */}
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <button 
                onClick={navigateToPrev}
                className="w-12 h-12 bg-black/30 rounded-full flex items-center justify-center backdrop-blur-sm"
              >
                <div className="w-0 h-0 border-r-6 border-r-white border-t-4 border-b-4 border-t-transparent border-b-transparent"></div>
              </button>
            </div>
            
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <button 
                onClick={navigateToNext}
                className="w-12 h-12 bg-black/30 rounded-full flex items-center justify-center backdrop-blur-sm"
              >
                <div className="w-0 h-0 border-l-6 border-l-white border-t-4 border-b-4 border-t-transparent border-b-transparent"></div>
              </button>
            </div>
          </div>
          
          {/* Loading Spinner */}
          {isBuffering && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
              <div className="animate-spin rounded-full h-12 w-12 border-3 border-white border-t-transparent"></div>
            </div>
          )}
        </div>

        {/* Action Overlay (Right Side) */}
        <div className="absolute right-4 bottom-20 flex flex-col space-y-4 z-40">
          {/* Volume Control */}
          <div className="flex flex-col items-center">
            <button 
              onClick={toggleMute}
              className={`p-3 rounded-full ${
                isMuted ? 'bg-red-600' : 'bg-black bg-opacity-50'
              }`}
            >
              {isMuted ? (
                <MdVolumeOff className="w-5 h-5 text-white" />
              ) : (
                <BiVolumeFull className="w-5 h-5 text-white" />
              )}
            </button>
            <span className="text-xs mt-1 text-white">{isMuted ? 'Muted' : 'Sound'}</span>
          </div>
          
          {/* Autoplay Toggle */}
          <div className="flex flex-col items-center">
            <button 
              onClick={() => setAutoplayEnabled(!autoplayEnabled)}
              className={`p-3 rounded-full ${
                autoplayEnabled ? 'bg-green-600' : 'bg-black bg-opacity-50'
              }`}
            >
              <div className="text-white text-xs font-bold">AUTO</div>
            </button>
            <span className="text-xs mt-1 text-white">{autoplayEnabled ? 'On' : 'Off'}</span>
          </div>
          {/* Like */}
          <div className="flex flex-col items-center">
            <button 
              onClick={handleLike}
              className={`p-3 rounded-full ${
                likedVideos.includes(currentShort._id) 
                  ? 'bg-blue-600' 
                  : 'bg-black bg-opacity-50'
              }`}
            >
              <MdThumbUp className={`w-6 h-6 ${
                likedVideos.includes(currentShort._id) ? 'text-white' : 'text-white'
              }`} />
            </button>
            <span className="text-xs mt-1">{formatCount(currentShort.likes)}</span>
          </div>

          {/* Dislike */}
          <div className="flex flex-col items-center">
            <button 
              onClick={handleDislike}
              className={`p-3 rounded-full ${
                dislikedVideos.includes(currentShort._id) 
                  ? 'bg-red-600' 
                  : 'bg-black bg-opacity-50'
              }`}
            >
              <MdThumbDown className={`w-6 h-6 ${
                dislikedVideos.includes(currentShort._id) ? 'text-white' : 'text-white'
              }`} />
            </button>
            <span className="text-xs mt-1">{formatCount(currentShort.dislikes)}</span>
          </div>

          {/* Comment */}
          <div className="flex flex-col items-center">
            <button className="p-3 bg-black bg-opacity-50 rounded-full">
              <MdComment className="w-6 h-6 text-white" />
            </button>
            <span className="text-xs mt-1">{formatCount(currentShort.commentCount || 0)}</span>
          </div>

          {/* Share */}
          <div className="flex flex-col items-center">
            <button className="p-3 bg-black bg-opacity-50 rounded-full">
              <MdShare className="w-6 h-6 text-white" />
            </button>
            <span className="text-xs mt-1">Share</span>
          </div>

          {/* Remix */}
          <div className="flex flex-col items-center">
            <button className="p-3 bg-black bg-opacity-50 rounded-full">
              <BiVolumeFull className="w-6 h-6 text-white" />
            </button>
            <span className="text-xs mt-1">Remix</span>
          </div>
        </div>

        {/* Metadata Overlay (Bottom) */}
        <div className="absolute bottom-0 left-0 right-0 p-4 z-40">
          <div className="flex items-center space-x-3 mb-4">
            {/* Channel Info */}
            <img 
              src={currentShort.channelId?.avatarUrl}
              alt={currentShort.channelId?.name}
              className="w-10 h-10 rounded-full"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/40x40/808080/ffffff?text=C';
              }}
            />
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-medium">{currentShort.channelId?.name}</span>
                {currentShort.channelId?.verified && (
                  <MdVerified className="w-4 h-4 text-gray-400" />
                )}
              </div>
              <span className="text-sm text-gray-300">
                {formatCount(currentShort.channelId?.subscriberCount || 0)} subscribers
              </span>
            </div>
            <button 
              onClick={handleSubscribe}
              className={`px-4 py-1.5 rounded text-sm font-medium ${
                subscribedChannels.includes(currentShort.channelId?._id)
                  ? 'bg-gray-700 text-white'
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              {subscribedChannels.includes(currentShort.channelId?._id) ? 'Subscribed' : 'Subscribe'}
            </button>
          </div>

          {/* Caption */}
          <p className="text-sm text-white mb-2 line-clamp-2">
            {currentShort.description || currentShort.title}
          </p>

          {/* Music Ticker */}
          <div className="flex items-center space-x-2 text-xs text-gray-300">
            <BiVolumeFull className="w-4 h-4" />
            <div className="animate-scroll">
              <span>Original audio • {currentShort.channelId?.name}</span>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="flex justify-center space-x-1 mt-4">
            {shorts.map((_, index) => (
              <div 
                key={index}
                className={`h-1 rounded-full transition-all ${
                  index === currentShortIndex 
                    ? 'bg-white w-6' 
                    : 'bg-gray-600 w-1'
                }`}
              />
            ))}
          </div>
        </div>
        
        {/* Video Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1 z-40">
          {currentShorts.map((_, index) => (
            <div
              key={index}
              className={`h-1 rounded-full transition-all duration-300 ${
                index === currentShortIndex 
                  ? 'bg-white w-6' 
                  : 'bg-gray-600 w-1'
              }`}
            />
          ))}
        </div>
        
        {/* Video Info Overlay (Bottom Left) */}
        <div className="absolute bottom-20 left-4 right-20 z-40">
          <div className="text-white">
            <h3 className="font-medium text-sm mb-1 line-clamp-2">{currentShort.title}</h3>
            <div className="flex items-center space-x-2 text-xs text-gray-200">
              <span>{formatCount(currentShort.views)} views</span>
              <span>•</span>
              <span>#{currentShort.channelId?.name}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Video Progress Indicators */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {displayShorts.map((_, index) => (
          <div
            key={index}
            className={`h-1 rounded-full transition-all duration-300 ${
              index === currentShortIndex 
                ? 'bg-white w-8' 
                : 'bg-gray-500 w-2'
            }`}
          />
        ))}
      </div>
      
      {/* Navigation Arrows (Desktop) */}
      <button 
        onClick={navigateToPrev}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black bg-opacity-50 rounded-full items-center justify-center hidden sm:flex hover:bg-opacity-70 transition-all"
      >
        <MdKeyboardArrowUp className="w-6 h-6 text-white transform rotate-180" />
      </button>
      
      <button 
        onClick={navigateToNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black bg-opacity-50 rounded-full items-center justify-center hidden sm:flex hover:bg-opacity-70 transition-all"
      >
        <MdKeyboardArrowDown className="w-6 h-6 text-white" />
      </button>
    </div>
  );
};

export default Shorts;