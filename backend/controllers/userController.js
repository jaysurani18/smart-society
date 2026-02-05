const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); // Built-in Node module

const generateToken = (id, name, role) => {
  return jwt.sign({ id, name, role }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Login User
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });

  if (user && (await bcrypt.compare(password, user.password))) {
    // Optional: Check if they have setup their account
    // if (!user.isSetup) return res.status(403).json({ message: "Please use your invite link to set a password first." });

    res.json({
      token: generateToken(user.id, user.name, user.role),
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

// @desc    Register User (For initial setup only)
exports.registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  if (await User.findOne({ where: { email } })) {
    return res.status(400).json({ message: 'User already exists' });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  
  // Mark registered users as setup automatically
  const user = await User.create({ name, email, password: hashedPassword, role, isSetup: true });

  res.status(201).json({ token: generateToken(user.id, user.name, user.role) });
};

// @desc    Invite User (Generates Link)
exports.inviteUser = async (req, res) => {
  try {
    const { name, email, role, wing, flatNumber } = req.body;
    
    if (await User.findOne({ where: { email } })) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Generate secure random token
    const token = crypto.randomBytes(20).toString('hex');

    // Create user with placeholder password
    const user = await User.create({ 
      name, email, role, wing, flatNumber, 
      invitationToken: token,
      password: 'NOT_SET', 
      isSetup: false 
    });

    const inviteLink = `http://localhost:5173/setup-password/${token}`;

    console.log("\n==================================================");
    console.log("🔗  NEW INVITE LINK GENERATED");
    console.log("--------------------------------------------------");
    console.log(`Resident: ${name}`);
    console.log(`Link: ${inviteLink}`); // <--- Click this in terminal
    console.log("==================================================\n");

    res.status(201).json({ message: 'Invitation link generated in terminal' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error inviting user' });
  }
};

// @desc    Setup Password (Verifies Token)
exports.setupPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    
    console.log("🛠️ Setup requested for token:", token);

    const user = await User.findOne({ where: { invitationToken: token } });

    if (!user) {
      console.log("❌ Invalid Token");
      return res.status(400).json({ message: 'Invalid or expired invite link.' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.invitationToken = null; // Clear token so it can't be used again
    user.isSetup = true;
    await user.save();

    console.log("✅ Password set for:", user.email);
    res.json({ message: 'Account activated! You can now login.' });
  } catch (error) {
    console.error("Setup Error:", error);
    res.status(500).json({ message: 'Error setting password' });
  }
};

// @desc    Get All Users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ order: [['wing', 'ASC'], ['flatNumber', 'ASC']] });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
};

// @desc    Delete User
exports.deleteUser = async (req, res) => {
  try {
    await User.destroy({ where: { id: req.params.id } });
    res.json({ message: 'User removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing user' });
  }
};

// @desc    Update Role
exports.updateUserRole = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.role = req.body.role;
    await user.save();
    res.json({ message: 'User role updated', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating role' });
  }
};