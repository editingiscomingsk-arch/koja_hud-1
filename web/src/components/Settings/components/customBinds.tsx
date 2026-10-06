import React from "react";
import { BuiltinBindSetting, CustomBind, useSettings } from '../../../providers/settingsProvider';
import { useLocales } from '../../../providers/LocaleProvider';
import { fetchNui } from '../../../utils/fetchNui';
import config from '../../../../../editable/shared/js.json';
interface BuiltinBind extends BuiltinBindSetting {
    label: string;
    description: string;
}
const normalizeKey = (event: React.KeyboardEvent): string => {
    const code = event.code;
    if (/^Key[A-Z]$/.test(code))
        return code.slice(3);
    if (/^Digit[0-9]$/.test(code))
        return code.slice(5);
    if (/^F([1-9]|1[0-9]|2[0-4])$/.test(code))
        return code;
    if (/^Numpad[0-9]$/.test(code))
        return "NUMPAD" + code.slice(6);
    const special: Record<string, string> = {
        Space: "SPACE",
        Tab: "TAB",
        CapsLock: "CAPITAL",
        ShiftLeft: "LSHIFT",
        ShiftRight: "RSHIFT",
        ControlLeft: "LCONTROL",
        ControlRight: "RCONTROL",
        AltLeft: "LMENU",
        AltRight: "RMENU",
        Comma: "COMMA",
        Period: "PERIOD",
        Minus: "MINUS",
        Equal: "EQUALS",
        BracketLeft: "LBRACKET",
        BracketRight: "RBRACKET",
        Semicolon: "SEMICOLON",
        Quote: "APOSTROPHE",
        Backslash: "BACKSLASH",
        Slash: "SLASH",
        Backquote: "GRAVE",
        Home: "HOME",
        End: "END",
        PageUp: "PAGEUP",
        PageDown: "PAGEDOWN",
        Insert: "INSERT",
        Delete: "DELETE",
        ArrowUp: "UP",
        ArrowDown: "DOWN",
        ArrowLeft: "LEFT",
        ArrowRight: "RIGHT",
        NumpadAdd: "NUMPAD_PLUS",
        NumpadSubtract: "NUMPAD_MINUS",
        NumpadMultiply: "NUMPAD_MULTIPLY",
        NumpadDivide: "NUMPAD_DIVIDE",
        NumpadEnter: "NUMPAD_ENTER",
    };
    return special[code] || "";
};
const CustomBinds: React.FC = () => {
    const { settings, updateSetting, serverConfig } = useSettings();
    const { locale } = useLocales();
    const t = locale.ui.settings.binds_settings;
    const binds: CustomBind[] = Array.isArray(settings.customBinds) ? settings.customBinds : [];
    const defaultBuiltinBinds: BuiltinBind[] = config.ui.activeBinds;
    const builtinBinds: BuiltinBind[] = Array.isArray(settings.builtinBinds)
        ? defaultBuiltinBinds.map((bind) => ({
            ...bind,
            ...settings.builtinBinds?.find((stored) => stored.id === bind.id),
        }))
        : defaultBuiltinBinds;
    const isBindable = (key: string) => serverConfig.bindKeys.length === 0 || serverConfig.bindKeys.includes(key);
    const sync = (next: CustomBind[]) => {
        updateSetting('customBinds', next);
        fetchNui('koja_hud:updateCustomBinds', { binds: next });
    };
    const addBind = () => {
        sync([...binds, { key: "", command: "" }]);
    };
    const updateBind = (index: number, patch: Partial<CustomBind>) => {
        const next = binds.map((bind, i) => (i === index ? { ...bind, ...patch } : bind));
        sync(next);
    };
    const removeBind = (index: number) => {
        sync(binds.filter((_, i) => i !== index));
    };
    const syncBuiltin = (next: BuiltinBind[]) => {
        updateSetting('builtinBinds', next.map(({ id, key, command }) => ({ id, key, command })));
        fetchNui('koja_hud:updateBuiltinBinds', { binds: next });
    };
    const updateBuiltin = (index: number, key: string) => {
        syncBuiltin(builtinBinds.map((bind, i) => i === index ? { ...bind, key } : bind));
    };
    const handleKeyCapture = (event: React.KeyboardEvent, index: number) => {
        event.preventDefault();
        event.stopPropagation();
        const key = normalizeKey(event);
        if (key && isBindable(key)) {
            updateBind(index, { key });
            (event.target as HTMLElement).blur();
        }
    };
    const handleBuiltinKeyCapture = (event: React.KeyboardEvent, index: number) => {
        event.preventDefault();
        event.stopPropagation();
        const key = normalizeKey(event);
        if (key && isBindable(key)) {
            updateBuiltin(index, key);
            (event.target as HTMLElement).blur();
        }
    };
    return (<div className="sector">
            <div className="sector-head">
                <div className="icon" style={{ backgroundColor: "#47c5ff14" }}>
                    <i className="fa-solid fa-keyboard" style={{ color: "#47c5ff", opacity: 0.9 }}></i>
                </div>
                <div className="texts">
                    <div className="sector-title">{t.title}</div>
                    <div className="desc">{t.description} {t.hint}</div>
                </div>
            </div>
            <div className="list">
                <div className="binds-subtitle">{t.active_title}</div>
                {builtinBinds.map((bind, index) => (<div className="list-option bind-row builtin-bind-row" key={bind.id}>
                        <div className="bind-info">
                            <div className="label">{bind.label}</div>
                            <div className="desc">{bind.description} <span>/{bind.command.replace(/^\+/, '')}</span></div>
                        </div>
                        <input className={`bind-key ${bind.key ? "set" : ""}`} type="text" readOnly value={bind.key} placeholder={t.key_hint} onKeyDown={(e) => handleBuiltinKeyCapture(e, index)}/>
                    </div>))}
                <div className="binds-subtitle custom-bind-title">{t.custom_title}</div>
                {binds.length === 0 && (<div className="binds-empty">{t.empty}</div>)}
                {binds.map((bind, index) => (<div className="list-option bind-row" key={index}>
                        <input className={`bind-key ${bind.key ? "set" : ""}`} type="text" readOnly value={bind.key} placeholder={t.key_hint} onKeyDown={(e) => handleKeyCapture(e, index)}/>
                        <div className="bind-command">
                            <span>/</span>
                            <input type="text" spellCheck={false} value={bind.command} placeholder={t.command_placeholder} onChange={(e) => updateBind(index, { command: e.target.value.replace(/^\//, "") })}/>
                        </div>
                        <div className="bind-remove" onClick={() => removeBind(index)}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                        </div>
                    </div>))}
                <div className="binds-add" onClick={addBind}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                    <span>{t.add}</span>
                </div>
            </div>
        </div>);
};
export default CustomBinds;
