import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdVideoCall, MdCameraAlt, MdMic, MdUpload, MdClose } from 'react-icons/md';
import { SiYoutubeshorts } from 'react-icons/si';

const Create = () => {
  const navigate = useNavigate();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isShort, setIsShort] = useState(false);
  const fileInputRef = useRef();

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setShowUploadModal(true);
      
      // Auto-detect if it's a short based on aspect ratio (mock)
      if (file.name.includes('short') || file.name.includes('vertical')) {
        setIsShort(true);
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !title.trim()) return;

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('video', selectedFile);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('isShort', isShort);
      formData.append('channelId', '674587d123456789abcdef01'); // Demo channel
      formData.append('category', 'All'); // Use valid category from enum
      formData.append('tags', JSON.stringify(['upload', 'user-content']));
      formData.append('visibility', 'public');

      const response = await fetch('http://localhost:5000/api/youtube/videos/upload', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Upload successful:', result);
        alert(`Successfully uploaded ${isShort ? 'Short' : 'Video'}: ${title}`);
        setShowUploadModal(false);
        setSelectedFile(null);
        setTitle('');
        setDescription('');
        setIsShort(false);
        navigate(isShort ? '/youtube/shorts' : '/youtube/home');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    }
  };

  const createOptions = [
    {
      id: 'video',
      title: 'Upload video',
      subtitle: 'Share your video with the world',
      icon: MdVideoCall,
      color: 'bg-red-500',
      action: () => fileInputRef.current?.click()
    },
    {
      id: 'short',
      title: 'Create a Short',
      subtitle: 'Make a quick vertical video',
      icon: SiYoutubeshorts,
      color: 'bg-red-500',
      action: () => {
        setIsShort(true);
        fileInputRef.current?.click();
      }
    },
    {
      id: 'live',
      title: 'Go live',
      subtitle: 'Stream to your audience in real-time',
      icon: MdMic,
      color: 'bg-red-500',
      action: () => alert('Live streaming functionality - Demo only')
    },
    {
      id: 'camera',
      title: 'Use camera',
      subtitle: 'Record directly from your camera',
      icon: MdCameraAlt,
      color: 'bg-gray-600',
      action: () => alert('Camera recording functionality - Demo only')
    }
  ];

  return (
    <div className="h-full bg-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center">
          <button 
            onClick={() => navigate('/youtube/home')}
            className="mr-4 p-2 -ml-2"
          >
            <MdArrowBack className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-medium">Create</h1>
        </div>
      </div>

      {/* Create Options */}
      <div className="p-6">
        <h2 className="text-xl font-medium mb-2">Create something new</h2>
        <p className="text-gray-600 mb-8">
          Choose what type of content you want to create
        </p>

        <div className="space-y-4">
          {createOptions.map((option) => (
            <button
              key={option.id}
              onClick={option.action}
              className="w-full flex items-center p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all"
            >
              <div className={`w-12 h-12 ${option.color} rounded-full flex items-center justify-center mr-4`}>
                <option.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-medium text-gray-900">{option.title}</h3>
                <p className="text-sm text-gray-600">{option.subtitle}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Quick Tips */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">Tips for creating</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Keep your videos engaging from the first few seconds</li>
            <li>• Use good lighting and clear audio</li>
            <li>• Create eye-catching thumbnails</li>
            <li>• Add relevant tags and descriptions</li>
          </ul>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="absolute inset-0 bg-black bg-opacity-50 z-50 flex items-end">
          <div className="w-full bg-white rounded-t-lg max-h-[70%] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h3 className="text-lg font-medium">
                Upload {isShort ? 'Short' : 'Video'}
              </h3>
              <button 
                onClick={() => {
                  setShowUploadModal(false);
                  setSelectedFile(null);
                }}
                className="text-gray-600"
              >
                <MdClose className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              {/* File Info */}
              <div className="flex items-center space-x-3">
                <MdUpload className="w-8 h-8 text-gray-400" />
                <div>
                  <p className="font-medium">{selectedFile?.name}</p>
                  <p className="text-sm text-gray-600">
                    {(selectedFile?.size / 1024 / 1024).toFixed(1)} MB
                  </p>
                </div>
              </div>

              {/* Title Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={`Enter ${isShort ? 'Short' : 'video'} title`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Description Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell viewers about your content"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Upload Type Toggle */}
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="uploadType"
                    checked={!isShort}
                    onChange={() => setIsShort(false)}
                    className="mr-2"
                  />
                  <span className="text-sm">Regular Video</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="uploadType"
                    checked={isShort}
                    onChange={() => setIsShort(true)}
                    className="mr-2"
                  />
                  <span className="text-sm">YouTube Short</span>
                </label>
              </div>

              {/* Upload Button */}
              <button
                onClick={handleUpload}
                disabled={!title.trim()}
                className={`w-full py-3 rounded-lg font-medium ${
                  title.trim()
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Upload {isShort ? 'Short' : 'Video'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Create;