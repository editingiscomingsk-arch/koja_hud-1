import React, { useState, useEffect } from "react";
import { HexColorPicker } from "react-colorful";
import { useSettings, getDefaultSettings } from '../../../providers/settingsProvider';
import { getNestedValue } from '../../../utils/nested';

interface ColorOption {
    id: string;
    label: string;
}

interface ColorProps {
    id: string;
    title: string;
    description: string;
    options?: ColorOption[];
    onChange: (id: string, value: string) => void;
}

const PRESET_COLORS = ["#fb3b5c", "#ffffff", "#ff8a00", "#00c3ff", "#9de816", "#c14bff"];

const targetIcons: Record<string, string> = {
    health: "fa-solid fa-heart",
    shield: "fa-solid fa-shield-halved",
    food: "fa-solid fa-drumstick-bite",
    water: "fa-solid fa-droplet",
    stamina: "fa-solid fa-person-running",
    oxygen: "fa-solid fa-lungs",
    voice: "fa-solid fa-microphone",
    stress: "fa-solid fa-brain",
};

const isValidHex = (value: string) => /^([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value);

const Color: React.FC<ColorProps> = ({ id, title, description, options, onChange }) => {
    const { settings, updateSetting } = useSettings();
    const defaultSettings = getDefaultSettings();
    const initialOption = options?.[0]?.id || '';
    const initialColor = getNestedValue<string>(settings, `${id}.${initialOption}`) || getNestedValue<string>(defaultSettings, `${id}.${initialOption}`) || '#ffffff';

    const [color, setColor] = useState<string>(initialColor);
    const [hexInput, setHexInput] = useState<string>(initialColor.replace('#', ''));
    const [selectedOption, setSelectedOption] = useState<string>(initialOption);

    useEffect(() => {
        const newColor = getNestedValue<string>(settings, `${id}.${selectedOption}`) || getNestedValue<string>(defaultSettings, `${id}.${selectedOption}`) || '#ffffff';
        setColor(newColor);
        setHexInput(newColor.replace('#', ''));
    }, [selectedOption, settings, defaultSettings, id]);

    const applyColor = (newColor: string) => {
        setColor(newColor);
        setHexInput(newColor.replace('#', ''));
        updateSetting(`${id}.${selectedOption}`, newColor);
        onChange(selectedOption, newColor);
    };

    const handleHexInput = (value: string) => {
        const clean = value.replace(/[^0-9a-fA-F]/g, '').slice(0, 6);
        setHexInput(clean);
        if (isValidHex(clean)) {
            applyColor(`#${clean.toLowerCase()}`);
        }
    };

    const handleReset = () => {
        const fallback = getNestedValue<string>(defaultSettings, `${id}.${selectedOption}`) || '#ffffff';
        applyColor(fallback);
    };

    const getTargetColor = (optionId: string): string => {
        return getNestedValue<string>(settings, `${id}.${optionId}`) || getNestedValue<string>(defaultSettings, `${id}.${optionId}`) || '#ffffff';
    };

    return (
        <div className="list-option color-card" id={id}>
            <div className="list-option-texts">
                <div className="label">{title}</div>
                <div className="desc">{description}</div>
            </div>

            {options && (
                <div className="target-grid">
                    {options.map(option => {
                        const targetColor = getTargetColor(option.id);
                        const active = selectedOption === option.id;
                        return (
                            <div
                                key={option.id}
                                className={`target ${active ? "active" : ""}`}
                                onClick={() => setSelectedOption(option.id)}
                                title={option.label}
                            >
                                <i
                                    className={targetIcons[option.id] || "fa-solid fa-circle"}
                                    style={{ color: active ? targetColor : undefined }}
                                ></i>
                            </div>
                        );
                    })}
                </div>
            )}

            <div className="picker-zone">
                <div className="picker-side">
                    <div
                        className="preview"
                        style={{ backgroundColor: color }}
                    >
                        <i className={targetIcons[selectedOption] || "fa-solid fa-eye-dropper"}></i>
                    </div>
                    <div className="hex-field">
                        <span>#</span>
                        <input
                            type="text"
                            spellCheck={false}
                            value={hexInput}
                            onChange={(e) => handleHexInput(e.target.value)}
                        />
                    </div>
                </div>
                <div className="picker-main">
                    <HexColorPicker color={color} onChange={applyColor} />
                </div>
            </div>

            <div className="presets">
                {PRESET_COLORS.map(preset => (
                    <div
                        key={preset}
                        className={`preset ${color.toLowerCase() === preset.toLowerCase() ? "active" : ""}`}
                        style={{ backgroundColor: preset }}
                        onClick={() => applyColor(preset)}
                    ></div>
                ))}
                <div className="preset empty"></div>
                <div className="preset empty"></div>
                <div className="preset reset" onClick={handleReset}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /></svg>
                </div>
            </div>
        </div>
    );
};

export default Color;
