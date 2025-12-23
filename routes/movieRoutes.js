const express = require('express');
const Movie = require('../models/Movie');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: movies
    });
  } catch (error) {
    console.error('Get movies error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findOne({ 
      _id: req.params.id,
      user: req.user._id 
    });

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie/Series not found'
      });
    }

    res.status(200).json({
      success: true,
      data: movie
    });
  } catch (error) {
    console.error('Get movie error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

router.post('/', async (req, res) => {
  try {
    const movieData = {
      ...req.body,
      user: req.user._id
    };

    const movie = await Movie.create(movieData);

    res.status(201).json({
      success: true,
      message: 'Movie/Series created successfully',
      data: movie
    });
  } catch (error) {
    console.error('Create movie error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

router.put('/:id', async (req, res) => {
  try {
    let movie = await Movie.findOne({ 
      _id: req.params.id,
      user: req.user._id 
    });

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie/Series not found'
      });
    }

    movie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'Movie/Series updated successfully',
      data: movie
    });
  } catch (error) {
    console.error('Update movie error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const movie = await Movie.findOne({ 
      _id: req.params.id,
      user: req.user._id 
    });

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie/Series not found'
      });
    }

    await Movie.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Movie/Series deleted successfully'
    });
  } catch (error) {
    console.error('Delete movie error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

module.exports = router;

