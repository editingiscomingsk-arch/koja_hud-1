import React from "react";
import { useSettings } from '../../../../../providers/settingsProvider';
import { CarStyleProps } from '../../../../../types/carhud';

const Item: React.FC<CarStyleProps> = ({ speed, gear, engine, seatbelt, keys, nitro, fuelMin, fuelMax, fuelType, elements }) => {
    const { settings, getDefaultSettings } = useSettings();
    const defaultSettings = getDefaultSettings();
    const metertype = settings?.carhud?.metertype ?? defaultSettings?.carhud?.metertype;
    const fuelPercent = Math.max(0, Math.min(100, (fuelMin / fuelMax) * 100));
    const E = { gear: true, fuel: true, nitro: true, seatbelt: true, engine: true, ...elements };
    const showStates = E.engine || E.seatbelt;

    return (
        <div className="style-2">
            <div className="pill">
                {E.gear && <div className="gear">{gear}</div>}
                <div className="speed-wrap">
                    <div className="speed">{speed}</div>
                    <div className="unit">{metertype === 'kmh' ? 'KM/H' : 'MPH'}</div>
                </div>
                <div className="sep"></div>
                {showStates && (
                    <div className="states">
                        {E.engine && <i className={`fa-solid fa-engine ${engine ? '' : 'alert'}`}></i>}
                        {E.seatbelt && <i className={`fa-solid fa-pipe-circle-check ${seatbelt ? '' : 'alert'}`}></i>}
                        <i className={`fa-solid fa-key ${keys ? '' : 'alert'}`}></i>
                    </div>
                )}
                {E.fuel && (
                    <div className="fuel">
                        <i className={fuelType === 'gas' ? 'fa-solid fa-gas-pump' : 'fa-solid fa-charging-station'}></i>
                        <div className="fuel-bar">
                            <div className="fill" style={{ width: `${fuelPercent}%` }}></div>
                        </div>
                    </div>
                )}
            </div>
            {E.nitro && nitro > 0 && (
                <div className="nitro-chip">
                    <i className="fa-solid fa-bolt-lightning"></i>
                    <div className="nitro-bar">
                        <div className="fill" style={{ width: `${nitro}%` }}></div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Item;
