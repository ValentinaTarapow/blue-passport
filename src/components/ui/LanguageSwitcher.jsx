import { useEffect, useRef, useState } from 'react';
import { useTranslation } from '../../i18n/LanguageContext';
import { LangDropdown, LangOption, LangPanel, LangTrigger } from './LanguageSwitcher.styles';

const LANGUAGES = ['es', 'en'];

export default function LanguageSwitcher() {
  const { lang, setLang, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, []);

  const selectLanguage = (code) => {
    setLang(code);
    setOpen(false);
  };

  return (
    <LangDropdown ref={rootRef}>
      <LangTrigger
        type="button"
        $open={open}
        aria-label={t.language.switch}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((current) => !current)}
      >
        {lang.toUpperCase()}
      </LangTrigger>

      <LangPanel $open={open} role="listbox" aria-label={t.language.switch}>
        {LANGUAGES.map((code) => (
          <LangOption
            key={code}
            type="button"
            role="option"
            aria-selected={lang === code}
            $active={lang === code}
            onClick={() => selectLanguage(code)}
          >
            {t.language[code]}
          </LangOption>
        ))}
      </LangPanel>
    </LangDropdown>
  );
}
