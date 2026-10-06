import React from "react";
import { useSettings } from '../../../../../providers/settingsProvider';
import { CarStyleProps } from '../../../../../types/carhud';

const MAX_SPEED = 260;
const ARC_LENGTH = 213;
const Item: React.FC<CarStyleProps> = ({ speed, gear, engine, seatbelt, keys, nitro, fuelMin, fuelMax, fuelType, rpm = 0, engineHealth = 100, lights = false, highbeam = false, indicators = 0, cruise = false, elements }) => {
    const { settings, getDefaultSettings } = useSettings();
    const defaultSettings = getDefaultSettings();
    const metertype = settings?.carhud?.metertype ?? defaultSettings?.carhud?.metertype;
    const E = { gear: true, fuel: true, nitro: true, seatbelt: true, engine: true, rpm: false, engineHealth: false, lights: false, indicators: false, cruise: false, ...elements };
    const showStates = E.engine || E.seatbelt;
    const leftBlink = (indicators & 2) !== 0;
    const rightBlink = (indicators & 1) !== 0;
    const showChips = E.lights || E.indicators || E.cruise;
    const fraction = Math.max(0, Math.min(1, speed / MAX_SPEED));
    const fuelPercent = Math.max(0, Math.min(100, (fuelMin / fuelMax) * 100));
    return (<div className="style-3">
            <div className="gauge">
                <svg viewBox="0 0 100 68" className="arc">
                    <path className="track" d="M 12 62 A 42 42 0 1 1 88 62" fill="none" strokeLinecap="round"/>
                    <path className="value" d="M 12 62 A 42 42 0 1 1 88 62" fill="none" strokeLinecap="round" strokeDasharray={ARC_LENGTH} strokeDashoffset={ARC_LENGTH * (1 - fraction)}/>
                </svg>
                {E.nitro && nitro > 0 && (<svg viewBox="0 0 100 68" className="arc nitro-arc">
                        <path d="M 20 60 A 34 34 0 1 1 80 60" fill="none" strokeLinecap="round" strokeDasharray={172} strokeDashoffset={172 * (1 - nitro / 100)}/>
                    </svg>)}
                <div className="center">
                    <div className="speed">{speed}</div>
                    <div className="unit">{metertype === 'kmh' ? 'KM/H' : 'MPH'}</div>
                    {E.gear && <div className="gear">{gear}</div>}
                </div>
            </div>
            {E.rpm && (<div className="rpm">
                    <span>RPM</span>
                    <div className="rpm-bar">
                        <div className="fill" style={{ width: `${Math.round(Math.max(0, Math.min(1, rpm)) * 100)}%` }}></div>
                    </div>
                </div>)}
            {E.engineHealth && (<div className="ehealth">
                    <i className="fa-solid fa-wrench"></i>
                    <div className="ehealth-bar">
                        <div className="fill" style={{ width: `${Math.round(engineHealth)}%`, background: engineHealth < 30 ? '#ff5a5a' : engineHealth < 60 ? '#f0a83c' : '#4ad07f' }}></div>
                    </div>
                </div>)}
            {showChips && (<div className="car-chips">
                    {E.indicators && <i className={`chip fa-solid fa-arrow-left ${leftBlink ? 'blink on' : ''}`}></i>}
                    {E.lights && <i className={`chip fa-solid fa-lightbulb ${lights ? 'on' : ''} ${highbeam ? 'high' : ''}`}></i>}
                    {E.cruise && <i className={`chip fa-solid fa-gauge-simple-high ${cruise ? 'on' : ''}`}></i>}
                    {E.indicators && <i className={`chip fa-solid fa-arrow-right ${rightBlink ? 'blink on' : ''}`}></i>}
                </div>)}
            {(showStates || E.fuel) && (<div className="under">
                    {showStates && (<div className="states">
                            {E.engine && <i className={`fa-solid fa-engine ${engine ? '' : 'alert'}`}></i>}
                            {E.seatbelt && <i className={`fa-solid fa-pipe-circle-check ${seatbelt ? '' : 'alert'}`}></i>}
                            <i className={`fa-solid fa-key ${keys ? '' : 'alert'}`}></i>
                        </div>)}
                    {E.fuel && (<div className="fuel">
                            <i className={fuelType === 'gas' ? 'fa-solid fa-gas-pump' : 'fa-solid fa-charging-station'}></i>
                            <div className="fuel-bar">
                                <div className="fill" style={{ width: `${fuelPercent}%` }}></div>
                            </div>
                            <div className="fuel-text">{fuelMin}{fuelType === 'gas' ? 'l' : '%'}</div>
                        </div>)}
                </div>)}
        </div>);
};
export default Item;
