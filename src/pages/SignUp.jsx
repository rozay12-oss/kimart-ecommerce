import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      alert(error.message);
    } else {
      alert('Check your email for the confirmation link!');
      navigate('/login');
    }
    setLoading(false);
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: "url('/kimart.png')" }} // Point to your brand image
    >
      {/* Dark Overlay to make the form pop */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"></div>

      <div className="max-w-md w-full bg-white/95 backdrop-blur-md rounded-[2.5rem] shadow-2xl p-8 md:p-12 border border-white/20 relative z-10">
        
        {/* LOGO AREA */}
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 overflow-hidden rounded-2xl">
            <img 
              src="/kimart.png" 
              alt="Kimart logo" 
              className="w-full h-full object-contain" 
            />
          </div>
        </div>

        <h2 className="text-3xl font-black text-gray-900 text-center mb-2 tracking-tighter">
          Create Account
        </h2>
        <p className="text-gray-500 text-center mb-8 font-medium italic">
          Join <span className="text-[#611e02] font-black">KIMART</span> today.
        </p>

        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">
              Full Name
            </label>
            <input 
              type="text" 
              required
              className="w-full px-5 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#611e02] focus:border-[#611e02] outline-none transition-all font-medium"
              placeholder="John Doe"
              onChange={(e) => setFullName(e.target.value)} 
            />
          </div>

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
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500 font-medium">
          Already have an account?{' '}
          <Link to="/login" className="text-[#611e02] font-black hover:underline ml-1">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;