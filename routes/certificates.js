const express = require('express');
const router = express.Router();
const Certificate = require('../models/Certificate');
const { cloudinary, upload } = require('../config/cloudinary');
const authMiddleware = require('../middleware/auth');

// GET all certificates (public)
router.get('/', async (req, res) => {
  try {
    const certs = await Certificate.find().sort({ order: 1, createdAt: -1 });
    res.json(certs);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST upload certificate (admin)
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { title, issuedBy, year, order } = req.body;
    if (!req.file) return res.status(400).json({ message: 'No image uploaded' });

    const cert = new Certificate({
      title,
      imageUrl: req.file.path,
      publicId: req.file.filename,
      issuedBy: issuedBy || '',
      year: year || '',
      order: order || 0,
    });
    await cert.save();
    res.status(201).json(cert);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Upload failed' });
  }
});

// PUT update certificate (admin)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { title, issuedBy, year, order } = req.body;
    const cert = await Certificate.findByIdAndUpdate(
      req.params.id,
      { title, issuedBy, year, order },
      { new: true }
    );
    if (!cert) return res.status(404).json({ message: 'Certificate not found' });
    res.json(cert);
  } catch (err) {
    res.status(500).json({ message: 'Update failed' });
  }
});

// DELETE certificate (admin)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const cert = await Certificate.findById(req.params.id);
    if (!cert) return res.status(404).json({ message: 'Not found' });

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(cert.publicId);
    await Certificate.findByIdAndDelete(req.params.id);

    res.json({ message: 'Certificate deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed' });
  }
});

module.exports = router;
