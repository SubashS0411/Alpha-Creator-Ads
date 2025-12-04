import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  MessageCircle, 
  Send, 
  Bookmark,
  MoreHorizontal,
  Volume2,
  VolumeX
} from 'lucide-react';
import { toggleLike, addComment, updatePostOptimistic } from '../../store/postsSlice';
import { trackInteraction, trackViewDuration } from '../../services/analyticsApi';
import VideoViewer from './VideoViewer';
import CommentsModal from './CommentsModal';
import PostOptionsModal from './PostOptionsModal';

const PostCard = ({ post, allVideos, allImages, onVideoClick, onImageClick }) => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector(state => state.auth);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isLiked, setIsLiked] = useState(
    post.likes?.includes(currentUser?._id) || false
  );
  const [isSaved, setIsSaved] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [likesCount, setLikesCount] = useState(post.likesCount || Math.floor(Math.random() * 1000) + 100);
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);
  const [showVideoViewer, setShowVideoViewer] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  
  // Refs for tracking
  const postRef = useRef(null);
  const videoRef = useRef(null);
  const viewStartTimeRef = useRef(null);
  const intersectionObserverRef = useRef(null);
  
  // Double-tap detection
  const lastTapRef = useRef(0);

  // View duration tracking
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Post is visible, start tracking
            viewStartTimeRef.current = Date.now();
            
            // Auto-play video if it's a video post
            if (post.type === 'video' && videoRef.current) {
              videoRef.current.play().catch(console.error);
            }
          } else {
            // Post is no longer visible, track duration
            if (viewStartTimeRef.current) {
              const duration = Date.now() - viewStartTimeRef.current;
              if (duration > 1000) { // Only track if viewed for more than 1 second
                trackViewDuration(post._id, post.type || 'image', duration);
              }
              viewStartTimeRef.current = null;
            }
            
            // Pause video when not visible
            if (post.type === 'video' && videoRef.current) {
              videoRef.current.pause();
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    if (postRef.current) {
      observer.observe(postRef.current);
      intersectionObserverRef.current = observer;
    }

    return () => {
      if (intersectionObserverRef.current) {
        intersectionObserverRef.current.disconnect();
      }
      // Track final duration on cleanup
      if (viewStartTimeRef.current) {
        const duration = Date.now() - viewStartTimeRef.current;
        if (duration > 1000) {
          trackViewDuration(post._id, post.type || 'image', duration);
        }
      }
    };
  }, [post._id, post.type]);

  const handleLike = async () => {
    const newLiked = !isLiked;
    setIsLiked(newLiked);
    setLikesCount(prev => newLiked ? prev + 1 : prev - 1);

    try {
      // Track interaction
      await trackInteraction(post._id, post.type || 'image', 'like');
      
      // Only try API if post has valid MongoDB ObjectId
      if (post._id && post._id.length === 24) {
        await dispatch(toggleLike({
          postId: post._id,
          userId: currentUser?._id
        })).unwrap();
      }
    } catch (error) {
      setIsLiked(!newLiked);
      setLikesCount(prev => newLiked ? prev - 1 : prev + 1);
      console.warn('Like failed:', error);
    }
  };

  const handleSave = async () => {
    const newSaved = !isSaved;
    setIsSaved(newSaved);

    try {
      // Track interaction
      await trackInteraction(post._id, post.type || 'image', 'save');
    } catch (error) {
      console.warn('Save tracking failed:', error);
    }
  };

  const handleDoubleTap = (e) => {
    const currentTime = Date.now();
    const tapLength = currentTime - lastTapRef.current;
    
    if (tapLength < 500 && tapLength > 0) {
      // Double tap detected
      if (!isLiked) {
        handleLike();
      }
      
      // Show heart animation
      setShowHeartAnimation(true);
      setTimeout(() => setShowHeartAnimation(false), 1000);
      
      e.preventDefault();
    }
    
    lastTapRef.current = currentTime;
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const handleCommentSubmit = async (e) => {
    if (e.key === 'Enter' && commentText.trim()) {
      try {
        // Track interaction
        await trackInteraction(post._id, post.type || 'image', 'comment');
        
        // Only try API if post has valid MongoDB ObjectId
        if (post._id && post._id.length === 24) {
          await dispatch(addComment({
            postId: post._id,
            comment: {
              text: commentText.trim(),
              author: currentUser?._id
            }
          })).unwrap();
        }
      } catch (error) {
        console.warn('Comment failed:', error);
      }
      setCommentText('');
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '3d';
    
    const now = new Date();
    const postTime = new Date(timestamp);
    const diffInMs = now - postTime;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) return 'now';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInHours < 24) return `${diffInHours}h`;
    if (diffInDays < 7) return `${diffInDays}d`;
    return postTime.toLocaleDateString();
  };

  return (
    <>
      <style>
        {`
          @keyframes heartPop {
            0% {
              transform: scale(0.8);
              opacity: 0.8;
            }
            15% {
              transform: scale(1.2);
              opacity: 1;
            }
            30% {
              transform: scale(1.0);
              opacity: 1;
            }
            50% {
              transform: scale(1.1);
              opacity: 0.8;
            }
            100% {
              transform: scale(1.3);
              opacity: 0;
            }
          }
        `}
      </style>
      <div ref={postRef} className="bg-black bg-opacity-80 backdrop-blur-sm text-white border-b border-gray-900">
      {/* Post Header */}
      <div className="flex items-center justify-between px-3 py-2.5">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-700">
            <img
              src={post?.author?.profilePictureUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face'}
              alt={post?.author?.username || 'User'}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="font-semibold text-sm text-white">
              {post?.author?.username || 'siddahmed'}
            </span>
            <span className="w-0.5 h-0.5 bg-gray-500 rounded-full"></span>
            <span className="text-gray-400 text-sm">{formatTimestamp(post.createdAt)}</span>
            {post?.author?.isVerified && (
              <span className="text-blue-400 text-sm ml-1">✓</span>
            )}
          </div>
        </div>
        <button onClick={() => setShowOptionsModal(true)}>
          <MoreHorizontal className="h-6 w-6 text-white" />
        </button>
      </div>

      {/* Post Media */}
      <div className="w-full aspect-square bg-black relative">
        {post.type === 'video' ? (
          <>
            <video
              ref={videoRef}
              src={post?.mediaUrl || post?.imageUrl}
              className="w-full h-full object-cover cursor-pointer"
              loop
              muted={isMuted}
              playsInline
              onClick={(e) => {
                // Check if it's a double tap for like animation
                const now = Date.now();
                const timeSinceLastTap = now - lastTapRef.current;
                
                if (timeSinceLastTap < 300) {
                  // Double tap - trigger like animation
                  handleDoubleTap(e);
                } else {
                  // Single tap - open video viewer
                  if (onVideoClick) {
                    onVideoClick(post, allVideos);
                  } else {
                    setShowVideoViewer(true);
                  }
                }
                
                lastTapRef.current = now;
              }}
            />
            {/* Video Controls */}
            <button
              onClick={toggleMute}
              className="absolute top-4 right-4 w-8 h-8 bg-black bg-opacity-50 rounded-full flex items-center justify-center"
            >
              {isMuted ? <VolumeX className="h-4 w-4 text-white" /> : <Volume2 className="h-4 w-4 text-white" />}
            </button>
          </>
        ) : (
          <img
            src={post?.mediaUrl || post?.imageUrl || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&h=500&fit=crop'}
            alt="Post content"
            className="w-full h-full object-cover cursor-pointer"
            onClick={(e) => {
              const now = Date.now();
              const timeSinceLastTap = now - lastTapRef.current;
              
              if (timeSinceLastTap < 300) {
                // Double tap - trigger like animation
                handleDoubleTap(e);
              } else {
                // Single tap - open image viewer
                if (onImageClick) {
                  onImageClick(post, allImages);
                }
              }
              
              lastTapRef.current = now;
            }}
          />
        )}
        
        {/* Heart Animation Overlay */}
        {showHeartAnimation && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Heart 
              className="w-20 h-20 text-white fill-white animate-ping"
              style={{
                animation: 'heartPop 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards'
              }}
            />
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between px-3 py-2">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLike}
            className="transition-colors"
          >
            <Heart
              className={`h-6 w-6 ${
                isLiked ? 'fill-red-500 text-red-500' : 'text-white'
              }`}
            />
          </button>
          <button onClick={() => setShowCommentsModal(true)}>
            <MessageCircle className="h-6 w-6 text-white" />
          </button>
          <button onClick={() => trackInteraction(post._id, 'post', 'share')}>
            <Send className="h-6 w-6 text-white" />
          </button>
        </div>
        <button 
          onClick={handleSave}
          className="transition-colors"
        >
          <Bookmark className={`h-6 w-6 ${isSaved ? 'fill-white text-white' : 'text-white'}`} />
        </button>
      </div>

      {/* Likes */}
      <div className="px-3 pb-1">
        <span className="font-semibold text-sm text-white">
          {likesCount.toLocaleString()} likes
        </span>
      </div>

      {/* Caption */}
      <div className="px-3 pb-1">
        <span className="font-semibold text-sm text-white mr-2">
          {post?.author?.username || 'siddahmed'}
        </span>
        <span className="text-sm text-white">
          {post?.caption || 'Beautiful view from the road! Amazing scenery 🌅🚗'}
        </span>
      </div>

      {/* Comments Preview */}
      {post?.comments && post.comments.length > 0 && (
        <div className="px-3 pb-1">
          <button 
            onClick={() => setShowComments(!showComments)}
            className="text-gray-400 text-sm"
          >
            View all {post.comments.length} comments
          </button>
        </div>
      )}

      {/* Add Comment */}
      <div className="px-3 pb-2 pt-1">
        <div className="flex items-center space-x-2">
          <img
            src={currentUser?.profilePictureUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=30&h=30&fit=crop&crop=face"}
            alt="Your profile"
            className="w-6 h-6 rounded-full object-cover"
          />
          <input
            type="text"
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyPress={handleCommentSubmit}
            className="flex-1 bg-transparent text-sm text-gray-300 outline-none placeholder-gray-500"
          />
          {commentText.trim() && (
            <button 
              onClick={() => handleCommentSubmit({ key: 'Enter' })}
              className="text-blue-400 text-sm font-semibold"
            >
              Post
            </button>
          )}
        </div>
      </div>

      {/* Time ago */}
      <div className="px-3 pb-3">
        <span className="text-gray-400 text-xs uppercase tracking-wide">
          {formatTimestamp(post.createdAt).toUpperCase()} AGO
        </span>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="px-3 pb-4 border-t border-gray-800 pt-3">
          {post?.comments?.slice(0, 3).map((comment, index) => (
            <div key={index} className="flex items-start space-x-3 mb-3">
              <img
                src={comment.author?.profilePictureUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=30&h=30&fit=crop&crop=face"}
                alt={comment.author?.username}
                className="w-6 h-6 rounded-full object-cover mt-1"
              />
              <div className="flex-1">
                <span className="font-semibold text-sm text-white mr-2">
                  {comment.author?.username || 'user'}
                </span>
                <span className="text-sm text-white">{comment.text}</span>
              </div>
            </div>
          )) || (
            <div className="text-gray-400 text-sm">No comments yet</div>
          )}
        </div>
      )}
      
      {/* Video Viewer Modal - Only for video posts */}
      {showVideoViewer && post.type === 'video' && allVideos && (
        <VideoViewer
          videos={allVideos}
          initialIndex={allVideos.findIndex(video => video._id === post._id)}
          onClose={() => setShowVideoViewer(false)}
        />
      )}

      {/* Comments Modal */}
      <CommentsModal
        post={post}
        isOpen={showCommentsModal}
        onClose={() => setShowCommentsModal(false)}
      />

      {/* Post Options Modal */}
      <PostOptionsModal
        post={post}
        isOpen={showOptionsModal}
        onClose={() => setShowOptionsModal(false)}
        isOwnPost={post.author?._id === currentUser?._id}
      />
      </div>
    </>
  );
};

export default PostCard;