import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './containers/App';
import { HudDataProvider } from './types/data';
import { VisibilityProvider } from './providers/VisibilityProvider';
import { SettingsProvider } from './providers/settingsProvider';
import './index.css';
import { isEnvBrowser } from './utils/misc';
import LocaleProvider from './providers/LocaleProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <LocaleProvider>
            <VisibilityProvider>
                <HudDataProvider>
                    <SettingsProvider>
                        <App />
                    </SettingsProvider>
                </HudDataProvider>
            </VisibilityProvider>
        </LocaleProvider>
    </React.StrictMode>,
);

if (isEnvBrowser()) {
    const root = document.getElementById('root');

    root!.style.backgroundImage = 'url("https://mir-s3-cdn-cf.behance.net/project_modules/fs/c563d2194628095.65ff350322497.png")';
    root!.style.backgroundSize = 'cover';
    root!.style.backgroundRepeat = 'no-repeat';
    root!.style.backgroundPosition = 'center';
}
