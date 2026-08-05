import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { socialsApi } from '../services/api';
import { FaEnvelope, FaLock, FaUser, FaExclamationCircle, FaSpinner, FaFacebook, FaTiktok, FaTelegram, FaTimes } from 'react-icons/fa';

export default function AuthModal({ isOpen, onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPopup, setShowForgotPopup] = useState(false);
  const [socials, setSocials] = useState([]);
  
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isOpen) return;

    // Fetch social media links
    const fetchSocials = async () => {
      try {
        const res = await socialsApi.list();
        const socialData = res.data || res;
        if (Array.isArray(socialData)) {
          setSocials(socialData);
        }
      } catch (err) {
        console.error('Failed to fetch socials', err);
      }
    };

    fetchSocials();
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const result = await login(formData.email, formData.password);
        if (result.success) {
          onClose();
          const from = location.state?.from?.pathname || '/';
          if (from !== '/auth') navigate(from, { replace: true });
        } else {
          setError(result.message);
        }
      } else {
        if (formData.password !== formData.password_confirmation) {
          setError('စကားဝှက်များ ကိုက်ညီမှုမရှိပါ');
          setLoading(false);
          return;
        }
        const result = await register(formData);
        if (result.success) {
          onClose();
          navigate('/', { replace: true });
        } else {
          setError(result.message);
        }
      }
    } catch (err) {
      setError('တစ်ခုခုမှားယွင်းနေပါသည်။ ထပ်မံကြိုးစားကြည့်ပါ။');
    } finally {
      setLoading(false);
    }
  };

  const getSocialIcon = (name) => {
    const n = name.toLowerCase();
    if (n.includes('facebook')) return <FaFacebook size={24} />;
    if (n.includes('tiktok')) return <FaTiktok size={24} />;
    if (n.includes('telegram')) return <FaTelegram size={24} />;
    return null;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative z-10 w-full max-w-md">
        <div className="glass-morphism-dark rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/10 relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors"
          >
            <FaTimes size={24} />
          </button>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-red-500 tracking-tighter mb-2">
              YANGON <span className="text-white">TV</span>
            </h1>
            <div className="flex justify-center gap-4 mt-6">
              <button 
                onClick={() => setIsLogin(true)}
                className={`text-lg font-bold pb-2 transition-all ${isLogin ? 'text-white border-b-2 border-red-500' : 'text-gray-500 hover:text-gray-300'}`}
              >
                အကောင့်ဝင်မယ်
              </button>
              <button 
                onClick={() => setIsLogin(false)}
                className={`text-lg font-bold pb-2 transition-all ${!isLogin ? 'text-white border-b-2 border-red-500' : 'text-gray-500 hover:text-gray-300'}`}
              >
                အကောင့်ဖွင့်မယ်
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 text-sm animate-shake">
              <FaExclamationCircle size={18} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-400">နာမည်</label>
                <div className="relative group">
                  <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-500 transition-colors" size={18} />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-white transition-all"
                    placeholder="သင့်အမည်"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-400">အီးမေးလ်</label>
              <div className="relative group">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-500 transition-colors" size={18} />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-white transition-all"
                  placeholder="email@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-400">စကားဝှက်</label>
                {isLogin && (
                  <button 
                    type="button"
                    onClick={() => setShowForgotPopup(true)}
                    className="text-xs text-red-500 hover:text-red-400 transition-colors"
                  >
                    စကားဝှက်အားမေ့သွားပါသည်
                  </button>
                )}
              </div>
              <div className="relative group">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-500 transition-colors" size={18} />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-white transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-400">စကားဝှက် အတည်ပြုပါ</label>
                <div className="relative group">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-500 transition-colors" size={18} />
                  <input
                    type="password"
                    required
                    value={formData.password_confirmation}
                    onChange={(e) => setFormData({...formData, password_confirmation: e.target.value})}
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-white transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-3d py-3.5 flex items-center justify-center gap-2 text-base font-bold tracking-wide"
            >
              {loading ? <FaSpinner className="animate-spin" size={20} /> : (isLogin ? 'အကောင့်ဝင်မယ်' : 'အကောင့်ဖွင့်မယ်')}
            </button>
          </form>

          {/* Join Our Community */}
          <div className="mt-10 pt-8 border-t border-white/5 text-center">
            <h3 className="text-sm font-semibold text-gray-400 mb-6 uppercase tracking-wider">Join Our Community</h3>
            <div className="flex justify-center items-center gap-6">
              {socials.length > 0 ? (
                socials.map((social, i) => {
                  const icon = getSocialIcon(social.name);
                  if (!icon) return null;
                  return (
                    <a 
                      key={i}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-red-500 transition-all duration-300 hover:scale-125 transform"
                      title={social.name}
                    >
                      {icon}
                    </a>
                  );
                })
              ) : (
                <>
                  <a href="#" className="text-gray-400 hover:text-red-500 transition-all"><FaFacebook size={24} /></a>
                  <a href="#" className="text-gray-400 hover:text-red-500 transition-all"><FaTiktok size={24} /></a>
                  <a href="#" className="text-gray-400 hover:text-red-500 transition-all"><FaTelegram size={24} /></a>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Popup */}
      {showForgotPopup && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="glass-morphism w-full max-w-sm p-8 rounded-3xl border border-white/10 shadow-2xl relative animate-in zoom-in duration-300">
            <button 
              onClick={() => setShowForgotPopup(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
            >
              <FaTimes size={20} />
            </button>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaLock className="text-red-500" size={28} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">စကားဝှက်အားမေ့သွားပါသည်</h2>
              <p className="text-gray-400 mb-8">စကားဝှက် ပြန်လည်ရယူရန်အတွက် Customer Support အား ဆက်သွယ်ပေးပါရန်။</p>
              <div className="space-y-4">
                <a 
                  href="https://t.me/yangontvsupport" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full btn-3d py-3 flex items-center justify-center gap-2"
                >
                  <FaTelegram size={20} />
                  Customer Support အား ဆက်သွယ်ပါ
                </a>
                <button 
                  onClick={() => setShowForgotPopup(false)}
                  className="w-full py-3 text-gray-400 hover:text-white transition-colors text-sm font-medium"
                >
                  ပယ်ဖျက်မည်
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
