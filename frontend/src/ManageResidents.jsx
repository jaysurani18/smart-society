import React, { useState, useEffect } from 'react';
import { Search, Trash2, Shield, User, MapPin } from 'lucide-react';
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
      fetchUsers(); // Refresh list
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
          <Users className="text-blue-600" /> Resident Directory
        </h2>
        <div className="relative">
          <Search className="absolute left-3 top-3 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, flat, or wing..." 
            className="pl-10 p-3 border rounded-xl w-64 focus:ring-2 focus:ring-blue-500 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
            <tr>
              <th className="p-4">Resident Info</th>
              <th className="p-4">Location</th>
              <th className="p-4">Role</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredUsers.map(u => (
              <tr key={u.id} className="hover:bg-slate-50 transition">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                      {u.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-700">{u.name}</p>
                      <p className="text-xs text-slate-400">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  {u.wing && u.flatNumber ? (
                    <span className="flex items-center gap-1 text-sm font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded w-fit">
                      <MapPin size={14} /> {u.wing}-{u.flatNumber}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400 italic">Not Assigned</span>
                  )}
                </td>
                <td className="p-4">
                  <span className={`text-xs font-bold px-2 py-1 rounded border flex items-center gap-1 w-fit ${
                    u.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}>
                    {u.role === 'admin' ? <Shield size={12}/> : <User size={12}/>}
                    {u.role.toUpperCase()}
                  </span>
                </td>
                <td className="p-4 text-right flex justify-end gap-2">
                  {/* Prevent deleting yourself */}
                  {u.id !== currentUser.id && (
                    <>
                      <button 
                        onClick={() => handleRoleUpdate(u.id, u.role)}
                        className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-lg font-bold transition"
                      >
                        {u.role === 'admin' ? 'Demote' : 'Make Admin'}
                      </button>
                      <button 
                        onClick={() => handleDelete(u.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Remove User"
                      >
                        <Trash2 size={18} />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredUsers.length === 0 && <p className="text-center p-8 text-slate-400">No users found.</p>}
      </div>
    </div>
  );
};
import { Users } from 'lucide-react'; // Ensure icon import
export default ManageResidents;