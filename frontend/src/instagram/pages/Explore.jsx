import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Heart, MessageCircle, Play } from 'lucide-react';
import { fetchFeed } from '../../store/postsSlice';

const Explore = () => {
  const dispatch = useDispatch();
  const { feed } = useSelector(state => state.posts);
  const [shuffledPosts, setShuffledPosts] = useState([]);

  useEffect(() => {
    dispatch(fetchFeed());
  }, [dispatch]);

  useEffect(() => {
    // Shuffle posts for explore page
    const shuffled = [...feed].sort(() => Math.random() - 0.5);
    setShuffledPosts(shuffled);
  }, [feed]);

  const getGridItemClass = (index) => {
    // Create Instagram-like grid pattern
    // Every 9th item (3x3 pattern) gets special treatment
    const row = Math.floor(index / 3);
    const col = index % 3;
    
    if (row % 3 === 1 && col === 0) {
      return 'col-span-2 row-span-2'; // Large item
    }
    return '';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-light mb-6 hidden md:block">Explore</h1>
      
      <div className="grid grid-cols-3 gap-1 md:gap-4 auto-rows-fr">
        {shuffledPosts.map((post, index) => (
          <div 
            key={`${post._id}-${index}`}
            className={`relative aspect-square group cursor-pointer ${getGridItemClass(index)}`}
          >
            {post.type === 'video' ? (
              <video
                src={post.mediaUrl || post.imageUrl}
                className="w-full h-full object-cover"
                muted
              />
            ) : (
              <img
                src={post.mediaUrl || post.imageUrl}
                alt="Explore post"
                className="w-full h-full object-cover"
              />
            )}
            
            {/* Overlay on hover (desktop) */}
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden md:flex items-center justify-center">
              <div className="flex items-center gap-4 text-white">
                <div className="flex items-center gap-1">
                  <Heart className="h-5 w-5 fill-current" />
                  <span className="font-semibold">{post.likesCount || 0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-5 w-5 fill-current" />
                  <span className="font-semibold">{post.commentsCount || 0}</span>
                </div>
              </div>
            </div>

            {/* Video indicator */}
            {post.type === 'video' && (
              <div className="absolute top-2 right-2">
                <Play className="h-4 w-4 text-white fill-current drop-shadow-lg" />
              </div>
            )}

            {/* Multiple images indicator */}
            {post.type === 'carousel' && (
              <div className="absolute top-2 right-2">
                <div className="w-4 h-4 bg-white bg-opacity-80 rounded-full flex items-center justify-center">
                  <span className="text-xs">📷</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {shuffledPosts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No posts to explore yet</p>
        </div>
      )}
    </div>
  );
};

export default Explore;