import React, { useState, useEffect } from 'react';
import { Search, Trash2, Shield, User, MapPin, CheckCircle, Clock, Calendar } from 'lucide-react';
import API from './api';

const ManageResidents = ({ currentUser }) => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await API.get('/users');
      setUsers(data);
    } catch (err) { console.error("Error fetching directory"); }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure? This will remove the user permanently.")) return;
    try {
      await API.delete(`/users/${id}`);
      fetchUsers(); 
    } catch (err) { alert("Failed to delete user"); }
  };

  const handleRoleUpdate = async (id, currentRole) => {
    const newRole = currentRole === 'admin' ? 'resident' : 'admin';
    if(!window.confirm(`Promote this user to ${newRole.toUpperCase()}?`)) return;
    try {
      await API.put(`/users/${id}/role`, { role: newRole });
      fetchUsers();
    } catch (err) { alert("Failed to update role"); }
  };

  // Filter Logic
  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    (u.flatNumber && u.flatNumber.includes(search)) ||
    (u.wing && u.wing.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <User className="text-blue-600" /> Resident Directory
        </h2>
        <div className="relative">
          <Search className="absolute left-3 top-3 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search name, flat, or wing..." 
            className="pl-10 p-3 border rounded-xl w-64 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold border-b border-slate-100">
            <tr>
              <th className="p-4">Resident Profile</th>
              <th className="p-4">Account Status</th> {/* NEW COLUMN */}
              <th className="p-4">Location</th>
              <th className="p-4">Role</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredUsers.map(u => (
              <tr key={u.id} className="hover:bg-slate-50 transition duration-150">
                
                {/* 1. RESIDENT INFO + JOIN DATE */}
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm ${
                      u.role === 'admin' ? 'bg-purple-600' : 'bg-blue-500'
                    }`}>
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{u.name}</p>
                      <p className="text-xs text-slate-400 font-medium">{u.email}</p>
                      
                      {/* NEW: Show when they joined */}
                      <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400">
                         <Calendar size={10} />
                         Joined: {new Date(u.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </td>

                {/* 2. ACCOUNT STATUS (VERIFIED / PENDING) */}
                <td className="p-4">
                  {u.isSetup ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                      <CheckCircle size={12} /> Verified
                    </span>
                  ) : (
                    <div className="flex flex-col items-start gap-1">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200">
                        <Clock size={12} /> Pending
                      </span>
                      <span className="text-[10px] text-slate-400 pl-1">Invited via Link</span>
                    </div>
                  )}
                </td>

                {/* 3. LOCATION */}
                <td className="p-4">
                  {u.wing && u.flatNumber ? (
                    <span className="flex items-center gap-1.5 text-sm font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg w-fit border border-slate-200">
                      <MapPin size={14} className="text-slate-400" /> {u.wing} - {u.flatNumber}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400 italic">Not Assigned</span>
                  )}
                </td>

                {/* 4. ROLE */}
                <td className="p-4">
                  <span className={`text-xs font-bold px-2 py-1 rounded border flex items-center gap-1 w-fit uppercase tracking-wider ${
                    u.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}>
                    {u.role === 'admin' ? <Shield size={12}/> : <User size={12}/>}
                    {u.role}
                  </span>
                </td>

                {/* 5. ACTIONS */}
                <td className="p-4 text-right">
                  {u.id !== currentUser.id && (
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleRoleUpdate(u.id, u.role)}
                        className="text-xs bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 px-3 py-1.5 rounded-lg font-bold transition shadow-sm"
                      >
                        {u.role === 'admin' ? 'Demote' : 'Promote'}
                      </button>
                      <button 
                        onClick={() => handleDelete(u.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Remove User"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredUsers.length === 0 && (
          <div className="text-center p-12">
            <User size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-400 font-medium">No residents found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageResidents;