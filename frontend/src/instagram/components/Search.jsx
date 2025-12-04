import React, { useState, useEffect } from 'react';
import './Search.css';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [exploreData, setExploreData] = useState([]);

  // Mock explore data - in real app this would come from API
  const mockExploreData = [
    { id: 1, type: 'image', url: 'https://picsum.photos/300/300?random=1', likes: 1234 },
    { id: 2, type: 'image', url: 'https://picsum.photos/300/300?random=2', likes: 856 },
    { id: 3, type: 'reel', url: 'https://picsum.photos/300/600?random=3', likes: 2341, isVideo: true },
    { id: 4, type: 'image', url: 'https://picsum.photos/300/300?random=4', likes: 543 },
    { id: 5, type: 'image', url: 'https://picsum.photos/300/300?random=5', likes: 987 },
    { id: 6, type: 'image', url: 'https://picsum.photos/300/300?random=6', likes: 445 },
    { id: 7, type: 'featured', url: 'https://picsum.photos/600/600?random=7', likes: 3456, isFeatured: true },
    { id: 8, type: 'image', url: 'https://picsum.photos/300/300?random=8', likes: 789 },
    { id: 9, type: 'reel', url: 'https://picsum.photos/300/600?random=9', likes: 1567, isVideo: true },
    { id: 10, type: 'image', url: 'https://picsum.photos/300/300?random=10', likes: 234 },
    { id: 11, type: 'image', url: 'https://picsum.photos/300/300?random=11', likes: 678 },
    { id: 12, type: 'image', url: 'https://picsum.photos/300/300?random=12', likes: 890 }
  ];

  useEffect(() => {
    // Fetch real explore data from API
    const fetchExploreData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/db/posts/explore');
        if (response.ok) {
          const posts = await response.json();
          const exploreItems = posts.map((post, index) => ({
            id: post._id || index,
            type: 'image',
            url: post.imageUrl,
            likes: post.likes || 0,
            username: post.username,
            caption: post.caption
          }));
          setExploreData(exploreItems);
        } else {
          // Fallback to mock data if API fails
          setExploreData(mockExploreData);
        }
      } catch (error) {
        console.error('Failed to fetch explore data:', error);
        setExploreData(mockExploreData);
      }
    };
    
    fetchExploreData();
  }, []);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    
    // Track search query for analytics
    if (query.trim()) {
      try {
        await fetch('http://localhost:5000/api/analytics/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            queryText: query,
            timestamp: new Date().toISOString()
          }),
        });
      } catch (error) {
        console.error('Failed to track search:', error);
      }
    }

    // Search users and posts from API
    if (query.trim()) {
      try {
        // Search users
        const usersResponse = await fetch(`http://localhost:5000/api/db/users/search/${encodeURIComponent(query)}`);
        let users = [];
        if (usersResponse.ok) {
          users = await usersResponse.json();
        }

        // Search posts by hashtag if query starts with #
        let posts = [];
        if (query.startsWith('#')) {
          const tag = query.slice(1);
          const postsResponse = await fetch(`http://localhost:5000/api/db/posts/hashtag/${encodeURIComponent(tag)}`);
          if (postsResponse.ok) {
            posts = await postsResponse.json();
          }
        }

        // Combine results
        const results = [
          ...users.map(user => ({
            id: user._id,
            type: 'user',
            username: user.username,
            fullName: user.fullName,
            profilePicture: user.profilePicture,
            followers: user.followers,
            isVerified: user.isVerified
          })),
          ...posts.map(post => ({
            id: post._id,
            type: 'post',
            url: post.imageUrl,
            likes: post.likes,
            username: post.username,
            caption: post.caption
          }))
        ];

        setSearchResults(results);
      } catch (error) {
        console.error('Search failed:', error);
        // Fallback to mock search
        const filtered = mockExploreData.filter(item => 
          item.id.toString().includes(query) || 
          Math.random() > 0.5 // Mock relevance
        );
        setSearchResults(filtered);
      }
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  };

  const openDetailView = (item) => {
    // Track interaction for analytics
    try {
      fetch('http://localhost:5000/api/analytics/interaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId: item.id,
          actionType: 'view',
          timestamp: new Date().toISOString()
        }),
      });
    } catch (error) {
      console.error('Failed to track interaction:', error);
    }

    // In real app, this would open a detail modal or navigate to post
    console.log('Opening detail view for:', item);
  };

  const getGridItemClass = (index) => {
    // Masonry logic: Every 3rd row, rightmost item is vertical
    // Every 9th item (3x3 pattern) is featured (2x2)
    if ((index + 1) % 9 === 0) return 'grid-item featured';
    if ((index % 3 === 2) && (Math.floor(index / 3) % 3 === 2)) return 'grid-item vertical';
    return 'grid-item';
  };

  const dataToShow = searchQuery.trim() ? searchResults : exploreData;

  return (
    <div className="search-container">
      <div className="search-header">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="search-input"
          />
          <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 19l-3.5-3.5m0 0a7 7 0 1 0-9.9-9.9 7 7 0 0 0 9.9 9.9z" stroke="currentColor" strokeWidth="2" fill="none"/>
          </svg>
        </div>
      </div>

      <div className="explore-grid">
        {dataToShow.map((item, index) => (
          <div 
            key={item.id} 
            className={getGridItemClass(index)}
            onClick={() => openDetailView(item)}
          >
            <div className="grid-item-content">
              <img 
                src={item.url} 
                alt=""
                className="grid-item-image"
                loading="lazy"
              />
              
              {/* Video indicator for reels */}
              {item.isVideo && (
                <div className="video-indicator">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              )}
              
              {/* Multiple photos indicator */}
              {item.type === 'featured' && (
                <div className="multi-indicator">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                    <rect x="7" y="7" width="10" height="10" rx="1" ry="1" stroke="currentColor" strokeWidth="2" fill="none"/>
                  </svg>
                </div>
              )}

              {/* Hover overlay with likes count */}
              <div className="grid-item-overlay">
                <div className="overlay-stats">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                  <span>{item.likes.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {searchQuery.trim() && searchResults.length === 0 && (
        <div className="no-results">
          <p>No results found for "{searchQuery}"</p>
          <p>Try searching for something else.</p>
        </div>
      )}
    </div>
  );
};

export default Search;