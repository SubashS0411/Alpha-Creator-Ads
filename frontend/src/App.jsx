import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MobileLanding from './components/MobileLanding';
import Layout from './components/Layout';
import Home from './instagram/pages/Home';
import Search from './instagram/components/Search';
import Profile from './instagram/pages/Profile';
import Explore from './instagram/pages/Explore';
import Reels from './instagram/pages/Reels';
import YouTubeApp from './youtube/components/YouTubeApp';
import AdDemo from './components/AdDemo';
import './index.css';

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Mobile Landing Page */}
        <Route path="/" element={<MobileLanding />} />
        
        {/* Instagram App */}
        <Route path="/instagram/*" element={
          <Layout>
            <Routes>
              <Route index element={<Home />} />
              <Route path="home" element={<Home />} />
              <Route path="search" element={<Search />} />
              <Route path="explore" element={<Explore />} />
              <Route path="reels" element={<Reels />} />
              <Route path="profile/:userId" element={<Profile />} />
              <Route path="profile" element={<Profile />} />
            </Routes>
          </Layout>
        } />
        
        {/* YouTube App */}
        <Route path="/youtube/*" element={<YouTubeApp />} />
        
        {/* Ad System Demo */}
        <Route path="/ad-demo" element={<AdDemo />} />
      </Routes>
    </div>
  );
}

export default App;