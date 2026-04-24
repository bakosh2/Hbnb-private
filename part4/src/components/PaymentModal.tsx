import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Smartphone, Building2, Check, Lock, ChevronLeft } from 'lucide-react';

interface Props {
  resortName: string;
  nights: number;
  total: number;
  onSuccess: () => void;
  onClose: () => void;
}

type PayMethod = 'card' | 'apple' | 'stcpay' | 'mada' | 'bank';
type Step = 'method' | 'form' | 'processing' | 'done';

const METHODS = [
  { id: 'card' as PayMethod, label: 'بطاقة ائتمانية / مدى', sub: 'Visa · Mastercard · Mada', icon: <CreditCard size={22} />, color: '#1A56DB' },
  { id: 'apple' as PayMethod, label: 'Apple Pay', sub: 'ادفع بلمسة واحدة', icon: <span style={{ fontSize: '22px', lineHeight: 1 }}></span>, color: '#1a1a1a' },
  { id: 'stcpay' as PayMethod, label: 'STC Pay', sub: 'خدمة الدفع الإلكتروني', icon: <Smartphone size={22} />, color: '#6D28D9' },
  { id: 'mada' as PayMethod, label: 'مدى', sub: 'البطاقة البنكية المحلية', icon: <CreditCard size={22} />, color: '#1F8C4E' },
  { id: 'bank' as PayMethod, label: 'تحويل بنكي', sub: 'تحويل مباشر من حسابك', icon: <Building2 size={22} />, color: '#92400E' },
];

function CardForm({ onSubmit }: { onSubmit: () => void }) {
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const fmt = (v: string) => v.replace(/\D/g,'').replace(/(.{4})/g,'$1 ').trim().slice(0,19);
  const fmtExp = (v: string) => { const d = v.replace(/\D/g,''); return d.length > 2 ? d.slice(0,2)+'/'+d.slice(2,4) : d; };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div>
        <label style={lbl}>رقم البطاقة</label>
        <div className="relative">
          <CreditCard size={16} className="absolute top-3.5 right-3.5" style={{ color: 'rgba(255,255,255,0.3)' }} />
          <input className="input-dark pr-10" placeholder="0000 0000 0000 0000"
            value={card.number} onChange={e => setCard(c => ({ ...c, number: fmt(e.target.value) }))} maxLength={19} />
        </div>
      </div>
      <div>
        <label style={lbl}>اسم حامل البطاقة</label>
        <input className="input-dark" placeholder="الاسم كما يظهر على البطاقة"
          value={card.name} onChange={e => setCard(c => ({ ...c, name: e.target.value }))} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div>
          <label style={lbl}>تاريخ الانتهاء</label>
          <input className="input-dark" placeholder="MM/YY"
            value={card.expiry} onChange={e => setCard(c => ({ ...c, expiry: fmtExp(e.target.value) }))} maxLength={5} />
        </div>
        <div>
          <label style={lbl}>CVV</label>
          <input className="input-dark" placeholder="***" type="password"
            value={card.cvv} onChange={e => setCard(c => ({ ...c, cvv: e.target.value.replace(/\D/g,'').slice(0,4) }))} maxLength={4} />
        </div>
      </div>
      <div className="flex items-center gap-2 py-3 px-4 rounded-xl" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.15)' }}>
        <Lock size={13} style={{ color: 'hsl(42 90% 52%)', flexShrink: 0 }} />
        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontFamily: 'Tajawal' }}>معاملاتك محمية بتشفير SSL 256-bit</span>
      </div>
      <button className="btn-gold w-full" onClick={onSubmit}
        disabled={card.number.length < 19 || !card.name || card.expiry.length < 5 || card.cvv.length < 3}
        style={{ opacity: (card.number.length < 19 || !card.name) ? 0.5 : 1 }}>
        ادفع الآن
      </button>
    </div>
  );
}

