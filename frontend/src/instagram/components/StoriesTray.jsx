import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import StoryViewer from './StoryViewer';

const StoriesTray = () => {
  const [showStoryViewer, setShowStoryViewer] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);

  // Mock stories data with proper story structure
  const mockStories = [
    {
      _id: 'story1',
      author: {
        _id: 'user1',
        username: 'mkce_family',
        profilePictureUrl: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=80&h=80&fit=crop&crop=face'
      },
      mediaUrl: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=1080&h=1920&fit=crop',
      mediaType: 'image',
      duration: 5,
      caption: 'Beautiful campus life 🏫',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      viewsCount: 45
    },
    {
      _id: 'story2',
      author: {
        _id: 'user2',
        username: 'namma_mkce',
        profilePictureUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face'
      },
      mediaUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1080&h=1920&fit=crop',
      mediaType: 'image',
      duration: 5,
      caption: 'Study session! 📚',
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      viewsCount: 89
    },
    {
      _id: 'story3',
      author: {
        _id: 'user3',
        username: 'ena_love_m',
        profilePictureUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&h=80&fit=crop&crop=face'
      },
      mediaUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1080&h=1920&fit=crop',
      mediaType: 'image',
      duration: 5,
      caption: 'Weekend vibes ✨',
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      viewsCount: 123
    }
  ];

  const stories = [
    {
      id: 1,
      username: 'Your story',
      profilePic: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&crop=face',
      hasStory: false,
      isYourStory: true
    },
    {
      id: 2,
      username: 'mkce_family',
      profilePic: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=80&h=80&fit=crop&crop=face',
      hasStory: true,
      isYourStory: false
    },
    {
      id: 3,
      username: 'namma_mkce',
      profilePic: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face',
      hasStory: true,
      isYourStory: false
    },
    {
      id: 4,
      username: 'ena_love_m',
      profilePic: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&h=80&fit=crop&crop=face',
      hasStory: true,
      isYourStory: false
    }
  ];

  const handleStoryClick = (index) => {
    setSelectedStoryIndex(index - 1); // Subtract 1 because first item is "Your story"
    setShowStoryViewer(true);
  };

  const closeStoryViewer = () => {
    setShowStoryViewer(false);
  };

  return (
    <>
      <div className="flex space-x-4 px-3 py-2 overflow-x-auto bg-black bg-opacity-50 backdrop-blur-sm border-b border-gray-900">
        {stories.map((story, index) => (
          <div 
            key={story.id} 
            className="flex flex-col items-center space-y-1 min-w-max cursor-pointer"
            onClick={() => {
              if (story.hasStory && !story.isYourStory) {
                handleStoryClick(index);
              }
            }}
          >
            <div className="relative">
              <div
                className={`w-14 h-14 rounded-full p-0.5 ${
                  story.hasStory && !story.isYourStory
                    ? 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500'
                    : 'bg-gray-600'
                }`}
              >
                <div className="w-full h-full rounded-full bg-black p-0.5">
                  <img
                    src={story.profilePic}
                    alt={story.username}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>
              {story.isYourStory && (
                <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-0.5 border-2 border-black">
                  <Plus className="h-2.5 w-2.5 text-white" />
                </div>
              )}
            </div>
            <span className="text-[10px] text-white text-center max-w-14 truncate font-normal">
              {story.username}
            </span>
          </div>
        ))}
      </div>

      {showStoryViewer && (
        <StoryViewer 
          stories={mockStories} 
          initialIndex={selectedStoryIndex}
          onClose={closeStoryViewer}
        />
      )}
    </>
  );
};

export default StoriesTray;