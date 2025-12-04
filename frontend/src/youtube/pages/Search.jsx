import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdMic, MdHistory, MdVerified } from 'react-icons/md';
import { searchContent, addToSearchHistory, clearSearchHistory } from '../../store/youtubeSlice';
import VideoCard from '../components/VideoCard';

const Search = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const { 
    searchResults, 
    searchLoading, 
    searchError, 
    searchHistory 
  } = useSelector(state => state.youtube);

  const handleSearch = (searchQuery = query) => {
    if (searchQuery.trim()) {
      dispatch(searchContent({ query: searchQuery }));
      dispatch(addToSearchHistory(searchQuery));
      setIsFocused(false);
    }
  };

  const handleHistoryClick = (historyQuery) => {
    setQuery(historyQuery);
    handleSearch(historyQuery);
  };

  const formatCount = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <div className="h-full bg-white">
      {/* Search Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate(-1)}>
            <MdArrowBack className="w-6 h-6" />
          </button>
          
          <div className="flex-1 relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search YouTube"
              className="w-full px-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          
          <button className="p-2">
            <MdMic className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Search History (when focused and no query) */}
        {isFocused && !query && (
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Search History</h3>
              {searchHistory.length > 0 && (
                <button 
                  onClick={() => dispatch(clearSearchHistory())}
                  className="text-sm text-blue-600"
                >
                  Clear all
                </button>
              )}
            </div>
            
            {searchHistory.length > 0 ? (
              <div className="space-y-2">
                {searchHistory.map((historyItem, index) => (
                  <button
                    key={index}
                    onClick={() => handleHistoryClick(historyItem)}
                    className="flex items-center space-x-3 w-full p-2 hover:bg-gray-100 rounded"
                  >
                    <MdHistory className="w-5 h-5 text-gray-500" />
                    <span className="text-left">{historyItem}</span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                No search history yet
              </p>
            )}
          </div>
        )}

        {/* Search Results */}
        {!isFocused && (
          <div className="p-4">
            {searchLoading && (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
              </div>
            )}

            {searchError && (
              <div className="text-center py-8">
                <p className="text-red-600 mb-4">Error: {searchError}</p>
                <button 
                  onClick={() => handleSearch()}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Channel Results */}
            {searchResults.channels && searchResults.channels.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">Channels</h3>
                <div className="space-y-4">
                  {searchResults.channels.map((channel) => (
                    <div key={channel._id} className="flex items-center space-x-4 p-2 hover:bg-gray-100 rounded cursor-pointer">
                      <img 
                        src={channel.avatarUrl}
                        alt={channel.name}
                        className="w-12 h-12 rounded-full"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/48x48/808080/ffffff?text=C';
                        }}
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-1">
                          <h4 className="font-medium">{channel.name}</h4>
                          {channel.verified && (
                            <MdVerified className="w-4 h-4 text-gray-600" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{channel.handle}</p>
                        <p className="text-sm text-gray-600">
                          {formatCount(channel.subscriberCount)} subscribers
                        </p>
                      </div>
                      <button className="px-4 py-1 bg-gray-900 text-white text-sm rounded-full hover:bg-gray-800">
                        Subscribe
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Video Results */}
            {searchResults.videos && searchResults.videos.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-4">Videos</h3>
                <div className="space-y-4">
                  {searchResults.videos.map((video) => (
                    <div 
                      key={video._id} 
                      onClick={() => navigate(`/youtube/watch/${video._id}`)}
                      className="cursor-pointer"
                    >
                      <VideoCard video={video} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {!searchLoading && !searchError && query && 
             searchResults.totalResults === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">
                  No results found for "{query}"
                </p>
                <p className="text-sm text-gray-400">
                  Try different keywords or check your spelling
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;