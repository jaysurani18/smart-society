const { User, MaintenanceBill, Complaint } = require('../models');

exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    if (role === 'admin') {
      // === ADMIN STATS (Society Wide) ===
      const totalResidents = await User.count({ where: { role: 'resident' } });
      const pendingComplaints = await Complaint.count({ where: { status: 'pending' } });
      
      const bills = await MaintenanceBill.findAll();
      const totalCollected = bills
        .filter(b => b.status === 'paid')
        .reduce((sum, b) => sum + Number(b.amount), 0);
      
      const totalPending = bills
        .filter(b => b.status === 'pending')
        .reduce((sum, b) => sum + Number(b.amount), 0);

      return res.json({
        type: 'admin',
        totalResidents,
        activeIssues: pendingComplaints,
        totalCollected,
        totalPending
      });

    } else {
      // === RESIDENT STATS (Personal) ===
      const myBills = await MaintenanceBill.findAll({ where: { userId } });
      const myPending = myBills
        .filter(b => b.status === 'pending')
        .reduce((sum, b) => sum + Number(b.amount), 0);
      
      // Find last paid amount
      const paidBills = myBills.filter(b => b.status === 'paid').sort((a, b) => b.updatedAt - a.updatedAt);
      const lastPayment = paidBills.length > 0 ? paidBills[0].amount : 0;
      const lastPaymentDate = paidBills.length > 0 ? paidBills[0].updatedAt : null;

      const myComplaints = await Complaint.count({ where: { userId, status: 'pending' } });

      return res.json({
        type: 'resident',
        myBalance: myPending,
        lastPayment,
        lastPaymentDate,
        activeIssues: myComplaints
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching stats' });
  }
};