import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../../contexts/LangContext';
import { api } from '../../services/data';
import { isValidEmail, sanitizePhone } from '../../utils/sanitize';
import { hashPassword } from '../../utils/password';
import LangSwitcher from '../../components/ui/LangSwitcher';
import Button from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { UserPlus, Eye, EyeOff, ArrowLeft, Clock, CheckCircle } from 'lucide-react';

/* Grass blade component */
const GrassBlade = ({ style, height = 40, delay = 0 }: { style?: React.CSSProperties; height?: number; delay?: number }) => (
  <div
    className="absolute bottom-0 animate-sway-slow"
    style={{ ...style, animationDelay: `${delay}s` }}
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

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { t } = useLang();
  const [loading, setLoading] = useState(false);

  const grassBlades = Array.from({ length: 50 }, (_, i) => ({
    left: `${(i / 50) * 100 + Math.random() * 1.5}%`,
    height: 20 + Math.random() * 35,
    delay: Math.random() * 4,
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (name.trim().length < 2 || name.length > 100) {
      setError(t.auth.invalidName || 'Name must be between 2 and 100 characters.');
      return;
    }
    if (!isValidEmail(email)) {
      setError(t.auth.invalidEmail || 'Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError(t.auth.passwordTooShort);
      return;
    }
    if (password !== confirmPassword) {
      setError(t.auth.passwordMismatch);
      return;
    }

    const existing = api.getUserByEmail(email.trim().toLowerCase());
    if (existing) {
      setError(t.auth.emailInUse);
      return;
    }

    setLoading(true);
    try {
      const hashedPw = await hashPassword(password);
      api.createUser({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone ? sanitizePhone(phone) : undefined,
        role: 'client',
        status: 'pending',
        password: hashedPw,
        createdAt: new Date().toISOString().split('T')[0],
      });
      api.addNotification({
        type: 'registration',
        title: `New Registration: ${name}`,
        message: `${name} (${email}) has registered and is waiting for approval.`,
        read: false,
        createdAt: new Date().toISOString(),
        link: '/app/users',
      });
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  const formWrapper = (content: React.ReactNode) => (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden font-body bg-cream-50">
      {/* Horseshoe pattern background */}
      <div className="absolute inset-0 horseshoe-pattern opacity-30" />

      {/* Grass at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[60px] overflow-hidden pointer-events-none">
        {grassBlades.map((blade, i) => (
          <GrassBlade key={i} style={{ left: blade.left }} height={blade.height} delay={blade.delay} />
        ))}
        <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-t from-forest-800/10 to-transparent" />
      </div>

      <div className="absolute top-4 left-4 z-10">
        <Link to="/" className="flex items-center gap-2 text-stone-400 hover:text-stone-700 transition-colors text-sm">
          <ArrowLeft size={16} /> {t.auth.backToHome}
        </Link>
      </div>
      <div className="absolute top-4 right-4 z-10">
        <LangSwitcher />
      </div>
      {content}
    </div>
  );

  if (success) {
    return formWrapper(
      <div className="relative w-full max-w-md z-10">
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-gold-400 flex items-center justify-center text-forest-950 font-bold text-xl font-display mx-auto mb-4 shadow-lg shadow-gold-500/25">AH</div>
          <h1 className="text-2xl font-bold text-stone-800 font-display">{t.common.appName}</h1>
          <p className="text-stone-400 mt-1 text-sm">{t.common.management}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl shadow-stone-200/50 p-8 animate-slide-up border border-cream-300/60">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center">
              <CheckCircle className="text-emerald-600" size={28} />
            </div>
            <h2 className="text-lg font-semibold text-stone-800 font-display">{t.auth.signUpButton}</h2>
            <div className="p-4 rounded-xl bg-gold-50 border border-gold-200">
              <div className="flex items-start gap-3">
                <Clock className="text-gold-600 shrink-0 mt-0.5" size={18} />
                <p className="text-sm text-gold-800 text-left">{t.auth.signUpSuccess}</p>
              </div>
            </div>
            <Link to="/login">
              <Button icon={<ArrowLeft size={16} />}>{t.auth.goToLogin}</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return formWrapper(
    <div className="relative w-full max-w-md z-10">
      <div className="text-center mb-8 animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-gold-400 flex items-center justify-center text-forest-950 font-bold text-xl font-display mx-auto mb-4 shadow-lg shadow-gold-500/25">AH</div>
        <h1 className="text-2xl font-bold text-stone-800 font-display">{t.common.appName}</h1>
        <p className="text-stone-400 mt-1 text-sm">{t.common.management}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl shadow-stone-200/50 p-8 animate-slide-up border border-cream-300/60">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-forest-50 flex items-center justify-center">
            <svg viewBox="0 0 40 44" className="w-4 h-4 text-forest-600" fill="currentColor">
              <path d="M20 4 C10 4 4 12 4 22 C4 30 8 36 12 40 L16 36 C13 33 10 28 10 22 C10 15 14 10 20 10 C26 10 30 15 30 22 C30 28 27 33 24 36 L28 40 C32 36 36 30 36 22 C36 12 30 4 20 4Z"/>
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-stone-800 font-display">{t.auth.signUpTitle}</h2>
            <p className="text-xs text-stone-400 font-body">{t.auth.signUpSubtitle}</p>
          </div>
        </div>

        <div className="mb-5 p-3 rounded-xl bg-gold-50 border border-gold-200">
          <div className="flex items-start gap-3">
            <Clock className="text-gold-600 shrink-0 mt-0.5" size={16} />
            <p className="text-xs text-gold-800">{t.auth.signUpWarning}</p>
          </div>
        </div>

        {error && <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label={t.auth.fullName} placeholder={t.auth.namePlaceholder} value={name} onChange={(e) => setName(e.target.value)} required />
          <Input label={t.auth.email} type="email" placeholder={t.auth.emailPlaceholder} value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label={t.auth.phone} placeholder={t.auth.phonePlaceholder} value={phone} onChange={(e) => setPhone(e.target.value)} />
          <div className="relative">
            <Input label={t.auth.password} type={showPassword ? 'text' : 'password'} placeholder={t.auth.passwordPlaceholder} value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-[34px] text-stone-400 hover:text-stone-600">
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <Input label={t.auth.confirmPassword} type={showPassword ? 'text' : 'password'} placeholder={t.auth.confirmPlaceholder} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          <Button type="submit" className="w-full" icon={<UserPlus size={16} />} disabled={loading}>{loading ? '...' : t.auth.signUpButton}</Button>
        </form>

        <div className="mt-5 pt-4 border-t border-cream-200">
          <p className="text-center text-sm text-stone-500">
            {t.auth.haveAccount}{' '}
            <Link to="/login" className="text-forest-600 hover:text-forest-700 font-medium">{t.auth.signIn}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
