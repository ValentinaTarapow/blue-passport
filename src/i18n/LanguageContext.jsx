import { createContext, useContext, useEffect, useState } from 'react';
import { es } from './translations/es';
import { en } from './translations/en';

const translations = { es, en };
const STORAGE_KEY = 'blue-passport-lang';

function getInitialLanguage() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'es' || stored === 'en') return stored;
  return navigator.language.startsWith('es') ? 'es' : 'en';
}

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(getInitialLanguage);
  const t = translations[lang];

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
    document.title = t.site.meta.title;

    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', t.site.meta.description);
  }, [lang, t]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within LanguageProvider');
  }
  return context;
}
