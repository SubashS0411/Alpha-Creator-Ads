const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Import Message model
const Message = require('../models/Message');

// Schemas - check if models already exist
let Conversation;

try {
  Conversation = mongoose.model('Conversation');
} catch (error) {
  const conversationSchema = new mongoose.Schema({
    participants: [String],
    lastMessage: mongoose.Schema.Types.Mixed,
    unreadCount: mongoose.Schema.Types.Mixed,
    createdAt: Date,
    updatedAt: Date
  });
  Conversation = mongoose.model('Conversation', conversationSchema);
}

// Message model imported above
if (!Message) {
  try {
    Message = mongoose.model('Message');
  } catch (error) {
    const messageSchema = new mongoose.Schema({
      conversationId: String,
      senderId: String,
      receiverId: String,
      content: String,
      type: String,
      timestamp: Date,
      isRead: Boolean
    });
    Message = mongoose.model('Message', messageSchema);
  }
}

// Get all conversations for a user
router.get('/conversations/:userId', async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.params.userId
    }).sort({ updatedAt: -1 });
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get messages for a conversation
router.get('/messages/:conversationId', async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId
    }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send a new message
router.post('/messages', async (req, res) => {
  try {
    const { conversationId, senderId, receiverId, content, type = 'text' } = req.body;
    
    const message = new Message({
      conversationId,
      senderId,
      receiverId,
      content,
      type,
      timestamp: new Date(),
      isRead: false
    });
    
    await message.save();
    
    // Update conversation's last message
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: {
        senderId,
        content,
        timestamp: new Date(),
        type
      },
      updatedAt: new Date()
    });
    
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;