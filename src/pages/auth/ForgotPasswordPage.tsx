import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../../contexts/LangContext';
import { api } from '../../services/data';
import { isValidEmail } from '../../utils/sanitize';
import { createResetToken, isResetRateLimited } from '../../services/resetTokenStore';
import LangSwitcher from '../../components/ui/LangSwitcher';
import Button from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Mail, ArrowLeft, CheckCircle, Shield, Copy, Check } from 'lucide-react';

/* Grass blade component */
const GrassBlade = ({ style, height = 40, delay = 0 }: { style?: React.CSSProperties; height?: number; delay?: number }) => (
  <div className="absolute bottom-0 animate-sway-slow" style={{ ...style, animationDelay: `${delay}s` }}>
    <svg width="8" height={height} viewBox={`0 0 8 ${height}`}>
      <path d={`M4 ${height} Q2 ${height * 0.5} 3 ${height * 0.15} Q4 0 5 ${height * 0.15} Q6 ${height * 0.5} 4 ${height}`}
        fill="#2d6237" opacity={0.4 + Math.random() * 0.3} />
    </svg>
  </div>
);

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resetLink, setResetLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useLang();
  const linkRef = useRef<HTMLInputElement>(null);

  const grassBlades = Array.from({ length: 50 }, (_, i) => ({
    left: `${(i / 50) * 100 + Math.random() * 1.5}%`,
    height: 20 + Math.random() * 35,
    delay: Math.random() * 4,
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const normalizedEmail = email.trim().toLowerCase();

    if (!isValidEmail(normalizedEmail)) {
      setError(t.auth.invalidEmail);
      return;
    }

    if (isResetRateLimited(normalizedEmail)) {
      setError(t.auth.forgotPasswordRateLimited);
      return;
    }

    setLoading(true);
    try {
      const user = api.getUserByEmail(normalizedEmail);

      // Only generate token if user exists and is active
      if (user && user.status === 'active') {
        const token = createResetToken(normalizedEmail);
        const link = `${window.location.origin}/reset-password/${token}`;
        setResetLink(link);

        // Notify admins
        api.addNotification({
          type: 'registration',
          title: `Password Reset: ${user.name}`,
          message: `${user.name} (${user.email}) requested a password reset. Link expires in 1 hour.`,
          read: false,
          createdAt: new Date().toISOString(),
          link: '/app/users',
          audience: 'staff',
        });
      }

      // Always show success (prevents email enumeration)
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    if (resetLink) {
      navigator.clipboard.writeText(resetLink).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden font-body bg-cream-50">
      <div className="absolute inset-0 horseshoe-pattern opacity-30" />

      <div className="absolute bottom-0 left-0 right-0 h-[60px] overflow-hidden pointer-events-none">
        {grassBlades.map((blade, i) => (
          <GrassBlade key={i} style={{ left: blade.left }} height={blade.height} delay={blade.delay} />
        ))}
        <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-t from-forest-800/10 to-transparent" />
      </div>

      <div className="absolute top-4 left-4 z-10">
        <Link to="/login" className="flex items-center gap-2 text-stone-400 hover:text-stone-700 transition-colors text-sm">
          <ArrowLeft size={16} /> {t.auth.backToLogin}
        </Link>
      </div>
      <div className="absolute top-4 right-4 z-10">
        <LangSwitcher />
      </div>

      <div className="relative w-full max-w-md z-10">
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-gold-400 flex items-center justify-center text-forest-950 font-bold text-xl font-display mx-auto mb-4 shadow-lg shadow-gold-500/25">AH</div>
          <h1 className="text-2xl font-bold text-stone-800 font-display">{t.common.appName}</h1>
          <p className="text-stone-400 mt-1 text-sm">{t.common.management}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl shadow-stone-200/50 p-8 animate-slide-up border border-cream-300/60">
          {success ? (
            <div className="space-y-5">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-forest-50 flex items-center justify-center">
                  <CheckCircle className="text-forest-600" size={28} />
                </div>
                <h2 className="text-lg font-semibold text-stone-800 font-display">{t.auth.forgotPasswordTitle}</h2>
                <p className="text-sm text-stone-600">{t.auth.forgotPasswordSuccess}</p>
              </div>

              {resetLink && (
                <div className="p-4 rounded-xl bg-gold-50 border border-gold-200 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-gold-800">
                    <Shield size={14} className="text-gold-600" />
                    Reset Link
                  </div>
                  <div className="flex gap-2">
                    <input
                      ref={linkRef}
                      readOnly
                      value={resetLink}
                      className="flex-1 px-3 py-2 rounded-lg bg-white border border-gold-300 text-xs font-mono text-stone-700 truncate"
                    />
                    <button
                      onClick={copyLink}
                      className="px-3 py-2 rounded-lg bg-forest-700 text-white text-xs font-medium hover:bg-forest-800 transition-colors flex items-center gap-1.5"
                    >
                      {copied ? <><Check size={12} /> {t.users?.linkCopied || 'Copied!'}</> : <><Copy size={12} /> {t.users?.copyLink || 'Copy'}</>}
                    </button>
                  </div>
                  <p className="text-[11px] text-gold-700">
                    Link expira em 1 hora.
                  </p>
                </div>
              )}

              <Link to="/login">
                <Button className="w-full" icon={<ArrowLeft size={16} />}>{t.auth.backToLogin}</Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-forest-50 flex items-center justify-center">
                  <Mail size={16} className="text-forest-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-stone-800 font-display">{t.auth.forgotPasswordTitle}</h2>
                  <p className="text-xs text-stone-400 font-body">{t.auth.forgotPasswordSubtitle}</p>
                </div>
              </div>

              {error && <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">{error}</div>}

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input label={t.auth.email} type="email" placeholder={t.auth.emailPlaceholder} value={email} onChange={(e) => setEmail(e.target.value)} required />
                <Button type="submit" className="w-full" icon={<Mail size={16} />} disabled={loading}>
                  {loading ? '...' : t.auth.forgotPasswordSubmit}
                </Button>
              </form>

              <div className="mt-5 pt-4 border-t border-cream-200">
                <p className="text-center text-sm text-stone-500">
                  <Link to="/login" className="text-forest-600 hover:text-forest-700 font-medium">{t.auth.backToLogin}</Link>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