function ApplePayForm({ onSubmit }: { onSubmit: () => void }) {
  return (
    <div className="text-center py-4" style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
      <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <span style={{ fontSize: '44px' }}></span>
      </div>
      <p style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'Tajawal', fontSize: '14px', maxWidth: '260px' }}>
        اضغط زر الدفع وأكّد بمعرف Face ID أو بصمة إصبعك
      </p>
      <button className="btn-gold px-10 py-4 text-base" onClick={onSubmit} style={{ borderRadius: '16px', fontSize: '17px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '20px' }}></span> ادفع بـ Apple Pay
      </button>
    </div>
  );
}

function STCPayForm({ onSubmit }: { onSubmit: () => void }) {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [sent, setSent] = useState(false);

  const sendOtp = () => { if (phone.length >= 9) setSent(true); };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div className="flex items-center justify-center gap-3 py-3">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(109,40,217,0.15)', border: '1px solid rgba(109,40,217,0.3)' }}>
          <Smartphone size={24} style={{ color: '#A78BFA' }} />
        </div>
        <span style={{ fontFamily: 'Tajawal', fontWeight: 700, color: 'hsl(42 30% 90%)', fontSize: '16px' }}>STC Pay</span>
      </div>
      <div>
        <label style={lbl}>رقم الجوال</label>
        <div className="flex gap-2">
          <div className="input-dark flex items-center justify-center px-3 shrink-0" style={{ width: '70px' }}>+966</div>
          <input className="input-dark flex-1" placeholder="5XX XXX XXXX"
            value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g,'').slice(0,10))} />
        </div>
      </div>
      {!sent ? (
        <button className="btn-gold w-full" onClick={sendOtp} disabled={phone.length < 9} style={{ opacity: phone.length < 9 ? 0.5 : 1 }}>
          إرسال رمز التحقق
        </button>
      ) : (
        <>
          <div>
            <label style={lbl}>رمز التحقق OTP</label>
            <input className="input-dark text-center text-xl tracking-widest" placeholder="• • • • • •"
              value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g,'').slice(0,6))} maxLength={6} />
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', fontFamily: 'Tajawal', marginTop: '6px' }}>تم إرسال الرمز إلى 0{phone}</p>
          </div>
          <button className="btn-gold w-full" onClick={onSubmit} disabled={otp.length < 6} style={{ opacity: otp.length < 6 ? 0.5 : 1 }}>
            تأكيد الدفع
          </button>
        </>
      )}
    </div>
  );
}

function MadaForm({ onSubmit }: { onSubmit: () => void }) {
  const [num, setNum] = useState('');
  const [pin, setPin] = useState('');
  const fmt = (v: string) => v.replace(/\D/g,'').replace(/(.{4})/g,'$1 ').trim().slice(0,19);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div className="flex items-center justify-center py-2">
        <div className="px-5 py-2 rounded-xl" style={{ background: 'rgba(31,140,78,0.12)', border: '1px solid rgba(31,140,78,0.3)' }}>
          <span style={{ fontFamily: 'Arial', fontWeight: 900, fontSize: '20px', color: '#22C55E', letterSpacing: '2px' }}>mada</span>
        </div>
      </div>
      <div>
        <label style={lbl}>رقم بطاقة مدى</label>
        <input className="input-dark" placeholder="0000 0000 0000 0000"
          value={num} onChange={e => setNum(fmt(e.target.value))} maxLength={19} />
      </div>
      <div>
        <label style={lbl}>الرقم السري (PIN)</label>
        <input className="input-dark" type="password" placeholder="• • • • • •"
          value={pin} onChange={e => setPin(e.target.value.replace(/\D/g,'').slice(0,6))} maxLength={6} />
      </div>
      <button className="btn-gold w-full" onClick={onSubmit} disabled={num.length < 19 || pin.length < 4} style={{ opacity: (num.length < 19 || pin.length < 4) ? 0.5 : 1 }}>
        ادفع بمدى
      </button>
    </div>
  );
}

