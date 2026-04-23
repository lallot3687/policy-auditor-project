import React, { useEffect, useState } from 'react';
import { getPolicies, getAuditHistory, updatePolicy } from './services/api';
import { 
  Shield, 
  History, 
  Edit, 
  CheckCircle, 
  X, 
  Save, 
  RefreshCw, 
  Plus, 
  Search,
  Filter,
  ChevronDown,
  AlertCircle,
  Clock,
  User
} from 'lucide-react';

function App() {
  const [policies, setPolicies] = useState([]);
  const [selectedPolicyHistory, setSelectedPolicyHistory] = useState([]);
  const [viewingHistoryFor, setViewingHistoryFor] = useState(null);
  const [editingPolicy, setEditingPolicy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  useEffect(() => { fetchPolicies(); }, []);

  const fetchPolicies = async () => {
    try {
      const response = await getPolicies();
      setPolicies(response.data);
      setLoading(false);
    } catch (error) { 
      console.error(error); 
      setLoading(false); 
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchPolicies();
    setIsRefreshing(false);
  };

  const fetchHistory = async (id) => {
    try {
      const response = await getAuditHistory(id);
      setSelectedPolicyHistory(response.data);
      setViewingHistoryFor(id);
    } catch (error) {
      console.error(error);
      showToastNotification('Failed to load audit history', 'error');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updatePolicy(editingPolicy.id, editingPolicy);
      setEditingPolicy(null);
      fetchPolicies();
      showToastNotification('Policy updated successfully! Audit log created.', 'success');
    } catch (error) { 
      showToastNotification('Update failed. Please try again.', 'error'); 
    }
  };

  const showToastNotification = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  const getStatusStyle = (s) => {
    switch(s) {
      case 'ACTIVE': return 'bg-green-100 text-green-700 border-green-200';
      case 'INACTIVE': return 'bg-red-100 text-red-700 border-red-200';
      case 'LAPSED': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (s) => {
    switch(s) {
      case 'ACTIVE': return <CheckCircle size={12} className="mr-1" />;
      case 'INACTIVE': return <X size={12} className="mr-1" />;
      case 'LAPSED': return <Clock size={12} className="mr-1" />;
      default: return null;
    }
  };

  const filteredPolicies = policies.filter(policy => {
    const matchesSearch = policy.holderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.policyNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = statusFilter === 'ALL' || policy.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const getStatusCounts = () => {
    return {
      total: policies.length,
      active: policies.filter(p => p.status === 'ACTIVE').length,
      inactive: policies.filter(p => p.status === 'INACTIVE').length,
      lapsed: policies.filter(p => p.status === 'LAPSED').length
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-block">
            <Shield size={64} className="text-blue-600 animate-pulse" />
            <div className="absolute inset-0 bg-blue-600 rounded-full animate-ping opacity-20"></div>
          </div>
          <h2 className="mt-6 text-2xl font-bold text-slate-800">Loading System...</h2>
          <p className="mt-2 text-slate-500">Initializing policy auditor dashboard</p>
        </div>
      </div>
    );
  }

  const statusCounts = getStatusCounts();

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-slate-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 p-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Top Header */}
          <header className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="bg-linear-to-br from-blue-600 to-blue-700 p-3 rounded-xl text-white shadow-lg shadow-blue-200">
                    <Shield size={32} />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                </div>
                <div>
                  <h1 className="text-3xl font-black tracking-tight text-slate-900">
                    POLICY<span className="text-blue-600">AUDITOR</span>
                  </h1>
                  <p className="text-sm text-slate-500 font-medium">Insurance Policy Management System</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200">
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </div>
                <span className="text-sm font-semibold text-slate-700">Live Connection: Port 8080</span>
              </div>
            </div>
          </header>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Total Policies</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">{statusCounts.total}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-xl">
                  <Shield size={24} className="text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Active</p>
                  <p className="text-3xl font-bold text-green-600 mt-1">{statusCounts.active}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-xl">
                  <CheckCircle size={24} className="text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Inactive</p>
                  <p className="text-3xl font-bold text-red-600 mt-1">{statusCounts.inactive}</p>
                </div>
                <div className="bg-red-100 p-3 rounded-xl">
                  <X size={24} className="text-red-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Lapsed</p>
                  <p className="text-3xl font-bold text-yellow-600 mt-1">{statusCounts.lapsed}</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-xl">
                  <Clock size={24} className="text-yellow-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by holder name or policy number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              
              <div className="flex gap-3">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="pl-10 pr-8 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                  >
                    <option value="ALL">All Status</option>
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="LAPSED">Lapsed</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                </div>
                
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''} />
                  Refresh
                </button>
              </div>
            </div>
          </div>

          {/* Policy Table */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-linear-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Policy Holder</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Premium Amount</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Policy Type</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPolicies.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                        <div className="flex flex-col items-center">
                          <AlertCircle size={48} className="text-slate-300 mb-4" />
                          <p className="text-lg font-semibold">No policies found</p>
                          <p className="text-sm">Try adjusting your search or filter criteria</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredPolicies.map((p, index) => (
                      <tr 
                        key={p.id} 
                        className="hover:bg-blue-50/30 transition-colors duration-150 group"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                              {p.holderName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-slate-800">{p.holderName}</div>
                              <div className="text-xs text-slate-400 font-mono">{p.policyNumber}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-lg text-slate-700">RM {p.premiumAmount.toFixed(2)}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-semibold">
                            {p.policyType}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide border ${getStatusStyle(p.status)}`}>
                            {getStatusIcon(p.status)}
                            {p.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => fetchHistory(p.id)} 
                              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 group-hover:scale-110"
                              title="View Audit History"
                            >
                              <History size={18} />
                            </button>
                            <button 
                              onClick={() => setEditingPolicy(p)} 
                              className="p-2 text-slate-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all duration-200 group-hover:scale-110"
                              title="Edit Policy"
                            >
                              <Edit size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Audit Log Panel */}
          {viewingHistoryFor && (
            <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-2xl ring-1 ring-white/10 animate-in fade-in zoom-in duration-300">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-bold text-xl flex items-center gap-2">
                    <History className="text-blue-400" />
                    AUDIT TRAIL LOGS
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">
                    Showing changes for policy #{viewingHistoryFor}
                  </p>
                </div>
                <button 
                  onClick={() => setViewingHistoryFor(null)} 
                  className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {selectedPolicyHistory.map((log, index) => (
                  <div 
                    key={log.id} 
                    className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 hover:border-blue-500/50 transition-all duration-200 hover:bg-slate-800"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="text-blue-400 font-mono text-xs bg-blue-900/30 px-2 py-1 rounded">
                            {new Date(log.changedAt).toLocaleString()}
                          </div>
                          <span className="text-xs bg-slate-700 px-2 py-1 rounded text-slate-300 font-mono">
                            {log.actionType}
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className="text-slate-400">Field:</span>{' '}
                          <span className="text-white font-semibold">{log.fieldName}</span>
                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-red-400 line-through bg-red-900/20 px-2 py-1 rounded text-xs">
                              {log.oldValue}
                            </span>
                            <span className="text-slate-500">→</span>
                            <span className="text-green-400 bg-green-900/20 px-2 py-1 rounded text-xs font-bold">
                              {log.newValue}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 bg-slate-700/50 px-3 py-2 rounded-lg">
                        <User size={14} className="text-slate-400" />
                        <span className="text-xs font-mono text-slate-300">{log.changedBy}</span>
                      </div>
                    </div>
                  </div>
                ))}
                
                {selectedPolicyHistory.length === 0 && (
                  <div className="text-center py-12">
                    <div className="bg-slate-800/50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <History size={32} className="text-slate-600" />
                    </div>
                    <p className="text-slate-500 italic">No audit logs recorded for this policy yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal Overlay */}
      {editingPolicy && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in slide-in-from-bottom-8">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
              <h2 className="text-2xl font-black text-white flex items-center gap-2">
                <Edit size={28} />
                EDIT POLICY
              </h2>
              <p className="text-blue-100 mt-1">
                Policy #{editingPolicy.id} - {editingPolicy.policyNumber}
              </p>
            </div>
            
            <form onSubmit={handleUpdate} className="p-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                    Policy Holder
                  </label>
                  <div className="bg-slate-100 rounded-xl p-4 font-semibold text-slate-700">
                    {editingPolicy.holderName}
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                    Premium Amount (RM)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 font-bold">RM</span>
                    <input 
                      type="number" 
                      step="0.01" 
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      value={editingPolicy.premiumAmount}
                      onChange={e => setEditingPolicy({...editingPolicy, premiumAmount: parseFloat(e.target.value)})}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                    Policy Status
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {['ACTIVE', 'INACTIVE', 'LAPSED'].map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setEditingPolicy({...editingPolicy, status})}
                        className={`py-3 px-4 rounded-xl font-bold text-sm transition-all ${
                          editingPolicy.status === status
                            ? status === 'ACTIVE' 
                              ? 'bg-green-500 text-white shadow-lg shadow-green-200'
                              : status === 'INACTIVE'
                              ? 'bg-red-500 text-white shadow-lg shadow-red-200'
                              : 'bg-yellow-500 text-white shadow-lg shadow-yellow-200'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex gap-4">
                <button 
                  type="button" 
                  onClick={() => setEditingPolicy(null)} 
                  className="flex-1 py-4 font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
                >
                  CANCEL
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-blue-200 transition-all active:scale-95"
                >
                  <Save size={20} />
                  SAVE CHANGES
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-xl shadow-2xl animate-in slide-in-from-right duration-300 ${
          toastType === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          <div className="flex items-center gap-3">
            {toastType === 'success' ? (
              <CheckCircle size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
            <span className="font-semibold">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

export default App;