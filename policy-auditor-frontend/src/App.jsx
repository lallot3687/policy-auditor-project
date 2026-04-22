import React, { useEffect, useState } from 'react';
import { getPolicies, getAuditHistory, updatePolicy } from './services/api';
import { Shield, History, Edit, CheckCircle, X, Save } from 'lucide-react';

function App() {
  const [policies, setPolicies] = useState([]);
  const [selectedPolicyHistory, setSelectedPolicyHistory] = useState([]);
  const [viewingHistoryFor, setViewingHistoryFor] = useState(null);
  const [editingPolicy, setEditingPolicy] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchPolicies(); }, []);

  const fetchPolicies = async () => {
    try {
      const response = await getPolicies();
      setPolicies(response.data);
      setLoading(false);
    } catch (error) { console.error(error); setLoading(false); }
  };

  const fetchHistory = async (id) => {
    const response = await getAuditHistory(id);
    setSelectedPolicyHistory(response.data);
    setViewingHistoryFor(id);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updatePolicy(editingPolicy.id, editingPolicy);
      setEditingPolicy(null);
      fetchPolicies(); // Refresh list
      alert("Policy updated and Audit Log created!");
    } catch (error) { alert("Update failed"); }
  };

  const getStatusStyle = (s) => s === 'ACTIVE' ? 'bg-green-100 text-green-700' : s === 'INACTIVE' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700';

  if (loading) return <div className="flex h-screen items-center justify-center font-bold text-blue-600">Loading System...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto">
        
        {/* Top Header */}
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg text-white"><Shield size={28}/></div>
            <h1 className="text-2xl font-black tracking-tight">POLICY<span className="text-blue-600">AUDITOR</span></h1>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
            <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span></span>
            Live Connection: Port 8080
          </div>
        </div>

        {/* Policy Table */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Holder</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Premium</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Management</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {policies.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800">{p.holderName}</div>
                    <div className="text-xs text-slate-400 font-mono">{p.policyNumber}</div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-700">RM {p.premiumAmount.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest border ${getStatusStyle(p.status)}`}>{p.status}</span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button onClick={() => fetchHistory(p.id)} className="text-slate-400 hover:text-blue-600 transition-colors"><History size={18}/></button>
                    <button onClick={() => setEditingPolicy(p)} className="text-slate-400 hover:text-orange-500 transition-colors"><Edit size={18}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Audit Log Panel */}
        {viewingHistoryFor && (
          <div className="mt-8 bg-slate-900 rounded-2xl p-6 text-white shadow-2xl ring-1 ring-white/10 animate-in fade-in zoom-in duration-200">
             <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg flex items-center gap-2 underline decoration-blue-500 underline-offset-8">AUDIT TRAIL LOGS</h3>
                <button onClick={() => setViewingHistoryFor(null)} className="p-1 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white"><X size={20}/></button>
             </div>
             <div className="grid gap-3">
                {selectedPolicyHistory.map(log => (
                  <div key={log.id} className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex justify-between items-center">
                    <div>
                      <div className="text-blue-400 font-mono text-xs mb-1">{new Date(log.changedAt).toLocaleString()}</div>
                      <div className="text-sm">Changed <span className="text-slate-400">{log.fieldName}</span> from <span className="text-red-400 italic">"{log.oldValue}"</span> to <b className="text-green-400 font-bold">"{log.newValue}"</b></div>
                    </div>
                    <span className="text-[10px] bg-slate-700 px-2 py-1 rounded text-slate-300 font-mono tracking-tighter">USER: {log.changedBy}</span>
                  </div>
                ))}
                {selectedPolicyHistory.length === 0 && <div className="text-center py-10 text-slate-500 italic">No manual overrides recorded for this policy yet.</div>}
             </div>
          </div>
        )}
      </div>

      {/* Edit Modal Overlay */}
      {editingPolicy && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form onSubmit={handleUpdate} className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in slide-in-from-bottom-8">
            <div className="p-8">
              <h2 className="text-2xl font-black mb-6 flex items-center gap-2">EDIT <span className="text-blue-600">POLICY</span></h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Premium Amount (RM)</label>
                  <input type="number" step="0.01" className="w-full bg-slate-100 border-none rounded-xl p-4 font-bold text-slate-700 focus:ring-2 focus:ring-blue-500" value={editingPolicy.premiumAmount} onChange={e => setEditingPolicy({...editingPolicy, premiumAmount: parseFloat(e.target.value)})}/>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Policy Status</label>
                  <select className="w-full bg-slate-100 border-none rounded-xl p-4 font-bold text-slate-700 focus:ring-2 focus:ring-blue-500" value={editingPolicy.status} onChange={e => setEditingPolicy({...editingPolicy, status: e.target.value})}>
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                    <option value="LAPSED">LAPSED</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 p-6 flex gap-3">
              <button type="button" onClick={() => setEditingPolicy(null)} className="flex-1 p-4 font-bold text-slate-400 hover:text-slate-600 transition-colors">CANCEL</button>
              <button type="submit" className="flex-1 bg-blue-600 text-white p-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"><Save size={20}/> SAVE CHANGES</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;