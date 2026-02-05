const express = require('express');
const router = express.Router();
const { 
  getMyBills, 
  createBill, 
  getResidents, 
  getAllBills, 
  markBillPaid 
} = require('../controllers/billController');
const { protect } = require('../middleware/authMiddleware');

// Resident Routes
router.get('/my-bills', protect, getMyBills);

// Admin Routes
router.get('/residents', protect, getResidents);
router.post('/create', protect, createBill);
router.get('/all', protect, getAllBills); // <--- See all bills
router.put('/:id/pay', protect, markBillPaid); // <--- Mark as paid

module.exports = router;