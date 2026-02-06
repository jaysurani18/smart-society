const { Complaint, User } = require('../models');

// File a new complaint
exports.fileComplaint = async (req, res) => {
  try {
    const { title, description } = req.body;
    const imageUrl = req.file ? req.file.path : null;

    const complaint = await Complaint.create({
      title,
      description,
      imageUrl,
      userId: req.user.id,
      status: 'pending' // Explicit default
    });

    res.status(201).json({ message: 'Complaint filed successfully', complaint });
  } catch (error) {
    res.status(500).json({ message: 'Error filing complaint' });
  }
};

// Get complaints (Admin sees all, Resident sees theirs)
exports.getComplaints = async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { userId: req.user.id };
    
    // We include the User model so Admins can see WHO filed the complaint
    const complaints = await Complaint.findAll({ 
      where: filter, 
      include: [{ model: User, attributes: ['name', 'wing', 'flatNumber'] }],
      order: [['createdAt', 'DESC']] 
    });
    
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching complaints' });
  }
};

exports.deleteComplaint = async (req, res) => {
  try {
    // Only Admin can delete
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { id } = req.params;
    const complaint = await Complaint.findByPk(id);

    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    await complaint.destroy(); // <--- Actually deletes it from DB

    res.json({ message: 'Complaint deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting complaint' });
  }
};

// Update Status (Admin Only)
exports.updateComplaintStatus = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can update status' });
    }

    const { id } = req.params;
    const { status } = req.body; // Expecting: 'pending', 'in-progress', or 'resolved'

    const complaint = await Complaint.findByPk(id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    complaint.status = status;
    await complaint.save();

    res.json({ message: `Status updated to ${status}`, complaint });
  } catch (error) {
    console.error("Status Update Error:", error);
    res.status(500).json({ message: 'Error updating status' });
  }
};