function BankForm({ onSubmit }: { onSubmit: () => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="rounded-2xl p-5" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.15)' }}>
        <h4 style={{ fontFamily: 'Tajawal', fontWeight: 700, color: 'hsl(42 30% 90%)', marginBottom: '12px', fontSize: '14px' }}>بيانات التحويل البنكي</h4>
        {[
          { label: 'اسم المستفيد', value: 'شركة مبات للسياحة والضيافة' },
          { label: 'رقم الآيبان', value: 'SA12 3456 7890 1234 5678 9012' },
          { label: 'رقم الحساب', value: '1234567890' },
          { label: 'اسم البنك', value: 'بنك الراجحي' },
          { label: 'رمز السويفت', value: 'RJHISARI' },
        ].map(row => (
          <div key={row.label} className="flex justify-between py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px', fontFamily: 'Tajawal' }}>{row.label}</span>
            <span style={{ color: 'hsl(42 30% 90%)', fontSize: '13px', fontFamily: 'Tajawal', fontWeight: 600, direction: 'ltr' }}>{row.value}</span>
          </div>
        ))}
      </div>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', fontFamily: 'Tajawal', lineHeight: '1.6' }}>
        بعد التحويل، أرسل صورة الإيصال على واتساب لتأكيد الحجز
      </p>
      <button className="btn-gold w-full" onClick={onSubmit}>تأكيد الحجز (سأحوّل الآن)</button>
    </div>
  );
}

const lbl: React.CSSProperties = { color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontFamily: 'Tajawal', display: 'block', marginBottom: '6px' };

