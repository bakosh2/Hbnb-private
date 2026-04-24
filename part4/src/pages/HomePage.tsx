import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Star, ArrowLeft, Waves, Shield, Clock, Award } from 'lucide-react';
import { RESORTS } from '../data/resorts';
import { ResortCard } from '../components/ResortCard';
import { ResortDetail } from '../components/ResortDetail';

interface Props {
  onNavigate: (page: string) => void;
  onOpenLogin: () => void;
}

const PARTNERS = ['نيوم','البحر الأحمر','أمالا','ذا لاين','سندالة','تروجينا'];
const STATS = [
  { value: '50+', label: 'منتجع فاخر' },
  { value: '15', label: 'منطقة ساحلية' },
  { value: '98%', label: 'رضا العملاء' },
  { value: '24/7', label: 'خدمة العملاء' },
];
const WHY = [
  { icon: <Shield size={22} />, title: 'حجز آمن ومضمون', body: 'منصة محمية بأعلى معايير الأمان. بياناتك وحجوزاتك في أمان تام.' },
  { icon: <Star size={22} />, title: 'منتجعات مُختارة بعناية', body: 'كل منتجع مُدرج يجتاز معايير الجودة والفخامة التي تضمن تجربة استثنائية.' },
  { icon: <Clock size={22} />, title: 'تأكيد فوري', body: 'احجز وتأكد في دقائق. لا انتظار ولا تعقيد.' },
  { icon: <Award size={22} />, title: 'أفضل الأسعار', body: 'أسعار حقيقية ومعتمدة مباشرة من المنتجعات بدون رسوم خفية.' },
];

function BlurWord({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  return (
    <motion.span
      className={`inline-block ${className || ''}`}
      initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
      animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22,1,0.36,1], delay }}
    >
      {text}
    </motion.span>
  );
}

