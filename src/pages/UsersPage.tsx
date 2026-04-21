import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Users as UsersIcon, Search, MoreVertical, Plus, Mail, Shield, User as UserIcon } from 'lucide-react';
import { api } from '../services/api';
import { User } from '../types';
import { Button } from '../components/common/UI';

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await api.users.getAll();
        setUsers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Access Control</h1>
          <p className="text-gray-500 mt-1">Manage system administrators and identity permissions.</p>
        </div>
        <Button className="h-12 px-6 rounded-xl">
          <Plus size={20} className="mr-2" /> Provision New User
        </Button>
      </div>

      <div className="bg-immersive-card rounded-2xl border border-white/5 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Filter by credentials..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/5 rounded-xl outline-none focus:ring-1 focus:ring-blue-500/50 transition-all text-xs"
            />
          </div>
          <div className="flex items-center gap-2">
             <button className="px-4 py-1.5 text-[10px] font-black uppercase tracking-widest bg-white/5 rounded-lg hover:bg-white/10 transition-all">All Roles</button>
             <button className="px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-all">Verified Only</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/2 text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] border-b border-white/5">
                <th className="px-8 py-4 font-medium italic">Identity</th>
                <th className="px-8 py-4 font-medium italic">Privilege</th>
                <th className="px-8 py-4 font-medium italic">Network Status</th>
                <th className="px-8 py-4 font-medium italic">Creation Date</th>
                <th className="px-8 py-4 font-medium text-right italic">Options</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                [1,2,3].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-8 py-6 h-20 bg-white/2"></td>
                  </tr>
                ))
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-gray-600 font-medium italic">No matches found in system database.</td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-white/5 transition-all group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 border border-blue-500/30 p-0.5 rounded-full group-hover:scale-110 group-hover:border-blue-500 transition-all">
                          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} className="w-full h-full rounded-full" alt="User" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white leading-tight">{user.name}</p>
                          <div className="flex items-center gap-1.5 text-gray-500 mt-1">
                            <Mail size={12} className="text-blue-400/50" />
                            <p className="text-[10px] uppercase font-mono tracking-tighter">{user.email}</p>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 text-[9px] font-black uppercase tracking-widest border border-blue-500/20">
                        <Shield size={10} />
                        {user.role}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       <span className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Stable</span>
                       </span>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-[10px] font-mono text-gray-500">2026-04-21</p>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="p-2 rounded-lg hover:bg-white/10 transition-all">
                        <MoreVertical size={16} className="text-gray-600" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-6 bg-black/20 border-t border-white/5 flex items-center justify-between">
           <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">Sync: {filteredUsers.length} records</p>
           <div className="flex items-center gap-1">
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/5 text-gray-600 bg-white/2 disabled:opacity-30" disabled>1</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/5 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 transition-all text-xs font-bold">2</button>
           </div>
        </div>
      </div>
    </div>
  );
};
