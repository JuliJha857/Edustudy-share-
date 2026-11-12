const express = require('express');
const Resource = require('../models/Resource');
const router = express.Router();

// Get all approved resources
router.get('/', async (req, res) => {
  const resources = await Resource.find({ status: 'Approved' }).populate('uploadedBy', 'name');
  res.json(resources);
});

// Upload new resource (student uploads)
router.post('/upload', async (req, res) => {
  const { title, subject, branch, semester, type, fileUrl } = req.body;
  const resource = await Resource.create({ title, subject, branch, semester, type, fileUrl, status: 'Pending' });
  res.json(resource);
});

// Download count increase
router.put('/:id/download', async (req, res) => {
  const r = await Resource.findByIdAndUpdate(req.params.id, { $inc: { downloadCount: 1 } }, { new: true });
  res.json(r);
});

module.exports = router;