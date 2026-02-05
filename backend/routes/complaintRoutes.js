const express = require('express');
const router = express.Router();
const { fileComplaint, getComplaints, resolveComplaint } = require('../controllers/complaintController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Existing Routes
router.post('/', protect, upload.single('image'), fileComplaint);
router.get('/', protect, getComplaints);

// NEW ROUTE: Status Update
router.put('/:id/status', protect, resolveComplaint);

module.exports = router;