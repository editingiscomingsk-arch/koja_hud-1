import React, { useEffect, useRef } from "react";
import "./Warnings.scss";
import { useSettings } from "../../../providers/settingsProvider";
import { useLocales } from "../../../providers/LocaleProvider";
interface WarningsProps {
    health: number;
    inVehicle: boolean;
    fuel: number;
    editMode?: boolean;
}
let audioCtx: AudioContext | null = null;
const beep = (freq = 880, dur = 0.12, vol = 0.14) => {
    try {
        const Ctx = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!Ctx)
            return;
        audioCtx = audioCtx || new Ctx();
        const o = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        o.type = "square";
        o.frequency.value = freq;
        g.gain.value = vol;
        o.connect(g);
        g.connect(audioCtx.destination);
        o.start();
        o.stop(audioCtx.currentTime + dur);
    }
    catch {
        audioCtx = null;
    }
};
const Warnings: React.FC<WarningsProps> = ({ health, inVehicle, fuel, editMode }) => {
    const { settings } = useSettings();
    const { locale } = useLocales();
    const {
        lowHealth: enabledHealth,
        lowFuel: enabledFuel,
        sound: soundOn,
        healthThreshold: hpThreshold,
        fuelThreshold,
    } = settings.warnings;
    const t = locale.ui.settings.warnings_settings.labels;
    const lowHealth = enabledHealth && health > 0 && health <= hpThreshold;
    const lowFuel = enabledFuel && inVehicle && fuel <= fuelThreshold;
    const canBeep = soundOn && !editMode;
    const hpWas = useRef(false);
    useEffect(() => {
        if (lowHealth && !hpWas.current && canBeep)
            beep(660, 0.1, 0.1);
        hpWas.current = lowHealth;
    }, [lowHealth, canBeep]);
    const fuelWas = useRef(false);
    useEffect(() => {
        if (lowFuel && !fuelWas.current && canBeep)
            beep(520, 0.16, 0.12);
        fuelWas.current = lowFuel;
    }, [lowFuel, canBeep]);
    const chips = [
        lowFuel && { key: "fuel", icon: "fa-solid fa-gas-pump", label: t.fuel || "Low Fuel", cls: "fuel" },
        lowHealth && { key: "hp", icon: "fa-solid fa-heart-pulse", label: t.health || "Low Health", cls: "hp" },
    ].filter(Boolean) as {
        key: string;
        icon: string;
        label: string;
        cls: string;
    }[];
    return (<>
            {lowHealth && <div className="hp-vignette"/>}
            {chips.length > 0 && (<div className="warnings">
                    {chips.map((c) => (<div key={c.key} className={`warn-chip ${c.cls}`}>
                            <i className={c.icon}></i>
                            <span>{c.label}</span>
                        </div>))}
                </div>)}
        </>);
};
export default Warnings;