export function HomePage({ onNavigate, onOpenLogin }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResort, setSelectedResort] = useState<typeof RESORTS[0] | null>(null);
  const featured = RESORTS.filter(r => r.featured);

  const handleSearch = () => {
    if (searchQuery.trim()) onNavigate('resorts');
  };

  return (
    <div style={{ paddingTop: '80px' }}>
      {/* ── HERO ─────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* BG */}
        <div className="absolute inset-0 z-0">
          <img src="/images/01_hero_bg.webp" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(9,15,24,0.55) 0%, rgba(9,15,24,0.35) 40%, rgba(9,15,24,0.8) 80%, hsl(210 35% 6%) 100%)' }} />
          <div className="absolute inset-0" style={{ background: 'radial-gradient(120% 80% at 50% 60%, transparent 35%, rgba(0,0,0,0.5) 100%)' }} />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto w-full">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <span className="section-badge mb-6 inline-flex">
              <Waves size={13} /> وجهات ساحلية فاخرة في المملكة
            </span>
          </motion.div>

          <h1 style={{ fontFamily: 'Tajawal', fontWeight: 900, lineHeight: 1.1, marginBottom: '16px' }}>
            {['اكتشف', 'أجمل', 'المنتجعات', 'الساحلية'].map((w, i) => (
              <span key={i}>
                <BlurWord
                  text={w}
                  delay={0.2 + i * 0.1}
                  className={i === 0 || i === 2 ? 'text-white' : ''}
                />
                {' '}
              </span>
            ))}
            <br />
            <BlurWord
              text="في المملكة العربية السعودية"
              delay={0.65}
              className="block"
            />
          </h1>
          <style>{`h1 { font-size: clamp(36px, 6vw, 88px); color: hsl(42 90% 52%); }`}</style>

          <motion.p
            initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay: 0.85, duration: 0.7, ease: [0.22,1,0.36,1] }}
            style={{ color: 'rgba(255,255,255,0.65)', fontSize: '18px', fontFamily: 'Tajawal', maxWidth: '560px', margin: '0 auto 40px', lineHeight: 1.6 }}
          >
            من البحر الأحمر إلى نيوم — احجز إقامتك في أفخم المنتجعات الساحلية السعودية بأسعار حقيقية
          </motion.p>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.6 }}
            className="liquid-glass-strong rounded-2xl p-2 max-w-xl mx-auto flex gap-2"
          >
            <div className="flex-1 relative">
              <Search size={16} className="absolute top-3 right-3" style={{ color: 'rgba(255,255,255,0.35)' }} />
              <input
                className="input-dark pr-9 border-0 rounded-xl"
                style={{ background: 'transparent' }}
                placeholder="ابحث عن منتجع، منطقة، أو نوع..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <button onClick={handleSearch} className="btn-gold px-6 shrink-0">بحث</button>
          </motion.div>

          {/* Quick filters */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="flex flex-wrap gap-2 justify-center mt-5">
            {['البحر الأحمر','جدة','نيوم','الخبر','ينبع'].map(loc => (
              <button key={loc} onClick={() => onNavigate('resorts')}
                className="rounded-full px-4 py-1.5 text-sm transition-all hover:bg-white/10"
                style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'Tajawal' }}
              >
                <MapPin size={11} style={{ display: 'inline', marginLeft: '4px' }} />{loc}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 inset-x-0 h-40 gradient-fade-b z-10" />
      </section>

      {/* ── PARTNERS MARQUEE ──────────────────────── */}
      <section className="py-10 overflow-hidden" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex gap-16 w-max animate-marquee" style={{ mask: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
          {[...PARTNERS, ...PARTNERS, ...PARTNERS].map((p, i) => (
            <span key={i} style={{ fontFamily: 'Tajawal', fontWeight: 700, fontSize: '18px', color: 'rgba(255,255,255,0.25)', whiteSpace: 'nowrap' }}>{p}</span>
          ))}
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="liquid-glass rounded-3xl p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                <div style={{ fontFamily: 'Tajawal', fontWeight: 900, fontSize: 'clamp(32px, 5vw, 52px)', color: 'hsl(42 90% 52%)', lineHeight: 1 }}>{s.value}</div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'Tajawal', fontSize: '13px', marginTop: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED RESORTS ───────────────────────── */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="section-badge mb-3 inline-flex">منتجعات مميزة</span>
              <h2 style={{ fontFamily: 'Tajawal', fontWeight: 900, fontSize: 'clamp(28px, 4vw, 48px)', color: 'hsl(42 30% 90%)', lineHeight: 1.1 }}>
                أبرز وجهاتنا الساحلية
              </h2>
            </div>
            <button onClick={() => onNavigate('resorts')} className="hidden md:flex items-center gap-2 text-sm transition-all hover:opacity-80" style={{ color: 'hsl(42 90% 60%)', fontFamily: 'Tajawal' }}>
              عرض الكل <ArrowLeft size={16} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map(r => (
              <ResortCard key={r.id} resort={r} onClick={() => setSelectedResort(r)} />
            ))}
          </div>
          <div className="text-center mt-8 md:hidden">
            <button onClick={() => onNavigate('resorts')} className="btn-glass">عرض كل المنتجعات</button>
          </div>
        </div>
      </section>

      {/* ── WHY MABAT ──────────────────────────────── */}
      <section className="py-20 px-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="section-badge mb-3 inline-flex">لماذا مبات؟</span>
            <h2 style={{ fontFamily: 'Tajawal', fontWeight: 900, fontSize: 'clamp(26px, 4vw, 44px)', color: 'hsl(42 30% 90%)' }}>
              تجربة حجز لا مثيل لها
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {WHY.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22,1,0.36,1] }}
                className="liquid-glass rounded-2xl p-7 flex flex-col gap-4"
                style={{ minHeight: '220px' }}
              >
                <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.12)', color: 'hsl(42 90% 52%)', border: '1px solid rgba(212,175,55,0.2)' }}>
                  {item.icon}
                </div>
                <h3 style={{ fontFamily: 'Tajawal', fontWeight: 700, color: 'hsl(42 30% 90%)', fontSize: '16px' }}>{item.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.55)', fontFamily: 'Tajawal', fontSize: '13px', lineHeight: '1.65' }}>{item.body}</p>
                <div style={{ marginTop: 'auto', height: '2px', width: '32px', background: 'linear-gradient(to right, hsl(42 90% 52%), transparent)' }} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ─────────────────────────────── */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/images/03_cta_bg.webp" alt="" className="w-full h-full object-cover" style={{ filter: 'brightness(0.4)' }} />
          <div className="absolute inset-0 gradient-fade-t" />
          <div className="absolute inset-0 gradient-fade-b" />
        </div>
        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <h2 style={{ fontFamily: 'Tajawal', fontWeight: 900, fontSize: 'clamp(30px, 5vw, 60px)', color: 'hsl(42 30% 90%)', lineHeight: 1.1, marginBottom: '16px' }}>
            جاهز لإقامتك الساحلية؟
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'Tajawal', fontSize: '17px', marginBottom: '32px' }}>
            اكتشف أكثر من 50 منتجعاً ساحلياً فاخراً في المملكة بأسعار حقيقية وحجز فوري
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <button onClick={() => onNavigate('resorts')} className="btn-gold px-8">استكشف المنتجعات</button>
            <button onClick={onOpenLogin} className="btn-glass px-8">سجّل مجاناً</button>
          </div>
        </div>
      </section>

      {/* Resort Detail Modal */}
      {selectedResort && (
        <ResortDetail resort={selectedResort} onClose={() => setSelectedResort(null)} onOpenLogin={onOpenLogin} />
      )}
    </div>
  );
}
