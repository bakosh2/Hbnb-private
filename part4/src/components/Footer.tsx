import { Waves, Mail, Phone, Globe, MessageCircle } from 'lucide-react';

export function Footer() {
  return (
    <footer style={{ background: 'hsl(215 40% 7%)', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '48px 16px 24px' }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-10" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src="/images/logo.png" alt="مبات" className="w-9 h-9 object-contain" />
              <span style={{ fontFamily: 'Tajawal', fontWeight: 800, fontSize: '22px', color: 'hsl(42 90% 52%)' }}>مبات</span>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Tajawal', fontSize: '14px', lineHeight: '1.7', maxWidth: '300px' }}>
              منصة حجز المنتجعات الساحلية الفاخرة في المملكة العربية السعودية. من البحر الأحمر إلى نيوم — اكتشف واحجز بثقة.
            </p>
            <div className="flex gap-3 mt-5">
              {[<Globe size={17} />, <MessageCircle size={17} />].map((icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:bg-white/10"
                  style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  {icon}
                </a>
              ))}
            </div>
          </div>
          {/* Links */}
          <div>
            <h4 style={{ fontFamily: 'Tajawal', fontWeight: 700, color: 'hsl(42 30% 90%)', marginBottom: '16px', fontSize: '14px' }}>المناطق</h4>
            {['البحر الأحمر','جدة','الساحل الشرقي','ينبع ونيوم'].map(l => (
              <a key={l} href="#" className="block py-1.5 text-sm transition-all hover:text-white/70" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Tajawal' }}>{l}</a>
            ))}
          </div>
          <div>
            <h4 style={{ fontFamily: 'Tajawal', fontWeight: 700, color: 'hsl(42 30% 90%)', marginBottom: '16px', fontSize: '14px' }}>تواصل معنا</h4>
            {[
              { icon: <Mail size={13} />, text: 'hello@mabat.sa' },
              { icon: <Phone size={13} />, text: '920 000 000' },
              { icon: <Waves size={13} />, text: 'mabat.sa' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 py-1.5">
                <span style={{ color: 'hsl(42 90% 52%)' }}>{item.icon}</span>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Tajawal', fontSize: '13px' }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between pt-5 flex-wrap gap-3">
          <p style={{ color: 'rgba(255,255,255,0.25)', fontFamily: 'Tajawal', fontSize: '12px' }}>
            © 2026 مبات · جميع الحقوق محفوظة
          </p>
          <div className="flex gap-5">
            {['سياسة الخصوصية','الشروط والأحكام','الدعم'].map(l => (
              <a key={l} href="#" className="text-xs transition-all hover:text-white/50" style={{ color: 'rgba(255,255,255,0.25)', fontFamily: 'Tajawal' }}>{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
