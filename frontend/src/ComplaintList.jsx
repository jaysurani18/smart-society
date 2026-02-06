import React, { useEffect, useState } from 'react';
import { MessageSquare, Trash2, Clock, CheckCircle, Construction, User } from 'lucide-react';
import API from './api';
import { getAuthToken } from './storage';

const ComplaintList = ({ refreshTrigger }) => {
  const [complaints, setComplaints] = useState([]);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserRole(payload.role);
      } catch (e) { console.error("Token error", e); }
    }
    fetchComplaints();
  }, [refreshTrigger]);

  const fetchComplaints = async () => {
    try {
      const { data } = await API.get('/complaints');
      setComplaints(data);
    } catch (err) { console.error("Failed to load complaints"); }
  };

  // 1. Handle Dropdown Change (Supports 3 States)
  const handleStatusChange = async (id, newStatus) => {
    try {
      await API.put(`/complaints/${id}/status`, { status: newStatus });
      fetchComplaints(); // Refresh UI
    } catch (err) { alert("Failed to update status"); }
  };

  // 2. Handle Delete
  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure you want to delete this complaint?")) return;
    try {
      await API.delete(`/complaints/${id}`);
      fetchComplaints(); // Refresh UI
    } catch (err) { alert("Failed to delete"); }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'resolved': return 'bg-green-100 text-green-700 border-green-200';
      case 'in-progress': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-800">
        <MessageSquare className="text-blue-500" /> Recent Complaints
      </h3>
      
      <div className="space-y-6">
        {complaints.length === 0 ? <p className="text-slate-400 text-center">No complaints found.</p> : (
          complaints.map((c) => (
            <div key={c.id} className="border-b border-slate-100 pb-6 last:border-0">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-bold text-slate-800 text-lg">{c.title}</h4>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                    <Clock size={12} /> {new Date(c.createdAt).toLocaleDateString()}
                    {userRole === 'admin' && c.User && (
                      <span className="flex items-center gap-1 ml-2 bg-slate-50 px-2 py-0.5 rounded">
                         <User size={10} /> {c.User.name} ({c.User.wing}-{c.User.flatNumber})
                      </span>
                    )}
                  </div>
                </div>

                {/* STATUS BADGE (Visible to Everyone) */}
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1 uppercase tracking-wider ${getStatusColor(c.status)}`}>
                    {c.status === 'resolved' ? <CheckCircle size={12}/> : c.status === 'in-progress' ? <Construction size={12}/> : <Clock size={12}/>}
                    {c.status}
                  </span>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                {/* Image */}
                {c.imageUrl && (
                  <img src={c.imageUrl} alt="Proof" className="w-24 h-24 object-cover rounded-xl border border-slate-200" />
                )}
                
                <div className="flex-1">
                   <p className="text-slate-600 text-sm italic bg-slate-50 p-3 rounded-lg border border-slate-100">
                     "{c.description}"
                   </p>
                </div>
              </div>

              {/* ADMIN CONTROLS (Dropdown + Delete) */}
              {userRole === 'admin' && (
                <div className="mt-4 pt-4 border-t border-slate-50 flex justify-end items-center gap-3">
                  <select 
                    value={c.status}
                    onChange={(e) => handleStatusChange(c.id, e.target.value)}
                    className="text-xs font-bold text-slate-600 bg-white border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 cursor-pointer hover:bg-slate-50 transition"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>

                  <button 
                    onClick={() => handleDelete(c.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Delete Complaint"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ComplaintList;