const express = require('express');
const router = express.Router();
const { 
  loginUser, 
  registerUser, 
  inviteUser, 
  setupPassword, 
  getAllUsers, 
  deleteUser, 
  updateUserRole,
  updateProfile // <--- THIS WAS MISSING
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Public Routes
router.post('/login', loginUser);
router.post('/register', registerUser);
router.post('/setup-password', setupPassword); 

// Protected Routes (Logged in users)
router.put('/profile', protect, updateProfile); // <--- Now this will work

// Admin Routes
router.post('/invite', protect, inviteUser);
router.get('/', protect, getAllUsers);
router.delete('/:id', protect, deleteUser);
router.put('/:id/role', protect, updateUserRole);

module.exports = router;