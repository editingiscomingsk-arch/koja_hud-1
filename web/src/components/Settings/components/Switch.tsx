import React, { useState, useEffect } from "react";
import { useSettings } from '../../../providers/settingsProvider';
import { getNestedValue } from '../../../utils/nested';

interface SwitchProps {
    id: string;
    label: string;
    description: string;
    onChange: (checked: boolean) => void;
}

const Switch: React.FC<SwitchProps> = ({ id, label, description, onChange }) => {
    const { settings, updateSetting } = useSettings();
    const checked = getNestedValue<boolean>(settings, id) === true;
    const [isOn, setIsOn] = useState<boolean>(checked);

    useEffect(() => {
        setIsOn(checked);
    }, [checked]);

    const toggleSwitch = () => {
        const newValue = !isOn;
        setIsOn(newValue);
        updateSetting(id, newValue);
        onChange(newValue);
    };

    return (
        <div className="list-option switch-option" id={id} onClick={toggleSwitch}>
            <div className="list-option-texts">
                <div className="label">{label}</div>
                <div className="desc">{description}</div>
            </div>
            <div className={`switch-pill ${isOn ? 'on' : 'off'}`}>
                <div className="state-label">{isOn ? 'ON' : 'OFF'}</div>
                <div className="knob"></div>
            </div>
        </div>
    );
}

export default Switch;
