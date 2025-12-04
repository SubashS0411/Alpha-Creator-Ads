import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PostCard from '../components/PostCard';
import StoriesTray from '../components/StoriesTray';
import VideoViewer from '../components/VideoViewer';
import ImageViewer from '../components/ImageViewer';
import { fetchFeed } from '../../store/postsSlice';

const Home = () => {
  const dispatch = useDispatch();
  const { feed, loading, error } = useSelector(state => state.posts);
  const [showVideoViewer, setShowVideoViewer] = useState(false);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  useEffect(() => {
    dispatch(fetchFeed());
  }, [dispatch]);

  const postsToShow = feed || [];
  
  // Filter video posts for the video viewer
  const videoPosts = postsToShow.filter(post => 
    post.type === 'video' || 
    post.mediaUrl?.includes('mp4') || 
    post.imageUrl?.includes('mp4')
  );

  // Filter image posts for the image viewer
  const imagePosts = postsToShow.filter(post => 
    post.type === 'image' || 
    (!post.mediaUrl?.includes('mp4') && !post.imageUrl?.includes('mp4'))
  );

  const handleVideoClick = (selectedPost, allVideos) => {
    const videoIndex = videoPosts.findIndex(video => video._id === selectedPost._id);
    setSelectedVideoIndex(videoIndex >= 0 ? videoIndex : 0);
    setShowVideoViewer(true);
  };

  const handleImageClick = (selectedPost, allImages) => {
    const imageIndex = imagePosts.findIndex(image => image._id === selectedPost._id);
    setSelectedImageIndex(imageIndex >= 0 ? imageIndex : 0);
    setShowImageViewer(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="text-white">
      {/* Stories Tray - appears right after header */}
      <div className="pt-11">
        <StoriesTray />
      </div>

      {/* Posts Feed */}
      <div>
        {postsToShow.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">No posts yet. Create your first post!</p>
          </div>
        ) : (
          postsToShow.map(post => (
            <PostCard 
              key={post._id} 
              post={post} 
              allVideos={videoPosts}
              allImages={imagePosts}
              onVideoClick={handleVideoClick}
              onImageClick={handleImageClick}
            />
          ))
        )}
      </div>

      {/* Full-screen Video Viewer */}
      {showVideoViewer && videoPosts.length > 0 && (
        <VideoViewer
          videos={videoPosts}
          initialIndex={selectedVideoIndex}
          onClose={() => setShowVideoViewer(false)}
        />
      )}

      {/* Full-screen Image Viewer */}
      {showImageViewer && imagePosts.length > 0 && (
        <ImageViewer
          images={imagePosts}
          initialIndex={selectedImageIndex}
          onClose={() => setShowImageViewer(false)}
        />
      )}
    </div>
  );
};

export default Home;