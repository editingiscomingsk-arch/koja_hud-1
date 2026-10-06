import React, { useState, useEffect, useRef } from "react";
import "./Progressbar.scss";
import { useNuiEvent } from "../../../hooks/useNuiEvent";
import { useSettings } from "../../../providers/settingsProvider";
interface ProgressData {
    icon: string;
    label: string;
    time: number;
}
const TICK_MS = 50;
const HIDE_DELAY_MS = 300;
const FADE_OUT_MS = 500;
const Progressbar: React.FC = () => {
    const { editMode } = useSettings();
    const [progressData, setProgressData] = useState<ProgressData | null>(null);
    const [progress, setProgress] = useState<number>(0);
    const [visible, setVisible] = useState<boolean>(false);
    const intervalRef = useRef<number | null>(null);
    const timeoutsRef = useRef<number[]>([]);
    const clearTimers = () => {
        if (intervalRef.current !== null) {
            window.clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        timeoutsRef.current.forEach((timeout) => window.clearTimeout(timeout));
        timeoutsRef.current = [];
    };
    const schedule = (callback: () => void, delay: number) => {
        timeoutsRef.current.push(window.setTimeout(callback, delay));
    };
    const hide = (delay: number) => {
        schedule(() => {
            setVisible(false);
            schedule(() => {
                setProgressData(null);
                setProgress(0);
            }, FADE_OUT_MS);
        }, delay);
    };
    useNuiEvent<ProgressData>("koja_hud:startProgressbar", (data) => {
        clearTimers();
        const duration = Math.max(0, Number(data.time) || 0) * 1000;
        const startedAt = Date.now();
        setProgressData(data);
        setProgress(0);
        setVisible(true);
        intervalRef.current = window.setInterval(() => {
            const next = duration > 0 ? Math.min(100, ((Date.now() - startedAt) / duration) * 100) : 100;
            setProgress(next);
            if (next >= 100) {
                if (intervalRef.current !== null) {
                    window.clearInterval(intervalRef.current);
                    intervalRef.current = null;
                }
                hide(HIDE_DELAY_MS);
            }
        }, TICK_MS);
    });
    useNuiEvent("koja_hud:cancelProgressbar", () => {
        clearTimers();
        hide(0);
    });
    useEffect(() => clearTimers, []);
    if (!progressData) {
        if (editMode) {
            return (<div className="progressbar">
                    <div className="icon">
                        <i className="fa-solid fa-screwdriver-wrench"></i>
                    </div>
                    <div className="holder">
                        <div className="label">Progressbar</div>
                        <div className="bar">
                            <div className="bar-status" style={{ width: "60%" }}></div>
                        </div>
                    </div>
                </div>);
        }
        return null;
    }
    return (<div className={`progressbar ${visible ? "fade-in-faster" : "fade-out-slow"}`}>
            <div className="icon">
                <i className={progressData.icon}></i>
            </div>
            <div className="holder">
                <div className="label">{progressData.label}</div>
                <div className="bar">
                    <div className="bar-status" style={{ width: `${progress}%` }}></div>
                </div>
            </div>
        </div>);
};
export default Progressbar;
