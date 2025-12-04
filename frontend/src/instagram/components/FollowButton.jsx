import React, { useState } from 'react';
import { trackInteraction } from '../../services/analyticsApi';

const FollowButton = ({ 
  user, 
  isFollowing: initialFollowing = false, 
  className = '', 
  size = 'md',
  variant = 'primary' 
}) => {
  const [isFollowing, setIsFollowing] = useState(initialFollowing);
  const [isLoading, setIsLoading] = useState(false);

  const handleFollowToggle = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    const newFollowState = !isFollowing;
    
    try {
      // Optimistically update UI
      setIsFollowing(newFollowState);
      
      // Track the interaction
      await trackInteraction(user._id, 'user', newFollowState ? 'follow' : 'unfollow');
      
      // Here you would make the actual API call
      // await followUser(user._id, newFollowState);
      
      console.log(`${newFollowState ? 'Followed' : 'Unfollowed'} @${user.username}`);
      
    } catch (error) {
      // Revert on error
      setIsFollowing(!newFollowState);
      console.error('Follow action failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-2 py-1 text-xs';
      case 'lg':
        return 'px-6 py-3 text-base';
      default:
        return 'px-3 py-1 text-sm';
    }
  };

  const getVariantClasses = () => {
    if (isFollowing) {
      return variant === 'primary' 
        ? 'bg-gray-200 text-black border border-gray-300 hover:bg-gray-300'
        : 'border border-white text-white hover:bg-white hover:text-black';
    }
    
    return variant === 'primary'
      ? 'bg-blue-500 text-white border border-blue-500 hover:bg-blue-600'
      : 'border border-white text-white hover:bg-white hover:text-black';
  };

  return (
    <button
      onClick={handleFollowToggle}
      disabled={isLoading}
      className={`
        font-semibold rounded-md transition-colors duration-200
        ${getSizeClasses()}
        ${getVariantClasses()}
        ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {isLoading ? (
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin"></div>
          <span>{isFollowing ? 'Following' : 'Follow'}</span>
        </div>
      ) : (
        isFollowing ? 'Following' : 'Follow'
      )}
    </button>
  );
};

export default FollowButton;