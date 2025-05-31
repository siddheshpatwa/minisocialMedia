const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, default: "" },
  email: { type: String, default: "" },
  img: { type: [String], default: [] }, 
  title: { type: String, default: "" },
  desc: { type: String, default: "" },
  caption: { type: String, default: "" },
  hashtags: { type: String, default: "" },
  tags: { type: String, default: "" },
  location: { type: String, default: "" },
  alt: { type: String, default: "" },

  // Add this field:
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],  

}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
