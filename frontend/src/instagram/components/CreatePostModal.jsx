import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { X, Upload, Video, Image } from 'lucide-react';
import { createPost } from '../../store/postsSlice';

const CreatePostModal = ({ onClose, currentUser }) => {
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    mediaUrl: '',
    type: 'image',
    aspectRatio: '1:1',
    caption: '',
    location: '',
    duration: '',
    audioTitle: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [postType, setPostType] = useState('post'); // 'post' or 'reel'

  useEffect(() => {
    if (formData.mediaUrl) {
      // Auto-detect media type
      const isVideo = formData.mediaUrl.includes('mp4') || 
                     formData.mediaUrl.includes('webm') || 
                     formData.mediaUrl.includes('mov');
      setFormData(prev => ({
        ...prev,
        type: isVideo ? 'video' : 'image'
      }));
      setMediaPreview(formData.mediaUrl);
    }
  }, [formData.mediaUrl]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    
    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setMediaPreview(previewUrl);
    
    // Auto-detect type
    const isVideo = file.type.startsWith('video/');
    setFormData(prev => ({
      ...prev,
      type: isVideo ? 'video' : 'image',
      aspectRatio: isVideo ? '9:16' : '1:1'
    }));
    
    // Auto-set post type for videos
    if (isVideo) {
      setPostType('reel');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedFile && !formData.mediaUrl.trim()) {
      alert('Please select a file or enter a media URL');
      return;
    }

    setIsSubmitting(true);
    try {
      if (selectedFile) {
        // Upload file
        const uploadData = new FormData();
        uploadData.append('media', selectedFile);
        uploadData.append('caption', formData.caption);
        uploadData.append('location', formData.location);
        uploadData.append('type', postType);
        uploadData.append('userId', '6743c123456789012345678a'); // Hardcoded user ID
        
        if (formData.type === 'video' || postType === 'reel') {
          uploadData.append('duration', formData.duration || '15');
          uploadData.append('audioTitle', formData.audioTitle || 'Original Audio');
        }
        
        const response = await fetch('http://localhost:5000/api/media/upload', {
          method: 'POST',
          body: uploadData
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Upload failed');
        }
        
        const result = await response.json();
        console.log('Upload successful:', result);
        
        // Dispatch to store if it's a regular post (not a reel)
        if (result.type === 'post') {
          dispatch({
            type: 'posts/addPost',
            payload: result.data
          });
        }
        
        // Show success message
        alert(`${result.type === 'reel' ? 'Reel' : 'Post'} uploaded successfully!`);
        
      } else {
        // Use URL
        await dispatch(createPost({
          ...formData,
          author: '6743c123456789012345678a' // Hardcoded for no-auth
        })).unwrap();
      }
      
      onClose();
    } catch (error) {
      alert('Failed to create post: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const aspectRatioOptions = [
    { value: '1:1', label: 'Square (1:1)' },
    { value: '4:5', label: 'Portrait (4:5)' },
    { value: '1.91:1', label: 'Landscape (1.91:1)' }
  ];

  const getPreviewAspectRatio = () => {
    switch (formData.aspectRatio) {
      case '4:5': return 'aspect-[4/5]';
      case '1.91:1': return 'aspect-[1.91/1]';
      default: return 'aspect-square';
    }
  };

  return (
    <div className="absolute inset-0 bg-black bg-opacity-90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div 
        className="bg-white rounded-lg w-full max-w-[340px] max-h-[90%] overflow-y-auto"
        style={{
          backgroundImage: 'url(/assests/wallpaper.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="bg-black bg-opacity-80 backdrop-blur-sm rounded-lg h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-4">
            {step > 1 && (
              <button 
                onClick={() => setStep(step - 1)}
                className="text-blue-400 font-semibold"
              >
                Back
              </button>
            )}
            <h2 className="text-lg font-semibold text-white">
              {step === 1 ? 'Create new post' : step === 2 ? 'Edit' : 'Share'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            {step < 3 && mediaPreview && (
              <button 
                onClick={() => setStep(step + 1)}
                className="text-blue-400 font-semibold"
              >
                Next
              </button>
            )}
            <button onClick={onClose} className="p-1 hover:bg-gray-700 rounded">
              <X className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>

        {/* Step 1: Select Media */}
        {step === 1 && (
          <div className="p-6">
            <div className="text-center">
              <h3 className="text-xl mb-4 text-white">Create new post</h3>
              
              {/* Post Type Selection */}
              <div className="mb-6">
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setPostType('post')}
                    className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                      postType === 'post' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    <Image className="w-4 h-4" />
                    <span>Post</span>
                  </button>
                  <button
                    onClick={() => setPostType('reel')}
                    className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                      postType === 'reel' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    <Video className="w-4 h-4" />
                    <span>Reel</span>
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Upload File
                  </label>
                  <div className="border-2 border-dashed border-gray-500 rounded-lg p-6 bg-black bg-opacity-40">
                    <input
                      type="file"
                      accept={postType === 'reel' ? 'video/*' : 'image/*,video/*'}
                      onChange={handleFileSelect}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <Upload className="w-12 h-12 text-gray-300 mb-2" />
                      <span className="text-sm text-gray-300">
                        Click to upload {postType === 'reel' ? 'video' : 'image/video'}
                      </span>
                    </label>
                  </div>
                </div>

                <div className="text-gray-300">or</div>

                {/* URL Input */}
                <div>
                  <label htmlFor="mediaUrl" className="block text-sm font-medium text-white mb-2">
                    Media URL
                  </label>
                  <input
                    type="url"
                    id="mediaUrl"
                    name="mediaUrl"
                    value={formData.mediaUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg or video.mp4"
                    className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-black bg-opacity-40 text-white placeholder-gray-400"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Supports images (jpg, png) and videos (mp4, webm)
                  </p>
                </div>
              </div>

                {mediaPreview && (
                  <div className="mt-4">
                    {formData.type === 'video' ? (
                      <video 
                        src={mediaPreview} 
                        className="w-full max-w-sm mx-auto h-64 object-cover rounded-md"
                        controls
                        muted
                        onError={() => setMediaPreview(null)}
                      />
                    ) : (
                      <img 
                        src={mediaPreview} 
                        alt="Preview" 
                        className="w-full max-w-sm mx-auto h-64 object-cover rounded-md"
                        onError={() => setMediaPreview(null)}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
        )}

        {/* Step 2: Edit & Crop */}
        {step === 2 && mediaPreview && (
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aspect Ratio
                </label>
                <select
                  name="aspectRatio"
                  value={formData.aspectRatio}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-instagram-border rounded-md focus:outline-none focus:ring-2 focus:ring-instagram-blue focus:border-transparent"
                >
                  {aspectRatioOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-center">
                {formData.type === 'video' ? (
                  <video 
                    src={mediaPreview} 
                    className={`w-full max-w-md ${getPreviewAspectRatio()} object-cover rounded-md`}
                    controls
                    muted
                  />
                ) : (
                  <img 
                    src={mediaPreview} 
                    alt="Preview" 
                    className={`w-full max-w-md ${getPreviewAspectRatio()} object-cover rounded-md`}
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Share */}
        {step === 3 && (
          <form onSubmit={handleSubmit} className="p-6">
            <div className="flex gap-4 mb-4">
              <div className="flex-shrink-0">
                {formData.type === 'video' ? (
                  <video 
                    src={mediaPreview} 
                    className="w-20 h-20 object-cover rounded-md"
                    muted
                  />
                ) : (
                  <img 
                    src={mediaPreview} 
                    alt="Preview" 
                    className="w-20 h-20 object-cover rounded-md"
                  />
                )}
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <label htmlFor="caption" className="block text-sm font-medium text-white mb-2">
                    Caption
                  </label>
                  <textarea
                    id="caption"
                    name="caption"
                    value={formData.caption}
                    onChange={handleChange}
                    placeholder="Write a caption..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-black bg-opacity-40 text-white placeholder-gray-400"
                    maxLength={2200}
                  />
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-white mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Add location..."
                    className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-black bg-opacity-40 text-white placeholder-gray-400"
                    maxLength={100}
                  />
                </div>

                {/* Video-specific fields */}
                {(formData.type === 'video' || postType === 'reel') && (
                  <>
                    <div>
                      <label htmlFor="duration" className="block text-sm font-medium text-white mb-2">
                        Duration (seconds)
                      </label>
                      <input
                        type="number"
                        id="duration"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        placeholder="15"
                        min="1"
                        max="60"
                        className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-black bg-opacity-40 text-white placeholder-gray-400"
                      />
                    </div>

                    <div>
                      <label htmlFor="audioTitle" className="block text-sm font-medium text-white mb-2">
                        Audio Title
                      </label>
                      <input
                        type="text"
                        id="audioTitle"
                        name="audioTitle"
                        value={formData.audioTitle}
                        onChange={handleChange}
                        placeholder="Original Audio"
                        className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-black bg-opacity-40 text-white placeholder-gray-400"
                        maxLength={100}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || (!selectedFile && !formData.mediaUrl.trim())}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sharing...' : 'Share'}
              </button>
            </div>
          </form>
        )}
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;