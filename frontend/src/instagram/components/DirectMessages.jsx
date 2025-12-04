import React, { useState, useEffect, useRef } from 'react';
import { trackInteraction } from '../../services/analyticsApi';
import './DirectMessages.css';

const DirectMessages = ({ isOpen, onClose }) => {
  const [activeChat, setActiveChat] = useState(null);
  const [message, setMessage] = useState('');
  const [conversations, setConversations] = useState([]);
  const messagesEndRef = useRef(null);

  // Mock conversations data
  const mockConversations = [
    {
      id: 1,
      user: {
        id: 2,
        username: 'john_doe',
        profilePicture: 'https://via.placeholder.com/44x44?text=JD',
        isOnline: true
      },
      lastMessage: {
        text: 'Hey! How are you doing?',
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 min ago
        isOwn: false
      },
      unreadCount: 2,
      messages: [
        {
          id: 1,
          text: 'Hey! How are you doing?',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          isOwn: false
        },
        {
          id: 2,
          text: 'I am doing great, thanks for asking! What about you?',
          timestamp: new Date(Date.now() - 25 * 60 * 1000),
          isOwn: true
        },
        {
          id: 3,
          text: 'That\'s awesome to hear! I\'m good too',
          timestamp: new Date(Date.now() - 20 * 60 * 1000),
          isOwn: false
        }
      ]
    },
    {
      id: 2,
      user: {
        id: 3,
        username: 'jane_smith',
        profilePicture: 'https://via.placeholder.com/44x44?text=JS',
        isOnline: false
      },
      lastMessage: {
        text: 'Thanks for the help earlier! 🙏',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        isOwn: false
      },
      unreadCount: 0,
      messages: [
        {
          id: 4,
          text: 'Could you help me with the project?',
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
          isOwn: false
        },
        {
          id: 5,
          text: 'Of course! What do you need help with?',
          timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000),
          isOwn: true
        },
        {
          id: 6,
          text: 'Thanks for the help earlier! 🙏',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          isOwn: false
        }
      ]
    },
    {
      id: 3,
      user: {
        id: 4,
        username: 'travel_buddy',
        profilePicture: 'https://via.placeholder.com/44x44?text=TB',
        isOnline: true
      },
      lastMessage: {
        text: 'Check out this amazing view!',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        isOwn: false
      },
      unreadCount: 1,
      messages: [
        {
          id: 7,
          text: 'Check out this amazing view!',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          isOwn: false
        }
      ]
    }
  ];

  useEffect(() => {
    if (isOpen) {
      // Fetch real conversations from API
      const fetchConversations = async () => {
        try {
          const currentUser = 'john_doe'; // This would come from auth context
          const response = await fetch(`http://localhost:5000/api/db/messages/conversations/${currentUser}`);
          if (response.ok) {
            const realConversations = await response.json();
            // Transform data to match our component format
            const transformedConversations = realConversations.map(conv => ({
              id: conv._id,
              user: {
                id: conv.participants.find(p => p !== currentUser) || 'unknown',
                username: conv.participants.find(p => p !== currentUser) || 'Unknown User',
                profilePicture: 'https://via.placeholder.com/44x44?text=' + 
                             (conv.participants.find(p => p !== currentUser)?.charAt(0).toUpperCase() || 'U'),
                isOnline: Math.random() > 0.5
              },
              lastMessage: {
                text: conv.lastMessage?.content || 'No messages yet',
                timestamp: new Date(conv.lastMessage?.timestamp || conv.updatedAt),
                isOwn: conv.lastMessage?.senderId === currentUser
              },
              unreadCount: conv.unreadCount?.[currentUser] || 0,
              messages: []
            }));
            
            if (transformedConversations.length > 0) {
              setConversations(transformedConversations);
            } else {
              setConversations(mockConversations);
            }
          } else {
            setConversations(mockConversations);
          }
        } catch (error) {
          console.error('Failed to fetch conversations:', error);
          setConversations(mockConversations);
        }
      };

      fetchConversations();
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [activeChat]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTimeAgo = (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp.getTime();
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  const formatMessageTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !activeChat) return;

    const newMessage = {
      id: Date.now(),
      text: message.trim(),
      timestamp: new Date(),
      isOwn: true
    };

    // Track message sending
    trackInteraction(activeChat.id, 'message', 'send');

    // Update local state
    setConversations(prev => prev.map(conv => 
      conv.id === activeChat.id 
        ? {
            ...conv,
            messages: [...conv.messages, newMessage],
            lastMessage: newMessage
          }
        : conv
    ));

    // Update active chat
    setActiveChat(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage],
      lastMessage: newMessage
    }));

    setMessage('');
    
    // Scroll to bottom
    setTimeout(scrollToBottom, 100);

    // TODO: Send to API
    try {
      await fetch('http://localhost:5000/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          conversationId: activeChat.id,
          text: message.trim(),
          recipientId: activeChat.user.id
        }),
      });
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const markAsRead = (conversationId) => {
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId 
        ? { ...conv, unreadCount: 0 }
        : conv
    ));
  };

  const selectConversation = (conversation) => {
    setActiveChat(conversation);
    markAsRead(conversation.id);
  };

  if (!isOpen) return null;

  return (
    <div className="dm-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="dm-container">
        {!activeChat ? (
          // Inbox List View
          <div className="dm-inbox">
            <div className="dm-header">
              <h2>Direct</h2>
              <button className="dm-close-btn" onClick={onClose}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              </button>
            </div>

            <div className="dm-search">
              <input
                type="text"
                placeholder="Search"
                className="dm-search-input"
              />
            </div>

            <div className="conversation-list">
              {conversations.length === 0 ? (
                <div className="no-messages">
                  <div className="no-messages-icon">
                    <svg width="96" height="96" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <h3>Your Messages</h3>
                  <p>Send private photos and messages to a friend or group.</p>
                  <button className="send-message-btn">Send Message</button>
                </div>
              ) : (
                conversations.map(conversation => (
                  <div
                    key={conversation.id}
                    className="conversation-item"
                    onClick={() => selectConversation(conversation)}
                  >
                    <div className="conversation-avatar-container">
                      <img
                        src={conversation.user.profilePicture}
                        alt={conversation.user.username}
                        className="conversation-avatar"
                      />
                      {conversation.user.isOnline && (
                        <div className="online-indicator"></div>
                      )}
                    </div>
                    
                    <div className="conversation-content">
                      <div className="conversation-header">
                        <span className="conversation-username">
                          {conversation.user.username}
                        </span>
                        <span className="conversation-time">
                          {formatTimeAgo(conversation.lastMessage.timestamp)}
                        </span>
                      </div>
                      
                      <div className="conversation-preview">
                        <span className={`last-message ${conversation.unreadCount > 0 ? 'unread' : 'read'}`}>
                          {conversation.lastMessage.isOwn ? 'You: ' : ''}
                          {conversation.lastMessage.text}
                        </span>
                        {conversation.unreadCount > 0 && (
                          <div className="unread-badge">{conversation.unreadCount}</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          // Chat View
          <div className="dm-chat">
            <div className="chat-header">
              <button 
                className="back-btn"
                onClick={() => setActiveChat(null)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 12H5m7-7l-7 7 7 7" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </button>
              
              <div className="chat-user-info">
                <img
                  src={activeChat.user.profilePicture}
                  alt={activeChat.user.username}
                  className="chat-avatar"
                />
                <div>
                  <div className="chat-username">{activeChat.user.username}</div>
                  {activeChat.user.isOnline && (
                    <div className="online-status">Active now</div>
                  )}
                </div>
              </div>

              <button className="dm-close-btn" onClick={onClose}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              </button>
            </div>

            <div className="messages-container">
              <div className="messages-list">
                {activeChat.messages.map(msg => (
                  <div 
                    key={msg.id}
                    className={`message ${msg.isOwn ? 'own' : 'other'}`}
                  >
                    <div className="message-bubble">
                      <span className="message-text">{msg.text}</span>
                      <span className="message-time">
                        {formatMessageTime(msg.timestamp)}
                      </span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="message-input-container">
              <div className="message-input-wrapper">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Message..."
                  className="message-input"
                  rows={1}
                />
                
                {message.trim() ? (
                  <button 
                    className="send-btn active"
                    onClick={handleSendMessage}
                  >
                    Send
                  </button>
                ) : (
                  <button className="heart-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DirectMessages;