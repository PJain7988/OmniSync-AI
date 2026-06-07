const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  salt: { type: String, required: true },
  role: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    dept: { type: String, required: true },
    scope: { type: String, required: true },
    handle: { type: String },
    avatar: { type: String }
  },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
