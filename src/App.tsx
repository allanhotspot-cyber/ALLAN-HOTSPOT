/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Wifi, 
  Ticket, 
  Users, 
  DollarSign, 
  Plus, 
  LayoutDashboard, 
  Settings as SettingsIcon,
  LogOut,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Activity,
  Search,
  Trash2,
  Ban,
  CheckSquare,
  Square,
  X,
  Calendar,
  TrendingUp,
  Info,
  ArrowUpCircle,
  ArrowDownCircle,
  History,
  Router,
  BarChart3,
  Wallet,
  Package,
  CreditCard,
  Shield,
  Smartphone,
  Globe,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Moon,
  Cpu,
  Database,
  Sigma,
  QrCode,
  Download,
  Upload,
  FileText,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { QRCodeCanvas } from 'qrcode.react';
import QRCode from 'qrcode';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';

// --- Types ---
interface Voucher {
  id: number;
  code: string;
  duration_minutes: number;
  price: number;
  status: 'active' | 'used' | 'expired';
  created_at: string;
  expires_at: string | null;
  first_used_at: string | null;
  total_bytes_up: number;
  total_bytes_down: number;
  upload_limit: number;
  download_limit: number;
  data_limit_mb: number;
  customer_id?: number;
  customer_name?: string;
}

interface Session {
  id: number;
  code: string;
  mac_address: string;
  start_time: string;
  end_time: string;
}

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  created_at: string;
}

interface AuthUser {
  id: number;
  username: string;
  role: string;
  email?: string;
}

interface Stats {
  activeVouchers: number;
  totalRevenue: number;
  activeSessions: number;
  cpuUsage: number;
  totalDataUsage: number;
  totalUpload: number;
  totalDownload: number;
  agentCommission: number;
  netProceeds: number;
  balance: number;
}

// --- Components ---

const SidebarItem = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
      active 
        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
        : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </button>
);

const PlaceholderView = ({ title, icon: Icon }: { title: string, icon: any }) => (
  <div className="flex flex-col items-center justify-center h-[60vh] text-zinc-600">
    <div className="p-6 bg-zinc-900 rounded-3xl mb-6 border border-zinc-800">
      <Icon size={48} className="text-zinc-700" />
    </div>
    <h3 className="text-xl font-bold text-zinc-400 mb-2">{title}</h3>
    <p className="text-sm max-w-xs text-center">This section is currently under development for ASANSL WiFi Hotspot Billing System.</p>
  </div>
);

const StatCard = ({ icon: Icon, label, value, color }: { icon: any, label: string, value: string | number, color: string }) => (
  <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
        <Icon className={color.replace('bg-', 'text-')} size={24} />
      </div>
      <span className="text-zinc-500 text-sm font-medium">Last 24h</span>
    </div>
    <div className="text-2xl font-bold text-white mb-1">{value}</div>
    <div className="text-zinc-500 text-sm uppercase tracking-wider font-semibold">{label}</div>
  </div>
);

