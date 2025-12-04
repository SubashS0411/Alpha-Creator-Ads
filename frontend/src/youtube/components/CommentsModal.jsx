import React, { useState, useEffect } from 'react';
import { MdClose, MdThumbUp, MdThumbDown, MdMoreVert } from 'react-icons/md';

const CommentsModal = ({ isOpen, onClose, videoId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && videoId) {
      fetchComments();
    }
  }, [isOpen, videoId]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5001/api/youtube/comments/video/${videoId}`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error);
      // Mock comments for demo
      setComments([
        {
          _id: '1',
          text: 'Great video! Really helpful content.',
          author: { name: 'John Doe', avatarUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiMzMzY2Q0MiLz4KPHRleHQgeD0iNTAlIiB5PSI1MCUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjEyIj5KRDwvdGV4dD4KPC9zdmc+' },
          likes: 12,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          replies: []
        },
        {
          _id: '2', 
          text: 'Thanks for explaining this so clearly. Looking forward to more videos like this!',
          author: { name: 'Sarah Smith', avatarUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNGRjY2MDAiLz4KPHRleHQgeD0iNTAlIiB5PSI1MCUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjEyIj5TUzwvdGV4dD4KPC9zdmc+' },
          likes: 8,
          createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
          replies: [
            {
              _id: '2a',
              text: 'Totally agree! This channel is amazing.',
              author: { name: 'Mike Johnson', avatarUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiMwMEFBNzciLz4KPHRleHQgeD0iNTAlIiB5PSI1MCUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjEyIj5NSjwvdGV4dD4KPC9zdmc+' },
              likes: 3,
              createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000)
            }
          ]
        },
        {
          _id: '3',
          text: 'Could you make a follow-up video about advanced techniques?',
          author: { name: 'Emily Davis', avatarUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM5OTMzQ0MiLz4KPHRleHQgeD0iNTAlIiB5PSI1MCUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjEyIj5FRDwvdGV4dD4KPC9zdmc+' },
          likes: 15,
          createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
          replies: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment = {
      text: newComment,
      author: { name: 'You', avatarUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNGRjAwMDAiLz4KPHRleHQgeD0iNTAlIiB5PSI1MCUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjEyIj5ZPC90ZXh0Pgo8L3N2Zz4=' },
      likes: 0,
      createdAt: new Date(),
      replies: []
    };

    setComments(prev => [comment, ...prev]);
    setNewComment('');
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffTime = Math.abs(now - new Date(date));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return '1 day ago';
    return `${diffDays} days ago`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end max-w-sm mx-auto">
      <div className="bg-white w-full h-3/4 rounded-t-xl flex flex-col max-w-sm">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium">Comments {comments.length > 0 && `(${comments.length})`}</h2>
          <button onClick={onClose} className="p-2">
            <MdClose className="w-6 h-6" />
          </button>
        </div>

        {/* Comment Input */}
        <div className="p-4 border-b border-gray-200">
          <form onSubmit={handleSubmitComment} className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
              Y
            </div>
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 border-b border-gray-300 pb-1 focus:border-gray-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="px-4 py-1 bg-blue-500 text-white rounded-full text-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Post
            </button>
          </form>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {comments.map((comment) => (
                <div key={comment._id} className="p-4">
                  <div className="flex items-start space-x-3">
                    <img
                      src={comment.author.avatarUrl}
                      alt={comment.author.name}
                      className="w-8 h-8 rounded-full"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${comment.author.name}&background=random`;
                      }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-sm">{comment.author.name}</span>
                        <span className="text-gray-500 text-xs">{formatTimeAgo(comment.createdAt)}</span>
                      </div>
                      <p className="text-gray-900 text-sm mb-2">{comment.text}</p>
                      <div className="flex items-center space-x-4">
                        <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-600">
                          <MdThumbUp className="w-4 h-4" />
                          <span className="text-xs">{comment.likes}</span>
                        </button>
                        <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-600">
                          <MdThumbDown className="w-4 h-4" />
                        </button>
                        <button className="text-xs text-gray-600 hover:text-blue-600">Reply</button>
                      </div>

                      {/* Replies */}
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-3 ml-4 space-y-3">
                          {comment.replies.map((reply) => (
                            <div key={reply._id} className="flex items-start space-x-3">
                              <img
                                src={reply.author.avatarUrl}
                                alt={reply.author.name}
                                className="w-6 h-6 rounded-full"
                                onError={(e) => {
                                  e.target.src = `https://ui-avatars.com/api/?name=${reply.author.name}&background=random`;
                                }}
                              />
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="font-medium text-xs">{reply.author.name}</span>
                                  <span className="text-gray-500 text-xs">{formatTimeAgo(reply.createdAt)}</span>
                                </div>
                                <p className="text-gray-900 text-xs mb-1">{reply.text}</p>
                                <div className="flex items-center space-x-3">
                                  <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-600">
                                    <MdThumbUp className="w-3 h-3" />
                                    <span className="text-xs">{reply.likes}</span>
                                  </button>
                                  <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-600">
                                    <MdThumbDown className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentsModal;