import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { UserPlus, ArrowLeft } from 'lucide-react';
import { Button, Input } from '../components/common/UI';
import { api } from '../services/api';

export const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors: any = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      await api.users.create({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'user'
      });
      navigate('/login');
    } catch (err: any) {
      setErrors({ global: err.message || 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-100/50 via-transparent to-transparent">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl shadow-indigo-600/10 border border-slate-200 dark:border-slate-800 p-10 overflow-hidden relative"
      >
        <Link to="/" className="inline-flex items-center text-sm text-slate-500 hover:text-indigo-600 mb-8 transition-colors">
          <ArrowLeft size={16} className="mr-2" /> Back to Welcome
        </Link>

        <div className="flex items-center gap-4 mb-10">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
            <UserPlus size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white leading-none">Register</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">Create your professional account.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input 
            label="Full Name" 
            placeholder="John Doe" 
            value={formData.name} 
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
          />
          <Input 
            label="Email Address" 
            type="email" 
            placeholder="name@company.com" 
            value={formData.email} 
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={errors.email}
          />
          <Input 
            label="Password" 
            type="password" 
            placeholder="••••••••" 
            value={formData.password} 
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            error={errors.password}
          />
          <Input 
            label="Confirm Password" 
            type="password" 
            placeholder="••••••••" 
            value={formData.confirmPassword} 
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            error={errors.confirmPassword}
          />

          {errors.global && <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg text-center font-medium">{errors.global}</p>}

          <Button type="submit" className="w-full h-12 text-base rounded-xl mt-4" isLoading={isLoading}>
            Create Account
          </Button>
        </form>

        <p className="text-center text-slate-500 dark:text-slate-400 mt-10 text-sm">
          Already have an account? <Link to="/login" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline underline-offset-4">Sign In</Link>
        </p>
      </motion.div>
    </div>
  );
};
