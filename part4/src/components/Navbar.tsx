import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut, User, Bookmark } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { MabatLogo } from './AuthModals';

interface Props {
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Navbar({ onOpenLogin, onOpenRegister, currentPage, onNavigate }: Props) {
  const { user, isLoggedIn, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Close when clicking outside the entire dropdown container
  useEffect(() => {
    if (!userMenuOpen) return;
    const fn = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    // Use capture phase + small delay to let internal clicks register
    const timer = setTimeout(() => {
      document.addEventListener('click', fn, true);
    }, 50);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', fn, true);
    };
  }, [userMenuOpen]);

  const navItems = [
    { label: 'الرئيسية', href: 'home' },
    { label: 'المنتجعات', href: 'resorts' },
    { label: 'البحر الأحمر', href: 'resorts' },
    { label: 'جدة', href: 'resorts' },
  ];

  const menuItems = [
    {
      icon: <User size={16} />,
      label: 'حسابي',
      action: () => { onNavigate('profile'); setUserMenuOpen(false); }
    },
    {
      icon: <Bookmark size={16} />,
      label: 'حجوزاتي',
      action: () => { onNavigate('profile'); setUserMenuOpen(false); }
    },
  ];

  return (
    <>
      <motion.nav
        className="fixed top-0 inset-x-0 z-50"
        style={{ paddingTop: scrolled ? '8px' : '16px', paddingBottom: scrolled ? '8px' : '16px', transition: 'padding 0.3s' }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="liquid-glass-strong rounded-2xl px-4 py-3 flex items-center justify-between gap-4">

            {/* Logo */}
            <button onClick={() => onNavigate('home')} className="flex items-center gap-3 shrink-0">
              <MabatLogo size={40} />
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
                <span style={{ fontFamily: 'Tajawal', fontWeight: 900, fontSize: '18px', color: 'hsl(42 90% 52%)' }}>مبات</span>
                <span style={{ fontFamily: 'Georgia', fontStyle: 'italic', fontSize: '11px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.05em' }}>Mabat</span>
              </div>
            </button>

            {/* Center Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map(item => (
                <button
                  key={item.label}
                  onClick={() => onNavigate(item.href)}
                  className="px-4 py-2 rounded-full text-sm transition-all duration-200"
                  style={{
                    color: currentPage === item.href ? 'hsl(42 90% 52%)' : 'rgba(255,255,255,0.7)',
                    background: currentPage === item.href ? 'rgba(212,175,55,0.12)' : 'transparent',
                    fontFamily: 'Tajawal', fontWeight: 500,
                  }}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Right Side */}
            <div className="flex items-center gap-2">
              {isLoggedIn ? (
                /* ── USER DROPDOWN ── */
                <div ref={dropdownRef} style={{ position: 'relative' }}>
                  {/* Trigger button */}
                  <button
                    onClick={() => setUserMenuOpen(v => !v)}
                    className="flex items-center gap-2 px-3 py-2 rounded-full transition-all"
                    style={{
                      background: userMenuOpen ? 'rgba(212,175,55,0.2)' : 'rgba(212,175,55,0.1)',
                      border: '1px solid rgba(212,175,55,0.3)',
                    }}
                  >
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                      style={{ background: 'linear-gradient(135deg, hsl(42 90% 52%), hsl(38 80% 40%))', color: 'hsl(210 35% 6%)' }}
                    >
                      {user?.firstName?.[0]}
                    </div>
                    <span
                      className="hidden md:block text-sm"
                      style={{ color: 'hsl(42 90% 75%)', fontFamily: 'Tajawal', fontWeight: 600 }}
                    >
                      {user?.firstName}
                    </span>
                  </button>

                  {/* Dropdown panel */}
                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                        style={{
                          position: 'absolute',
                          top: 'calc(100% + 10px)',
                          right: 0,
                          width: '240px',
                          borderRadius: '20px',
                          overflow: 'hidden',
                          background: 'hsl(215 45% 11%)',
                          border: '1px solid rgba(255,255,255,0.12)',
                          boxShadow: '0 24px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(212,175,55,0.08)',
                          zIndex: 9999,
                        }}
                      >
                        {/* User info header */}
                        <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                          <div className="flex items-center gap-3">
                            <div
                              style={{
                                width: '42px', height: '42px', borderRadius: '12px',
                                background: 'linear-gradient(135deg, hsl(42 90% 52%), hsl(38 80% 40%))',
                                color: 'hsl(210 35% 6%)', display: 'flex', alignItems: 'center',
                                justifyContent: 'center', fontWeight: 800, fontSize: '16px',
                                flexShrink: 0,
                              }}
                            >
                              {user?.firstName?.[0]}{user?.lastName?.[0]}
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <p style={{ fontFamily: 'Tajawal', fontWeight: 700, color: 'hsl(42 30% 92%)', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {user?.firstName} {user?.lastName}
                              </p>
                              <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: '11px', fontFamily: 'Tajawal', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {user?.email}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div style={{ padding: '6px' }}>
                          {menuItems.map(item => (
                            <button
                              key={item.label}
                              onClick={item.action}
                              className="w-full flex items-center gap-3 transition-all"
                              style={{
                                padding: '10px 12px',
                                borderRadius: '12px',
                                color: 'rgba(255,255,255,0.8)',
                                fontFamily: 'Tajawal',
                                fontSize: '14px',
                                textAlign: 'right',
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                width: '100%',
                              }}
                              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                            >
                              <span style={{ color: 'hsl(42 90% 52%)', flexShrink: 0 }}>{item.icon}</span>
                              {item.label}
                            </button>
                          ))}
                        </div>

                        {/* Logout */}
                        <div style={{ padding: '0 6px 6px', borderTop: '1px solid rgba(255,255,255,0.07)', marginTop: '2px', paddingTop: '6px' }}>
                          <button
                            onClick={() => { logout(); setUserMenuOpen(false); }}
                            className="w-full flex items-center gap-3 transition-all"
                            style={{
                              padding: '10px 12px',
                              borderRadius: '12px',
                              color: 'hsl(0 65% 62%)',
                              fontFamily: 'Tajawal',
                              fontSize: '14px',
                              textAlign: 'right',
                              background: 'transparent',
                              border: 'none',
                              cursor: 'pointer',
                              width: '100%',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(220,38,38,0.08)')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                          >
                            <LogOut size={16} style={{ flexShrink: 0 }} />
                            تسجيل الخروج
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <button onClick={onOpenLogin} className="btn-glass text-sm px-5 py-2">دخول</button>
                  <button onClick={onOpenRegister} className="btn-gold text-sm px-5 py-2">إنشاء حساب</button>
                </div>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2 rounded-xl"
                style={{ color: 'rgba(255,255,255,0.8)', background: 'rgba(255,255,255,0.06)' }}
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
            onClick={() => setMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="absolute left-0 top-0 bottom-0 w-72 p-6 flex flex-col"
              style={{ background: 'hsl(215 40% 9%)', borderRight: '1px solid rgba(255,255,255,0.08)' }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <MabatLogo size={36} />
                  <span style={{ fontFamily: 'Tajawal', fontWeight: 900, fontSize: '20px', color: 'hsl(42 90% 52%)' }}>مبات</span>
                </div>
                <button onClick={() => setMenuOpen(false)} style={{ color: 'rgba(255,255,255,0.6)' }}>
                  <X size={20} />
                </button>
              </div>

              <nav className="flex flex-col gap-2">
                {navItems.map(item => (
                  <button
                    key={item.label}
                    onClick={() => { onNavigate(item.href); setMenuOpen(false); }}
                    className="py-3 px-4 rounded-xl text-right text-base transition-all hover:bg-white/5"
                    style={{ color: 'rgba(255,255,255,0.8)', fontFamily: 'Tajawal', fontWeight: 500 }}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>

              <div className="mt-auto">
                {isLoggedIn ? (
                  <>
                    <div className="flex items-center gap-3 p-4 rounded-2xl mb-3"
                      style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)' }}>
                      <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold"
                        style={{ background: 'linear-gradient(135deg, hsl(42 90% 52%), hsl(38 80% 40%))', color: 'hsl(210 35% 6%)' }}>
                        {user?.firstName?.[0]}
                      </div>
                      <div>
                        <p style={{ fontFamily: 'Tajawal', fontWeight: 700, color: 'hsl(42 30% 90%)', fontSize: '14px' }}>{user?.firstName} {user?.lastName}</p>
                        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px', fontFamily: 'Tajawal' }}>{user?.email}</p>
                      </div>
                    </div>
                    <button onClick={() => { onNavigate('profile'); setMenuOpen(false); }} className="btn-glass w-full mb-2">
                      حسابي
                    </button>
                    <button
                      onClick={() => { logout(); setMenuOpen(false); }}
                      className="w-full py-3 rounded-full text-sm transition-all"
                      style={{ color: 'hsl(0 65% 60%)', border: '1px solid rgba(220,38,38,0.25)', fontFamily: 'Tajawal' }}
                    >
                      تسجيل الخروج
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-3">
                    <button onClick={() => { onOpenLogin(); setMenuOpen(false); }} className="btn-glass w-full">دخول</button>
                    <button onClick={() => { onOpenRegister(); setMenuOpen(false); }} className="btn-gold w-full">إنشاء حساب</button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
