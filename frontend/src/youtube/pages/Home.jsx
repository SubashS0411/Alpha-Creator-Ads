import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { MdExplore } from 'react-icons/md';
import { fetchHomeVideos, setSelectedCategory } from '../../store/youtubeSlice';
import VideoCard from '../components/VideoCard';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const scrollRef = useRef();
  
  const { 
    homeVideos, 
    selectedCategory, 
    categories, 
    homeLoading, 
    homeError 
  } = useSelector(state => state.youtube);

  // YouTube spec categories with Explore icon first
  const youtubeCategories = [
    { id: 'All', name: 'All', icon: null },
    { id: 'Gaming', name: 'Gaming', icon: null },
    { id: 'Music', name: 'Music', icon: null },
    { id: 'Live', name: 'Live', icon: null },
    { id: 'Mixes', name: 'Mixes', icon: null },
    { id: 'Programming', name: 'Programming', icon: null }
  ];

  useEffect(() => {
    dispatch(fetchHomeVideos({ category: selectedCategory }));
  }, [dispatch, selectedCategory]);

  const handleCategoryChange = (category) => {
    dispatch(setSelectedCategory(category));
  };

  const handleVideoClick = (video) => {
    navigate(`/youtube/watch/${video._id}`);
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatViews = (views) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  const getRelativeTime = (date) => {
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

  if (homeLoading && homeVideos.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Categories Bar - YouTube Spec */}
      <div className="sticky top-0 bg-white border-b border-gray-200 py-2 px-4 z-40">
        <div 
          ref={scrollRef}
          className="flex space-x-3 overflow-x-auto scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* Explore Icon First */}
          <button
            onClick={() => navigate('/youtube/explore')}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex-shrink-0"
          >
            <MdExplore className="w-5 h-5 text-gray-700" />
          </button>
          
          {/* Category Pills */}
          {youtubeCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`px-3 py-1.5 rounded-full whitespace-nowrap text-sm font-medium transition-colors flex-shrink-0 ${
                selectedCategory === category.id
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Videos List */}
      <div className="flex-1 overflow-y-auto">
        {homeError && (
          <div className="p-4 text-center text-red-600">
            <p>Error loading videos: {homeError}</p>
            <button 
              onClick={() => dispatch(fetchHomeVideos({ category: selectedCategory }))}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}
        
        <div className="space-y-4 pb-4">
          {homeVideos.map((video) => (
            <div key={video._id}>
              <VideoCard video={video} showActions={true} />
            </div>
          ))}
          
          {homeVideos.length === 0 && !homeLoading && !homeError && (
            <div className="p-8 text-center text-gray-500">
              <p>No videos found for this category.</p>
            </div>
          )}
        </div>
        
        {homeLoading && homeVideos.length > 0 && (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;