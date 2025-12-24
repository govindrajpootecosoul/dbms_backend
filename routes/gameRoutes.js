const express = require('express');
const Game = require('../models/Game');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', async (req, res) => {
  try {
    const games = await Game.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: games
    });
  } catch (error) {
    console.error('Get games error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const game = await Game.findOne({ 
      _id: req.params.id,
      user: req.user._id 
    });

    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found'
      });
    }

    res.status(200).json({
      success: true,
      data: game
    });
  } catch (error) {
    console.error('Get game error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

router.post('/', async (req, res) => {
  try {
    // Validate required fields
    if (!req.body.title) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }

    const gameData = {
      title: req.body.title,
      platform: req.body.platform || 'PC',
      status: req.body.status || 'Plan to Play',
      rating: req.body.rating || 0,
      image: req.body.image || '🎮',
      user: req.user._id
    };

    const game = await Game.create(gameData);

    res.status(201).json({
      success: true,
      message: 'Game created successfully',
      data: game
    });
  } catch (error) {
    console.error('Create game error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

router.put('/:id', async (req, res) => {
  try {
    let game = await Game.findOne({ 
      _id: req.params.id,
      user: req.user._id 
    });

    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found'
      });
    }

    game = await Game.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'Game updated successfully',
      data: game
    });
  } catch (error) {
    console.error('Update game error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const game = await Game.findOne({ 
      _id: req.params.id,
      user: req.user._id 
    });

    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found'
      });
    }

    await Game.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Game deleted successfully'
    });
  } catch (error) {
    console.error('Delete game error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

module.exports = router;

