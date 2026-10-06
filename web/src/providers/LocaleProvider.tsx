import { createContext, useContext, useEffect, useState } from 'react';
import defaultLocale from '../../../locales/en.json';
import { useNuiEvent } from '../hooks/useNuiEvent';
import { debugData } from '../utils/debugData';
import { fetchNui } from '../utils/fetchNui';
import { deepMerge } from '../utils/nested';

export type Locale = typeof defaultLocale;

interface LocaleContextValue {
    locale: Locale;
    setLocale: (locale: Locale) => void;
}

debugData([{ action: 'setLocale', data: defaultLocale }]);

const LocaleCtx = createContext<LocaleContextValue>({
    locale: defaultLocale,
    setLocale: () => undefined,
});

const LocaleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [locale, setLocale] = useState<Locale>(defaultLocale);

    useEffect(() => {
        fetchNui('loadLocale');
    }, []);

    useNuiEvent<Partial<Locale>>('setLocale', (data) => setLocale(deepMerge(defaultLocale, data)));

    return <LocaleCtx.Provider value={{ locale, setLocale }}>{children}</LocaleCtx.Provider>;
};

export default LocaleProvider;

export const useLocales = () => useContext(LocaleCtx);
