import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  MdArrowBack, 
  MdThumbUp, 
  MdThumbDown, 
  MdShare, 
  MdDownload,
  MdVerified,
  MdExpandMore,
  MdExpandLess,
  MdPlayArrow,
  MdPause,
  MdVolumeUp,
  MdFullscreen
} from 'react-icons/md';
import { BiVolumeFull } from 'react-icons/bi';
import { 
  fetchVideoDetails, 
  fetchRecommendations,
  likeVideo,
  dislikeVideo,
  toggleChannelSubscription
} from '../../store/youtubeSlice';
import VideoCard from '../components/VideoCard';
import CommentsModal from '../components/CommentsModal';

const Watch = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isPlaying, setIsPlaying] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);
  const [sessionId, setSessionId] = useState(null);
  const [watchStartTime, setWatchStartTime] = useState(null);
  const [totalPausedDuration, setTotalPausedDuration] = useState(0);
  const [lastPauseTime, setLastPauseTime] = useState(null);
  const videoRef = useRef();
  const playerRef = useRef();
  const controlsTimeoutRef = useRef();

  const { 
    currentVideo, 
    recommendations, 
    videoLoading, 
    videoError,
    likedVideos,
    dislikedVideos,
    subscribedChannels
  } = useSelector(state => state.youtube);

  useEffect(() => {
    if (videoId) {
      dispatch(fetchVideoDetails(videoId));
      dispatch(fetchRecommendations(videoId));
    }
  }, [dispatch, videoId]);

  // Start analytics session when video loads
  useEffect(() => {
    if (currentVideo && !sessionId) {
      startWatchSession();
    }
    
    // Cleanup on unmount
    return () => {
      if (sessionId) {
        endWatchSession();
      }
    };
  }, [currentVideo, sessionId]);

  // Auto-play when video loads
  useEffect(() => {
    if (currentVideo && videoRef.current && autoPlay && !isPlaying) {
      const timer = setTimeout(() => {
        if (videoRef.current && videoRef.current.paused) {
          videoRef.current.play().catch(error => {
            console.log('Auto-play prevented:', error.message);
          });
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentVideo, autoPlay, isPlaying]);

  const startWatchSession = async () => {
    if (!currentVideo) return;
    
    try {
      const response = await fetch('http://localhost:5001/api/youtube/analytics/watch/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: '674587d123456789abcdef01', // Valid ObjectId format
          videoId: currentVideo._id,
          channelId: currentVideo.channelId._id,
          source: 'watch',
          category: currentVideo.category
        })
      });
      const data = await response.json();
      setSessionId(data.sessionId);
      setWatchStartTime(Date.now());
    } catch (error) {
      console.error('Failed to start watch session:', error);
    }
  };

  const endWatchSession = async () => {
    if (!sessionId || !watchStartTime) return;
    
    const actualWatchDuration = Math.max(0, (currentTime || 0));
    
    try {
      await fetch('http://localhost:5001/api/youtube/analytics/watch/end', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          pausedDuration: totalPausedDuration,
          actualWatchDuration
        })
      });
    } catch (error) {
      console.error('Failed to end watch session:', error);
    }
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setLastPauseTime(Date.now());
      } else {
        if (lastPauseTime) {
          setTotalPausedDuration(prev => prev + (Date.now() - lastPauseTime));
          setLastPauseTime(null);
        }
        videoRef.current.play();
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration;
      setCurrentTime(current);
      setProgress(current / total);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleProgressClick = (e) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      const newTime = pos * videoRef.current.duration;
      videoRef.current.currentTime = newTime;
    }
  };

  const toggleFullscreen = () => {
    if (playerRef.current) {
      if (!document.fullscreenElement) {
        playerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const showControlsTemporarily = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  const handleLike = async () => {
    if (!currentVideo) return;
    
    try {
      const action = currentVideo.isLikedByUser ? 'unlike' : 'like';
      
      // Use Redux async thunk which handles API call and state updates
      await dispatch(likeVideo({ videoId: currentVideo._id, action }));
      
      // Track interaction analytics
      trackInteraction('like', action);
    } catch (error) {
      console.error('Failed to like video:', error);
    }
  };

  const handleDislike = async () => {
    if (!currentVideo) return;
    
    try {
      const action = currentVideo.isDislikedByUser ? 'undislike' : 'dislike';
      
      // Use Redux async thunk which handles API call and state updates
      await dispatch(dislikeVideo({ videoId: currentVideo._id, action }));
      
      // Track interaction analytics
      trackInteraction('dislike', action);
    } catch (error) {
      console.error('Failed to dislike video:', error);
    }
  };

  const trackInteraction = async (type, action) => {
    try {
      await fetch('http://localhost:5001/api/youtube/analytics/interaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: '674587d123456789abcdef01',
          videoId: currentVideo._id,
          channelId: currentVideo.channelId._id,
          interactionType: type,
          interactionValue: action,
          source: 'watch'
        })
      });
    } catch (error) {
      console.error('Failed to track interaction:', error);
    }
  };

  const handleSubscribe = () => {
    if (!currentVideo) return;
    dispatch(toggleChannelSubscription(currentVideo.channelId._id));
  };

  const formatCount = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getRelativeTime = (date) => {
    const now = new Date();
    const uploadDate = new Date(date);
    const diffTime = Math.abs(now - uploadDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  if (videoLoading) {
    return (
      <div className="h-full flex justify-center items-center bg-black">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  if (videoError || !currentVideo) {
    return (
      <div className="h-full flex flex-col justify-center items-center bg-black text-white">
        <p className="mb-4">Error loading video: {videoError}</p>
        <button 
          onClick={() => navigate('/youtube/home')}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Go Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="h-full bg-white text-gray-900 overflow-hidden">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3 flex items-center">
        <button 
          onClick={() => navigate(-1)}
          className="mr-4 p-2 -ml-2"
        >
          <MdArrowBack className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-medium truncate">{currentVideo.title}</h1>
      </div>

      <div className="h-full pb-0 overflow-y-auto">
        {/* Video Player Container */}
        <div 
          ref={playerRef}
          className="relative bg-black" 
          style={{ aspectRatio: '16/9' }}
          onMouseMove={showControlsTemporarily}
          onMouseLeave={() => isPlaying && setTimeout(() => setShowControls(false), 1000)}
        >
          <video 
            ref={videoRef}
            src={currentVideo.videoUrl.startsWith('http') ? currentVideo.videoUrl : `http://localhost:5001${currentVideo.videoUrl}`}
            poster={currentVideo.thumbnailUrl}
            className="w-full h-full object-cover"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => setIsPlaying(false)}
            onClick={handlePlayPause}
            controls={false}
          />
          
          {/* Video Controls */}
          {(!isPlaying || showControls) && (
            <div className="absolute inset-0 flex items-center justify-center">
              <button 
                onClick={handlePlayPause}
                className="w-16 h-16 bg-black bg-opacity-50 rounded-full flex items-center justify-center hover:bg-opacity-70 transition-all"
              >
                {isPlaying ? (
                  <MdPause className="w-8 h-8 text-white" />
                ) : (
                  <MdPlayArrow className="w-8 h-8 text-white ml-1" />
                )}
              </button>
            </div>
          )}

          {/* Progress Bar */}
          {(!isPlaying || showControls) && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/50 to-transparent p-4">
              <div className="flex items-center space-x-4 mb-2">
                <span className="text-white text-sm">
                  {formatDuration(Math.floor(currentTime))}
                </span>
                <div 
                  className="flex-1 bg-gray-600 h-1 rounded-full cursor-pointer hover:h-2 transition-all"
                  onClick={handleProgressClick}
                >
                  <div 
                    className="bg-red-600 h-full rounded-full transition-all duration-200"
                    style={{ width: `${progress * 100}%` }}
                  />
                </div>
                <span className="text-white text-sm">
                  {formatDuration(Math.floor(duration || currentVideo.duration))}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button onClick={handlePlayPause} className="hover:scale-110 transition-transform">
                    {isPlaying ? (
                      <MdPause className="w-6 h-6 text-white" />
                    ) : (
                      <MdPlayArrow className="w-6 h-6 text-white" />
                    )}
                  </button>
                  <div className="flex items-center space-x-2">
                    <MdVolumeUp className="w-5 h-5 text-white" />
                    <input 
                      type="range" 
                      min="0" 
                      max="1" 
                      step="0.1" 
                      value={volume}
                      onChange={(e) => {
                        const newVolume = parseFloat(e.target.value);
                        setVolume(newVolume);
                        if (videoRef.current) {
                          videoRef.current.volume = newVolume;
                        }
                      }}
                      className="w-16 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
                <button 
                  onClick={toggleFullscreen}
                  className="hover:scale-110 transition-transform"
                >
                  <MdFullscreen className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Video Details */}
        <div className="p-4">
          <h1 className="text-lg font-medium mb-2 leading-6">
            {currentVideo.title}
          </h1>
          
          <div className="text-sm text-gray-600 mb-4">
            <span>{formatCount(currentVideo.views)} views</span>
            <span className="mx-2">•</span>
            <span>{getRelativeTime(currentVideo.uploadDate || currentVideo.createdAt)}</span>
          </div>

          {/* Channel Row */}
          <div className="flex items-center space-x-3 mb-4">
            <img 
              src={currentVideo.channelId?.avatarUrl}
              alt={currentVideo.channelId?.name}
              className="w-10 h-10 rounded-full"
              onError={(e) => {
                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM4MDgwODAiLz4KPHRleHQgeD0iNTAlIiB5PSI1MCUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjEyIj5DPC90ZXh0Pgo8L3N2Zz4=';
              }}
            />
            <div className="flex-1">
              <div className="flex items-center space-x-1">
                <span className="font-medium">{currentVideo.channelId?.name}</span>
                {currentVideo.channelId?.verified && (
                  <MdVerified className="w-4 h-4 text-gray-600" />
                )}
              </div>
              <span className="text-sm text-gray-600">
                {formatCount(currentVideo.channelId?.subscriberCount || 0)} subscribers
              </span>
            </div>
            <button 
              onClick={handleSubscribe}
              className={`px-6 py-2 rounded-full text-sm font-medium ${
                subscribedChannels.includes(currentVideo.channelId?._id)
                  ? 'bg-gray-100 text-gray-700'
                  : 'bg-gray-900 text-white hover:bg-gray-800'
              }`}
            >
              {subscribedChannels.includes(currentVideo.channelId?._id) ? 'Subscribed' : 'Subscribe'}
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2 mb-4 overflow-x-auto scrollbar-hide">
            <div className="flex bg-gray-100 rounded-full">
              <button 
                onClick={handleLike}
                className={`flex items-center space-x-2 px-4 py-2 rounded-l-full ${
                  currentVideo.isLikedByUser ? 'bg-blue-100' : ''
                }`}
              >
                <MdThumbUp className={`w-5 h-5 ${
                  currentVideo.isLikedByUser ? 'text-blue-600' : 'text-gray-700'
                }`} />
                <span className="text-sm font-medium">{formatCount(currentVideo.likes)}</span>
              </button>
              <div className="w-px bg-gray-300 my-2"></div>
              <button 
                onClick={handleDislike}
                className={`p-2 rounded-r-full ${
                  currentVideo.isDislikedByUser ? 'bg-red-100' : ''
                }`}
              >
                <MdThumbDown className={`w-5 h-5 ${
                  currentVideo.isDislikedByUser ? 'text-red-600' : 'text-gray-700'
                }`} />
              </button>
            </div>
            
            <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-full">
              <MdShare className="w-5 h-5" />
              <span className="text-sm font-medium">Share</span>
            </button>
            
            <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-full">
              <BiVolumeFull className="w-5 h-5" />
              <span className="text-sm font-medium">Remix</span>
            </button>
            
            <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-full">
              <MdDownload className="w-5 h-5" />
              <span className="text-sm font-medium">Download</span>
            </button>
          </div>

          {/* Description Box */}
          <div className="bg-gray-100 rounded-lg p-4 mb-4">
            <p className={`text-sm ${showFullDescription ? '' : 'line-clamp-2'}`}>
              {currentVideo.description || 'No description available.'}
            </p>
            {currentVideo.description && currentVideo.description.length > 100 && (
              <button 
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="flex items-center space-x-1 mt-2 text-sm font-medium"
              >
                <span>{showFullDescription ? 'Show less' : 'Show more'}</span>
                {showFullDescription ? (
                  <MdExpandLess className="w-4 h-4" />
                ) : (
                  <MdExpandMore className="w-4 h-4" />
                )}
              </button>
            )}
          </div>

          {/* Comments Teaser */}
          <div 
            className="bg-gray-50 rounded-lg p-4 mb-4 cursor-pointer"
            onClick={() => setShowComments(true)}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">Comments {formatCount(currentVideo.commentCount || 0)}</span>
              <MdExpandMore className="w-5 h-5" />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Top comment would appear here...
            </p>
          </div>
        </div>

        {/* Up Next Section */}
        <div className="px-4 pb-8">
          <h3 className="text-lg font-medium mb-4">Up next</h3>
          <div className="space-y-4">
            {recommendations.map((video) => (
              <div 
                key={video._id}
                onClick={() => navigate(`/youtube/watch/${video._id}`)}
                className="cursor-pointer"
              >
                <div className="flex space-x-3">
                  <div className="w-40 flex-shrink-0">
                    <div 
                      className="w-full bg-gray-900 rounded-lg overflow-hidden"
                      style={{ aspectRatio: '16/9' }}
                    >
                      <img 
                        src={video.thumbnailUrl}
                        alt={video.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYwIiBoZWlnaHQ9IjkwIiB2aWV3Qm94PSIwIDAgMTYwIDkwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTYwIiBoZWlnaHQ9IjkwIiBmaWxsPSIjODA4MDgwIi8+Cjx0ZXh0IHg9IjgwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+VmlkZW88L3RleHQ+Cjwvc3ZnPg==';
                        }}
                      />
                      <div className="absolute bottom-1 right-1 bg-black bg-opacity-80 text-white text-xs px-1 py-0.5 rounded">
                        {formatDuration(video.duration)}
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium line-clamp-2 mb-1">
                      {video.title}
                    </h4>
                    <div className="text-xs text-gray-600">
                      <span>{video.channelId?.name}</span>
                      {video.channelId?.verified && (
                        <MdVerified className="w-3 h-3 inline ml-1" />
                      )}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      <span>{formatCount(video.views)} views</span>
                      <span className="mx-1">•</span>
                      <span>{getRelativeTime(video.uploadDate || video.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Comments Modal */}
      <CommentsModal 
        isOpen={showComments} 
        onClose={() => setShowComments(false)} 
        videoId={currentVideo?._id} 
      />
    </div>
  );
};

export default Watch;