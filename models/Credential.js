const mongoose = require('mongoose');

const credentialSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  service: {
    type: String,
    required: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    trim: true,
    default: 'Other'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

credentialSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Credential = mongoose.model('Credential', credentialSchema);

module.exports = Credential;

