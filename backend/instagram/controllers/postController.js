const Post = require('../models/Post');
const User = require('../models/User');

// Get feed posts
const getFeed = async (req, res) => {
  try {
    // For now, get all posts as a global feed
    // In a real app, you'd filter by following list
    const posts = await Post.find()
      .populate('author', 'username fullName profilePictureUrl isVerified')
      .populate('comments.author', 'username profilePictureUrl')
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(posts);
  } catch (error) {
    console.error('Error fetching feed:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Search posts by caption or location
const searchPosts = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim().length === 0) {
      return res.json([]);
    }

    const posts = await Post.find({
      $or: [
        { caption: { $regex: q, $options: 'i' } },
        { location: { $regex: q, $options: 'i' } }
      ]
    })
    .populate('author', 'username profilePictureUrl isVerified')
    .sort({ createdAt: -1 })
    .limit(20);

    res.json(posts);
  } catch (error) {
    console.error('Error searching posts:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new post
const createPost = async (req, res) => {
  try {
    const { caption, mediaUrl, imageUrl, location, author, type, aspectRatio } = req.body;

    // Use either mediaUrl or imageUrl for backward compatibility
    const finalMediaUrl = mediaUrl || imageUrl;

    if (!finalMediaUrl || !author) {
      return res.status(400).json({ message: 'Media URL and author are required' });
    }

    // Verify author exists
    const user = await User.findById(author);
    if (!user) {
      return res.status(404).json({ message: 'Author not found' });
    }

    // Auto-detect media type if not provided
    let mediaType = type;
    if (!mediaType) {
      const isVideo = finalMediaUrl.includes('mp4') || 
                     finalMediaUrl.includes('webm') || 
                     finalMediaUrl.includes('mov');
      mediaType = isVideo ? 'video' : 'image';
    }

    const post = new Post({
      caption: caption || '',
      mediaUrl: finalMediaUrl,
      imageUrl: finalMediaUrl, // For backward compatibility
      location: location || '',
      author,
      type: mediaType,
      aspectRatio: aspectRatio || '1:1'
    });

    await post.save();
    
    // Populate author details
    await post.populate('author', 'username fullName profilePictureUrl');
    
    res.status(201).json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Toggle like on a post
const toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const userIndex = post.likes.indexOf(userId);
    
    if (userIndex > -1) {
      // User already liked, so unlike
      post.likes.splice(userIndex, 1);
    } else {
      // User hasn't liked, so add like
      post.likes.push(userId);
    }

    await post.save();
    
    res.json({ 
      liked: userIndex === -1, 
      likesCount: post.likesCount 
    });
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add comment to a post
const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, author } = req.body;

    if (!text || !author) {
      return res.status(400).json({ message: 'Text and author are required' });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Verify author exists
    const user = await User.findById(author);
    if (!user) {
      return res.status(404).json({ message: 'Author not found' });
    }

    const comment = {
      text: text.trim(),
      author
    };

    post.comments.push(comment);
    await post.save();

    // Populate the new comment's author details
    await post.populate('comments.author', 'username profilePictureUrl');
    
    const newComment = post.comments[post.comments.length - 1];
    
    res.status(201).json(newComment);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single post
const getPost = async (req, res) => {
  try {
    const { id } = req.params;
    
    const post = await Post.findById(id)
      .populate('author', 'username fullName profilePictureUrl')
      .populate('comments.author', 'username profilePictureUrl');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getFeed,
  createPost,
  toggleLike,
  addComment,
  getPost,
  searchPosts
};