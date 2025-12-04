import React, { useState, useEffect } from 'react';
import { ArrowLeft, Heart, UserPlus, MessageCircle, UserCheck, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { trackInteraction } from '../../services/analyticsApi';

const Activity = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector(state => state.auth);
  const { feed } = useSelector(state => state.posts);
  const [activeTab, setActiveTab] = useState('following');
  const [notifications, setNotifications] = useState([]);

  // Mock notifications data - in real app this would come from backend
  useEffect(() => {
    const mockNotifications = [
      {
        id: 1,
        type: 'like',
        user: {
          username: 'nature_explorer',
          profilePicture: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face'
        },
        post: {
          id: 'post1',
          thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=100&fit=crop'
        },
        message: 'liked your photo.',
        timestamp: '2h',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        id: 2,
        type: 'follow',
        user: {
          username: 'foodie_pics',
          profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
        },
        message: 'started following you.',
        timestamp: '3h',
        isFollowing: false,
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000)
      },
      {
        id: 3,
        type: 'comment',
        user: {
          username: 'urban_artist',
          profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
        },
        post: {
          id: 'post2',
          thumbnail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=100&h=100&fit=crop'
        },
        message: 'commented: "Amazing shot! 😍"',
        timestamp: '5h',
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000)
      },
      {
        id: 4,
        type: 'like',
        user: {
          username: 'travel_soul',
          profilePicture: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
        },
        post: {
          id: 'post3',
          thumbnail: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=100&h=100&fit=crop'
        },
        message: 'liked your photo.',
        timestamp: '1d',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
      },
      {
        id: 5,
        type: 'follow',
        user: {
          username: 'fitness_coach',
          profilePicture: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop&crop=face'
        },
        message: 'started following you.',
        timestamp: '2d',
        isFollowing: true,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        id: 6,
        type: 'like_multiple',
        users: [
          {
            username: 'nature_explorer',
            profilePicture: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face'
          },
          {
            username: 'urban_artist',
            profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
          }
        ],
        post: {
          id: 'post4',
          thumbnail: 'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=100&h=100&fit=crop'
        },
        message: 'and 3 others liked your photo.',
        timestamp: '3d',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      }
    ];

    setNotifications(mockNotifications);
  }, []);

  const handleFollowUser = async (notificationId, username) => {
    try {
      // Track interaction
      await trackInteraction('notification', 'notification', 'follow');
      
      // Update notification state
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, isFollowing: !notif.isFollowing }
            : notif
        )
      );
      
      console.log('Follow action:', username);
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      // Track interaction
      await trackInteraction(notification.post?.id || 'notification', 'notification', 'click');
      
      if (notification.post) {
        // Navigate to post detail (implement post detail route)
        console.log('Navigate to post:', notification.post.id);
      }
    } catch (error) {
      console.error('Error handling notification click:', error);
    }
  };

  const renderNotificationIcon = (type, users = null) => {
    switch (type) {
      case 'like':
      case 'like_multiple':
        return <Heart className="w-8 h-8 text-red-500 fill-current" />;
      case 'follow':
        return <UserPlus className="w-8 h-8 text-blue-500" />;
      case 'comment':
        return <MessageCircle className="w-8 h-8 text-gray-600" />;
      default:
        return <Heart className="w-8 h-8 text-gray-400" />;
    }
  };

  const renderNotification = (notification) => {
    const { type, user, users, post, message, timestamp, isFollowing } = notification;
    
    return (
      <div 
        key={notification.id}
        className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors"
        onClick={() => handleNotificationClick(notification)}
      >
        {/* Profile Picture */}
        <div className="relative flex-shrink-0 mr-3">
          <img
            src={user?.profilePicture || users?.[0]?.profilePicture}
            alt={user?.username || users?.[0]?.username}
            className="w-12 h-12 rounded-full object-cover"
          />
          
          {/* Notification Type Icon */}
          <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1">
            {renderNotificationIcon(type, users)}
          </div>
          
          {/* Multiple Users Indicator */}
          {users && users.length > 1 && (
            <div className="absolute -top-1 -right-1">
              <img
                src={users[1].profilePicture}
                alt={users[1].username}
                className="w-6 h-6 rounded-full object-cover border-2 border-white"
              />
            </div>
          )}
        </div>

        {/* Notification Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start">
            <div className="flex-1">
              <span className="font-semibold text-gray-900">
                {user?.username || users?.[0]?.username}
              </span>
              {users && users.length > 1 && (
                <span className="font-semibold text-gray-900">
                  , {users[1].username}
                </span>
              )}
              <span className="ml-1 text-gray-600">{message}</span>
              <div className="text-sm text-gray-500 mt-1">{timestamp}</div>
            </div>

            {/* Action Button or Post Thumbnail */}
            <div className="ml-3 flex-shrink-0">
              {type === 'follow' ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFollowUser(notification.id, user.username);
                  }}
                  className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors ${
                    isFollowing 
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  {isFollowing ? (
                    <div className="flex items-center space-x-1">
                      <UserCheck className="w-4 h-4" />
                      <span>Following</span>
                    </div>
                  ) : (
                    'Follow'
                  )}
                </button>
              ) : post ? (
                <img
                  src={post.thumbnail}
                  alt="Post"
                  className="w-12 h-12 object-cover rounded-md"
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="flex items-center px-4 py-3">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold">Activity</h1>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('following')}
            className={`flex-1 px-4 py-3 text-sm font-medium ${
              activeTab === 'following'
                ? 'text-black border-b-2 border-black'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Following
          </button>
          <button
            onClick={() => setActiveTab('you')}
            className={`flex-1 px-4 py-3 text-sm font-medium ${
              activeTab === 'you'
                ? 'text-black border-b-2 border-black'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            You
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="pb-16">
        {activeTab === 'following' ? (
          <div className="p-4 text-center text-gray-500">
            <Heart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">Activity On Your Posts</p>
            <p className="text-sm">
              When someone likes or comments on one of your posts, you'll see it here.
            </p>
          </div>
        ) : (
          <div>
            {/* This Week */}
            <div className="py-4">
              <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                <h2 className="text-sm font-semibold text-gray-700">This Week</h2>
              </div>
              {notifications
                .filter(n => {
                  const daysDiff = (Date.now() - n.createdAt.getTime()) / (1000 * 60 * 60 * 24);
                  return daysDiff <= 7;
                })
                .map(renderNotification)}
            </div>

            {/* Earlier */}
            <div className="py-4">
              <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                <h2 className="text-sm font-semibold text-gray-700">Earlier</h2>
              </div>
              {notifications
                .filter(n => {
                  const daysDiff = (Date.now() - n.createdAt.getTime()) / (1000 * 60 * 60 * 24);
                  return daysDiff > 7;
                })
                .map(renderNotification)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Activity;