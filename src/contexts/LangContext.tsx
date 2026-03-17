import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { type Lang, type Translations, getTranslations } from '../i18n';
import { api } from '../services/data';

interface LangContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Translations;
}

const LangContext = createContext<LangContextType | null>(null);

/** Detect language from browser navigator */
function detectBrowserLang(): Lang {
  const nav = navigator.language?.toLowerCase() || '';
  if (nav.startsWith('pt')) return 'pt';
  if (nav.startsWith('nl')) return 'nl';
  return 'en';
}

/** Read lang from the logged-in user cookie session */
function getInitialLang(): Lang {
  // Try to get from cookie session → user profile
  const match = document.cookie.match(/(?:^|; )hh_session=([^;]*)/);
  if (match) {
    const token = decodeURIComponent(match[1]);
    const user = api.getUserBySessionToken(token);
    if (user?.lang && (user.lang === 'en' || user.lang === 'pt' || user.lang === 'nl')) {
      return user.lang as Lang;
    }
  }
  return detectBrowserLang();
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(getInitialLang);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    // Save to logged-in user profile in Supabase
    const match = document.cookie.match(/(?:^|; )hh_session=([^;]*)/);
    if (match) {
      const token = decodeURIComponent(match[1]);
      const user = api.getUserBySessionToken(token);
      if (user) {
        api.updateUser(user.id, { lang: l });
      }
    }
  }, []);

  const t = getTranslations(lang);

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used within LangProvider');
  return ctx;
}
