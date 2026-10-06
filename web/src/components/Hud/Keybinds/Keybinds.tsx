import React from "react";
import './Keybinds.scss';
import { useSettings } from '../../../providers/settingsProvider';
import config from "../../../../../editable/shared/js.json";

interface Hint {
    key: string;
    label: string;
}

const Keybinds: React.FC = () => {
    const { settings } = useSettings();

    const visibility = settings.keybinds.visibility;
    const position = config.ui.keybinds.position;
    const hints: Hint[] = config.ui.keybinds.hints;

    const customBinds = (Array.isArray(settings.customBinds) ? settings.customBinds : [])
        .filter((bind) => bind.key && bind.command);

    if (!visibility || (hints.length === 0 && customBinds.length === 0)) return null;

    return (
        <div className={`keybinds fade-in-faster ${position === 'left' ? 'left' : 'right'}`}>
            {hints.map((hint, index) => (
                <div className="hint" key={`hint-${index}`}>
                    <span className="label">{hint.label}</span>
                    <span className="key">{hint.key}</span>
                </div>
            ))}
            {customBinds.map((bind, index) => (
                <div className="hint" key={`bind-${index}`}>
                    <span className="label">/{bind.command}</span>
                    <span className="key">{bind.key}</span>
                </div>
            ))}
        </div>
    );
};

export default Keybinds;
