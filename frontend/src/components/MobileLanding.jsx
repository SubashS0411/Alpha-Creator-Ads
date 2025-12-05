import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MobileLanding.css';

const MobileLanding = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const timeString = currentTime.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });
  
  const dateString = currentTime.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });

  const apps = [
    {
      name: 'Google',
      icon: '/assests/gllogo.png',
      href: 'https://google.com',
      className: 'google',
      external: true
    },
    {
      name: 'YouTube',
      icon: '/assests/Youtubelogo.png',
      href: '/youtube',
      className: 'youtube',
      external: false
    },
    {
      name: 'Instagram',
      icon: '/assests/instalogo.jpeg',
      href: '/instagram',
      className: 'instagram',
      external: false
    },
    {
      name: 'Facebook',
      icon: '/assests/fblogo.png',
      href: 'https://facebook.com',
      className: 'facebook',
      external: true
    },
    {
      name: 'WhatsApp',
      icon: '/assests/wtlogo.png',
      href: 'https://web.whatsapp.com',
      className: 'whatsapp',
      external: true
    },
    {
      name: 'Gallery',
      icon: '/assests/gallerylogo.png',
      href: '#',
      className: 'gallery',
      external: false,
      onClick: () => alert('Gallery app would open here!\n\nIn a real mobile app, this would open the device\'s photo gallery.')
    },
    {
      name: 'Ad Demo',
      icon: '/assests/Youtubelogo.png',
      href: '#',
      className: 'ad-demo',
      external: false,
      onClick: () => navigate('/ad-demo')
    }
  ];

  const handleAppClick = (app, e) => {
    if (app.onClick) {
      e.preventDefault();
      app.onClick();
    } else if (!app.external) {
      e.preventDefault();
      navigate(app.href);
    }
  };

  return (
    <div className="mobile-landing-container">
      <div className="mobile-screen">
        <div className="status-bar">
          <span className="time">{timeString}</span>
          
          {/* Camera Module */}
          <div style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: '16px',
            height: '16px',
            backgroundColor: '#000',
            borderRadius: '50%',
            border: '1px solid #444',
            boxShadow: 'inset 0 0 3px rgba(0,0,0,0.5)',
            zIndex: 9999
          }}>
            <div style={{
              position: 'absolute',
              inset: '2px',
              backgroundColor: '#1a1a1a',
              borderRadius: '50%'
            }}>
              <div style={{
                position: 'absolute',
                inset: '4px',
                backgroundColor: 'rgba(59, 130, 246, 0.3)',
                borderRadius: '50%'
              }}></div>
            </div>
          </div>
          
          <div className="battery">
            <span>📶</span>
            <span>🔋</span>
            <span>100%</span>
          </div>
        </div>

        <div className="home-screen">
          <div className="date-time">
            <div className="date">{dateString}</div>
            <div className="clock">{timeString}</div>
          </div>

          {/* App Grid - 3x3 Layout */}
          <div className="app-grid">
            <div className="app-icon" onClick={() => window.location.href = 'tel:'}>
              <div className="icon-circle phone">
                <span>📞</span>
              </div>
              <span className="app-name">Phone</span>
            </div>
            <div className="app-icon" onClick={() => window.location.href = 'sms:'}>
              <div className="icon-circle messages">
                <span>💬</span>
              </div>
              <span className="app-name">Messages</span>
            </div>
            <div className="app-icon" onClick={() => navigate('/instagram')}>
              <div className="icon-circle instagram">
                <img src="/assests/instalogo.jpeg" alt="Instagram" />
              </div>
              <span className="app-name">Instagram</span>
            </div>
            <div className="app-icon" onClick={() => navigate('/youtube')}>
              <div className="icon-circle youtube">
                <img src="/assests/Youtubelogo.png" alt="YouTube" />
              </div>
              <span className="app-name">YouTube</span>
            </div>
            <div className="app-icon">
              <a href="https://web.whatsapp.com" target="_blank" rel="noopener noreferrer" style={{textDecoration: 'none'}}>
                <div className="icon-circle whatsapp" style={{position: 'relative'}}>
                  <img src="/assests/wtlogo.png" alt="WhatsApp" />
                  <div className="whatsapp-badge">13</div>
                </div>
                <span className="app-name">WhatsApp</span>
              </a>
            </div>
            <div className="app-icon">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{textDecoration: 'none'}}>
                <div className="icon-circle facebook">
                  <img src="/assests/fblogo.png" alt="Facebook" />
                </div>
                <span className="app-name">Facebook</span>
              </a>
            </div>
            <div className="app-icon" onClick={() => alert('Camera app')}>
              <div className="icon-circle camera">
                <span>📷</span>
              </div>
              <span className="app-name">Camera</span>
            </div>
            <div className="app-icon" onClick={() => alert('Gallery app')}>
              <div className="icon-circle gallery">
                <span>🖼️</span>
              </div>
              <span className="app-name">Gallery</span>
            </div>
            <div className="app-icon">
              <a href="https://google.com" target="_blank" rel="noopener noreferrer" style={{textDecoration: 'none'}}>
                <div className="icon-circle google">
                  <img src="/assests/gllogo.png" alt="Google" />
                </div>
                <span className="app-name">Google</span>
              </a>
            </div>
          </div>
        </div>

        <div className="home-indicator"></div>
      </div>
    </div>
  );
};

export default MobileLanding;