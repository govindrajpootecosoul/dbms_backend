import express from 'express';
import Genshin from '../models/Genshin.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// GET all genshin characters for logged in user
router.get('/', async (req, res) => {
  try {
    const characters = await Genshin.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: characters
    });
  } catch (error) {
    console.error('Get genshin characters error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

// GET single character by ID
router.get('/:id', async (req, res) => {
  try {
    const character = await Genshin.findOne({ 
      _id: req.params.id,
      user: req.user._id 
    });

    if (!character) {
      return res.status(404).json({
        success: false,
        message: 'Character not found'
      });
    }

    res.status(200).json({
      success: true,
      data: character
    });
  } catch (error) {
    console.error('Get character error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

// POST create new character
router.post('/', async (req, res) => {
  try {
    const characterData = {
      ...req.body,
      user: req.user._id
    };

    const character = await Genshin.create(characterData);

    res.status(201).json({
      success: true,
      message: 'Character created successfully',
      data: character
    });
  } catch (error) {
    console.error('Create character error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

// PUT update character
router.put('/:id', async (req, res) => {
  try {
    let character = await Genshin.findOne({ 
      _id: req.params.id,
      user: req.user._id 
    });

    if (!character) {
      return res.status(404).json({
        success: false,
        message: 'Character not found'
      });
    }

    // Update fields
    character = await Genshin.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'Character updated successfully',
      data: character
    });
  } catch (error) {
    console.error('Update character error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

// DELETE character
router.delete('/:id', async (req, res) => {
  try {
    const character = await Genshin.findOne({ 
      _id: req.params.id,
      user: req.user._id 
    });

    if (!character) {
      return res.status(404).json({
        success: false,
        message: 'Character not found'
      });
    }

    await Genshin.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Character deleted successfully'
    });
  } catch (error) {
    console.error('Delete character error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

export default router;

