import React, { useState, useEffect } from 'react';
import { trackInteraction } from '../../services/analyticsApi';
import './Activity.css';

const Activity = ({ isOpen, onClose }) => {
  const [activities, setActivities] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'following'

  // Mock activity data
  const mockActivities = [
    {
      id: 1,
      type: 'like',
      user: {
        id: 2,
        username: 'john_doe',
        profilePicture: 'https://via.placeholder.com/44x44?text=JD'
      },
      post: {
        id: 1,
        thumbnail: 'https://picsum.photos/44/44?random=1'
      },
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      isRead: false
    },
    {
      id: 2,
      type: 'follow',
      user: {
        id: 3,
        username: 'jane_smith',
        profilePicture: 'https://via.placeholder.com/44x44?text=JS'
      },
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      isRead: false,
      isFollowingBack: false
    },
    {
      id: 3,
      type: 'comment',
      user: {
        id: 4,
        username: 'travel_buddy',
        profilePicture: 'https://via.placeholder.com/44x44?text=TB'
      },
      post: {
        id: 2,
        thumbnail: 'https://picsum.photos/44/44?random=2'
      },
      comment: 'Amazing shot! 😍',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      isRead: true
    },
    {
      id: 4,
      type: 'like',
      user: {
        id: 5,
        username: 'foodie_life',
        profilePicture: 'https://via.placeholder.com/44x44?text=FL'
      },
      post: {
        id: 3,
        thumbnail: 'https://picsum.photos/44/44?random=3'
      },
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
      isRead: true
    },
    {
      id: 5,
      type: 'follow',
      user: {
        id: 6,
        username: 'photographer_pro',
        profilePicture: 'https://via.placeholder.com/44x44?text=PP'
      },
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      isRead: true,
      isFollowingBack: true
    },
    {
      id: 6,
      type: 'mention',
      user: {
        id: 7,
        username: 'adventure_seeker',
        profilePicture: 'https://via.placeholder.com/44x44?text=AS'
      },
      post: {
        id: 4,
        thumbnail: 'https://picsum.photos/44/44?random=4'
      },
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      isRead: true
    },
    {
      id: 7,
      type: 'story_like',
      user: {
        id: 8,
        username: 'music_lover',
        profilePicture: 'https://via.placeholder.com/44x44?text=ML'
      },
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      isRead: true
    }
  ];

  useEffect(() => {
    if (isOpen) {
      setActivities(mockActivities);
    }
  }, [isOpen]);

  const formatTimeAgo = (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp.getTime();
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(days / 7);
    
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return `${weeks}w`;
  };

  const getActivityText = (activity) => {
    switch (activity.type) {
      case 'like':
        return `liked your photo.`;
      case 'comment':
        return `commented: ${activity.comment}`;
      case 'follow':
        return `started following you.`;
      case 'mention':
        return `mentioned you in a comment.`;
      case 'story_like':
        return `liked your story.`;
      default:
        return '';
    }
  };

  const handleFollow = async (userId, currentlyFollowing) => {
    try {
      // Track follow/unfollow action
      trackInteraction(userId, 'user', currentlyFollowing ? 'unfollow' : 'follow');
      
      // Update local state optimistically
      setActivities(prev => prev.map(activity => 
        activity.user.id === userId && activity.type === 'follow'
          ? { ...activity, isFollowingBack: !currentlyFollowing }
          : activity
      ));

      // API call would go here
      const response = await fetch(`http://localhost:5000/api/users/${userId}/follow`, {
        method: currentlyFollowing ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        // Revert on error
        setActivities(prev => prev.map(activity => 
          activity.user.id === userId && activity.type === 'follow'
            ? { ...activity, isFollowingBack: currentlyFollowing }
            : activity
        ));
      }
    } catch (error) {
      console.error('Failed to toggle follow:', error);
      // Revert on error
      setActivities(prev => prev.map(activity => 
        activity.user.id === userId && activity.type === 'follow'
          ? { ...activity, isFollowingBack: currentlyFollowing }
          : activity
      ));
    }
  };

  const markAllAsRead = () => {
    setActivities(prev => prev.map(activity => ({ ...activity, isRead: true })));
  };

  if (!isOpen) return null;

  const filteredActivities = activeTab === 'following' 
    ? activities.filter(activity => activity.user.isFollowing)
    : activities;

  const unreadCount = activities.filter(activity => !activity.isRead).length;

  return (
    <div className="activity-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="activity-panel">
        <div className="activity-header">
          <h2>Activity</h2>
          <button className="activity-close-btn" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
          </button>
        </div>

        <div className="activity-tabs">
          <button 
            className={`activity-tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All
            {unreadCount > 0 && <span className="notification-dot">{unreadCount}</span>}
          </button>
          <button 
            className={`activity-tab ${activeTab === 'following' ? 'active' : ''}`}
            onClick={() => setActiveTab('following')}
          >
            Following
          </button>
        </div>

        {unreadCount > 0 && (
          <div className="mark-read-container">
            <button className="mark-read-btn" onClick={markAllAsRead}>
              Mark all as read
            </button>
          </div>
        )}

        <div className="activity-list">
          {filteredActivities.length === 0 ? (
            <div className="no-activity">
              <p>No activity yet</p>
              <p>When someone likes or comments on your posts, you'll see it here.</p>
            </div>
          ) : (
            filteredActivities.map((activity) => (
              <div 
                key={activity.id} 
                className={`activity-item ${!activity.isRead ? 'unread' : ''}`}
              >
                <div className="activity-content">
                  <div className="activity-left">
                    <img 
                      src={activity.user.profilePicture} 
                      alt={activity.user.username}
                      className="activity-avatar"
                    />
                    <div className="activity-text">
                      <span className="activity-username">{activity.user.username}</span>
                      <span className="activity-action">{getActivityText(activity)}</span>
                      <span className="activity-time">{formatTimeAgo(activity.timestamp)}</span>
                    </div>
                  </div>

                  <div className="activity-right">
                    {activity.type === 'follow' ? (
                      <button 
                        className={`follow-btn ${activity.isFollowingBack ? 'following' : 'follow'}`}
                        onClick={() => handleFollow(activity.user.id, activity.isFollowingBack)}
                      >
                        {activity.isFollowingBack ? 'Following' : 'Follow'}
                      </button>
                    ) : activity.post ? (
                      <img 
                        src={activity.post.thumbnail} 
                        alt="Post thumbnail"
                        className="activity-post-thumb"
                      />
                    ) : null}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Activity;