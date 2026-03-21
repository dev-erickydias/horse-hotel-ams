import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLang } from '../../contexts/LangContext';
import LangSwitcher from '../../components/ui/LangSwitcher';
import Button from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { LogIn, Eye, EyeOff, ArrowLeft, Clock } from 'lucide-react';

/* Inline SVG horse silhouette */
const HorseSilhouette = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 200 160" className={className} fill="currentColor">
    <path d="M160 30c-5-8-15-12-20-10-3 1-5 4-6 8l-4 12c-2 5-6 8-10 10l-15 5c-8 3-15 8-20 15l-10 15c-3 5-8 8-13 10l-20 6c-5 2-8 6-8 11v18c0 4 3 7 7 7h12c3 0 6-2 7-5l3-10c1-3 4-5 7-5h8c4 0 7-2 9-5l5-10c2-4 6-7 10-8l15-3c6-1 11-5 14-10l8-15c2-4 5-7 9-8l12-3c4-1 7-4 8-8l3-12c1-4-1-8-4-10l-7-5zm-8 12a4 4 0 110 8 4 4 0 010-8z"/>
  </svg>
);

/* Grass blade component */
const GrassBlade = ({ style, height = 40, delay = 0 }: { style?: React.CSSProperties; height?: number; delay?: number }) => (
  <div
    className="absolute bottom-0 animate-sway-slow"
    style={{
      ...style,
      animationDelay: `${delay}s`,
    }}
  >
    <svg width="8" height={height} viewBox={`0 0 8 ${height}`}>
      <path
        d={`M4 ${height} Q2 ${height * 0.5} 3 ${height * 0.15} Q4 0 5 ${height * 0.15} Q6 ${height * 0.5} 4 ${height}`}
        fill="#2d6237"
        opacity={0.4 + Math.random() * 0.3}
      />
    </svg>
  </div>
);

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await login(email.trim().toLowerCase(), password);
      if (result.success) navigate('/app/dashboard');
      else if (result.error === 'pending') setError('pending');
      else if (result.error === 'rate_limited') setError(t.auth.tooManyAttempts || 'Too many attempts. Please wait 15 minutes.');
      else setError(t.auth.invalidCredentials);
    } finally {
      setLoading(false);
    }
  };

  // Generate grass blade positions
  const grassBlades = Array.from({ length: 60 }, (_, i) => ({
    left: `${(i / 60) * 100 + Math.random() * 1.5}%`,
    height: 25 + Math.random() * 45,
    delay: Math.random() * 4,
  }));

  return (
    <div className="min-h-screen flex font-body relative overflow-hidden">
      {/* Left side — Equestrian landscape */}
      <div className="hidden lg:flex lg:w-[55%] relative bg-gradient-to-b from-[#1a3520] via-[#1e4028] to-[#162e1c] items-center justify-center overflow-hidden">
        {/* Sky gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0c1f12] via-[#142a1a] to-[#1a3a2a]" />

        {/* Stars / particles */}
        <div className="absolute inset-0">
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-cream-300/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 50}%`,
                animationDelay: `${Math.random() * 3}s`,
                animation: `gentle-pulse ${3 + Math.random() * 4}s ease-in-out infinite`,
              }}
            />
          ))}
        </div>

        {/* Moon glow */}
        <div className="absolute top-16 right-20 w-16 h-16 rounded-full bg-cream-200/10 blur-xl" />
        <div className="absolute top-18 right-22 w-10 h-10 rounded-full bg-cream-100/15 blur-md" />

        {/* Rolling hills */}
        <svg className="absolute bottom-0 left-0 right-0 w-full" viewBox="0 0 1200 300" preserveAspectRatio="none" style={{ height: '50%' }}>
          <path d="M0 300 L0 180 Q150 120 300 160 Q450 200 600 140 Q750 80 900 130 Q1050 180 1200 120 L1200 300Z" fill="#1a3a2a" opacity="0.5"/>
          <path d="M0 300 L0 210 Q200 160 400 190 Q600 220 800 170 Q1000 120 1200 180 L1200 300Z" fill="#1f4d29" opacity="0.6"/>
          <path d="M0 300 L0 240 Q150 210 350 230 Q550 250 700 220 Q900 190 1100 225 L1200 210 L1200 300Z" fill="#2d6237" opacity="0.7"/>
          <path d="M0 300 L0 265 Q200 245 400 260 Q600 275 800 255 Q1000 240 1200 260 L1200 300Z" fill="#1f4d29"/>
        </svg>

        {/* Grass field at bottom */}
        <div className="grass-field" />
        <div className="grass-ground" />

        {/* Fence in the middle distance */}
        <div className="absolute bottom-[140px] left-0 right-0 h-[30px] fence-border opacity-40" />

        {/* Horse silhouette walking */}
        <div className="absolute bottom-[130px] animate-horse-walk">
          <HorseSilhouette className="w-24 h-20 text-forest-950/50" />
        </div>

        {/* Second horse — static, grazing in distance */}
        <div className="absolute bottom-[170px] right-[20%]">
          <HorseSilhouette className="w-14 h-12 text-forest-900/30 scale-x-[-1]" />
        </div>

        {/* Content overlay */}
        <div className="relative z-10 text-center px-12 mb-20">
          <div className="w-20 h-20 rounded-2xl bg-gold-400 flex items-center justify-center text-forest-950 font-bold text-3xl font-display mx-auto mb-8 shadow-lg shadow-gold-500/25 animate-float">
            AH
          </div>
          <h1 className="text-4xl font-bold text-cream-100 font-display mb-3 leading-tight">
            Horse Hotel
          </h1>
          <p className="text-forest-300 text-sm font-body tracking-wide">
            Amsterdam Equestrian — Est. 2020
          </p>
          <div className="mt-8 flex items-center justify-center gap-6 text-forest-400/60">
            {/* Horseshoe icons */}
            <svg viewBox="0 0 40 44" className="w-6 h-6" fill="currentColor">
              <path d="M20 4 C10 4 4 12 4 22 C4 30 8 36 12 40 L16 36 C13 33 10 28 10 22 C10 15 14 10 20 10 C26 10 30 15 30 22 C30 28 27 33 24 36 L28 40 C32 36 36 30 36 22 C36 12 30 4 20 4Z"/>
            </svg>
            <div className="w-12 h-[1px] bg-forest-600/40" />
            <svg viewBox="0 0 40 44" className="w-6 h-6" fill="currentColor">
              <path d="M20 4 C10 4 4 12 4 22 C4 30 8 36 12 40 L16 36 C13 33 10 28 10 22 C10 15 14 10 20 10 C26 10 30 15 30 22 C30 28 27 33 24 36 L28 40 C32 36 36 30 36 22 C36 12 30 4 20 4Z"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Right side — Login form */}
      <div className="flex-1 flex items-center justify-center p-6 relative bg-cream-50">
        {/* Subtle horseshoe pattern background */}
        <div className="absolute inset-0 horseshoe-pattern opacity-30" />

        {/* Subtle grass at the very bottom of form side */}
        <div className="absolute bottom-0 left-0 right-0 h-[60px] overflow-hidden pointer-events-none">
          {grassBlades.map((blade, i) => (
            <GrassBlade
              key={i}
              style={{ left: blade.left }}
              height={blade.height}
              delay={blade.delay}
            />
          ))}
          <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-t from-forest-800/10 to-transparent" />
        </div>

        <div className="absolute top-4 left-4 z-10 lg:hidden">
          <Link to="/" className="flex items-center gap-2 text-stone-400 hover:text-stone-700 transition-colors text-sm">
            <ArrowLeft size={16} /> {t.auth.backToHome}
          </Link>
        </div>

        <div className="absolute top-4 right-4 z-10">
          <LangSwitcher />
        </div>

        <div className="relative w-full max-w-md z-10">
          {/* Mobile-only branding */}
          <div className="text-center mb-8 lg:hidden animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-gold-400 flex items-center justify-center text-forest-950 font-bold text-xl font-display mx-auto mb-4 shadow-lg shadow-gold-500/25">AH</div>
            <h1 className="text-2xl font-bold text-stone-800 font-display">{t.common.appName}</h1>
          </div>

          <div className="bg-white rounded-2xl shadow-xl shadow-stone-200/50 p-8 animate-slide-up border border-cream-300/60">
            {/* Small horse accent */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-forest-50 flex items-center justify-center">
                <svg viewBox="0 0 40 44" className="w-4 h-4 text-forest-600" fill="currentColor">
                  <path d="M20 4 C10 4 4 12 4 22 C4 30 8 36 12 40 L16 36 C13 33 10 28 10 22 C10 15 14 10 20 10 C26 10 30 15 30 22 C30 28 27 33 24 36 L28 40 C32 36 36 30 36 22 C36 12 30 4 20 4Z"/>
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-stone-800 font-display">{t.auth.signInTitle}</h2>
                <p className="text-xs text-stone-400 font-body">{t.common.management}</p>
              </div>
            </div>

            {error === 'pending' && (
              <div className="mb-4 p-3 rounded-xl bg-gold-50 border border-gold-200">
                <div className="flex items-start gap-3">
                  <Clock className="text-gold-600 shrink-0 mt-0.5" size={16} />
                  <p className="text-sm text-gold-800">{t.auth.accountPending}</p>
                </div>
              </div>
            )}
            {error && error !== 'pending' && <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label={t.auth.email} type="email" placeholder={t.auth.emailPlaceholder} value={email} onChange={(e) => setEmail(e.target.value)} required />
              <div className="relative">
                <Input label={t.auth.password} type={showPassword ? 'text' : 'password'} placeholder={t.auth.passwordPlaceholder} value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-[34px] text-stone-400 hover:text-stone-600">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <Button type="submit" className="w-full" icon={<LogIn size={16} />} disabled={loading}>{loading ? '...' : t.common.login}</Button>
            </form>

            <div className="mt-4 text-center">
              <Link to="/forgot-password" className="text-sm text-stone-400 hover:text-forest-600 transition-colors">
                {t.auth.forgotPassword}
              </Link>
            </div>

            <div className="mt-4 pt-4 border-t border-cream-200">
              <p className="text-center text-sm text-stone-500">
                {t.auth.noAccount}{' '}
                <Link to="/signup" className="text-forest-600 hover:text-forest-700 font-medium">{t.auth.signUp}</Link>
              </p>
            </div>
          </div>

          <div className="hidden lg:block mt-4">
            <Link to="/" className="flex items-center justify-center gap-2 text-stone-400 hover:text-stone-700 transition-colors text-sm">
              <ArrowLeft size={14} /> {t.auth.backToHome}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
