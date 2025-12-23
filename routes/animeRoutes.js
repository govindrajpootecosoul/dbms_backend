const express = require('express');
const Anime = require('../models/Anime');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

// GET all anime for logged in user
router.get('/', async (req, res) => {
  try {
    const animeList = await Anime.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: animeList
    });
  } catch (error) {
    console.error('Get anime error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

// GET single anime by ID
router.get('/:id', async (req, res) => {
  try {
    const anime = await Anime.findOne({ 
      _id: req.params.id,
      user: req.user._id 
    });

    if (!anime) {
      return res.status(404).json({
        success: false,
        message: 'Anime not found'
      });
    }

    res.status(200).json({
      success: true,
      data: anime
    });
  } catch (error) {
    console.error('Get anime error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

// POST create new anime
router.post('/', async (req, res) => {
  try {
    const animeData = {
      ...req.body,
      user: req.user._id
    };

    const anime = await Anime.create(animeData);

    res.status(201).json({
      success: true,
      message: 'Anime created successfully',
      data: anime
    });
  } catch (error) {
    console.error('Create anime error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

// PUT update anime
router.put('/:id', async (req, res) => {
  try {
    let anime = await Anime.findOne({ 
      _id: req.params.id,
      user: req.user._id 
    });

    if (!anime) {
      return res.status(404).json({
        success: false,
        message: 'Anime not found'
      });
    }

    // Update fields
    anime = await Anime.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'Anime updated successfully',
      data: anime
    });
  } catch (error) {
    console.error('Update anime error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

// DELETE anime
router.delete('/:id', async (req, res) => {
  try {
    const anime = await Anime.findOne({ 
      _id: req.params.id,
      user: req.user._id 
    });

    if (!anime) {
      return res.status(404).json({
        success: false,
        message: 'Anime not found'
      });
    }

    await Anime.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Anime deleted successfully'
    });
  } catch (error) {
    console.error('Delete anime error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

module.exports = router;

