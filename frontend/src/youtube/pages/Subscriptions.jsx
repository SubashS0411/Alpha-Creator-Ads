import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { MdVerified } from 'react-icons/md';
import VideoCard from '../components/VideoCard';

const Subscriptions = () => {
  const navigate = useNavigate();
  const [subscriptions] = useState([]); // Would fetch from API
  const [subscriptionVideos] = useState([]); // Would fetch from API
  const [loading, setLoading] = useState(false);

  const formatCount = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  // Mock subscriptions for demo
  const mockSubscriptions = [
    {
      _id: '1',
      name: 'Tech Channel',
      handle: '@techchannel',
      avatarUrl: 'https://via.placeholder.com/40x40/FF0000/ffffff?text=TC',
      subscriberCount: 1200000,
      verified: true
    },
    {
      _id: '2',
      name: 'Gaming Hub',
      handle: '@gaminghub',
      avatarUrl: 'https://via.placeholder.com/40x40/00FF00/ffffff?text=GH',
      subscriberCount: 850000,
      verified: false
    },
    {
      _id: '3',
      name: 'Music World',
      handle: '@musicworld',
      avatarUrl: 'https://via.placeholder.com/40x40/0000FF/ffffff?text=MW',
      subscriberCount: 2500000,
      verified: true
    }
  ];

  return (
    <div className="h-full bg-white overflow-y-auto">
      {/* Subscribed Channels */}
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-40">
        <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
          {mockSubscriptions.map((channel) => (
            <button
              key={channel._id}
              onClick={() => alert(`Navigate to ${channel.name} - Demo only`)}
              className="flex-shrink-0 text-center"
            >
              <img 
                src={channel.avatarUrl}
                alt={channel.name}
                className="w-12 h-12 rounded-full mx-auto mb-1"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/48x48/808080/ffffff?text=C';
                }}
              />
              <span className="text-xs text-gray-700 block truncate max-w-16">
                {channel.name}
              </span>
            </button>
          ))}
          
          {/* All Subscriptions Button */}
          <button 
            onClick={() => alert('View all subscriptions - Demo only')}
            className="flex-shrink-0 text-center"
          >
            <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-1 flex items-center justify-center">
              <span className="text-lg">→</span>
            </div>
            <span className="text-xs text-gray-700 block">All</span>
          </button>
        </div>
      </div>

      {/* Subscription Videos */}
      <div className="p-4">
        {loading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          </div>
        )}

        {subscriptionVideos.length > 0 ? (
          <div className="space-y-4">
            {subscriptionVideos.map((video) => (
              <div 
                key={video._id}
                onClick={() => navigate(`/youtube/watch/${video._id}`)}
                className="cursor-pointer"
              >
                <VideoCard video={video} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            {mockSubscriptions.length > 0 ? (
              <div>
                <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-gray-400 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  </div>
                </div>
                <h3 className="text-lg font-medium mb-2">No recent uploads</h3>
                <p className="text-gray-600 mb-4">
                  Your subscribed channels haven't uploaded recently
                </p>
                <button 
                  onClick={() => navigate('/youtube/home')}
                  className="px-6 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800"
                >
                  Explore trending videos
                </button>
              </div>
            ) : (
              <div>
                <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-3xl">📺</span>
                </div>
                <h3 className="text-lg font-medium mb-2">No subscriptions yet</h3>
                <p className="text-gray-600 mb-4">
                  Subscribe to channels you like to see their latest videos here
                </p>
                <button 
                  onClick={() => navigate('/youtube/search')}
                  className="px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                >
                  Find channels to subscribe
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Manage Subscriptions */}
      <div className="p-4 border-t border-gray-200">
        <button 
          onClick={() => navigate('/youtube/manage-subscriptions')}
          className="w-full text-center text-blue-600 py-3 hover:bg-blue-50 rounded-lg transition-colors"
        >
          Manage subscriptions
        </button>
      </div>
    </div>
  );
};

export default Subscriptions;