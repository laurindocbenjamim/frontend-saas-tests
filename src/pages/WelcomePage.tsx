import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Shield, Zap, Globe, ArrowRight } from 'lucide-react';
import { Button } from '../components/common/UI';

export const WelcomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-immersive-bg flex flex-col items-center justify-center p-6 text-center overflow-hidden relative">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[130px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[130px] rounded-full"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl w-full"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black uppercase tracking-[0.2em] mb-10">
          <Zap size={14} />
          <span>System v2.0 Operational</span>
        </div>

        <h1 className="text-5xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter mb-10">
          DESIGNED FOR <br/>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-white to-purple-400">PRECISION</span>
        </h1>

        <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
          The all-in-one immersive portal for tax management and resource orchestration. Precision-engineered for high-stakes environments.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link to="/register" className="w-full sm:w-auto">
            <Button size="lg" className="w-full h-16 px-10 text-lg rounded-2xl group active:scale-95 shadow-2xl shadow-blue-600/20">
              Initiate Onboarding <ArrowRight size={20} className="ml-3 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link to="/login" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full h-16 px-10 text-lg rounded-2xl active:scale-95">
              Portal Access
            </Button>
          </Link>
        </div>

        <div className="mt-28 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-immersive-card rounded-2xl border border-white/5 text-left hover:border-blue-500/30 transition-all group">
            <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-blue-500/20">
              <Shield size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Encrypted Core</h3>
            <p className="text-gray-500 text-sm leading-relaxed">Advanced AES-256 state encryption ensuring records remain private and immutable.</p>
          </div>
          <div className="p-8 bg-immersive-card rounded-2xl border border-white/5 text-left hover:border-blue-500/30 transition-all group">
            <div className="w-12 h-12 bg-purple-500/10 text-purple-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-purple-500/20">
              <Zap size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Quantum Throughput</h3>
            <p className="text-gray-500 text-sm leading-relaxed">Optimized gateway handling complex IRS Modelo 3 signatures in near real-time.</p>
          </div>
          <div className="p-8 bg-immersive-card rounded-2xl border border-white/5 text-left hover:border-blue-500/30 transition-all group">
            <div className="w-12 h-12 bg-green-500/10 text-green-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-green-500/20">
              <Globe size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Global Sync</h3>
            <p className="text-gray-500 text-sm leading-relaxed">Fully synchronized across desktop and mobile nodes with unified state management.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
