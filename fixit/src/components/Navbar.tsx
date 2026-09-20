import React, { useState } from 'react';
import {
  Wrench,
  Search,
  Sparkles,
  Bell,
  User,
  Shield,
  Briefcase,
  Menu,
  X,
  ChevronDown,
  MapPin,
  CheckCircle2,
  Clock,
  LogOut,
  PlusCircle,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, data?: any) => void;
  onOpenAiAssistant: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenAiAssistant
}) => {
  const { user, logout, switchDemoUser, notifications, unreadCount, markNotificationsAsRead } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);

  const handleRoleSwitch = async (type: 'customer' | 'worker' | 'worker2' | 'admin') => {
    await switchDemoUser(type);
    setRoleSwitcherOpen(false);
    if (type === 'admin') onNavigate('admin-dashboard');
    else if (type === 'worker' || type === 'worker2') onNavigate('worker-dashboard');
    else onNavigate('customer-dashboard');
  };

  const getDashboardView = () => {
    if (!user) return 'home';
    if (user.role === 'admin') return 'admin-dashboard';
    if (user.role === 'worker') return 'worker-dashboard';
    return 'customer-dashboard';
  };

  return (
    <header id="main-header" className="sticky top-0 z-40 bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-white/10 text-[#F5F5F7]">
      {/* Top Local Shashemene Context Bar */}
      <div className="bg-[#141414] text-white/50 text-xs py-1.5 px-4 sm:px-6 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[#FF5C00] font-semibold">
              <MapPin className="w-3.5 h-3.5" /> Shashemene, Oromia
            </span>
            <span className="hidden sm:inline text-white/20">•</span>
            <span className="hidden sm:inline text-white/40">
              Verified local plumbers, electricians, mechanics & technicians
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                id="role-switch-trigger"
                onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
                className="flex items-center gap-1.5 bg-[#1C1C1E] hover:bg-[#242426] text-white/80 hover:text-white font-medium px-2.5 py-0.5 rounded-xl text-xs transition border border-white/10"
              >
                <span className="text-white/40 text-[11px]">Role:</span>
                <strong className="text-[#FF5C00] capitalize font-bold">{user?.role || 'Guest'}</strong>
                <ChevronDown className="w-3 h-3 text-white/40" />
              </button>

              {roleSwitcherOpen && (
                <div className="absolute right-0 mt-1 w-68 bg-[#141414] rounded-2xl shadow-2xl border border-white/10 text-[#F5F5F7] p-2 z-50 text-xs">
                  <div className="font-bold text-white/40 uppercase tracking-widest px-2.5 py-1 text-[10px]">
                    Switch Perspective (Demo)
                  </div>
                  <button
                    onClick={() => handleRoleSwitch('customer')}
                    className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between hover:bg-white/5 transition ${
                      user?.email === 'customer@test.com' ? 'bg-[#FF5C00]/10 text-[#FF5C00] font-bold border border-[#FF5C00]/30' : ''
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-[#F5F5F7]">Abebe Kebede</div>
                      <div className="text-white/40 text-[11px]">Customer • Arada</div>
                    </div>
                    {user?.email === 'customer@test.com' && <CheckCircle2 className="w-4 h-4 text-[#FF5C00]" />}
                  </button>

                  <button
                    onClick={() => handleRoleSwitch('worker')}
                    className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between hover:bg-white/5 transition ${
                      user?.email === 'worker@test.com' ? 'bg-[#FF5C00]/10 text-[#FF5C00] font-bold border border-[#FF5C00]/30' : ''
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-[#F5F5F7]">Ahmed Hassan</div>
                      <div className="text-white/40 text-[11px]">Worker • Master Plumber</div>
                    </div>
                    {user?.email === 'worker@test.com' && <CheckCircle2 className="w-4 h-4 text-[#FF5C00]" />}
                  </button>

                  <button
                    onClick={() => handleRoleSwitch('worker2')}
                    className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between hover:bg-white/5 transition ${
                      user?.email === 'bekele@test.com' ? 'bg-[#FF5C00]/10 text-[#FF5C00] font-bold border border-[#FF5C00]/30' : ''
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-[#F5F5F7]">Bekele Tadesse</div>
                      <div className="text-white/40 text-[11px]">Worker • Senior Electrician</div>
                    </div>
                    {user?.email === 'bekele@test.com' && <CheckCircle2 className="w-4 h-4 text-[#FF5C00]" />}
                  </button>

                  <button
                    onClick={() => handleRoleSwitch('admin')}
                    className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between hover:bg-white/5 transition ${
                      user?.email === 'admin@test.com' ? 'bg-[#FF5C00]/10 text-[#FF5C00] font-bold border border-[#FF5C00]/30' : ''
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-[#F5F5F7]">Aster Mengistu</div>
                      <div className="text-white/40 text-[11px]">FixIt Admin & Approvals</div>
                    </div>
                    {user?.email === 'admin@test.com' && <CheckCircle2 className="w-4 h-4 text-[#FF5C00]" />}
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={onOpenAiAssistant}
              className="inline-flex items-center gap-1 text-[#FF5C00] hover:text-[#ff7826] text-xs font-semibold cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Problem Helper</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <button
              id="brand-logo-btn"
              onClick={() => onNavigate('home')}
              className="flex items-center gap-3 text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-2xl bg-[#FF5C00] flex items-center justify-center text-black font-extrabold shadow-lg shadow-[#FF5C00]/20 group-hover:scale-105 transition-transform">
                <Wrench className="w-5 h-5 transform -rotate-45" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-xl tracking-tight text-[#F5F5F7]">FixIt</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#1C1C1E] text-white/80 border border-white/10">
                    Shashemene
                  </span>
                </div>
                <p className="text-[10px] text-white/40 font-medium">Local Trusted Services</p>
              </div>
            </button>

            {/* Desktop Links */}
            <nav className="hidden md:flex items-center gap-1">
              <button
                id="nav-home-btn"
                onClick={() => onNavigate('home')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                  currentView === 'home'
                    ? 'text-white bg-white/10 border border-white/10 font-bold'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                Home
              </button>

              <button
                id="nav-services-btn"
                onClick={() => onNavigate('services')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                  currentView === 'services'
                    ? 'text-white bg-white/10 border border-white/10 font-bold'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                Services
              </button>

              <button
                id="nav-workers-btn"
                onClick={() => onNavigate('workers')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                  currentView === 'workers' || currentView === 'worker-profile'
                    ? 'text-white bg-white/10 border border-white/10 font-bold'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                Find Workers
              </button>

              <button
                id="nav-how-it-works-btn"
                onClick={() => onNavigate('about')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                  currentView === 'about'
                    ? 'text-white bg-white/10 border border-white/10 font-bold'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                About FixIt
              </button>
            </nav>
          </div>

          {/* Action CTAs & Profile */}
          <div className="hidden md:flex items-center gap-3">
            <button
              id="nav-ai-diagnose-btn"
              onClick={onOpenAiAssistant}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-[#FF5C00] bg-[#1C1C1E] hover:bg-[#242426] transition border border-white/10 hover:border-[#FF5C00]/30 shadow-xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Problem Diagnosis</span>
            </button>

            <button
              id="nav-request-service-btn"
              onClick={() => onNavigate('new-request')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-black bg-white hover:bg-white/90 shadow-md transition cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Request Service</span>
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                id="notif-bell-btn"
                onClick={() => {
                  setNotifDropdownOpen(!notifDropdownOpen);
                  if (!notifDropdownOpen) markNotificationsAsRead();
                }}
                className="p-2 text-white/60 hover:text-white hover:bg-white/5 rounded-xl relative transition border border-transparent hover:border-white/10 cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-[#FF5C00] text-black rounded-full text-[9px] font-extrabold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-[#141414] rounded-2xl shadow-2xl border border-white/10 p-3.5 z-50 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2">
                    <div className="font-bold text-sm text-[#F5F5F7]">Notifications</div>
                    <span className="text-[11px] text-white/40">{notifications.length} total</span>
                  </div>

                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {notifications.length === 0 ? (
                      <div className="text-xs text-white/30 text-center py-4">No notifications yet</div>
                    ) : (
                      notifications.slice(0, 6).map((n) => (
                        <div
                          key={n.id}
                          className={`p-3 rounded-xl text-xs border ${
                            n.isRead
                              ? 'bg-[#1C1C1E] border-white/5 text-white/70'
                              : 'bg-[#1C1C1E] border-[#FF5C00]/40 text-[#F5F5F7]'
                          }`}
                        >
                          <div className="font-bold text-[#F5F5F7]">{n.title}</div>
                          <p className="text-white/60 mt-0.5">{n.message}</p>
                          <span className="text-[10px] text-white/30 mt-1 block">
                            {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Dashboard Shortcut & User Profile */}
            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-white/10">
                <button
                  id="nav-my-dashboard-btn"
                  onClick={() => onNavigate(getDashboardView())}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-[#1C1C1E] hover:bg-[#242426] border border-white/10 transition cursor-pointer"
                >
                  {user.role === 'admin' ? (
                    <Shield className="w-3.5 h-3.5 text-indigo-400" />
                  ) : user.role === 'worker' ? (
                    <Briefcase className="w-3.5 h-3.5 text-[#FF5C00]" />
                  ) : (
                    <User className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                  <span>
                    {user.role === 'admin' ? 'Admin Panel' : user.role === 'worker' ? 'Worker Hub' : 'My Jobs'}
                  </span>
                </button>

                <img
                  src={user.profileImage}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover border border-white/20"
                />
              </div>
            ) : (
              <button
                onClick={() => onNavigate('login')}
                className="px-3.5 py-2 text-xs font-bold text-white/80 hover:text-white cursor-pointer"
              >
                Log in
              </button>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => onNavigate('new-request')}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-black bg-white"
            >
              Request
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-white/70 hover:bg-white/5 border border-white/10"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#141414] px-4 py-4 space-y-3">
          <button
            onClick={() => {
              onNavigate('home');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 font-medium text-white/80 hover:text-white"
          >
            Home
          </button>
          <button
            onClick={() => {
              onNavigate('services');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 font-medium text-white/80 hover:text-white"
          >
            Services Catalog
          </button>
          <button
            onClick={() => {
              onNavigate('workers');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 font-medium text-white/80 hover:text-white"
          >
            Find Workers in Shashemene
          </button>
          <button
            onClick={() => {
              onNavigate('about');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 font-medium text-white/80 hover:text-white"
          >
            About FixIt Shashemene
          </button>
          <button
            onClick={() => {
              onOpenAiAssistant();
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-2 w-full py-2.5 font-bold text-[#FF5C00] bg-[#1C1C1E] px-3 rounded-xl border border-white/10"
          >
            <Sparkles className="w-4 h-4 text-[#FF5C00]" />
            <span>AI Problem Diagnosis</span>
          </button>

          {user && (
            <div className="pt-3 border-t border-white/10">
              <button
                onClick={() => {
                  onNavigate(getDashboardView());
                  setMobileMenuOpen(false);
                }}
                className="w-full text-center py-2.5 rounded-xl bg-white text-black font-bold text-xs"
              >
                Open {user.role.toUpperCase()} Dashboard
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
