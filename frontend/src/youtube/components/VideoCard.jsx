import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { MdMoreVert, MdVerified, MdThumbUp, MdThumbDown } from 'react-icons/md';
import { likeVideo, dislikeVideo } from '../../store/youtubeSlice';

const VideoCard = ({ video, isShort = false, showChannel = true, size = 'normal', showActions = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef();
  const timeoutRef = useRef();

  const { likedVideos, dislikedVideos } = useSelector(state => state.youtube);

  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatViews = (views) => {
    if (!views) return '0';
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  const getRelativeTime = (date) => {
    if (!date) return 'Unknown';
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

  const handleLike = (e) => {
    e.stopPropagation();
    if (!video) return;
    const action = likedVideos.includes(video._id) ? 'unlike' : 'like';
    dispatch(likeVideo({ videoId: video._id, action }));
  };

  const handleDislike = (e) => {
    e.stopPropagation();
    if (!video) return;
    const action = dislikedVideos.includes(video._id) ? 'remove_dislike' : 'dislike';
    dispatch(dislikeVideo({ videoId: video._id, action }));
  };

  const handleVideoClick = () => {
    navigate(`/youtube/watch/${video._id}`);
  };

  // Auto-play functionality as per YouTube specification
  useEffect(() => {
    if (isHovered && videoRef.current) {
      // Start timer for auto-play after 1 second of hovering
      timeoutRef.current = setTimeout(() => {
        if (videoRef.current && !isPlaying) {
          setIsPlaying(true);
          // In a real app, we would play the actual video with captions
        }
      }, 1000);
    } else {
      // Clear timer when not hovering
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (!isHovered) {
        setIsPlaying(false);
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isHovered, isPlaying]);

  return (
    <div className={`${isShort ? '' : 'mb-4'}`}>
      {/* Thumbnail Container */}
      <div 
        ref={videoRef}
        className="relative w-full bg-gray-900 rounded-lg overflow-hidden cursor-pointer"
        style={{ aspectRatio: isShort ? '9/16' : '16/9' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setIsPlaying(false);
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
        }}
        onClick={handleVideoClick}
      >
        {/* Thumbnail Image or Video Frame */}
        {video.thumbnailUrl ? (
          <img 
            src={video.thumbnailUrl} 
            alt={video.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgwIiBoZWlnaHQ9IjI3MCIgdmlld0JveD0iMCAwIDQ4MCAyNzAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0ODAiIGhlaWdodD0iMjcwIiBmaWxsPSIjODA4MDgwIi8+Cjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSIxOCI+VGh1bWJuYWlsPC90ZXh0Pgo8L3N2Zz4=';
            }}
          />
        ) : (
          <video 
            src={video.videoUrl}
            className="w-full h-full object-cover pointer-events-none"
            muted
            playsInline
          />
        )}
        
        {/* Duration Badge */}
        {!isShort && (
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-1.5 py-0.5 rounded">
            {formatDuration(video.duration)}
          </div>
        )}
        
        {/* Playing State Overlay */}
        {isPlaying && (
          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
            <div className="w-12 h-12 bg-black bg-opacity-60 rounded-full flex items-center justify-center">
              <div className="w-0 h-0 border-l-4 border-l-white border-t-2 border-b-2 border-t-transparent border-b-transparent ml-1"></div>
            </div>
          </div>
        )}
      </div>

      {/* Video Info */}
      {showChannel && (
        <div className="flex mt-3 px-4">
          {/* Channel Avatar */}
          <div className="flex-shrink-0 mr-3">
            <img 
              src={video.channelId?.avatarUrl || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM4MDgwODAiLz4KPHRleHQgeD0iNTAlIiB5PSI1MCUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjEyIj5DPC90ZXh0Pgo8L3N2Zz4='}
              alt={video.channelId?.name || 'Channel'}
              className="w-10 h-10 rounded-full"
              onError={(e) => {
                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM4MDgwODAiLz4KPHRleHQgeD0iNTAlIiB5PSI1MCUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjEyIj5DPC90ZXh0Pgo8L3N2Zz4=';
              }}
            />
          </div>

          {/* Video Details */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900 line-clamp-2 leading-5 mb-1">
              {video.title}
            </h3>
            
            <div className="flex items-center space-x-1 text-xs text-gray-600">
              <span>{video.channelId?.name || 'Unknown Channel'}</span>
              {video.channelId?.verified && (
                <MdVerified className="w-3 h-3 text-gray-600" />
              )}
            </div>
            
            <div className="text-xs text-gray-600 mt-0.5">
              <span>{formatViews(video.views)} views</span>
              <span className="mx-1">•</span>
              <span>{getRelativeTime(video.uploadDate || video.createdAt)}</span>
            </div>
          </div>

          {/* Menu Button */}
          <div className="flex-shrink-0 ml-2">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-2 text-gray-600 hover:text-gray-900"
            >
              <MdMoreVert className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {showActions && (
        <div className="flex items-center space-x-1 px-4 mt-2">
          <button 
            onClick={handleLike}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-sm ${
              likedVideos.includes(video._id) 
                ? 'bg-blue-100 text-blue-600' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <MdThumbUp className="w-4 h-4" />
            <span>{formatViews(video.likes + (likedVideos.includes(video._id) ? 1 : 0))}</span>
          </button>
          
          <button 
            onClick={handleDislike}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-sm ${
              dislikedVideos.includes(video._id) 
                ? 'bg-red-100 text-red-600' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <MdThumbDown className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Context Menu */}
      {showMenu && (
        <div className="absolute right-4 mt-1 bg-white rounded-lg shadow-lg border py-2 z-50">
          <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100">
            Save to Watch later
          </button>
          <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100">
            Save to playlist
          </button>
          <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100">
            Share
          </button>
          <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100">
            Not interested
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoCard;