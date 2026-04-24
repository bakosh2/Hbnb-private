import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export interface Review {
  id: string;
  resortId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  stayDate?: string;
}

export interface Booking {
  id: string;
  resortId: string;
  resortName: string;
  userId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  createdAt: string;
  reviewId?: string;
}

interface BookingContextType {
  bookings: Booking[];
  reviews: Review[];
  addBooking: (b: Omit<Booking, 'id' | 'createdAt' | 'status'>) => Booking;
  addReview: (r: Omit<Review, 'id' | 'date'>) => void;
  getUserBookings: (userId: string) => Booking[];
  getResortReviews: (resortId: string) => Review[];
  getResortRating: (resortId: string) => { rating: number; count: number };
}

const BookingContext = createContext<BookingContextType | null>(null);
const BOOKINGS_KEY = 'mabat_bookings';
const REVIEWS_KEY = 'mabat_reviews';

const initialReviews: Review[] = [
  { id: 'r1', resortId: 'nujuma-ritz', userId: 'demo', userName: 'أحمد الشمري', rating: 5, comment: 'تجربة لا تُنسى! الموقع رائع والخدمة استثنائية. فيلا فوق الماء كانت حلماً حقيقياً.', date: '2026-02-15' },
  { id: 'r2', resortId: 'nujuma-ritz', userId: 'demo2', userName: 'سارة المطيري', rating: 5, comment: 'أفضل إجازة في حياتي. الموظفون محترفون جداً والطعام لذيذ.', date: '2026-01-20' },
  { id: 'r3', resortId: 'dana-beach-khobar', userId: 'demo3', userName: 'فيصل العتيبي', rating: 4, comment: 'منتجع ممتاز للعائلات. الأطفال استمتعوا كثيراً بالأنشطة المائية.', date: '2026-03-01' },
  { id: 'r4', resortId: 'narcissus-abhur', userId: 'demo4', userName: 'نورة الزهراني', rating: 5, comment: 'الموقع مثالي وهادئ. المسبح الخاص كان رائعاً. سأعود بالتأكيد.', date: '2026-02-28' },
  { id: 'r5', resortId: 'four-seasons-sindalah', userId: 'demo5', userName: 'خالد السبيعي', rating: 5, comment: 'تجربة فريدة من نوعها في نيوم. المستقبل حقيقي!', date: '2026-03-10' },
  { id: 'r6', resortId: 'st-regis-red-sea', userId: 'demo6', userName: 'منى القحطاني', rating: 5, comment: 'خدمة البتلر لا مثيل لها. كل تفصيلة محسوبة ببراعة.', date: '2026-01-30' },
];

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const raw = localStorage.getItem(BOOKINGS_KEY);
    return raw ? JSON.parse(raw) : [];
  });
  const [reviews, setReviews] = useState<Review[]>(() => {
    const raw = localStorage.getItem(REVIEWS_KEY);
    return raw ? JSON.parse(raw) : initialReviews;
  });

  useEffect(() => { localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings)); }, [bookings]);
  useEffect(() => { localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews)); }, [reviews]);

  const addBooking = (b: Omit<Booking, 'id' | 'createdAt' | 'status'>) => {
    const booking: Booking = { ...b, id: crypto.randomUUID(), createdAt: new Date().toISOString(), status: 'confirmed' };
    setBookings(prev => [...prev, booking]);
    return booking;
  };

  const addReview = (r: Omit<Review, 'id' | 'date'>) => {
    const review: Review = { ...r, id: crypto.randomUUID(), date: new Date().toISOString().split('T')[0] };
    setReviews(prev => [...prev, review]);
  };

  const getUserBookings = (userId: string) => bookings.filter(b => b.userId === userId);

  const getResortReviews = (resortId: string) => reviews.filter(r => r.resortId === resortId);

  const getResortRating = (resortId: string) => {
    const rs = getResortReviews(resortId);
    if (!rs.length) return { rating: 0, count: 0 };
    const avg = rs.reduce((s, r) => s + r.rating, 0) / rs.length;
    return { rating: Math.round(avg * 10) / 10, count: rs.length };
  };

  return (
    <BookingContext.Provider value={{ bookings, reviews, addBooking, addReview, getUserBookings, getResortReviews, getResortRating }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be inside BookingProvider');
  return ctx;
}
