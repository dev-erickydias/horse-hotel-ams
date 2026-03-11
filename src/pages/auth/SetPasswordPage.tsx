import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLang } from '../../contexts/LangContext';
import { api } from '../../services/data';
import Button from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import LangSwitcher from '../../components/ui/LangSwitcher';
import { Lock, CheckCircle, AlertTriangle } from 'lucide-react';

export default function SetPasswordPage() {
  const { token } = useParams<{ token: string }>();
  const { t } = useLang();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const user = token ? api.getUserByToken(token) : undefined;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!user) {
      setError(t.setPassword.invalidToken);
      return;
    }
    if (password.length < 4) {
      setError(t.setPassword.passwordTooShort);
      return;
    }
    if (password !== confirm) {
      setError(t.setPassword.passwordMismatch);
      return;
    }

    api.updateUser(user.id, { password, inviteToken: undefined });
    setSuccess(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50 flex items-center justify-center p-4">
      <div className="absolute top-4 right-4"><LangSwitcher dark /></div>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 mb-4">
            <Lock size={28} />
          </div>
          <h1 className="text-2xl font-bold text-stone-900">{t.setPassword.title}</h1>
          <p className="text-stone-500 mt-2">{t.setPassword.subtitle}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-stone-200/60 p-8">
          {success ? (
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle size={28} />
              </div>
              <p className="text-stone-700 font-medium">{t.setPassword.success}</p>
              <Link to="/login">
                <Button className="w-full mt-2">{t.setPassword.goToLogin}</Button>
              </Link>
            </div>
          ) : !user ? (
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-100 text-red-600">
                <AlertTriangle size={28} />
              </div>
              <p className="text-stone-700 font-medium">{t.setPassword.invalidToken}</p>
              <Link to="/">
                <Button variant="secondary" className="mt-2">{t.auth.backToHome}</Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-100 text-sm text-amber-800">
                {user.name} ({user.email})
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-sm text-red-600">{error}</div>
              )}

              <Input
                label={t.setPassword.newPassword}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.setPassword.passwordPlaceholder}
                required
              />
              <Input
                label={t.setPassword.confirmPassword}
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder={t.setPassword.confirmPlaceholder}
                required
              />
              <Button type="submit" className="w-full">{t.setPassword.setPassword}</Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
