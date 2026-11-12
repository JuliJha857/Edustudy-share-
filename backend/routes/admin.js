const express = require('express');
const Resource = require('../models/Resource');
const router = express.Router();

// Get pending resources for admin approval
router.get('/pending', async (req, res) => {
  const pending = await Resource.find({ status: 'Pending' }).populate('uploadedBy', 'name');
  res.json(pending);
});

// Approve or Reject
router.put('/approve/:id', async (req, res) => {
  const { status } = req.body; // Approved or Rejected
  const updated = await Resource.findByIdAndUpdate(req.params.id, { status }, { new: true });
  res.json(updated);
});

module.exports = router; 