import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
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
  platform: {
    type: String,
    required: true,
    trim: true,
    default: 'PC'
  },
  status: {
    type: String,
    enum: ['Playing', 'Completed', 'On Hold', 'Plan to Play'],
    required: true,
    default: 'Plan to Play'
  },
  rating: {
    type: Number,
    min: 0,
    max: 10,
    default: 0
  },
  image: {
    type: String,
    default: '🎮'
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

gameSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Game = mongoose.model('Game', gameSchema);

export default Game;

