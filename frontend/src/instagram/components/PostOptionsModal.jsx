import React, { useState } from 'react';
import { X, Flag, Link2, UserMinus, EyeOff, AlertCircle, Share } from 'lucide-react';
import { trackInteraction } from '../../services/analyticsApi';

const PostOptionsModal = ({ post, isOpen, onClose, isOwnPost = false }) => {
  const [isReporting, setIsReporting] = useState(false);

  const handleOptionClick = async (action) => {
    try {
      await trackInteraction(post._id, 'post', action);
      
      switch (action) {
        case 'share':
          if (navigator.share) {
            navigator.share({
              title: `Post by @${post.author?.username}`,
              text: post.caption,
              url: window.location.href
            });
          } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
          }
          break;
        case 'copy_link':
          navigator.clipboard.writeText(window.location.href);
          alert('Link copied to clipboard!');
          break;
        case 'unfollow':
          // Handle unfollow logic
          alert(`Unfollowed @${post.author?.username}`);
          break;
        case 'report':
          setIsReporting(true);
          return; // Don't close modal yet
        case 'not_interested':
          alert('We\'ll show you fewer posts like this');
          break;
        case 'delete':
          if (confirm('Are you sure you want to delete this post?')) {
            // Handle delete logic
            alert('Post deleted');
          }
          break;
        case 'edit':
          // Handle edit logic
          alert('Edit functionality would open here');
          break;
        default:
          break;
      }
      onClose();
    } catch (error) {
      console.error('Error handling option:', error);
      onClose();
    }
  };

  const handleReport = async (reason) => {
    try {
      await trackInteraction(post._id, 'post', 'report');
      // Handle report logic
      alert(`Post reported for: ${reason}`);
      setIsReporting(false);
      onClose();
    } catch (error) {
      console.error('Error reporting post:', error);
      setIsReporting(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center">
      <div className="bg-white w-full md:w-80 md:rounded-lg">
        {isReporting ? (
          // Report Screen
          <>
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <button onClick={() => setIsReporting(false)} className="text-gray-600">
                ←
              </button>
              <h3 className="font-semibold text-lg text-black">Report</h3>
              <button onClick={onClose}>
                <X className="h-6 w-6 text-gray-600" />
              </button>
            </div>
            <div className="py-2">
              <p className="px-4 py-2 text-sm text-gray-600">
                Why are you reporting this post?
              </p>
              {[
                'Spam',
                'Nudity or sexual activity', 
                'Hate speech or symbols',
                'Violence or dangerous organizations',
                'Bullying or harassment',
                'Intellectual property violation',
                'Suicide or self-injury',
                'Eating disorders',
                'Scam or fraud',
                'False information'
              ].map((reason) => (
                <button
                  key={reason}
                  onClick={() => handleReport(reason)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 text-black"
                >
                  {reason}
                </button>
              ))}
            </div>
          </>
        ) : (
          // Main Options Screen
          <>
            <div className="py-2">
              {isOwnPost ? (
                // Options for own posts
                <>
                  <button
                    onClick={() => handleOptionClick('delete')}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 text-red-600 font-medium border-b border-gray-100"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleOptionClick('edit')}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 text-black border-b border-gray-100"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleOptionClick('turn_off_commenting')}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 text-black border-b border-gray-100"
                  >
                    Turn off commenting
                  </button>
                </>
              ) : (
                // Options for other users' posts
                <>
                  <button
                    onClick={() => handleOptionClick('report')}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 text-red-600 font-medium border-b border-gray-100 flex items-center"
                  >
                    <Flag className="h-4 w-4 mr-3" />
                    Report
                  </button>
                  <button
                    onClick={() => handleOptionClick('unfollow')}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 text-red-600 border-b border-gray-100 flex items-center"
                  >
                    <UserMinus className="h-4 w-4 mr-3" />
                    Unfollow @{post.author?.username}
                  </button>
                  <button
                    onClick={() => handleOptionClick('not_interested')}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 text-black border-b border-gray-100 flex items-center"
                  >
                    <EyeOff className="h-4 w-4 mr-3" />
                    Not interested
                  </button>
                </>
              )}
              
              {/* Common options */}
              <button
                onClick={() => handleOptionClick('share')}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 text-black border-b border-gray-100 flex items-center"
              >
                <Share className="h-4 w-4 mr-3" />
                Share
              </button>
              <button
                onClick={() => handleOptionClick('copy_link')}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 text-black border-b border-gray-100 flex items-center"
              >
                <Link2 className="h-4 w-4 mr-3" />
                Copy link
              </button>
              <button
                onClick={() => handleOptionClick('about_account')}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 text-black flex items-center"
              >
                <AlertCircle className="h-4 w-4 mr-3" />
                About this account
              </button>
            </div>
            
            <div className="border-t border-gray-200">
              <button
                onClick={onClose}
                className="w-full text-center py-3 text-black font-medium"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PostOptionsModal;