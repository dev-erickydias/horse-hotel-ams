import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLang } from '../../contexts/LangContext';
import { api } from '../../services/data';
import { hashPassword } from '../../utils/password';
import LangSwitcher from '../../components/ui/LangSwitcher';
import Button from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Lock, Eye, EyeOff, CheckCircle, AlertTriangle, ArrowLeft, Shield } from 'lucide-react';

/* Grass blade component */
const GrassBlade = ({ style, height = 40, delay = 0 }: { style?: React.CSSProperties; height?: number; delay?: number }) => (
  <div className="absolute bottom-0 animate-sway-slow" style={{ ...style, animationDelay: `${delay}s` }}>
    <svg width="8" height={height} viewBox={`0 0 8 ${height}`}>
      <path d={`M4 ${height} Q2 ${height * 0.5} 3 ${height * 0.15} Q4 0 5 ${height * 0.15} Q6 ${height * 0.5} 4 ${height}`}
        fill="#2d6237" opacity={0.4 + Math.random() * 0.3} />
    </svg>
  </div>
);

export default function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>();
  const { t } = useLang();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const grassBlades = Array.from({ length: 50 }, (_, i) => ({
    left: `${(i / 50) * 100 + Math.random() * 1.5}%`,
    height: 20 + Math.random() * 35,
    delay: Math.random() * 4,
  }));

  // Validate token on render
  const user = token ? api.getUserByResetToken(token) : undefined;

  // Check token expiry
  const isTokenExpired = (): boolean => {
    if (!user?.resetTokenExpiry) return true;
    return new Date(user.resetTokenExpiry) < new Date();
  };

  const tokenValid = !!user && !isTokenExpired();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Re-validate token (could have been used in another tab)
    const freshUser = token ? api.getUserByResetToken(token) : undefined;
    if (!freshUser || !freshUser.resetTokenExpiry || new Date(freshUser.resetTokenExpiry) < new Date()) {
      setError(t.auth.resetTokenInvalid);
      return;
    }

    // Password validation
    if (password.length < 6) {
      setError(t.auth.passwordTooShort);
      return;
    }
    if (password !== confirmPassword) {
      setError(t.auth.passwordMismatch);
      return;
    }

    setLoading(true);
    try {
      const hashedPw = await hashPassword(password);

      // Update password and clear reset token (single-use)
      api.updateUser(freshUser.id, {
        password: hashedPw,
        resetToken: undefined,
        resetTokenExpiry: undefined,
        // Also clear any existing session to force re-login with new password
        sessionToken: undefined,
      });

      // Notify admins that password was reset
      api.addNotification({
        type: 'registration',
        title: `Password Reset Completed: ${freshUser.name}`,
        message: `${freshUser.name} (${freshUser.email}) has successfully reset their password.`,
        read: false,
        createdAt: new Date().toISOString(),
        link: '/app/users',
        audience: 'staff',
      });

      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  return (
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
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center">
                <CheckCircle className="text-emerald-600" size={28} />
              </div>
              <h2 className="text-lg font-semibold text-stone-800 font-display">{t.auth.resetPasswordTitle}</h2>
              <p className="text-sm text-stone-600">{t.auth.resetPasswordSuccess}</p>
              <Link to="/login">
                <Button icon={<ArrowLeft size={16} />}>{t.auth.backToLogin}</Button>
              </Link>
            </div>
          ) : !tokenValid ? (
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
                <AlertTriangle className="text-red-500" size={28} />
              </div>
              <h2 className="text-lg font-semibold text-stone-800 font-display">{t.auth.resetPasswordTitle}</h2>
              <p className="text-sm text-red-600">{isTokenExpired() && user ? t.auth.resetTokenExpired : t.auth.resetTokenInvalid}</p>
              <div className="flex gap-3">
                <Link to="/forgot-password">
                  <Button variant="secondary" size="sm">{t.auth.forgotPasswordSubmit}</Button>
                </Link>
                <Link to="/login">
                  <Button size="sm" icon={<ArrowLeft size={14} />}>{t.auth.backToLogin}</Button>
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-forest-50 flex items-center justify-center">
                  <Lock size={16} className="text-forest-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-stone-800 font-display">{t.auth.resetPasswordTitle}</h2>
                  <p className="text-xs text-stone-400 font-body">{t.auth.resetPasswordSubtitle}</p>
                </div>
              </div>

              {/* Security info */}
              <div className="mb-5 p-3 rounded-xl bg-forest-50 border border-forest-200/60">
                <div className="flex items-start gap-2">
                  <Shield size={14} className="text-forest-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-forest-700">
                    {user?.name} ({user?.email})
                  </p>
                </div>
              </div>

              {error && <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">{error}</div>}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Input
                    label={t.setPassword.newPassword}
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t.setPassword.passwordPlaceholder}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-[34px] text-stone-400 hover:text-stone-600">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <Input
                  label={t.setPassword.confirmPassword}
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t.setPassword.confirmPlaceholder}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />

                {/* Password strength indicator */}
                {password.length > 0 && (
                  <div className="space-y-1">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded-full transition-colors ${
                            password.length >= level * 3
                              ? password.length >= 12 ? 'bg-emerald-500' : password.length >= 8 ? 'bg-gold-400' : 'bg-red-400'
                              : 'bg-cream-300'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-[11px] text-stone-400 font-body">
                      {password.length < 6 ? t.auth.passwordTooShort : password.length >= 12 ? 'Strong' : password.length >= 8 ? 'Good' : 'Minimum reached'}
                    </p>
                  </div>
                )}

                <Button type="submit" className="w-full" icon={<Lock size={16} />} disabled={loading}>
                  {loading ? '...' : t.auth.resetPasswordSubmit}
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
