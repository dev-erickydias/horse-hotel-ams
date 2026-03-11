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
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-stone-900/95 backdrop-blur-sm border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-600 flex items-center justify-center text-white font-bold text-sm">AH</div>
            <span className="text-white font-bold text-lg hidden sm:block">{t.common.appName}</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm">
            <a href="#about" className="text-stone-300 hover:text-white transition-colors">{t.landing.aboutTitle.split(' ').slice(0,1).join(' ')}</a>
            <a href="#services" className="text-stone-300 hover:text-white transition-colors">{t.landing.servicesTitle}</a>
            <a href="#facilities" className="text-stone-300 hover:text-white transition-colors">{t.landing.facilitiesTitle}</a>
            <a href="#transport" className="text-stone-300 hover:text-white transition-colors">{t.landing.transportTitle}</a>
            <a href="#contact" className="text-stone-300 hover:text-white transition-colors">{t.landing.contactTitle}</a>
          </div>
          <div className="flex items-center gap-3">
            <LangSwitcher dark />
            <Link to="/login" className="px-4 py-2 rounded-lg bg-amber-600 text-white text-sm font-medium hover:bg-amber-500 transition-colors">
              {t.landing.heroLogin}
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-16 min-h-[80vh] flex items-center bg-stone-900 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="w-20 h-20 rounded-2xl bg-amber-600 flex items-center justify-center text-white font-bold text-3xl mx-auto mb-8 shadow-lg shadow-amber-600/30 animate-fade-in">
            AH
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 animate-slide-up">
            {t.landing.heroTitle}
          </h1>
          <p className="text-lg sm:text-xl text-stone-300 max-w-3xl mx-auto mb-10 animate-slide-up leading-relaxed">
            {t.landing.heroSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <a href="#contact" className="px-8 py-3 rounded-xl bg-amber-600 text-white font-semibold hover:bg-amber-500 transition-all shadow-lg shadow-amber-600/30 flex items-center justify-center gap-2">
              {t.landing.heroCta} <ChevronRight size={18} />
            </a>
            <Link to="/login" className="px-8 py-3 rounded-xl border-2 border-white/20 text-white font-semibold hover:bg-white/10 transition-all flex items-center justify-center gap-2">
              {t.landing.heroLogin}
            </Link>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-24 bg-stone-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-stone-900 mb-6">{t.landing.aboutTitle}</h2>
          <p className="text-lg text-stone-600 leading-relaxed">{t.landing.aboutText}</p>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-stone-900 text-center mb-16">{t.landing.servicesTitle}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((s, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 hover:shadow-md hover:border-amber-200 transition-all group">
                <div className="w-14 h-14 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 mb-4 group-hover:bg-amber-100 transition-colors">
                  <s.icon size={28} />
                </div>
                <h3 className="text-lg font-semibold text-stone-900 mb-2">{s.title}</h3>
                <p className="text-sm text-stone-600 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section id="facilities" className="py-24 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-stone-900 text-center mb-16">{t.landing.facilitiesTitle}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {facilities.map((f, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-stone-100 hover:shadow-md transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                    <f.icon size={20} />
                  </div>
                  <h3 className="font-semibold text-stone-900">{f.title}</h3>
                </div>
                <p className="text-sm text-stone-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Transport */}
      <section id="transport" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-stone-900 mb-6">{t.landing.transportTitle}</h2>
              <p className="text-stone-600 leading-relaxed mb-8">{t.landing.transportText}</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {transportFeatures.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-stone-700">
                    <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                      <ChevronRight size={12} className="text-amber-600" />
                    </div>
                    {f}
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-stone-900 rounded-2xl p-8 text-white">
              <Truck size={48} className="text-amber-500 mb-6" />
              <h3 className="text-xl font-bold mb-4">{t.landing.teamTitle}</h3>
              <p className="text-stone-300 leading-relaxed">{t.landing.teamText}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24 bg-stone-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-12">{t.landing.contactTitle}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-xl bg-amber-600/20 flex items-center justify-center text-amber-400">
                <MapPin size={24} />
              </div>
              <p className="text-sm text-stone-300 leading-relaxed">{t.landing.address}</p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-xl bg-amber-600/20 flex items-center justify-center text-amber-400">
                <Phone size={24} />
              </div>
              <div className="text-sm text-stone-300">
                <p>{t.landing.phone}</p>
                <p className="mt-1 text-xs text-stone-400">{t.landing.afterHours}: {t.landing.phoneAfterHours}</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-3 sm:col-span-2 lg:col-span-1">
              <div className="w-14 h-14 rounded-xl bg-amber-600/20 flex items-center justify-center text-amber-400">
                <Clock size={24} />
              </div>
              <p className="text-sm text-stone-300">{t.landing.officeHours}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 bg-stone-950 text-center">
        <p className="text-xs text-stone-500">{t.landing.footerRights}</p>
      </footer>
    </div>
  );
}
