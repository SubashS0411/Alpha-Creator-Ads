import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  MdHistory, 
  MdWatchLater, 
  MdThumbUp, 
  MdPlaylistPlay, 
  MdArrowBack,
  MdAnalytics,
  MdAccessTime,
  MdVideoLibrary,
  MdFavorite,
  MdTrendingUp
} from 'react-icons/md';
import { fetchLikedVideos, fetchDislikedVideos } from '../../store/youtubeSlice';
import VideoCard from '../components/VideoCard';

// Hardcoded current user as per specification
const CURRENT_USER = {
  _id: '674587d123456789abcdef01',
  name: 'Demo User',
  handle: '@demouser',
  avatarUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iNDAiIGZpbGw9IiNGRjAwMDAiLz4KPHRleHQgeD0iNTAlIiB5PSI1NSUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjI0IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiPkRVPC90ZXh0Pgo8L3N2Zz4=',
  totalWatchTime: 1250400 // in seconds (example: ~347 hours)
};

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userLikedVideos, userDislikedVideos, likedVideosLoading } = useSelector(state => state.youtube);
  const [recentVideos] = useState([]); // Would fetch from API
  const [showHistory, setShowHistory] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [showLikedVideos, setShowLikedVideos] = useState(false);
  const [watchHistory, setWatchHistory] = useState([]);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [playlists] = useState([
    { id: 1, name: 'Your Videos', count: 0, icon: 'play' },
    { id: 2, name: 'Watch Later', count: 12, icon: 'watch_later' },
    { id: 3, name: 'Liked Videos', count: userLikedVideos.length, icon: 'thumb_up' },
    { id: 4, name: 'View Analytics', count: 'Data', icon: 'analytics' },
    { id: 5, name: 'Watch History', count: 'All', icon: 'history' }
  ]);

  const formatWatchTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
      return `${days} days, ${hours % 24} hours`;
    }
    return `${hours} hours`;
  };

  // Fetch analytics data
  useEffect(() => {
    fetchWatchHistory();
    fetchAnalyticsData();
    dispatch(fetchLikedVideos());
    dispatch(fetchDislikedVideos());
  }, [dispatch]);

  const fetchWatchHistory = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/youtube/analytics/history/674587d123456789abcdef01');
      if (response.ok) {
        const data = await response.json();
        setWatchHistory(data.slice(0, 20)); // Latest 20 videos
      }
    } catch (error) {
      console.error('Failed to fetch watch history:', error);
      // Set mock data for demo
      setWatchHistory([
        {
          videoId: {
            title: 'JavaScript Tutorial for Beginners',
            thumbnailUrl: 'https://via.placeholder.com/120x68',
            channelId: { name: 'Code Academy' }
          },
          watchedAt: new Date()
        }
      ]);
    }
  };

  const fetchAnalyticsData = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/youtube/analytics/user-stats/674587d123456789abcdef01');
      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data);
      }
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
      // Set mock data for demo
      setAnalyticsData({
        totalWatchTime: 15432, // in seconds
        videosWatched: 127,
        favoriteCategories: [
          { name: 'Programming', count: 45 },
          { name: 'Technology', count: 32 },
          { name: 'Education', count: 28 }
        ],
        peakHours: [19, 20, 21] // 7-9 PM
      });
    }
  };

  const handlePlaylistClick = (playlist) => {
    switch (playlist.name) {
      case 'Watch Later':
        alert('Watch Later functionality - Demo only');
        break;
      case 'Liked Videos':
        setShowLikedVideos(true);
        break;
      case 'View Analytics':
        setShowAnalytics(true);
        break;
      case 'Watch History':
        setShowHistory(true);
        break;
      default:
        alert(`${playlist.name} functionality - Demo only`);
    }
  };

  return (
    <div className="h-full bg-white overflow-y-auto">
      {/* Profile Header */}
      <div className="p-6 text-center">
        <img 
          src={CURRENT_USER.avatarUrl}
          alt={CURRENT_USER.name}
          className="w-20 h-20 rounded-full mx-auto mb-4"
          onError={(e) => {
            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iNDAiIGZpbGw9IiNGRjAwMDAiLz4KPHRleHQgeD0iNTAlIiB5PSI1MCUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjI0Ij5EVTwvdGV4dD4KPC9zdmc+';
          }}
        />
        <h1 className="text-xl font-medium mb-1">{CURRENT_USER.name}</h1>
        <p className="text-gray-600 mb-4">{CURRENT_USER.handle}</p>
        
        {/* Total Watch Time Stats */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Total Watch Time</h3>
          <p className="text-2xl font-bold text-red-600">
            {formatWatchTime(CURRENT_USER.totalWatchTime)}
          </p>
          <p className="text-sm text-gray-500 mt-1">Calculated from your viewing history</p>
        </div>
      </div>

      {/* History Section */}
      <div className="px-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">History</h2>
          <button 
            onClick={() => alert('View all history - Demo only')}
            className="text-sm text-blue-600"
          >
            View all
          </button>
        </div>
        
        {recentVideos.length > 0 ? (
          <div className="horizontal-scroll flex space-x-4 overflow-x-auto pb-2">
            {recentVideos.map((video) => (
              <div key={video.id} className="flex-shrink-0 w-40">
                <div 
                  className="w-full bg-gray-900 rounded-lg overflow-hidden mb-2"
                  style={{ aspectRatio: '16/9' }}
                >
                  <img 
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="text-sm font-medium line-clamp-2">{video.title}</h4>
                <p className="text-xs text-gray-600 mt-1">{video.channel}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <MdHistory className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No watch history yet</p>
            <p className="text-sm">Videos you watch will appear here</p>
          </div>
        )}
      </div>

      {/* Playlists Section */}
      <div className="px-6 pb-8">
        <h2 className="text-lg font-medium mb-4">Playlists</h2>
        
        <div className="space-y-3">
          {playlists.map((playlist) => (
            <button
              key={playlist.id}
              onClick={() => handlePlaylistClick(playlist)}
              className="flex items-center space-x-4 w-full p-3 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                {playlist.icon === 'play' && <MdPlaylistPlay className="w-6 h-6 text-gray-600" />}
                {playlist.icon === 'watch_later' && <MdWatchLater className="w-6 h-6 text-gray-600" />}
                {playlist.icon === 'thumb_up' && <MdThumbUp className="w-6 h-6 text-gray-600" />}
                {playlist.icon === 'analytics' && <MdAnalytics className="w-6 h-6 text-gray-600" />}
                {playlist.icon === 'history' && <MdHistory className="w-6 h-6 text-gray-600" />}
              </div>
              
              <div className="flex-1 text-left">
                <h3 className="font-medium">{playlist.name}</h3>
                <p className="text-sm text-gray-600">
                  {playlist.count} {playlist.count === 1 ? 'video' : 'videos'}
                </p>
              </div>
              
              <div className="text-gray-400">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Settings/Options */}
      <div className="px-6 pb-8 border-t border-gray-200 pt-6">
        <div className="space-y-3">
          <button className="flex items-center space-x-4 w-full p-3 hover:bg-gray-100 rounded-lg">
            <div className="text-gray-600">⚙️</div>
            <span>Settings</span>
          </button>
          
          <button className="flex items-center space-x-4 w-full p-3 hover:bg-gray-100 rounded-lg">
            <div className="text-gray-600">❓</div>
            <span>Help & feedback</span>
          </button>
        </div>
      </div>

      {/* Watch History Modal */}
      {showHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end max-w-sm mx-auto">
          <div className="bg-white w-full h-5/6 rounded-t-3xl p-4 overflow-y-auto max-w-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Watch History</h2>
              <button onClick={() => setShowHistory(false)} className="text-gray-500">
                <MdArrowBack className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-3">
              {watchHistory.map((item, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <img 
                    src={item.videoId?.thumbnailUrl || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjY4IiB2aWV3Qm94PSIwIDAgMTIwIDY4IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjY4IiBmaWxsPSIjODA4MDgwIi8+Cjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSIxMCI+VGh1bWJuYWlsPC90ZXh0Pgo8L3N2Zz4='} 
                    alt={item.videoId?.title}
                    className="w-20 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-sm line-clamp-2">{item.videoId?.title}</h3>
                    <p className="text-xs text-gray-500">{item.videoId?.channelId?.name}</p>
                    <p className="text-xs text-gray-400">{new Date(item.watchedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
              {watchHistory.length === 0 && (
                <div className="text-center py-8">
                  <MdHistory className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No watch history yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Analytics Modal */}
      {showAnalytics && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end max-w-sm mx-auto">
          <div className="bg-white w-full h-5/6 rounded-t-3xl p-4 overflow-y-auto max-w-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">View Analytics</h2>
              <button onClick={() => setShowAnalytics(false)} className="text-gray-500">
                <MdArrowBack className="w-6 h-6" />
              </button>
            </div>
            
            {analyticsData ? (
              <div className="space-y-6">
                {/* Watch Time Stats */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <MdAccessTime className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-blue-900">Watch Time</h3>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">{Math.round(analyticsData.totalWatchTime / 60)} minutes</p>
                  <p className="text-sm text-blue-700">Total time watched</p>
                </div>

                {/* Video Count */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <MdVideoLibrary className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold text-green-900">Videos Watched</h3>
                  </div>
                  <p className="text-2xl font-bold text-green-600">{analyticsData.videosWatched}</p>
                  <p className="text-sm text-green-700">Total videos</p>
                </div>

                {/* Favorite Categories */}
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <MdFavorite className="w-5 h-5 text-purple-600" />
                    <h3 className="font-semibold text-purple-900">Favorite Categories</h3>
                  </div>
                  {analyticsData.favoriteCategories?.map((cat, index) => (
                    <div key={index} className="flex justify-between items-center mb-1">
                      <span className="text-sm text-purple-700">{cat.name}</span>
                      <span className="text-sm font-medium text-purple-600">{cat.count} videos</span>
                    </div>
                  ))}
                </div>

                {/* Peak Activity Hours */}
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <MdTrendingUp className="w-5 h-5 text-orange-600" />
                    <h3 className="font-semibold text-orange-900">Peak Activity</h3>
                  </div>
                  <p className="text-sm text-orange-700 mb-2">Most active hours:</p>
                  {analyticsData.peakHours?.map((hour, index) => (
                    <div key={index} className="text-sm text-orange-600">{hour}:00 - {hour + 1}:00</div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <MdAnalytics className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Loading analytics data...</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* View Preferences Modal */}
      {showPreferences && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end max-w-sm mx-auto">
          <div className="bg-white w-full h-5/6 rounded-t-3xl p-4 overflow-y-auto max-w-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">View Preferences</h2>
              <button onClick={() => setShowPreferences(false)} className="text-gray-500">
                <MdArrowBack className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Based on your recent watching:</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• You prefer videos 5-15 minutes long</li>
                  <li>• You watch mostly Programming and Technology content</li>
                  <li>• You're most active between 6-10 PM</li>
                  <li>• You frequently like educational content</li>
                  <li>• You prefer high-quality video (1080p+)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Liked Videos Modal */}
      {showLikedVideos && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end max-w-sm mx-auto">
          <div className="bg-white w-full h-3/4 rounded-t-xl flex flex-col max-w-sm">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-bold">Liked Videos ({userLikedVideos.length})</h2>
              <button onClick={() => setShowLikedVideos(false)} className="text-gray-500">
                <MdArrowBack className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {likedVideosLoading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              ) : userLikedVideos.length === 0 ? (
                <div className="text-center py-12">
                  <MdThumbUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No liked videos yet</p>
                  <p className="text-sm text-gray-400 mt-2">Videos you like will appear here</p>
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  {userLikedVideos.map((video) => (
                    <div 
                      key={video._id} 
                      className="cursor-pointer"
                      onClick={() => {
                        navigate(`/youtube/watch/${video._id}`);
                        setShowLikedVideos(false);
                      }}
                    >
                      <VideoCard 
                        video={video} 
                        layout="horizontal"
                        showChannel={true}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;