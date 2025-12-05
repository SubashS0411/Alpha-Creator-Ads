import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const AdSystemDemo = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [advertisements, setAdvertisements] = useState([]);
  const [showDemo, setShowDemo] = useState(false);
  const [currentAd, setCurrentAd] = useState(null);
  const [adTime, setAdTime] = useState(0);
  const [canSkip, setCanSkip] = useState(false);
  const [showShopNow, setShowShopNow] = useState(false);
  const [adEnded, setAdEnded] = useState(false);
  const [videoStarted, setVideoStarted] = useState(false);

  // Mock data for demonstration
  const mockVideos = [
    {
      _id: '1',
      title: 'How to Build Amazing React Apps',
      description: 'Learn React development with this comprehensive tutorial covering hooks, state management, and best practices.',
      thumbnailUrl: 'https://picsum.photos/320/180?random=1',
      videoUrl: '/sample-video.mp4',
      views: 125000,
      likes: 8500,
      category: 'Programming'
    },
    {
      _id: '2',
      title: 'Web Development Trends 2025',
      description: 'Discover the latest web development trends and technologies that will shape the future of the internet.',
      thumbnailUrl: 'https://picsum.photos/320/180?random=2',
      videoUrl: '/sample-video-2.mp4',
      views: 89000,
      likes: 5200,
      category: 'Technology'
    }
  ];

  const mockAds = [
    {
      id: 'ad1',
      title: 'Premium Laptop - Ultimate Performance',
      advertiser: { name: 'TechPro Solutions' },
      duration: 30,
      videoUrl: '/assests/samplevideos/WhatsApp Video 2025-12-05 at 09.30.14_ce12ef72.mp4',
      shopNowText: 'Shop Now - 20% Off!',
      shopNowUrl: 'https://techpro-solutions.com',
      performance: { views: 10121, clicks: 297, clickThroughRate: 2.93 }
    },
    {
      id: 'ad2',
      title: 'Revolutionary Laptop Experience',
      advertiser: { name: 'Digital Innovation Corp' },
      duration: 30,
      videoUrl: '/assests/samplevideos/WhatsApp Video 2025-12-05 at 09.30.15_c7228351.mp4',
      shopNowText: 'Get Yours Today!',
      shopNowUrl: 'https://digital-innovation.com',
      performance: { views: 19789, clicks: 949, clickThroughRate: 4.80 }
    }
  ];

  useEffect(() => {
    setSelectedVideo(mockVideos[0]);
    setAdvertisements(mockAds);
  }, []);

  // Ad simulation timer
  useEffect(() => {
    let interval;
    if (showDemo && currentAd && !adEnded) {
      interval = setInterval(() => {
        setAdTime(prev => {
          const newTime = prev + 0.1;
          if (newTime >= 5 && !canSkip) {
            setCanSkip(true);
          }
          if (newTime >= 2) {
            setShowShopNow(true);
          }
          if (newTime >= currentAd.duration) {
            setAdEnded(true);
            setTimeout(() => {
              handleAdComplete();
            }, 500);
          }
          return newTime;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [showDemo, currentAd, adEnded, canSkip]);

  const startDemo = () => {
    setCurrentAd(mockAds[0]); // Select first ad
    setShowDemo(true);
    setAdTime(0);
    setCanSkip(false);
    setShowShopNow(false);
    setAdEnded(false);
    setVideoStarted(false);
  };

  const handleSkipAd = () => {
    if (canSkip) {
      setAdEnded(true);
      handleAdComplete();
    }
  };

  const handleShopNow = () => {
    alert(`Redirecting to: ${currentAd.shopNowUrl}`);
    // In real implementation, this would track the click and open the URL
  };

  const handleAdComplete = () => {
    setShowDemo(false);
    setCurrentAd(null);
    setVideoStarted(true);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🎬 YouTube Advertisement System Demo
          </h1>
          <p className="text-gray-600">
            Experience our intelligent ad system with skip functionality and "Shop Now" buttons
          </p>
        </div>

        {/* Ad Player Demo */}
        {showDemo && currentAd && (
          <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
            <div className="relative w-full h-full max-w-4xl max-h-96">
              {/* Mock Video Player */}
              <div className="w-full h-full bg-gray-900 flex items-center justify-center relative">
                <div className="text-white text-center">
                  <div className="text-6xl mb-4">📺</div>
                  <h2 className="text-2xl font-bold mb-2">{currentAd.title}</h2>
                  <p className="text-lg">{currentAd.advertiser.name}</p>
                  <div className="mt-4 text-sm">
                    Playing advertisement... {formatTime(adTime)} / {formatTime(currentAd.duration)}
                  </div>
                </div>

                {/* Ad Controls Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent">
                  
                  {/* Top Bar */}
                  <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
                    <div className="flex items-center space-x-2 text-white">
                      <div className="bg-yellow-500 text-black px-2 py-1 rounded text-xs font-semibold">
                        AD
                      </div>
                      <span className="text-sm">
                        {formatTime(Math.max(0, currentAd.duration - adTime))} remaining
                      </span>
                    </div>
                    
                    {/* Skip Button */}
                    {canSkip && !adEnded && (
                      <Button onClick={handleSkipAd} variant="secondary" size="sm">
                        ✕ Skip Ad
                      </Button>
                    )}
                    
                    {/* Countdown */}
                    {!canSkip && (
                      <div className="text-white text-sm bg-black/60 px-3 py-1 rounded">
                        Skip in {Math.max(0, Math.ceil(5 - adTime))}s
                      </div>
                    )}
                  </div>

                  {/* Bottom Controls */}
                  <div className="absolute bottom-4 left-4 right-4">
                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="w-full h-1 bg-gray-600 rounded">
                        <div 
                          className="h-full bg-red-600 rounded transition-all"
                          style={{ width: `${(adTime / currentAd.duration) * 100}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-white">
                        <h3 className="text-lg font-semibold">{currentAd.title}</h3>
                        <p className="text-sm text-gray-300">{currentAd.advertiser.name}</p>
                      </div>
                      
                      {/* Shop Now Button */}
                      {showShopNow && !adEnded && (
                        <Button
                          onClick={handleShopNow}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow-lg"
                        >
                          🔗 {currentAd.shopNowText}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Demo Area */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>📺 Video Player with Advertisement System</CardTitle>
              </CardHeader>
              <CardContent>
                {!showDemo && !videoStarted && (
                  <div className="aspect-video bg-gray-800 flex items-center justify-center text-white rounded">
                    <div className="text-center">
                      <div className="text-4xl mb-4">▶️</div>
                      <h3 className="text-xl font-semibold mb-2">
                        {selectedVideo?.title}
                      </h3>
                      <p className="text-gray-300 mb-4">Click to start watching</p>
                      <Button onClick={startDemo} size="lg">
                        🎬 Play Video (Ad will show first)
                      </Button>
                    </div>
                  </div>
                )}
                
                {videoStarted && (
                  <div className="aspect-video bg-gray-800 flex items-center justify-center text-white rounded">
                    <div className="text-center">
                      <div className="text-4xl mb-4">🎉</div>
                      <h3 className="text-xl font-semibold mb-2">Main Video Playing</h3>
                      <p className="text-gray-300 mb-4">
                        Advertisement completed! Now showing: {selectedVideo?.title}
                      </p>
                      <Button onClick={() => {
                        setVideoStarted(false);
                        setCurrentAd(null);
                      }}>
                        🔄 Try Another Ad
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Video Info */}
            {selectedVideo && (
              <Card className="mt-4">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{selectedVideo.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                    <span>👁 {selectedVideo.views.toLocaleString()} views</span>
                    <span>👍 {selectedVideo.likes.toLocaleString()} likes</span>
                    <span>📂 {selectedVideo.category}</span>
                  </div>
                  <p className="text-gray-700 text-sm">{selectedVideo.description}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            
            {/* Available Videos */}
            <Card>
              <CardHeader>
                <CardTitle>📹 Available Videos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {mockVideos.map((video) => (
                  <div
                    key={video._id}
                    className={`p-3 rounded cursor-pointer transition-colors ${
                      selectedVideo?._id === video._id
                        ? 'bg-blue-100 border border-blue-300'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    onClick={() => setSelectedVideo(video)}
                  >
                    <div className="flex space-x-3">
                      <div className="w-16 h-12 bg-gray-200 rounded flex items-center justify-center text-xs">
                        🎬
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {video.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {video.views.toLocaleString()} views
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Advertisement Info */}
            <Card>
              <CardHeader>
                <CardTitle>📺 Active Advertisements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockAds.map((ad) => (
                    <div key={ad.id} className="border rounded p-3">
                      <h4 className="font-medium text-sm">{ad.title}</h4>
                      <p className="text-xs text-gray-600 mb-2">
                        {ad.advertiser.name}
                      </p>
                      <div className="flex justify-between text-xs text-gray-500 mb-2">
                        <span>👁 {ad.performance.views.toLocaleString()}</span>
                        <span>📈 {ad.performance.clickThroughRate.toFixed(1)}% CTR</span>
                      </div>
                      <div className="text-xs">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {ad.shopNowText}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle>✨ System Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>Pre-roll advertisement display</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>Skip button after 5 seconds</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>"Shop Now" call-to-action</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>Performance tracking</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>Real YouTube-style experience</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>🎯 How the Advertisement System Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-red-600 font-bold">1</span>
                </div>
                <h3 className="font-semibold mb-2">🎯 Ad Selection</h3>
                <p className="text-sm text-gray-600">
                  System selects relevant laptop advertisements based on video category and targeting rules.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                <h3 className="font-semibold mb-2">📺 Ad Playback</h3>
                <p className="text-sm text-gray-600">
                  Your WhatsApp videos play as professional ads with skip option and "Shop Now" button.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-600 font-bold">3</span>
                </div>
                <h3 className="font-semibold mb-2">🎬 Main Video</h3>
                <p className="text-sm text-gray-600">
                  After ad completion or skip, the main video starts with full tracking and analytics.
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