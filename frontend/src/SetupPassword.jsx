import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Lock, CheckCircle } from 'lucide-react';
import API from './api';

const SetupPassword = () => {
  const { token } = useParams(); // Gets token from URL
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFinish = async (e) => {
    e.preventDefault();
    if (password !== confirm) return alert("Passwords do not match!");
    if (password.length < 6) return alert("Password must be at least 6 characters.");

    setLoading(true);
    try {
      // Send token and new password to backend
      const response = await API.post('/users/setup-password', { 
        token: token, 
        password: password 
      });

      alert(response.data.message);
      navigate('/'); // Redirect to login
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Invalid or expired link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-2xl animate-fade-in">
        <div className="text-center mb-8">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="text-blue-600" size={30} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Setup Your Account</h2>
          <p className="text-slate-500 text-sm mt-2">Choose a secure password to activate your profile.</p>
        </div>

        <form onSubmit={handleFinish} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">New Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Confirm Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </div>

          <button 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? "Processing..." : <><CheckCircle size={20} /> Activate Account</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SetupPassword;