import React, { useState, useEffect } from 'react';
import API from './api';
import { Send, Users, Calendar, DollarSign, CheckCircle, Clock } from 'lucide-react';

const AdminBills = () => {
  const [residents, setResidents] = useState([]);
  const [allBills, setAllBills] = useState([]); // Store list of bills
  const [formData, setFormData] = useState({ userId: '', amount: '', month: '', dueDate: '' });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Load Data on Mount
  useEffect(() => {
    fetchResidents();
    fetchAllBills();
  }, []);

  const fetchResidents = async () => {
    try {
      const { data } = await API.get('/bills/residents');
      setResidents(data);
    } catch (err) { console.error("Error loading residents"); }
  };

  const fetchAllBills = async () => {
    try {
      const { data } = await API.get('/bills/all');
      setAllBills(data);
    } catch (err) { console.error("Error loading bills"); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    try {
      await API.post('/bills/create', formData);
      setMsg('✅ Bill generated successfully!');
      setFormData({ userId: '', amount: '', month: '', dueDate: '' });
      fetchAllBills(); // Refresh the list immediately
    } catch (err) {
      setMsg('❌ Failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleMarkPaid = async (billId) => {
    if(!window.confirm("Confirm cash/bank payment received?")) return;
    try {
      await API.put(`/bills/${billId}/pay`);
      fetchAllBills(); // Refresh list to show green badge
    } catch (err) {
      alert("Failed to update bill");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* 1. GENERATOR FORM */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-800">
          <Users className="text-blue-500" /> Generate Monthly Bill
        </h3>
        
        {msg && (
          <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${
            msg.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ... (Form inputs remain the same as before) ... */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Select Resident</label>
            <select 
              className="w-full p-3 border rounded-xl"
              value={formData.userId}
              onChange={(e) => setFormData({...formData, userId: e.target.value})}
              required
            >
              <option value="">-- Choose a Resident --</option>
              {residents.map(r => <option key={r.id} value={r.id}>{r.name} ({r.email})</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Amount (₹)</label>
              <input 
                type="number" placeholder="2500" 
                className="w-full p-3 border rounded-xl"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Bill Description</label>
              <input 
                type="text" placeholder="e.g. Maintenance - March 2026" 
                className="w-full p-3 border rounded-xl"
                value={formData.month}
                onChange={(e) => setFormData({...formData, month: e.target.value})}
                required
              />
            </div>
          </div>

          <div>
             <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Due Date</label>
             <input type="date" className="w-full p-3 border rounded-xl" value={formData.dueDate} onChange={(e)=>setFormData({...formData, dueDate: e.target.value})} required />
          </div>

          <button disabled={loading} className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition">
            {loading ? 'Processing...' : 'Create Bill'}
          </button>
        </form>
      </div>

      {/* 2. MASTER BILL LIST (New Feature) */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-xl font-bold mb-6 text-slate-800">Payment Records</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
              <tr>
                <th className="p-4">Resident</th>
                <th className="p-4">Description</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allBills.map((bill) => (
                <tr key={bill.id} className="hover:bg-slate-50">
                  <td className="p-4 font-medium text-slate-700">
                    {bill.User?.name || 'Unknown'}
                    <div className="text-xs text-slate-400">{bill.User?.email}</div>
                  </td>
                  <td className="p-4 text-sm">{bill.month}</td>
                  <td className="p-4 font-bold">₹{bill.amount}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold flex w-fit items-center gap-1 ${
                      bill.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {bill.status === 'paid' ? <CheckCircle size={12}/> : <Clock size={12}/>}
                      {bill.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4">
                    {bill.status === 'pending' && (
                      <button 
                        onClick={() => handleMarkPaid(bill.id)}
                        className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-green-700 transition shadow-sm"
                      >
                        Mark Paid
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {allBills.length === 0 && <p className="text-center p-6 text-slate-400">No bills generated yet.</p>}
        </div>
      </div>

    </div>
  );
};

export default AdminBills;