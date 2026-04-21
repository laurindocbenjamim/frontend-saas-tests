import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users as UsersIcon, 
  Search, 
  MoreVertical, 
  Plus, 
  Mail, 
  Shield, 
  User as UserIcon, 
  X, 
  ShieldCheck, 
  Lock,
  Loader2,
  Edit2,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';
import { User } from '../types';
import { Button, Input } from '../components/common/UI';

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Editor' as User['role']
  });

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await api.users.getAll();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const resetForm = () => {
    setNewUserData({ name: '', email: '', password: '', role: 'Editor' });
    setEditingUser(null);
    setErrorMessage('');
    setIsProvisioning(false);
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setNewUserData({
      name: user.name,
      email: user.email,
      password: user.password || '',
      role: user.role
    });
    setIsProvisioning(true);
  };

  const handleCreateOrUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      if (editingUser) {
        await api.users.update(editingUser.id, newUserData);
      } else {
        await api.users.create(newUserData);
      }
      resetForm();
      fetchUsers();
    } catch (err: any) {
      setErrorMessage(err.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to decommission this identity?')) return;
    try {
      await api.users.delete(id);
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert('Delete failed');
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight leading-none uppercase italic">Identity Nodes</h1>
          <p className="text-[10px] uppercase font-black tracking-widest text-gray-600 mt-2">Manage system administrators and identity permissions.</p>
        </div>
        <Button onClick={() => setIsProvisioning(true)} className="h-12 px-8 rounded-2xl bg-blue-600 text-white font-black uppercase text-[10px] tracking-[0.2em] shadow-xl hover:bg-blue-500 active:scale-95 transition-all">
          <Plus size={16} className="mr-3" /> Provision New User
        </Button>
      </div>

      <AnimatePresence>
        {isProvisioning && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsProvisioning(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="relative w-full max-w-lg bg-immersive-surface rounded-[40px] border border-white/5 shadow-2xl p-10 overflow-hidden"
            >
              {/* MODAL DECOR */}
              <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                 <Shield size={120} />
              </div>

              <div className="flex justify-between items-start mb-10">
                <div className="flex items-center gap-5">
                   <div className="w-12 h-12 bg-blue-600/20 rounded-2xl flex items-center justify-center text-blue-400 border border-blue-500/20">
                      {editingUser ? <Edit2 size={24} /> : <UserIcon size={24} />}
                   </div>
                   <div>
                      <h2 className="text-2xl font-black text-white uppercase italic leading-none">
                        {editingUser ? 'Sync Identity' : 'New Identity'}
                      </h2>
                      <p className="text-[9px] font-black tracking-[0.3em] text-gray-500 uppercase mt-1">
                        {editingUser ? 'Updating existing node' : 'Provisioning Protocol v1.4'}
                      </p>
                   </div>
                </div>
                <button 
                  onClick={resetForm}
                  className="p-3 text-gray-600 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {errorMessage && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400">
                  <AlertCircle size={16} />
                  <p className="text-[10px] font-black uppercase tracking-widest">{errorMessage}</p>
                </div>
              )}

              <form onSubmit={handleCreateOrUpdateUser} className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <Input 
                    label="Display Name" 
                    placeholder="Enter full identity..." 
                    required
                    value={newUserData.name}
                    onChange={e => setNewUserData({...newUserData, name: e.target.value})}
                  />
                  <Input 
                    label="Network Email" 
                    type="email" 
                    placeholder="name@system.matrix" 
                    required
                    value={newUserData.email}
                    onChange={e => setNewUserData({...newUserData, email: e.target.value})}
                  />
                  <div className="grid grid-cols-2 gap-6">
                    <Input 
                      label="Security Key" 
                      type="password" 
                      placeholder="••••••••" 
                      required
                      value={newUserData.password}
                      onChange={e => setNewUserData({...newUserData, password: e.target.value})}
                    />
                    <div className="flex flex-col gap-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Access Level</label>
                       <select 
                         value={newUserData.role}
                         onChange={e => setNewUserData({...newUserData, role: e.target.value as User['role']})}
                         className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-xs text-white uppercase font-black tracking-widest outline-none focus:border-blue-500/50 transition-all cursor-pointer"
                       >
                          <option value="Admin">Admin (Full)</option>
                          <option value="Editor">Editor (Normal)</option>
                          <option value="Viewer">Viewer (Read Only)</option>
                       </select>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-10">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    className="flex-1 h-14 rounded-2xl font-black uppercase text-[10px] tracking-widest text-gray-500"
                    onClick={() => setIsProvisioning(false)}
                  >
                    Abort
                  </Button>
                  <Button 
                    type="submit" 
                    isLoading={isSubmitting}
                    className="flex-[2] h-14 rounded-2xl bg-blue-600 text-white font-black uppercase text-[10px] tracking-widest shadow-2xl active:scale-95 transition-all"
                  >
                    {editingUser ? 'Sync Changes' : 'Inaugurate Identity'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleOpenEdit(user)}
                          className="p-2 rounded-lg hover:bg-white/10 text-blue-400 transition-all"
                          title="Modify Node"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 rounded-lg hover:bg-red-500/10 text-red-400 transition-all"
                          title="Decommission Node"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
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
