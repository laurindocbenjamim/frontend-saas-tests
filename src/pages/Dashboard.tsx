import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  Package, 
  Wrench, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock
} from 'lucide-react';
import { api } from '../services/api';
import { User, Product, Service } from '../types';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({ users: 0, products: 0, services: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [users, products, services] = await Promise.all([
          api.users.getAll(),
          api.products.getAll(),
          api.services.getAll()
        ]);
        setStats({
          users: users.length,
          products: products.length,
          services: services.length
        });
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const cards = [
    { name: 'Total Users', value: stats.users, icon: Users, color: 'bg-blue-500', trend: '+12%', isUp: true },
    { name: 'Active Products', value: stats.products, icon: Package, color: 'bg-indigo-500', trend: '+5%', isUp: true },
    { name: 'Total Services', value: stats.services, icon: Wrench, color: 'bg-green-500', trend: '-2%', isUp: false },
    { name: 'Revenue Growth', value: '$24,500', icon: TrendingUp, color: 'bg-purple-500', trend: '+18%', isUp: true },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">System Dashboard</h1>
          <p className="text-gray-500 mt-1">Real-time performance analytics and core business metrics.</p>
        </div>
        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/5 shadow-sm">
           <button className="px-4 py-1.5 text-xs font-bold bg-blue-600 text-white rounded-lg shadow-lg shadow-blue-600/20">All Time</button>
           <button className="px-4 py-1.5 text-xs font-bold hover:bg-white/5 rounded-lg transition-all text-gray-500 hover:text-white">Monthly</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={card.name}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-immersive-card p-6 rounded-2xl border border-white/5 shadow-sm hover:border-white/10 transition-all group overflow-hidden relative"
          >
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full group-hover:scale-110 transition-transform"></div>
            
            <div className="flex justify-between items-start relative mb-4">
              <div className={`w-10 h-10 ${card.color.replace('500', '600/20')} rounded-xl flex items-center justify-center text-white border border-white/5 shadow-lg`}>
                <card.icon size={20} className={card.color.replace('bg-', 'text-').replace('-500', '-400')} />
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${card.isUp ? 'text-green-500' : 'text-red-500'}`}>
                {card.trend}
                {card.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              </div>
            </div>

            <div className="relative">
              <p className="text-gray-500 text-xs font-medium uppercase tracking-widest">{card.name}</p>
              <h3 className="text-2xl font-bold text-white mt-1">
                {isLoading ? '...' : card.value}
              </h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-immersive-card p-8 rounded-2xl border border-white/5 shadow-sm overflow-hidden flex flex-col h-[400px]">
           <div className="flex justify-between items-center mb-8">
              <h2 className="text-lg font-semibold">Activity Stream</h2>
              <button className="text-xs font-bold text-blue-400 hover:underline">Full Audit</button>
           </div>
           <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
              {[1, 2, 3, 4, 5].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group">
                   <div className="w-10 h-10 bg-black/20 rounded-lg flex items-center justify-center border border-white/5">
                      <Clock size={16} className="text-gray-500" />
                   </div>
                   <div className="flex-1">
                      <p className="text-sm font-semibold">User Registration</p>
                      <p className="text-xs text-gray-500">Security checkpoint: Success</p>
                   </div>
                   <span className="text-[10px] font-bold text-gray-500 uppercase">2m</span>
                </div>
              ))}
           </div>
        </div>

        <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 p-10 rounded-2xl border border-blue-500/10 flex flex-col justify-between relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full -mr-20 -mt-20 group-hover:scale-125 transition-transform duration-700"></div>
           <div className="relative">
              <h2 className="text-3xl font-bold leading-tight">Complex Filings?</h2>
              <p className="text-gray-400 mt-4 text-sm max-w-sm leading-relaxed">Our automated gateway streamlines Modelo 3 submissions with 100% compliance checks.</p>
           </div>
           <div className="relative mt-8">
              <button className="bg-blue-600 text-white px-8 py-3.5 rounded-xl font-bold text-sm shadow-xl shadow-blue-600/10 hover:bg-blue-500 transition-all active:scale-95">Start IRS Filing</button>
           </div>
        </div>
      </div>
    </div>
  );
};
