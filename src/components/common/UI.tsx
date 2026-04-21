import React from 'react';
import { motion } from 'motion/react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  isLoading, 
  className = '', 
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-xl font-medium transition-all focus:outline-none disabled:opacity-50 disabled:pointer-events-none active:scale-95';
  
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-600/20',
    secondary: 'bg-white/5 text-gray-200 hover:bg-white/10 border border-white/10',
    outline: 'border border-white/10 bg-transparent hover:bg-white/5 text-gray-200',
    ghost: 'bg-transparent hover:bg-white/5 text-gray-400 hover:text-white',
    danger: 'bg-red-600/10 text-red-500 hover:bg-red-600/20 border border-red-500/20',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-6 py-2.5 text-sm',
    lg: 'px-8 py-3.5 text-base',
    icon: 'p-2.5',
  };

  return (
    <motion.button
      whileHover={{ scale: props.disabled ? 1 : 1.01 }}
      whileTap={{ scale: props.disabled ? 1 : 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : null}
      {children}
    </motion.button>
  );
};

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string; success?: boolean }> = ({ label, error, success, className = '', ...props }) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      {label && <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">{label}</label>}
      <div className="relative group/input">
        <input
          className={`px-4 py-2.5 bg-immersive-card border rounded-xl text-gray-200 placeholder-gray-700 focus:outline-none transition-all text-sm w-full font-medium ${
            error 
              ? 'border-red-500/50 bg-red-500/5 focus:border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.1)]' 
              : success 
                ? 'border-green-500/50 bg-green-500/5 focus:border-green-500' 
                : 'border-white/10 focus:border-blue-500/50 focus:bg-blue-500/5'
          } ${className}`}
          {...props}
        />
        {error && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
             <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
        )}
        {success && !error && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
             <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
        )}
      </div>
      {error && <p className="text-[9px] text-red-400 mt-1 ml-1 uppercase font-black italic">{error}</p>}
    </div>
  );
};

export const CurrencyInput: React.FC<Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> & { 
  label?: string; 
  error?: string; 
  value: string | number; 
  onChange: (value: string) => void 
}> = ({ label, error, value, onChange, className = '', ...props }) => {
  const [displayValue, setDisplayValue] = React.useState('');

  React.useEffect(() => {
    if (value === '' || value === undefined || value === null) {
      setDisplayValue('');
      return;
    }
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return;
    
    setDisplayValue(new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(num));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9,.-]/g, '').replace(',', '.');
    onChange(rawValue);
  };

  const handleFocus = () => {
    setDisplayValue(value.toString().replace('.', ','));
  };

  const handleBlur = () => {
    if (value === '') {
      setDisplayValue('');
      return;
    }
    const num = parseFloat(value.toString().replace(',', '.'));
    if (isNaN(num)) return;
    setDisplayValue(new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(num));
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      {label && <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">{label}</label>}
      <div className="relative">
        <input
          className={`px-4 py-2.5 bg-immersive-card border border-white/10 rounded-xl text-gray-200 placeholder-gray-700 focus:outline-none focus:border-blue-500/50 transition-all text-sm w-full font-mono text-right ${error ? 'border-red-500/50' : ''} ${className}`}
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none">
           <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 15h2a2.5 2.5 0 1 0 0-5h-4a2.5 2.5 0 1 0 0-5h2"/><path d="M12 3v2"/><path d="M12 19v2"/></svg>
        </div>
      </div>
      {error && <p className="text-[9px] text-red-400 mt-1 ml-1 uppercase font-black italic">{error}</p>}
    </div>
  );
};
