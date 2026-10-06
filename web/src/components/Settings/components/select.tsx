import React, { useState, useEffect, useRef } from "react";
import { useSettings, getDefaultSettings, setSetting } from '../../../providers/settingsProvider';
import { getNestedValue } from '../../../utils/nested';
interface DropdownOption {
    id: string;
    label: string;
}
interface DropdownProps {
    id: string;
    title: string;
    description: string;
    options: DropdownOption[];
    onChange: (value: string) => void;
}
const Dropdown: React.FC<DropdownProps> = ({ id, title, description, options, onChange }) => {
    const { settings } = useSettings();
    const defaultSettings = getDefaultSettings();
    const value = getNestedValue<string>(settings, id) ?? getNestedValue<string>(defaultSettings, id) ?? "";
    const [selectedOption, setSelectedOption] = useState<string>(value);
    const [menuOpen, setMenuOpen] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        setSelectedOption(value);
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [id, value]);
    const handleSelect = (optionId: string) => {
        setSelectedOption(optionId);
        setSetting(id, optionId);
        setMenuOpen(false);
        onChange(optionId);
    };
    const selectedOptionLabel = options.find(option => option.id === selectedOption)?.label;
    if (options.length <= 3) {
        return (<div className="list-option segmented-option" id={id}>
                <div className="list-option-texts">
                    <div className="label">{title}</div>
                    <div className="desc">{description}</div>
                </div>
                <div className="segmented">
                    {options.map(option => (<div key={option.id} className={`seg ${selectedOption === option.id ? "active" : ""}`} onClick={() => handleSelect(option.id)}>
                            {option.label}
                        </div>))}
                </div>
            </div>);
    }
    return (<div className="list-option dropdown" id={id} ref={dropdownRef}>
            <div className="list-option-texts">
                <div className="label">{title}</div>
                <div className="desc">{description}</div>
            </div>
            <div className="select" onClick={() => setMenuOpen(!menuOpen)}>
                <div className="select-label">{selectedOptionLabel}</div>
                <svg className={menuOpen ? 'open' : ''} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M6 9l6 6l6 -6"/>
                </svg>
                {menuOpen && (<div className="menu pop-in">
                        {options.map(option => (<div key={option.id} className={`menu-option ${selectedOption === option.id ? "active" : ""}`} onClick={() => handleSelect(option.id)}>
                                {option.label}
                            </div>))}
                    </div>)}
            </div>
        </div>);
};
export default Dropdown;
