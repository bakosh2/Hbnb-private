import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Resort } from '../data/resorts';

interface Props {
  resort: Resort;
  onClick: () => void;
}

export function ResortCard({ resort, onClick }: Props) {
  const [imgIdx, setImgIdx] = useState(0);

  const nextImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImgIdx(i => (i + 1) % resort.images.length);
  };
  const prevImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImgIdx(i => (i - 1 + resort.images.length) % resort.images.length);
  };

  return (
    <motion.div
      onClick={onClick}
      className="resort-card rounded-2xl overflow-hidden cursor-pointer"
      style={{ background: 'hsl(215 40% 9%)', border: '1px solid rgba(255,255,255,0.07)' }}
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 300, damping: 26 }}
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={resort.images[imgIdx]}
          alt={resort.nameAr}
          className="w-full h-full object-cover transition-transform duration-700"
          style={{ transform: 'scale(1.02)' }}
          onError={e => { (e.target as HTMLImageElement).src = '/images/01_hero_bg.webp'; }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)' }} />

        {/* Nav arrows */}
        {resort.images.length > 1 && (
          <>
            <button onClick={prevImg} className="absolute top-1/2 right-2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'rgba(0,0,0,0.5)' }}>
              <ChevronRight size={14} className="text-white" />
            </button>
            <button onClick={nextImg} className="absolute top-1/2 left-2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.5)' }}>
              <ChevronLeft size={14} className="text-white" />
            </button>
          </>
        )}

        {/* Dots */}
        {resort.images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {resort.images.map((_, i) => (
              <div key={i} className="rounded-full transition-all" style={{ width: i === imgIdx ? '16px' : '6px', height: '6px', background: i === imgIdx ? 'hsl(42 90% 52%)' : 'rgba(255,255,255,0.4)' }} />
            ))}
          </div>
        )}

        {/* Type badge */}
        <div className="absolute top-3 right-3">
          <span className="section-badge text-xs py-1 px-3">{resort.type}</span>
        </div>

        {/* Featured */}
        {resort.featured && (
          <div className="absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-bold" style={{ background: 'linear-gradient(135deg, hsl(42 90% 52%), hsl(38 80% 40%))', color: 'hsl(210 35% 6%)' }}>
            مميز
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base leading-tight truncate" style={{ color: 'hsl(42 30% 90%)', fontFamily: 'Tajawal' }}>
              {resort.nameAr}
            </h3>
            <div className="flex items-center gap-1 mt-1">
              <MapPin size={12} style={{ color: 'rgba(255,255,255,0.4)' }} />
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Tajawal' }}>{resort.location}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Star size={13} fill="hsl(42 90% 52%)" style={{ color: 'hsl(42 90% 52%)' }} />
            <span className="text-sm font-semibold" style={{ color: 'hsl(42 90% 65%)', fontFamily: 'Tajawal' }}>{resort.rating}</span>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'Tajawal' }}>({resort.reviewCount})</span>
          </div>
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-1 mt-3">
          {resort.amenities.slice(0, 3).map(a => (
            <span key={a} className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.55)', fontFamily: 'Tajawal' }}>{a}</span>
          ))}
          {resort.amenities.length > 3 && (
            <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.55)', fontFamily: 'Tajawal' }}>+{resort.amenities.length - 3}</span>
          )}
        </div>

        {/* Price */}
        <div className="flex items-end justify-between mt-4 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <div>
            <span className="price-tag">{resort.priceMin.toLocaleString('ar-SA')}</span>
            <span className="text-xs mr-1" style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'Tajawal' }}>ريال / ليلة</span>
          </div>
          <div className="flex items-center gap-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
            <Users size={13} />
            <span className="text-xs" style={{ fontFamily: 'Tajawal' }}>{resort.unitType}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
