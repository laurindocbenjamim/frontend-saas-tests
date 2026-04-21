import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { LogIn, ArrowLeft } from 'lucide-react';
import { Button, Input } from '../components/common/UI';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    
    try {
      const data = await api.auth.login(formData);
      login(data.user);
      navigate('/dashboard');
    } catch (err) {
      setErrors({ global: 'Invalid email or password. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-immersive-bg flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/5 blur-[120px] rounded-full"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-immersive-card p-10 rounded-2xl border border-white/5 shadow-2xl relative overflow-hidden"
      >
        <Link to="/" className="inline-flex items-center text-[10px] uppercase font-black tracking-widest text-gray-500 hover:text-white mb-10 transition-colors group">
          <ArrowLeft size={14} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Welcome
        </Link>

        <div className="flex items-center gap-4 mb-12">
          <div className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
            <LogIn size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white leading-none tracking-tight">System Gateway</h1>
            <p className="text-gray-500 mt-2 text-xs font-medium italic">"Establish secure connection"</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input 
            label="Operator Identifier (Email)" 
            type="email" 
            placeholder="operator@opus.sys" 
            value={formData.email} 
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <div className="space-y-1">
             <div className="flex justify-between items-center px-0.5 mb-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Access Sequence (Password)</label>
                <button type="button" className="text-[10px] text-blue-400 font-black uppercase tracking-widest hover:underline">Revive?</button>
             </div>
             <input 
                type="password"
                placeholder="••••••••"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-mono text-sm"
             />
          </div>

          {errors.global && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
              <p className="text-[10px] text-red-500 uppercase font-black tracking-widest">{errors.global}</p>
            </div>
          )}

          <Button type="submit" className="w-full h-14 text-xs font-black uppercase tracking-[0.2em] rounded-xl mt-4" isLoading={isLoading}>
            Initiate Access Protocol
          </Button>
        </form>

        <p className="text-center text-gray-500 mt-10 text-[10px] font-black uppercase tracking-widest">
          New account? <Link to="/register" className="text-blue-400 font-black hover:underline underline-offset-4">Register Identity</Link>
        </p>
      </motion.div>
    </div>
  );
};
