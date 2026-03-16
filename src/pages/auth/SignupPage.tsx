import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../../contexts/LangContext';
import { api } from '../../services/data';
import { isValidEmail, sanitizePhone } from '../../utils/sanitize';
import LangSwitcher from '../../components/ui/LangSwitcher';
import Button from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { UserPlus, Eye, EyeOff, ArrowLeft, Clock, CheckCircle } from 'lucide-react';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate name length
    if (name.trim().length < 2 || name.length > 100) {
      setError(t.auth.invalidName || 'Name must be between 2 and 100 characters.');
      return;
    }

    // Validate email format
    if (!isValidEmail(email)) {
      setError(t.auth.invalidEmail || 'Please enter a valid email address.');
      return;
    }

    if (password.length < 4) {
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

    // Create user with 'pending' status
    api.createUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? sanitizePhone(phone) : undefined,
      role: 'client', // Default role, admin will change
      status: 'pending',
      password,
      createdAt: new Date().toISOString().split('T')[0],
    });

    // Add notification for admin
    api.addNotification({
      type: 'registration',
      title: `New Registration: ${name}`,
      message: `${name} (${email}) has registered and is waiting for approval.`,
      read: false,
      createdAt: new Date().toISOString(),
      link: '/app/users',
    });

    setSuccess(true);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center p-4">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl" />
        </div>

        <div className="absolute top-4 right-4">
          <LangSwitcher dark />
        </div>

        <div className="relative w-full max-w-md">
          <div className="text-center mb-8 animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-amber-600 flex items-center justify-center text-white font-bold text-xl mx-auto mb-4 shadow-lg shadow-amber-600/30">AH</div>
            <h1 className="text-2xl font-bold text-white">{t.common.appName}</h1>
            <p className="text-stone-400 mt-1">{t.common.management}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-8 animate-slide-up">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle className="text-emerald-600" size={28} />
              </div>
              <h2 className="text-lg font-semibold text-stone-900">{t.auth.signUpButton}</h2>
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                <div className="flex items-start gap-3">
                  <Clock className="text-amber-600 shrink-0 mt-0.5" size={18} />
                  <p className="text-sm text-amber-800 text-left">{t.auth.signUpSuccess}</p>
                </div>
              </div>
              <Link to="/login">
                <Button icon={<ArrowLeft size={16} />}>{t.auth.goToLogin}</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl" />
      </div>

      <div className="absolute top-4 left-4">
        <Link to="/" className="flex items-center gap-2 text-stone-400 hover:text-white transition-colors text-sm">
          <ArrowLeft size={16} /> {t.auth.backToHome}
        </Link>
      </div>

      <div className="absolute top-4 right-4">
        <LangSwitcher dark />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-amber-600 flex items-center justify-center text-white font-bold text-xl mx-auto mb-4 shadow-lg shadow-amber-600/30">AH</div>
          <h1 className="text-2xl font-bold text-white">{t.common.appName}</h1>
          <p className="text-stone-400 mt-1">{t.common.management}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8 animate-slide-up">
          <h2 className="text-lg font-semibold text-stone-900 mb-1">{t.auth.signUpTitle}</h2>
          <p className="text-sm text-stone-500 mb-4">{t.auth.signUpSubtitle}</p>

          {/* Warning about 48h */}
          <div className="mb-5 p-3 rounded-xl bg-amber-50 border border-amber-200">
            <div className="flex items-start gap-3">
              <Clock className="text-amber-600 shrink-0 mt-0.5" size={16} />
              <p className="text-xs text-amber-800">{t.auth.signUpWarning}</p>
            </div>
          </div>

          {error && <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">{error}</div>}

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
            <Button type="submit" className="w-full" icon={<UserPlus size={16} />}>{t.auth.signUpButton}</Button>
          </form>

          <p className="text-center text-sm text-stone-500 mt-5">
            {t.auth.haveAccount}{' '}
            <Link to="/login" className="text-amber-600 hover:text-amber-700 font-medium">{t.auth.signIn}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
