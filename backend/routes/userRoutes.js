const express = require('express');
const router = express.Router();
const { 
  loginUser, 
  registerUser, 
  inviteUser, 
  setupPassword, // <--- Import this
  getAllUsers, 
  deleteUser, 
  updateUserRole 
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.post('/login', loginUser);
router.post('/register', registerUser);
router.post('/setup-password', setupPassword); // <--- NO PROTECT MIDDLEWARE HERE

// Protected Admin Routes
router.post('/invite', protect, inviteUser);
router.get('/', protect, getAllUsers);
router.delete('/:id', protect, deleteUser);
router.put('/:id/role', protect, updateUserRole);

module.exports = router;