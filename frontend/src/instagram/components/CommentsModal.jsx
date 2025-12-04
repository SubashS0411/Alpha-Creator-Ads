import React, { useState, useEffect, useRef } from 'react';
import { X, Heart, Send, MoreHorizontal } from 'lucide-react';
import { trackInteraction } from '../../services/analyticsApi';

const CommentsModal = ({ post, isOpen, onClose }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef(null);

  // Mock comments data - in real app this would come from API
  const mockComments = [
    {
      _id: 'comment1',
      text: 'Amazing shot! 😍',
      author: {
        _id: 'user1',
        username: 'photo_lover',
        profilePictureUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face'
      },
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      likes: ['user2', 'user3'],
      likesCount: 2
    },
    {
      _id: 'comment2',
      text: 'Where is this place? I need to visit! 📍',
      author: {
        _id: 'user2',
        username: 'travel_bug',
        profilePictureUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face'
      },
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      likes: ['user1'],
      likesCount: 1
    },
    {
      _id: 'comment3',
      text: 'The lighting is perfect! 💯',
      author: {
        _id: 'user3',
        username: 'photography_pro',
        profilePictureUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face'
      },
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      likes: [],
      likesCount: 0
    }
  ];

  useEffect(() => {
    if (isOpen) {
      // Load comments - use post comments if available, otherwise use mock data
      setComments(post?.comments || mockComments);
      // Focus text input
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  }, [isOpen, post]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || isLoading) return;

    setIsLoading(true);
    
    try {
      // Track comment interaction
      await trackInteraction(post._id, 'comment', 'add');

      // Create new comment object
      const newCommentObj = {
        _id: `comment_${Date.now()}`,
        text: newComment.trim(),
        author: {
          _id: 'current_user',
          username: 'you',
          profilePictureUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face'
        },
        createdAt: new Date().toISOString(),
        likes: [],
        likesCount: 0
      };

      // Add comment to local state
      setComments(prev => [newCommentObj, ...prev]);
      setNewComment('');

      // Here you would typically make an API call to save the comment
      // await addComment(post._id, newComment.trim());

    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLikeComment = async (commentId) => {
    try {
      await trackInteraction(commentId, 'comment', 'like');
      
      setComments(prev => prev.map(comment => 
        comment._id === commentId 
          ? { 
              ...comment, 
              likesCount: comment.likes?.includes('current_user') 
                ? comment.likesCount - 1 
                : comment.likesCount + 1,
              likes: comment.likes?.includes('current_user')
                ? comment.likes.filter(id => id !== 'current_user')
                : [...(comment.likes || []), 'current_user']
            }
          : comment
      ));
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    return `${Math.floor(diffInSeconds / 86400)}d`;
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 bg-black bg-opacity-75 z-50 flex items-end justify-center">
      <div className="bg-white w-full md:w-96 md:max-w-sm h-full md:h-96 md:rounded-lg flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="font-semibold text-lg text-black">Comments</h3>
          <button onClick={onClose} className="p-1">
            <X className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {comments.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p>No comments yet.</p>
              <p className="text-sm">Be the first to comment!</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment._id} className="flex items-start space-x-3">
                <img
                  src={comment.author?.profilePictureUrl}
                  alt={comment.author?.username}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-start space-x-2">
                    <span className="font-semibold text-sm text-black">
                      {comment.author?.username}
                    </span>
                    <span className="text-sm text-gray-600 flex-1">
                      {comment.text}
                    </span>
                    <button
                      onClick={() => handleLikeComment(comment._id)}
                      className="ml-2 mt-1"
                    >
                      <Heart 
                        className={`h-3 w-3 ${
                          comment.likes?.includes('current_user') 
                            ? 'text-red-500 fill-current' 
                            : 'text-gray-400'
                        }`} 
                      />
                    </button>
                  </div>
                  <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                    <span>{formatTimeAgo(comment.createdAt)}</span>
                    {comment.likesCount > 0 && (
                      <span>{comment.likesCount} like{comment.likesCount !== 1 ? 's' : ''}</span>
                    )}
                    <button className="font-medium text-gray-600">Reply</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Comment Input */}
        <form onSubmit={handleSubmitComment} className="border-t border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face"
              alt="Your avatar"
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="flex-1 flex items-center space-x-2">
              <textarea
                ref={textareaRef}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 resize-none text-sm text-black placeholder-gray-500 border-none outline-none bg-transparent max-h-20"
                rows={1}
                style={{ resize: 'none' }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmitComment(e);
                  }
                }}
              />
              <button
                type="submit"
                disabled={!newComment.trim() || isLoading}
                className={`p-1 rounded ${
                  newComment.trim() && !isLoading
                    ? 'text-blue-500 hover:text-blue-600'
                    : 'text-gray-400 cursor-not-allowed'
                }`}
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CommentsModal;