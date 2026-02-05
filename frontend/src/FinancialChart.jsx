import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const FinancialChart = ({ stats }) => {
  // Protect against undefined stats
  const safeStats = stats || { totalCollected: 0, totalPending: 0 };
  
  const data = [
    { name: 'Collected', value: Number(safeStats.totalCollected) || 0 },
    { name: 'Pending', value: Number(safeStats.totalPending) || 0 },
  ];

  const COLORS = ['#22c55e', '#ef4444']; // Green for Money In, Red for Money Owed

  return (
    <div className="h-[350px] w-full bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
      <h4 className="font-bold text-slate-800 mb-6">Financial Overview</h4>
      <div className="flex-1 w-full min-h-0"> {/* Vital for responsiveness */}
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 12 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 12 }} 
              tickFormatter={(value) => `₹${value / 1000}k`} // Formats 25000 to ₹25k
            />
            <Tooltip 
              cursor={{ fill: '#f1f5f9' }}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={60}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FinancialChart;