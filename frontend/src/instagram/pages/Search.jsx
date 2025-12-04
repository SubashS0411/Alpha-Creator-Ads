import React, { useState, useEffect, useRef } from 'react';
import { Search as SearchIcon, X, Play, Heart, MessageCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { trackSearchQuery, trackInteraction } from '../../services/analyticsApi';
import PostCard from '../components/PostCard';

const ExploreGridItem = ({ post, isVertical, isVideo, onClick }) => {
  const videoRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [likesCount] = useState(post.likesCount || Math.floor(Math.random() * 1000) + 50);
  const [commentsCount] = useState(post.commentsCount || Math.floor(Math.random() * 100) + 5);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (isVideo && videoRef.current) {
      videoRef.current.play().catch(console.error);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (isVideo && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div 
      className={`relative cursor-pointer group ${isVertical ? 'row-span-2' : 'aspect-square'}`}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {isVideo ? (
        <div className="relative w-full h-full bg-gray-900">
          <video
            ref={videoRef}
            src={post.mediaUrl || post.imageUrl}
            className="w-full h-full object-cover"
            muted
            loop
            playsInline
          />
          <div className="absolute top-2 right-2">
            <Play className="w-4 h-4 text-white fill-white drop-shadow-lg" />
          </div>
        </div>
      ) : (
        <img
          src={post.mediaUrl || post.imageUrl}
          alt=""
          className="w-full h-full object-cover"
        />
      )}
      
      {/* Hover Overlay */}
      <div 
        className={`absolute inset-0 bg-black transition-all duration-200 flex items-center justify-center ${
          isHovered ? 'bg-opacity-40' : 'bg-opacity-0'
        }`}
      >
        <div 
          className={`flex items-center space-x-6 text-white transition-all duration-200 ${
            isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          <div className="flex items-center space-x-2">
            <Heart className="w-6 h-6 fill-white" />
            <span className="font-bold text-lg">{formatNumber(likesCount)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <MessageCircle className="w-6 h-6 fill-white" />
            <span className="font-bold text-lg">{formatNumber(commentsCount)}</span>
          </div>
        </div>
      </div>

      {/* Multiple Photos Indicator */}
      {post.mediaUrl && post.mediaUrl.includes('carousel') && (
        <div className="absolute top-2 right-2">
          <div className="flex space-x-1">
            {[1, 2].map(i => (
              <div key={i} className="w-1.5 h-1.5 bg-white rounded-full opacity-80" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState(['nature', 'travel', 'food']);
  const [showResults, setShowResults] = useState(false);
  const dispatch = useDispatch();
  const { feed } = useSelector(state => state.posts);

  // Mock search functionality - filter posts by caption
  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    // Track search query
    await trackSearchQuery(query);

    const results = feed.filter(post => 
      post.caption?.toLowerCase().includes(query.toLowerCase()) ||
      post.author?.username?.toLowerCase().includes(query.toLowerCase())
    );
    
    setSearchResults(results);
    setShowResults(true);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
  };

  const handlePostClick = async (post) => {
    try {
      // Track interaction
      await trackInteraction(post._id, post.type || 'image', 'click');
      
      // TODO: Navigate to post detail view
      console.log('Post clicked:', post._id);
      
      // For now, could open a modal or navigate to a detail route
    } catch (error) {
      console.error('Error tracking post click:', error);
    }
  };

  return (
    <div className="bg-black min-h-full text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black border-b border-gray-800">
        <div className="flex items-center px-4 py-3">
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                handleSearch(e.target.value);
              }}
              className="w-full bg-gray-900 text-white placeholder-gray-400 rounded-lg py-2 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <X className="h-5 w-5 text-gray-400 hover:text-white" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pb-16">
        {!showResults ? (
          <div className="px-4 py-6">
            {/* Recent Searches */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Recent</h3>
              <div className="space-y-3">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSearchQuery(search);
                      handleSearch(search);
                    }}
                    className="flex items-center space-x-3 w-full text-left py-2"
                  >
                    <SearchIcon className="h-5 w-5 text-gray-400" />
                    <span className="text-white">{search}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Explore Grid */}
            <div>
              <div className="grid grid-cols-3 gap-0.5">
                {feed.slice(0, 21).map((post, index) => {
                  // Enhanced masonry pattern: 
                  // - Every 6th item (positions 2, 8, 14, 20...) becomes tall (2x1)
                  // - Every 9th item becomes wide (1x2) - but we'll use tall for mobile
                  const row = Math.floor(index / 3);
                  const col = index % 3;
                  const isVertical = (col === 2) && (row % 2 === 0); // Right column, even rows
                  const isVideo = post.type === 'video' || post.mediaUrl?.includes('mp4') || post.imageUrl?.includes('mp4');
                  
                  return (
                    <ExploreGridItem
                      key={post._id}
                      post={post}
                      isVertical={isVertical}
                      isVideo={isVideo}
                      onClick={() => handlePostClick(post)}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div>
            {searchResults.length > 0 ? (
              <div>
                <div className="px-4 py-2 border-b border-gray-800">
                  <p className="text-gray-400 text-sm">{searchResults.length} results</p>
                </div>
                {searchResults.map(post => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
            ) : (
              <div className="px-4 py-8 text-center">
                <p className="text-gray-400">No results found for "{searchQuery}"</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;