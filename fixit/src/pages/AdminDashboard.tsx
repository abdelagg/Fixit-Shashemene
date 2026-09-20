import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Users,
  Briefcase,
  Wrench,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Layers,
  Search,
  Filter,
  DollarSign,
  Star,
  RefreshCw,
  Plus,
  Trash2,
  ShieldAlert,
  ArrowRight,
  MapPin
} from 'lucide-react';
import { WorkerProfile, User, ServiceRequest, ServiceCategory, Report } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [workers, setWorkers] = useState<WorkerProfile[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<
    'approvals' | 'workers' | 'users' | 'requests' | 'categories' | 'reports'
  >('approvals');

  // Category modal form state
  const [newCatName, setNewCatName] = useState('');
  const [newCatGroup, setNewCatGroup] = useState('Home Services');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newCatSubs, setNewCatSubs] = useState('');
  const [addingCategory, setAddingCategory] = useState(false);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [sRes, wRes, uRes, rRes, cRes, repRes] = await Promise.all([
        api.getAdminStats(),
        api.getWorkers(),
        api.getUsers(),
        api.getAllRequests(),
        api.getServices(),
        api.getReports()
      ]);

      setStats(sRes.stats);
      setWorkers(wRes.workers || []);
      setUsers(uRes.users || []);
      setRequests(rRes.requests || []);
      setCategories(cRes.categories || []);
      setReports(repRes.reports || []);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleApproveWorker = async (workerId: string) => {
    try {
      await api.verifyWorker(workerId, 'approved');
      await fetchAdminData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleRejectWorker = async (workerId: string) => {
    const reason = prompt('Enter rejection reason for applicant:') || 'Incomplete credentials';
    try {
      await api.verifyWorker(workerId, 'rejected', reason);
      await fetchAdminData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    try {
      const subArray = newCatSubs
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      await api.createServiceCategory({
        name: newCatName.trim(),
        group: newCatGroup,
        icon: 'Wrench',
        description: newCatDesc.trim() || 'Professional trade service in Shashemene',
        subServices: subArray.length > 0 ? subArray : ['Repair', 'Maintenance', 'Inspection']
      });

      setNewCatName('');
      setNewCatDesc('');
      setNewCatSubs('');
      setAddingCategory(false);
      await fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleResolveReport = async (reportId: string) => {
    try {
      await api.resolveReport(reportId, 'Reviewed and verified safe by FixIt Admin.');
      await fetchAdminData();
    } catch (e) {
      console.error(e);
    }
  };

  const pendingWorkers = workers.filter((w) => w.verificationStatus === 'pending');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8 text-[#F5F5F7]">
      {/* Header Bento Card */}
      <div className="bg-[#141414] rounded-[32px] p-6 sm:p-8 border border-white/10 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden bento-glow-orange">
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-[#FF5C00] text-black">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-extrabold tracking-tight text-white">
              FixIt Shashemene Admin Console
            </h1>
          </div>
          <p className="text-xs text-white/50 mt-1">
            Logged in as <strong className="text-white">{user?.name}</strong> • Platform governance, worker verification & community trust
          </p>
        </div>

        <button
          onClick={fetchAdminData}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1C1C1E] hover:bg-[#242426] text-white text-xs font-bold border border-white/10 transition cursor-pointer relative z-10"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {[
          {
            label: 'Total Users',
            value: stats?.totalUsers || users.length,
            icon: Users,
            color: 'text-blue-400 bg-blue-950/60 border border-blue-500/20'
          },
          {
            label: 'Verified Workers',
            value: stats?.verifiedWorkers || workers.filter((w) => w.verificationStatus === 'approved').length,
            icon: CheckCircle2,
            color: 'text-emerald-400 bg-emerald-950/60 border border-emerald-500/20'
          },
          {
            label: 'Pending Approvals',
            value: pendingWorkers.length,
            icon: AlertTriangle,
            color: 'text-amber-400 bg-amber-950/60 border border-amber-500/20',
            highlight: pendingWorkers.length > 0
          },
          {
            label: 'Active Jobs',
            value: stats?.activeRequests || requests.filter((r) => r.status !== 'completed' && r.status !== 'cancelled').length,
            icon: Wrench,
            color: 'text-[#FF5C00] bg-[#FF5C00]/10 border border-[#FF5C00]/30'
          },
          {
            label: 'Completed Jobs',
            value: stats?.completedRequests || requests.filter((r) => r.status === 'completed').length,
            icon: Star,
            color: 'text-amber-400 bg-amber-950/60 border border-amber-500/20'
          },
          {
            label: 'Flagged Reports',
            value: reports.filter((r) => r.status === 'pending').length,
            icon: ShieldAlert,
            color: 'text-rose-400 bg-rose-950/60 border border-rose-500/20'
          }
        ].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className={`p-4 rounded-2xl bg-[#141414] border ${
                kpi.highlight ? 'border-[#FF5C00] ring-2 ring-[#FF5C00]/20' : 'border-white/10'
              } shadow-lg space-y-2`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">
                  {kpi.label}
                </span>
                <div className={`p-1.5 rounded-xl ${kpi.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-white">{kpi.value}</div>
            </div>
          );
        })}
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-1.5 bg-[#141414] border border-white/10 p-1.5 rounded-2xl overflow-x-auto">
        {[
          { key: 'approvals', label: `Pending Approvals (${pendingWorkers.length})` },
          { key: 'workers', label: `All Workers (${workers.length})` },
          { key: 'users', label: `All Users (${users.length})` },
          { key: 'requests', label: `Platform Requests (${requests.length})` },
          { key: 'categories', label: `Service Categories (${categories.length})` },
          { key: 'reports', label: `Reports (${reports.length})` }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition cursor-pointer ${
              activeTab === tab.key
                ? 'bg-white text-black shadow-md'
                : 'text-white/60 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Pending Worker Approvals */}
      {activeTab === 'approvals' && (
        <div className="bg-[#141414] rounded-[32px] border border-white/10 p-6 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div>
              <h2 className="font-bold text-lg text-white">
                Worker Verification Queue ({pendingWorkers.length})
              </h2>
              <p className="text-xs text-white/50">
                Review credentials, trade experience, and neighborhood location before granting public verified status
              </p>
            </div>
          </div>

          {pendingWorkers.length === 0 ? (
            <div className="text-center py-12 text-xs text-white/40 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <p className="font-bold text-white">Verification queue is clear!</p>
              <p>All registered tradespeople in Shashemene have been reviewed.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingWorkers.map((w) => (
                <div
                  key={w.id}
                  className="p-5 rounded-2xl bg-[#1C1C1E] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={w.profileImage}
                      alt={w.name}
                      className="w-14 h-14 rounded-2xl object-cover border border-white/10"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-base text-white">{w.name}</span>
                        <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold px-2 py-0.5 rounded-full">
                          Pending Review
                        </span>
                      </div>
                      <p className="text-xs font-bold text-[#FF5C00]">{w.serviceCategory}</p>
                      <p className="text-xs text-white/70 max-w-xl">{w.description}</p>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-white/50 pt-1 font-medium">
                        <span>📍 Shashemene, {w.neighborhood}</span>
                        <span>•</span>
                        <span>{w.experienceYears} Years Exp</span>
                        <span>•</span>
                        <span>Rate: {w.hourlyRateBirr} ETB/hr</span>
                        <span>•</span>
                        <span className="font-mono text-white/80">{w.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    <button
                      onClick={() => handleRejectWorker(w.id)}
                      className="px-4 py-2 rounded-xl bg-[#141414] hover:bg-rose-950/40 text-white/70 hover:text-rose-300 text-xs font-bold border border-white/10 transition cursor-pointer"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleApproveWorker(w.id)}
                      className="px-5 py-2 rounded-xl bg-white hover:bg-white/90 text-black text-xs font-extrabold shadow-md transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Approve & Verify</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: All Workers */}
      {activeTab === 'workers' && (
        <div className="bg-[#141414] rounded-[32px] border border-white/10 overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-white/5">
            <h2 className="font-bold text-base text-white">All Registered Workers in Shashemene</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#1C1C1E] text-white/50 font-bold border-b border-white/10">
                <tr>
                  <th className="p-4">Worker</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Neighborhood</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {workers.map((w) => (
                  <tr key={w.id} className="hover:bg-[#1C1C1E]/50 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={w.profileImage}
                          alt={w.name}
                          className="w-8 h-8 rounded-xl object-cover border border-white/10"
                        />
                        <div>
                          <div className="font-bold text-white">{w.name}</div>
                          <div className="text-white/40 font-mono text-[10px]">{w.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-bold text-[#FF5C00]">{w.serviceCategory}</td>
                    <td className="p-4 text-white/60">Shashemene, {w.neighborhood}</td>
                    <td className="p-4 font-bold text-amber-400">
                      ★ {w.ratingAverage.toFixed(1)} ({w.reviewCount})
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          w.verificationStatus === 'approved'
                            ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30'
                            : w.verificationStatus === 'pending'
                            ? 'bg-amber-950/60 text-amber-400 border-amber-500/30'
                            : 'bg-rose-950/60 text-rose-400 border-rose-500/30'
                        }`}
                      >
                        {w.verificationStatus.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {w.verificationStatus === 'approved' ? (
                        <button
                          onClick={() => handleRejectWorker(w.id)}
                          className="text-rose-400 hover:text-rose-300 font-bold cursor-pointer"
                        >
                          Suspend
                        </button>
                      ) : (
                        <button
                          onClick={() => handleApproveWorker(w.id)}
                          className="text-emerald-400 hover:text-emerald-300 font-bold cursor-pointer"
                        >
                          Approve
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: All Users */}
      {activeTab === 'users' && (
        <div className="bg-[#141414] rounded-[32px] border border-white/10 overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-white/5">
            <h2 className="font-bold text-base text-white">User Accounts</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#1C1C1E] text-white/50 font-bold border-b border-white/10">
                <tr>
                  <th className="p-4">User</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Neighborhood</th>
                  <th className="p-4">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-[#1C1C1E]/50">
                    <td className="p-4 font-bold text-white flex items-center gap-2">
                      <img
                        src={u.profileImage}
                        alt={u.name}
                        className="w-7 h-7 rounded-lg object-cover border border-white/10"
                      />
                      <span>{u.name}</span>
                    </td>
                    <td className="p-4 text-white/60">{u.email}</td>
                    <td className="p-4">
                      <span className="capitalize font-bold text-white bg-[#1C1C1E] px-2 py-0.5 rounded-md border border-white/5">
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 text-white/60">{u.neighborhood || 'Shashemene'}</td>
                    <td className="p-4 text-white/40 font-mono text-[11px]">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Platform Requests */}
      {activeTab === 'requests' && (
        <div className="bg-[#141414] rounded-[32px] border border-white/10 overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-white/5">
            <h2 className="font-bold text-base text-white">Live Service Requests in Shashemene</h2>
          </div>
          <div className="divide-y divide-white/5">
            {requests.map((r) => (
              <div key={r.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#FF5C00] bg-[#FF5C00]/15 px-2 py-0.5 rounded border border-[#FF5C00]/30">
                      {r.serviceCategory}
                    </span>
                    <span className="font-bold text-white">{r.title}</span>
                    <span className="text-white/40 font-mono">#{r.id.slice(-6)}</span>
                  </div>
                  <p className="text-white/70 mt-1">{r.description}</p>
                  <div className="text-white/40 text-[11px] mt-1 flex items-center gap-3">
                    <span>Customer: {r.customerName}</span>
                    <span>•</span>
                    <span>Assigned: {r.workerName || 'Open pool'}</span>
                    <span>•</span>
                    <span>📍 {r.location.neighborhood}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="capitalize font-bold text-[10px] bg-[#1C1C1E] text-white/90 border border-white/10 px-2.5 py-1 rounded-full">
                    {r.status.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Service Categories */}
      {activeTab === 'categories' && (
        <div className="bg-[#141414] rounded-[32px] border border-white/10 p-6 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div>
              <h2 className="font-bold text-lg text-white">
                Service Categories ({categories.length})
              </h2>
              <p className="text-xs text-white/50">Manage marketplace services available to Shashemene customers</p>
            </div>

            <button
              onClick={() => setAddingCategory(!addingCategory)}
              className="px-4 py-2 bg-white text-black hover:bg-white/90 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Category</span>
            </button>
          </div>

          {/* New Category Modal/Inline Form */}
          {addingCategory && (
            <form onSubmit={handleAddCategory} className="p-5 rounded-2xl bg-[#1C1C1E] border border-white/10 space-y-3">
              <h3 className="font-bold text-xs text-white uppercase tracking-widest">
                Create New Service Category
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="Category Name (e.g. Solar Panel Repair)"
                  className="text-xs bg-[#141414] text-white border border-white/10 rounded-xl p-2.5 outline-hidden"
                  required
                />
                <select
                  value={newCatGroup}
                  onChange={(e) => setNewCatGroup(e.target.value)}
                  className="text-xs bg-[#141414] text-white border border-white/10 rounded-xl p-2.5 outline-hidden"
                >
                  <option value="Home Services">Home Services</option>
                  <option value="Vehicle Services">Vehicle Services</option>
                  <option value="Technology">Technology</option>
                  <option value="Other">Other</option>
                </select>
                <input
                  type="text"
                  value={newCatSubs}
                  onChange={(e) => setNewCatSubs(e.target.value)}
                  placeholder="Sub-services comma-separated (e.g. Inverter, Battery)"
                  className="text-xs bg-[#141414] text-white border border-white/10 rounded-xl p-2.5 outline-hidden"
                />
              </div>
              <textarea
                value={newCatDesc}
                onChange={(e) => setNewCatDesc(e.target.value)}
                placeholder="Category description..."
                rows={2}
                className="w-full text-xs bg-[#141414] text-white border border-white/10 rounded-xl p-2.5 outline-hidden"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAddingCategory(false)}
                  className="px-3 py-1.5 text-xs font-bold text-white/60 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-white text-black rounded-xl text-xs font-extrabold cursor-pointer"
                >
                  Save Category
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((c) => (
              <div key={c.id} className="p-5 rounded-2xl border border-white/10 bg-[#1C1C1E] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-white">{c.name}</span>
                  <span className="text-[10px] bg-[#FF5C00]/15 text-[#FF5C00] border border-[#FF5C00]/30 px-2 py-0.5 rounded-full font-bold">
                    {c.group}
                  </span>
                </div>
                <p className="text-xs text-white/60">{c.description}</p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {c.subServices.map((sub, i) => (
                    <span key={i} className="text-[10px] bg-[#141414] border border-white/5 text-white/70 px-2 py-0.5 rounded-lg">
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: Reports */}
      {activeTab === 'reports' && (
        <div className="bg-[#141414] rounded-[32px] border border-white/10 p-6 space-y-4 shadow-2xl">
          <div className="border-b border-white/5 pb-4">
            <h2 className="font-bold text-lg text-white">Safety & Behavior Reports ({reports.length})</h2>
            <p className="text-xs text-white/50">Review flagged user or worker reports for investigation</p>
          </div>

          {reports.length === 0 ? (
            <div className="text-center py-10 text-xs text-white/40">
              No open reports. The Shashemene community is operating safely.
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map((rep) => (
                <div key={rep.id} className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/30 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-rose-300">Reason: {rep.reason}</span>
                    <span className="font-mono text-[10px] text-white/40">
                      {new Date(rep.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-white/80">{rep.description}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-rose-500/20 text-[11px]">
                    <span className="text-white/50">
                      Reported By: <strong className="text-white">{rep.reporterName}</strong> against <strong className="text-white">{rep.reportedUserName}</strong>
                    </span>
                    {rep.status === 'pending' ? (
                      <button
                        onClick={() => handleResolveReport(rep.id)}
                        className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold cursor-pointer"
                      >
                        Mark Resolved
                      </button>
                    ) : (
                      <span className="text-emerald-400 font-bold">✓ Resolved</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
