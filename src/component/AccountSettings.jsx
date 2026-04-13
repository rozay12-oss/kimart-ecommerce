import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Mail, 
  Lock, 
  ShieldCheck, 
  Bell, 
  Save, 
  ChevronRight,
  Loader2
} from 'lucide-react';

const AccountSettings = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 1. Fetch current user on mount
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user.user);
        setEmail(user.email);
      }
    };
    getUser();
  }, []);

  // 2. Handle Email Update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    const { error } = await supabase.auth.updateUser({ email });

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: 'Confirmation link sent to your new email!' });
    }
    setLoading(false);
  };

  // 3. Handle Password Update
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (password.length < 6) return;
    setLoading(true);
    setMessage({ type: '', text: '' });

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: 'Password updated successfully!' });
      setPassword('');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10 font-sans">
      <div className="max-w-4xl mx-auto">
        
        <header className="mb-10">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Account Settings</h1>
          <p className="text-slate-500 font-medium">Manage your security and profile preferences</p>
        </header>

        {/* NOTIFICATION TOAST */}
        <AnimatePresence>
          {message.text && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }} 
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`p-4 rounded-2xl mb-8 text-sm font-bold border flex items-center gap-3 ${
                message.type === 'success' 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                  : 'bg-rose-50 text-rose-700 border-rose-100'
              }`}
            >
              <ShieldCheck size={18} />
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* SIDEBAR NAVIGATION */}
          <div className="space-y-2">
            <NavButton icon={<User size={18}/>} label="Profile" active />
            <NavButton icon={<ShieldCheck size={18}/>} label="Security" />
            <NavButton icon={<Bell size={18}/>} label="Notifications" />
          </div>

          {/* MAIN SETTINGS FORMS */}
          <div className="md:col-span-2 space-y-8">
            
            {/* EMAIL SECTION */}
            <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h3 className="font-black text-slate-900 flex items-center gap-2">
                  <Mail size={18} className="text-blue-600" /> Identity
                </h3>
              </div>
              <form onSubmit={handleUpdateProfile} className="p-8 space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Login Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-slate-700"
                    />
                  </div>
                </div>
                <button 
                  type="submit"
                  disabled={loading}
                  className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black text-xs hover:bg-blue-600 transition-all flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-slate-200"
                >
                  {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                  UPDATE EMAIL
                </button>
              </form>
            </section>

            {/* PASSWORD SECTION */}
            <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h3 className="font-black text-slate-900 flex items-center gap-2">
                  <Lock size={18} className="text-amber-500" /> Security
                </h3>
              </div>
              <form onSubmit={handleUpdatePassword} className="p-8 space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      type="password" 
                      placeholder="Min 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-slate-700"
                    />
                  </div>
                </div>
                <button 
                  type="submit"
                  disabled={loading || password.length < 6}
                  className="bg-white text-slate-900 border-2 border-slate-900 px-8 py-3 rounded-2xl font-black text-xs hover:bg-slate-900 hover:text-white transition-all disabled:opacity-20"
                >
                  CHANGE PASSWORD
                </button>
              </form>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
};

// Internal Nav Button Helper
const NavButton = ({ icon, label, active = false }) => (
  <button className={`w-full flex items-center justify-between px-5 py-3.5 rounded-2xl font-black text-xs transition-all tracking-wide ${
    active 
      ? 'bg-blue-600 text-white shadow-xl shadow-blue-100' 
      : 'text-slate-400 hover:bg-white hover:text-slate-900 border border-transparent hover:border-slate-200'
  }`}>
    <div className="flex items-center gap-4">
      {icon}
      {label.toUpperCase()}
    </div>
    <ChevronRight size={14} className={active ? 'opacity-100' : 'opacity-0'} />
  </button>
);

export default AccountSettings;