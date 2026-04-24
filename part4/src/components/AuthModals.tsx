import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Props {
  mode: 'login' | 'register' | null;
  onClose: () => void;
  onSwitch: (mode: 'login' | 'register') => void;
}

export function AuthModals({ mode, onClose, onSwitch }: Props) {
  const { login, register } = useAuth();
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ email: '', password: '', firstName: '', lastName: '' });

  const set = (k: string, v: string) => { setForm(f => ({ ...f, [k]: v })); setError(''); };

  const handleSubmit = async () => {
    if (!form.email || !form.password) { setError('يرجى تعبئة جميع الحقول'); return; }
    if (mode === 'register' && (!form.firstName || !form.lastName)) { setError('يرجى إدخال الاسم الكامل'); return; }
    setLoading(true);
    try {
      if (mode === 'login') {
        const res = await login(form.email, form.password);
        if (!res.success) setError(res.error || 'خطأ في تسجيل الدخول');
        else onClose();
      } else {
        const res = await register(form.email, form.password, form.firstName, form.lastName);
        if (!res.success) setError(res.error || 'خطأ في إنشاء الحساب');
        else onClose();
      }
    } finally { setLoading(false); }
  };

  return (
    <AnimatePresence>
      {mode && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="modal-overlay" onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 24 }}
            transition={{ type: 'spring', damping: 26, stiffness: 280 }}
            className="w-full max-w-md rounded-3xl p-8 relative"
            style={{ background: 'hsl(215 42% 10%)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 32px 80px rgba(0,0,0,0.6)' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Close */}
            <button onClick={onClose}
              className="absolute top-5 left-5 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:bg-white/10"
              style={{ color: 'rgba(255,255,255,0.4)' }}
            ><X size={16} /></button>

            {/* Logo */}
            <div className="flex flex-col items-center mb-8">
              <MabatLogo size={56} />
              <h2 style={{ fontFamily: 'Tajawal', fontWeight: 800, fontSize: '22px', color: 'hsl(42 30% 90%)', marginTop: '12px' }}>
                {mode === 'login' ? 'مرحباً بعودتك' : 'انضم إلى مبات'}
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', fontFamily: 'Tajawal', marginTop: '4px' }}>
                {mode === 'login' ? 'سجّل دخولك للاستمتاع بأفضل المنتجعات' : 'اكتشف المنتجعات الساحلية الفاخرة في المملكة'}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {mode === 'register' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div className="relative">
                    <User size={14} className="absolute top-3.5 right-3.5" style={{ color: 'rgba(255,255,255,0.3)' }} />
                    <input className="input-dark pr-9" placeholder="الاسم الأول" value={form.firstName} onChange={e => set('firstName', e.target.value)} />
                  </div>
                  <input className="input-dark" placeholder="اسم العائلة" value={form.lastName} onChange={e => set('lastName', e.target.value)} />
                </div>
              )}

              <div className="relative">
                <Mail size={14} className="absolute top-3.5 right-3.5" style={{ color: 'rgba(255,255,255,0.3)' }} />
                <input type="email" className="input-dark pr-9" placeholder="البريد الإلكتروني"
                  value={form.email} onChange={e => set('email', e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                />
              </div>

              <div className="relative">
                <Lock size={14} className="absolute top-3.5 right-3.5" style={{ color: 'rgba(255,255,255,0.3)' }} />
                <input type={showPw ? 'text' : 'password'} className="input-dark pr-9 pl-10" placeholder="كلمة المرور"
                  value={form.password} onChange={e => set('password', e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute top-3.5 left-3.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.p initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="text-sm text-center py-2 rounded-xl"
                    style={{ color: 'hsl(0 72% 65%)', background: 'rgba(220,38,38,0.08)', fontFamily: 'Tajawal' }}
                  >{error}</motion.p>
                )}
              </AnimatePresence>

              <button onClick={handleSubmit} disabled={loading} className="btn-gold w-full mt-1"
                style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
                {loading ? '...' : mode === 'login' ? 'تسجيل الدخول' : 'إنشاء الحساب'}
              </button>

              <p className="text-center text-sm" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Tajawal' }}>
                {mode === 'login' ? 'ليس لديك حساب؟ ' : 'لديك حساب بالفعل؟ '}
                <button onClick={() => { setError(''); onSwitch(mode === 'login' ? 'register' : 'login'); }}
                  style={{ color: 'hsl(42 90% 60%)', textDecoration: 'underline', fontFamily: 'Tajawal' }}>
                  {mode === 'login' ? 'إنشاء حساب' : 'تسجيل الدخول'}
                </button>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Reusable logo component
export function MabatLogo({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Sky gradient background - transparent circle */}
      <defs>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5C842"/>
          <stop offset="100%" stopColor="#C8860A"/>
        </linearGradient>
        <linearGradient id="seaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1A8FBF"/>
          <stop offset="100%" stopColor="#0A5A7A"/>
        </linearGradient>
        <linearGradient id="sunGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD84D"/>
          <stop offset="100%" stopColor="#F5A623"/>
        </linearGradient>
      </defs>

      {/* House / villa shape */}
      {/* Roof */}
      <polygon points="25,58 60,22 95,58" fill="url(#goldGrad)" />
      {/* Chimney */}
      <rect x="70" y="30" width="9" height="18" rx="2" fill="#C8860A"/>

      {/* Main house body */}
      <rect x="30" y="57" width="60" height="38" rx="3" fill="url(#goldGrad)" opacity="0.9"/>

      {/* Door */}
      <rect x="51" y="74" width="18" height="21" rx="3" fill="#0A5A7A"/>
      {/* Door knob */}
      <circle cx="65" cy="85" r="2" fill="#F5C842"/>

      {/* Windows */}
      <rect x="36" y="64" width="14" height="12" rx="2" fill="url(#seaGrad)" opacity="0.85"/>
      <rect x="70" y="64" width="14" height="12" rx="2" fill="url(#seaGrad)" opacity="0.85"/>

      {/* Window cross bars */}
      <line x1="43" y1="64" x2="43" y2="76" stroke="rgba(255,255,255,0.4)" strokeWidth="1"/>
      <line x1="36" y1="70" x2="50" y2="70" stroke="rgba(255,255,255,0.4)" strokeWidth="1"/>
      <line x1="77" y1="64" x2="77" y2="76" stroke="rgba(255,255,255,0.4)" strokeWidth="1"/>
      <line x1="70" y1="70" x2="84" y2="70" stroke="rgba(255,255,255,0.4)" strokeWidth="1"/>

      {/* Sun */}
      <circle cx="88" cy="30" r="9" fill="url(#sunGrad)" opacity="0.9"/>
      {/* Sun rays */}
      {[0,45,90,135,180,225,270,315].map((angle, i) => (
        <line key={i}
          x1={88 + Math.cos((angle * Math.PI)/180) * 11}
          y1={30 + Math.sin((angle * Math.PI)/180) * 11}
          x2={88 + Math.cos((angle * Math.PI)/180) * 14}
          y2={30 + Math.sin((angle * Math.PI)/180) * 14}
          stroke="#FFD84D" strokeWidth="1.5" strokeLinecap="round"
        />
      ))}

      {/* Sea waves at bottom */}
      <path d="M20 100 Q32 95 44 100 Q56 105 68 100 Q80 95 92 100 Q104 105 116 100" stroke="#1A8FBF" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M15 108 Q30 103 45 108 Q60 113 75 108 Q90 103 105 108" stroke="#1A8FBF" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6"/>

      {/* Palm tree */}
      <line x1="19" y1="95" x2="26" y2="58" stroke="#C8860A" strokeWidth="3" strokeLinecap="round"/>
      {/* Palm leaves */}
      <path d="M26 58 Q10 48 8 38" stroke="#3A8A2A" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M26 58 Q18 44 22 32" stroke="#3A8A2A" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M26 58 Q32 44 44 40" stroke="#3A8A2A" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M26 58 Q34 50 40 50" stroke="#4AAA3A" strokeWidth="2" fill="none" strokeLinecap="round"/>
    </svg>
  );
}
