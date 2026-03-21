import { Link } from 'react-router-dom';
import { useLang } from '../../contexts/LangContext';
import LangSwitcher from '../../components/ui/LangSwitcher';
import {
  Home, Truck, Shield, Building2, TreePine, Dumbbell, Droplets,
  BedDouble, Package, Phone, MapPin, Clock, Mail, ChevronRight,
} from 'lucide-react';

export default function LandingPage() {
  const { t } = useLang();

  const services = [
    { icon: Home, title: t.landing.serviceHotel, desc: t.landing.serviceHotelDesc },
    { icon: Truck, title: t.landing.serviceTransport, desc: t.landing.serviceTransportDesc },
    { icon: Shield, title: t.landing.serviceQuarantine, desc: t.landing.serviceQuarantineDesc },
    { icon: Building2, title: t.landing.serviceLivery, desc: t.landing.serviceLiveryDesc },
  ];

  const facilities = [
    { icon: Dumbbell, title: t.landing.facilityArena, desc: t.landing.facilityArenaDesc },
    { icon: TreePine, title: t.landing.facilityPaddock, desc: t.landing.facilityPaddockDesc },
    { icon: Package, title: t.landing.facilityWalker, desc: t.landing.facilityWalkerDesc },
    { icon: Droplets, title: t.landing.facilityWash, desc: t.landing.facilityWashDesc },
    { icon: BedDouble, title: t.landing.facilityGuest, desc: t.landing.facilityGuestDesc },
    { icon: Package, title: t.landing.facilityTack, desc: t.landing.facilityTackDesc },
  ];

  const transportFeatures = [
    t.landing.transportFeature1, t.landing.transportFeature2, t.landing.transportFeature3,
    t.landing.transportFeature4, t.landing.transportFeature5, t.landing.transportFeature6,
  ];

  return (
    <div className="min-h-screen bg-cream-50 font-body">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-forest-950/95 backdrop-blur-md border-b border-forest-800/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gold-400 flex items-center justify-center text-forest-950 font-bold text-sm font-display shadow-sm shadow-gold-500/30">AH</div>
            <span className="text-cream-100 font-bold text-lg hidden sm:block font-display tracking-wide">{t.common.appName}</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm">
            <a href="#about" className="text-forest-300 hover:text-cream-100 transition-colors">{t.landing.aboutTitle.split(' ').slice(0,1).join(' ')}</a>
            <a href="#services" className="text-forest-300 hover:text-cream-100 transition-colors">{t.landing.servicesTitle}</a>
            <a href="#facilities" className="text-forest-300 hover:text-cream-100 transition-colors">{t.landing.facilitiesTitle}</a>
            <a href="#transport" className="text-forest-300 hover:text-cream-100 transition-colors">{t.landing.transportTitle}</a>
            <a href="#contact" className="text-forest-300 hover:text-cream-100 transition-colors">{t.landing.contactTitle}</a>
          </div>
          <div className="flex items-center gap-3">
            <LangSwitcher dark />
            <Link to="/login" className="px-5 py-2 rounded-xl bg-gold-400 text-forest-950 text-sm font-semibold hover:bg-gold-300 transition-all shadow-sm shadow-gold-500/20">
              {t.landing.heroLogin}
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-16 min-h-[85vh] flex items-center bg-forest-950 overflow-hidden grain-dark">
        {/* Sky gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1810] via-[#112418] to-[#1a3a2a]" />
        <div className="absolute inset-0">
          <div className="absolute top-16 left-1/3 w-[500px] h-[500px] bg-gold-400/6 rounded-full blur-[140px]" />
          <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-forest-500/8 rounded-full blur-[120px]" />
        </div>

        {/* Stars */}
        <div className="absolute inset-0">
          {Array.from({ length: 15 }, (_, i) => (
            <div key={i} className="absolute w-1 h-1 bg-cream-200/15 rounded-full"
              style={{ left: `${10 + Math.random() * 80}%`, top: `${5 + Math.random() * 35}%`, animation: `gentle-pulse ${3 + Math.random() * 4}s ease-in-out infinite`, animationDelay: `${Math.random() * 3}s` }} />
          ))}
        </div>

        {/* Rolling hills landscape */}
        <svg className="absolute bottom-0 left-0 right-0 w-full" viewBox="0 0 1440 280" preserveAspectRatio="none" style={{ height: '40%' }}>
          <path d="M0 280 L0 180 Q180 110 360 155 Q540 200 720 130 Q900 60 1080 120 Q1260 180 1440 100 L1440 280Z" fill="#152e1c" opacity="0.5"/>
          <path d="M0 280 L0 200 Q240 140 480 180 Q720 220 960 160 Q1200 100 1440 170 L1440 280Z" fill="#1a3a2a" opacity="0.6"/>
          <path d="M0 280 L0 235 Q180 205 420 225 Q660 245 840 215 Q1080 185 1320 220 L1440 205 L1440 280Z" fill="#1f4d29" opacity="0.8"/>
          <path d="M0 280 L0 258 Q240 242 480 255 Q720 268 960 248 Q1200 235 1440 255 L1440 280Z" fill="#1a3a2a"/>
        </svg>

        {/* Grass blades at bottom */}
        <div className="grass-field" />
        <div className="grass-ground" />

        {/* Fence silhouette */}
        <div className="absolute bottom-[110px] left-0 right-0 h-[30px] fence-border opacity-30" />

        {/* Horse silhouettes */}
        <div className="absolute bottom-[100px] left-[15%]">
          <svg viewBox="0 0 200 160" className="w-16 h-14 text-forest-900/25" fill="currentColor">
            <path d="M160 30c-5-8-15-12-20-10-3 1-5 4-6 8l-4 12c-2 5-6 8-10 10l-15 5c-8 3-15 8-20 15l-10 15c-3 5-8 8-13 10l-20 6c-5 2-8 6-8 11v18c0 4 3 7 7 7h12c3 0 6-2 7-5l3-10c1-3 4-5 7-5h8c4 0 7-2 9-5l5-10c2-4 6-7 10-8l15-3c6-1 11-5 14-10l8-15c2-4 5-7 9-8l12-3c4-1 7-4 8-8l3-12c1-4-1-8-4-10l-7-5zm-8 12a4 4 0 110 8 4 4 0 010-8z"/>
          </svg>
        </div>
        <div className="absolute bottom-[130px] right-[22%]">
          <svg viewBox="0 0 200 160" className="w-12 h-10 text-forest-800/20 scale-x-[-1]" fill="currentColor">
            <path d="M160 30c-5-8-15-12-20-10-3 1-5 4-6 8l-4 12c-2 5-6 8-10 10l-15 5c-8 3-15 8-20 15l-10 15c-3 5-8 8-13 10l-20 6c-5 2-8 6-8 11v18c0 4 3 7 7 7h12c3 0 6-2 7-5l3-10c1-3 4-5 7-5h8c4 0 7-2 9-5l5-10c2-4 6-7 10-8l15-3c6-1 11-5 14-10l8-15c2-4 5-7 9-8l12-3c4-1 7-4 8-8l3-12c1-4-1-8-4-10l-7-5zm-8 12a4 4 0 110 8 4 4 0 010-8z"/>
          </svg>
        </div>
        {/* Walking horse animation */}
        <div className="absolute bottom-[95px] animate-horse-walk">
          <svg viewBox="0 0 200 160" className="w-20 h-16 text-forest-950/40" fill="currentColor">
            <path d="M160 30c-5-8-15-12-20-10-3 1-5 4-6 8l-4 12c-2 5-6 8-10 10l-15 5c-8 3-15 8-20 15l-10 15c-3 5-8 8-13 10l-20 6c-5 2-8 6-8 11v18c0 4 3 7 7 7h12c3 0 6-2 7-5l3-10c1-3 4-5 7-5h8c4 0 7-2 9-5l5-10c2-4 6-7 10-8l15-3c6-1 11-5 14-10l8-15c2-4 5-7 9-8l12-3c4-1 7-4 8-8l3-12c1-4-1-8-4-10l-7-5zm-8 12a4 4 0 110 8 4 4 0 010-8z"/>
          </svg>
        </div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center z-10">
          <div className="w-20 h-20 rounded-2xl bg-gold-400 flex items-center justify-center text-forest-950 font-bold text-3xl font-display mx-auto mb-10 shadow-lg shadow-gold-500/25 animate-fade-in animate-float">
            AH
          </div>
          {/* Horseshoe accent */}
          <div className="flex items-center justify-center gap-4 mb-4 animate-fade-in">
            <svg viewBox="0 0 40 44" className="w-4 h-4 text-gold-400/50" fill="currentColor"><path d="M20 4 C10 4 4 12 4 22 C4 30 8 36 12 40 L16 36 C13 33 10 28 10 22 C10 15 14 10 20 10 C26 10 30 15 30 22 C30 28 27 33 24 36 L28 40 C32 36 36 30 36 22 C36 12 30 4 20 4Z"/></svg>
            <p className="text-gold-400/80 font-body text-sm font-semibold tracking-[0.25em] uppercase">Amsterdam Equestrian</p>
            <svg viewBox="0 0 40 44" className="w-4 h-4 text-gold-400/50" fill="currentColor"><path d="M20 4 C10 4 4 12 4 22 C4 30 8 36 12 40 L16 36 C13 33 10 28 10 22 C10 15 14 10 20 10 C26 10 30 15 30 22 C30 28 27 33 24 36 L28 40 C32 36 36 30 36 22 C36 12 30 4 20 4Z"/></svg>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-cream-100 mb-6 animate-slide-up leading-[1.1] text-balance">
            {t.landing.heroTitle}
          </h1>
          <p className="text-lg sm:text-xl text-forest-300 max-w-3xl mx-auto mb-12 animate-slide-up leading-relaxed">
            {t.landing.heroSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <a href="#contact" className="px-8 py-3.5 rounded-xl bg-gold-400 text-forest-950 font-semibold hover:bg-gold-300 transition-all shadow-lg shadow-gold-500/20 flex items-center justify-center gap-2 text-sm">
              {t.landing.heroCta} <ChevronRight size={18} />
            </a>
            <Link to="/login" className="px-8 py-3.5 rounded-xl border-2 border-cream-100/15 text-cream-100 font-semibold hover:bg-white/5 hover:border-cream-100/30 transition-all flex items-center justify-center gap-2 text-sm">
              {t.landing.heroLogin}
            </Link>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-28 bg-cream-100 relative grain">
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-6"><div className="w-10 h-[1px] bg-gold-400/50" /><svg viewBox="0 0 40 44" className="w-5 h-5 text-gold-400/70" fill="currentColor"><path d="M20 4 C10 4 4 12 4 22 C4 30 8 36 12 40 L16 36 C13 33 10 28 10 22 C10 15 14 10 20 10 C26 10 30 15 30 22 C30 28 27 33 24 36 L28 40 C32 36 36 30 36 22 C36 12 30 4 20 4Z"/></svg><div className="w-10 h-[1px] bg-gold-400/50" /></div>
          <h2 className="text-3xl sm:text-4xl font-bold text-stone-800 mb-6">{t.landing.aboutTitle}</h2>
          <p className="text-lg text-stone-600 leading-relaxed">{t.landing.aboutText}</p>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-28 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-6"><div className="w-10 h-[1px] bg-gold-400/50" /><svg viewBox="0 0 40 44" className="w-5 h-5 text-gold-400/70" fill="currentColor"><path d="M20 4 C10 4 4 12 4 22 C4 30 8 36 12 40 L16 36 C13 33 10 28 10 22 C10 15 14 10 20 10 C26 10 30 15 30 22 C30 28 27 33 24 36 L28 40 C32 36 36 30 36 22 C36 12 30 4 20 4Z"/></svg><div className="w-10 h-[1px] bg-gold-400/50" /></div>
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-800">{t.landing.servicesTitle}</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s, i) => (
              <div key={i} className="bg-cream-50 rounded-2xl p-7 border border-cream-300/60 hover:shadow-lg hover:shadow-stone-200/40 hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-14 h-14 rounded-xl bg-forest-50 flex items-center justify-center text-forest-600 mb-5 group-hover:bg-forest-100 group-hover:scale-105 transition-all duration-300">
                  <s.icon size={26} />
                </div>
                <h3 className="text-lg font-semibold text-stone-800 mb-2 font-display">{s.title}</h3>
                <p className="text-sm text-stone-600 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section id="facilities" className="py-28 bg-cream-100 relative grain">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-6"><div className="w-10 h-[1px] bg-gold-400/50" /><svg viewBox="0 0 40 44" className="w-5 h-5 text-gold-400/70" fill="currentColor"><path d="M20 4 C10 4 4 12 4 22 C4 30 8 36 12 40 L16 36 C13 33 10 28 10 22 C10 15 14 10 20 10 C26 10 30 15 30 22 C30 28 27 33 24 36 L28 40 C32 36 36 30 36 22 C36 12 30 4 20 4Z"/></svg><div className="w-10 h-[1px] bg-gold-400/50" /></div>
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-800">{t.landing.facilitiesTitle}</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {facilities.map((f, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-cream-300/60 hover:shadow-md hover:shadow-stone-200/40 transition-all duration-300">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-11 h-11 rounded-xl bg-gold-50 flex items-center justify-center text-gold-600">
                    <f.icon size={22} />
                  </div>
                  <h3 className="font-semibold text-stone-800 font-display">{f.title}</h3>
                </div>
                <p className="text-sm text-stone-600 leading-relaxed pl-[60px]">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Transport */}
      <section id="transport" className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6"><svg viewBox="0 0 40 44" className="w-5 h-5 text-gold-400/70" fill="currentColor"><path d="M20 4 C10 4 4 12 4 22 C4 30 8 36 12 40 L16 36 C13 33 10 28 10 22 C10 15 14 10 20 10 C26 10 30 15 30 22 C30 28 27 33 24 36 L28 40 C32 36 36 30 36 22 C36 12 30 4 20 4Z"/></svg><div className="w-10 h-[1px] bg-gold-400/50" /></div>
              <h2 className="text-3xl sm:text-4xl font-bold text-stone-800 mb-6">{t.landing.transportTitle}</h2>
              <p className="text-stone-600 leading-relaxed mb-8">{t.landing.transportText}</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {transportFeatures.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-stone-700">
                    <div className="w-6 h-6 rounded-full bg-forest-50 flex items-center justify-center shrink-0">
                      <ChevronRight size={12} className="text-forest-600" />
                    </div>
                    {f}
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-forest-950 rounded-3xl p-10 text-cream-100 relative overflow-hidden grain-dark">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gold-400/10 rounded-full blur-[80px]" />
              <div className="relative z-10">
                <Truck size={44} className="text-gold-400 mb-6" />
                <h3 className="text-xl font-bold mb-4 font-display">{t.landing.teamTitle}</h3>
                <p className="text-forest-300 leading-relaxed">{t.landing.teamText}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-28 bg-forest-950 text-cream-100 relative overflow-hidden grain-dark">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/3 w-[400px] h-[400px] bg-gold-400/5 rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-6"><div className="w-10 h-[1px] bg-gold-400/50" /><svg viewBox="0 0 40 44" className="w-5 h-5 text-gold-400/70" fill="currentColor"><path d="M20 4 C10 4 4 12 4 22 C4 30 8 36 12 40 L16 36 C13 33 10 28 10 22 C10 15 14 10 20 10 C26 10 30 15 30 22 C30 28 27 33 24 36 L28 40 C32 36 36 30 36 22 C36 12 30 4 20 4Z"/></svg><div className="w-10 h-[1px] bg-gold-400/50" /></div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-14">{t.landing.contactTitle}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
            <div className="flex flex-col items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gold-400/10 flex items-center justify-center text-gold-400 border border-gold-400/20">
                <MapPin size={24} />
              </div>
              <p className="text-sm text-forest-300 leading-relaxed">{t.landing.address}</p>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gold-400/10 flex items-center justify-center text-gold-400 border border-gold-400/20">
                <Phone size={24} />
              </div>
              <div className="text-sm text-forest-300">
                <p>{t.landing.phone}</p>
                <p className="mt-1 text-xs text-forest-500">{t.landing.afterHours}: {t.landing.phoneAfterHours}</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4 sm:col-span-2 lg:col-span-1">
              <div className="w-14 h-14 rounded-2xl bg-gold-400/10 flex items-center justify-center text-gold-400 border border-gold-400/20">
                <Clock size={24} />
              </div>
              <p className="text-sm text-forest-300">{t.landing.officeHours}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-forest-950 border-t border-forest-800/40 text-center">
        <p className="text-xs text-forest-600">{t.landing.footerRights}</p>
      </footer>
    </div>
  );
}
