import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Wrench, Search, Plus, Clock, DollarSign, Activity } from 'lucide-react';
import { api } from '../services/api';
import { Service } from '../types';
import { Button, Input } from '../components/common/UI';

export const ServicesPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newService, setNewService] = useState({ name: '', description: '', price: 0, duration: '' });

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const data = await api.services.getAll();
      setServices(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.services.create(newService);
      setIsModalOpen(false);
      setNewService({ name: '', description: '', price: 0, duration: '' });
      fetchServices();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Active Services</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your service offerings and consultation packages.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="h-12 px-6 rounded-2xl">
          <Plus size={20} className="mr-2" /> Create Service
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {isLoading ? (
          [1,2,3].map(i => <div key={i} className="h-64 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 animate-pulse"></div>)
        ) : services.length === 0 ? (
           <div className="col-span-full py-20 text-center bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800">
             <Wrench size={48} className="mx-auto text-slate-200 dark:text-slate-800 mb-4" />
             <p className="text-slate-400 font-bold">No services currently offered.</p>
           </div>
        ) : (
          services.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8">
                 <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                    <Activity size={24} />
                 </div>
              </div>
              
              <div className="mt-4">
                 <h3 className="text-2xl font-black">{service.name}</h3>
                 <p className="text-slate-500 dark:text-slate-400 mt-3 text-sm leading-relaxed">{service.description}</p>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                 <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                    <DollarSign size={18} />
                    <span className="text-xl font-black">{service.price}</span>
                 </div>
                 <div className="flex items-center gap-2 text-slate-400">
                    <Clock size={16} />
                    <span className="text-xs font-bold">{service.duration}</span>
                 </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
           <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2rem] p-8 space-y-6 shadow-2xl relative"
           >
              <h2 className="text-2xl font-black">Offer New Service</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                 <Input label="Service Name" value={newService.name} onChange={e => setNewService({...newService, name: e.target.value})} required />
                 <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-1.5 ml-0.5">Description</label>
                    <textarea 
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px] text-sm"
                      value={newService.description}
                      onChange={e => setNewService({...newService, description: e.target.value})}
                      required
                    ></textarea>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <Input label="Price ($)" type="number" value={newService.price} onChange={e => setNewService({...newService, price: Number(e.target.value)})} required />
                    <Input label="Duration (e.g. 1h)" value={newService.duration} onChange={e => setNewService({...newService, duration: e.target.value})} required />
                 </div>
                 <div className="flex gap-3 pt-4">
                    <Button type="button" variant="outline" className="flex-1 h-12 rounded-xl" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                    <Button type="submit" className="flex-1 h-12 rounded-xl">Save Service</Button>
                 </div>
              </form>
           </motion.div>
        </div>
      )}
    </div>
  );
};
