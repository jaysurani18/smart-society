import React from 'react';
import {
  Home,
  Users,
  Receipt,
  MessageSquare,
  LogOut,
  Shield,
  User,
  UserPlus,
  Bell // <--- Fixed: Added Bell import
} from 'lucide-react';

const Sidebar = ({ user, activeTab, setActiveTab, onLogout }) => {
  return (
    <aside className="w-64 bg-slate-900 text-white h-screen flex flex-col fixed left-0 top-0 shadow-2xl z-50">
      {/* 1. Logo Section */}
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-lg">
          <Shield size={24} className="text-white" />
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-wide">AutoCraft</h1>
          <p className="text-xs text-slate-400">Society Manager</p>
        </div>
      </div>

      {/* 2. Navigation Links */}
      <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">

        <div className="px-3 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Overview
        </div>

        <NavItem
          icon={<Home size={20} />}
          label="Dashboard"
          id="dashboard"
          activeTab={activeTab}
          onClick={setActiveTab}
        />

        <NavItem
          icon={<Bell size={20} />}
          label="Notices"
          id="notices-page"
          activeTab={activeTab}
          onClick={setActiveTab}
        />

        <NavItem
          icon={<MessageSquare size={20} />}
          label="Complaints"
          id="complaints"
          activeTab={activeTab}
          onClick={setActiveTab}
        />

        {/* ADMIN ONLY LINKS */}
        {user.role === 'admin' && (
          <>
            <div className="px-3 mt-6 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Admin Controls
            </div>
            <NavItem
              icon={<UserPlus size={20} />}
              label="Invite Residents"
              id="invite"
              activeTab={activeTab}
              onClick={setActiveTab}
            />
            <NavItem
              icon={<Receipt size={20} />}
              label="Billing System"
              id="bills"
              activeTab={activeTab}
              onClick={setActiveTab}
            />
            <NavItem
              icon={<Users size={20} />}
              label="Directory"
              id="residents"
              activeTab={activeTab}
              onClick={setActiveTab}
            />
          </>
        )}

        {/* RESIDENT ONLY LINKS */}
        {user.role === 'resident' && (
          <>
            <div className="px-3 mt-6 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Resident Menu
            </div>
            <NavItem
              icon={<Receipt size={20} />}
              label="My Bills"
              id="bills"
              activeTab={activeTab}
              onClick={setActiveTab}
            />
          </>
        )}
      </nav>

      {/* 3. User Profile & Logout */}
      <div className="p-4 border-t border-slate-800 bg-slate-950">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-blue-400">
            <User size={20} />
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold truncate">{user.name}</p>
            <p className="text-xs text-slate-500 truncate capitalize">{user.role}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white py-2 rounded-lg transition-all duration-300 text-sm font-medium"
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </aside>
  );
};

// Helper Component for Menu Items
const NavItem = ({ icon, label, id, activeTab, onClick }) => (
  <button
    onClick={() => onClick(id)}
    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${activeTab === id
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
      }`}
  >
    {icon}
    <span className="text-sm font-medium">{label}</span>
  </button>
);

export default Sidebar;