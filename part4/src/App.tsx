import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import { Navbar } from './components/Navbar';
import { AuthModals } from './components/AuthModals';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ResortsPage } from './pages/ResortsPage';
import { ProfilePage } from './pages/ProfilePage';

export default function App() {
  const [page, setPage] = useState('home');
  const [authMode, setAuthMode] = useState<'login' | 'register' | null>(null);

  const navigate = (p: string) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  return (
    <AuthProvider>
      <BookingProvider>
        <div style={{ minHeight: '100vh', background: 'hsl(210 35% 6%)', direction: 'rtl' }}>
          <Navbar
            onOpenLogin={() => setAuthMode('login')}
            onOpenRegister={() => setAuthMode('register')}
            currentPage={page}
            onNavigate={navigate}
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {page === 'home' && (
                <HomePage onNavigate={navigate} onOpenLogin={() => setAuthMode('login')} />
              )}
              {page === 'resorts' && (
                <ResortsPage onOpenLogin={() => setAuthMode('login')} />
              )}
              {page === 'profile' && (
                <ProfilePage onNavigate={navigate} onOpenLogin={() => setAuthMode('login')} />
              )}
            </motion.div>
          </AnimatePresence>

          <Footer />

          <AuthModals
            mode={authMode}
            onClose={() => setAuthMode(null)}
            onSwitch={setAuthMode}
          />
        </div>
      </BookingProvider>
    </AuthProvider>
  );
}
