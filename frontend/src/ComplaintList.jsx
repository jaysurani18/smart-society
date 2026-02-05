import React, { useEffect, useState } from 'react';
import { MessageSquare, CheckCircle, Clock, Check, RefreshCw } from 'lucide-react';
import API from './api';
import { getAuthToken } from './storage';

const ComplaintList = ({ refreshTrigger }) => {
  const [complaints, setComplaints] = useState([]);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    // 1. Check if user is Admin
    const token = getAuthToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserRole(payload.role);
      } catch (e) {
        console.error("Token parse error", e);
      }
    }
    fetchComplaints();
  }, [refreshTrigger]);

  const fetchComplaints = async () => {
    try {
      const { data } = await API.get('/complaints');
      setComplaints(data);
    } catch (err) {
      console.error("Failed to load complaints");
    }
  };

  // 2. Handle Status Toggle
  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'pending' ? 'resolved' : 'pending';
    try {
      await API.put(`/complaints/${id}/status`, { status: newStatus });
      fetchComplaints(); // Refresh list immediately
    } catch (err) {
      alert("Failed to update status: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-800">
        <MessageSquare className="text-blue-500" /> Recent Complaints
      </h3>
      
      <div className="space-y-6">
        {complaints.length === 0 ? (
          <p className="text-slate-400 text-center py-4">No complaints found.</p>
        ) : (
          complaints.map((c) => (
            <div key={c.id} className="border-b border-slate-100 pb-6 last:border-0 last:pb-0">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-bold text-slate-700">{c.title}</h4>
                  <p className="text-xs text-slate-400">
                    Filed on: {new Date(c.createdAt).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="flex flex-col items-end gap-2">
                  {/* Status Badge */}
                  <span className={`px-2 py-1 rounded text-xs font-bold flex items-center gap-1 ${
                    c.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {c.status === 'resolved' ? <CheckCircle size={12}/> : <Clock size={12}/>}
                    {c.status.toUpperCase()}
                  </span>

                  {/* ADMIN ACTION BUTTON - Only visible to Admins */}
                  {userRole === 'admin' && (
                    <button 
                      onClick={() => handleToggleStatus(c.id, c.status)}
                      className={`text-xs flex items-center gap-1 px-3 py-1 rounded-lg border transition duration-200 ${
                        c.status === 'pending' 
                        ? 'border-green-500 text-green-600 hover:bg-green-50' 
                        : 'border-slate-300 text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      {c.status === 'pending' ? <Check size={14} /> : <RefreshCw size={12} />}
                      {c.status === 'pending' ? 'Mark Resolved' : 'Re-open'}
                    </button>
                  )}
                </div>
              </div>

              <p className="text-sm text-slate-500 mb-3 italic">"{c.description}"</p>
              
              {c.imageUrl && (
                <div className="mt-2">
                  <img 
                    src={c.imageUrl} 
                    alt="Proof" 
                    className="w-full h-48 object-cover rounded-xl border border-slate-200 shadow-sm"
                  />
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