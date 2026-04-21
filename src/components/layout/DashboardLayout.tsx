import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  Wrench, 
  FileText, 
  ShieldCheck,
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  User as UserIcon,
  Search,
  Bell,
  Sun,
  Moon,
  Zap,
  Activity
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'motion/react';

const Tooltip: React.FC<{ text: string; children: React.ReactNode; enabled: boolean }> = ({ text, children, enabled }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative flex items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      <AnimatePresence>
        {enabled && isHovered && (
          <motion.div 
            initial={{ opacity: 0, x: -10, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -10, scale: 0.95 }}
            className="absolute left-full ml-4 px-3 py-1.5 bg-immersive-card border border-white/10 rounded-lg shadow-2xl text-[10px] font-black uppercase tracking-widest text-blue-400 whitespace-nowrap pointer-events-none z-[100] flex items-center gap-2"
          >
            <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-immersive-card border-l border-b border-white/10 rotate-45"></div>
            {text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const { user, logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { name: 'System Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Identity Matrix', path: '/users', icon: Users },
    { name: 'Audit Stream', path: '/logs', icon: Activity },
    { name: 'Asset Catalog', path: '/products', icon: Package },
    { name: 'Protocol Ops', path: '/services', icon: Wrench },
    { name: 'Modelo 3 Portal', path: '/irs-form', icon: ShieldCheck },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-immersive-bg text-gray-200 transition-colors">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarCollapsed ? '72px' : '260px' }}
        className="relative bg-immersive-surface border-r border-white/10 flex flex-col z-50 shrink-0"
      >
        <div className="p-6 flex items-center justify-between overflow-hidden">
          <AnimatePresence mode="wait">
            {!isSidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-3 font-bold"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <span className="text-white">O</span>
                </div>
                <span className="text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Opus</span>
              </motion.div>
            )}
            {isSidebarCollapsed && (
               <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full flex justify-center"
               >
                 <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                   <span className="text-white text-xs">O</span>
                 </div>
               </motion.div>
            )}
          </AnimatePresence>
        </div>

        <nav className="flex-1 mt-6 px-3 space-y-4 overflow-y-auto overflow-x-hidden custom-scrollbar">
          {navItems.map((item) => (
            <Tooltip key={item.path} text={item.name} enabled={isSidebarCollapsed}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-4 p-3 rounded-xl transition-all w-full ${
                    isActive
                      ? 'bg-blue-600/10 text-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.1)]'
                      : 'text-gray-500 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                <item.icon size={22} className="shrink-0" />
                {!isSidebarCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="whitespace-nowrap font-bold text-[10px] uppercase tracking-widest"
                  >
                    {item.name}
                  </motion.span>
                )}
              </NavLink>
            </Tooltip>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <Tooltip text={isSidebarCollapsed ? "Expand Terminal" : "Collapse Terminal"} enabled={true}>
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-white/5 text-gray-500 transition-colors"
            >
              {isSidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          </Tooltip>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Navbar */}
        <header className="h-16 px-8 bg-immersive-surface/50 backdrop-blur-sm border-b border-white/10 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4 flex-1">
             <div className="relative group max-w-md w-full hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input 
                  type="text" 
                  placeholder="System Search..." 
                  className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/5 rounded-xl focus:ring-1 focus:ring-blue-500 outline-none transition-all text-xs"
                />
             </div>
          </div>

          <div className="flex items-center gap-2 md:gap-6">
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-xl hover:bg-white/5 text-gray-500 hover:text-white transition-colors"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            
            <button className="p-2 rounded-xl hover:bg-white/5 text-gray-500 hover:text-white transition-colors relative">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-immersive-surface"></span>
            </button>

            <div className="relative h-8 w-px bg-white/10 mx-2 hidden md:block"></div>

            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 p-1 rounded-xl hover:bg-white/5 transition-all active:scale-95 group"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium leading-none">{user?.name || 'Alex Rivera'}</p>
                  <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-tighter">{user?.role || 'Administrator'}</p>
                </div>
                <div className="w-10 h-10 rounded-full border border-blue-500/30 p-0.5 group-hover:border-blue-500 transition-colors">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Alex'}`} className="w-full h-full rounded-full" alt="Profile" />
                </div>
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-56 bg-immersive-card border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 p-2"
                    >
                      <button 
                        onClick={() => { navigate('/profile'); setIsProfileOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-white/5 text-gray-300 transition-all text-sm font-medium"
                      >
                        <UserIcon size={16} className="text-blue-400" />
                        Profile Settings
                      </button>
                      <div className="my-1 border-t border-white/5 mx-2"></div>
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-red-500/10 text-red-400 transition-all text-sm font-medium"
                      >
                        <LogOut size={16} />
                        Logout Session
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 custom-scrollbar relative">
          {/* Subtle page-load background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 blur-[120px] rounded-full -z-10 pointer-events-none"></div>
          {children}
        </main>
      </div>
    </div>
  );
};
