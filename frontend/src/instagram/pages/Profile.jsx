import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Play, Bookmark, Tag, MoreHorizontal, Heart, MessageCircle } from 'lucide-react';
import { fetchUserProfile } from '../../store/usersSlice';

const Profile = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const { currentProfile, currentProfilePosts, loading } = useSelector(state => state.users);
  const { currentUser } = useSelector(state => state.auth);
  const [activeTab, setActiveTab] = useState('posts');

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserProfile(userId));
    }
  }, [userId, dispatch]);

  const isOwnProfile = currentUser?._id === userId;

  if (loading || !currentProfile) {
    return (
      <div className="flex justify-center items-center min-h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-instagram-blue"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'posts', label: 'Posts', icon: Grid },
    { id: 'reels', label: 'Reels', icon: Play },
    { id: 'saved', label: 'Saved', icon: Bookmark, hidden: !isOwnProfile },
    { id: 'tagged', label: 'Tagged', icon: Tag }
  ].filter(tab => !tab.hidden);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 bg-white bg-opacity-80 backdrop-blur-sm min-h-full">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-8">
        {/* Profile Picture */}
        <div className="flex-shrink-0">
          <img
            src={currentProfile.profilePictureUrl || 'https://via.placeholder.com/150'}
            alt={currentProfile.username}
            className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover"
          />
        </div>

        {/* Profile Info */}
        <div className="flex-1 text-center md:text-left">
          {/* Username and Actions */}
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
            <h1 className="text-2xl font-light">{currentProfile.username}</h1>
            <div className="flex gap-2">
              {isOwnProfile ? (
                <>
                  <button className="px-4 py-1.5 border border-instagram-border rounded-md text-sm font-semibold hover:bg-gray-50">
                    Edit profile
                  </button>
                  <button className="px-4 py-1.5 border border-instagram-border rounded-md text-sm font-semibold hover:bg-gray-50">
                    View archive
                  </button>
                </>
              ) : (
                <>
                  <button className="px-6 py-1.5 bg-instagram-blue text-white rounded-md text-sm font-semibold hover:bg-blue-600">
                    Follow
                  </button>
                  <button className="px-4 py-1.5 border border-instagram-border rounded-md text-sm font-semibold hover:bg-gray-50">
                    Message
                  </button>
                </>
              )}
              <button className="p-1.5 hover:bg-gray-50 rounded">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex justify-center md:justify-start gap-8 mb-4">
            <div className="text-center">
              <span className="font-semibold">{currentProfile.postsCount || 0}</span>
              <div className="text-sm text-gray-600">posts</div>
            </div>
            <div className="text-center">
              <span className="font-semibold">{currentProfile.followersCount || 0}</span>
              <div className="text-sm text-gray-600">followers</div>
            </div>
            <div className="text-center">
              <span className="font-semibold">{currentProfile.followingCount || 0}</span>
              <div className="text-sm text-gray-600">following</div>
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-1">
            <div className="font-semibold">{currentProfile.fullName}</div>
            {currentProfile.bio && (
              <div className="whitespace-pre-line">{currentProfile.bio}</div>
            )}
          </div>
        </div>
      </div>

      {/* Highlights (Static/Mocked) */}
      <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
        {[1, 2, 3].map((highlight) => (
          <div key={highlight} className="flex-shrink-0 text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full mb-1 flex items-center justify-center">
              <span className="text-gray-400 text-xs">Story</span>
            </div>
            <span className="text-xs text-gray-600">Highlight {highlight}</span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="border-t border-instagram-border">
        <div className="flex justify-center">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1 px-4 py-3 text-sm font-semibold uppercase tracking-wider ${
                  isActive 
                    ? 'border-t border-black text-black' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="h-3 w-3" />
                <span className="hidden md:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Posts Grid */}
      <div className="mt-4">
        {activeTab === 'posts' && (
          <div className="grid grid-cols-3 gap-1 md:gap-4">
            {currentProfilePosts.length === 0 ? (
              <div className="col-span-3 text-center py-12">
                <div className="text-gray-500">No posts yet</div>
              </div>
            ) : (
              currentProfilePosts.map((post, index) => (
                <div 
                  key={post._id} 
                  className="relative aspect-square group cursor-pointer"
                >
                  <img
                    src={post.mediaUrl || post.imageUrl}
                    alt={`Post ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Hover overlay (desktop only) */}
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
                      <Play className="h-4 w-4 text-white fill-current" />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'reels' && (
          <div className="text-center py-12">
            <div className="text-gray-500">No reels yet</div>
          </div>
        )}

        {activeTab === 'saved' && (
          <div className="text-center py-12">
            <div className="text-gray-500">No saved posts</div>
          </div>
        )}

        {activeTab === 'tagged' && (
          <div className="text-center py-12">
            <div className="text-gray-500">No tagged posts</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;