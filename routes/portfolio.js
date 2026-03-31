const express = require('express');
const router = express.Router();
const Portfolio = require('../models/Portfolio');
const authMiddleware = require('../middleware/auth');

const DEFAULT_CONTENT = {
  profile: {
    firmName: 'Audit & Compliance Professionals',
    tagline: 'Trusted. Certified. Experienced.',
    subtitle: 'Statutory Audit | Government Liaison | ISO Certification',
    description: 'A premier audit and compliance consultancy with deep expertise in statutory auditing, government liaison, and internationally recognized certification audits across SMETA, BSCI, WCA, GSV, SCAN, CT-PAT and more.',
  },
  team: [
    {
      id: 1,
      name: 'Senior Auditor I',
      role: 'Lead Statutory Auditor & Government Liaison Specialist',
      qualifications: ['PG in Public Administration', 'Diploma in Personnel Management & IR', 'LLB'],
      certificates: ['Lead Auditor — ISO 9001:2000', 'Internal Auditor — SAKON', 'SLCP Training'],
      experience: '15+ Years',
      bio: 'Extensive experience conducting statutory audits and liaising with government authorities across multiple sectors.',
    },
    {
      id: 2,
      name: 'Senior Auditor II',
      role: 'Compliance & Technical Audit Specialist',
      qualifications: ['PG in Public Administration', 'Diploma in Personnel Management & IR', 'LLB'],
      certificates: ['Lead Auditor — ISO 9001:2000', 'Internal Auditor — SAKON', 'SLCP Training'],
      experience: '12+ Years',
      bio: 'Specialist in SMETA, BSCI, WCA and international compliance auditing with deep technical expertise.',
    },
  ],
  services: [
    {
      id: 1,
      category: 'Statutory Audits',
      icon: '📋',
      items: ['SMETA Audit', 'BSCI Audit', 'SEPE Audit', 'WCA Audit', 'GSV Audit', 'SCAN Audit', 'CT-PAT Audit', 'Technical Audit (SOP & CoC)'],
    },
    {
      id: 2,
      category: 'Government Liaison',
      icon: '🏛️',
      items: ['Liaison with Government Authorities', 'Public Administration Consulting', 'Regulatory Compliance Advisory', 'Personnel Management & IR'],
    },
  ],
  contact: {
    email: 'contact@auditfirm.com',
    phone: '+91 XXXXX XXXXX',
    address: 'India',
    workingHours: 'Mon – Sat: 9:00 AM – 6:00 PM',
  },
};

// GET all content (public)
router.get('/', async (req, res) => {
  try {
    const docs = await Portfolio.find();
    if (docs.length === 0) {
      // Seed defaults
      for (const [key, value] of Object.entries(DEFAULT_CONTENT)) {
        await Portfolio.create({ key, value });
      }
      return res.json(DEFAULT_CONTENT);
    }
    const content = {};
    docs.forEach(d => { content[d.key] = d.value; });
    res.json(content);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT update a section (admin)
router.put('/:key', authMiddleware, async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;
    const doc = await Portfolio.findOneAndUpdate(
      { key },
      { value },
      { new: true, upsert: true }
    );
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: 'Update failed' });
  }
});

module.exports = router;
