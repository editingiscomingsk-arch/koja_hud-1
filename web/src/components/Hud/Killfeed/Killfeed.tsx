import React, { useEffect, useRef, useState } from "react";
import "./Killfeed.scss";
import { useNuiEvent } from "../../../hooks/useNuiEvent";
import { useSettings } from "../../../providers/settingsProvider";
interface KillEvent {
    killer: string;
    victim: string;
    weapon?: string;
    distance?: number;
    headshot?: boolean;
    self?: boolean;
    preview?: boolean;
}
interface KillEntry extends KillEvent {
    id: number;
}
interface KillfeedProps {
    enabled: boolean;
}
let uid = 0;
const PREVIEW_ID = -100;
const Killfeed: React.FC<KillfeedProps> = ({ enabled }) => {
    const { settings, getDefaultSettings, editMode } = useSettings();
    const defaultSettings = getDefaultSettings();
    const style = settings?.killfeed?.style ?? defaultSettings?.killfeed?.style ?? "default";
    const [entries, setEntries] = useState<KillEntry[]>([]);
    const [streak, setStreak] = useState(0);
    const timers = useRef<Record<number, ReturnType<typeof setTimeout>>>({});
    const streakTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    useNuiEvent<KillEvent>("koja_hud:killfeed", (data) => {
        if (!data || !data.killer || !data.victim)
            return;
        if (!enabled && !data.preview)
            return;
        const id = data.preview ? PREVIEW_ID : ++uid;
        if (timers.current[id])
            clearTimeout(timers.current[id]);
        setEntries((prev) => [{ id, ...data }, ...prev.filter((e) => e.id !== id)].slice(0, 6));
        timers.current[id] = setTimeout(() => {
            setEntries((prev) => prev.filter((e) => e.id !== id));
            delete timers.current[id];
        }, 6000);
        if (data.self && !data.preview) {
            setStreak((s) => s + 1);
            if (streakTimer.current)
                clearTimeout(streakTimer.current);
            streakTimer.current = setTimeout(() => setStreak(0), 12000);
        }
    });
    useNuiEvent("koja_hud:killstreakReset", () => {
        if (streakTimer.current)
            clearTimeout(streakTimer.current);
        setStreak(0);
    });
    useEffect(() => {
        const t = timers.current;
        return () => {
            Object.values(t).forEach(clearTimeout);
            if (streakTimer.current)
                clearTimeout(streakTimer.current);
        };
    }, []);
    const sample: KillEntry[] = [
        { id: -1, killer: "You", victim: "Player_47", weapon: "fa-solid fa-gun", distance: 62, headshot: true },
    ];
    const shown = editMode ? sample : entries;
    const streakShown = editMode ? 3 : streak;
    if (shown.length === 0 && streakShown < 2)
        return null;
    return (<div className={`killfeed style-${style}`}>
            {streakShown >= 2 && (<div className="killstreak">
                    <i className="fa-solid fa-fire"></i>
                    <span>{streakShown}</span>
                    <b>KILLS</b>
                </div>)}
            {shown.map((e) => (<div key={e.id} className="kill-row">
                    {style === "modern" && <i className="lead fa-solid fa-skull"></i>}
                    <span className="killer">{e.killer}</span>
                    {e.headshot && <i className="hs fa-solid fa-crosshairs" title="Headshot"></i>}
                    <i className={`kf-weapon ${e.weapon || "fa-solid fa-skull"}`}></i>
                    <span className="victim">{e.victim}</span>
                    {typeof e.distance === "number" && e.distance >= 0 && (<span className="distance">{Math.round(e.distance)}m</span>)}
                </div>))}
        </div>);
};
export default Killfeed;
