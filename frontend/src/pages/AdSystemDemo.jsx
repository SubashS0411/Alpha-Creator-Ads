import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import YouTubeVideoPlayer from '../components/YouTubeVideoPlayer';

const AdSystemDemo = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videos, setVideos] = useState([]);
  const [advertisements, setAdvertisements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideos();
    fetchAdvertisements();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await fetch('/api/youtube/videos');
      const data = await response.json();
      setVideos(data.videos || []);
      
      // Auto-select first video for demo
      if (data.videos && data.videos.length > 0) {
        setSelectedVideo(data.videos[0]);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  const fetchAdvertisements = async () => {
    try {
      const response = await fetch('/api/ads?platform=youtube&active=true');
      const data = await response.json();
      setAdvertisements(data.ads || []);
    } catch (error) {
      console.error('Error fetching advertisements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoSelect = (video) => {
    setSelectedVideo(video);
  };

  const handleVideoEnd = () => {
    console.log('Video ended');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4">Loading YouTube Ad System Demo...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            YouTube Advertisement System Demo
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Experience our intelligent advertisement system that displays targeted ads before YouTube videos, 
            complete with skip functionality and "Shop Now" calls-to-action.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Video Player - Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Video Player with Ad System</CardTitle>
                <p className="text-sm text-gray-600">
                  Advertisements will play automatically before the main video
                </p>
              </CardHeader>
              <CardContent className="p-0">
                {selectedVideo ? (
                  <YouTubeVideoPlayer
                    video={selectedVideo}
                    onVideoEnd={handleVideoEnd}
                    autoplay={false}
                  />
                ) : (
                  <div className="aspect-video bg-gray-200 flex items-center justify-center">
                    <p className="text-gray-500">Select a video to start watching</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Current Video Info */}
            {selectedVideo && (
              <Card className="mt-4">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{selectedVideo.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                    <span>{selectedVideo.views?.toLocaleString()} views</span>
                    <span>{selectedVideo.likes?.toLocaleString()} likes</span>
                    <span>Category: {selectedVideo.category}</span>
                  </div>
                  <p className="text-gray-700 text-sm">{selectedVideo.description}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Video List */}
            <Card>
              <CardHeader>
                <CardTitle>Available Videos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {videos.slice(0, 6).map((video) => (
                  <div
                    key={video._id}
                    className={`p-3 rounded cursor-pointer transition-colors ${
                      selectedVideo?._id === video._id
                        ? 'bg-red-100 border border-red-300'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    onClick={() => handleVideoSelect(video)}
                  >
                    <div className="flex space-x-3">
                      <img
                        src={video.thumbnailUrl}
                        alt={video.title}
                        className="w-16 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {video.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {video.views?.toLocaleString()} views
                        </p>
                        <p className="text-xs text-gray-500">{video.category}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Advertisement Info */}
            <Card>
              <CardHeader>
                <CardTitle>Active Advertisements</CardTitle>
              </CardHeader>
              <CardContent>
                {advertisements.length > 0 ? (
                  <div className="space-y-4">
                    {advertisements.map((ad) => (
                      <div key={ad._id} className="border rounded p-3">
                        <h4 className="font-medium text-sm">{ad.title}</h4>
                        <p className="text-xs text-gray-600 mb-2">
                          {ad.advertiser.name}
                        </p>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>{ad.performance.views.toLocaleString()} views</span>
                          <span>{ad.performance.clickThroughRate.toFixed(1)}% CTR</span>
                        </div>
                        <div className="mt-2 text-xs">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {ad.adSettings.shopNowText}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No active advertisements</p>
                )}
              </CardContent>
            </Card>

            {/* Ad System Features */}
            <Card>
              <CardHeader>
                <CardTitle>System Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Pre-roll advertisement display</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Skip button after 5 seconds</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">"Shop Now" call-to-action</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">View & click tracking</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Audience targeting</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Performance analytics</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>How the Ad System Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-red-600 font-bold">1</span>
                </div>
                <h3 className="font-semibold mb-2">Ad Selection</h3>
                <p className="text-sm text-gray-600">
                  System automatically selects relevant advertisements based on video category and user targeting.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                <h3 className="font-semibold mb-2">Ad Playback</h3>
                <p className="text-sm text-gray-600">
                  Advertisement plays in fullscreen with skip option after 5 seconds and "Shop Now" button for engagement.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-600 font-bold">3</span>
                </div>
                <h3 className="font-semibold mb-2">Main Video</h3>
                <p className="text-sm text-gray-600">
                  After ad completion or skip, the main video starts automatically with full YouTube-style controls.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdSystemDemo;