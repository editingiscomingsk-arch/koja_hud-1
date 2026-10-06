import React, { useEffect, useState } from "react";
import "./StatusEffects.scss";
import { useNuiEvent } from "../../../hooks/useNuiEvent";
import { useSettings } from "../../../providers/settingsProvider";
interface EffectIn {
    id: string;
    icon: string;
    color?: string;
    label?: string;
    duration?: number;
}
interface Effect extends EffectIn {
    endsAt?: number;
    total?: number;
}
interface StatusEffectsProps {
    editMode?: boolean;
}
const SAMPLE: Effect[] = [
    { id: "sprint", icon: "fa-solid fa-person-running", color: "#8dd82b" },
    { id: "drunk", icon: "fa-solid fa-wine-bottle", color: "#c77dff", duration: 30, total: 30000, endsAt: 0 },
    { id: "cold", icon: "fa-solid fa-snowflake", color: "#6ab7ff", duration: 12, total: 45000, endsAt: 0 },
];
const StatusEffects: React.FC<StatusEffectsProps> = ({ editMode }) => {
    const { settings } = useSettings();
    const enabled = settings.statuseffects.enabled;
    const [effects, setEffects] = useState<Effect[]>([]);
    const [, forceTick] = useState(0);
    useNuiEvent<EffectIn[]>("koja_hud:statuseffects", (list) => {
        if (!Array.isArray(list))
            return;
        const now = Date.now();
        setEffects(list.map((e) => ({
            ...e,
            total: e.duration ? e.duration * 1000 : undefined,
            endsAt: e.duration ? now + e.duration * 1000 : undefined,
        })));
    });
    useEffect(() => {
        const t = setInterval(() => {
            const now = Date.now();
            setEffects((prev) => prev.filter((e) => !e.endsAt || e.endsAt > now));
            forceTick((n) => n + 1);
        }, 250);
        return () => clearInterval(t);
    }, []);
    if (!enabled)
        return null;
    const now = Date.now();
    const shown = editMode ? SAMPLE : effects;
    if (shown.length === 0)
        return null;
    return (<div className="status-effects">
            {shown.map((e) => {
            const remaining = e.endsAt ? Math.max(0, e.endsAt - now) : 0;
            const frac = e.total && e.endsAt ? remaining / e.total : 0;
            const secs = Math.ceil(remaining / 1000);
            return (<div key={e.id} className="effect" style={{ "--fx": e.color || "#ffffff" } as React.CSSProperties}>
                        {frac > 0 && (<svg className="ring" viewBox="0 0 36 36">
                                <circle className="ring-track" cx="18" cy="18" r="16"/>
                                <circle className="ring-value" cx="18" cy="18" r="16" pathLength={100} strokeDasharray={100} strokeDashoffset={100 - frac * 100}/>
                            </svg>)}
                        <i className={e.icon}></i>
                        {secs > 0 && <span className="secs">{secs}</span>}
                    </div>);
        })}
        </div>);
};
export default StatusEffects;
