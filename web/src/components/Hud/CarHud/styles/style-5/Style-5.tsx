import React from "react";
import { useSettings } from '../../../../../providers/settingsProvider';
import { CarStyleProps } from '../../../../../types/carhud';

const Item: React.FC<CarStyleProps> = ({ speed, gear, elements }) => {
    const { settings, getDefaultSettings } = useSettings();
    const defaultSettings = getDefaultSettings();
    const metertype = settings?.carhud?.metertype ?? defaultSettings?.carhud?.metertype;
    const showGear = elements?.gear !== false;
    return (<div className="style-5">
            <div className="chip">
                {showGear && <div className="gear">{gear}</div>}
                <div className="readout">
                    <div className="speed">{speed}</div>
                    <div className="unit">{metertype === 'kmh' ? 'KM/H' : 'MPH'}</div>
                </div>
            </div>
        </div>);
};
export default Item;
