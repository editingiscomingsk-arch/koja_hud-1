import React, { useState, useEffect } from "react";
import { useSettings, getDefaultSettings, setSetting } from '../../../providers/settingsProvider';
import { getNestedValue } from '../../../utils/nested';
import StylePreview from "./StylePreview";

interface CardOption {
    id: string;
    label: string;
}

interface StyleCardsProps {
    id: string;
    title: string;
    description: string;
    options: CardOption[];
    onChange: (value: string) => void;
}

const StyleCards: React.FC<StyleCardsProps> = ({ id, title, description, options, onChange }) => {
    const { settings } = useSettings();
    const defaultSettings = getDefaultSettings();
    const value = getNestedValue<string>(settings, id) ?? getNestedValue<string>(defaultSettings, id) ?? "";

    const [selected, setSelected] = useState<string>(value);

    useEffect(() => {
        setSelected(value);
    }, [id, value]);

    const handleSelect = (optionId: string) => {
        setSelected(optionId);
        setSetting(id, optionId);
        onChange(optionId);
    };

    const selectedLabel = options.find(option => option.id === selected)?.label;
    const previewType: "status" | "carhud" = id.startsWith("carhud") ? "carhud" : "status";

    return (
        <div className={`list-option style-preview-cards preview-${previewType}`} id={id}>
            <div className="list-option-texts">
                <div className="label">{title}</div>
                <div className="desc">{description} <span className="picked">{selectedLabel}</span></div>
            </div>
            <div className="preview-grid">
                {options.map((option, index) => (
                    <div
                        key={option.id}
                        className={`preview-card ${selected === option.id ? "active" : ""}`}
                        onClick={() => handleSelect(option.id)}
                    >
                        <div className="preview-head">
                            <div className="check">
                                {selected === option.id && <i className="fa-solid fa-check"></i>}
                            </div>
                            <div className="name">{option.label || `Style ${index + 1}`}</div>
                        </div>
                        <div className="preview-stage">
                            <StylePreview type={previewType} styleId={option.id} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StyleCards;
