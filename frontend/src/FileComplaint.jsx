import React, { useState } from 'react';
import { Camera, Send, AlertCircle } from 'lucide-react';
import API from './api';

const FileComplaint = ({ onComplaintFiled }) => {
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    if (image) data.append('image', image);

    try {
      // API.js handles the token. We only need to specify the content type for files.
      await API.post('/complaints', data, {
        headers: { 
          'Content-Type': 'multipart/form-data' 
        }
      });
      alert('Complaint filed successfully!');
      setFormData({ title: '', description: '' });
      setImage(null);
      if (onComplaintFiled) onComplaintFiled();
    } catch (err) {
      alert('Failed to file complaint: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  // ... (JSX remains exactly the same)
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-800">
        <AlertCircle className="text-rose-500" /> Report an Issue
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          type="text" placeholder="Issue Title (e.g. Broken Pipe)" 
          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          required
        />
        <textarea 
          placeholder="Describe the problem..." 
          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none h-24"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
        />
        
        <label className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-slate-50 transition">
          <Camera size={20} className="text-slate-400" />
          <span className="text-sm text-slate-500">{image ? image.name : 'Upload Photo'}</span>
          <input 
            type="file" className="hidden" 
            onChange={(e) => setImage(e.target.files[0])} 
            accept="image/*"
          />
        </label>

        <button 
          disabled={loading}
          className="w-full bg-rose-600 text-white py-3 rounded-xl font-bold hover:bg-rose-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? 'Uploading...' : <><Send size={18} /> Submit Complaint</>}
        </button>
      </form>
    </div>
  );
};

export default FileComplaint;