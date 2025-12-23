import mongoose from 'mongoose';

const kdramaSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  year: {
    type: Number,
    default: 2024
  },
  rating: {
    type: Number,
    min: 0,
    max: 10,
    default: 0
  },
  status: {
    type: String,
    enum: ['Watching', 'Completed', 'Plan to Watch', 'On Hold'],
    required: true,
    default: 'Plan to Watch'
  },
  episodes: {
    type: Number,
    default: 0
  },
  image: {
    type: String,
    default: '🇰🇷'
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

kdramaSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const KDrama = mongoose.model('KDrama', kdramaSchema);

export default KDrama;

