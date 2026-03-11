import { useState, useRef, useEffect } from 'react';
import { useLang } from '../../contexts/LangContext';
import { type Lang, languages } from '../../i18n';
import { Globe } from 'lucide-react';

export default function LangSwitcher({ dark = false }: { dark?: boolean }) {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const current = languages[lang];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
          dark
            ? 'text-stone-300 hover:text-white hover:bg-white/10'
            : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
        }`}
      >
        <Globe size={16} />
        <span>{current.flag} {current.label}</span>
      </button>
      {open && (
        <div className="absolute right-0 top-10 bg-white rounded-xl shadow-xl border border-stone-200 overflow-hidden z-50 min-w-[160px] animate-scale-in">
          {(Object.entries(languages) as [Lang, typeof current][]).map(([key, val]) => (
            <button
              key={key}
              onClick={() => { setLang(key); setOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-stone-50 transition-colors ${
                lang === key ? 'bg-amber-50 text-amber-700 font-medium' : 'text-stone-700'
              }`}
            >
              <span className="text-base">{val.flag}</span>
              <span>{val.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
