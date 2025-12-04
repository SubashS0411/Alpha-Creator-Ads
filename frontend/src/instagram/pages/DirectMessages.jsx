import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Search, Phone, VideoIcon, Info, Heart, Image, Send, Smile } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { trackInteraction } from '../../services/analyticsApi';

const DirectMessages = () => {
  const navigate = useNavigate();
  const { chatId } = useParams();
  const { currentUser } = useSelector(state => state.auth);
  const [searchQuery, setSearchQuery] = useState('');
  const [messageText, setMessageText] = useState('');
  const [activeChat, setActiveChat] = useState(null);
  const messagesEndRef = useRef(null);

  // Mock conversations data
  const [conversations] = useState([
    {
      id: 1,
      user: {
        username: 'nature_explorer',
        fullName: 'Nature Explorer',
        profilePicture: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
        isOnline: true,
        lastSeen: null
      },
      lastMessage: {
        text: 'That mountain shot is incredible! 🏔️',
        timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
        sender: 'other',
        isRead: false
      },
      unreadCount: 2
    },
    {
      id: 2,
      user: {
        username: 'foodie_pics',
        fullName: 'Chef Marina',
        profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        isOnline: false,
        lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
      },
      lastMessage: {
        text: 'Thanks for the recipe! 🍕',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
        sender: 'me',
        isRead: true
      },
      unreadCount: 0
    },
    {
      id: 3,
      user: {
        username: 'urban_artist',
        fullName: 'Alex Kim',
        profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        isOnline: true,
        lastSeen: null
      },
      lastMessage: {
        text: 'Love your latest artwork!',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        sender: 'other',
        isRead: true
      },
      unreadCount: 0
    },
    {
      id: 4,
      user: {
        username: 'travel_soul',
        fullName: 'Sarah Williams',
        profilePicture: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
        isOnline: false,
        lastSeen: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
      },
      lastMessage: {
        text: 'Where was this photo taken?',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        sender: 'other',
        isRead: true
      },
      unreadCount: 0
    }
  ]);

  // Mock messages for active chat
  const [messages, setMessages] = useState({
    1: [
      {
        id: 1,
        text: 'Hey! I saw your latest post',
        sender: 'other',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isRead: true
      },
      {
        id: 2,
        text: 'Thanks! That was from my hiking trip last weekend',
        sender: 'me',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 5 * 60 * 1000),
        isRead: true
      },
      {
        id: 3,
        text: 'The composition is perfect! What camera did you use?',
        sender: 'other',
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        isRead: true
      },
      {
        id: 4,
        text: 'Just my phone actually! The lighting was amazing that day',
        sender: 'me',
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        isRead: true
      },
      {
        id: 5,
        text: 'That mountain shot is incredible! 🏔️',
        sender: 'other',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        isRead: false
      }
    ],
    2: [
      {
        id: 1,
        text: 'Your pizza recipe looks amazing!',
        sender: 'other',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        isRead: true
      },
      {
        id: 2,
        text: 'Thanks for the recipe! 🍕',
        sender: 'me',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        isRead: true
      }
    ]
  });

  useEffect(() => {
    if (chatId) {
      const chat = conversations.find(c => c.id === parseInt(chatId));
      setActiveChat(chat);
    }
  }, [chatId, conversations]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeChat]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return timestamp.toLocaleDateString();
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !activeChat) return;

    try {
      // Track interaction
      await trackInteraction('message', 'message', 'send');

      const newMessage = {
        id: Date.now(),
        text: messageText.trim(),
        sender: 'me',
        timestamp: new Date(),
        isRead: true
      };

      setMessages(prev => ({
        ...prev,
        [activeChat.id]: [...(prev[activeChat.id] || []), newMessage]
      }));

      setMessageText('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Chat List View
  if (!activeChat) {
    return (
      <div className="h-full bg-white flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200">
          <div className="flex items-center px-4 py-3">
            <button
              onClick={() => navigate(-1)}
              className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-semibold flex-1">Direct</h1>
          </div>

          {/* Search */}
          <div className="px-4 pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-100 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <div className="w-16 h-16 border-2 border-gray-300 rounded-full flex items-center justify-center mb-4">
                <Send className="w-8 h-8" />
              </div>
              <p className="text-lg font-medium mb-2">Your Messages</p>
              <p className="text-sm text-center px-8">
                Send private photos and messages to a friend or group.
              </p>
            </div>
          ) : (
            <div>
              {filteredConversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => {
                    setActiveChat(conversation);
                    navigate(`/instagram/direct/${conversation.id}`);
                  }}
                  className="w-full flex items-center px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  {/* Profile Picture */}
                  <div className="relative mr-3">
                    <img
                      src={conversation.user.profilePicture}
                      alt={conversation.user.username}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                    {conversation.user.isOnline && (
                      <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>

                  {/* Conversation Info */}
                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900">
                        {conversation.user.username}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatTimestamp(conversation.lastMessage.timestamp)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${
                        conversation.unreadCount > 0 ? 'font-medium text-gray-900' : 'text-gray-500'
                      }`}>
                        {conversation.lastMessage.sender === 'me' && 'You: '}
                        {conversation.lastMessage.text}
                      </span>
                      
                      {conversation.unreadCount > 0 && (
                        <div className="ml-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                          {conversation.unreadCount}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Chat View
  return (
    <div className="h-full bg-white flex flex-col">
      {/* Chat Header */}
      <div className="flex items-center px-4 py-3 border-b border-gray-200">
        <button
          onClick={() => {
            setActiveChat(null);
            navigate('/instagram/direct');
          }}
          className="mr-3 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="flex items-center flex-1">
          <img
            src={activeChat.user.profilePicture}
            alt={activeChat.user.username}
            className="w-10 h-10 rounded-full object-cover mr-3"
          />
          <div>
            <h2 className="font-semibold text-gray-900">{activeChat.user.username}</h2>
            {activeChat.user.isOnline ? (
              <p className="text-sm text-green-500">Active now</p>
            ) : (
              <p className="text-sm text-gray-500">
                Active {formatTimestamp(activeChat.user.lastSeen)} ago
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Phone className="w-6 h-6 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <VideoIcon className="w-6 h-6 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Info className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {(messages[activeChat.id] || []).map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                message.sender === 'me'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-900'
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <p className={`text-xs mt-1 ${
                message.sender === 'me' ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {formatTimestamp(message.timestamp)}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-end space-x-2">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Image className="w-6 h-6 text-gray-600" />
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-end bg-gray-100 rounded-full px-4 py-2">
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Message..."
                className="flex-1 bg-transparent outline-none text-sm"
              />
              <button className="ml-2 p-1 hover:bg-gray-200 rounded-full transition-colors">
                <Smile className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {messageText.trim() ? (
            <button
              onClick={handleSendMessage}
              className="px-4 py-2 bg-blue-500 text-white rounded-full font-semibold text-sm hover:bg-blue-600 transition-colors"
            >
              Send
            </button>
          ) : (
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Heart className="w-6 h-6 text-red-500" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DirectMessages;