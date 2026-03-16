import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLang } from '../../contexts/LangContext';
import LangSwitcher from '../../components/ui/LangSwitcher';
import Button from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { LogIn, Eye, EyeOff, ArrowLeft, Clock } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const result = login(email.trim().toLowerCase(), password);
    if (result.success) navigate('/app/dashboard');
    else if (result.error === 'pending') setError('pending');
    else setError(t.auth.invalidCredentials);
  };

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
          <h2 className="text-lg font-semibold text-stone-900 mb-6">{t.auth.signInTitle}</h2>
          {error === 'pending' && (
            <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200">
              <div className="flex items-start gap-3">
                <Clock className="text-amber-600 shrink-0 mt-0.5" size={16} />
                <p className="text-sm text-amber-800">{t.auth.accountPending}</p>
              </div>
            </div>
          )}
          {error && error !== 'pending' && <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label={t.auth.email} type="email" placeholder={t.auth.emailPlaceholder} value={email} onChange={(e) => setEmail(e.target.value)} required />
            <div className="relative">
              <Input label={t.auth.password} type={showPassword ? 'text' : 'password'} placeholder={t.auth.passwordPlaceholder} value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-[34px] text-stone-400 hover:text-stone-600">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <Button type="submit" className="w-full" icon={<LogIn size={16} />}>{t.common.login}</Button>
          </form>

          <p className="text-center text-sm text-stone-500 mt-5">
            {t.auth.noAccount}{' '}
            <Link to="/signup" className="text-amber-600 hover:text-amber-700 font-medium">{t.auth.signUp}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
