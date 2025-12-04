import React, { useState, useEffect } from 'react';
import './Stories.css';

const Stories = ({ onStoryClick }) => {
  const [stories, setStories] = useState([]);

  // Mock stories data
  const mockStories = [
    {
      id: 1,
      user: {
        id: 1,
        username: 'your_story',
        profilePicture: 'https://via.placeholder.com/56x56?text=You',
        isOwn: true
      },
      stories: [
        {
          id: 1,
          mediaUrl: 'https://picsum.photos/400/600?random=story1',
          type: 'image',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          viewed: false
        }
      ],
      hasUnseen: false
    },
    {
      id: 2,
      user: {
        id: 2,
        username: 'john_doe',
        profilePicture: 'https://via.placeholder.com/56x56?text=JD'
      },
      stories: [
        {
          id: 2,
          mediaUrl: 'https://picsum.photos/400/600?random=story2',
          type: 'image',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
          viewed: false
        },
        {
          id: 3,
          mediaUrl: 'https://picsum.photos/400/600?random=story3',
          type: 'image',
          timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 min ago
          viewed: false
        }
      ],
      hasUnseen: true
    },
    {
      id: 3,
      user: {
        id: 3,
        username: 'jane_smith',
        profilePicture: 'https://via.placeholder.com/56x56?text=JS'
      },
      stories: [
        {
          id: 4,
          mediaUrl: 'https://picsum.photos/400/600?random=story4',
          type: 'image',
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
          viewed: true
        }
      ],
      hasUnseen: false
    },
    {
      id: 4,
      user: {
        id: 4,
        username: 'travel_buddy',
        profilePicture: 'https://via.placeholder.com/56x56?text=TB'
      },
      stories: [
        {
          id: 5,
          mediaUrl: 'https://picsum.photos/400/600?random=story5',
          type: 'image',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
          viewed: false
        }
      ],
      hasUnseen: true
    },
    {
      id: 5,
      user: {
        id: 5,
        username: 'foodie_life',
        profilePicture: 'https://via.placeholder.com/56x56?text=FL'
      },
      stories: [
        {
          id: 6,
          mediaUrl: 'https://picsum.photos/400/600?random=story6',
          type: 'image',
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
          viewed: false
        }
      ],
      hasUnseen: true
    }
  ];

  useEffect(() => {
    // Fetch users for stories (create stories from user profiles)
    const fetchStoriesFromUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/db/users');
        if (response.ok) {
          const users = await response.json();
          const generatedStories = users.slice(0, 5).map((user, index) => ({
            id: index + 1,
            user: {
              id: user._id,
              username: user.username,
              profilePicture: user.profilePicture,
              isOwn: user.username === 'john_doe' // Mock current user
            },
            stories: [
              {
                id: index + 1,
                mediaUrl: `https://picsum.photos/400/600?random=story${index + 10}`,
                type: 'image',
                timestamp: new Date(Date.now() - (index + 1) * 60 * 60 * 1000),
                viewed: Math.random() > 0.5
              }
            ],
            hasUnseen: Math.random() > 0.3
          }));
          
          setStories(generatedStories);
        } else {
          setStories(mockStories);
        }
      } catch (error) {
        console.error('Failed to fetch users for stories:', error);
        setStories(mockStories);
      }
    };

    fetchStoriesFromUsers();
  }, []);

  const handleStoryClick = (userStory, storyIndex = 0) => {
    if (onStoryClick) {
      onStoryClick(userStory, storyIndex);
    }
  };

  return (
    <div className="stories-container">
      <div className="stories-tray">
        {stories.map((userStory) => (
          <div
            key={userStory.id}
            className="story-item"
            onClick={() => handleStoryClick(userStory)}
          >
            <div className={`story-ring ${userStory.hasUnseen ? 'unseen' : 'seen'}`}>
              <div className="story-avatar-container">
                <img
                  src={userStory.user.profilePicture}
                  alt={userStory.user.username}
                  className="story-avatar"
                />
                {userStory.user.isOwn && (
                  <div className="add-story-icon">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                      <path d="M12 2v20M2 12h20" stroke="white" strokeWidth="3"/>
                    </svg>
                  </div>
                )}
              </div>
            </div>
            <span className="story-username">
              {userStory.user.isOwn ? 'Your Story' : userStory.user.username}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Story Viewer Component
export const StoryViewer = ({ userStories, initialStoryIndex = 0, onClose, onPrevUser, onNextUser }) => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(initialStoryIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  const currentStory = userStories.stories[currentStoryIndex];
  const totalStories = userStories.stories.length;
  
  useEffect(() => {
    if (isPaused) return;
    
    const duration = 5000; // 5 seconds per story
    const interval = 50; // Update every 50ms
    const increment = (interval / duration) * 100;
    
    const timer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + increment;
        if (newProgress >= 100) {
          handleNextStory();
          return 0;
        }
        return newProgress;
      });
    }, interval);
    
    return () => clearInterval(timer);
  }, [currentStoryIndex, isPaused]);
  
  const handleNextStory = () => {
    if (currentStoryIndex < totalStories - 1) {
      setCurrentStoryIndex(prev => prev + 1);
      setProgress(0);
    } else if (onNextUser) {
      onNextUser();
    } else {
      onClose();
    }
  };
  
  const handlePrevStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(prev => prev - 1);
      setProgress(0);
    } else if (onPrevUser) {
      onPrevUser();
    }
  };
  
  const handleStoryClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    
    if (clickX < width / 2) {
      handlePrevStory();
    } else {
      handleNextStory();
    }
  };
  
  const togglePause = () => {
    setIsPaused(prev => !prev);
  };
  
  const formatTimeAgo = (timestamp) => {
    const diff = Date.now() - timestamp.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    return `${hours}h`;
  };
  
  return (
    <div className="story-viewer-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="story-viewer">
        {/* Progress bars */}
        <div className="story-progress-container">
          {userStories.stories.map((_, index) => (
            <div key={index} className="story-progress-bar">
              <div 
                className="story-progress-fill"
                style={{
                  width: index < currentStoryIndex ? '100%' : 
                         index === currentStoryIndex ? `${progress}%` : '0%'
                }}
              />
            </div>
          ))}
        </div>
        
        {/* Header */}
        <div className="story-header">
          <div className="story-header-left">
            <img
              src={userStories.user.profilePicture}
              alt={userStories.user.username}
              className="story-header-avatar"
            />
            <span className="story-header-username">{userStories.user.username}</span>
            <span className="story-header-time">{formatTimeAgo(currentStory.timestamp)}</span>
          </div>
          <div className="story-header-right">
            <button className="story-pause-btn" onClick={togglePause}>
              {isPaused ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                </svg>
              )}
            </button>
            <button className="story-close-btn" onClick={onClose}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M18 6L6 18M6 6l12 12" stroke="white" strokeWidth="2"/>
              </svg>
            </button>
          </div>
        </div>
        
        {/* Story content */}
        <div className="story-content" onClick={handleStoryClick}>
          <img
            src={currentStory.mediaUrl}
            alt="Story content"
            className="story-media"
            onLoad={() => setProgress(0)}
          />
        </div>
        
        {/* Navigation areas */}
        <div className="story-nav-left" onClick={handlePrevStory} />
        <div className="story-nav-right" onClick={handleNextStory} />
      </div>
    </div>
  );
};

export default Stories;