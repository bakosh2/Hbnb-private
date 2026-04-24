import { useState } from 'react';
import { motion } from 'framer-motion';
import { LogOut, Calendar, Star, Check, X, Clock, Edit2, Save, Phone, Mail, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { RESORTS } from '../data/resorts';
import { ResortDetail } from '../components/ResortDetail';

interface Props { onNavigate: (p: string) => void; onOpenLogin: () => void; }

export function ProfilePage({ onNavigate, onOpenLogin }: Props) {
  const { user, isLoggedIn, logout, updateUser } = useAuth();
  const { getUserBookings } = useBooking();
  const [reviewResort, setReviewResort] = useState<typeof RESORTS[0] | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({ firstName: '', lastName: '', phone: '', nationality: '' });
  const [activeTab, setActiveTab] = useState<'bookings'|'profile'>('bookings');

  if (!isLoggedIn) {
    return (
      <div style={{ paddingTop: '80px', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="text-center px-4">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)' }}>
            <User size={32} style={{ color: 'hsl(42 90% 52%)' }} />
          </div>
          <h2 style={{ fontFamily: 'Tajawal', fontWeight: 800, fontSize: '24px', color: 'hsl(42 30% 90%)', marginBottom: '8px' }}>يجب تسجيل الدخول أولاً</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'Tajawal', marginBottom: '24px', fontSize: '14px' }}>سجّل دخولك لرؤية حجوزاتك وبيانات حسابك</p>
          <button onClick={onOpenLogin} className="btn-gold px-10">تسجيل الدخول</button>
        </div>
      </div>
    );
  }

  const bookings = getUserBookings(user!.id);

  const startEdit = () => {
    setEditForm({ firstName: user!.firstName, lastName: user!.lastName, phone: user!.phone || '', nationality: user!.nationality || '' });
    setEditMode(true);
  };

  const saveEdit = () => {
    updateUser({ firstName: editForm.firstName, lastName: editForm.lastName, phone: editForm.phone, nationality: editForm.nationality });
    setEditMode(false);
  };

  const statusLabel = (s: string) => s === 'confirmed' ? 'مؤكد' : s === 'pending' ? 'قيد الانتظار' : 'ملغي';
  const statusColor = (s: string) => s === 'confirmed' ? 'hsl(145 60% 50%)' : s === 'pending' ? 'hsl(42 90% 52%)' : 'hsl(0 65% 55%)';
  const statusIcon = (s: string) => s === 'confirmed' ? <Check size={12}/> : s === 'pending' ? <Clock size={12}/> : <X size={12}/>;

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh', paddingBottom: '60px' }}>
      <div className="px-4 max-w-4xl mx-auto">

        {/* Profile Header Card */}
        <div className="pt-10 pb-0">
          <div className="liquid-glass rounded-3xl p-6 flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-5">
              <div className="w-18 h-18 rounded-2xl flex items-center justify-center text-3xl font-black shrink-0"
                style={{ width:'72px', height:'72px', background: 'linear-gradient(135deg, hsl(42 90% 52%), hsl(38 80% 40%))', color: 'hsl(210 35% 6%)' }}>
                {user!.firstName?.[0]}{user!.lastName?.[0]}
              </div>
              <div>
                <h1 style={{ fontFamily: 'Tajawal', fontWeight: 900, fontSize: '24px', color: 'hsl(42 30% 90%)' }}>
                  {user!.firstName} {user!.lastName}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <Mail size={13} style={{ color: 'rgba(255,255,255,0.35)' }} />
                  <p style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'Tajawal', fontSize: '14px' }}>{user!.email}</p>
                </div>
                {user!.phone && (
                  <div className="flex items-center gap-2 mt-0.5">
                    <Phone size={13} style={{ color: 'rgba(255,255,255,0.35)' }} />
                    <p style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'Tajawal', fontSize: '14px' }}>{user!.phone}</p>
                  </div>
                )}
                <p style={{ color: 'rgba(255,255,255,0.25)', fontFamily: 'Tajawal', fontSize: '12px', marginTop: '4px' }}>
                  عضو منذ {new Date(user!.createdAt).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long' })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={startEdit}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all hover:bg-white/10"
                style={{ color: 'hsl(42 90% 60%)', border: '1px solid rgba(212,175,55,0.25)', fontFamily: 'Tajawal' }}>
                <Edit2 size={14} /> تعديل البيانات
              </button>
              <button onClick={() => { logout(); onNavigate('home'); }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all hover:bg-white/10"
                style={{ color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'Tajawal' }}>
                <LogOut size={14} /> خروج
              </button>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        {editMode && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="mt-4 liquid-glass rounded-2xl p-6">
            <h3 style={{ fontFamily: 'Tajawal', fontWeight: 700, color: 'hsl(42 30% 90%)', marginBottom: '16px' }}>تعديل البيانات الشخصية</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              {[
                { k: 'firstName', label: 'الاسم الأول', ph: 'الاسم الأول' },
                { k: 'lastName', label: 'اسم العائلة', ph: 'اسم العائلة' },
                { k: 'phone', label: 'رقم الجوال', ph: '05XX XXX XXXX' },
                { k: 'nationality', label: 'الجنسية', ph: 'مثال: سعودي' },
              ].map(f => (
                <div key={f.k}>
                  <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontFamily: 'Tajawal', display: 'block', marginBottom: '6px' }}>{f.label}</label>
                  <input className="input-dark" placeholder={f.ph}
                    value={editForm[f.k as keyof typeof editForm]}
                    onChange={e => setEditForm(ef => ({ ...ef, [f.k]: e.target.value }))} />
                </div>
              ))}
            </div>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', fontFamily: 'Tajawal', marginTop: '8px', marginBottom: '16px' }}>
              * لا يمكن تغيير البريد الإلكتروني
            </p>
            <div className="flex gap-3">
              <button onClick={saveEdit} className="btn-gold flex items-center gap-2 px-6">
                <Save size={15} /> حفظ التغييرات
              </button>
              <button onClick={() => setEditMode(false)} className="btn-glass px-6">إلغاء</button>
            </div>
          </motion.div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          {[
            { value: bookings.length, label: 'إجمالي الحجوزات' },
            { value: bookings.filter(b => b.status === 'confirmed').length, label: 'حجوزات مؤكدة' },
            { value: bookings.reduce((s, b) => s + b.totalPrice, 0).toLocaleString('ar-SA'), label: 'ريال مدفوع' },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="liquid-glass rounded-2xl p-5 text-center">
              <div style={{ fontFamily: 'Tajawal', fontWeight: 900, fontSize: '26px', color: 'hsl(42 90% 52%)' }}>{s.value}</div>
              <div style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'Tajawal', fontSize: '12px', marginTop: '4px' }}>{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mt-6">
          {([['bookings','حجوزاتي'],['profile','بيانات الحساب']] as const).map(([id, label]) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className="px-5 py-2.5 rounded-full text-sm font-medium transition-all"
              style={{ background: activeTab===id ? 'hsl(42 90% 52%)' : 'rgba(255,255,255,0.06)', color: activeTab===id ? 'hsl(210 35% 6%)' : 'rgba(255,255,255,0.6)', fontFamily: 'Tajawal', fontWeight: activeTab===id ? 700 : 400 }}>
              {label}
            </button>
          ))}
        </div>

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="mt-5">
            {bookings.length === 0 ? (
              <div className="liquid-glass rounded-2xl p-12 text-center">
                <Calendar size={40} style={{ color: 'rgba(255,255,255,0.15)', margin: '0 auto 16px' }} />
                <p style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Tajawal', marginBottom: '16px' }}>لا توجد حجوزات بعد</p>
                <button onClick={() => onNavigate('resorts')} className="btn-gold px-8">استكشف المنتجعات</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {bookings.map((b, i) => {
                  const resort = RESORTS.find(r => r.id === b.resortId);
                  const nights = Math.round((new Date(b.checkOut).getTime() - new Date(b.checkIn).getTime()) / 86400000);
                  return (
                    <motion.div key={b.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                      className="liquid-glass rounded-2xl p-5 flex gap-4 items-start">
                      {resort && (
                        <img src={resort.images[0]} alt="" className="rounded-xl object-cover shrink-0"
                          style={{ width: '80px', height: '80px' }}
                          onError={e => { (e.target as HTMLImageElement).src = '/images/01_hero_bg.webp'; }} />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                          <h3 style={{ fontFamily: 'Tajawal', fontWeight: 700, color: 'hsl(42 30% 90%)', fontSize: '15px' }}>{b.resortName}</h3>
                          <span className="flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium shrink-0"
                            style={{ background: `${statusColor(b.status)}18`, color: statusColor(b.status), border: `1px solid ${statusColor(b.status)}35`, fontFamily: 'Tajawal' }}>
                            {statusIcon(b.status)} {statusLabel(b.status)}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                          <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px', fontFamily: 'Tajawal' }}>
                            <Calendar size={11} style={{ display: 'inline', marginLeft: '3px' }} />
                            {b.checkIn} ← {b.checkOut}
                          </span>
                          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>·</span>
                          <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px', fontFamily: 'Tajawal' }}>{nights} ليالٍ</span>
                          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>·</span>
                          <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px', fontFamily: 'Tajawal' }}>{b.guests} ضيف</span>
                        </div>
                        <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                          <span style={{ fontFamily: 'Tajawal', fontWeight: 800, color: 'hsl(42 90% 52%)', fontSize: '17px' }}>
                            {b.totalPrice.toLocaleString('ar-SA')} ريال
                          </span>
                          {resort && (
                            <button onClick={() => setReviewResort(resort)}
                              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full transition-all hover:bg-white/10"
                              style={{ color: 'hsl(42 90% 60%)', border: '1px solid rgba(212,175,55,0.25)', fontFamily: 'Tajawal' }}>
                              <Star size={12}/> تقييم الإقامة
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Profile Data Tab */}
        {activeTab === 'profile' && (
          <div className="mt-5 liquid-glass rounded-2xl p-6">
            <h3 style={{ fontFamily: 'Tajawal', fontWeight: 700, color: 'hsl(42 30% 90%)', marginBottom: '20px' }}>بيانات الحساب</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {[
                { label: 'الاسم الأول', value: user!.firstName },
                { label: 'اسم العائلة', value: user!.lastName },
                { label: 'البريد الإلكتروني', value: user!.email },
                { label: 'رقم الجوال', value: user!.phone || 'لم يُضف بعد' },
                { label: 'الجنسية', value: user!.nationality || 'لم تُضف بعد' },
                { label: 'تاريخ الانضمام', value: new Date(user!.createdAt).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' }) },
              ].map((row, i, arr) => (
                <div key={row.label} className="flex justify-between items-center py-4"
                  style={{ borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                  <span style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'Tajawal', fontSize: '14px' }}>{row.label}</span>
                  <span style={{ color: row.value.includes('لم') ? 'rgba(255,255,255,0.25)' : 'hsl(42 30% 90%)', fontFamily: 'Tajawal', fontSize: '14px', fontWeight: 600 }}>{row.value}</span>
                </div>
              ))}
            </div>
            <button onClick={startEdit} className="btn-gold mt-5 flex items-center gap-2 px-6">
              <Edit2 size={15} /> تعديل البيانات
            </button>
          </div>
        )}
      </div>

      {reviewResort && <ResortDetail resort={reviewResort} onClose={() => setReviewResort(null)} onOpenLogin={onOpenLogin} />}
    </div>
  );
}
