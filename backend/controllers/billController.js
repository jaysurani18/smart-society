const { MaintenanceBill, User } = require('../models');

// @desc    Get all bills for the logged-in user (Resident View)
exports.getMyBills = async (req, res) => {
  try {
    const bills = await MaintenanceBill.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    res.json(bills);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a bill (Admin Only)
exports.createBill = async (req, res) => {
  try {
    const { userId, amount, month, dueDate } = req.body;
    const bill = await MaintenanceBill.create({
      userId,
      amount,
      month,
      dueDate,
      status: 'pending'
    });
    res.status(201).json({ message: 'Bill generated', bill });
  } catch (error) {
    res.status(500).json({ message: 'Error creating bill' });
  }
};

// @desc    Get all residents for dropdown (Admin Only)
exports.getResidents = async (req, res) => {
  try {
    const residents = await User.findAll({ where: { role: 'resident' }, attributes: ['id', 'name', 'email'] });
    res.json(residents);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching residents' });
  }
};

// === NEW FEATURES ===

// @desc    Get ALL bills (Admin View to see who hasn't paid)
exports.getAllBills = async (req, res) => {
  try {
    const bills = await MaintenanceBill.findAll({
      include: [{ model: User, attributes: ['name', 'email'] }], // Include Resident Name
      order: [['createdAt', 'DESC']]
    });
    res.json(bills);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all bills' });
  }
};

// @desc    Mark bill as PAID (Admin Action)
exports.markBillPaid = async (req, res) => {
  try {
    const { id } = req.params;
    const bill = await MaintenanceBill.findByPk(id);
    
    if (!bill) return res.status(404).json({ message: 'Bill not found' });

    bill.status = 'paid';
    await bill.save();

    res.json({ message: 'Bill marked as PAID', bill });
  } catch (error) {
    res.status(500).json({ message: 'Error updating bill' });
  }
};