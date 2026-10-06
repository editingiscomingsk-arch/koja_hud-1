import React from "react";
import { useSettings, getDefaultSettings } from '../../../providers/settingsProvider';
import { getNestedValue } from '../../../utils/nested';
interface ToggleOption {
    id: string;
    label: string;
}
interface TogglesProps {
    id: string;
    title: string;
    description: string;
    options?: ToggleOption[];
    onChange: (optionId: string, value: boolean) => void;
}
const targetIcons: Record<string, string> = {
    health: "fa-solid fa-heart",
    shield: "fa-solid fa-shield-halved",
    food: "fa-solid fa-drumstick-bite",
    water: "fa-solid fa-droplet",
    stamina: "fa-solid fa-person-running",
    oxygen: "fa-solid fa-lungs",
    voice: "fa-solid fa-microphone",
    stress: "fa-solid fa-brain",
    gear: "fa-solid fa-gears",
    fuel: "fa-solid fa-gas-pump",
    nitro: "fa-solid fa-bolt-lightning",
    seatbelt: "fa-solid fa-pipe-circle-check",
    engine: "fa-solid fa-engine",
    rpm: "fa-solid fa-gauge-high",
    engineHealth: "fa-solid fa-wrench",
    lights: "fa-solid fa-lightbulb",
    indicators: "fa-solid fa-right-left",
    cruise: "fa-solid fa-gauge-simple-high",
};
const Toggles: React.FC<TogglesProps> = ({ id, title, description, options, onChange }) => {
    const { settings, updateSetting } = useSettings();
    const defaultSettings = getDefaultSettings();
    const isOn = (optionId: string): boolean => {
        const stored = getNestedValue<boolean>(settings, `${id}.${optionId}`);
        if (typeof stored === "boolean")
            return stored;
        const def = getNestedValue<boolean>(defaultSettings, `${id}.${optionId}`);
        return def !== false;
    };
    const toggle = (optionId: string) => {
        const next = !isOn(optionId);
        updateSetting(`${id}.${optionId}`, next);
        onChange(optionId, next);
    };
    return (<div className="list-option toggles-card" id={id}>
            <div className="list-option-texts">
                <div className="label">{title}</div>
                <div className="desc">{description}</div>
            </div>

            {options && (<div className="toggle-grid">
                    {options.map(option => {
                const on = isOn(option.id);
                return (<div key={option.id} className={`toggle-chip ${on ? "on" : "off"}`} onClick={() => toggle(option.id)} title={option.label}>
                                <i className={targetIcons[option.id] || "fa-solid fa-circle"}></i>
                                <span>{option.label}</span>
                            </div>);
            })}
                </div>)}
        </div>);
};
export default Toggles;
