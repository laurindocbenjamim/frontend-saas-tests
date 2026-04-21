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
  Building,
  CreditCard,
  MapPin,
  Globe
} from 'lucide-react';
import { Button, Input, CurrencyInput } from '../components/common/UI';
import { validateNIF, validateIBAN, formatCurrency } from '../lib/validations';
import { api } from '../services/api';

type TabType = 'ROSTO' | 'RESIDENCIA' | 'ANEXO_A' | 'ANEXO_B' | 'ANEXO_SS';

export const IRSForm: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('ROSTO');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    // Quadro 3
    nome_sp_a: '',
    nif_sp_a: '',
    incapacidade_grau_a: '0',
    incapacidade_fa_a: '',
    revisao_incapacidade_a: 'NO',
    ano_revisao_a: '',
    anterior_grau_a: '',
    anterior_ano_a: '',
    
    // Quadro 4 & 5
    estado_civil: '01',
    opt_tributacao_conjunta: 'NO',
    nome_sp_b: '',
    nif_sp_b: '',
    nif_conjuge_falecido: '',

    // Quadro 6
    dependents: [] as { nif: string; grau: string }[],
    afilhados: [] as { nif: string }[],

    // Quadro 8
    residencia_tipo: '01', // 01-Continente, 02-Açores, 03-Madeira
    pais_residencia_nao_residente: '',
    nif_representante: '',

    // Quadro 9 & 11
    iban_reembolso: '',
    autoriza_iban_at: 'NO',
    nif_consignacao: '',
    tipo_consignacao: 'IRS',

    // Anexo A
    anexoA: [] as any[],

    // Anexo B
    cod_ativid_151: '',
    cod_cae: '',
    valor_401: '0',
    valor_403: '0',
    valor_404: '0',
    valor_417: '0',
    valor_419: '0',

    // Anexo SS
    niss_titular: '',
    regime_ss: 'Simplificado',
    valor_ss_406: '0',
    entidade_contratante_unica: 'NO'
  });

  const tabs: { id: TabType; label: string; icon: any }[] = [
    { id: 'ROSTO', label: 'Rosto (Pág 1)', icon: FileText },
    { id: 'RESIDENCIA', label: 'Residência (Pág 2)', icon: MapPin },
    { id: 'ANEXO_A', label: 'Anexo A (Trabalho)', icon: Users },
    { id: 'ANEXO_B', label: 'Anexo B (Serviços)', icon: Building },
    { id: 'ANEXO_SS', label: 'Anexo SS (Seg. Social)', icon: ShieldCheck },
  ];

  const progress = useMemo(() => {
    const currentIndex = tabs.findIndex(t => t.id === activeTab);
    return ((currentIndex + 1) / tabs.length) * 100;
  }, [activeTab]);

  const addDependent = () => {
    setFormData({
      ...formData,
      dependents: [...formData.dependents, { nif: '', grau: '0' }]
    });
  };

  const addAfilhado = () => {
    setFormData({
      ...formData,
      afilhados: [...formData.afilhados, { nif: '' }]
    });
  };

  const addAnexoALine = () => {
    const newLine = {
      nif_pagadora_a: '',
      cod_rend_a: '401',
      valor_rend_a: '0',
      reten_fonte_a: '0',
      contrib_obrig_a: '0',
      quotiz_sind_a: '0'
    };
    setFormData({ ...formData, anexoA: [...formData.anexoA, newLine] });
  };

  const validateTab = () => {
    const newErrors: Record<string, string> = {};
    if (activeTab === 'ROSTO') {
      if (!validateNIF(formData.nif_sp_a)) newErrors.nif_sp_a = 'NIF Inválido (Check Digit Fail)';
      if (formData.opt_tributacao_conjunta === 'YES' && !validateNIF(formData.nif_sp_b)) {
        newErrors.nif_sp_b = 'NIF Cônjuge Inválido';
      }
    }
    if (activeTab === 'RESIDENCIA') {
      if (formData.iban_reembolso && !validateIBAN(formData.iban_reembolso)) newErrors.iban_reembolso = 'IBAN Inválido (PT50 expected)';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateTab()) {
      const idx = tabs.findIndex(t => t.id === activeTab);
      if (idx < tabs.length - 1) setActiveTab(tabs[idx + 1].id);
    }
  };

  const handleBack = () => {
    const idx = tabs.findIndex(t => t.id === activeTab);
    if (idx > 0) setActiveTab(tabs[idx - 1].id);
  };

  const handleSubmit = async () => {
    if (!validateTab()) return;
    setIsLoading(true);
    try {
      await api.irs.submit(formData);
      setIsSuccess(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 animate-in fade-in duration-700">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-immersive-surface p-6 rounded-3xl border border-white/5 shadow-2xl">
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-400 border border-blue-500/20">
            <FileText size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight leading-none uppercase italic">I-Tax Modelo 3</h1>
            <p className="text-[9px] font-black tracking-[0.3em] text-gray-500 uppercase mt-1">Autoridade Tributária • Engine v4.5.1</p>
          </div>
        </div>
        
        {/* PROGRESS LINE */}
        <div className="flex flex-1 max-w-sm flex-col items-end gap-2 px-6">
           <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)] transition-all" />
           </div>
           <div className="flex justify-between w-full text-[8px] font-black uppercase tracking-widest text-gray-600 italic">
              <span>Protocol Start</span>
              <span className="text-blue-400">Step {tabs.findIndex(t => t.id === activeTab) + 1} of 5</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        {/* VERTICAL TABS */}
        <aside className="space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all border ${
                activeTab === tab.id 
                  ? 'bg-blue-600/10 border-blue-500/30 text-blue-400 shadow-xl' 
                  : 'bg-white/2 border-white/5 text-gray-500 hover:bg-white/5 hover:text-white'
              }`}
            >
              <tab.icon size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
            </button>
          ))}
        </aside>

        {/* CONTENT AREA */}
        <main className="bg-immersive-card rounded-3xl border border-white/5 shadow-2xl relative flex flex-col min-h-[700px] overflow-hidden">
          <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-12"
              >
                {/* ROSTO - PÁG 1 */}
                {activeTab === 'ROSTO' && (
                  <div className="space-y-12">
                    {/* Quadro 3 */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                         <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded text-[9px] font-black border border-blue-500/20">QUADRO 3</span>
                         <h2 className="text-white text-xs font-black uppercase tracking-[0.2em]">Nome do Sujeito Passivo</h2>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-black/20 p-6 rounded-2xl border border-white/5">
                        <Input 
                          id="nome_sp_a"
                          name="nome_sp_a"
                          label="NOME SUJEITO PASSIVO A" 
                          placeholder="EX: LAURINDO CHITECULO" 
                          value={formData.nome_sp_a}
                          onChange={e => setFormData({...formData, nome_sp_a: e.target.value})}
                        />
                        <Input 
                          id="nif_sp_a"
                          name="nif_sp_a"
                          label="NIF SP A" 
                          placeholder="999999999" 
                          error={errors.nif_sp_a}
                          success={validateNIF(formData.nif_sp_a)}
                          value={formData.nif_sp_a}
                          onChange={e => setFormData({...formData, nif_sp_a: e.target.value.slice(0, 9)})}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-black/20 p-6 rounded-2xl border border-white/5">
                         <Input label="Grau Incapacidade (%)" id="incapacidade_grau_a" name="incapacidade_grau_a" type="number" value={formData.incapacity_grau_a} />
                         <Input label="Incapacidade (FA)" id="incapacidade_fa_a" name="incapacidade_fa_a" placeholder="N/A" />
                         <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Revisão Incapacidade?</label>
                            <div className="flex gap-4">
                               {['YES', 'NO'].map(opt => (
                                 <button key={opt} onClick={() => setFormData({...formData, revisao_incapacidade_a: opt})} className={`flex-1 py-2 text-[9px] font-black border rounded-lg transition-all ${formData.revisao_incapacidade_a === opt ? 'border-blue-500 text-blue-400 bg-blue-500/10' : 'border-white/5 text-gray-700'}`}>{opt}</button>
                               ))}
                            </div>
                         </div>
                      </div>
                    </div>

                    {/* Quadro 4 & 5 */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                       <div className="space-y-6">
                          <div className="flex items-center gap-3">
                             <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded text-[9px] font-black border border-blue-500/20">QUADRO 4</span>
                             <h2 className="text-white text-xs font-black uppercase tracking-[0.2em]">Estado Civil</h2>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                             {[
                               { id: '01', label: 'Casado' },
                               { id: '02', label: 'Unido Facto' },
                               { id: '03', label: 'Solteiro' },
                               { id: '04', label: 'Viúvo' },
                               { id: '05', label: 'Separado Facto' },
                             ].map(item => (
                               <button key={item.id} onClick={() => setFormData({...formData, estado_civil: item.id})} className={`p-3 rounded-xl border text-[9px] font-black uppercase transition-all ${formData.estado_civil === item.id ? 'border-blue-500 bg-blue-500/10 text-blue-400' : 'border-white/5 text-gray-700 hover:text-gray-400 font-bold'}`}>
                                 {item.label} <span className="opacity-30 ml-1 italic">{item.id}</span>
                               </button>
                             ))}
                          </div>
                       </div>
                       <div className="space-y-6">
                          <div className="flex items-center gap-3">
                             <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded text-[9px] font-black border border-blue-500/20">QUADRO 5</span>
                             <h2 className="text-white text-xs font-black uppercase tracking-[0.2em]">Opção Tributação</h2>
                          </div>
                          <div className="bg-black/20 p-6 rounded-2xl border border-white/5 space-y-4">
                             <p className="text-[9px] text-gray-500 uppercase tracking-widest font-black italic">Tributação Conjunta?</p>
                             <div className="flex gap-4">
                                {['YES', 'NO'].map(opt => (
                                  <button key={opt} onClick={() => setFormData({...formData, opt_tributacao_conjunta: opt})} className={`flex-1 py-3 text-[9px] font-black border rounded-xl transition-all ${formData.opt_tributacao_conjunta === opt ? 'border-blue-500 text-blue-400 bg-blue-500/10' : 'border-white/5 text-gray-700'}`}>{opt}</button>
                                ))}
                             </div>
                             {formData.opt_tributacao_conjunta === 'YES' && (
                               <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4 pt-4 border-t border-white/5">
                                 <Input label="NOME SUJEITO PASSIVO B" value={formData.nome_sp_b} onChange={e => setFormData({...formData, nome_sp_b: e.target.value})} />
                                 <Input 
                                   label="NIF SP B" 
                                   value={formData.nif_sp_b} 
                                   onChange={e => setFormData({...formData, nif_sp_b: e.target.value.slice(0,9)})} 
                                   error={errors.nif_sp_b}
                                   success={validateNIF(formData.nif_sp_b)}
                                 />
                               </motion.div>
                             )}
                          </div>
                       </div>
                    </div>

                    {/* Quadro 6 */}
                    <div className="space-y-6">
                       <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                             <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded text-[9px] font-black border border-blue-500/20">QUADRO 6</span>
                             <h2 className="text-white text-xs font-black uppercase tracking-[0.2em]">Agregado Familiar</h2>
                          </div>
                          <Button variant="outline" size="sm" onClick={addDependent} className="h-8 px-3 rounded-lg border-white/10 text-[8px] uppercase font-black tracking-widest active:scale-95">
                             <Plus size={10} className="mr-2" /> Novo Dependente
                          </Button>
                       </div>
                       <div className="overflow-x-auto border border-white/5 rounded-2xl bg-black/10">
                          <table className="w-full text-left border-collapse min-w-[500px]">
                            <thead>
                              <tr className="bg-white/2 text-[8px] font-black uppercase text-gray-500 italic">
                                <th className="px-6 py-3">DEPENDENTE</th>
                                <th className="px-6 py-3">NIF (PT9)</th>
                                <th className="px-6 py-3 text-right">GRAU (%)</th>
                                <th className="px-6 py-3 text-right">AÇÕES</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                              {formData.dependents.length === 0 ? (
                                <tr><td colSpan={4} className="px-6 py-10 text-center text-[9px] font-black text-gray-700 italic uppercase">Sem dependentes registados</td></tr>
                              ) : (
                                formData.dependents.map((dep, i) => (
                                  <tr key={i} className="hover:bg-white/2 transition-colors">
                                    <td className="px-6 py-4 text-[9px] font-black text-gray-600">D{i+1}</td>
                                    <td className="px-6 py-4">
                                      <input 
                                        name={`dep_nif_${i+1}`} 
                                        className={`bg-transparent border-none text-white text-xs font-mono outline-none transition-colors w-full ${validateNIF(dep.nif) ? 'text-green-400' : dep.nif.length === 9 ? 'text-red-400' : ''}`} 
                                        placeholder="999999999" 
                                        value={dep.nif}
                                        onChange={(e) => {
                                          const deps = [...formData.dependents];
                                          deps[i].nif = e.target.value.slice(0, 9);
                                          setFormData({...formData, dependents: deps});
                                        }}
                                      />
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                      <input 
                                        name={`dep_grau_${i+1}`} 
                                        type="number" 
                                        className="bg-transparent border-none text-white text-xs font-mono outline-none focus:text-blue-400 text-right w-16" 
                                        placeholder="0" 
                                        value={dep.grau}
                                        onChange={(e) => {
                                          const deps = [...formData.dependents];
                                          deps[i].grau = e.target.value;
                                          setFormData({...formData, dependents: deps});
                                        }}
                                      />
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                      <button onClick={() => {
                                        const deps = formData.dependents.filter((_, idx) => idx !== i);
                                        setFormData({...formData, dependents: deps});
                                      }} className="p-2 text-red-500/30 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                                    </td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                       </div>
                    </div>
                  </div>
                )}

                {/* RESIDÊNCIA - PÁG 2 */}
                {activeTab === 'RESIDENCIA' && (
                  <div className="space-y-12">
                     <div className="space-y-8">
                        <div className="flex items-center gap-3">
                           <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded text-[9px] font-black border border-blue-500/20">QUADRO 8</span>
                           <h2 className="text-white text-xs font-black uppercase tracking-[0.2em]">Residência Fiscal</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           <div className="bg-black/20 p-8 rounded-3xl border border-white/5 space-y-6">
                              <label className="text-[9px] font-black uppercase tracking-widest text-gray-600 italic">TIPO RESIDÊNCIA</label>
                              <div className="grid grid-cols-1 gap-2">
                                 {['Continente (01)', 'Açores (02)', 'Madeira (03)'].map((opt, i) => (
                                   <button key={opt} onClick={() => setFormData({...formData, residencia_tipo: `0${i+1}`})} className={`p-4 rounded-xl border text-[9px] font-black uppercase text-left flex justify-between items-center transition-all ${formData.residencia_tipo === `0${i+1}` ? 'border-blue-500 bg-blue-500/10 text-blue-400' : 'border-white/5 text-gray-700 hover:border-white/10'}`}>
                                      {opt}
                                      {formData.residencia_tipo === `0${i+1}` && <CheckCircle2 size={12} />}
                                   </button>
                                 ))}
                              </div>
                           </div>
                           <div className="space-y-6">
                              <Input id="pais_residencia_nao_residente" name="pais_residencia_nao_residente" label="País Residência (Não Residente)" placeholder="CÓDIGO PAÍS" />
                              <Input id="nif_representante" name="nif_representante" label="NIF REPRESENTANTE" placeholder="999999999" />
                           </div>
                        </div>
                     </div>

                     <div className="space-y-8">
                        <div className="flex items-center gap-3">
                           <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded text-[9px] font-black border border-blue-500/20">QUADRO 9 & 11</span>
                           <h2 className="text-white text-xs font-black uppercase tracking-[0.2em]">Reembolso e Consignação</h2>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                           <div className="bg-black/20 p-8 rounded-3xl border border-white/5 space-y-6">
                              <Input id="iban_reembolso" name="iban_reembolso" label="IBAN REEMBOLSO (PT50)" placeholder="PT50..." error={errors.iban_reembolso} value={formData.iban_reembolso} onChange={e => setFormData({...formData, iban_reembolso: e.target.value.toUpperCase()})} />
                              <div className="flex items-center gap-4 group">
                                 <input type="checkbox" id="autoriza_iban_at" name="autoriza_iban_at" className="w-4 h-4 rounded border-white/10 bg-black/40 text-blue-500" />
                                 <label htmlFor="autoriza_iban_at" className="text-[10px] text-gray-500 uppercase tracking-widest font-black group-hover:text-gray-300 transition-colors">Autoriza associação IBAN à AT?</label>
                              </div>
                           </div>
                           <div className="bg-black/20 p-8 rounded-3xl border border-white/5 space-y-6">
                              <Input id="nif_consignacao" name="nif_consignacao" label="NIF ENTIDADE BENEFICIÁRIA" placeholder="999999999" />
                              <div className="space-y-2">
                                 <label className="text-[9px] font-black uppercase text-gray-600">Tipo Consignação</label>
                                 <select id="tipo_consignacao" name="tipo_consignacao" className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-blue-500/50 transition-colors uppercase font-black">
                                    <option value="IRS">IRS</option>
                                    <option value="IVA">IVA</option>
                                    <option value="AMBOS">IRS & IVA</option>
                                 </select>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
                )}

                {/* ANEXO A */}
                {activeTab === 'ANEXO_A' && (
                  <div className="space-y-10 animate-in fade-in">
                    <div className="flex justify-between items-center">
                       <div className="flex items-center gap-3">
                          <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded text-[9px] font-black border border-blue-500/20">ANEXO A</span>
                          <h2 className="text-white text-xs font-black uppercase tracking-[0.2em]">Trabalho Dependente</h2>
                       </div>
                       <Button variant="secondary" size="sm" onClick={addAnexoALine} className="h-9 px-4 rounded-xl border border-white/10 text-[9px] uppercase font-black tracking-widest active:scale-95">
                          <Plus size={12} className="mr-2" /> Nova Linha
                       </Button>
                    </div>

                    <div className="overflow-x-auto border border-white/5 rounded-3xl bg-black/10">
                       <table className="w-full text-left border-collapse min-w-[900px]">
                         <thead>
                           <tr className="bg-white/2 text-[8px] font-black uppercase text-gray-500 italic border-b border-white/5">
                             <th className="px-6 py-4">NIF PAGADORA</th>
                             <th className="px-6 py-4">CÓDIGO</th>
                             <th className="px-6 py-4 text-right whitespace-nowrap font-mono italic">Rend. Bruto (€)</th>
                             <th className="px-6 py-4 text-right whitespace-nowrap font-mono italic">Retenção (€)</th>
                             <th className="px-6 py-4 text-right italic font-mono opacity-50">Contrib. SS (€)</th>
                             <th className="px-6 py-4 text-right">Delete</th>
                           </tr>
                         </thead>
                         <tbody className="divide-y divide-white/5">
                            {formData.anexoA.length === 0 ? (
                              <tr><td colSpan={6} className="px-10 py-12 text-center text-gray-700 italic uppercase text-[9px] font-black">Null revenue matrix. Please add records if applicable.</td></tr>
                            ) : (
                              formData.anexoA.map((row, idx) => (
                                <tr key={idx} className="hover:bg-white/2 transition-colors">
                                   <td className="px-6 py-4">
                                      <input 
                                        name="nif_pagadora_a[]" 
                                        className={`bg-transparent border-none text-white text-xs font-mono outline-none w-full ${validateNIF(row.nif_pagadora_a) ? 'text-green-400' : row.nif_pagadora_a.length === 9 ? 'text-red-400' : ''}`} 
                                        placeholder="999999999" 
                                        value={row.nif_pagadora_a}
                                        onChange={(e) => {
                                          const newArr = [...formData.anexoA];
                                          newArr[idx].nif_pagadora_a = e.target.value.slice(0, 9);
                                          setFormData({...formData, anexoA: newArr});
                                        }}
                                      />
                                   </td>
                                   <td className="px-6 py-4">
                                      <select 
                                        name="cod_rend_a[]" 
                                        className="bg-immersive-bg border border-white/10 text-[9px] font-black text-white px-3 py-1.5 rounded-lg uppercase outline-none"
                                        value={row.cod_rend_a}
                                        onChange={(e) => {
                                          const newArr = [...formData.anexoA];
                                          newArr[idx].cod_rend_a = e.target.value;
                                          setFormData({...formData, anexoA: newArr});
                                        }}
                                      >
                                         <option value="401">401</option>
                                         <option value="402">402</option>
                                      </select>
                                   </td>
                                   <td className="px-6 py-4">
                                      <input 
                                        name="valor_rend_a[]" 
                                        type="number" 
                                        className="bg-transparent border-none text-white text-xs font-mono text-right outline-none w-full" 
                                        placeholder="0.00" 
                                        value={row.valor_rend_a}
                                        onChange={(e) => {
                                          const newArr = [...formData.anexoA];
                                          newArr[idx].valor_rend_a = e.target.value;
                                          setFormData({...formData, anexoA: newArr});
                                        }}
                                      />
                                   </td>
                                   <td className="px-6 py-4">
                                      <input 
                                        name="reten_fonte_a[]" 
                                        type="number" 
                                        className="bg-transparent border-none text-white text-xs font-mono text-right outline-none w-full" 
                                        placeholder="0.00" 
                                        value={row.reten_fonte_a}
                                        onChange={(e) => {
                                          const newArr = [...formData.anexoA];
                                          newArr[idx].reten_fonte_a = e.target.value;
                                          setFormData({...formData, anexoA: newArr});
                                        }}
                                      />
                                   </td>
                                   <td className="px-6 py-4">
                                      <input 
                                        name="contrib_obrig_a[]" 
                                        type="number" 
                                        className="bg-transparent border-none text-white text-xs font-mono text-right outline-none w-full" 
                                        placeholder="0.00" 
                                        value={row.contrib_obrig_a}
                                        onChange={(e) => {
                                          const newArr = [...formData.anexoA];
                                          newArr[idx].contrib_obrig_a = e.target.value;
                                          setFormData({...formData, anexoA: newArr});
                                        }}
                                      />
                                   </td>
                                   <td className="px-6 py-4 text-right">
                                      <button onClick={() => {
                                        const newArr = formData.anexoA.filter((_, i) => i !== idx);
                                        setFormData({...formData, anexoA: newArr});
                                      }} className="p-2 text-red-500/30 hover:text-red-400 hover:bg-red-500/10 rounded-lg"><Trash2 size={14} /></button>
                                   </td>
                                </tr>
                              ))
                            )}
                         </tbody>
                       </table>
                    </div>
                  </div>
                )}

                {/* ANEXO B */}
                {activeTab === 'ANEXO_B' && (
                  <div className="space-y-12">
                     <div className="space-y-8">
                        <div className="flex items-center gap-3">
                           <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded text-[9px] font-black border border-blue-500/20">QUADRO 3</span>
                           <h2 className="text-white text-xs font-black uppercase tracking-[0.2em]">Identificação Atividade</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-black/20 p-8 rounded-3xl border border-white/5">
                           <Input id="cod_ativid_151" name="cod_ativid_151" label="CÓDIGO ATIVIDADE (ART. 151)" placeholder="EX: 1519" />
                           <Input id="cod_cae" name="cod_cae" label="CÓDIGO CAE" placeholder="EX: 86906" />
                        </div>
                     </div>

                     <div className="space-y-8">
                        <div className="flex items-center gap-3">
                           <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded text-[9px] font-black border border-blue-500/20">QUADRO 4</span>
                           <h2 className="text-white text-xs font-black uppercase tracking-[0.2em]">Rendimentos Brutos</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                           <CurrencyInput id="valor_401" name="valor_401" label="VENDAS (401)" value={formData.valor_401} onChange={val => setFormData({...formData, valor_401: val})} />
                           <CurrencyInput id="valor_403" name="valor_403" label="PROFISSIONAIS (403)" value={formData.valor_403} onChange={val => setFormData({...formData, valor_403: val})} />
                           <CurrencyInput id="valor_404" name="valor_404" label="OUTROS SERVIÇOS (404)" value={formData.valor_404} onChange={val => setFormData({...formData, valor_404: val})} />
                           <CurrencyInput id="valor_417" name="valor_417" label="ALOJAMENTO LOCAL (417)" value={formData.valor_417} onChange={val => setFormData({...formData, valor_417: val})} />
                           <CurrencyInput id="valor_419" name="valor_419" label="CRIPTOATIVOS (419)" value={formData.valor_419} onChange={val => setFormData({...formData, valor_419: val})} />
                        </div>
                     </div>
                  </div>
                )}

                {/* ANEXO SS */}
                {activeTab === 'ANEXO_SS' && (
                  <div className="space-y-12">
                     <div className="space-y-8">
                        <div className="flex items-center gap-3">
                           <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded text-[9px] font-black border border-blue-500/20">ANEXO SS</span>
                           <h2 className="text-white text-xs font-black uppercase tracking-[0.2em]">Segurança Social</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-10 bg-black/20 rounded-3xl border border-white/5">
                           <Input id="niss_titular" name="niss_titular" label="NISS (No SEGURANÇA SOCIAL)" placeholder="11222333444" />
                           <div className="space-y-2">
                              <label className="text-[9px] font-black uppercase text-gray-600">Regime</label>
                              <select id="regime_ss" name="regime_ss" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-blue-500 transition-colors font-black uppercase">
                                 <option value="Simplificado">Simplificado</option>
                                 <option value="Contabilidade">Contab. Organizada</option>
                              </select>
                           </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           <Input id="valor_ss_406" name="valor_ss_406" type="number" label="SERVIÇOS PESSOAS COLETIVAS (406)" placeholder="0.00" />
                           <div className="p-8 bg-blue-500/5 border border-blue-500/10 rounded-3xl space-y-4">
                              <p className="text-[9px] text-gray-600 uppercase tracking-widest font-black leading-relaxed">Entidade contratante única (&gt;50% rendimento)?</p>
                              <div className="flex gap-4">
                                 {['YES', 'NO'].map(opt => (
                                   <button key={opt} onClick={() => setFormData({...formData, entidade_contratante_unica: opt})} className={`flex-1 py-3 text-[9px] font-black border rounded-xl transition-all ${formData.entidade_contratante_unica === opt ? 'border-blue-500 text-blue-400 bg-blue-500/10' : 'border-white/5 text-gray-700'}`}>{opt}</button>
                                 ))}
                              </div>
                           </div>
                        </div>
                     </div>

                     {/* FINAL ACTION */}
                     <div className="p-10 bg-gradient-to-tr from-blue-600/20 to-indigo-600/10 rounded-3xl border border-blue-500/20 flex flex-col md:flex-row items-center gap-10 shadow-2xl">
                        <div className="w-20 h-20 bg-blue-600/20 rounded-full flex items-center justify-center text-blue-400 border border-blue-500/30">
                           <ShieldCheck size={40} />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                           <h4 className="text-sm font-black uppercase tracking-[0.2em] text-white">Pronto para transmissão</h4>
                           <p className="text-[10px] text-gray-500 uppercase tracking-widest leading-relaxed mt-2 italic">A submissão deste formulário estabelece um registo oficial encriptado nos servidores da Autoridade Tributária.</p>
                        </div>
                        <Button 
                          onClick={handleSubmit} 
                          isLoading={isLoading} 
                          className="h-16 px-12 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] bg-blue-600 hover:bg-blue-500 shadow-2xl active:scale-95 transition-all text-white"
                        >
                           Seal & Transmit Protocol
                        </Button>
                     </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* FOOTER NAV */}
          <div className="px-10 py-8 bg-black/40 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
             <Button variant="ghost" onClick={handleBack} disabled={activeTab === 'ROSTO'} className="text-gray-500 font-black uppercase text-[9px] tracking-widest disabled:opacity-10">
                <ChevronLeft size={16} className="mr-3" /> Step Back
             </Button>
             <div className="flex items-center gap-6">
                <div className="hidden md:flex gap-1.5 opacity-40">
                   {tabs.map((_, i) => <div key={i} className={`w-1.5 h-1.5 rounded-full ${tabs.findIndex(t => t.id === activeTab) >= i ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'bg-white/5'}`} />)}
                </div>
                {activeTab !== 'ANEXO_SS' ? (
                   <Button onClick={handleNext} className="h-12 px-10 rounded-2xl font-black uppercase text-[9px] tracking-[0.2em] bg-blue-600 text-white shadow-xl">
                      Confirm & Advance <ChevronRight size={14} className="ml-3" />
                   </Button>
                ) : (
                   <Button onClick={handleSubmit} className="h-12 px-10 rounded-2xl font-black uppercase text-[9px] tracking-[0.2em] bg-indigo-600 text-white shadow-xl opacity-60">
                      Final Review
                   </Button>
                )}
             </div>
          </div>
        </main>
      </div>

      <AnimatePresence>
        {isSuccess && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="fixed bottom-10 right-10 p-6 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center gap-4 text-green-400 shadow-2xl z-[100] backdrop-blur-xl">
             <CheckCircle2 size={24} />
             <div>
                <p className="text-xs font-black uppercase tracking-widest">Protocol Success</p>
                <p className="text-[9px] text-gray-500 mt-1">Form transmitted to AT secure nodes.</p>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
