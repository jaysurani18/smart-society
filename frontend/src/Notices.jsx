import React, { useState, useEffect } from 'react';
import { Bell, Trash2, Plus, AlertTriangle, Info, Calendar } from 'lucide-react';
import API from './api';

const Notices = ({ user }) => {
  const [notices, setNotices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', type: 'alert' });

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const { data } = await API.get('/notices');
      setNotices(data);
    } catch (err) { console.error("Error loading notices"); }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure you want to remove this notice?")) return;
    try {
      await API.delete(`/notices/${id}`);
      fetchNotices();
    } catch (err) { alert("Failed to delete"); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/notices', formData);
      setShowForm(false);
      setFormData({ title: '', description: '', type: 'alert' });
      fetchNotices();
    } catch (err) { alert("Failed to post notice"); }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Bell className="text-blue-600" /> Community Notices
        </h2>
        
        {user.role === 'admin' && (
          <button 
            onClick={() => setShowForm(!showForm)} 
            className="bg-slate-900 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 transition"
          >
            {showForm ? 'Cancel' : <><Plus size={18} /> New Notice</>}
          </button>
        )}
      </div>

      {/* CREATE FORM (Admin Only) */}
      {showForm && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-lg mb-4">Post New Announcement</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-500 mb-1">Title</label>
                <input 
                  type="text" required 
                  className="w-full p-3 border rounded-xl"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g. Water Supply Interruption"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-500 mb-1">Type</label>
                <select 
                  className="w-full p-3 border rounded-xl bg-white"
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value})}
                >
                  <option value="alert">🚨 High Alert</option>
                  <option value="maintenance">🛠 Maintenance</option>
                  <option value="event">🎉 Event</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-500 mb-1">Description (Optional)</label>
              <textarea 
                className="w-full p-3 border rounded-xl h-24"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                placeholder="Provide detailed information..."
              />
            </div>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700">
              Post Notice
            </button>
          </form>
        </div>
      )}

      {/* NOTICE LIST */}
      <div className="grid gap-4">
        {notices.map((notice) => (
          <div key={notice.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="flex justify-between items-start">
              <div className="flex gap-4">
                <div className={`p-3 rounded-xl h-fit ${
                  notice.type === 'alert' ? 'bg-red-100 text-red-600' : 
                  notice.type === 'maintenance' ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600'
                }`}>
                  {notice.type === 'alert' ? <AlertTriangle size={24}/> : 
                   notice.type === 'maintenance' ? <Info size={24}/> : <Calendar size={24}/>}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${
                      notice.type === 'alert' ? 'bg-red-50 text-red-600' : 
                      notice.type === 'maintenance' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {notice.type}
                    </span>
                    <span className="text-xs text-slate-400">{new Date(notice.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">{notice.title}</h3>
                  <p className="text-slate-600 mt-2 leading-relaxed">{notice.description}</p>
                </div>
              </div>

              {user.role === 'admin' && (
                <button 
                  onClick={() => handleDelete(notice.id)}
                  className="text-slate-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-lg transition"
                  title="Delete Notice"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          </div>
        ))}
        {notices.length === 0 && <p className="text-center text-slate-400 py-10">No notices found.</p>}
      </div>
    </div>
  );
};

export default Notices;