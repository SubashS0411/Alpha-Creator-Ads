import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, MessageCircle, Send, MoreHorizontal, Volume2, VolumeX, Music, Bookmark } from 'lucide-react';
import { trackInteraction, trackViewDuration } from '../../services/analyticsApi';
import { fetchFeed, toggleLike } from '../../store/postsSlice';
import FollowButton from '../components/FollowButton';

const ReelsCard = ({ post, isActive }) => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector(state => state.auth);
  const videoRef = useRef(null);
  const viewStartTimeRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(
    post.likes?.includes(currentUser?._id) || false
  );
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      video.play().catch(console.error);
      viewStartTimeRef.current = Date.now();
      
      // Track view
      trackInteraction(post._id, 'reel', 'view');
    } else {
      video.pause();
      
      // Track view duration when reel becomes inactive
      if (viewStartTimeRef.current) {
        const duration = Date.now() - viewStartTimeRef.current;
        if (duration > 1000) { // Only track if viewed for more than 1 second
          trackViewDuration(post._id, 'reel', duration);
        }
        viewStartTimeRef.current = null;
      }
    }

    return () => {
      // Track final duration on cleanup
      if (viewStartTimeRef.current) {
        const duration = Date.now() - viewStartTimeRef.current;
        if (duration > 1000) {
          trackViewDuration(post._id, 'reel', duration);
        }
      }
    };
  }, [isActive, post._id]);

  const handleLike = async () => {
    const newLiked = !isLiked;
    setIsLiked(newLiked);
    setLikesCount(prev => newLiked ? prev + 1 : prev - 1);

    try {
      // Track interaction
      await trackInteraction(post._id, 'reel', 'like');
      
      // Update backend if valid ID
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
      await trackInteraction(post._id, 'reel', 'save');
    } catch (error) {
      console.warn('Save tracking failed:', error);
    }
  };

  const handleVideoClick = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPaused(false);
    } else {
      video.pause();
      setIsPaused(true);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  // Show both video posts and reels
  const isVideoContent = post.type === 'video' || post.mediaUrl?.includes('mp4') || post.imageUrl?.includes('mp4');
  if (!isVideoContent) return null;

  return (
    <div className="relative w-full h-full bg-black flex items-center justify-center snap-start snap-always">
      <video
        ref={videoRef}
        src={post.mediaUrl || post.imageUrl}
        className="w-full h-full object-cover cursor-pointer"
        loop
        muted={isMuted}
        playsInline
        onClick={handleVideoClick}
      />
      
      {/* Pause Indicator */}
      {isPaused && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-16 h-16 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
            <div className="w-0 h-0 border-l-8 border-l-white border-t-4 border-t-transparent border-b-4 border-b-transparent ml-1"></div>
          </div>
        </div>
      )}

      {/* Video Controls Overlay */}
      <button
        onClick={toggleMute}
        className="absolute top-4 right-4 w-8 h-8 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white"
      >
        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </button>

      {/* Right Side Actions */}
      <div className="absolute bottom-20 right-4 flex flex-col items-center space-y-4">
        <button onClick={handleLike} className="flex flex-col items-center">
          <Heart className={`h-8 w-8 ${isLiked ? 'text-red-500 fill-current' : 'text-white'} drop-shadow-lg`} />
          <span className="text-white text-xs mt-1 font-medium drop-shadow-lg">
            {formatNumber(likesCount)}
          </span>
        </button>

        <button className="flex flex-col items-center">
          <MessageCircle className="h-8 w-8 text-white drop-shadow-lg" />
          <span className="text-white text-xs mt-1 font-medium drop-shadow-lg">
            {formatNumber(post.commentsCount || 0)}
          </span>
        </button>

        <button className="flex flex-col items-center">
          <Send className="h-8 w-8 text-white drop-shadow-lg" />
        </button>

        <button onClick={handleSave} className="flex flex-col items-center">
          <Bookmark className={`h-8 w-8 text-white drop-shadow-lg ${isSaved ? 'fill-white' : ''}`} />
        </button>

        <button className="flex flex-col items-center">
          <MoreHorizontal className="h-8 w-8 text-white drop-shadow-lg" />
        </button>

        {/* Music Icon (Spinning) */}
        <div className="relative mt-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 p-2 animate-spin">
            <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
              <Music className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Info */}
      <div className="absolute bottom-4 left-4 right-20 text-white">
        {/* User Info */}
        <div className="flex items-center mb-3">
          <img
            src={post.author?.profilePictureUrl || 'https://via.placeholder.com/40'}
            alt={post.author?.username}
            className="w-10 h-10 rounded-full border-2 border-white mr-3"
          />
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-base drop-shadow-lg">
                @{post.author?.username || 'user'}
              </span>
              <FollowButton 
                user={post.author} 
                variant="outline" 
                size="sm"
              />
            </div>
          </div>
        </div>
        
        {/* Caption */}
        {post.caption && (
          <div className="mb-3 text-sm drop-shadow-lg max-w-xs">
            <p className="line-clamp-2">{post.caption}</p>
          </div>
        )}
        
        {/* Audio Info */}
        <div className="flex items-center text-sm opacity-90 drop-shadow-lg">
          <Music className="w-4 h-4 mr-2" />
          <div className="flex-1 overflow-hidden">
            <div className="whitespace-nowrap animate-scroll">
              🎵 {post.audioInfo?.title || post.audioTitle || 'Original audio'} • {post.author?.username}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to shuffle array
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const Reels = () => {
  const dispatch = useDispatch();
  const { feed } = useSelector(state => state.posts);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [infiniteReels, setInfiniteReels] = useState([]);
  const [playedVideos, setPlayedVideos] = useState(new Set());
  const containerRef = useRef(null);
  const loopCountRef = useRef(0);

  useEffect(() => {
    dispatch(fetchFeed());
  }, [dispatch]);

  // Expanded mock reels collection for infinite scrolling
  const mockReels = [
    {
      _id: 'reel1',
      author: {
        _id: 'user1',
        username: 'travel_soul',
        profilePictureUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
      },
      type: 'video',
      mediaUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      caption: 'Quick travel tip: Always pack light and pack smart! ✈️ #traveltips #packing #adventure',
      audioTitle: 'Original Audio',
      likesCount: 234,
      commentsCount: 45,
      createdAt: new Date().toISOString()
    },
    {
      _id: 'reel2', 
      author: {
        _id: 'user2',
        username: 'fitness_coach',
        profilePictureUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop&crop=face'
      },
      type: 'video',
      mediaUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      caption: '30-second full body workout you can do anywhere! 💪 #fitness #workout #quickworkout',
      audioTitle: 'Motivational Beat',
      likesCount: 456,
      commentsCount: 78,
      createdAt: new Date().toISOString()
    },
    {
      _id: 'reel3',
      author: {
        _id: 'user3',
        username: 'nature_explorer',
        profilePictureUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
      },
      type: 'video', 
      mediaUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      caption: 'The forest is calling... 🌲 Who else needs this peaceful energy today?',
      audioTitle: 'Nature Sounds',
      likesCount: 189,
      commentsCount: 34,
      createdAt: new Date().toISOString()
    },
    {
      _id: 'reel4',
      author: {
        _id: 'user4',
        username: 'chef_mario',
        profilePictureUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
      },
      type: 'video',
      mediaUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
      caption: 'Cooking hack that will change your life! 🍳 Who knew making pasta could be this easy?',
      audioTitle: 'Kitchen Vibes',
      likesCount: 567,
      commentsCount: 89,
      createdAt: new Date().toISOString()
    },
    {
      _id: 'reel5',
      author: {
        _id: 'user5',
        username: 'city_nights',
        profilePictureUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face'
      },
      type: 'video',
      mediaUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      caption: 'City life aesthetic 🌃 These nights hit different when you\'re living your dreams',
      audioTitle: 'Urban Nights',
      likesCount: 432,
      commentsCount: 67,
      createdAt: new Date().toISOString()
    },
    {
      _id: 'reel6',
      author: {
        _id: 'user6',
        username: 'adventure_seeker',
        profilePictureUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=150&h=150&fit=crop&crop=face'
      },
      type: 'video',
      mediaUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
      caption: 'Adventure calling! 🏔️ Sometimes you need to get lost to find yourself',
      audioTitle: 'Adventure Awaits',
      likesCount: 321,
      commentsCount: 54,
      createdAt: new Date().toISOString()
    }
  ];

  // Get videos from feed and combine with mock data
  const feedVideos = feed.filter(post => 
    post.type === 'video' || 
    post.mediaUrl?.includes('mp4') || 
    post.imageUrl?.includes('mp4') ||
    post.mediaUrl?.includes('.mov') ||
    post.mediaUrl?.includes('video')
  );

  const baseReels = feedVideos.length > 0 ? [...feedVideos, ...mockReels] : mockReels;

  // Initialize infinite reels with shuffled content
  useEffect(() => {
    if (baseReels.length > 0) {
      const shuffledReels = shuffleArray(baseReels);
      // Create initial batch with 3 cycles for smooth infinite scrolling
      const initialReels = [
        ...shuffledReels,
        ...shuffleArray(baseReels), 
        ...shuffleArray(baseReels)
      ].map((reel, index) => ({
        ...reel,
        _id: `${reel._id}_${index}`, // Ensure unique keys
        originalId: reel._id
      }));
      setInfiniteReels(initialReels);
    }
  }, [baseReels.length]);

  // Add more shuffled content when approaching the end
  useEffect(() => {
    if (infiniteReels.length > 0 && currentIndex >= infiniteReels.length - 3) {
      const newShuffledReels = shuffleArray(baseReels).map((reel, index) => ({
        ...reel,
        _id: `${reel._id}_${loopCountRef.current}_${index}`,
        originalId: reel._id
      }));
      
      setInfiniteReels(prev => [...prev, ...newShuffledReels]);
      loopCountRef.current++;
    }
  }, [currentIndex, infiniteReels.length, baseReels]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const itemHeight = container.clientHeight;
      const newIndex = Math.round(scrollTop / itemHeight);
      setCurrentIndex(newIndex);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  if (infiniteReels.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p>No video content available</p>
          <p className="text-sm mt-2">Video posts will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-black bg-opacity-50">
      {/* Desktop wrapper */}
      <div className="hidden md:flex justify-center items-center h-full">
        <div className="w-80 h-full relative">
          <div
            ref={containerRef}
            className="h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
            style={{
              scrollSnapType: 'y mandatory',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            {infiniteReels.map((post, index) => (
              <div key={post._id} className="h-full">
                <ReelsCard 
                  post={post} 
                  isActive={currentIndex === index}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile full screen */}
      <div className="md:hidden">
        <div
          ref={containerRef}
          className="h-full overflow-y-scroll snap-y snap-mandatory"
          style={{
            scrollSnapType: 'y mandatory'
          }}
        >
          {infiniteReels.map((post, index) => (
            <div key={post._id} className="h-full">
              <ReelsCard 
                post={post} 
                isActive={currentIndex === index}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reels;