export function PaymentModal({ resortName, nights, total, onSuccess, onClose }: Props) {
  const [step, setStep] = useState<Step>('method');
  const [method, setMethod] = useState<PayMethod | null>(null);

  const handlePay = () => {
    setStep('processing');
    setTimeout(() => { setStep('done'); }, 2200);
  };

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="modal-overlay" style={{ zIndex: 200 }} onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 24 }}
          transition={{ type: 'spring', damping: 26, stiffness: 280 }}
          className="w-full max-w-md rounded-3xl overflow-hidden"
          style={{ background: 'hsl(215 42% 10%)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 32px 80px rgba(0,0,0,0.7)', maxHeight: '90vh', overflowY: 'auto' }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {step === 'form' && (
                  <button onClick={() => setStep('method')} style={{ color: 'rgba(255,255,255,0.4)' }} className="hover:text-white/70 transition-colors">
                    <ChevronLeft size={20} />
                  </button>
                )}
                <div>
                  <h3 style={{ fontFamily: 'Tajawal', fontWeight: 800, color: 'hsl(42 30% 90%)', fontSize: '18px' }}>
                    {step === 'done' ? 'تم الحجز بنجاح!' : 'إتمام الدفع'}
                  </h3>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', fontFamily: 'Tajawal' }}>{resortName}</p>
                </div>
              </div>
              {step !== 'processing' && step !== 'done' && (
                <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-all" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Summary */}
            {step !== 'done' && (
              <div className="flex justify-between items-center mt-4 p-3 rounded-xl" style={{ background: 'rgba(212,175,55,0.07)', border: '1px solid rgba(212,175,55,0.15)' }}>
                <span style={{ color: 'rgba(255,255,255,0.55)', fontFamily: 'Tajawal', fontSize: '13px' }}>{nights} ليالٍ</span>
                <span style={{ color: 'hsl(42 90% 52%)', fontFamily: 'Tajawal', fontWeight: 800, fontSize: '18px' }}>{total.toLocaleString('ar-SA')} ريال</span>
              </div>
            )}
          </div>

          {/* Body */}
          <div className="p-6">
            {/* STEP: METHOD SELECTION */}
            {step === 'method' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'Tajawal', fontSize: '13px', marginBottom: '4px' }}>اختر طريقة الدفع</p>
                {METHODS.map(m => (
                  <button key={m.id} onClick={() => { setMethod(m.id); setStep('form'); }}
                    className="flex items-center gap-4 p-4 rounded-2xl text-right transition-all hover:scale-[1.01]"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: m.color + '22', border: `1px solid ${m.color}44`, color: m.color }}>
                      {m.icon}
                    </div>
                    <div className="flex-1">
                      <p style={{ fontFamily: 'Tajawal', fontWeight: 700, color: 'hsl(42 30% 90%)', fontSize: '15px' }}>{m.label}</p>
                      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', fontFamily: 'Tajawal' }}>{m.sub}</p>
                    </div>
                    <ChevronLeft size={16} style={{ color: 'rgba(255,255,255,0.25)' }} />
                  </button>
                ))}
                <div className="flex items-center justify-center gap-3 mt-3 opacity-50">
                  {['🔒','visa','MC','mada'].map(b => (
                    <span key={b} style={{ fontSize: b === '🔒' ? '14px' : '11px', color: 'rgba(255,255,255,0.4)', fontFamily: 'Tajawal', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>{b}</span>
                  ))}
                </div>
              </div>
            )}

            {/* STEP: PAYMENT FORM */}
            {step === 'form' && method && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
                <div className="flex items-center gap-3 mb-5 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                  {(() => { const m = METHODS.find(x => x.id === method)!;
                    return <><div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: m.color + '22', color: m.color }}>{m.icon}</div>
                    <span style={{ fontFamily: 'Tajawal', fontWeight: 700, color: 'hsl(42 30% 90%)' }}>{m.label}</span></>;
                  })()}
                </div>
                {method === 'card' && <CardForm onSubmit={handlePay} />}
                {method === 'apple' && <ApplePayForm onSubmit={handlePay} />}
                {method === 'stcpay' && <STCPayForm onSubmit={handlePay} />}
                {method === 'mada' && <MadaForm onSubmit={handlePay} />}
                {method === 'bank' && <BankForm onSubmit={handlePay} />}
              </motion.div>
            )}

            {/* STEP: PROCESSING */}
            {step === 'processing' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-10">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  className="w-16 h-16 rounded-full mx-auto mb-5"
                  style={{ border: '3px solid rgba(212,175,55,0.2)', borderTopColor: 'hsl(42 90% 52%)' }}
                />
                <p style={{ fontFamily: 'Tajawal', fontWeight: 700, color: 'hsl(42 30% 90%)', fontSize: '16px' }}>جارٍ معالجة الدفع...</p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Tajawal', fontSize: '13px', marginTop: '6px' }}>يرجى الانتظار</p>
              </motion.div>
            )}

            {/* STEP: DONE */}
            {step === 'done' && (
              <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', damping: 18, stiffness: 200 }} className="text-center py-6">
                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 14, stiffness: 260, delay: 0.1 }}
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
                  style={{ background: 'linear-gradient(135deg, hsl(42 90% 52%), hsl(38 80% 40%))' }}
                >
                  <Check size={36} style={{ color: 'hsl(210 35% 6%)' }} />
                </motion.div>
                <h3 style={{ fontFamily: 'Tajawal', fontWeight: 900, fontSize: '22px', color: 'hsl(42 30% 90%)' }}>تم الحجز بنجاح!</h3>
                <p style={{ color: 'rgba(255,255,255,0.55)', fontFamily: 'Tajawal', marginTop: '8px', lineHeight: '1.6' }}>
                  {nights} ليالٍ في {resortName}
                  <br />
                  <span style={{ color: 'hsl(42 90% 52%)', fontWeight: 700 }}>{total.toLocaleString('ar-SA')} ريال</span> تم دفعها
                </p>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px', fontFamily: 'Tajawal', marginTop: '12px' }}>
                  سيصلك تأكيد الحجز على بريدك الإلكتروني
                </p>
                <button className="btn-gold mt-6 px-10" onClick={onSuccess}>ممتاز!</button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
