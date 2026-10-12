import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
export type Language = 'en' | 'ar';
export type Bilingual = { en: string; ar: string };
const LanguageContext = createContext<{lang: Language; setLang: (l: Language) => void; t: (en: string, ar: string) => string}>({lang: 'en', setLang: () => {}, t: en => en});
export function LanguageProvider({children}: {children: ReactNode}) {
 const [lang, setLang] = useState<Language>('en');
 useEffect(() => { const saved = sessionStorage.getItem('earth-language'); if (saved === 'ar') setLang('ar'); }, []);
 useEffect(() => { document.documentElement.lang = lang; document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'; sessionStorage.setItem('earth-language', lang); }, [lang]);
 return <LanguageContext.Provider value={{lang, setLang, t: (en, ar) => lang === 'ar' ? ar : en}}>{children}</LanguageContext.Provider>;
}
export const useLanguage = () => useContext(LanguageContext);
