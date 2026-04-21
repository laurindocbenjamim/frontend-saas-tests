import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Users, 
  Euro, 
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  Info,
  Calendar,
  CreditCard
} from 'lucide-react';
import { Button, Input } from '../components/common/UI';
import { validateNIF, validateIBAN, formatCurrency } from '../lib/validations';
import { api } from '../services/api';

type TabType = 'ROSTO' | 'ANEXO_A' | 'ANEXO_B' | 'ANEXO_SS';

interface Dependent {
  nif: string;
  birthDate: string;
  incapacity: string;
}

interface IncomeLine {
  nifPayer: string;
  code: string;
  grossValue: string;
  withholding: string;
  socialSecurity: string;
}

export const IRSForm: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('ROSTO');
  const [formData, setFormData] = useState({
    subjectA: {
      name: '',
      nif: '',
      incapacity: '0',
    },
    civilStatus: '01',
    jointTaxation: 'NO',
    subjectB: {
      name: '',
      nif: '',
      incapacity: '0',
    },
    dependents: [] as Dependent[],
    anexoA: [] as IncomeLine[],
    anexoB: {
      hasIncome: false,
      value401: '0',
      value403: '0',
    },
    anexoSS: {
      nif: '',
      ssNumber: '',
    },
    refundIban: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const tabs: { id: TabType; label: string; icon: any }[] = [
    { id: 'ROSTO', label: 'Rosto (Front)', icon: FileText },
    { id: 'ANEXO_A', label: 'Anexo A (Dependency)', icon: Users },
    { id: 'ANEXO_B', label: 'Anexo B (Simplified)', icon: Euro },
    { id: 'ANEXO_SS', label: 'Anexo SS (Social)', icon: ShieldCheck },
  ];

  const progress = useMemo(() => {
    const currentIndex = tabs.findIndex(t => t.id === activeTab);
    return ((currentIndex + 1) / tabs.length) * 100;
  }, [activeTab, tabs]);

  const validateCurrentTab = () => {
    const newErrors: Record<string, string> = {};
    if (activeTab === 'ROSTO') {
      if (!validateNIF(formData.subjectA.nif)) newErrors.nif_a = 'Invalid NIF for Subject A';
      if (formData.jointTaxation === 'YES' && !validateNIF(formData.subjectB.nif)) {
        newErrors.nif_b = 'Invalid NIF for Subject B (Joint Taxation)';
      }
    }
    if (activeTab === 'ANEXO_SS') {
      if (formData.refundIban && !validateIBAN(formData.refundIban)) {
        newErrors.iban = 'Invalid IBAN (PT50 expected)';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentTab()) {
      const currentIndex = tabs.findIndex(t => t.id === activeTab);
      if (currentIndex < tabs.length - 1) {
        setActiveTab(tabs[currentIndex + 1].id);
      }
    }
  };

  const handleBack = () => {
    const currentIndex = tabs.findIndex(t => t.id === activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1].id);
    }
  };

  const addDependent = () => {
    setFormData({
      ...formData,
      dependents: [...formData.dependents, { nif: '', birthDate: '', incapacity: '0' }]
    });
  };

  const addAnexoALine = () => {
    setFormData({
      ...formData,
      anexoA: [...formData.anexoA, { nifPayer: '', code: '401', grossValue: '0', withholding: '0', socialSecurity: '0' }]
    });
  };

  const handleSubmit = async () => {
    if (!validateCurrentTab()) return;
    setIsLoading(true);
    try {
      await api.irs.submit(formData);
      setIsSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header & Progress */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20 group hover:rotate-3 transition-transform">
             <FileText size={28} />
          </div>
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-white">
              Modelo 3 Replication
            </h1>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Autoridade Tributária e Aduaneira • Real-time State Portal</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <div className="flex items-center gap-2">
             {tabs.map((tab, i) => (
                <div key={tab.id} className="flex items-center">
                   <button 
                     onClick={() => setActiveTab(tab.id)}
                     className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${
                     activeTab === tab.id ? 'bg-blue-600 border-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.3)] text-white' : 
                     tabs.findIndex(t => t.id === activeTab) > i ? 'bg-green-500/20 border-green-500/30 text-green-400' : 'bg-white/5 border-white/10 text-gray-600 hover:text-gray-300'
                   }`}>
                      {tabs.findIndex(t => t.id === activeTab) > i ? <CheckCircle2 size={18} /> : <tab.icon size={18} />}
                   </button>
                   {i < tabs.length - 1 && <div className="w-4 h-px bg-white/10 mx-1" />}
                </div>
             ))}
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Step {tabs.findIndex(t => t.id === activeTab) + 1} of 4: {activeTab}</p>
        </div>
      </div>

      {/* Progress Bar Line */}
      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 shadow-[0_0_10px_rgba(37,99,235,0.5)]"
          transition={{ duration: 1, ease: 'circOut' }}
        />
      </div>

      <AnimatePresence>
        {isSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center gap-4 text-green-400"
          >
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30">
               <CheckCircle2 size={24} />
            </div>
            <div>
               <h4 className="text-sm font-black uppercase tracking-widest">Protocol Success</h4>
               <p className="text-xs text-gray-500 mt-1 uppercase tracking-tighter">Your IRS declaration has been encrypted and successfully transmitted to the server nodes.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form Content */}
      <div className="bg-immersive-card rounded-2xl border border-white/5 shadow-2xl relative overflow-hidden flex flex-col min-h-[650px]">
        {/* Navigation Bar (Desktop) */}
        <div className="flex border-b border-white/5 overflow-x-auto bg-black/20">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[150px] px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 border-b-2 hover:bg-white/5 ${
                activeTab === tab.id ? 'border-blue-500 text-blue-400 bg-blue-500/5' : 'border-transparent text-gray-500'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-10 flex-1 overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-12"
            >
              {activeTab === 'ROSTO' && (
                <div className="space-y-12">
                  {/* Quadro 3 */}
                  <section className="space-y-8 animate-in fade-in duration-500">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-600/10 text-blue-400 rounded-xl flex items-center justify-center font-black border border-blue-500/20 shadow-lg shadow-blue-500/10">3</div>
                      <div>
                        <h3 className="text-white font-black uppercase tracking-[0.2em] text-sm">Quadro 3: Sujeito Passivo A</h3>
                        <p className="text-[10px] text-gray-600 uppercase tracking-widest mt-1">Primary identity verification</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-8 bg-black/20 rounded-3xl border border-white/5">
                      <Input 
                        label="FULL NAME (NOME)" 
                        placeholder="EX: LAURINDO CHITECULO" 
                        value={formData.subjectA.name}
                        onChange={e => setFormData({...formData, subjectA: {...formData.subjectA, name: e.target.value}})}
                      />
                      <Input 
                        label="NIF IDENTITY" 
                        placeholder="999999999" 
                        error={errors.nif_a}
                        value={formData.subjectA.nif}
                        onChange={e => setFormData({...formData, subjectA: {...formData.subjectA, nif: e.target.value.slice(0, 9)}})}
                      />
                      <Input 
                        label="INCAPACITY (%)" 
                        type="number"
                        placeholder="0" 
                        value={formData.subjectA.incapacity}
                        onChange={e => setFormData({...formData, subjectA: {...formData.subjectA, incapacity: e.target.value}})}
                      />
                    </div>
                  </section>

                  {/* Quadro 4 */}
                  <section className="space-y-8">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-600/10 text-blue-400 rounded-xl flex items-center justify-center font-black border border-blue-500/20">4</div>
                      <h3 className="text-white font-black uppercase tracking-[0.2em] text-sm">Quadro 4: Estado Civil</h3>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                      {[
                        { id: '01', label: 'Married' },
                        { id: '02', label: 'Facto App' },
                        { id: '03', label: 'Single' },
                        { id: '04', label: 'Widow' },
                        { id: '05', label: 'Facto Sep' },
                      ].map((status) => (
                        <button
                          key={status.id}
                          onClick={() => setFormData({...formData, civilStatus: status.id})}
                          className={`p-5 rounded-2xl border transition-all relative group flex flex-col items-center gap-3 overflow-hidden ${
                            formData.civilStatus === status.id ? 'border-blue-500/40 bg-blue-500/10 text-blue-400' : 'border-white/5 bg-white/2 text-gray-500 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <div className={`w-2 h-2 rounded-full mb-1 transition-all ${formData.civilStatus === status.id ? 'bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)] scale-125' : 'bg-gray-800'}`} />
                          <span className="text-[10px] font-black uppercase tracking-widest">{status.label}</span>
                          <span className="absolute bottom-1 right-2 text-[8px] opacity-30 font-mono tracking-tighter italic">{status.id}</span>
                        </button>
                      ))}
                    </div>
                  </section>

                  {/* Quadro 5 */}
                  <section className="space-y-8">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-600/10 text-blue-400 rounded-xl flex items-center justify-center font-black border border-blue-500/20">5</div>
                      <h3 className="text-white font-black uppercase tracking-[0.2em] text-sm">Quadro 5: Tribute Protocol</h3>
                    </div>
                    <div className="bg-black/20 border border-white/5 p-10 rounded-3xl space-y-10">
                      <div className="flex items-start gap-4">
                        <Info size={18} className="text-blue-500 mt-1" />
                        <p className="text-[11px] text-gray-500 uppercase tracking-widest leading-relaxed font-medium">Opt for automated joint taxation for all aggregate income streams?</p>
                      </div>
                      <div className="flex gap-6 max-w-sm">
                        {['YES', 'NO'].map((opt) => (
                          <button
                            key={opt}
                            onClick={() => setFormData({...formData, jointTaxation: opt})}
                            className={`flex-1 py-4 rounded-xl border flex items-center justify-center gap-4 text-[11px] font-black uppercase tracking-[0.2em] transition-all relative overflow-hidden ${
                              formData.jointTaxation === opt ? 'border-blue-500/40 bg-blue-500/10 text-blue-400' : 'border-white/5 text-gray-600 hover:text-gray-400'
                            }`}
                          >
                            <span className={`w-4 h-4 rounded-full border-2 border-white/10 flex items-center justify-center transition-all ${formData.jointTaxation === opt ? 'border-blue-400' : ''}`}>
                               {formData.jointTaxation === opt && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-2 h-2 bg-blue-400 rounded-full" />}
                            </span>
                            {opt === 'YES' ? 'Sim (01)' : 'Não (02)'}
                          </button>
                        ))}
                      </div>

                      <AnimatePresence>
                        {formData.jointTaxation === 'YES' && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="pt-10 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-8"
                          >
                             <Input 
                              label="SPOUSE NAME (PASSIVO B)" 
                              placeholder="FULL IDENTITY" 
                              value={formData.subjectB.name}
                              onChange={e => setFormData({...formData, subjectB: {...formData.subjectB, name: e.target.value}})}
                             />
                             <Input 
                              label="SPOUSE NIF" 
                              placeholder="315802431" 
                              error={errors.nif_b}
                              value={formData.subjectB.nif}
                              onChange={e => setFormData({...formData, subjectB: {...formData.subjectB, nif: e.target.value.slice(0, 9)}})}
                             />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </section>

                  {/* Quadro 6 */}
                  <section className="space-y-8 pb-10">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-600/10 text-blue-400 rounded-xl flex items-center justify-center font-black border border-blue-500/20">6</div>
                        <h3 className="text-white font-black uppercase tracking-[0.2em] text-sm">Quadro 6: Family Matrix</h3>
                      </div>
                      <Button variant="outline" size="sm" onClick={addDependent} className="h-10 px-5 rounded-xl border-white/10 active:scale-95 group">
                        <Plus size={14} className="mr-2 group-hover:rotate-90 transition-transform" /> Add Dependent Entity
                      </Button>
                    </div>

                    <div className="overflow-x-auto border border-white/5 rounded-3xl bg-black/20">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-white/2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 border-b border-white/5">
                            <th className="px-10 py-5">Entity Identifer (NIF)</th>
                            <th className="px-10 py-5">Origin (Birth)</th>
                            <th className="px-10 py-5">Physical Rank (%)</th>
                            <th className="px-10 py-5 text-right italic font-medium opacity-40">Matrix Ops</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {formData.dependents.length === 0 ? (
                            <tr>
                              <td colSpan={4} className="px-10 py-20 text-center text-gray-700 italic font-medium text-xs tracking-widest uppercase">Null aggregate. Please add dependents if applicable.</td>
                            </tr>
                          ) : (
                            formData.dependents.map((dep, idx) => (
                              <tr key={idx} className="group hover:bg-white/2 transition-all">
                                <td className="px-10 py-6">
                                  <div className="relative group/field">
                                    <input 
                                      className="bg-white/5 border border-white/5 text-white text-xs outline-none focus:ring-1 focus:ring-blue-500 rounded-xl px-4 py-2 w-full font-mono tracking-tighter transition-all"
                                      placeholder="999999999"
                                      value={dep.nif}
                                      onChange={(e) => {
                                        const deps = [...formData.dependents];
                                        deps[idx].nif = e.target.value.slice(0, 9);
                                        setFormData({...formData, dependents: deps});
                                      }}
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 opacity-20"><ShieldCheck size={14} /></div>
                                  </div>
                                </td>
                                <td className="px-10 py-6">
                                  <div className="relative flex items-center">
                                    <Calendar className="absolute left-3 text-gray-600 pointer-events-none" size={14} />
                                    <input 
                                      type="date"
                                      className="bg-white/5 border border-white/5 text-white text-[11px] outline-none focus:ring-1 focus:ring-blue-500 rounded-xl pl-10 pr-4 py-2 w-full"
                                      value={dep.birthDate}
                                      onChange={(e) => {
                                        const deps = [...formData.dependents];
                                        deps[idx].birthDate = e.target.value;
                                        setFormData({...formData, dependents: deps});
                                      }}
                                    />
                                  </div>
                                </td>
                                <td className="px-10 py-6">
                                  <input 
                                    type="number"
                                    className="bg-white/5 border border-white/5 text-white font-mono text-xs outline-none focus:ring-1 focus:ring-blue-500 rounded-xl px-4 py-2 w-24 text-right"
                                    placeholder="0"
                                    value={dep.incapacity}
                                    onChange={(e) => {
                                      const deps = [...formData.dependents];
                                      deps[idx].incapacity = e.target.value;
                                      setFormData({...formData, dependents: deps});
                                    }}
                                  />
                                </td>
                                <td className="px-10 py-6 text-right">
                                  <button 
                                    onClick={() => {
                                      const deps = formData.dependents.filter((_, i) => i !== idx);
                                      setFormData({...formData, dependents: deps});
                                    }}
                                    className="p-3 text-red-500/30 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all active:scale-90"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </section>
                </div>
              )}

              {activeTab === 'ANEXO_A' && (
                <div className="space-y-12 animate-in fade-in duration-500">
                  <div className="bg-gradient-to-r from-blue-600/10 to-indigo-600/10 border border-blue-500/20 p-10 rounded-3xl flex items-start gap-8 shadow-2xl shadow-blue-500/5">
                    <div className="shrink-0 w-16 h-16 bg-blue-500/10 rounded-2xl border border-blue-500/30 flex items-center justify-center text-blue-400">
                      <CreditCard size={32} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black uppercase tracking-[0.2em] text-blue-400">Dependency Stream Protocol</h4>
                      <p className="text-[11px] text-gray-500 mt-3 leading-relaxed uppercase tracking-tighter italic font-medium">Declare national income from dependent employment & retirement pensions. Automated withholding verification enabled for certified NIFs.</p>
                      <div className="mt-6 flex gap-3">
                         <span className="px-3 py-1 bg-blue-600/10 border border-blue-500/20 rounded-md text-[9px] font-black uppercase tracking-widest text-blue-300">Auth Required</span>
                         <span className="px-3 py-1 bg-white/5 rounded-md text-[9px] font-black uppercase tracking-widest text-gray-600">State Verified</span>
                      </div>
                    </div>
                  </div>

                  <section className="space-y-8">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-600/10 text-blue-400 rounded-xl flex items-center justify-center font-black border border-blue-500/20">4</div>
                        <h3 className="text-white font-black uppercase tracking-[0.2em] text-sm">Quadro 4: Revenue Audit</h3>
                      </div>
                      <Button variant="outline" size="sm" onClick={addAnexoALine} className="h-10 px-5 rounded-xl border-white/10 active:scale-95 group">
                        <Plus size={14} className="mr-2 group-hover:scale-125 transition-transform" /> Add Revenue Cell
                      </Button>
                    </div>

                    <div className="overflow-x-auto border border-white/5 rounded-3xl bg-black/20">
                      <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                          <tr className="bg-white/2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 border-b border-white/5">
                            <th className="px-8 py-5">Source Identifer (NIF)</th>
                            <th className="px-8 py-5">Stream Code</th>
                            <th className="px-8 py-5 text-right whitespace-nowrap">Gross Stream (€)</th>
                            <th className="px-8 py-5 text-right whitespace-nowrap">Node Lock (€)</th>
                            <th className="px-8 py-5 text-right whitespace-nowrap">SS Contrib (€)</th>
                            <th className="px-8 py-5 text-right">Ops</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {formData.anexoA.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="px-10 py-32 text-center text-gray-700 italic font-medium text-xs tracking-widest uppercase">No revenue records established. Add rows to begin audit.</td>
                            </tr>
                          ) : (
                            formData.anexoA.map((line, idx) => (
                              <tr key={idx} className="group hover:bg-white/2 transition-all">
                                <td className="px-8 py-6">
                                  <input 
                                    className="bg-white/5 border border-white/5 text-white text-xs outline-none focus:ring-1 focus:ring-blue-500 rounded-xl px-4 py-2 w-full font-mono tracking-tighter"
                                    placeholder="999999999"
                                    value={line.nifPayer}
                                    onChange={(e) => {
                                      const lines = [...formData.anexoA];
                                      lines[idx].nifPayer = e.target.value.slice(0, 9);
                                      setFormData({...formData, anexoA: lines});
                                    }}
                                  />
                                </td>
                                <td className="px-8 py-6">
                                  <select 
                                    className="bg-immersive-card border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl px-4 py-2 outline-none cursor-pointer hover:border-blue-500 transition-all w-full"
                                    value={line.code}
                                    onChange={(e) => {
                                      const lines = [...formData.anexoA];
                                      lines[idx].code = e.target.value;
                                      setFormData({...formData, anexoA: lines});
                                    }}
                                  >
                                    <option value="401">Dependency (401)</option>
                                    <option value="402">Pensions (402)</option>
                                    <option value="403">External (403)</option>
                                  </select>
                                </td>
                                <td className="px-8 py-6">
                                  <input 
                                    type="number"
                                    className="bg-white/5 border border-white/5 text-white text-xs font-mono text-right outline-none focus:ring-1 focus:ring-blue-500 rounded-xl px-4 py-2 w-full"
                                    value={line.grossValue}
                                    onChange={(e) => {
                                      const lines = [...formData.anexoA];
                                      lines[idx].grossValue = e.target.value;
                                      setFormData({...formData, anexoA: lines});
                                    }}
                                  />
                                </td>
                                <td className="px-8 py-6">
                                  <input 
                                    type="number"
                                    className="bg-white/5 border border-white/5 text-white text-xs font-mono text-right outline-none focus:ring-1 focus:ring-blue-500 rounded-xl px-4 py-2 w-full"
                                    value={line.withholding}
                                    onChange={(e) => {
                                      const lines = [...formData.anexoA];
                                      lines[idx].withholding = e.target.value;
                                      setFormData({...formData, anexoA: lines});
                                    }}
                                  />
                                </td>
                                <td className="px-8 py-6">
                                  <input 
                                    type="number"
                                    className="bg-white/5 border border-white/5 text-white text-xs font-mono text-right outline-none focus:ring-1 focus:ring-blue-500 rounded-xl px-4 py-2 w-full"
                                    value={line.socialSecurity}
                                    onChange={(e) => {
                                      const lines = [...formData.anexoA];
                                      lines[idx].socialSecurity = e.target.value;
                                      setFormData({...formData, anexoA: lines});
                                    }}
                                  />
                                </td>
                                <td className="px-8 py-6 text-right">
                                  <button 
                                    onClick={() => {
                                      const lines = formData.anexoA.filter((_, i) => i !== idx);
                                      setFormData({...formData, anexoA: lines});
                                    }}
                                    className="p-3 text-red-500/30 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                        {formData.anexoA.length > 0 && (
                          <tfoot>
                            <tr className="bg-white/2 border-t border-white/5">
                               <td colSpan={2} className="px-8 py-6 text-[11px] font-black uppercase text-blue-400 tracking-[0.2em] italic">System Aggregate Total</td>
                               <td className="px-8 py-6 text-xs font-black text-white text-right font-mono italic">
                                 {formatCurrency(formData.anexoA.reduce((acc, curr) => acc + Number(curr.grossValue), 0))}
                               </td>
                               <td className="px-8 py-6 text-xs font-black text-white text-right font-mono italic opacity-60">
                                 {formatCurrency(formData.anexoA.reduce((acc, curr) => acc + Number(curr.withholding), 0))}
                               </td>
                               <td className="px-8 py-6 text-xs font-black text-white text-right font-mono italic opacity-60">
                                 {formatCurrency(formData.anexoA.reduce((acc, curr) => acc + Number(curr.socialSecurity), 0))}
                               </td>
                               <td className="px-8 py-6"></td>
                            </tr>
                          </tfoot>
                        )}
                      </table>
                    </div>
                  </section>
                </div>
              )}

              {activeTab === 'ANEXO_B' && (
                <div className="space-y-12 animate-in fade-in duration-500">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-600/10 text-blue-400 rounded-xl flex items-center justify-center font-black border border-blue-500/20">4</div>
                      <h3 className="text-white font-black uppercase tracking-[0.2em] text-sm">Quadro 4: Category B Dynamics</h3>
                   </div>
                   
                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                      <div className="bg-black/20 p-10 rounded-3xl border border-white/5 space-y-10">
                         <div className="flex flex-col gap-6">
                            <div className="flex justify-between items-end gap-10 group">
                               <div className="flex-1 space-y-2">
                                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-gray-300 transition-all leading-tight">401: Commercial Entity Sales / Product Stream</label>
                                  <div className="h-0.5 w-full bg-white/5 rounded-full overflow-hidden">
                                     <div className="h-full bg-blue-600/30 w-1/3" />
                                  </div>
                               </div>
                               <input 
                                 type="number"
                                 className="w-40 bg-white/5 border border-white/10 rounded-2xl px-6 py-3 text-sm text-right font-mono text-white focus:ring-1 focus:ring-blue-500 transition-all outline-none"
                                 value={formData.anexoB.value401}
                                 onChange={e => setFormData({...formData, anexoB: {...formData.anexoB, value401: e.target.value}})}
                               />
                            </div>

                            <div className="flex justify-between items-end gap-10 group mt-4">
                               <div className="flex-1 space-y-2">
                                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-gray-300 transition-all leading-tight">403: Professional Service Assets / IP Licensing</label>
                                  <div className="h-0.5 w-full bg-white/5 rounded-full overflow-hidden">
                                     <div className="h-full bg-indigo-600/30 w-1/2" />
                                  </div>
                               </div>
                               <input 
                                 type="number"
                                 className="w-40 bg-white/5 border border-white/10 rounded-2xl px-6 py-3 text-sm text-right font-mono text-white focus:ring-1 focus:ring-blue-500 transition-all outline-none"
                                 value={formData.anexoB.value403}
                                 onChange={e => setFormData({...formData, anexoB: {...formData.anexoB, value403: e.target.value}})}
                               />
                            </div>
                         </div>
                      </div>

                      <div className="bg-gradient-to-br from-immersive-card/50 to-blue-900/10 p-12 rounded-3xl border border-white/10 flex flex-col justify-center items-center text-center relative overflow-hidden group">
                         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                         <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-tr from-blue-600 to-indigo-600 border border-blue-500/20 flex items-center justify-center text-white mb-8 font-black text-3xl italic tracking-[0.2em] shadow-2xl shadow-blue-500/20 transition-transform group-hover:rotate-6">AT</div>
                         <h4 className="text-lg font-black uppercase tracking-[0.3em] text-white italic mb-4">Simplified Architecture</h4>
                         <p className="text-[11px] text-gray-500 leading-relaxed uppercase tracking-[0.15em] font-medium max-w-xs">Autonomous tax coefficients applied per Ministerial Protocol v4.2. Stream verification locked to portal identity.</p>
                         <div className="mt-8 flex gap-2">
                             {[1, 2, 3].map(i => <div key={i} className="w-1 h-1 bg-blue-500/40 rounded-full" />)}
                         </div>
                      </div>
                   </div>
                </div>
              )}

              {activeTab === 'ANEXO_SS' && (
                <div className="space-y-12 animate-in fade-in duration-500">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-600/10 text-blue-400 rounded-xl flex items-center justify-center font-black border border-blue-500/20">3</div>
                      <h3 className="text-white font-black uppercase tracking-[0.2em] text-sm">Quadro 3: Social Security Registry</h3>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-10 p-10 bg-black/20 rounded-3xl border border-white/5">
                      <Input 
                        label="NISS (SOCIAL SECURITY NO)" 
                        placeholder="11122233344" 
                        value={formData.anexoSS.ssNumber}
                        onChange={e => setFormData({...formData, anexoSS: {...formData.anexoSS, ssNumber: e.target.value.slice(0, 11)}})}
                      />
                      <Input 
                        label="REFUND PORTAL IBAN (PT50)" 
                        placeholder="PT50 0000 0000 0000 0000 0000 1" 
                        value={formData.refundIban}
                        onChange={e => setFormData({...formData, refundIban: e.target.value.toUpperCase()})}
                        error={errors.iban}
                      />
                   </div>

                   <div className="p-10 bg-blue-500/5 border border-blue-500/20 rounded-3xl flex flex-col md:flex-row items-center gap-10 shadow-2xl shadow-blue-600/5 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[50px] rounded-full -mr-10 -mt-10" />
                      <div className="w-20 h-20 bg-blue-600/10 rounded-full flex items-center justify-center text-blue-400 border border-blue-500/20 shadow-inner group transition-all">
                         <ShieldCheck size={40} className="group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="flex-1 text-center md:text-left">
                         <h4 className="text-lg font-black uppercase tracking-[0.2em] text-white">Final Transmission Checkpoint</h4>
                         <p className="text-[11px] text-gray-500 uppercase tracking-widest mt-2 font-medium leading-relaxed">
                            Verify all matrix inputs. Submitting this declaration establishes a binding legal record in the AT cloud nodes.
                         </p>
                      </div>
                      <Button 
                        onClick={handleSubmit}
                        isLoading={isLoading}
                        className="h-16 px-12 rounded-2xl font-black uppercase tracking-[0.25em] text-xs shadow-2xl shadow-blue-600/20 active:scale-95 bg-blue-600 hover:bg-blue-500"
                      >
                        Initiate Global Submit
                      </Button>
                   </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Footer */}
        <div className="p-8 bg-black/40 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
          <Button 
            variant="ghost" 
            onClick={handleBack} 
            disabled={activeTab === 'ROSTO'}
            className="text-gray-500 disabled:opacity-10 font-black uppercase tracking-widest text-[10px] hover:text-white"
          >
            <ChevronLeft size={16} className="mr-3" /> Protocol Step Back
          </Button>

          <div className="flex items-center gap-6">
             <div className="hidden md:flex gap-1.5">
                {tabs.map((_, i) => (
                  <div key={i} className={`w-2 h-2 rounded-full transition-all duration-500 ${tabs.findIndex(t => t.id === activeTab) >= i ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]' : 'bg-white/5'}`} />
                ))}
             </div>
             {activeTab !== 'ANEXO_SS' ? (
                <Button onClick={handleNext} className="h-14 px-12 rounded-2xl group font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-blue-600/10">
                  Verify & Next Step <ChevronRight size={16} className="ml-3 group-hover:translate-x-1 transition-transform" />
                </Button>
             ) : (
                <Button 
                  onClick={handleSubmit} 
                  isLoading={isLoading} 
                  className="h-14 px-12 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] bg-indigo-600 hover:bg-indigo-500 shadow-2xl shadow-indigo-600/10"
                >
                  Confirm Final State
                </Button>
             )}
          </div>
        </div>
      </div>

      {/* Real-time Validation Errors Summary */}
      <AnimatePresence>
        {Object.keys(errors).length > 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-6 bg-red-500/10 border border-red-500/20 rounded-3xl flex items-center gap-6"
          >
            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 border border-red-500/30">
               <AlertCircle size={24} />
            </div>
            <div>
               <h4 className="text-sm font-black uppercase tracking-widest text-red-500">Validation Protocol Deviation</h4>
               <p className="text-[10px] text-gray-500 uppercase tracking-tighter mt-1 font-medium">Identity or formatting errors detected in active matrix. Review highlighted fields above.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-center pb-20">
         <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-700 italic">Official Modelo 3 Engine v4.2.1 • AES-256 State Persistent</p>
      </div>
    </div>
  );
};
