import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Receipt, 
  Bell, 
  UserPlus, 
  Wallet, 
  Users, 
  AlertTriangle, 
  TrendingUp, 
  Shield, 
  MessageSquare,
  Plus
} from 'lucide-react';
import API from './api';
import { getAuthToken, clearAuthToken } from './storage';

// Import Sub-Components
import Sidebar from './Sidebar';
import AdminBills from './AdminBills';
import FileComplaint from './FileComplaint';
import ComplaintList from './ComplaintList';
import Notices from './Notices';
import ManageResidents from './ManageResidents'; // <--- NEW IMPORT

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [bills, setBills] = useState([]);
  const [notices, setNotices] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Real-time Stats State
  const [stats, setStats] = useState({
    totalCollected: 0, 
    totalPending: 0, 
    totalResidents: 0, 
    activeIssues: 0, 
    myBalance: 0, 
    lastPayment: 0,
    lastPaymentDate: null
  });

  // Triggers for refreshing lists
  const [complaintRefresh, setComplaintRefresh] = useState(0);
  
  // Admin Invite State (Updated with Wing/Flat)
  const [inviteData, setInviteData] = useState({ 
    name: '', email: '', role: 'resident', wing: '', flatNumber: '' 
  });
  const [inviteMsg, setInviteMsg] = useState('');

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      navigate('/');
    } else {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser(payload);
        
        // FETCH ALL DATA
        fetchStats(); 
        fetchNotices();
        if (payload.role === 'resident') {
          fetchBills();
        }
      } catch (e) {
        clearAuthToken();
        navigate('/');
      }
    }
  }, [navigate]);

  // --- API CALLS ---
  const fetchStats = async () => {
    try {
      const { data } = await API.get('/stats');
      setStats(data);
    } catch (err) {
      console.warn("Stats API error");
    }
  };

  const fetchNotices = async () => {
    try {
      const { data } = await API.get('/notices');
      setNotices(data);
    } catch (err) {
      console.warn("Notice API error");
    }
  };

  const fetchBills = async () => {
    try {
      const { data } = await API.get('/bills/my-bills');
      setBills(data);
    } catch (err) {
      console.error("Error fetching bills:", err);
    }
  };

  const handlePostNotice = async () => {
    const title = prompt("Enter Notice Message (e.g., 'Water Cut Tomorrow'):");
    if (!title) return;
    try {
      await API.post('/notices', { title, type: 'alert' });
      fetchNotices(); 
    } catch (err) {
      alert("Failed to post notice");
    }
  };

  const handleLogout = () => {
    clearAuthToken();
    navigate('/');
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    setInviteMsg('');
    try {
      await API.post('/users/invite', inviteData);
      setInviteMsg('✅ Invitation Sent!');
      setInviteData({ name: '', email: '', role: 'resident', wing: '', flatNumber: '' });
    } catch (err) {
      setInviteMsg('❌ Failed: ' + (err.response?.data?.message || err.message));
    }
  };

  if (!user) return <div className="flex items-center justify-center h-screen bg-slate-900 text-white">Loading...</div>;

  // --- CONTENT RENDERER ---
  const renderContent = () => {
    switch (activeTab) {
      
      case 'dashboard':
        return (
          <div className="space-y-8 animate-fade-in">
             {/* 1. WELCOME BANNER */}
            <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl border border-slate-800">
              <div className="relative z-10">
                <h3 className="text-3xl font-bold mb-2">Society Overview</h3>
                <p className="text-slate-400">
                  {user.role === 'admin' 
                    ? `You have ₹${(stats.totalPending || 0).toLocaleString()} in pending dues.` 
                    : `Welcome back. You have ${stats.activeIssues || 0} active support tickets.`}
                </p>
              </div>
              <div className="absolute right-[-20px] bottom-[-20px] opacity-10">
                <Shield size={200} />
              </div>
            </div>

            {/* 2. KEY METRICS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {user.role === 'admin' ? (
                <>
                  <StatCard title="Total Collection" value={`₹${(stats.totalCollected || 0).toLocaleString()}`} icon={<Wallet className="text-green-500" />} trend="Lifetime" />
                  <StatCard title="Pending Dues" value={`₹${(stats.totalPending || 0).toLocaleString()}`} icon={<AlertTriangle className="text-amber-500" />} trend="Urgent" color="text-amber-600" />
                  <StatCard title="Total Residents" value={stats.totalResidents || 0} icon={<Users className="text-blue-500" />} trend="Occupancy" />
                  <StatCard title="Active Issues" value={stats.activeIssues || 0} icon={<MessageSquare className="text-rose-500" />} trend="Open Tickets" color="text-rose-600" />
                </>
              ) : (
                <>
                  <StatCard title="Your Balance" value={`₹${(stats.myBalance || 0).toLocaleString()}`} icon={<Wallet className="text-blue-500" />} trend="Outstanding" color={stats.myBalance > 0 ? "text-red-500" : "text-slate-800"} />
                  <StatCard title="Last Payment" value={`₹${(stats.lastPayment || 0).toLocaleString()}`} icon={<TrendingUp className="text-green-500" />} trend={stats.lastPaymentDate ? new Date(stats.lastPaymentDate).toLocaleDateString() : 'None'} />
                  <StatCard title="My Complaints" value={stats.activeIssues || 0} icon={<MessageSquare className="text-amber-500" />} trend="Pending" />
                  <StatCard title="Support Status" value="Online" icon={<Shield className="text-green-500" />} trend="24/7" />
                </>
              )}
            </div>

            {/* 3. URGENT ACTIONS & NOTICES */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-800 mb-6 text-lg">Urgent Action Items</h4>
                <div className="space-y-4">
                  {stats.totalPending > 0 && (
                    <ActionItem title={`Collect Pending Dues (₹${stats.totalPending.toLocaleString()})`} status="High Priority" priority="High" />
                  )}
                  {stats.activeIssues > 0 && (
                    <ActionItem title={`Resolve ${stats.activeIssues} Open Complaints`} status="Pending" priority="Medium" />
                  )}
                  {/* FIX: Only show this to ADMINS */}
                  {user.role === 'admin' && new Date().getDate() <= 5 && (
                    <ActionItem title="Generate Monthly Bills" status="Scheduled" priority="High" />
                  )}
                  {stats.totalPending === 0 && stats.activeIssues === 0 && (
                    <div className="text-slate-400 italic p-4 text-center bg-slate-50 rounded-xl">All caught up! No urgent actions.</div>
                  )}
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                    <Bell size={18} className="text-blue-500" /> Notices
                  </h4>
                  {user.role === 'admin' && (
                    <button onClick={handlePostNotice} className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-blue-700 flex items-center gap-1 transition">
                      <Plus size={14} /> Add
                    </button>
                  )}
                </div>

                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                  {notices.length === 0 ? <p className="text-slate-400 text-sm italic">No notices posted.</p> : notices.map(notice => (
                    <div key={notice.id} className={`p-4 rounded-xl border ${
                      notice.type === 'maintenance' ? 'bg-blue-50 border-blue-100' : 
                      notice.type === 'event' ? 'bg-amber-50 border-amber-100' : 'bg-red-50 border-red-100'
                    }`}>
                      <div className="flex justify-between items-start mb-1">
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${
                          notice.type === 'maintenance' ? 'text-blue-600' : 
                          notice.type === 'event' ? 'text-amber-600' : 'text-red-600'
                        }`}>
                          {notice.type}
                        </span>
                        <span className="text-[10px] text-slate-400">{new Date(notice.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-slate-700 font-medium leading-snug">{notice.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'notices-page': 
        return <Notices user={user} />;

      case 'residents': // <--- NEW PAGE
        return <ManageResidents currentUser={user} />;

      case 'complaints':
        return (
          <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
            <header className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Complaints & Issues</h2>
            </header>
            {user.role === 'resident' && (
              <FileComplaint onComplaintFiled={() => setComplaintRefresh(prev => prev + 1)} />
            )}
            <ComplaintList refreshTrigger={complaintRefresh} />
          </div>
        );

      case 'bills':
        return (
          <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-slate-800">Billing & Finances</h2>
            {user.role === 'admin' ? (
              <AdminBills />
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-bold text-slate-700">My Payment History</h3>
                </div>
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-500 text-sm uppercase">
                    <tr><th className="p-4">Description</th><th className="p-4">Amount</th><th className="p-4">Status</th></tr>
                  </thead>
                  <tbody>
                    {bills.length === 0 ? (
                      <tr><td colSpan="3" className="p-6 text-center text-slate-400">No bills found.</td></tr>
                    ) : (
                      bills.map(b => (
                        <tr key={b.id} className="border-b last:border-0 hover:bg-slate-50 transition">
                          <td className="p-4">
                            <span className="block font-bold text-slate-700">Maintenance Bill</span>
                            <span className="text-xs text-slate-500">{b.month}</span>
                          </td>
                          <td className="p-4 font-bold text-slate-700">₹{b.amount}</td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              b.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {b.status.toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );

      case 'invite': // <--- UPDATED INVITE FORM
        return (
          <div className="max-w-2xl mx-auto animate-fade-in">
             <h2 className="text-2xl font-bold text-slate-800 mb-6">Invite New Resident</h2>
             <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
               {inviteMsg && (
                 <div className={`mb-6 p-4 rounded-xl text-sm font-bold flex items-center gap-2 ${
                   inviteMsg.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                 }`}>
                   {inviteMsg}
                 </div>
               )}
               <form onSubmit={handleInvite} className="space-y-6">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm font-bold text-slate-700 mb-2">Resident Name</label>
                      <input type="text" placeholder="e.g. Rahul Sharma" className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition" value={inviteData.name} onChange={(e)=>setInviteData({...inviteData, name:e.target.value})} required/>
                    </div>
                    
                    <div className="col-span-2">
                      <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                      <input type="email" placeholder="e.g. rahul@example.com" className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition" value={inviteData.email} onChange={(e)=>setInviteData({...inviteData, email:e.target.value})} required/>
                    </div>

                    {/* NEW FIELDS FOR WING & FLAT */}
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Wing</label>
                      <input type="text" placeholder="e.g. A" className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition" value={inviteData.wing} onChange={(e)=>setInviteData({...inviteData, wing:e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Flat No.</label>
                      <input type="text" placeholder="e.g. 101" className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition" value={inviteData.flatNumber} onChange={(e)=>setInviteData({...inviteData, flatNumber:e.target.value})} />
                    </div>
                 </div>
                 <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-2">
                   <UserPlus size={20} /> Send Invitation
                 </button>
               </form>
             </div>
          </div>
        );

      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar 
        user={user} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout} 
      />
      <div className="flex-1 ml-64 overflow-y-auto h-screen scroll-smooth">
        <div className="p-8">
          <header className="mb-8 flex justify-between items-end border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 capitalize">{activeTab.replace('-', ' ')}</h2>
              <p className="text-slate-500 text-sm">Welcome back, {user.name}</p>
            </div>
            <div className="text-sm font-medium text-slate-400 bg-white px-4 py-2 rounded-full border border-slate-100 shadow-sm">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </header>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

// --- HELPER COMPONENTS ---
const StatCard = ({ title, value, icon, trend, color = "text-slate-800" }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group cursor-default">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-slate-50 rounded-xl group-hover:scale-110 transition-transform">{icon}</div>
      <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter bg-slate-50 px-2 py-1 rounded">{trend}</span>
    </div>
    <h4 className="text-slate-500 text-sm font-semibold">{title}</h4>
    <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
  </div>
);

const ActionItem = ({ title, status, priority }) => (
  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 group hover:bg-white hover:border-blue-200 hover:shadow-sm transition-all cursor-pointer">
    <div className="flex items-center gap-4">
      <div className={`w-3 h-3 rounded-full ring-2 ring-white shadow-sm ${
        priority === 'High' ? 'bg-red-500' : priority === 'Medium' ? 'bg-amber-500' : 'bg-blue-500'
      }`} />
      <span className="font-semibold text-slate-700">{title}</span>
    </div>
    <span className={`text-xs font-bold px-2 py-1 rounded border ${
      status === 'Overdue' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-slate-100 text-slate-500 border-slate-200'
    }`}>
      {status}
    </span>
  </div>
);

export default Dashboard;