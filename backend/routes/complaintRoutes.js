const express = require('express');
const router = express.Router();
const { 
  fileComplaint, 
  getComplaints, 
  updateComplaintStatus // <--- Must match the name in your controller exactly
} = require('../controllers/complaintController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// 1. File a complaint
router.post('/', protect, upload.single('image'), fileComplaint);

// 2. Get complaints list
router.get('/', protect, getComplaints);

// 3. Update status (This is where the crash was happening)
router.put('/:id/status', protect, updateComplaintStatus); 

module.exports = router;