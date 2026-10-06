import React, { useState, useEffect } from "react";
import { useSettings } from '../../../providers/settingsProvider';
import { getNestedValue } from '../../../utils/nested';

interface SliderProps {
    id: string;
    title: string;
    description: string;
    min: number;
    max: number;
    onChange: (value: number) => void;
}

const Slider: React.FC<SliderProps> = ({ id, title, description, min, max, onChange }) => {
    const { settings, updateSetting } = useSettings();
    const value = getNestedValue<number>(settings, id) ?? min;

    const [sliderValue, setSliderValue] = useState<number>(value);

    useEffect(() => {
        setSliderValue(value);
    }, [value]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseFloat(event.target.value);
        setSliderValue(newValue);
        updateSetting(id, newValue);
        onChange(newValue);
    };

    const fillPercent = ((sliderValue - min) / (max - min)) * 100;

    return (
        <div className="list-option slider-option" id={id}>
            <div className="list-option-texts">
                <div className="label">{title}</div>
                <div className="desc">{description}</div>
            </div>
            <div className="slider-zone">
                <input
                    type="range"
                    min={min}
                    max={max}
                    step="0.01"
                    value={sliderValue}
                    onChange={handleChange}
                    style={{ "--fill": `${fillPercent}%` } as React.CSSProperties}
                />
                <div className="slider-value">{sliderValue}</div>
            </div>
        </div>
    );
};

export default Slider;
