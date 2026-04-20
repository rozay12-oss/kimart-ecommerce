import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) alert(error.message);
    else navigate('/');
    setLoading(false);
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: "url('/kimart.png')" }}
    >
      {/* Dark Overlay for depth and readability */}
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"></div>

      <div className="max-w-md w-full bg-white/95 backdrop-blur-md rounded-[2.5rem] shadow-2xl p-8 md:p-12 border border-white/20 relative z-10">
        
        {/* LOGO AREA */}
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 overflow-hidden rounded-2xl">
            <img 
              src="/KimartLogo.png" 
              alt="Kimart logo" 
              className="w-full h-full object-contain" 
            />
          </div>
        </div>

        <h2 className="text-3xl font-black text-gray-900 text-center mb-2 tracking-tighter">
          Welcome Back
        </h2>
        <p className="text-gray-500 text-center mb-8 font-medium italic">
          Sign in to <span className="text-[#611e02] font-black uppercase">Kimart</span>.
        </p>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">
              Email Address
            </label>
            <input 
              type="email" 
              required
              className="w-full px-5 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#611e02] focus:border-[#611e02] outline-none transition-all font-medium"
              placeholder="you@example.com"
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">
              Password
            </label>
            <input 
              type="password" 
              required
              className="w-full px-5 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#611e02] focus:border-[#611e02] outline-none transition-all font-medium"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#611e02] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-black transition-all shadow-lg active:scale-95 disabled:opacity-50 mt-4"
          >
            {loading ? 'Verifying...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500 font-medium">
          Don't have an account?{' '}
          <Link to="/signup" className="text-[#611e02] font-black hover:underline ml-1">
            Sign up for free
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;