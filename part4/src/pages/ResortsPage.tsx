import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X, MapPin } from 'lucide-react';
import { RESORTS, REGIONS } from '../data/resorts';
import { ResortCard } from '../components/ResortCard';
import { ResortDetail } from '../components/ResortDetail';

interface Props { onOpenLogin: () => void; }

const PRICE_RANGES = [
  { id: 'all', label: 'كل الأسعار', min: 0, max: 999999 },
  { id: 'budget', label: 'حتى 2,000 ريال', min: 0, max: 2000 },
  { id: 'mid', label: '2,000 - 5,000 ريال', min: 2000, max: 5000 },
  { id: 'luxury', label: '5,000 - 10,000 ريال', min: 5000, max: 10000 },
  { id: 'ultra', label: 'أكثر من 10,000 ريال', min: 10000, max: 999999 },
];
const SORT_OPTIONS = [
  { id: 'rating', label: 'الأعلى تقييماً' },
  { id: 'price_asc', label: 'الأقل سعراً' },
  { id: 'price_desc', label: 'الأعلى سعراً' },
];

export function ResortsPage({ onOpenLogin }: Props) {
  const [query, setQuery] = useState('');
  const [region, setRegion] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sort, setSort] = useState('rating');
  const [showFilters, setShowFilters] = useState(false);
  const [selected, setSelected] = useState<typeof RESORTS[0] | null>(null);

  const filtered = useMemo(() => {
    let list = [...RESORTS];
    if (query) list = list.filter(r => r.nameAr.includes(query) || r.location.includes(query) || r.type.includes(query));
    if (region !== 'all') list = list.filter(r => r.region === region);
    const pr = PRICE_RANGES.find(p => p.id === priceRange)!;
    list = list.filter(r => r.priceMin >= pr.min && r.priceMin <= pr.max);
    if (sort === 'rating') list.sort((a, b) => b.rating - a.rating);
    if (sort === 'price_asc') list.sort((a, b) => a.priceMin - b.priceMin);
    if (sort === 'price_desc') list.sort((a, b) => b.priceMin - a.priceMin);
    return list;
  }, [query, region, priceRange, sort]);

  const activeFilters = [region !== 'all', priceRange !== 'all'].filter(Boolean).length;

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh' }}>
      {/* Header */}
      <div className="px-4 pt-12 pb-8">
        <div className="max-w-7xl mx-auto">
          <span className="section-badge mb-4 inline-flex"><MapPin size={12} /> المنتجعات الساحلية</span>
          <h1 style={{ fontFamily: 'Tajawal', fontWeight: 900, fontSize: 'clamp(28px, 4vw, 52px)', color: 'hsl(42 30% 90%)', lineHeight: 1.1, marginBottom: '8px' }}>
            اكتشف المنتجعات
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'Tajawal', fontSize: '15px' }}>
            {filtered.length} منتجع متاح · أسعار حقيقية
          </p>
        </div>
      </div>

      {/* Sticky Search + Filters */}
      <div className="sticky top-16 z-30 px-4 pb-4" style={{ background: 'hsl(210 35% 6%)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-7xl mx-auto flex gap-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute top-3.5 right-3.5" style={{ color: 'rgba(255,255,255,0.3)' }} />
            <input className="input-dark pr-10" placeholder="ابحث عن منتجع أو منطقة..." value={query} onChange={e => setQuery(e.target.value)} />
          </div>
          <button onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-3 rounded-xl transition-all"
            style={{ background: showFilters ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.05)', border: '1px solid', borderColor: showFilters ? 'rgba(212,175,55,0.35)' : 'rgba(255,255,255,0.1)', color: showFilters ? 'hsl(42 90% 60%)' : 'rgba(255,255,255,0.7)', fontFamily: 'Tajawal' }}
          >
            <SlidersHorizontal size={16} />
            <span className="hidden md:inline text-sm">تصفية</span>
            {activeFilters > 0 && <span className="w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold" style={{ background: 'hsl(42 90% 52%)', color: 'hsl(210 35% 6%)' }}>{activeFilters}</span>}
          </button>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="max-w-7xl mx-auto mt-4">
            <div className="liquid-glass rounded-2xl p-5 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Region */}
              <div>
                <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontFamily: 'Tajawal', display: 'block', marginBottom: '8px' }}>المنطقة</label>
                <div className="flex flex-wrap gap-2">
                  {REGIONS.map(r => (
                    <button key={r.id} onClick={() => setRegion(r.id)}
                      className="rounded-full px-3 py-1.5 text-xs transition-all"
                      style={{ background: region === r.id ? 'hsl(42 90% 52%)' : 'rgba(255,255,255,0.06)', color: region === r.id ? 'hsl(210 35% 6%)' : 'rgba(255,255,255,0.65)', fontFamily: 'Tajawal', fontWeight: region === r.id ? 700 : 400 }}
                    >{r.label}</button>
                  ))}
                </div>
              </div>
              {/* Price */}
              <div>
                <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontFamily: 'Tajawal', display: 'block', marginBottom: '8px' }}>نطاق السعر</label>
                <div className="flex flex-wrap gap-2">
                  {PRICE_RANGES.map(p => (
                    <button key={p.id} onClick={() => setPriceRange(p.id)}
                      className="rounded-full px-3 py-1.5 text-xs transition-all"
                      style={{ background: priceRange === p.id ? 'hsl(42 90% 52%)' : 'rgba(255,255,255,0.06)', color: priceRange === p.id ? 'hsl(210 35% 6%)' : 'rgba(255,255,255,0.65)', fontFamily: 'Tajawal', fontWeight: priceRange === p.id ? 700 : 400 }}
                    >{p.label}</button>
                  ))}
                </div>
              </div>
              {/* Sort */}
              <div>
                <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontFamily: 'Tajawal', display: 'block', marginBottom: '8px' }}>الترتيب</label>
                <div className="flex flex-wrap gap-2">
                  {SORT_OPTIONS.map(s => (
                    <button key={s.id} onClick={() => setSort(s.id)}
                      className="rounded-full px-3 py-1.5 text-xs transition-all"
                      style={{ background: sort === s.id ? 'hsl(42 90% 52%)' : 'rgba(255,255,255,0.06)', color: sort === s.id ? 'hsl(210 35% 6%)' : 'rgba(255,255,255,0.65)', fontFamily: 'Tajawal', fontWeight: sort === s.id ? 700 : 400 }}
                    >{s.label}</button>
                  ))}
                </div>
              </div>
            </div>
            {(region !== 'all' || priceRange !== 'all') && (
              <button onClick={() => { setRegion('all'); setPriceRange('all'); }} className="flex items-center gap-1 mt-2 text-xs transition-all hover:opacity-80" style={{ color: 'hsl(42 90% 60%)', fontFamily: 'Tajawal' }}>
                <X size={12} /> مسح الفلاتر
              </button>
            )}
          </motion.div>
        )}
      </div>

      {/* Grid */}
      <div className="px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <p style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'Tajawal', fontSize: '16px' }}>لا توجد نتائج. جرّب تغيير معايير البحث.</p>
              <button onClick={() => { setQuery(''); setRegion('all'); setPriceRange('all'); }} className="btn-glass mt-4 px-6">مسح البحث</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((r, i) => (
                <motion.div key={r.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, duration: 0.5 }}>
                  <ResortCard resort={r} onClick={() => setSelected(r)} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selected && <ResortDetail resort={selected} onClose={() => setSelected(null)} onOpenLogin={onOpenLogin} />}
    </div>
  );
}