const Login = ({ onLogin, error, loading }: { onLogin: (e: React.FormEvent) => void, error: string, loading: boolean }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl"
      >
        <div className="p-8 bg-zinc-950/50 border-b border-zinc-800 text-center">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="text-emerald-500" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">Admin Login</h2>
          <p className="text-zinc-500 text-sm">ASANSL WiFi Hotspot Billing System</p>
        </div>
        
        <form onSubmit={onLogin} className="p-8 space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm flex items-center gap-3">
              <AlertCircle size={18} />
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Username</label>
            <div className="relative">
              <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input 
                name="username"
                type="text" 
                required
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-all"
                placeholder="Enter username"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Password</label>
            <div className="relative">
              <Zap className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input 
                name="password"
                type="password" 
                required
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>
          
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-500/50 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <LogOut size={18} className="rotate-180" />
                SIGN IN
              </>
            )}
          </button>
        </form>
        
        <div className="p-6 bg-zinc-950/30 border-t border-zinc-800 text-center">
          <p className="text-xs text-zinc-600">
            Forgot password? Contact system administrator.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default function App() {
  const [view, setView] = useState<'portal' | 'admin'>('portal');
  const [adminTab, setAdminTab] = useState<string>('dashboard');
  const [portalTab, setPortalTab] = useState<'connect' | 'pricing' | 'help'>('connect');
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['sales', 'float', 'users', 'settings', 'billing']);

  const toggleMenu = (menu: string) => {
    setExpandedMenus(prev => 
      prev.includes(menu) ? prev.filter(m => m !== menu) : [...prev, menu]
    );
  };
  
  // Portal State
  const [voucherCode, setVoucherCode] = useState('');
  const [portalStatus, setPortalStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });
  const [isLoading, setIsLoading] = useState(false);

  // Admin State
  const [stats, setStats] = useState<Stats>({ 
    activeVouchers: 0, 
    totalRevenue: 0, 
    activeSessions: 0,
    cpuUsage: 0,
    totalDataUsage: 0,
    totalUpload: 0,
    totalDownload: 0,
    agentCommission: 0,
    netProceeds: 0,
    balance: 0
  });
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [salesHistory, setSalesHistory] = useState<any[]>([]);
  const [recentSales, setRecentSales] = useState<any[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerSearch, setCustomerSearch] = useState('');
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
  const [isViewQRModalOpen, setIsViewQRModalOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [viewingCustomer, setViewingCustomer] = useState<Customer | null>(null);
  const [customerForm, setCustomerForm] = useState({ name: '', email: '', phone: '', address: '' });
  
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('token'));
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  const authFetch = async (url: string, options: any = {}) => {
    const token = localStorage.getItem('token');
    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    
    const res = await fetch(url, { ...options, headers });
    if (res.status === 401 || res.status === 403) {
      handleLogout();
      throw new Error('Session expired');
    }
    return res;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthLoading(true);
    setLoginError('');
    
    const formData = new FormData(e.target as HTMLFormElement);
    const username = formData.get('username');
    const password = formData.get('password');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem('token', data.token);
        setIsAuthenticated(true);
        setAuthUser(data.user);
        setView('admin');
      } else {
        setLoginError(data.error || 'Login failed');
      }
    } catch (err) {
      setLoginError('Network error. Please try again.');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setAuthUser(null);
    setView('portal');
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setAuthLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const user = await res.json();
          setAuthUser(user);
          setIsAuthenticated(true);
        } else {
          handleLogout();
        }
      } catch (err) {
        handleLogout();
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuth();
  }, []);
  const [packageForm, setPackageForm] = useState({ name: '', duration_minutes: 60, price: 1000, description: '', data_limit_mb: 0 });
  const [packageDurationUnit, setPackageDurationUnit] = useState<'minutes' | 'hours' | 'days' | 'weeks'>('minutes');
  const [genCount, setGenCount] = useState(10);
  const [genDuration, setGenDuration] = useState(60);
  const [genDurationUnit, setGenDurationUnit] = useState<'minutes' | 'hours' | 'days' | 'weeks'>('minutes');
  const [genPrice, setGenPrice] = useState(1000);
  const [genValidity, setGenValidity] = useState(7); // Default 7 days validity
  const [genUploadLimit, setGenUploadLimit] = useState(5); // Default 5 Mbps
  const [genDownloadLimit, setGenDownloadLimit] = useState(10); // Default 10 Mbps
  const [genDataLimit, setGenDataLimit] = useState(0); // Default 0 (Unlimited)
  const [genExpiryType, setGenExpiryType] = useState<'validity' | 'custom'>('validity');
  const [genExpiryDate, setGenExpiryDate] = useState(''); // Custom expiry date
  const [voucherSearch, setVoucherSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [transactionSearch, setTransactionSearch] = useState('');
  const [selectedVouchers, setSelectedVouchers] = useState<number[]>([]);
  const [viewingVoucher, setViewingVoucher] = useState<Voucher | null>(null);
  const [qrCodeVoucher, setQrCodeVoucher] = useState<Voucher | null>(null);
  
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'used' | 'expired'>('all');
  const [filterDuration, setFilterDuration] = useState<'all' | 'none' | 'short' | 'medium' | 'long'>('all');
  const [filterUploadLimit, setFilterUploadLimit] = useState<'all' | 'none' | 'low' | 'medium' | 'high'>('all');
  const [filterDownloadLimit, setFilterDownloadLimit] = useState<'all' | 'none' | 'low' | 'medium' | 'high'>('all');
  const [filterDataLimit, setFilterDataLimit] = useState<'all' | 'none' | 'low' | 'medium' | 'high'>('all');
  const [filterCreatedAfter, setFilterCreatedAfter] = useState('');
  const [filterCreatedBefore, setFilterCreatedBefore] = useState('');
  const [filterExpiresAfter, setFilterExpiresAfter] = useState('');
  const [filterExpiresBefore, setFilterExpiresBefore] = useState('');
  
  const [sortColumn, setSortColumn] = useState<string>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  useEffect(() => {
    fetchPackages(); // Always fetch packages for portal display
    if (view === 'admin') {
      fetchStats();
      fetchVouchers();
      fetchSessions();
      fetchSalesHistory();
      fetchRecentSales();
      fetchUsers();
      fetchTransactions();
      fetchCustomers();
    }
  }, [view, adminTab]);

  const formatDuration = (minutes: number) => {
    if (minutes === 0) return 'Unlimited';
    if (minutes < 60) return `${minutes} min`;
    const hours = minutes / 60;
    if (hours < 24) return `${hours % 1 === 0 ? hours : hours.toFixed(1)} hr${hours !== 1 ? 's' : ''}`;
    const days = hours / 24;
    if (days < 7) return `${days % 1 === 0 ? days : days.toFixed(1)} day${days !== 1 ? 's' : ''}`;
    const weeks = days / 7;
    return `${weeks % 1 === 0 ? weeks : weeks.toFixed(1)} week${weeks !== 1 ? 's' : ''}`;
  };

  const fetchCustomers = async () => {
    try {
      const res = await authFetch('/api/customers');
      const data = await res.json();
      setCustomers(data);
    } catch (err) {
      console.error('Error fetching customers:', err);
    }
  };

  const fetchRecentSales = async () => {
    try {
      const res = await authFetch('/api/sales/recent');
      const data = await res.json();
      setRecentSales(data);
    } catch (err) {
      console.error('Error fetching recent sales:', err);
    }
  };

  const fetchPackages = async () => {
    try {
      const res = await fetch('/api/packages');
      const data = await res.json();
      setPackages(data);
    } catch (err) {
      console.error('Error fetching packages:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await authFetch('/api/users');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await authFetch('/api/transactions');
      const data = await res.json();
      setTransactions(data);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await authFetch('/api/stats');
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const fetchSalesHistory = async () => {
    try {
      const res = await authFetch('/api/sales/history');
      const data = await res.json();
      setSalesHistory(data);
    } catch (err) {
      console.error('Error fetching sales history:', err);
    }
  };

  const fetchVouchers = async () => {
    try {
      const res = await authFetch('/api/vouchers');
      const data = await res.json();
      setVouchers(data);
    } catch (err) {
      console.error('Error fetching vouchers:', err);
    }
  };

  const fetchSessions = async () => {
    try {
      const res = await authFetch('/api/sessions/active');
      const data = await res.json();
      setSessions(data);
    } catch (err) {
      console.error('Error fetching sessions:', err);
    }
  };

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('/api/vouchers/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: voucherCode, macAddress: 'DEMO-MAC-' + Math.random().toString(16).slice(2, 8) })
      });
      const data = await res.json();
      if (data.success) {
        setPortalStatus({ type: 'success', message: `Connected! Session expires at ${new Date(data.endTime).toLocaleTimeString()}` });
      } else {
        setPortalStatus({ type: 'error', message: data.error });
      }
    } catch (err) {
      setPortalStatus({ type: 'error', message: 'Connection failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = async () => {
    let finalDuration = genDuration;
    if (genDurationUnit === 'hours') finalDuration *= 60;
    else if (genDurationUnit === 'days') finalDuration *= 1440;
    else if (genDurationUnit === 'weeks') finalDuration *= 10080;

    const res = await authFetch('/api/vouchers/generate', {
      method: 'POST',
      body: JSON.stringify({ 
        count: genCount, 
        duration: finalDuration, 
        price: genPrice,
        validityDays: genValidity,
        expiryDate: genExpiryDate,
        uploadLimit: genUploadLimit,
        downloadLimit: genDownloadLimit,
        dataLimitMb: genDataLimit,
        customerId: selectedCustomerId
      })
    });
    if (res.ok) {
      alert("Vouchers generated successfully!");
      fetchVouchers();
      fetchStats();
    } else {
      alert("Failed to generate vouchers.");
    }
  };

  const handleAssignCustomer = async (voucherId: number, customerId: number) => {
    try {
      const res = await authFetch(`/api/vouchers/${voucherId}/assign-customer`, {
        method: 'POST',
        body: JSON.stringify({ customerId })
      });
      if (res.ok) {
        fetchVouchers();
        if (viewingVoucher && viewingVoucher.id === voucherId) {
          const updatedVoucher = { ...viewingVoucher, customer_id: customerId };
          const customer = customers.find(c => c.id === customerId);
          if (customer) updatedVoucher.customer_name = customer.name;
          setViewingVoucher(updatedVoucher);
        }
      }
    } catch (err) {
      console.error('Error assigning customer:', err);
    }
  };

  const handleBulkAction = async (action: 'expire' | 'delete') => {
    if (selectedVouchers.length === 0) return;
    
    const endpoint = action === 'expire' ? '/api/vouchers/bulk-expire' : '/api/vouchers/bulk-delete';
    const confirmMsg = action === 'expire' 
      ? `Are you sure you want to mark ${selectedVouchers.length} vouchers as expired?` 
      : `Are you sure you want to delete ${selectedVouchers.length} vouchers? This action cannot be undone.`;

    if (!confirm(confirmMsg)) return;

    try {
      const res = await authFetch(endpoint, {
        method: 'POST',
        body: JSON.stringify({ ids: selectedVouchers })
      });
      if (res.ok) {
        setSelectedVouchers([]);
        fetchVouchers();
        fetchStats();
      }
    } catch (err) {
      console.error('Bulk action failed:', err);
    }
  };

  const handleExpireFiltered = async () => {
    const filteredActive = getFilteredVouchers().filter(v => v.status === 'active');
    if (filteredActive.length === 0) {
      alert("No active vouchers found in the current filtered view.");
      return;
    }

    const confirmMsg = `Are you sure you want to mark all ${filteredActive.length} filtered active vouchers as expired?`;
    if (!confirm(confirmMsg)) return;

    try {
      const ids = filteredActive.map(v => v.id);
      const res = await authFetch('/api/vouchers/bulk-expire', {
        method: 'POST',
        body: JSON.stringify({ ids })
      });
      if (res.ok) {
        setSelectedVouchers([]);
        fetchVouchers();
        fetchStats();
      }
    } catch (err) {
      console.error('Expire filtered action failed:', err);
    }
  };

  const handleCSVUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result as string;
      const lines = text.split(/\r?\n/);
      const vouchers = [];
      
      // Skip header if it exists
      const firstLine = lines[0]?.toLowerCase() || '';
      const hasHeader = firstLine.includes('code') || firstLine.includes('duration') || firstLine.includes('price');
      const startIdx = hasHeader ? 1 : 0;

      for (let i = startIdx; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const parts = line.split(',').map(p => p.trim().replace(/^"|"$/g, ''));
        if (parts.length < 1 || !parts[0]) continue;

        const duration = parseInt(parts[1]);
        const price = parseInt(parts[2]);
        const validityDays = parseInt(parts[3]);
        const uploadLimit = parseInt(parts[4]);
        const downloadLimit = parseInt(parts[5]);
        const dataLimitMb = parseInt(parts[6]);

        if (isNaN(duration) || isNaN(price) || isNaN(validityDays) || isNaN(uploadLimit) || isNaN(downloadLimit) || isNaN(dataLimitMb)) {
          alert(`Error on line ${i + 1}: Duration, Price, Validity Days, Upload Limit, Download Limit, and Data Limit must be valid numbers.\nFormat: code, duration_minutes, price, validity_days, upload_limit_mbps, download_limit_mbps, data_limit_mb`);
          return;
        }

        vouchers.push({
          code: parts[0],
          duration: duration || 60,
          price: price || 0,
          validityDays: validityDays || 0,
          uploadLimit: uploadLimit || 0,
          downloadLimit: downloadLimit || 0,
          dataLimitMb: dataLimitMb || 0
        });
      }

      if (vouchers.length === 0) {
        alert("No valid vouchers found in CSV. Format: code, duration_minutes, price, validity_days, upload_limit_mbps, download_limit_mbps, data_limit_mb");
        return;
      }

      if (!confirm(`Upload ${vouchers.length} vouchers from CSV?`)) return;

      try {
        const res = await authFetch('/api/vouchers/bulk-upload', {
          method: 'POST',
          body: JSON.stringify({ vouchers })
        });
        
        if (res.ok) {
          alert(`Successfully uploaded ${vouchers.length} vouchers.`);
          fetchVouchers();
          fetchStats();
        } else {
          const data = await res.json();
          alert(`Upload failed: ${data.error}`);
        }
      } catch (err) {
        alert("An error occurred during upload.");
      }
      
      // Reset input
      event.target.value = '';
    };
    reader.readAsText(file);
  };

  const downloadCSVTemplate = () => {
    const headers = "code,duration_minutes,price,validity_days,upload_limit_mbps,download_limit_mbps,data_limit_mb";
    const example = "VOUCHER123,60,1000,7,5,10,0";
    const csvContent = headers + "\n" + example;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "voucher_import_template.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBulkDownloadQR = async () => {
    if (selectedVouchers.length === 0) return;
    
    const confirmMsg = `Generate and download QR codes for ${selectedVouchers.length} vouchers as a single ZIP file?`;
    if (!confirm(confirmMsg)) return;

    setIsLoading(true);
    const zip = new JSZip();
    const folder = zip.folder("vouchers");

    for (const id of selectedVouchers) {
      const voucher = vouchers.find(v => v.id === id);
      if (voucher) {
        try {
          const dataUrl = await QRCode.toDataURL(voucher.code, {
            width: 512,
            margin: 2,
            errorCorrectionLevel: 'H'
          });
          // Extract base64 data
          const base64Data = dataUrl.split(',')[1];
          folder?.file(`voucher-${voucher.code}.png`, base64Data, { base64: true });
        } catch (err) {
          console.error(`Error generating QR for ${voucher.code}:`, err);
        }
      }
    }

    try {
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `vouchers-${new Date().getTime()}.zip`);
    } catch (err) {
      console.error("Error generating ZIP:", err);
      alert("Failed to generate ZIP file.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadFilteredQR = async () => {
    const filtered = getFilteredVouchers();
    if (filtered.length === 0) {
      alert("No vouchers to download.");
      return;
    }
    
    const confirmMsg = `Generate and download QR codes for all ${filtered.length} filtered vouchers as a single ZIP file?`;
    if (!confirm(confirmMsg)) return;

    setIsLoading(true);
    const zip = new JSZip();
    const folder = zip.folder("filtered-vouchers");

    for (const voucher of filtered) {
      try {
        const dataUrl = await QRCode.toDataURL(voucher.code, {
          width: 512,
          margin: 2,
          errorCorrectionLevel: 'H'
        });
        // Extract base64 data
        const base64Data = dataUrl.split(',')[1];
        folder?.file(`voucher-${voucher.code}.png`, base64Data, { base64: true });
      } catch (err) {
        console.error(`Error generating QR for ${voucher.code}:`, err);
      }
    }

    try {
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `filtered-vouchers-${new Date().getTime()}.zip`);
    } catch (err) {
      console.error("Error generating ZIP:", err);
      alert("Failed to generate ZIP file.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSelectAll = (filteredVouchers: Voucher[]) => {
    if (selectedVouchers.length === filteredVouchers.length) {
      setSelectedVouchers([]);
    } else {
      setSelectedVouchers(filteredVouchers.map(v => v.id));
    }
  };

  const toggleSelectVoucher = (id: number) => {
    setSelectedVouchers(prev => 
      prev.includes(id) ? prev.filter(vId => vId !== id) : [...prev, id]
    );
  };

  const handleCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingCustomer ? 'PUT' : 'POST';
    const url = editingCustomer ? `/api/customers/${editingCustomer.id}` : '/api/customers';
    
    try {
      const res = await authFetch(url, {
        method,
        body: JSON.stringify(customerForm)
      });
      if (res.ok) {
        setIsCustomerModalOpen(false);
        setEditingCustomer(null);
        setCustomerForm({ name: '', email: '', phone: '', address: '' });
        fetchCustomers();
      }
    } catch (err) {
      console.error('Error saving customer:', err);
    }
  };

  const handleDeleteCustomer = async (id: number) => {
    if (!confirm('Are you sure you want to delete this customer?')) return;
    try {
      const res = await authFetch(`/api/customers/${id}`, { method: 'DELETE' });
      if (res.ok) fetchCustomers();
    } catch (err) {
      console.error('Error deleting customer:', err);
    }
  };

  const handleExportCustomersCSV = () => {
    const filtered = customers.filter(c => 
      c.name.toLowerCase().includes(customerSearch.toLowerCase()) || 
      (c.email && c.email.toLowerCase().includes(customerSearch.toLowerCase())) || 
      (c.phone && c.phone.includes(customerSearch))
    );
    
    if (filtered.length === 0) {
      alert("No customers to export.");
      return;
    }

    const headers = ["Name", "Email", "Phone", "Address", "Joined Date"];
    const rows = filtered.map(c => [
      c.name,
      c.email || "N/A",
      c.phone || "N/A",
      c.address || "N/A",
      new Date(c.created_at).toLocaleDateString()
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(r => r.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `customers_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePackageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let finalDuration = packageForm.duration_minutes;
    if (packageDurationUnit === 'hours') finalDuration *= 60;
    else if (packageDurationUnit === 'days') finalDuration *= 1440;
    else if (packageDurationUnit === 'weeks') finalDuration *= 10080;

    try {
      const res = await authFetch('/api/packages', {
        method: 'POST',
        body: JSON.stringify({ ...packageForm, duration_minutes: finalDuration })
      });
      if (res.ok) {
        setIsPackageModalOpen(false);
        setPackageForm({ name: '', duration_minutes: 60, price: 1000, description: '', data_limit_mb: 0 });
        setPackageDurationUnit('minutes');
        fetchPackages();
      }
    } catch (err) {
      console.error('Error saving package:', err);
    }
  };

  const openEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setCustomerForm({
      name: customer.name,
      email: customer.email || '',
      phone: customer.phone || '',
      address: customer.address || ''
    });
    setIsCustomerModalOpen(true);
  };

  const downloadQRCode = (code: string) => {
    const canvas = document.getElementById('voucher-qr-code') as HTMLCanvasElement;
    if (canvas) {
      const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      let downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `voucher-${code}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  const handleExportCSV = () => {
    const filtered = getFilteredVouchers();
    if (filtered.length === 0) {
      alert("No vouchers to export.");
      return;
    }
    exportToCSV(filtered, "vouchers_filtered_export");
  };

  const handleExportSelectedCSV = () => {
    if (selectedVouchers.length === 0) {
      alert("No vouchers selected to export.");
      return;
    }
    const selected = vouchers.filter(v => selectedVouchers.includes(v.id));
    exportToCSV(selected, "vouchers_selected_export");
  };

  const handleFilteredDownloadQR = async () => {
    const filtered = getFilteredVouchers();
    if (filtered.length === 0) {
      alert("No vouchers to download.");
      return;
    }
    
    const confirmMsg = `Generate and download QR codes for ${filtered.length} vouchers as a single ZIP file?`;
    if (!confirm(confirmMsg)) return;

    setIsLoading(true);
    const zip = new JSZip();
    const folder = zip.folder("filtered-vouchers");

    for (const voucher of filtered) {
      try {
        const dataUrl = await QRCode.toDataURL(voucher.code, {
          width: 512,
          margin: 2,
          errorCorrectionLevel: 'H'
        });
        // Extract base64 data
        const base64Data = dataUrl.split(',')[1];
        folder?.file(`voucher-${voucher.code}.png`, base64Data, { base64: true });
      } catch (err) {
        console.error(`Error generating QR for ${voucher.code}:`, err);
      }
    }

    try {
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `filtered-vouchers-${new Date().getTime()}.zip`);
    } catch (err) {
      console.error("Error generating ZIP:", err);
      alert("Failed to generate ZIP file.");
    } finally {
      setIsLoading(false);
    }
  };

  const exportToCSV = (voucherList: Voucher[], fileName: string) => {
    const headers = ["Code", "Duration (Minutes)", "Price", "Status", "Data Limit (MB)", "Upload Limit (Mbps)", "Download Limit (Mbps)", "Expiry Date", "Creation Date"];
    const rows = voucherList.map(v => [
      v.code,
      v.duration_minutes,
      v.price,
      v.status,
      v.data_limit_mb === 0 ? "Unlimited" : v.data_limit_mb,
      v.upload_limit === 0 ? "No Limit" : v.upload_limit,
      v.download_limit === 0 ? "No Limit" : v.download_limit,
      v.expires_at ? new Date(v.expires_at).toLocaleString() : "Never",
      new Date(v.created_at).toLocaleString()
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${fileName}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetFilters = () => {
    setVoucherSearch('');
    setFilterStatus('all');
    setFilterDuration('all');
    setFilterCreatedAfter('');
    setFilterCreatedBefore('');
    setFilterExpiresAfter('');
    setFilterExpiresBefore('');
    setFilterUploadLimit('all');
    setFilterDownloadLimit('all');
    setFilterDataLimit('all');
    setSelectedVouchers([]);
  };

  const getFilteredVouchers = () => {
    return vouchers.filter(v => {
      const s = voucherSearch.toLowerCase();
      const matchesSearch = v.code.toLowerCase().includes(s) || 
                           v.status.toLowerCase().includes(s) ||
                           v.duration_minutes.toString().includes(s) ||
                           v.price.toString().includes(s) ||
                           (v.expires_at && v.expires_at.toLowerCase().includes(s)) ||
                           (v.expires_at && new Date(v.expires_at).toLocaleDateString().toLowerCase().includes(s));
      
      const matchesStatus = filterStatus === 'all' || v.status === filterStatus;
      
      let matchesDuration = true;
      if (filterDuration === 'none') matchesDuration = v.duration_minutes === 0;
      else if (filterDuration === 'short') matchesDuration = v.duration_minutes > 0 && v.duration_minutes < 30;
      else if (filterDuration === 'medium') matchesDuration = v.duration_minutes >= 30 && v.duration_minutes <= 60;
      else if (filterDuration === 'long') matchesDuration = v.duration_minutes > 60;

      let matchesCreatedRange = true;
      if (filterCreatedAfter) matchesCreatedRange = matchesCreatedRange && new Date(v.created_at) >= new Date(filterCreatedAfter);
      if (filterCreatedBefore) matchesCreatedRange = matchesCreatedRange && new Date(v.created_at) <= new Date(filterCreatedBefore + 'T23:59:59');

      let matchesExpiresRange = true;
      if (filterExpiresAfter) matchesExpiresRange = matchesExpiresRange && v.expires_at && new Date(v.expires_at) >= new Date(filterExpiresAfter);
      if (filterExpiresBefore) matchesExpiresRange = matchesExpiresRange && v.expires_at && new Date(v.expires_at) <= new Date(filterExpiresBefore + 'T23:59:59');

      let matchesUpload = true;
      if (filterUploadLimit === 'none') matchesUpload = v.upload_limit === 0;
      else if (filterUploadLimit === 'low') matchesUpload = v.upload_limit > 0 && v.upload_limit < 1;
      else if (filterUploadLimit === 'medium') matchesUpload = v.upload_limit >= 1 && v.upload_limit <= 10;
      else if (filterUploadLimit === 'high') matchesUpload = v.upload_limit > 10;

      let matchesDownload = true;
      if (filterDownloadLimit === 'none') matchesDownload = v.download_limit === 0;
      else if (filterDownloadLimit === 'low') matchesDownload = v.download_limit > 0 && v.download_limit < 1;
      else if (filterDownloadLimit === 'medium') matchesDownload = v.download_limit >= 1 && v.download_limit <= 10;
      else if (filterDownloadLimit === 'high') matchesDownload = v.download_limit > 10;

      let matchesData = true;
      if (filterDataLimit === 'none') matchesData = v.data_limit_mb === 0;
      else if (filterDataLimit === 'low') matchesData = v.data_limit_mb > 0 && v.data_limit_mb < 100;
      else if (filterDataLimit === 'medium') matchesData = v.data_limit_mb >= 100 && v.data_limit_mb <= 500;
      else if (filterDataLimit === 'high') matchesData = v.data_limit_mb > 500;

      return matchesSearch && matchesStatus && matchesDuration && matchesCreatedRange && matchesExpiresRange && matchesUpload && matchesDownload && matchesData;
    }).sort((a, b) => {
      let valA = a[sortColumn as keyof Voucher];
      let valB = b[sortColumn as keyof Voucher];

      if (valA === null || valA === undefined) valA = '';
      if (valB === null || valB === undefined) valB = '';

      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortDirection === 'asc' 
          ? valA.localeCompare(valB) 
          : valB.localeCompare(valA);
      }

      if (sortDirection === 'asc') {
        return (valA as any) > (valB as any) ? 1 : -1;
      } else {
        return (valA as any) < (valB as any) ? 1 : -1;
      }
    });
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (view === 'admin' && !isAuthenticated) {
    return <Login onLogin={handleLogin} error={loginError} loading={isAuthLoading} />;
  }

  if (view === 'portal') {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 sm:p-6 font-sans relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-2xl relative z-10"
        >
          {/* Header Section */}
          <div className="p-8 pb-4 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-500 rounded-3xl mb-6 shadow-2xl shadow-emerald-500/40 transform -rotate-6">
              <Wifi className="text-white" size={40} />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tighter mb-1">ASANSL <span className="text-emerald-500">HOTSPOT</span></h1>
            <p className="text-zinc-500 text-sm font-medium uppercase tracking-widest">Premium Internet Access</p>
          </div>

          {/* Tab Navigation */}
          <div className="px-8 mb-6">
            <div className="flex bg-zinc-950/50 p-1.5 rounded-2xl border border-zinc-800">
              <button 
                onClick={() => setPortalTab('connect')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${portalTab === 'connect' ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                CONNECT
              </button>
              <button 
                onClick={() => setPortalTab('pricing')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${portalTab === 'pricing' ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                PRICING
              </button>
              <button 
                onClick={() => setPortalTab('help')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${portalTab === 'help' ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                HELP
              </button>
            </div>
          </div>

          {/* Content Section */}
          <div className="px-8 pb-8">
            <AnimatePresence mode="wait">
              {portalTab === 'connect' && (
                <motion.div
                  key="connect"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <form onSubmit={handleRedeem} className="space-y-4">
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                        <Ticket className="text-zinc-600 group-focus-within:text-emerald-500 transition-colors" size={20} />
                      </div>
                      <input
                        type="text"
                        value={voucherCode}
                        onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                        placeholder="VOUCHER CODE"
                        className="w-full bg-zinc-950 border border-zinc-800 text-white pl-14 pr-6 py-5 rounded-2xl focus:outline-none focus:border-emerald-500 transition-all text-xl font-mono tracking-[0.3em] placeholder:text-zinc-700 placeholder:tracking-normal"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-emerald-500/20 disabled:opacity-50 flex items-center justify-center gap-3 group"
                    >
                      {isLoading ? (
                        <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <span className="tracking-widest uppercase">Connect Now</span>
                          <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </form>

                  <div className="flex items-center gap-4 py-2">
                    <div className="h-px flex-1 bg-zinc-800" />
                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Quick Info</span>
                    <div className="h-px flex-1 bg-zinc-800" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-zinc-950/50 border border-zinc-800 p-4 rounded-2xl">
                      <Zap className="text-amber-500 mb-2" size={20} />
                      <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Speed</div>
                      <div className="text-sm font-bold text-white">Up to 50 Mbps</div>
                    </div>
                    <div className="bg-zinc-950/50 border border-zinc-800 p-4 rounded-2xl">
                      <Shield className="text-blue-500 mb-2" size={20} />
                      <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Security</div>
                      <div className="text-sm font-bold text-white">WPA3 Secure</div>
                    </div>
                  </div>
                </motion.div>
              )}

              {portalTab === 'pricing' && (
                <motion.div
                  key="pricing"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-bold text-white">Available Packages</h3>
                    <p className="text-zinc-500 text-xs">Choose the best plan for your needs</p>
                  </div>

                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {packages.length > 0 ? packages.map((pkg) => (
                      <div key={pkg.id} className="bg-zinc-950/50 border border-zinc-800 p-4 rounded-2xl flex items-center justify-between group hover:border-emerald-500/30 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center border border-zinc-800 group-hover:bg-emerald-500/10 transition-colors">
                            <Clock className="text-emerald-500" size={24} />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-white">{pkg.name}</div>
                            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                              {formatDuration(pkg.duration_minutes)}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-black text-emerald-500">₱{pkg.price}</div>
                          <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">One-time</div>
                        </div>
                      </div>
                    )) : (
                      <div className="text-center py-8 text-zinc-600 italic text-sm">
                        No packages available at the moment.
                      </div>
                    )}
                  </div>

                  <div className="bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-2xl mt-4">
                    <div className="flex items-center gap-3 text-emerald-400 mb-1">
                      <Info size={16} />
                      <span className="text-xs font-bold uppercase tracking-widest">How to Buy</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      Visit our nearest authorized agent or scan the QR code at the counter to purchase a voucher.
                    </p>
                  </div>
                </motion.div>
              )}

              {portalTab === 'help' && (
                <motion.div
                  key="help"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <div className="bg-zinc-950/50 border border-zinc-800 p-5 rounded-2xl">
                      <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                        <Smartphone className="text-emerald-500" size={18} />
                        Contact Support
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-zinc-500">Phone</span>
                          <span className="text-xs font-bold text-white">+63 912 345 6789</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-zinc-500">Messenger</span>
                          <span className="text-xs font-bold text-white">ASANSL</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-zinc-500">Location</span>
                          <span className="text-xs font-bold text-white">Main Street, City</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-zinc-950/50 border border-zinc-800 p-5 rounded-2xl">
                      <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                        <HelpCircle className="text-blue-500" size={18} />
                        Common Issues
                      </h4>
                      <ul className="space-y-3">
                        <li className="text-[11px] text-zinc-400 flex items-start gap-2">
                          <div className="w-1 h-1 bg-emerald-500 rounded-full mt-1.5 shrink-0" />
                          Voucher code is case-sensitive (use uppercase).
                        </li>
                        <li className="text-[11px] text-zinc-400 flex items-start gap-2">
                          <div className="w-1 h-1 bg-emerald-500 rounded-full mt-1.5 shrink-0" />
                          One voucher per device only.
                        </li>
                        <li className="text-[11px] text-zinc-400 flex items-start gap-2">
                          <div className="w-1 h-1 bg-emerald-500 rounded-full mt-1.5 shrink-0" />
                          Ensure you are connected to "ASANSL Hotspot" Wi-Fi.
                        </li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {portalStatus.type && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className={`mt-6 p-4 rounded-2xl flex items-start gap-3 border ${
                    portalStatus.type === 'success' 
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                      : 'bg-red-500/10 border-red-500/20 text-red-400'
                  }`}
                >
                  {portalStatus.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                  <p className="text-xs font-bold uppercase tracking-wider leading-relaxed">{portalStatus.message}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer Section */}
          <div className="p-6 bg-zinc-950/50 border-t border-zinc-800 text-center">
            <button 
              onClick={() => setView('admin')}
              className="text-zinc-600 hover:text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em] transition-colors"
            >
              Admin Access
            </button>
          </div>
        </motion.div>
        
        <div className="mt-8 text-center relative z-10">
          <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em] mb-1">
            Powered by ASANSL
          </p>
          <div className="flex items-center justify-center gap-4 text-[10px] font-bold text-zinc-700 uppercase tracking-widest">
            <span>Fast</span>
            <div className="w-1 h-1 bg-zinc-800 rounded-full" />
            <span>Secure</span>
            <div className="w-1 h-1 bg-zinc-800 rounded-full" />
            <span>Reliable</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex font-sans text-zinc-300">
      {/* Sidebar */}
      <aside className="w-72 border-r border-zinc-800 flex flex-col p-6 overflow-y-auto custom-scrollbar">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <Wifi className="text-white" size={16} />
            </div>
            <span className="text-2xl font-black text-white tracking-tighter">ASANSL</span>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          <SidebarItem 
            icon={LayoutDashboard} 
            label="Dashboard" 
            active={adminTab === 'dashboard'} 
            onClick={() => setAdminTab('dashboard')} 
          />
          <SidebarItem 
            icon={Router} 
            label="Router" 
            active={adminTab === 'router'} 
            onClick={() => setAdminTab('router')} 
          />
          <SidebarItem 
            icon={BarChart3} 
            label="Usage Analytics" 
            active={adminTab === 'analytics'} 
            onClick={() => setAdminTab('analytics')} 
          />

          {/* Sales Menu */}
          <div className="space-y-1">
            <button 
              onClick={() => toggleMenu('sales')}
              className="w-full flex items-center justify-between px-4 py-3 text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-all group"
            >
              <div className="flex items-center gap-3">
                <DollarSign size={20} className="group-hover:text-emerald-500 transition-colors" />
                <span className="font-medium">Sales</span>
              </div>
              <ChevronDown size={16} className={`transition-transform ${expandedMenus.includes('sales') ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {expandedMenus.includes('sales') && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden pl-11 space-y-1"
                >
                  <button onClick={() => setAdminTab('sales-all')} className={`w-full text-left p-2 text-xs font-bold rounded-lg transition-colors ${adminTab === 'sales-all' ? 'text-emerald-400 bg-emerald-500/5' : 'text-zinc-500 hover:text-zinc-300'}`}>All</button>
                  <button onClick={() => setAdminTab('sales-trash')} className={`w-full text-left p-2 text-xs font-bold rounded-lg transition-colors ${adminTab === 'sales-trash' ? 'text-emerald-400 bg-emerald-500/5' : 'text-zinc-500 hover:text-zinc-300'}`}>Trash</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Float Menu */}
          <div className="space-y-1">
            <button 
              onClick={() => toggleMenu('float')}
              className="w-full flex items-center justify-between px-4 py-3 text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-all group"
            >
              <div className="flex items-center gap-3">
                <Wallet size={20} className="group-hover:text-emerald-500 transition-colors" />
                <span className="font-medium">Float</span>
              </div>
              <ChevronDown size={16} className={`transition-transform ${expandedMenus.includes('float') ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {expandedMenus.includes('float') && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden pl-11 space-y-1"
                >
                  <button onClick={() => setAdminTab('float-manage')} className={`w-full text-left p-2 text-xs font-bold rounded-lg transition-colors ${adminTab === 'float-manage' ? 'text-emerald-400 bg-emerald-500/5' : 'text-zinc-500 hover:text-zinc-300'}`}>Manage</button>
                  <button onClick={() => setAdminTab('float-purchases')} className={`w-full text-left p-2 text-xs font-bold rounded-lg transition-colors ${adminTab === 'float-purchases' ? 'text-emerald-400 bg-emerald-500/5' : 'text-zinc-500 hover:text-zinc-300'}`}>Purchases</button>
                  <button onClick={() => setAdminTab('float-transactions')} className={`w-full text-left p-2 text-xs font-bold rounded-lg transition-colors ${adminTab === 'float-transactions' ? 'text-emerald-400 bg-emerald-500/5' : 'text-zinc-500 hover:text-zinc-300'}`}>Transactions</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Users Menu */}
          <div className="space-y-1">
            <button 
              onClick={() => toggleMenu('users')}
              className="w-full flex items-center justify-between px-4 py-3 text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-all group"
            >
              <div className="flex items-center gap-3">
                <Users size={20} className="group-hover:text-emerald-500 transition-colors" />
                <span className="font-medium">Users</span>
              </div>
              <ChevronDown size={16} className={`transition-transform ${expandedMenus.includes('users') ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {expandedMenus.includes('users') && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden pl-11 space-y-1"
                >
                  <button onClick={() => setAdminTab('users-staff')} className={`w-full text-left p-2 text-xs font-bold rounded-lg transition-colors ${adminTab === 'users-staff' ? 'text-emerald-400 bg-emerald-500/5' : 'text-zinc-500 hover:text-zinc-300'}`}>Staff</button>
                  <button onClick={() => setAdminTab('users-customers')} className={`w-full text-left p-2 text-xs font-bold rounded-lg transition-colors ${adminTab === 'users-customers' ? 'text-emerald-400 bg-emerald-500/5' : 'text-zinc-500 hover:text-zinc-300'}`}>Customers</button>
                  <button onClick={() => setAdminTab('users-roles')} className={`w-full text-left p-2 text-xs font-bold rounded-lg transition-colors ${adminTab === 'users-roles' ? 'text-emerald-400 bg-emerald-500/5' : 'text-zinc-500 hover:text-zinc-300'}`}>Roles</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <SidebarItem 
            icon={Package} 
            label="Packages" 
            active={adminTab === 'packages'} 
            onClick={() => setAdminTab('packages')} 
          />
          <SidebarItem 
            icon={CreditCard} 
            label="Transactions" 
            active={adminTab === 'transactions'} 
            onClick={() => setAdminTab('transactions')} 
          />
          <SidebarItem 
            icon={DollarSign} 
            label="Disbursements" 
            active={adminTab === 'disbursements'} 
            onClick={() => setAdminTab('disbursements')} 
          />
          <SidebarItem 
            icon={Users} 
            label="Agent" 
            active={adminTab === 'agent'} 
            onClick={() => setAdminTab('agent')} 
          />
          <SidebarItem 
            icon={Ticket} 
            label="Vouchers" 
            active={adminTab === 'vouchers'} 
            onClick={() => setAdminTab('vouchers')} 
          />
          <SidebarItem 
            icon={Users} 
            label="Customers" 
            active={adminTab === 'customers'} 
            onClick={() => setAdminTab('customers')} 
          />
          <SidebarItem 
            icon={Globe} 
            label="Remote Access" 
            active={adminTab === 'remote'} 
            onClick={() => setAdminTab('remote')} 
          />

          {/* Settings Menu */}
          <div className="space-y-1">
            <button 
              onClick={() => toggleMenu('settings')}
              className="w-full flex items-center justify-between px-4 py-3 text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-all group"
            >
              <div className="flex items-center gap-3">
                <SettingsIcon size={20} className="group-hover:text-emerald-500 transition-colors" />
                <span className="font-medium">Settings</span>
              </div>
              <ChevronDown size={16} className={`transition-transform ${expandedMenus.includes('settings') ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {expandedMenus.includes('settings') && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden pl-11 space-y-1"
                >
                  <button onClick={() => setAdminTab('settings-general')} className={`w-full text-left p-2 text-xs font-bold rounded-lg transition-colors ${adminTab === 'settings-general' ? 'text-emerald-400 bg-emerald-500/5' : 'text-zinc-500 hover:text-zinc-300'}`}>General</button>
                  <button onClick={() => setAdminTab('settings-vouchers')} className={`w-full text-left p-2 text-xs font-bold rounded-lg transition-colors ${adminTab === 'settings-vouchers' ? 'text-emerald-400 bg-emerald-500/5' : 'text-zinc-500 hover:text-zinc-300'}`}>Voucher Generation</button>
                  <button onClick={() => setAdminTab('settings-router')} className={`w-full text-left p-2 text-xs font-bold rounded-lg transition-colors ${adminTab === 'settings-router' ? 'text-emerald-400 bg-emerald-500/5' : 'text-zinc-500 hover:text-zinc-300'}`}>Router Setup</button>
                  <button onClick={() => setAdminTab('settings-templates')} className={`w-full text-left p-2 text-xs font-bold rounded-lg transition-colors ${adminTab === 'settings-templates' ? 'text-emerald-400 bg-emerald-500/5' : 'text-zinc-500 hover:text-zinc-300'}`}>Captive Templates</button>
                  <button onClick={() => setAdminTab('settings-sms')} className={`w-full text-left p-2 text-xs font-bold rounded-lg transition-colors ${adminTab === 'settings-sms' ? 'text-emerald-400 bg-emerald-500/5' : 'text-zinc-500 hover:text-zinc-300'}`}>SMS</button>
                  <button onClick={() => setAdminTab('settings-gateways')} className={`w-full text-left p-2 text-xs font-bold rounded-lg transition-colors ${adminTab === 'settings-gateways' ? 'text-emerald-400 bg-emerald-500/5' : 'text-zinc-500 hover:text-zinc-300'}`}>Payment Gateways</button>
                  <button onClick={() => setAdminTab('settings-advanced')} className={`w-full text-left p-2 text-xs font-bold rounded-lg transition-colors ${adminTab === 'settings-advanced' ? 'text-emerald-400 bg-emerald-500/5' : 'text-zinc-500 hover:text-zinc-300'}`}>Advanced</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Billing Menu */}
          <div className="space-y-1">
            <button 
              onClick={() => toggleMenu('billing')}
              className="w-full flex items-center justify-between px-4 py-3 text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-all group"
            >
              <div className="flex items-center gap-3">
                <Shield size={20} className="group-hover:text-emerald-500 transition-colors" />
                <span className="font-medium">Billing</span>
              </div>
              <ChevronDown size={16} className={`transition-transform ${expandedMenus.includes('billing') ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {expandedMenus.includes('billing') && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden pl-11 space-y-1"
                >
                  <button onClick={() => setAdminTab('billing-history')} className={`w-full text-left p-2 text-xs font-bold rounded-lg transition-colors ${adminTab === 'billing-history' ? 'text-emerald-400 bg-emerald-500/5' : 'text-zinc-500 hover:text-zinc-300'}`}>History</button>
                  <button onClick={() => setAdminTab('billing-payments')} className={`w-full text-left p-2 text-xs font-bold rounded-lg transition-colors ${adminTab === 'billing-payments' ? 'text-emerald-400 bg-emerald-500/5' : 'text-zinc-500 hover:text-zinc-300'}`}>Payments</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <SidebarItem 
            icon={HelpCircle} 
            label="Support" 
            active={adminTab === 'support'} 
            onClick={() => setAdminTab('support')} 
          />
        </nav>

        <div className="mt-auto pt-6 border-t border-zinc-800 space-y-4">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center text-emerald-500 font-bold">
              {authUser?.username?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{authUser?.username}</p>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{authUser?.role}</p>
            </div>
          </div>
          <div className="space-y-1">
            <button 
              onClick={() => setView('portal')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-zinc-500 hover:bg-zinc-800 hover:text-zinc-100 transition-all font-bold text-xs"
            >
              <LogOut size={18} />
              <span>EXIT TO PORTAL</span>
            </button>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all font-bold text-xs"
            >
              <Shield size={18} />
              <span>LOGOUT</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-20 border-b border-zinc-800 flex items-center justify-between px-8 bg-zinc-950/50 backdrop-blur-xl sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-xs font-bold text-white uppercase tracking-widest">ASANSL HOTSPOT</span>
              <ChevronDown size={14} className="text-zinc-500" />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors cursor-pointer">
              <Moon size={20} />
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold text-white uppercase tracking-wide">ASANSL HOTSPOT</div>
                <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Administrator</div>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                AH
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto custom-scrollbar">
          <div className="mb-8">
            <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              ASANSL HOTSPOT
            </div>
            <h2 className="text-4xl font-black text-white tracking-tight mb-4">Dashboard</h2>
            <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 w-fit cursor-pointer hover:bg-zinc-800 transition-colors">
              <Calendar size={16} className="text-zinc-500" />
              <span className="text-sm font-bold text-white">
                {salesHistory.length > 0 
                  ? `${new Date(salesHistory[0].date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })} - ${new Date(salesHistory[salesHistory.length - 1].date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}`
                  : 'Last 7 Days'}
              </span>
              <ChevronDown size={16} className="text-zinc-500" />
            </div>
          </div>

        {adminTab === 'router' && <PlaceholderView title="Router Management" icon={Router} />}
        {adminTab === 'analytics' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-white">Usage Analytics</h3>
                <p className="text-zinc-500 text-sm">Data consumption distribution across vouchers (Top 20 by usage)</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl">
                  <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Total Network Traffic</div>
                  <div className="text-lg font-bold text-emerald-500">
                    {formatBytes(vouchers.reduce((acc, v) => acc + (v.total_bytes_up || 0) + (v.total_bytes_down || 0), 0))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl h-[500px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={vouchers
                    .filter(v => (v.total_bytes_up || 0) > 0 || (v.total_bytes_down || 0) > 0)
                    .map(v => ({
                      name: v.code,
                      upload: Number(((v.total_bytes_up || 0) / (1024 * 1024 * 1024)).toFixed(3)),
                      download: Number(((v.total_bytes_down || 0) / (1024 * 1024 * 1024)).toFixed(3)),
                    }))
                    .sort((a, b) => (b.upload + b.download) - (a.upload + a.download))
                    .slice(0, 20)
                  }
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#71717a" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                    angle={-45}
                    textAnchor="end"
                    interval={0}
                  />
                  <YAxis 
                    stroke="#71717a" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                    label={{ value: 'Data Usage (GB)', angle: -90, position: 'insideLeft', fill: '#71717a', fontSize: 12, offset: 10 }}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                    itemStyle={{ fontSize: '12px' }}
                    labelStyle={{ color: '#fff', fontWeight: 'bold', marginBottom: '4px' }}
                    formatter={(value: number) => [`${value} GB`]}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar dataKey="upload" name="Upload (GB)" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="download" name="Download (GB)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
                <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-widest">Top Uploaders</h4>
                <div className="space-y-4">
                  {vouchers
                    .sort((a, b) => (b.total_bytes_up || 0) - (a.total_bytes_up || 0))
                    .slice(0, 5)
                    .map((v, i) => (
                      <div key={v.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-xs font-bold text-zinc-600">0{i+1}</div>
                          <div className="font-mono text-sm text-white">{v.code}</div>
                        </div>
                        <div className="text-sm font-bold text-emerald-500">{formatBytes(v.total_bytes_up || 0)}</div>
                      </div>
                    ))}
                  {vouchers.filter(v => (v.total_bytes_up || 0) > 0).length === 0 && (
                    <div className="text-center py-4 text-zinc-500 text-sm italic">No upload data recorded.</div>
                  )}
                </div>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
                <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-widest">Top Downloaders</h4>
                <div className="space-y-4">
                  {vouchers
                    .sort((a, b) => (b.total_bytes_down || 0) - (a.total_bytes_down || 0))
                    .slice(0, 5)
                    .map((v, i) => (
                      <div key={v.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-xs font-bold text-zinc-600">0{i+1}</div>
                          <div className="font-mono text-sm text-white">{v.code}</div>
                        </div>
                        <div className="text-sm font-bold text-blue-500">{formatBytes(v.total_bytes_down || 0)}</div>
                      </div>
                    ))}
                  {vouchers.filter(v => (v.total_bytes_down || 0) > 0).length === 0 && (
                    <div className="text-center py-4 text-zinc-500 text-sm italic">No download data recorded.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        {adminTab.startsWith('sales-') && <PlaceholderView title="Sales Management" icon={DollarSign} />}
        {adminTab.startsWith('float-') && <PlaceholderView title="Float Management" icon={Wallet} />}
        
        {adminTab === 'users-staff' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h3 className="text-xl font-bold text-white">Staff Management</h3>
              <div className="flex items-center gap-4">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                  <input 
                    type="text"
                    placeholder="Search staff..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 transition-all"
                  />
                </div>
                <button className="bg-emerald-500 hover:bg-emerald-400 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all">Add Staff</button>
              </div>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-zinc-950 border-b border-zinc-800">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Username</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Role</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Email</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {users
                    .filter(u => u.role === 'staff' && (u.username.toLowerCase().includes(userSearch.toLowerCase()) || (u.email && u.email.toLowerCase().includes(userSearch.toLowerCase()))))
                    .map(u => (
                    <tr key={u.id} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="px-6 py-4 font-bold text-white">{u.username}</td>
                      <td className="px-6 py-4 text-sm uppercase">{u.role}</td>
                      <td className="px-6 py-4 text-sm text-zinc-500">{u.email || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-zinc-500">{new Date(u.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {users.filter(u => u.role === 'staff' && (u.username.toLowerCase().includes(userSearch.toLowerCase()) || (u.email && u.email.toLowerCase().includes(userSearch.toLowerCase()))))
                    .length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-10 text-center text-zinc-500">No staff members found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {adminTab === 'customers' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h3 className="text-xl font-bold text-white">Customer Management</h3>
              <div className="flex items-center gap-4">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                  <input 
                    type="text"
                    placeholder="Search customers..."
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 transition-all"
                  />
                </div>
                <button 
                  onClick={handleExportCustomersCSV}
                  className="bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2"
                  title="Export currently displayed customers to CSV"
                >
                  <Download size={18} />
                  <span>Export CSV</span>
                </button>
                <button 
                  onClick={() => {
                    setEditingCustomer(null);
                    setCustomerForm({ name: '', email: '', phone: '', address: '' });
                    setIsCustomerModalOpen(true);
                  }}
                  className="bg-emerald-500 hover:bg-emerald-400 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2"
                >
                  <Plus size={18} />
                  <span>Add Customer</span>
                </button>
              </div>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-zinc-950 border-b border-zinc-800">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Name</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Contact</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Address</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {customers
                    .filter(c => c.name.toLowerCase().includes(customerSearch.toLowerCase()) || (c.email && c.email.toLowerCase().includes(customerSearch.toLowerCase())) || (c.phone && c.phone.includes(customerSearch)))
                    .map(c => (
                    <tr key={c.id} className="hover:bg-zinc-800/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-bold text-white">{c.name}</div>
                        <div className="text-[10px] text-zinc-500 uppercase tracking-widest">Joined {new Date(c.created_at).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-zinc-300">{c.email || 'No Email'}</div>
                        <div className="text-sm text-zinc-500">{c.phone || 'No Phone'}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-500 max-w-xs truncate">{c.address || 'N/A'}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => setViewingCustomer(c)}
                            className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
                            title="View Details"
                          >
                            <Info size={16} />
                          </button>
                          <button 
                            onClick={() => openEditCustomer(c)}
                            className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-emerald-400 transition-colors"
                            title="Edit"
                          >
                            <SettingsIcon size={16} />
                          </button>
                          <button 
                            onClick={() => handleDeleteCustomer(c.id)}
                            className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-red-400 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {customers.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-20 text-center text-zinc-500">
                        <div className="flex flex-col items-center gap-3">
                          <Users size={48} className="text-zinc-800" />
                          <p>No customers found. Start by adding one!</p>
                          <button 
                            onClick={() => {
                              setEditingCustomer(null);
                              setCustomerForm({ name: '', email: '', phone: '', address: '' });
                              setIsCustomerModalOpen(true);
                            }}
                            className="mt-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-4 py-2 rounded-xl text-xs font-bold hover:bg-emerald-500/20 transition-all flex items-center gap-2"
                          >
                            <Plus size={14} />
                            <span>Add Your First Customer</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {adminTab === 'packages' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Internet Packages</h3>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsPackageModalOpen(true)}
                  className="bg-emerald-500 hover:bg-emerald-400 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all"
                >
                  Create Package
                </button>
                <button 
                  onClick={() => {
                    if (selectedVouchers.length === 0) {
                      alert("Please select vouchers in the Vouchers tab first to view their QR codes.");
                      return;
                    }
                    setIsViewQRModalOpen(true);
                  }}
                  className="bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2"
                >
                  <QrCode size={16} />
                  View Selected QR Codes
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {packages.map(p => (
                <div key={p.id} className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl hover:border-emerald-500/50 transition-all group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-emerald-500/10 rounded-xl">
                      <Package className="text-emerald-500" size={24} />
                    </div>
                    <div className="text-2xl font-black text-white">UGX {p.price}</div>
                  </div>
                  <h4 className="text-lg font-bold text-white mb-1">{p.name}</h4>
                  <p className="text-zinc-500 text-sm mb-4">{p.description || 'No description provided.'}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                    <div className="flex flex-col gap-1">
                      <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{formatDuration(p.duration_minutes)}</div>
                      <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                        {p.data_limit_mb > 0 ? `${p.data_limit_mb} MB Data` : 'Unlimited Data'}
                      </div>
                    </div>
                    <button className="text-xs font-bold text-emerald-500 hover:text-emerald-400 uppercase tracking-widest">Edit</button>
                  </div>
                </div>
              ))}
              {packages.length === 0 && (
                <div className="col-span-3 py-20 text-center text-zinc-500 bg-zinc-900/50 border border-dashed border-zinc-800 rounded-2xl">
                  No packages defined yet.
                </div>
              )}
            </div>
          </div>
        )}

        {adminTab === 'transactions' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h3 className="text-xl font-bold text-white">Transaction History</h3>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                <input 
                  type="text"
                  placeholder="Search transactions..."
                  value={transactionSearch}
                  onChange={(e) => setTransactionSearch(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 transition-all"
                />
              </div>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-zinc-950 border-b border-zinc-800">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Type</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Amount</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Description</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {transactions
                    .filter(t => t.type.toLowerCase().includes(transactionSearch.toLowerCase()) || t.description.toLowerCase().includes(transactionSearch.toLowerCase()))
                    .map(t => (
                    <tr key={t.id} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${t.type === 'sale' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                          {t.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-white">UGX {t.amount.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-zinc-500">{t.description}</td>
                      <td className="px-6 py-4 text-sm text-zinc-500">{new Date(t.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                  {transactions.filter(t => t.type.toLowerCase().includes(transactionSearch.toLowerCase()) || t.description.toLowerCase().includes(transactionSearch.toLowerCase()))
                    .length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-10 text-center text-zinc-500">No transactions recorded.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {adminTab === 'users-roles' && <PlaceholderView title="Role Management" icon={Shield} />}
        {adminTab === 'disbursements' && <PlaceholderView title="Disbursements" icon={DollarSign} />}
        {adminTab === 'agent' && <PlaceholderView title="Agent Portal" icon={Users} />}
        {adminTab === 'remote' && <PlaceholderView title="Remote Access" icon={Globe} />}
        {adminTab === 'settings-vouchers' && (
          <div className="max-w-4xl space-y-8">
            <div>
              <h3 className="text-2xl font-black text-white tracking-tight mb-2">Voucher Generation Settings</h3>
              <p className="text-zinc-500 text-sm">Configure default parameters for mass voucher generation.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-emerald-500/10 rounded-lg">
                    <Ticket className="text-emerald-500" size={20} />
                  </div>
                  <h4 className="font-bold text-white uppercase tracking-widest text-xs">Basic Configuration</h4>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Default Quantity</label>
                    <input 
                      type="number" 
                      value={genCount}
                      onChange={(e) => setGenCount(parseInt(e.target.value))}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-emerald-500 transition-all font-bold"
                    />
                    <p className="text-[10px] text-zinc-600 ml-1">Number of vouchers to generate by default.</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Default Duration</label>
                    <div className="flex gap-3">
                      <input 
                        type="number" 
                        value={genDuration}
                        onChange={(e) => setGenDuration(parseInt(e.target.value))}
                        className="flex-1 bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-emerald-500 transition-all font-bold"
                        min="1"
                      />
                      <select
                        value={genDurationUnit}
                        onChange={(e) => setGenDurationUnit(e.target.value as any)}
                        className="w-32 bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-4 text-white focus:outline-none focus:border-emerald-500 transition-all text-xs font-bold uppercase tracking-widest cursor-pointer"
                      >
                        <option value="minutes">Min</option>
                        <option value="hours">Hrs</option>
                        <option value="days">Days</option>
                        <option value="weeks">Weeks</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Default Price (UGX)</label>
                    <div className="relative">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500 font-bold text-xs">UGX</span>
                      <input 
                        type="number" 
                        value={genPrice}
                        onChange={(e) => setGenPrice(parseInt(e.target.value))}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl pl-14 pr-5 py-4 text-white focus:outline-none focus:border-emerald-500 transition-all font-bold"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Activity className="text-blue-500" size={20} />
                  </div>
                  <h4 className="font-bold text-white uppercase tracking-widest text-xs">Limits & Validity</h4>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Download (Mbps)</label>
                      <input 
                        type="number" 
                        value={genDownloadLimit}
                        onChange={(e) => setGenDownloadLimit(parseInt(e.target.value))}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-emerald-500 transition-all font-bold"
                        min="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Upload (Mbps)</label>
                      <input 
                        type="number" 
                        value={genUploadLimit}
                        onChange={(e) => setGenUploadLimit(parseInt(e.target.value))}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-emerald-500 transition-all font-bold"
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Data Limit (MB)</label>
                    <input 
                      type="number" 
                      value={genDataLimit}
                      onChange={(e) => setGenDataLimit(parseInt(e.target.value))}
                      placeholder="0 for Unlimited"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-emerald-500 transition-all font-bold"
                      min="0"
                    />
                    <p className="text-[10px] text-zinc-600 ml-1">Total data allowed per voucher. Set to 0 for unlimited.</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Validity Period (Days)</label>
                    <input 
                      type="number" 
                      value={genValidity}
                      onChange={(e) => setGenValidity(parseInt(e.target.value))}
                      placeholder="0 for Never"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-emerald-500 transition-all font-bold"
                      min="0"
                    />
                    <p className="text-[10px] text-zinc-600 ml-1">Days until voucher expires if not activated.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between bg-zinc-900 border border-zinc-800 p-6 rounded-3xl">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-500/10 rounded-2xl">
                  <Zap className="text-emerald-500" size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-white">Ready to Generate?</h4>
                  <p className="text-zinc-500 text-xs">Generate {genCount} vouchers with the settings above.</p>
                </div>
              </div>
              <button 
                onClick={handleGenerate}
                className="bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-3"
              >
                <Plus size={18} />
                Generate Now
              </button>
            </div>
          </div>
        )}
        {adminTab.startsWith('settings-') && adminTab !== 'settings-vouchers' && <PlaceholderView title="System Settings" icon={SettingsIcon} />}
        {adminTab.startsWith('billing-') && <PlaceholderView title="Billing & Payments" icon={Shield} />}
        {adminTab === 'support' && <PlaceholderView title="Support & Help" icon={HelpCircle} />}

        {adminTab === 'dashboard' && (
          <div className="space-y-8">
            {/* System Insights */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white">System Insights</h3>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Online</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-zinc-950/50 border border-zinc-800/50 p-4 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <Users size={16} className="text-zinc-500" />
                    <span className="text-2xl font-bold text-white">{stats.activeSessions}</span>
                  </div>
                  <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Active</div>
                </div>
                <div className="bg-zinc-950/50 border border-zinc-800/50 p-4 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <Cpu size={16} className="text-zinc-500" />
                    <span className="text-2xl font-bold text-white">{stats.cpuUsage}%</span>
                  </div>
                  <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">CPU</div>
                </div>
                <div className="bg-zinc-950/50 border border-zinc-800/50 p-4 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <Database size={16} className="text-zinc-500" />
                    <span className="text-2xl font-bold text-white">{(stats.totalDataUsage / (1024 * 1024 * 1024)).toFixed(2)} GB</span>
                  </div>
                  <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Data Usage</div>
                </div>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl relative overflow-hidden group">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Net Sales</span>
                  <TrendingUp size={20} className="text-emerald-500" />
                </div>
                <div className="text-3xl font-black text-white mb-2">UGX {stats.totalRevenue.toLocaleString()}</div>
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  Agents: UGX {stats.agentCommission.toLocaleString()} | MM: UGX 0 | Vouchers: UGX {stats.totalRevenue.toLocaleString()}
                </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl relative overflow-hidden group">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Vouchers Sales</span>
                  <Ticket size={20} className="text-blue-500" />
                </div>
                <div className="text-3xl font-black text-white mb-2">UGX {stats.totalRevenue.toLocaleString()}</div>
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Total sales from physical vouchers</div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl relative overflow-hidden group">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Balance</span>
                  <Wallet size={20} className="text-amber-500" />
                </div>
                <div className="text-3xl font-black text-white mb-2">UGX {stats.balance.toLocaleString()}</div>
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Net balance on account</div>
              </div>
            </div>

            {/* Overview Chart */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-bold text-white">Overview</h3>
                  <p className="text-zinc-500 text-sm mt-1">
                    {salesHistory.length > 0 
                      ? `${new Date(salesHistory[0].date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })} - ${new Date(salesHistory[salesHistory.length - 1].date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}`
                      : 'Last 7 Days'}
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2">
                  <span className="text-xs font-bold text-white">All ...</span>
                  <ChevronDown size={14} className="text-zinc-500" />
                </div>
              </div>

              <div className="flex items-center gap-2 mb-8">
                <div className="bg-white text-black px-3 py-1 rounded-lg flex items-center gap-2">
                  <Sigma size={14} />
                  <span className="text-xs font-bold">Totals</span>
                </div>
              </div>
              
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      stroke="#71717a" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false}
                      tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                    />
                    <YAxis 
                      stroke="#71717a" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false} 
                      tickFormatter={(val) => `UGX ${val >= 1000 ? (val/1000).toFixed(0) + 'k' : val}`}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px' }}
                      itemStyle={{ color: '#fff', fontSize: '12px' }}
                      labelStyle={{ color: '#71717a', marginBottom: '4px', fontSize: '10px' }}
                    />
                    <Bar dataKey="amount" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-8 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500/20 rounded-sm"></div>
                    <span className="text-zinc-400">Agent Commission</span>
                  </div>
                  <span className="font-bold text-white">UGX {stats.agentCommission.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-emerald-500 rounded-sm"></div>
                    <span className="text-zinc-400">Net Proceeds</span>
                  </div>
                  <span className="font-bold text-white">UGX {stats.netProceeds.toLocaleString()}</span>
                </div>
                <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
                  <span className="text-sm font-bold text-white">Total (Gross)</span>
                  <span className="text-lg font-black text-white">UGX {stats.totalRevenue.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Sales */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-xl font-bold text-white">Recent Sales</h3>
                    <p className="text-zinc-500 text-sm mt-1">You made {recentSales.length} sales today.</p>
                  </div>
                  <button className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors">
                    <span className="text-xs font-bold">Scroll for more</span>
                    <ChevronDown size={14} />
                  </button>
                </div>

                <div className="space-y-6">
                  {recentSales.map((sale, idx) => (
                    <div key={idx} className="flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center overflow-hidden">
                          <img 
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${sale.username || 'user' + idx}`} 
                            alt="avatar" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-bold text-white uppercase tracking-wide">{sale.username || 'MUGERWA WILLIAM'}</h4>
                          <p className="text-xs text-zinc-500">{new Date(sale.used_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ago</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-black text-white">+UGX {sale.amount.toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                  {recentSales.length === 0 && (
                    <div className="py-20 text-center text-zinc-500">No sales recorded today.</div>
                  )}
                </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-white">Quick Generate</h3>
                  <Plus size={20} className="text-zinc-600" />
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Assign to Customer (Optional)</label>
                    <select 
                      value={selectedCustomerId || ''}
                      onChange={(e) => setSelectedCustomerId(e.target.value ? parseInt(e.target.value) : null)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 text-xs font-bold uppercase tracking-widest"
                    >
                      <option value="">No Customer</option>
                      {customers.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Quantity</label>
                      <input 
                        type="number" 
                        value={genCount}
                        onChange={(e) => setGenCount(parseInt(e.target.value))}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Duration</label>
                      <div className="flex gap-2">
                        <input 
                          type="number" 
                          value={genDuration}
                          onChange={(e) => setGenDuration(parseInt(e.target.value))}
                          className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                          min="1"
                        />
                        <select
                          value={genDurationUnit}
                          onChange={(e) => setGenDurationUnit(e.target.value as any)}
                          className="w-24 bg-zinc-950 border border-zinc-800 rounded-xl px-2 py-3 text-white focus:outline-none focus:border-emerald-500 text-[10px] font-bold uppercase tracking-widest"
                        >
                          <option value="minutes">Min</option>
                          <option value="hours">Hrs</option>
                          <option value="days">Days</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Price (UGX)</label>
                      <input 
                        type="number" 
                        value={genPrice}
                        onChange={(e) => setGenPrice(parseInt(e.target.value))}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Validity (Days)</label>
                      <input 
                        type="number" 
                        value={genValidity || ''}
                        onChange={(e) => setGenValidity(e.target.value === '' ? 0 : parseInt(e.target.value))}
                        placeholder="0 for Never"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Download Limit (Mbps)</label>
                      <input 
                        type="number" 
                        value={genDownloadLimit}
                        onChange={(e) => setGenDownloadLimit(parseInt(e.target.value))}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                        min="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Upload Limit (Mbps)</label>
                      <input 
                        type="number" 
                        value={genUploadLimit}
                        onChange={(e) => setGenUploadLimit(parseInt(e.target.value))}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                        min="0"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Data Limit (MB)</label>
                    <input 
                      type="number" 
                      value={genDataLimit}
                      onChange={(e) => setGenDataLimit(parseInt(e.target.value))}
                      placeholder="0 for Unlimited"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                      min="0"
                    />
                  </div>
                  <button 
                    onClick={handleGenerate}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-500/20"
                  >
                    GENERATE VOUCHERS
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {adminTab === 'vouchers' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black text-white tracking-tight">Voucher Management</h3>
                <p className="text-zinc-500 text-sm">View, filter, and generate access codes for your hotspot.</p>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsGenerateModalOpen(true)}
                  className="bg-emerald-500 hover:bg-emerald-400 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                >
                  <Plus size={18} />
                  <span>Generate Vouchers</span>
                </button>
                <button 
                  onClick={() => setAdminTab('settings-vouchers')}
                  className="bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white px-4 py-3 rounded-xl font-bold transition-all flex items-center gap-2"
                  title="Voucher Generation Settings"
                >
                  <SettingsIcon size={18} />
                </button>
              </div>
            </div>

            {/* Data Usage Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl flex items-center gap-4">
                <div className="p-3 bg-emerald-500/10 rounded-xl">
                  <Activity className="text-emerald-500" size={24} />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Total Data Usage</div>
                  <div className="text-xl font-black text-white">{(stats.totalDataUsage / (1024 * 1024 * 1024)).toFixed(2)} GB</div>
                </div>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl flex items-center gap-4">
                <div className="p-3 bg-blue-500/10 rounded-xl">
                  <ArrowUpCircle className="text-blue-500" size={24} />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Total Upload</div>
                  <div className="text-xl font-black text-white">{formatBytes(stats.totalUpload)}</div>
                </div>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl flex items-center gap-4">
                <div className="p-3 bg-amber-500/10 rounded-xl">
                  <ArrowDownCircle className="text-amber-500" size={24} />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Total Download</div>
                  <div className="text-xl font-black text-white">{formatBytes(stats.totalDownload)}</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-col md:flex-row md:items-end gap-3 flex-1 max-w-4xl">
                  <div className="flex flex-col gap-1.5 flex-1">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Search & Export</label>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                        <input 
                          type="text"
                          placeholder="Search by code, status, duration, price or expiry..."
                          value={voucherSearch}
                          onChange={(e) => {
                            setVoucherSearch(e.target.value);
                            setSelectedVouchers([]); // Clear selection on search
                          }}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-12 pr-12 py-3 text-white focus:outline-none focus:border-emerald-500 transition-all"
                        />
                        {voucherSearch && (
                          <button 
                            onClick={() => setVoucherSearch('')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                      <button 
                        onClick={handleExportCSV}
                        className="flex items-center justify-center gap-2 px-6 bg-emerald-600 text-white hover:bg-emerald-500 rounded-xl text-xs font-bold transition-all h-[50px] shadow-lg shadow-emerald-600/20 border border-emerald-500/20 whitespace-nowrap"
                        title="Export currently filtered vouchers to CSV"
                      >
                        <Download size={18} />
                        <span>EXPORT TO CSV ({getFilteredVouchers().length})</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Bulk Action</label>
                    <button 
                      onClick={handleExpireFiltered}
                      className="flex items-center justify-center gap-2 px-6 bg-amber-600/20 text-amber-500 hover:bg-amber-600/30 rounded-xl text-xs font-bold transition-all h-[50px] border border-amber-500/20 whitespace-nowrap"
                      title="Mark all currently filtered active vouchers as expired"
                    >
                      <Clock size={18} />
                      <span>EXPIRE ALL FILTERED</span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Import</label>
                  <div className="flex items-center gap-1">
                    <input 
                      type="file" 
                      accept=".csv" 
                      onChange={handleCSVUpload}
                      className="hidden" 
                      id="csv-upload-input-top"
                    />
                    <label 
                      htmlFor="csv-upload-input-top"
                      className="flex items-center justify-center gap-2 px-4 bg-zinc-800 text-zinc-300 border border-zinc-700 hover:bg-zinc-700 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer h-[50px] min-w-[50px]"
                      title="Upload vouchers in bulk via CSV"
                    >
                      <Upload size={18} />
                      <span className="hidden sm:inline">IMPORT CSV</span>
                    </label>
                    <button
                      onClick={downloadCSVTemplate}
                      className="flex items-center justify-center w-[50px] h-[50px] bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-700 rounded-xl transition-all"
                      title="Download CSV Template"
                    >
                      <FileText size={18} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Status</label>
                    <select 
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value as any)}
                      className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-400 focus:outline-none focus:border-emerald-500 transition-all cursor-pointer font-bold uppercase tracking-wider h-[50px]"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="used">Used</option>
                      <option value="expired">Expired</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Upload Limit</label>
                    <select 
                      value={filterUploadLimit}
                      onChange={(e) => setFilterUploadLimit(e.target.value as any)}
                      className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-400 focus:outline-none focus:border-emerald-500 transition-all cursor-pointer font-bold uppercase tracking-wider h-[50px]"
                    >
                      <option value="all">Any Upload</option>
                      <option value="none">No Limit</option>
                      <option value="low">&lt;1 Mbps</option>
                      <option value="medium">1-10 Mbps</option>
                      <option value="high">&gt;10 Mbps</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Duration</label>
                    <select 
                      value={filterDuration}
                      onChange={(e) => setFilterDuration(e.target.value as any)}
                      className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-400 focus:outline-none focus:border-emerald-500 transition-all cursor-pointer font-bold uppercase tracking-wider h-[50px]"
                    >
                      <option value="all">Any Duration</option>
                      <option value="none">No Limit</option>
                      <option value="short">&lt; 30 Mins</option>
                      <option value="medium">30-60 Mins</option>
                      <option value="long">&gt; 60 Mins</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Download Limit</label>
                    <select 
                      value={filterDownloadLimit}
                      onChange={(e) => setFilterDownloadLimit(e.target.value as any)}
                      className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-400 focus:outline-none focus:border-emerald-500 transition-all cursor-pointer font-bold uppercase tracking-wider h-[50px]"
                    >
                      <option value="all">Any Download</option>
                      <option value="none">No Limit</option>
                      <option value="low">&lt;1 Mbps</option>
                      <option value="medium">1-10 Mbps</option>
                      <option value="high">&gt;10 Mbps</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Data Limit</label>
                    <select 
                      value={filterDataLimit}
                      onChange={(e) => setFilterDataLimit(e.target.value as any)}
                      className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-400 focus:outline-none focus:border-emerald-500 transition-all cursor-pointer font-bold uppercase tracking-wider h-[50px]"
                    >
                      <option value="all">Any Data</option>
                      <option value="none">No Limit</option>
                      <option value="low">&lt;100MB</option>
                      <option value="medium">100-500MB</option>
                      <option value="high">&gt;500MB</option>
                    </select>
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Created Range</label>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
                        <input 
                          type="date"
                          value={filterCreatedAfter}
                          onChange={(e) => setFilterCreatedAfter(e.target.value)}
                          className="bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm text-zinc-400 focus:outline-none focus:border-emerald-500 transition-all cursor-pointer font-bold uppercase tracking-wider h-[50px] w-[140px]"
                          title="Created After"
                        />
                      </div>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
                        <input 
                          type="date"
                          value={filterCreatedBefore}
                          onChange={(e) => setFilterCreatedBefore(e.target.value)}
                          className="bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm text-zinc-400 focus:outline-none focus:border-emerald-500 transition-all cursor-pointer font-bold uppercase tracking-wider h-[50px] w-[140px]"
                          title="Created Before"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Expires Range</label>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
                        <input 
                          type="date"
                          value={filterExpiresAfter}
                          onChange={(e) => setFilterExpiresAfter(e.target.value)}
                          className="bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm text-zinc-400 focus:outline-none focus:border-emerald-500 transition-all cursor-pointer font-bold uppercase tracking-wider h-[50px] w-[140px]"
                          title="Expires After"
                        />
                      </div>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
                        <input 
                          type="date"
                          value={filterExpiresBefore}
                          onChange={(e) => setFilterExpiresBefore(e.target.value)}
                          className="bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm text-zinc-400 focus:outline-none focus:border-emerald-500 transition-all cursor-pointer font-bold uppercase tracking-wider h-[50px] w-[140px]"
                          title="Expires Before"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">&nbsp;</label>
                    <button 
                      onClick={resetFilters}
                      className="flex items-center justify-center gap-2 px-4 bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white rounded-xl text-xs font-bold transition-all h-[50px]"
                      title="Reset All Filters"
                    >
                      <X size={16} />
                      <span>RESET</span>
                    </button>
                  </div>
                </div>
              </div>
              
            <div className="flex items-center gap-4">
                <AnimatePresence>
                  {selectedVouchers.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl p-1 px-2"
                    >
                      <span className="text-xs font-bold text-emerald-400 px-2">{selectedVouchers.length} Selected</span>
                      <button 
                        onClick={() => handleBulkAction('expire')}
                        className="p-2 hover:bg-zinc-800 text-amber-500 rounded-lg transition-colors flex items-center gap-2 text-xs font-bold"
                        title="Mark as Expired"
                      >
                        <Ban size={16} />
                        <span className="hidden sm:inline">EXPIRE</span>
                      </button>
                      <button 
                        onClick={() => setIsViewQRModalOpen(true)}
                        className="p-2 hover:bg-zinc-800 text-emerald-500 rounded-lg transition-colors flex items-center gap-2 text-xs font-bold border-l border-zinc-800 ml-1 pl-3"
                        title="Download QR Codes for Selected"
                      >
                        <QrCode size={16} />
                        <span className="hidden sm:inline">DOWNLOAD QR CODES</span>
                      </button>
                      <button 
                        onClick={() => handleBulkAction('delete')}
                        className="p-2 hover:bg-zinc-800 text-red-500 rounded-lg transition-colors flex items-center gap-2 text-xs font-bold"
                        title="Delete Selected"
                      >
                        <Trash2 size={16} />
                        <span className="hidden sm:inline">DELETE</span>
                      </button>
                      <button 
                        onClick={handleExportSelectedCSV}
                        className="p-2 hover:bg-zinc-800 text-zinc-400 rounded-lg transition-colors flex items-center gap-2 text-xs font-bold border-l border-zinc-800 ml-1 pl-3"
                        title="Export Selected to CSV"
                      >
                        <Download size={16} />
                        <span className="hidden sm:inline">EXPORT</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 mr-2">
                  <span>Total: {vouchers.length}</span>
                  <span className="w-1 h-1 bg-zinc-700 rounded-full" />
                  <span>Filtered: {getFilteredVouchers().length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setIsGenerateModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-500/20"
                  >
                    <Plus size={14} />
                    <span>GENERATE VOUCHERS</span>
                  </button>

                  <AnimatePresence>
                    {selectedVouchers.length > 0 && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95, x: -10 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95, x: -10 }}
                        className="flex items-center gap-2"
                      >
                        <button 
                          onClick={handleExportSelectedCSV}
                          className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold transition-all shadow-lg border border-zinc-700"
                          title="Export only selected vouchers to CSV"
                        >
                          <Download size={14} />
                          <span>EXPORT SELECTED ({selectedVouchers.length})</span>
                        </button>
                        <button 
                          onClick={() => setSelectedVouchers([])}
                          className="flex items-center gap-2 px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 rounded-xl text-[10px] font-bold transition-all border border-zinc-800"
                          title="Clear current selection"
                        >
                          <X size={12} />
                          <span>CLEAR</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button 
                    onClick={handleFilteredDownloadQR}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-700/20"
                    title="Download QR codes for all currently filtered vouchers"
                  >
                    <QrCode size={14} />
                    <span>DOWNLOAD FILTERED QR ({getFilteredVouchers().length})</span>
                  </button>

                  {selectedVouchers.length > 0 && (
                    <>
                      <button 
                        onClick={handleBulkDownloadQR}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-600/20"
                        title="Directly download QR codes for selected vouchers"
                      >
                        <QrCode size={14} />
                        <span>DOWNLOAD SELECTED QR ({selectedVouchers.length})</span>
                      </button>
                    </>
                  )}
                  <button 
                    onClick={() => {
                      if (selectedVouchers.length === 0) {
                        const activeIds = getFilteredVouchers().filter(v => v.status === 'active').map(v => v.id);
                        if (activeIds.length === 0) {
                          alert("No active vouchers found to expire.");
                          return;
                        }
                        if (confirm(`Are you sure you want to mark all ${activeIds.length} active vouchers in the current view as expired?`)) {
                          const expireVouchers = async (ids: number[]) => {
                            try {
                              const res = await authFetch('/api/vouchers/bulk-expire', {
                                method: 'POST',
                                body: JSON.stringify({ ids })
                              });
                              if (res.ok) {
                                setSelectedVouchers([]);
                                fetchVouchers();
                                fetchStats();
                              }
                            } catch (err) {
                              console.error('Bulk expire failed:', err);
                            }
                          };
                          expireVouchers(activeIds);
                        }
                      } else {
                        handleBulkAction('expire');
                      }
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-xl text-xs font-bold hover:bg-amber-500/20 transition-all"
                  >
                    <Ban size={14} />
                    <span>{selectedVouchers.length > 0 ? `EXPIRE SELECTED (${selectedVouchers.length})` : 'BULK EXPIRE ACTIVE'}</span>
                  </button>

                  <button 
                    onClick={() => {
                      if (selectedVouchers.length === 0) {
                        alert("Please select at least one voucher to view QR codes.");
                        return;
                      }
                      setIsViewQRModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white rounded-xl text-xs font-bold transition-all"
                    title="View QR codes for selected vouchers"
                  >
                    <QrCode size={14} />
                    <span>VIEW SELECTED QR</span>
                  </button>

                  <button 
                    onClick={handleDownloadFilteredQR}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-xl text-xs font-bold hover:bg-emerald-500/20 transition-all"
                    title="Download QR codes for all currently filtered vouchers"
                  >
                    <QrCode size={14} />
                    <span>DOWNLOAD FILTERED QR CODES</span>
                  </button>
                  <button 
                    onClick={() => {
                      if (selectedVouchers.length === 0) {
                        const allIds = getFilteredVouchers().map(v => v.id);
                        if (allIds.length === 0) {
                          alert("No vouchers found to delete.");
                          return;
                        }
                        if (confirm(`CRITICAL: Are you sure you want to delete ALL ${allIds.length} vouchers in the current filtered view? This action is permanent and cannot be undone.`)) {
                          const deleteVouchers = async (ids: number[]) => {
                            try {
                              const res = await authFetch('/api/vouchers/bulk-delete', {
                                method: 'POST',
                                body: JSON.stringify({ ids })
                              });
                              if (res.ok) {
                                setSelectedVouchers([]);
                                fetchVouchers();
                                fetchStats();
                              }
                            } catch (err) {
                              console.error('Bulk delete failed:', err);
                            }
                          };
                          deleteVouchers(allIds);
                        }
                      } else {
                        handleBulkAction('delete');
                      }
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl text-xs font-bold hover:bg-red-500/20 transition-all"
                  >
                    <Trash2 size={14} />
                    <span>{selectedVouchers.length > 0 ? `DELETE SELECTED (${selectedVouchers.length})` : 'BULK DELETE ALL'}</span>
                  </button>
                </div>
              </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-950 border-bottom border-zinc-800">
                    <th className="px-6 py-4 w-12">
                      <button 
                        onClick={() => toggleSelectAll(getFilteredVouchers())}
                        className="text-zinc-500 hover:text-emerald-500 transition-colors"
                      >
                        {selectedVouchers.length > 0 && selectedVouchers.length === getFilteredVouchers().length ? <CheckSquare size={18} /> : <Square size={18} />}
                      </button>
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('code')}>
                      <div className="flex items-center gap-1">
                        Code
                        {sortColumn === 'code' && (sortDirection === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('duration_minutes')}>
                      <div className="flex items-center gap-1">
                        Duration
                        {sortColumn === 'duration_minutes' && (sortDirection === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('price')}>
                      <div className="flex items-center gap-1">
                        Price
                        {sortColumn === 'price' && (sortDirection === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('data_limit_mb')}>
                      <div className="flex items-center gap-1">
                        Data Limit
                        {sortColumn === 'data_limit_mb' && (sortDirection === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('customer_name')}>
                      <div className="flex items-center gap-1">
                        Customer
                        {sortColumn === 'customer_name' && (sortDirection === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-1 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('upload_limit')}>
                          Upload Limit
                          {sortColumn === 'upload_limit' && (sortDirection === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
                        </div>
                        <select 
                          value={filterUploadLimit}
                          onChange={(e) => setFilterUploadLimit(e.target.value as any)}
                          className="bg-zinc-950 border border-zinc-800 rounded px-1.5 py-0.5 text-[9px] text-zinc-400 focus:outline-none focus:border-emerald-500 transition-all cursor-pointer font-bold uppercase tracking-wider"
                          title="Filter by Upload Limit"
                        >
                          <option value="all">ALL</option>
                          <option value="none">NO LIMIT</option>
                          <option value="low">&lt;1 Mbps</option>
                          <option value="medium">1-10 Mbps</option>
                          <option value="high">&gt;10 Mbps</option>
                        </select>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-1 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('download_limit')}>
                          Download Limit
                          {sortColumn === 'download_limit' && (sortDirection === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
                        </div>
                        <select 
                          value={filterDownloadLimit}
                          onChange={(e) => setFilterDownloadLimit(e.target.value as any)}
                          className="bg-zinc-950 border border-zinc-800 rounded px-1.5 py-0.5 text-[9px] text-zinc-400 focus:outline-none focus:border-emerald-500 transition-all cursor-pointer font-bold uppercase tracking-wider"
                          title="Filter by Download Limit"
                        >
                          <option value="all">ALL</option>
                          <option value="none">NO LIMIT</option>
                          <option value="low">&lt;1 Mbps</option>
                          <option value="medium">1-10 Mbps</option>
                          <option value="high">&gt;10 Mbps</option>
                        </select>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('total_bytes_up')}>
                      <div className="flex items-center gap-1">
                        Total Up
                        {sortColumn === 'total_bytes_up' && (sortDirection === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('total_bytes_down')}>
                      <div className="flex items-center gap-1">
                        Total Down
                        {sortColumn === 'total_bytes_down' && (sortDirection === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-1 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('status')}>
                          Status
                          {sortColumn === 'status' && (sortDirection === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
                        </div>
                        <select 
                          value={filterStatus}
                          onChange={(e) => setFilterStatus(e.target.value as any)}
                          className="bg-zinc-950 border border-zinc-800 rounded px-1.5 py-0.5 text-[9px] text-zinc-400 focus:outline-none focus:border-emerald-500 transition-all cursor-pointer font-bold uppercase tracking-wider"
                          title="Filter by Status"
                        >
                          <option value="all">ALL</option>
                          <option value="active">ACTIVE</option>
                          <option value="used">USED</option>
                          <option value="expired">EXPIRED</option>
                        </select>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('expires_at')}>
                      <div className="flex items-center gap-1">
                        Expires
                        {sortColumn === 'expires_at' && (sortDirection === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('created_at')}>
                      <div className="flex items-center gap-1">
                        Created
                        {sortColumn === 'created_at' && (sortDirection === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-right">QR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {getFilteredVouchers().map((v) => (
                    <tr 
                      key={v.id} 
                      className={`hover:bg-zinc-800/30 transition-colors cursor-pointer ${selectedVouchers.includes(v.id) ? 'bg-emerald-500/5' : ''}`}
                      onClick={() => setViewingVoucher(v)}
                    >
                      <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                        <button 
                          onClick={() => toggleSelectVoucher(v.id)}
                          className={`${selectedVouchers.includes(v.id) ? 'text-emerald-500' : 'text-zinc-700'} hover:text-emerald-500 transition-colors`}
                        >
                          {selectedVouchers.includes(v.id) ? <CheckSquare size={18} /> : <Square size={18} />}
                        </button>
                      </td>
                      <td className="px-6 py-4 font-mono text-white font-bold tracking-wider">{v.code}</td>
                      <td className="px-6 py-4 text-sm">{formatDuration(v.duration_minutes)}</td>
                      <td className="px-6 py-4 text-sm font-bold text-amber-500">₱{v.price}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-300">
                          <Database size={14} className="text-emerald-500" />
                          {v.data_limit_mb > 0 ? `${v.data_limit_mb} MB` : 'Unlimited'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {v.customer_id ? (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              const customer = customers.find(c => c.id === v.customer_id);
                              if (customer) setViewingCustomer(customer);
                            }}
                            className="flex items-center gap-2 text-xs font-bold text-emerald-500 hover:text-emerald-400 transition-colors"
                          >
                            <Users size={14} />
                            {v.customer_name || 'View Customer'}
                          </button>
                        ) : (
                          <span className="text-xs text-zinc-600 italic">No Customer</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-[10px] font-bold text-zinc-300 flex items-center gap-1">
                          <ArrowUpCircle size={10} className="text-blue-500" />
                          {v.upload_limit > 0 ? `${v.upload_limit} Mbps` : 'No Limit'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-[10px] font-bold text-zinc-300 flex items-center gap-1">
                          <ArrowDownCircle size={10} className="text-amber-500" />
                          {v.download_limit > 0 ? `${v.download_limit} Mbps` : 'No Limit'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-mono text-zinc-400">{formatBytes(v.total_bytes_up)}</td>
                      <td className="px-6 py-4 text-xs font-mono text-zinc-400">{formatBytes(v.total_bytes_down)}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          v.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                          v.status === 'expired' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                          v.status === 'used' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                          'bg-zinc-800 text-zinc-500 border-zinc-700'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            v.status === 'active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' :
                            v.status === 'expired' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' :
                            v.status === 'used' ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' :
                            'bg-zinc-500'
                          }`} />
                          {v.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-zinc-500">
                        {v.expires_at ? new Date(v.expires_at).toLocaleDateString() : 'Never'}
                      </td>
                      <td className="px-6 py-4 text-xs text-zinc-500">{new Date(v.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <button 
                          onClick={() => setQrCodeVoucher(v)}
                          className="flex items-center gap-2 ml-auto px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-all group"
                          title="Generate and Download QR Code"
                        >
                          <QrCode size={14} className="group-hover:scale-110 transition-transform" />
                          <span className="text-[10px] font-bold uppercase tracking-wider">QR Code</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {adminTab === 'sessions' && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-950 border-bottom border-zinc-800">
                  <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Voucher</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">MAC Address</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Start Time</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">End Time</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Remaining</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {sessions.map((s) => {
                  const remaining = Math.max(0, Math.floor((new Date(s.end_time).getTime() - Date.now()) / 60000));
                  return (
                    <tr key={s.id} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="px-6 py-4 font-mono text-white font-bold">{s.code}</td>
                      <td className="px-6 py-4 text-xs font-mono text-zinc-500">{s.mac_address}</td>
                      <td className="px-6 py-4 text-xs">{new Date(s.start_time).toLocaleTimeString()}</td>
                      <td className="px-6 py-4 text-xs">{new Date(s.end_time).toLocaleTimeString()}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-emerald-500" />
                          <span className="text-sm font-bold text-white">{formatDuration(remaining)}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {adminTab === 'settings' && (
          <div className="max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
            <div className="space-y-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-zinc-800 rounded-xl">
                  <SettingsIcon className="text-zinc-400" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">System Configuration</h3>
                  <p className="text-zinc-500 text-sm">Configure your network and business details.</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Business Name</label>
                  <input 
                    type="text" 
                    defaultValue="ASANSL"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Currency Code</label>
                  <input 
                    type="text" 
                    defaultValue="PHP"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Admin Password</label>
                  <input 
                    type="password" 
                    defaultValue="••••••••"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="pt-4">
                  <button className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold px-8 py-3 rounded-xl transition-all">
                    SAVE SETTINGS
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Voucher Details Modal */}
        <AnimatePresence>
          {viewingVoucher && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setViewingVoucher(null)}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl"
              >
                <div className="p-8 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/50">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-500/10 rounded-2xl">
                      <Ticket className="text-emerald-500" size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white tracking-tight">Voucher Details</h3>
                      <p className="text-zinc-500 text-sm font-mono">{viewingVoucher.code}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setViewingVoucher(null)}
                    className="p-2 hover:bg-zinc-800 rounded-xl text-zinc-500 hover:text-white transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="p-8 space-y-8">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Status</div>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          viewingVoucher.status === 'active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 
                          viewingVoucher.status === 'expired' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 
                          viewingVoucher.status === 'used' ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' :
                          'bg-zinc-500'
                        }`} />
                        <span className="text-sm font-bold text-white uppercase">{viewingVoucher.status}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Price</div>
                      <div className="text-sm font-bold text-amber-500">₱{viewingVoucher.price}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Duration</div>
                      <div className="text-sm font-bold text-white">{formatDuration(viewingVoucher.duration_minutes)}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Data Limit</div>
                      <div className="text-sm font-bold text-emerald-500">{viewingVoucher.data_limit_mb > 0 ? `${viewingVoucher.data_limit_mb} MB` : 'Unlimited'}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Created On</div>
                      <div className="text-sm font-bold text-white">{new Date(viewingVoucher.created_at).toLocaleDateString()}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Expires On</div>
                      <div className="text-sm font-bold text-white">{viewingVoucher.expires_at ? new Date(viewingVoucher.expires_at).toLocaleDateString() : 'Never'}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Upload Speed</div>
                      <div className="text-sm font-bold text-blue-500">{viewingVoucher.upload_limit > 0 ? `${viewingVoucher.upload_limit} Mbps` : 'No Limit'}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Download Speed</div>
                      <div className="text-sm font-bold text-amber-500">{viewingVoucher.download_limit > 0 ? `${viewingVoucher.download_limit} Mbps` : 'No Limit'}</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                      <Users size={14} />
                      Customer Information
                    </h4>
                    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6">
                      {viewingVoucher.customer_id ? (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center">
                              <Users className="text-emerald-500" size={18} />
                            </div>
                            <div>
                              <div className="text-sm font-bold text-white">{viewingVoucher.customer_name || 'Assigned Customer'}</div>
                              <div className="text-[10px] text-zinc-500 uppercase tracking-widest">Purchased on {new Date(viewingVoucher.created_at).toLocaleDateString()}</div>
                            </div>
                          </div>
                          <button 
                            onClick={() => {
                              const customer = customers.find(c => c.id === viewingVoucher.customer_id);
                              if (customer) {
                                setViewingVoucher(null);
                                setViewingCustomer(customer);
                              }
                            }}
                            className="text-xs font-bold text-emerald-500 hover:underline"
                          >
                            View Profile
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <p className="text-xs text-zinc-500 italic">No customer assigned to this voucher.</p>
                          <div className="flex gap-2">
                            <select 
                              onChange={(e) => {
                                if (e.target.value) {
                                  handleAssignCustomer(viewingVoucher.id, parseInt(e.target.value));
                                }
                              }}
                              className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                            >
                              <option value="">Assign to Customer...</option>
                              {customers.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                      <History size={14} />
                      Usage History
                    </h4>
                    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-500/10 rounded-lg">
                            <Clock className="text-blue-500" size={16} />
                          </div>
                          <span className="text-sm text-zinc-400">First Used At</span>
                        </div>
                        <span className="text-sm font-bold text-white">
                          {viewingVoucher.first_used_at ? new Date(viewingVoucher.first_used_at).toLocaleString() : 'Not used yet'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-800">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                            <ArrowUpCircle size={12} className="text-emerald-500" />
                            Upload
                          </div>
                          <div className="text-lg font-bold text-white">{formatBytes(viewingVoucher.total_bytes_up)}</div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                            <ArrowDownCircle size={12} className="text-blue-500" />
                            Download
                          </div>
                          <div className="text-lg font-bold text-white">{formatBytes(viewingVoucher.total_bytes_down)}</div>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-zinc-800">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Total Consumption</span>
                          <span className="text-sm font-bold text-emerald-400">
                            {formatBytes(viewingVoucher.total_bytes_up + viewingVoucher.total_bytes_down)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => setViewingVoucher(null)}
                    className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-4 rounded-2xl transition-all"
                  >
                    CLOSE DETAILS
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* QR Code Modal */}
        <AnimatePresence>
          {qrCodeVoucher && (
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setQrCodeVoucher(null)}
                className="absolute inset-0 bg-black/90 backdrop-blur-md"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl"
              >
                <div className="p-8 flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6">
                    <QrCode className="text-emerald-500" size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Voucher QR Code</h3>
                  <p className="text-zinc-500 text-sm mb-8">Scan this code to connect or login</p>
                  
                  <div className="bg-white p-6 rounded-2xl mb-8 shadow-inner">
                    <QRCodeCanvas 
                      id="voucher-qr-code"
                      value={qrCodeVoucher.code} 
                      size={200}
                      level="H"
                      includeMargin={true}
                    />
                  </div>
                  
                  <div className="font-mono text-2xl font-black text-white tracking-[0.2em] mb-8 bg-zinc-950 px-6 py-3 rounded-xl border border-zinc-800">
                    {qrCodeVoucher.code}
                  </div>

                  <div className="grid grid-cols-2 gap-4 w-full">
                    <button 
                      onClick={() => downloadQRCode(qrCodeVoucher.code)}
                      className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-emerald-500/20"
                    >
                      <Download size={18} />
                      DOWNLOAD
                    </button>
                    <button 
                      onClick={() => setQrCodeVoucher(null)}
                      className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-4 rounded-2xl transition-all"
                    >
                      CLOSE
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Customer Add/Edit Modal */}
        <AnimatePresence>
          {isCustomerModalOpen && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsCustomerModalOpen(false)}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl"
              >
                <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">{editingCustomer ? 'Edit Customer' : 'Add New Customer'}</h3>
                  <button onClick={() => setIsCustomerModalOpen(false)} className="text-zinc-500 hover:text-white"><X size={20} /></button>
                </div>
                <form onSubmit={handleCustomerSubmit} className="p-6 space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={customerForm.name}
                      onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Email Address</label>
                    <input 
                      type="email" 
                      value={customerForm.email}
                      onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Phone Number</label>
                    <input 
                      type="tel" 
                      value={customerForm.phone}
                      onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                      placeholder="+256 700 000000"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Address</label>
                    <textarea 
                      value={customerForm.address}
                      onChange={(e) => setCustomerForm({ ...customerForm, address: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 min-h-[100px]"
                      placeholder="Kampala, Uganda"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-500/20"
                  >
                    {editingCustomer ? 'UPDATE CUSTOMER' : 'SAVE CUSTOMER'}
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Generate Vouchers Modal */}
        <AnimatePresence>
          {isGenerateModalOpen && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsGenerateModalOpen(false)}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl"
              >
                <div className="p-8 bg-zinc-950/50 border-b border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center">
                      <Ticket className="text-emerald-500" size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white tracking-tight">Generate Vouchers</h3>
                      <p className="text-zinc-500 text-xs uppercase tracking-widest font-bold">Create new access codes</p>
                    </div>
                  </div>
                  <button onClick={() => setIsGenerateModalOpen(false)} className="text-zinc-500 hover:text-white"><X size={20} /></button>
                </div>
                <div className="p-8 space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Assign to Customer (Optional)</label>
                    <select 
                      value={selectedCustomerId || ''}
                      onChange={(e) => setSelectedCustomerId(e.target.value ? parseInt(e.target.value) : null)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 text-xs font-bold uppercase tracking-widest"
                    >
                      <option value="">No Customer</option>
                      {customers.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Apply Package (Optional)</label>
                    <select 
                      onChange={(e) => {
                        const pkg = packages.find(p => p.id === parseInt(e.target.value));
                        if (pkg) {
                          setGenDuration(pkg.duration_minutes);
                          setGenDurationUnit('minutes');
                          setGenPrice(pkg.price);
                          setGenDataLimit(pkg.data_limit_mb);
                        }
                      }}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 text-xs font-bold uppercase tracking-widest"
                    >
                      <option value="">Select a package...</option>
                      {packages.map(p => (
                        <option key={p.id} value={p.id}>{p.name} (₱{p.price})</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Quantity</label>
                      <input 
                        type="number" 
                        value={genCount}
                        onChange={(e) => setGenCount(parseInt(e.target.value))}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                        min="1"
                        max="100"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Duration</label>
                      <div className="flex gap-2">
                        <input 
                          type="number" 
                          value={genDuration}
                          onChange={(e) => setGenDuration(parseInt(e.target.value))}
                          className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                          min="1"
                        />
                        <select
                          value={genDurationUnit}
                          onChange={(e) => setGenDurationUnit(e.target.value as any)}
                          className="w-32 bg-zinc-950 border border-zinc-800 rounded-xl px-2 py-3 text-white focus:outline-none focus:border-emerald-500 text-xs font-bold uppercase tracking-widest"
                        >
                          <option value="minutes">Minutes</option>
                          <option value="hours">Hours</option>
                          <option value="days">Days</option>
                          <option value="weeks">Weeks</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Price (₱)</label>
                    <input 
                      type="number" 
                      value={genPrice}
                      onChange={(e) => setGenPrice(parseInt(e.target.value))}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                      min="0"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Expiration Method</label>
                    <div className="flex p-1 bg-zinc-950 border border-zinc-800 rounded-xl">
                      <button 
                        type="button"
                        onClick={() => {
                          setGenExpiryType('validity');
                          setGenExpiryDate('');
                        }}
                        className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${genExpiryType === 'validity' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-zinc-500 hover:text-zinc-300'}`}
                      >
                        Validity Period
                      </button>
                      <button 
                        type="button"
                        onClick={() => {
                          setGenExpiryType('custom');
                          setGenValidity(0);
                        }}
                        className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${genExpiryType === 'custom' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-zinc-500 hover:text-zinc-300'}`}
                      >
                        Fixed Date
                      </button>
                    </div>

                    {genExpiryType === 'validity' ? (
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Validity (Days)</label>
                        <input 
                          type="number" 
                          value={genValidity || ''}
                          onChange={(e) => setGenValidity(e.target.value === '' ? 0 : parseInt(e.target.value))}
                          placeholder="0 for Never"
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                          min="0"
                        />
                        <p className="text-[9px] text-zinc-500 italic">Voucher will expire X days after creation.</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Custom Expiry Date</label>
                        <div className="relative">
                          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                          <input 
                            type="date" 
                            value={genExpiryDate}
                            onChange={(e) => setGenExpiryDate(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                            min={new Date().toISOString().split('T')[0]}
                          />
                        </div>
                        <p className="text-[9px] text-zinc-500 italic">Voucher will expire on this specific date.</p>
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Download Limit (Mbps)</label>
                      <input 
                        type="number" 
                        value={genDownloadLimit}
                        onChange={(e) => setGenDownloadLimit(parseInt(e.target.value))}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                        min="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Upload Limit (Mbps)</label>
                      <input 
                        type="number" 
                        value={genUploadLimit}
                        onChange={(e) => setGenUploadLimit(parseInt(e.target.value))}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                        min="0"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Data Limit (MB)</label>
                    <input 
                      type="number" 
                      value={genDataLimit}
                      onChange={(e) => setGenDataLimit(parseInt(e.target.value))}
                      placeholder="0 for Unlimited"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                      min="0"
                    />
                  </div>
                  <button 
                    onClick={async () => {
                      await handleGenerate();
                      setIsGenerateModalOpen(false);
                    }}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                  >
                    <Plus size={18} />
                    GENERATE NOW
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Package Creation Modal */}
        <AnimatePresence>
          {isPackageModalOpen && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsPackageModalOpen(false)}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl"
              >
                <div className="p-8 bg-zinc-950/50 border-b border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center">
                      <Package className="text-emerald-500" size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white tracking-tight">Create Package</h3>
                      <p className="text-zinc-500 text-xs uppercase tracking-widest font-bold">Define new internet plan</p>
                    </div>
                  </div>
                  <button onClick={() => setIsPackageModalOpen(false)} className="text-zinc-500 hover:text-white"><X size={20} /></button>
                </div>
                <form onSubmit={handlePackageSubmit} className="p-8 space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Package Name</label>
                      <input 
                        required
                        type="text" 
                        value={packageForm.name}
                        onChange={(e) => setPackageForm({...packageForm, name: e.target.value})}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                        placeholder="e.g. Daily Unlimited"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Duration</label>
                        <div className="flex gap-2">
                          <input 
                            required
                            type="number" 
                            value={packageForm.duration_minutes}
                            onChange={(e) => setPackageForm({...packageForm, duration_minutes: parseInt(e.target.value)})}
                            className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                            min="1"
                          />
                          <select
                            value={packageDurationUnit}
                            onChange={(e) => setPackageDurationUnit(e.target.value as any)}
                            className="w-32 bg-zinc-950 border border-zinc-800 rounded-xl px-2 py-3 text-white focus:outline-none focus:border-emerald-500 text-xs font-bold uppercase tracking-widest"
                          >
                            <option value="minutes">Minutes</option>
                            <option value="hours">Hours</option>
                            <option value="days">Days</option>
                            <option value="weeks">Weeks</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Price (UGX)</label>
                        <input 
                          required
                          type="number" 
                          value={packageForm.price}
                          onChange={(e) => setPackageForm({...packageForm, price: parseInt(e.target.value)})}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                          min="0"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Data Allowance (MB)</label>
                      <input 
                        type="number" 
                        value={packageForm.data_limit_mb}
                        onChange={(e) => setPackageForm({...packageForm, data_limit_mb: parseInt(e.target.value)})}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                        placeholder="0 for Unlimited"
                        min="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Description</label>
                      <textarea 
                        value={packageForm.description}
                        onChange={(e) => setPackageForm({...packageForm, description: e.target.value})}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 h-24 resize-none"
                        placeholder="Briefly describe the package..."
                      />
                    </div>
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                  >
                    <Plus size={18} />
                    CREATE PACKAGE
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* View QR Codes Modal */}
        <AnimatePresence>
          {isViewQRModalOpen && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsViewQRModalOpen(false)}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
              >
                <div className="p-8 bg-zinc-950/50 border-b border-zinc-800 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center">
                      <QrCode className="text-emerald-500" size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white tracking-tight">Voucher QR Codes</h3>
                      <p className="text-zinc-500 text-xs uppercase tracking-widest font-bold">{selectedVouchers.length} Vouchers Selected</p>
                    </div>
                  </div>
                  <button onClick={() => setIsViewQRModalOpen(false)} className="text-zinc-500 hover:text-white"><X size={20} /></button>
                </div>
                <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                    {selectedVouchers.map(id => {
                      const voucher = vouchers.find(v => v.id === id);
                      if (!voucher) return null;
                      return (
                        <div key={id} className="bg-zinc-950 border border-zinc-800 p-4 rounded-2xl flex flex-col items-center gap-3 group hover:border-emerald-500/30 transition-all">
                          <div className="bg-white p-2 rounded-xl">
                            <QRCodeCanvas 
                              value={voucher.code} 
                              size={120}
                              level="H"
                              includeMargin={false}
                            />
                          </div>
                          <div className="text-center">
                            <div className="text-xs font-mono font-bold text-white mb-1">{voucher.code}</div>
                            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">₱{voucher.price} • {formatDuration(voucher.duration_minutes)}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="p-8 bg-zinc-950/50 border-t border-zinc-800 shrink-0">
                  <button 
                    onClick={handleBulkDownloadQR}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                  >
                    <Download size={18} />
                    DOWNLOAD ALL AS IMAGES
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Customer Details Modal */}
        <AnimatePresence>
          {viewingCustomer && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setViewingCustomer(null)}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl"
              >
                <div className="p-8 bg-zinc-950/50 border-b border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center">
                      <Users className="text-emerald-500" size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white tracking-tight">{viewingCustomer.name}</h3>
                      <p className="text-zinc-500 text-xs uppercase tracking-widest font-bold">Customer Profile</p>
                    </div>
                  </div>
                  <button onClick={() => setViewingCustomer(null)} className="text-zinc-500 hover:text-white"><X size={20} /></button>
                </div>
                <div className="p-8 space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-1">
                      <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Email Address</div>
                      <div className="text-white font-medium">{viewingCustomer.email || 'Not provided'}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Phone Number</div>
                      <div className="text-white font-medium">{viewingCustomer.phone || 'Not provided'}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Physical Address</div>
                      <div className="text-white font-medium">{viewingCustomer.address || 'Not provided'}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Member Since</div>
                      <div className="text-white font-medium">{new Date(viewingCustomer.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}</div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-zinc-800">
                    <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">Voucher Purchase History</div>
                    <div className="space-y-3 max-h-[200px] overflow-y-auto custom-scrollbar pr-2">
                      {vouchers.filter(v => v.customer_id === viewingCustomer.id).length > 0 ? (
                        vouchers.filter(v => v.customer_id === viewingCustomer.id).map(v => (
                          <div key={v.id} className="bg-zinc-950 border border-zinc-800 p-3 rounded-xl flex items-center justify-between">
                            <div>
                              <div className="font-mono text-emerald-500 font-bold">{v.code}</div>
                              <div className="text-[10px] text-zinc-500 uppercase tracking-widest">{formatDuration(v.duration_minutes)} | UGX {v.price}</div>
                            </div>
                            <div className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                              v.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 
                              v.status === 'used' ? 'bg-blue-500/10 text-blue-500' : 'bg-zinc-800 text-zinc-500'
                            }`}>
                              {v.status}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-6 text-zinc-600 italic text-xs">No vouchers purchased yet.</div>
                      )}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-zinc-800">
                    <button 
                      onClick={() => {
                        setViewingCustomer(null);
                        openEditCustomer(viewingCustomer);
                      }}
                      className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-4 rounded-xl transition-all"
                    >
                      EDIT PROFILE
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  </div>
);
}
