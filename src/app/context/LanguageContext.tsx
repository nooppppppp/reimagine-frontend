import { createContext, useContext, useState } from 'react';
import { en } from '../translations/en';
import { th } from '../translations/th';

type Lang = 'en' | 'th';
type Translations = typeof en;

interface LanguageContextValue {
  lang: Lang;
  toggleLang: () => void;
  t: (key: keyof Translations) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const translations: Record<Lang, Translations> = { en, th };

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');

  const toggleLang = () => setLang(prev => (prev === 'en' ? 'th' : 'en'));

  const t = (key: keyof Translations) => translations[lang][key];

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider');
  return ctx;
}
