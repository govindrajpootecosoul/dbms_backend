const express = require('express');
const KDrama = require('../models/KDrama');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', async (req, res) => {
  try {
    const dramas = await KDrama.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: dramas
    });
  } catch (error) {
    console.error('Get kdramas error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const drama = await KDrama.findOne({ 
      _id: req.params.id,
      user: req.user._id 
    });

    if (!drama) {
      return res.status(404).json({
        success: false,
        message: 'K-Drama not found'
      });
    }

    res.status(200).json({
      success: true,
      data: drama
    });
  } catch (error) {
    console.error('Get kdrama error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

router.post('/', async (req, res) => {
  try {
    const dramaData = {
      ...req.body,
      user: req.user._id
    };

    const drama = await KDrama.create(dramaData);

    res.status(201).json({
      success: true,
      message: 'K-Drama created successfully',
      data: drama
    });
  } catch (error) {
    console.error('Create kdrama error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

router.put('/:id', async (req, res) => {
  try {
    let drama = await KDrama.findOne({ 
      _id: req.params.id,
      user: req.user._id 
    });

    if (!drama) {
      return res.status(404).json({
        success: false,
        message: 'K-Drama not found'
      });
    }

    drama = await KDrama.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'K-Drama updated successfully',
      data: drama
    });
  } catch (error) {
    console.error('Update kdrama error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const drama = await KDrama.findOne({ 
      _id: req.params.id,
      user: req.user._id 
    });

    if (!drama) {
      return res.status(404).json({
        success: false,
        message: 'K-Drama not found'
      });
    }

    await KDrama.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'K-Drama deleted successfully'
    });
  } catch (error) {
    console.error('Delete kdrama error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

module.exports = router;

