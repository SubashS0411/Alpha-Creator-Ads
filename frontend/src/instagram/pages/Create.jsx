import React, { useState, useRef } from 'react';
import { ArrowLeft, X, Image, Grid, Check, MapPin, Camera, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createPost } from '../../store/postsSlice';
import { trackInteraction } from '../../services/analyticsApi';

const Create = ({ onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector(state => state.auth);
  const fileInputRef = useRef(null);
  
  const [step, setStep] = useState(1); // 1: Gallery, 2: Edit, 3: Share
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('normal');
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Mock gallery images
  const mockGalleryImages = [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
  ];

  const filters = [
    { name: 'Normal', value: 'normal', filter: 'none' },
    { name: 'Clarendon', value: 'clarendon', filter: 'contrast(1.2) saturate(1.35)' },
    { name: 'Gingham', value: 'gingham', filter: 'brightness(1.05) hue-rotate(-10deg)' },
    { name: 'Moon', value: 'moon', filter: 'grayscale(1) contrast(1.1) brightness(1.1)' },
    { name: 'Lark', value: 'lark', filter: 'contrast(0.9)' },
    { name: 'Reyes', value: 'reyes', filter: 'sepia(0.22) brightness(1.1) contrast(0.85) saturate(0.75)' },
    { name: 'Juno', value: 'juno', filter: 'sepia(0.35) contrast(1.15) brightness(1.15) saturate(1.8)' },
    { name: 'Slumber', value: 'slumber', filter: 'saturate(0.66) brightness(1.05)' },
    { name: 'Crema', value: 'crema', filter: 'sepia(0.5) contrast(1.25) brightness(1.15) saturate(0.9) hue-rotate(-2deg)' },
    { name: 'Ludwig', value: 'ludwig', filter: 'sepia(0.25) contrast(1.05) brightness(1.05) saturate(2)' },
    { name: 'Aden', value: 'aden', filter: 'hue-rotate(-20deg) contrast(0.9) saturate(0.85) brightness(1.2)' },
    { name: 'Perpetua', value: 'perpetua', filter: 'contrast(1.05) brightness(1.05) saturate(1.1)' },
  ];

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setStep(2);
    }
  };

  const handleMockImageSelect = (imageUrl) => {
    setPreviewUrl(imageUrl);
    setSelectedFile({ type: 'mock', url: imageUrl });
    setStep(2);
  };

  const handleNext = () => {
    if (step === 1 && previewUrl) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      onClose();
    }
  };

  const handleShare = async () => {
    if (!previewUrl || !currentUser) return;

    setIsLoading(true);
    
    try {
      // Track interaction
      await trackInteraction('create_post', 'post', 'create');

      // Create post data with unique ID
      const postData = {
        _id: Date.now().toString(), // Temporary ID for mock posts
        author: {
          _id: currentUser._id,
          username: currentUser.username,
          profilePictureUrl: currentUser.profilePictureUrl,
          isVerified: currentUser.isVerified || false
        },
        type: selectedFile?.type === 'mock' ? 'image' : (selectedFile?.type?.startsWith('video') ? 'video' : 'image'),
        mediaUrl: selectedFile?.type === 'mock' ? selectedFile.url : previewUrl,
        aspectRatio: '1:1',
        caption: caption.trim(),
        location: location.trim(),
        filter: selectedFilter,
        likes: [],
        likesCount: 0,
        comments: [],
        createdAt: new Date().toISOString()
      };

      // Save to localStorage as mock database
      const existingPosts = JSON.parse(localStorage.getItem('instagram_posts') || '[]');
      const updatedPosts = [postData, ...existingPosts];
      localStorage.setItem('instagram_posts', JSON.stringify(updatedPosts));

      // Also dispatch to Redux store for immediate UI update
      try {
        await dispatch(createPost(postData)).unwrap();
      } catch (apiError) {
        // If API fails, still add to store manually
        dispatch({ type: 'posts/addPost', payload: postData });
      }

      // Navigate back to home
      onClose();
      navigate('/instagram');
      
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Error creating post. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepHeader = () => {
    const titles = ['New post', 'Edit', 'New post'];
    const canNext = step === 1 && previewUrl;
    const canShare = step === 3 && previewUrl;

    return (
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <button
          onClick={handleBack}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          {step === 1 ? <X className="w-6 h-6" /> : <ArrowLeft className="w-6 h-6" />}
        </button>
        
        <h1 className="text-lg font-semibold">{titles[step - 1]}</h1>
        
        <button
          onClick={step === 3 ? handleShare : handleNext}
          disabled={(!canNext && step === 1) || (!canShare && step === 3) || isLoading}
          className={`px-4 py-1 text-sm font-semibold rounded ${
            ((canNext && step === 1) || (step === 2) || (canShare && step === 3)) && !isLoading
              ? 'text-blue-500 hover:text-blue-600'
              : 'text-gray-400 cursor-not-allowed'
          }`}
        >
          {step === 3 ? (isLoading ? 'Sharing...' : 'Share') : 'Next'}
        </button>
      </div>
    );
  };

  // Step 1: Gallery Selection
  const renderGallery = () => (
    <div className="flex flex-col h-full">
      {/* Preview Area */}
      <div className="flex-1 bg-black flex items-center justify-center" style={{ minHeight: '50vh' }}>
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Selected"
            className="max-w-full max-h-full object-contain"
            style={{ filter: filters.find(f => f.value === selectedFilter)?.filter || 'none' }}
          />
        ) : (
          <div className="text-center text-gray-400">
            <Image className="w-16 h-16 mx-auto mb-4" />
            <p>Select a photo to get started</p>
          </div>
        )}
      </div>

      {/* Gallery Grid */}
      <div className="bg-white border-t border-gray-200" style={{ maxHeight: '50vh', overflowY: 'auto' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <h2 className="font-semibold">Recent</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center space-x-2 px-3 py-1.5 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 transition-colors"
            >
              <Camera className="w-4 h-4" />
              <span>Camera</span>
            </button>
            <Grid className="w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Gallery Grid */}
        <div className="grid grid-cols-3 gap-1 p-1">
          {mockGalleryImages.map((image, index) => (
            <button
              key={index}
              onClick={() => handleMockImageSelect(image)}
              className={`aspect-square relative ${
                previewUrl === image ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <img
                src={image}
                alt={`Gallery ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {previewUrl === image && (
                <div className="absolute top-1 right-1 bg-blue-500 rounded-full p-1">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // Step 2: Editing/Filters
  const renderEdit = () => (
    <div className="flex flex-col h-full">
      {/* Preview Area */}
      <div className="flex-1 bg-black flex items-center justify-center">
        <img
          src={previewUrl}
          alt="Edit preview"
          className="max-w-full max-h-full object-contain"
          style={{ filter: filters.find(f => f.value === selectedFilter)?.filter || 'none' }}
        />
      </div>

      {/* Filters */}
      <div className="bg-white border-t border-gray-200 p-4">
        <h3 className="text-sm font-semibold mb-3">Filter</h3>
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setSelectedFilter(filter.value)}
              className={`flex-shrink-0 text-center ${
                selectedFilter === filter.value ? 'text-blue-500' : 'text-gray-600'
              }`}
            >
              <div className={`w-16 h-16 mb-1 rounded border-2 ${
                selectedFilter === filter.value ? 'border-blue-500' : 'border-gray-200'
              }`}>
                <img
                  src={previewUrl}
                  alt={filter.name}
                  className="w-full h-full object-cover rounded"
                  style={{ filter: filter.filter }}
                />
              </div>
              <span className="text-xs font-medium">{filter.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // Step 3: Share Details
  const renderShare = () => (
    <div className="flex flex-col h-full">
      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* User Info & Preview */}
        <div className="flex items-start p-4 border-b border-gray-200">
          <img
            src={currentUser?.profilePictureUrl || 'https://via.placeholder.com/40'}
            alt={currentUser?.username || 'User'}
            className="w-10 h-10 rounded-full mr-3"
          />
          <div className="flex-1">
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a caption..."
              className="w-full resize-none border-none outline-none text-sm"
              rows={3}
              maxLength={2200}
            />
            <div className="text-xs text-gray-400 mt-1">
              {caption.length}/2,200
            </div>
          </div>
          <img
            src={previewUrl}
            alt="Post preview"
            className="w-16 h-16 object-cover rounded ml-3"
            style={{ filter: filters.find(f => f.value === selectedFilter)?.filter || 'none' }}
          />
        </div>

        {/* Location */}
        <div className="flex items-center p-4 border-b border-gray-200">
          <MapPin className="w-5 h-5 text-gray-400 mr-3" />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Add location"
            className="flex-1 border-none outline-none text-sm"
          />
        </div>

        {/* Additional Options */}
        <div className="space-y-4 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Also post to Facebook</span>
            <button className="w-12 h-6 bg-gray-200 rounded-full relative">
              <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform"></div>
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Also post to Twitter</span>
            <button className="w-12 h-6 bg-gray-200 rounded-full relative">
              <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform"></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="absolute inset-0 bg-white bg-opacity-95 backdrop-blur-sm z-50 flex flex-col">
      {renderStepHeader()}
      
      <div className="flex-1 overflow-hidden">
        {step === 1 && renderGallery()}
        {step === 2 && renderEdit()}
        {step === 3 && renderShare()}
      </div>
    </div>
  );
};

export default Create;