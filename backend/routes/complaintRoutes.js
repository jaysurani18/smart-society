const express = require('express');
const router = express.Router();
const { 
  fileComplaint, 
  getComplaints, 
  updateComplaintStatus,
  deleteComplaint // <--- 1. Import this
} = require('../controllers/complaintController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/', protect, upload.single('image'), fileComplaint);
router.get('/', protect, getComplaints);
router.put('/:id/status', protect, updateComplaintStatus);

// 2. Add this DELETE route
router.delete('/:id', protect, deleteComplaint); 

module.exports = router;