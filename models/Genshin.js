const mongoose = require('mongoose');

const genshinSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  element: {
    type: String,
    enum: ['Electro', 'Geo', 'Pyro', 'Cryo', 'Hydro', 'Anemo', 'Dendro'],
    required: true,
    default: 'Anemo'
  },
  rarity: {
    type: Number,
    enum: [4, 5],
    required: true,
    default: 4
  },
  characterLevel: {
    type: Number,
    default: 1,
    min: 1,
    max: 90
  },
  characterOwned: {
    type: String,
    enum: ['Yes', 'No'],
    default: 'Yes'
  },
  constellation: {
    type: Number,
    default: 0,
    min: 0,
    max: 6
  },
  tier: {
    type: String,
    trim: true,
    default: ''
  },
  type: {
    type: String,
    trim: true,
    default: ''
  },
  type2: {
    type: String,
    trim: true,
    default: ''
  },
  weapon: {
    type: String,
    trim: true,
    default: ''
  },
  adventureRank: {
    type: Number,
    default: 1,
    min: 1,
    max: 60
  },
  image: {
    type: String,
    default: '⚔️'
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
genshinSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Genshin = mongoose.model('Genshin', genshinSchema);

module.exports = Genshin;

