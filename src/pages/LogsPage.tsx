import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { FileText, Search, Filter, Trash2, Download } from 'lucide-react';
import { api } from '../services/api';
import { Log } from '../types';
import { Button } from '../components/common/UI';

export const LogsPage: React.FC = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await api.logs.getAll();
        setLogs(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Audit Logs</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Full traceability of all system actions and user movements.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline"><Filter size={18} className="mr-2" /> Filter</Button>
           <Button variant="secondary"><Download size={18} className="mr-2" /> Export CSV</Button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/20 text-slate-500 dark:text-slate-400 text-xs font-black uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">
                <th className="px-8 py-5">Timestamp</th>
                <th className="px-8 py-5">User</th>
                <th className="px-8 py-5">Module</th>
                <th className="px-8 py-5">Action</th>
                <th className="px-8 py-5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {isLoading ? (
                [1,2,3].map(i => <tr key={i}><td colSpan={5} className="px-8 py-6 h-16 animate-pulse bg-slate-50/10"></td></tr>)
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-medium">
                    <div className="flex flex-col items-center gap-4">
                       <FileText size={48} className="text-slate-200 dark:text-slate-800" />
                       <p>No system logs recorded yet.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-all font-mono">
                    <td className="px-8 py-5 text-xs text-slate-500">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="px-8 py-5 text-sm font-bold">{log.userName}</td>
                    <td className="px-8 py-5 text-xs uppercase text-slate-400 font-black tracking-wider">System</td>
                    <td className="px-8 py-5 text-sm text-slate-700 dark:text-slate-300">{log.action}</td>
                    <td className="px-8 py-5">
                       <span className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-black uppercase tracking-tight">Success</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
