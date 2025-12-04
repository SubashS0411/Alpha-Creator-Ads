import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdNotifications, MdNotificationsOff, MdVerified, MdSearch } from 'react-icons/md';

const ManageSubscriptions = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [subscriptions, setSubscriptions] = useState([
    {
      _id: '1',
      name: 'Tech Review Hub',
      handle: '@techreviewhub',
      avatarUrl: 'https://via.placeholder.com/48x48/FF0000/ffffff?text=TRH',
      subscriberCount: 1250000,
      verified: true,
      subscribed: true,
      notifications: true,
      subscribedDate: '2023-05-15'
    },
    {
      _id: '2',
      name: 'Gaming Universe',
      handle: '@gaminguniv',
      avatarUrl: 'https://via.placeholder.com/48x48/00FF00/ffffff?text=GU',
      subscriberCount: 890000,
      verified: true,
      subscribed: true,
      notifications: false,
      subscribedDate: '2023-08-22'
    },
    {
      _id: '3',
      name: 'Music Vibes',
      handle: '@musicvibes',
      avatarUrl: 'https://via.placeholder.com/48x48/0000FF/ffffff?text=MV',
      subscriberCount: 2100000,
      verified: true,
      subscribed: true,
      notifications: true,
      subscribedDate: '2023-03-10'
    },
    {
      _id: '4',
      name: 'Fitness Journey',
      handle: '@fitnessjourney',
      avatarUrl: 'https://via.placeholder.com/48x48/FF69B4/ffffff?text=FJ',
      subscriberCount: 734000,
      verified: false,
      subscribed: true,
      notifications: false,
      subscribedDate: '2023-09-05'
    },
    {
      _id: '5',
      name: 'CodeWith Alex',
      handle: '@codewithalex',
      avatarUrl: 'https://via.placeholder.com/48x48/FFA500/ffffff?text=CWA',
      subscriberCount: 567000,
      verified: false,
      subscribed: true,
      notifications: true,
      subscribedDate: '2023-07-18'
    }
  ]);

  const formatCount = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) return `${diffDays} days ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  const handleUnsubscribe = (channelId) => {
    setSubscriptions(prev => prev.filter(sub => sub._id !== channelId));
  };

  const handleToggleNotifications = (channelId) => {
    setSubscriptions(prev => prev.map(sub => 
      sub._id === channelId 
        ? { ...sub, notifications: !sub.notifications }
        : sub
    ));
  };

  const filteredSubscriptions = subscriptions.filter(sub =>
    sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sub.handle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full bg-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center">
          <button 
            onClick={() => navigate('/youtube/subscriptions')}
            className="mr-4 p-2 -ml-2"
          >
            <MdArrowBack className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-medium">Manage subscriptions</h1>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search subscriptions"
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{subscriptions.length} subscriptions</span>
          <span>
            {subscriptions.filter(sub => sub.notifications).length} with notifications
          </span>
        </div>
      </div>

      {/* Subscriptions List */}
      <div className="flex-1 overflow-y-auto">
        {filteredSubscriptions.length > 0 ? (
          <div className="p-4 space-y-4">
            {filteredSubscriptions.map((subscription) => (
              <div 
                key={subscription._id} 
                className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg"
              >
                {/* Channel Avatar */}
                <img 
                  src={subscription.avatarUrl}
                  alt={subscription.name}
                  className="w-12 h-12 rounded-full flex-shrink-0"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/48x48/808080/ffffff?text=C';
                  }}
                />

                {/* Channel Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-1">
                    <h3 className="font-medium text-gray-900 truncate">{subscription.name}</h3>
                    {subscription.verified && (
                      <MdVerified className="w-4 h-4 text-gray-600 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{subscription.handle}</p>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <span>{formatCount(subscription.subscriberCount)} subscribers</span>
                    <span>•</span>
                    <span>Subscribed {formatDate(subscription.subscribedDate)}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleToggleNotifications(subscription._id)}
                    className={`p-2 rounded-full ${
                      subscription.notifications
                        ? 'text-gray-900 hover:bg-gray-200'
                        : 'text-gray-400 hover:bg-gray-100'
                    }`}
                    title={subscription.notifications ? 'Turn off notifications' : 'Turn on notifications'}
                  >
                    {subscription.notifications ? (
                      <MdNotifications className="w-5 h-5" />
                    ) : (
                      <MdNotificationsOff className="w-5 h-5" />
                    )}
                  </button>
                  
                  <button
                    onClick={() => {
                      if (confirm(`Unsubscribe from ${subscription.name}?`)) {
                        handleUnsubscribe(subscription._id);
                      }
                    }}
                    className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    Unsubscribe
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <p>No subscriptions found</p>
            {searchQuery && (
              <p className="text-sm mt-2">
                Try searching for different terms
              </p>
            )}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="border-t border-gray-200 p-4 space-y-3">
        <button 
          onClick={() => {
            if (confirm('Turn on notifications for all subscriptions?')) {
              setSubscriptions(prev => prev.map(sub => ({ ...sub, notifications: true })));
            }
          }}
          className="w-full text-left text-sm text-blue-600 py-2 hover:bg-blue-50 rounded transition-colors"
        >
          Turn on notifications for all
        </button>
        
        <button 
          onClick={() => {
            if (confirm('Turn off notifications for all subscriptions?')) {
              setSubscriptions(prev => prev.map(sub => ({ ...sub, notifications: false })));
            }
          }}
          className="w-full text-left text-sm text-gray-600 py-2 hover:bg-gray-50 rounded transition-colors"
        >
          Turn off all notifications
        </button>
      </div>
    </div>
  );
};

export default ManageSubscriptions;