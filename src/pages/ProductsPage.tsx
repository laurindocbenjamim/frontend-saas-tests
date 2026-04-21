import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Package, Search, Plus, Filter, Tag, DollarSign, Layers } from 'lucide-react';
import { api } from '../services/api';
import { Product } from '../types';
import { Button, Input } from '../components/common/UI';

export const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', category: '', price: 0, stock: 0 });

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const data = await api.products.getAll();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.products.create(newProduct);
      setIsModalOpen(false);
      setNewProduct({ name: '', category: '', price: 0, stock: 0 });
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Product Inventory</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Monitor stock levels and manage your items catalog.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="h-12 px-6 rounded-2xl">
          <Plus size={20} className="mr-2" /> Add New Product
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
         <div className="bg-indigo-600 p-6 rounded-[2rem] text-white flex justify-between items-center overflow-hidden relative">
            <Layers className="absolute -left-4 -bottom-4 w-24 h-24 text-white/10" />
            <div>
               <p className="text-indigo-100 text-xs font-bold uppercase tracking-widest">Total Inventory</p>
               <h3 className="text-2xl font-black mt-1">{products.length} Items</h3>
            </div>
         </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/20 text-slate-500 dark:text-slate-400 text-xs font-black uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">
                <th className="px-8 py-5">Product Details</th>
                <th className="px-8 py-5">Category</th>
                <th className="px-8 py-5">Price</th>
                <th className="px-8 py-5">Stock Level</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {isLoading ? (
                [1,2,3].map(i => <tr key={i}><td colSpan={5} className="px-8 py-6 h-16 animate-pulse bg-slate-50/10"></td></tr>)
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-medium">No products in inventory.</td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-all">
                    <td className="px-8 py-6 font-black text-slate-900 dark:text-white">{p.name}</td>
                    <td className="px-8 py-6">
                       <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-black uppercase tracking-tight">
                         {p.category}
                       </span>
                    </td>
                    <td className="px-8 py-6 font-bold text-indigo-600 dark:text-indigo-400">${p.price}</td>
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-3">
                          <div className="flex-1 max-w-[100px] h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                             <div className="h-full bg-indigo-600" style={{ width: `${Math.min(p.stock, 100)}%` }}></div>
                          </div>
                          <span className="text-xs font-bold">{p.stock}</span>
                       </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <Button variant="ghost" size="sm">Edit</Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
           <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2rem] p-8 space-y-6 shadow-2xl relative"
           >
              <h2 className="text-2xl font-black">Add New Product</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                 <Input label="Product Name" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} required />
                 <Input label="Category" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} required />
                 <div className="grid grid-cols-2 gap-4">
                    <Input label="Price ($)" type="number" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})} required />
                    <Input label="Initial Stock" type="number" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: Number(e.target.value)})} required />
                 </div>
                 <div className="flex gap-3 pt-4">
                    <Button type="button" variant="outline" className="flex-1 h-12 rounded-xl" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                    <Button type="submit" className="flex-1 h-12 rounded-xl">Save Product</Button>
                 </div>
              </form>
           </motion.div>
        </div>
      )}
    </div>
  );
};
