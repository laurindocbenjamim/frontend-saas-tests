import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User as UserIcon, Camera, Save, Shield, Mail, Key } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button, Input } from '../components/common/UI';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    role: user?.role || 'user'
  });
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Profile Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your personal information and security credentials.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
           <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm text-center">
              <div className="relative inline-block">
                <div className="w-32 h-32 bg-indigo-600 rounded-full flex items-center justify-center text-white text-5xl font-black shadow-2xl shadow-indigo-600/30">
                  {user?.name?.[0].toUpperCase()}
                </div>
                <button className="absolute bottom-0 right-0 p-2.5 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 hover:scale-110 active:scale-95 transition-all text-indigo-600">
                  <Camera size={20} />
                </button>
              </div>
              <h2 className="text-2xl font-black mt-6 leading-tight">{user?.name}</h2>
              <p className="text-slate-500 text-sm mt-2">{user?.email}</p>
              
              <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
                 <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                    <div className="text-left">
                       <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Account Status</p>
                       <p className="text-sm font-bold text-green-600 mt-0.5">Verified Principal</p>
                    </div>
                    <Shield size={20} className="text-green-500" />
                 </div>
              </div>
           </div>
        </div>

        <div className="lg:col-span-2">
           <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
              <form onSubmit={handleSave} className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input 
                       label="Display Name" 
                       value={formData.name} 
                       onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                    <Input 
                       label="Email Address" 
                       value={formData.email} 
                       disabled
                       className="opacity-60 cursor-not-allowed"
                    />
                 </div>

                 <div className="h-px bg-slate-100 dark:bg-slate-800 my-4"></div>

                 <div className="space-y-6">
                    <h3 className="text-lg font-black flex items-center gap-2">
                       <Key size={20} className="text-indigo-600" />
                       Security
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <Input 
                          label="New Password" 
                          type="password" 
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={e => setFormData({...formData, password: e.target.value})}
                       />
                       <Input 
                          label="Account Role" 
                          value={formData.role} 
                          disabled
                          className="opacity-60 cursor-not-allowed uppercase font-bold text-xs"
                       />
                    </div>
                 </div>

                 <div className="pt-6 flex items-center justify-between">
                    {isSuccess && (
                       <motion.p 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="text-sm font-bold text-green-600"
                       >
                          Changes saved successfully!
                       </motion.p>
                    )}
                    <Button type="submit" className="h-12 px-8 rounded-xl ml-auto">
                       <Save size={18} className="mr-2" /> Save Profile
                    </Button>
                 </div>
              </form>
           </div>
        </div>
      </div>
    </div>
  );
};
