import mongoose from 'mongoose';

const animeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  anime: {
    type: String,
    required: true,
    trim: true
  },
  animeOtherName: {
    type: String,
    trim: true,
    default: ''
  },
  animeType: {
    type: String,
    trim: true,
    default: ''
  },
  airingStatus: {
    type: String,
    trim: true,
    default: ''
  },
  watchStatus: {
    type: String,
    enum: ['Watch Later', 'Watching', 'Dropped', 'Completed', 'On Hold', 'Yet to Air'],
    required: true,
    default: 'Watch Later'
  },
  websiteLink: {
    type: String,
    trim: true,
    default: ''
  },
  animeSchedule: {
    type: String,
    trim: true,
    default: ''
  },
  genres: {
    type: String,
    trim: true,
    default: ''
  },
  episodeOn: {
    type: Number,
    default: 0
  },
  totalEpisode: {
    type: Number,
    default: 0
  },
  image: {
    type: String,
    default: '🎌'
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

// Update the updatedAt field before saving
animeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Mongoose automatically pluralizes: 'Anime' model → 'animes' collection
// If you want a different collection name, use: mongoose.model('Anime', animeSchema, 'anime');
const Anime = mongoose.model('Anime', animeSchema);

export default Anime;

