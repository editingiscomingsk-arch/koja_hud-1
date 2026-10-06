import React from "react";
import { useSettings } from '../../../../../providers/settingsProvider';
import { CarStyleProps } from '../../../../../types/carhud';

const Item: React.FC<CarStyleProps> = ({ speed, gear, engine, seatbelt, keys, nitro, fuelMin, fuelMax, fuelType, elements }) => {
    const E = { gear: true, fuel: true, nitro: true, seatbelt: true, engine: true, ...elements };
    const { settings, getDefaultSettings } = useSettings();
    const defaultSettings = getDefaultSettings();

    const speedString = speed.toString().padStart(3, '0');
    const getOpacity = (index: number) => {
        if (speed >= 100) return 1;
        if (speed < 10 && index < 2) return 0.6;
        if (speed < 100 && index === 0) return 0.6;
        return 1;
    };

    const showNitro = E.nitro && nitro > 0;
    const rightStyle = showNitro ? '3vw' : '1vw';
    const metertype = settings?.carhud?.metertype ?? defaultSettings?.carhud?.metertype;

    return (
        <div className="style-1" style={{ right: rightStyle }}>
            {showNitro && (
                <div className="nitro">
                    <i className="fa-solid fa-bolt-lightning"></i>
                    <div className="nitro-bar">
                        <div className="nitro-status" style={{ height: `${nitro}%` }}></div>
                    </div>
                </div>
            )}
            <div className="metric">{metertype === 'kmh' ? 'KM/H' : 'MPH'}</div>
            <div className="speedmeter">
                {E.gear && <div className="gear">{gear}</div>}
                <div className="speed">
                    {speedString.split('').map((digit, index) => (
                        <span key={index} style={{ opacity: getOpacity(index) }}>
                            {digit}
                        </span>
                    ))}
                </div>
            </div>
            <div className="info">
                {E.engine && (
                    <div className={`engine ${engine ? 'on' : 'off'}`}>
                        <i className="fa-solid fa-engine"></i>
                    </div>
                )}
                {E.seatbelt && (
                    <div className={`seatbelt ${seatbelt ? 'on' : 'off'}`}>
                        <i className="fa-solid fa-pipe-circle-check"></i>
                    </div>
                )}
                <div className={`keys ${keys ? 'active' : 'off'}`}>
                    <i className="fa-solid fa-key"></i>
                </div>

                {E.fuel && <div className="divider-info">|</div>}
                {E.fuel && fuelType === 'gas' && (
                    <div className="fuel gas">
                        <i className="fa-solid fa-gas-pump"></i>
                        <div className="fuel-status">{fuelMin}</div>
                        <div className="divider">/</div>
                        <div className="fuel-max">{fuelMax}l</div>
                    </div>
                )}
                {E.fuel && fuelType === 'electric' && (
                    <div className="fuel electric">
                        <i className="fa-solid fa-charging-station"></i>
                        <div className="fuel-status">{fuelMin}</div>
                        <div className="divider">/</div>
                        <div className="fuel-max">{fuelMax}%</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Item;
