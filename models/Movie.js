import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
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
  type: {
    type: String,
    enum: ['Movie', 'Series', 'K Drama'],
    required: true,
    default: 'Movie'
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
    enum: ['Watching', 'Watched', 'Completed', 'Plan to Watch'],
    required: true,
    default: 'Plan to Watch'
  },
  image: {
    type: String,
    default: '🎬'
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

movieSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Movie = mongoose.model('Movie', movieSchema);

export default Movie;

