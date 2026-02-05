const { Complaint } = require('../models');

exports.fileComplaint = async (req, res) => {
  try {
    const { title, description } = req.body;
    const imageUrl = req.file ? req.file.path : null;

    const complaint = await Complaint.create({
      title,
      description,
      imageUrl,
      userId: req.user.id
    });

    res.status(201).json({ message: 'Complaint filed successfully', complaint });
  } catch (error) {
    res.status(500).json({ message: 'Error filing complaint' });
  }
};

exports.getComplaints = async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { userId: req.user.id };
    const complaints = await Complaint.findAll({ where: filter, order: [['createdAt', 'DESC']] });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching complaints' });
  }
};

// NEW FUNCTION: Update Status
exports.resolveComplaint = async (req, res) => {
  try {
    // 1. Security Check: Only Admins allowed
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { id } = req.params;
    const { status } = req.body; // 'resolved' or 'pending'

    const complaint = await Complaint.findByPk(id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    complaint.status = status;
    await complaint.save();

    res.json({ message: `Complaint marked as ${status}`, complaint });
  } catch (error) {
    res.status(500).json({ message: 'Error updating complaint' });
  }
};