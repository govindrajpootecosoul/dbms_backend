const express = require('express');
const Credential = require('../models/Credential');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', async (req, res) => {
  try {
    const credentials = await Credential.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: credentials
    });
  } catch (error) {
    console.error('Get credentials error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const credential = await Credential.findOne({ 
      _id: req.params.id,
      user: req.user._id 
    });

    if (!credential) {
      return res.status(404).json({
        success: false,
        message: 'Credential not found'
      });
    }

    res.status(200).json({
      success: true,
      data: credential
    });
  } catch (error) {
    console.error('Get credential error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

router.post('/', async (req, res) => {
  try {
    const credentialData = {
      ...req.body,
      user: req.user._id
    };

    const credential = await Credential.create(credentialData);

    res.status(201).json({
      success: true,
      message: 'Credential created successfully',
      data: credential
    });
  } catch (error) {
    console.error('Create credential error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

router.put('/:id', async (req, res) => {
  try {
    let credential = await Credential.findOne({ 
      _id: req.params.id,
      user: req.user._id 
    });

    if (!credential) {
      return res.status(404).json({
        success: false,
        message: 'Credential not found'
      });
    }

    credential = await Credential.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'Credential updated successfully',
      data: credential
    });
  } catch (error) {
    console.error('Update credential error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const credential = await Credential.findOne({ 
      _id: req.params.id,
      user: req.user._id 
    });

    if (!credential) {
      return res.status(404).json({
        success: false,
        message: 'Credential not found'
      });
    }

    await Credential.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Credential deleted successfully'
    });
  } catch (error) {
    console.error('Delete credential error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

module.exports = router;

