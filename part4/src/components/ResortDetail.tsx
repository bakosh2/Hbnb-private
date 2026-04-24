import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, MapPin, ChevronLeft, ChevronRight, Check, Calendar, Users, MessageSquare } from 'lucide-react';
import type { Resort } from '../data/resorts';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { PaymentModal } from './PaymentModal';

interface Props { resort: Resort; onClose: () => void; onOpenLogin: () => void; }

function StarRating({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(s => (
        <button key={s} type="button"
          onClick={() => onChange?.(s)}
          onMouseEnter={() => onChange && setHover(s)}
          onMouseLeave={() => onChange && setHover(0)}
          style={{ color: s <= (hover||value) ? 'hsl(42 90% 52%)' : 'rgba(255,255,255,0.2)', cursor: onChange ? 'pointer':'default' }}
        >
          <Star size={18} fill={s <= (hover||value) ? 'hsl(42 90% 52%)':'transparent'} />
        </button>
      ))}
    </div>
  );
}

export function ResortDetail({ resort, onClose, onOpenLogin }: Props) {
  const { user, isLoggedIn } = useAuth();
  const { addBooking, addReview, getResortReviews } = useBooking();
  const [imgIdx, setImgIdx] = useState(0);
  const [tab, setTab] = useState<'overview'|'book'|'reviews'>('overview');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [showPayment, setShowPayment] = useState(false);
  const [bookingDone, setBookingDone] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewDone, setReviewDone] = useState(false);

  const reviews = getResortReviews(resort.id);

  const nights = (() => {
    if (!checkIn || !checkOut) return 0;
    const d = (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000;
    return d > 0 ? d : 0;
  })();
  const total = nights * resort.priceMin;

  const handleBookClick = () => {
    if (!isLoggedIn) { onOpenLogin(); return; }
    if (nights < 1) return;
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    addBooking({ resortId: resort.id, resortName: resort.nameAr, userId: user!.id, checkIn, checkOut, guests, totalPrice: total });
    setShowPayment(false);
    setBookingDone(true);
  };

  const handleReview = () => {
    if (!isLoggedIn) { onOpenLogin(); return; }
    if (!reviewText.trim()) return;
    addReview({ resortId: resort.id, userId: user!.id, userName: `${user!.firstName} ${user!.lastName}`, rating: reviewRating, comment: reviewText });
    setReviewDone(true);
    setReviewText('');
  };

  return (
    <>
      <AnimatePresence>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="modal-overlay" style={{ zIndex: 100 }} onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.96 }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="w-full max-w-3xl rounded-3xl relative"
            style={{ background: 'hsl(215 40% 9%)', border: '1px solid rgba(255,255,255,0.08)', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Image Gallery */}
            <div className="relative h-72 md:h-80 overflow-hidden rounded-t-3xl shrink-0">
              <img src={resort.images[imgIdx]} alt={resort.nameAr} className="w-full h-full object-cover"
                onError={e => { (e.target as HTMLImageElement).src = '/images/01_hero_bg.webp'; }} />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)' }} />
              <button onClick={onClose} className="absolute top-4 left-4 w-9 h-9 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', color: '#fff' }}>
                <X size={16} />
              </button>
              {resort.images.length > 1 && (
                <>
                  <button onClick={() => setImgIdx(i => (i+1)%resort.images.length)} className="absolute top-1/2 right-3 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.4)' }}>
                    <ChevronRight size={18} className="text-white" />
                  </button>
                  <button onClick={() => setImgIdx(i => (i-1+resort.images.length)%resort.images.length)} className="absolute top-1/2 left-3 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.4)' }}>
                    <ChevronLeft size={18} className="text-white" />
                  </button>
                  <div className="absolute bottom-3 right-3 flex gap-1.5">
                    {resort.images.slice(0,4).map((img, i) => (
                      <button key={i} onClick={() => setImgIdx(i)} className="w-10 h-10 rounded-lg overflow-hidden border-2 transition-all"
                        style={{ borderColor: i===imgIdx ? 'hsl(42 90% 52%)':'transparent' }}>
                        <img src={img} className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).src = '/images/01_hero_bg.webp'; }} />
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Header */}
            <div className="px-6 pt-5 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="section-badge text-xs py-0.5 px-3">{resort.regionLabel}</span>
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', fontFamily: 'Tajawal' }}>{resort.type}</span>
                  </div>
                  <h2 style={{ fontFamily: 'Tajawal', fontWeight: 800, fontSize: '22px', color: 'hsl(42 30% 90%)' }}>{resort.nameAr}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin size={13} style={{ color: 'rgba(255,255,255,0.4)' }} />
                    <span style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'Tajawal', fontSize: '13px' }}>{resort.location}</span>
                  </div>
                </div>
                <div className="text-left shrink-0">
                  <div className="flex items-center gap-1 justify-end">
                    <Star size={14} fill="hsl(42 90% 52%)" style={{ color: 'hsl(42 90% 52%)' }} />
                    <span style={{ fontFamily: 'Tajawal', fontWeight: 700, color: 'hsl(42 90% 65%)' }}>{resort.rating}</span>
                    <span style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'Tajawal', fontSize: '12px' }}>({resort.reviewCount + reviews.length})</span>
                  </div>
                  <div className="mt-2 text-left">
                    <span className="price-tag">{resort.priceMin.toLocaleString('ar-SA')}</span>
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Tajawal', fontSize: '12px', marginRight: '4px' }}>ريال/ليلة</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-1 mt-4">
                {([['overview','نظرة عامة'],['book','احجز الآن'],['reviews','التقييمات']] as const).map(([id, label]) => (
                  <button key={id} onClick={() => setTab(id)}
                    className="px-4 py-2 rounded-full text-sm font-medium transition-all"
                    style={{ background: tab===id ? 'hsl(42 90% 52%)' : 'rgba(255,255,255,0.06)', color: tab===id ? 'hsl(210 35% 6%)' : 'rgba(255,255,255,0.6)', fontFamily: 'Tajawal' }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {tab === 'overview' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <p style={{ color: 'rgba(255,255,255,0.65)', fontFamily: 'Tajawal', lineHeight: '1.7', fontSize: '15px' }}>{resort.description}</p>
                  <div>
                    <h4 style={{ fontFamily: 'Tajawal', fontWeight: 700, color: 'hsl(42 30% 90%)', marginBottom: '12px' }}>المرافق والخدمات</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                      {resort.amenities.map(a => (
                        <div key={a} className="flex items-center gap-2">
                          <Check size={14} style={{ color: 'hsl(42 90% 52%)' }} />
                          <span style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'Tajawal', fontSize: '14px' }}>{a}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-2xl p-4" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.15)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                      <div>
                        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', fontFamily: 'Tajawal' }}>نوع الوحدة</span>
                        <p style={{ color: 'hsl(42 30% 90%)', fontFamily: 'Tajawal', fontWeight: 600, fontSize: '14px' }}>{resort.unitType}</p>
                      </div>
                      <div>
                        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', fontFamily: 'Tajawal' }}>نطاق الأسعار</span>
                        <p style={{ color: 'hsl(42 90% 52%)', fontFamily: 'Tajawal', fontWeight: 700, fontSize: '14px' }}>
                          {resort.priceMin.toLocaleString('ar-SA')} - {resort.priceMax.toLocaleString('ar-SA')} ريال
                        </p>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setTab('book')} className="btn-gold w-full">احجز الآن</button>
                </div>
              )}

              {tab === 'book' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  {bookingDone ? (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
                      <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(212,175,55,0.15)' }}>
                        <Check size={28} style={{ color: 'hsl(42 90% 52%)' }} />
                      </div>
                      <h3 style={{ fontFamily: 'Tajawal', fontWeight: 800, fontSize: '20px', color: 'hsl(42 30% 90%)' }}>تم تأكيد الحجز!</h3>
                      <p style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'Tajawal', marginTop: '8px' }}>
                        {nights} ليالٍ في {resort.nameAr}
                      </p>
                      <button onClick={() => setBookingDone(false)} className="btn-glass mt-6">حجز آخر</button>
                    </motion.div>
                  ) : (
                    <>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontFamily: 'Tajawal', display: 'block', marginBottom: '6px' }}>
                            <Calendar size={12} style={{ display: 'inline', marginLeft: '4px' }} />تاريخ الوصول
                          </label>
                          <input type="date" className="input-dark" value={checkIn} onChange={e => setCheckIn(e.target.value)} min={new Date().toISOString().split('T')[0]} />
                        </div>
                        <div>
                          <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontFamily: 'Tajawal', display: 'block', marginBottom: '6px' }}>
                            <Calendar size={12} style={{ display: 'inline', marginLeft: '4px' }} />تاريخ المغادرة
                          </label>
                          <input type="date" className="input-dark" value={checkOut} onChange={e => setCheckOut(e.target.value)} min={checkIn || new Date().toISOString().split('T')[0]} />
                        </div>
                      </div>
                      <div>
                        <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontFamily: 'Tajawal', display: 'block', marginBottom: '6px' }}>
                          <Users size={12} style={{ display: 'inline', marginLeft: '4px' }} />عدد الضيوف
                        </label>
                        <div className="flex items-center gap-3">
                          <button onClick={() => setGuests(g => Math.max(1,g-1))} className="w-9 h-9 rounded-full flex items-center justify-center text-lg font-bold transition-all hover:bg-white/10" style={{ background: 'rgba(255,255,255,0.06)', color: 'white' }}>-</button>
                          <span style={{ fontFamily: 'Tajawal', fontWeight: 700, color: 'hsl(42 30% 90%)', minWidth: '24px', textAlign: 'center' }}>{guests}</span>
                          <button onClick={() => setGuests(g => Math.min(20,g+1))} className="w-9 h-9 rounded-full flex items-center justify-center text-lg font-bold transition-all hover:bg-white/10" style={{ background: 'rgba(255,255,255,0.06)', color: 'white' }}>+</button>
                          <span style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Tajawal', fontSize: '13px' }}>ضيف</span>
                        </div>
                      </div>
                      {nights > 0 && (
                        <div className="rounded-2xl p-4" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.15)' }}>
                          <div className="flex justify-between mb-2">
                            <span style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'Tajawal', fontSize: '14px' }}>{resort.priceMin.toLocaleString('ar-SA')} × {nights} ليالٍ</span>
                            <span style={{ color: 'hsl(42 30% 90%)', fontFamily: 'Tajawal', fontSize: '14px' }}>{total.toLocaleString('ar-SA')} ريال</span>
                          </div>
                          <div className="flex justify-between pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                            <span style={{ color: 'hsl(42 30% 90%)', fontFamily: 'Tajawal', fontWeight: 700 }}>الإجمالي</span>
                            <span style={{ color: 'hsl(42 90% 52%)', fontFamily: 'Tajawal', fontWeight: 800, fontSize: '18px' }}>{total.toLocaleString('ar-SA')} ريال</span>
                          </div>
                        </div>
                      )}
                      <button onClick={handleBookClick} className="btn-gold w-full" disabled={nights < 1} style={{ opacity: nights < 1 ? 0.5 : 1 }}>
                        {isLoggedIn ? 'المتابعة للدفع' : 'سجّل دخولك للحجز'}
                      </button>
                      <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', textAlign: 'center', fontFamily: 'Tajawal' }}>الأسعار تقريبية وقد تتغير حسب الموسم والتوفر</p>
                    </>
                  )}
                </div>
              )}

              {tab === 'reviews' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div className="flex items-center gap-2 mb-3">
                      <MessageSquare size={16} style={{ color: 'hsl(42 90% 52%)' }} />
                      <span style={{ fontFamily: 'Tajawal', fontWeight: 700, color: 'hsl(42 30% 90%)' }}>أضف تقييمك</span>
                    </div>
                    {reviewDone ? (
                      <p style={{ color: 'hsl(42 90% 60%)', fontFamily: 'Tajawal', fontSize: '14px' }}>شكراً على تقييمك!</p>
                    ) : (
                      <>
                        <StarRating value={reviewRating} onChange={setReviewRating} />
                        <textarea className="input-dark mt-3" rows={3} placeholder="شاركنا تجربتك..."
                          value={reviewText} onChange={e => setReviewText(e.target.value)} style={{ resize: 'none' }} />
                        <button onClick={handleReview} className="btn-gold mt-3 px-6 py-2 text-sm">نشر التقييم</button>
                      </>
                    )}
                  </div>
                  {reviews.length === 0 ? (
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Tajawal', textAlign: 'center', padding: '20px 0' }}>لا توجد تقييمات بعد</p>
                  ) : reviews.map(r => (
                    <div key={r.id} className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm"
                            style={{ background: 'linear-gradient(135deg, hsl(42 90% 52%), hsl(38 80% 40%))', color: 'hsl(210 35% 6%)' }}>
                            {r.userName[0]}
                          </div>
                          <div>
                            <p style={{ fontFamily: 'Tajawal', fontWeight: 600, color: 'hsl(42 30% 90%)', fontSize: '14px' }}>{r.userName}</p>
                            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px', fontFamily: 'Tajawal' }}>{r.date}</p>
                          </div>
                        </div>
                        <StarRating value={r.rating} />
                      </div>
                      <p style={{ color: 'rgba(255,255,255,0.65)', fontFamily: 'Tajawal', fontSize: '14px', lineHeight: '1.6' }}>{r.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {showPayment && (
        <PaymentModal
          resortName={resort.nameAr}
          nights={nights}
          total={total}
          onSuccess={handlePaymentSuccess}
          onClose={() => setShowPayment(false)}
        />
      )}
    </>
  );
}
