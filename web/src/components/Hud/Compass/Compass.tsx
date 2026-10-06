import React, { useEffect, useRef, useState } from "react";
import './Compass.scss';
import { useSettings } from '../../../providers/settingsProvider';
interface CompassProps {
    heading: number;
    inVehicle?: boolean;
}
const cardinal = (deg: number): string => {
    const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    return dirs[Math.round(deg / 45) % 8];
};
const MARKS = Array.from({ length: 24 }, (_, i) => i * 15);
const CARDINALS: Record<number, string> = {
    0: "N", 45: "NE", 90: "E", 135: "SE", 180: "S", 225: "SW", 270: "W", 315: "NW",
};
const norm = (d: number) => ((d % 360) + 360) % 360;
const Compass: React.FC<CompassProps> = ({ heading, inVehicle = false }) => {
    const { settings, editMode, serverConfig } = useSettings();
    const mode = settings.compass.visibility;
    const isVisible = mode === "always" ? true :
        mode === "vehicle" ? inVehicle :
            mode === "foot" ? !inVehicle :
                false;
    const style = settings.compass.style;
    const [display, setDisplay] = useState(heading);
    const displayRef = useRef(heading);
    const targetRef = useRef(heading);
    useEffect(() => {
        targetRef.current = norm(heading);
    }, [heading]);
    useEffect(() => {
        let raf = 0;
        const tick = () => {
            const cur = displayRef.current;
            const tgt = targetRef.current;
            const diff = ((tgt - cur + 540) % 360) - 180;
            if (Math.abs(diff) < 0.1) {
                if (cur !== tgt) {
                    displayRef.current = tgt;
                    setDisplay(tgt);
                }
            }
            else {
                displayRef.current = norm(cur + diff * 0.28);
                setDisplay(displayRef.current);
            }
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, []);
    if (!serverConfig.features.compass || (!isVisible && !editMode))
        return null;
    const deg = norm(display);
    const degText = Math.round(deg).toString().padStart(3, "0");
    const dir = cardinal(deg);
    if (style === "minimal") {
        return (<div className="compass minimal fade-in-faster">
                <div className="dir">{dir}</div>
                <div className="deg">{degText}°</div>
            </div>);
    }
    if (style === "cardinal") {
        return (<div className="compass cardinal fade-in-faster">
                <span className="deg">{degText}°</span>
                <span className="sep"></span>
                <span className="dir">{dir}</span>
            </div>);
    }
    const WINDOW = 90;
    return (<div className="compass bar fade-in-faster">
            <div className="pointer"></div>
            <div className="tape">
                {MARKS.map((mark) => {
            const diff = ((mark - deg + 540) % 360) - 180;
            if (Math.abs(diff) > WINDOW)
                return null;
            const left = 50 + (diff / WINDOW) * 50;
            const label = CARDINALS[mark];
            return (<div key={mark} className={`mark ${label ? "cardinal" : "tick"} ${label === "N" ? "north" : ""}`} style={{ left: `${left}%`, opacity: 1 - Math.abs(diff) / (WINDOW * 1.3) }}>
                            {label ? <span>{label}</span> : <i></i>}
                        </div>);
        })}
            </div>
            <div className="readout">{degText}°</div>
        </div>);
};
export default Compass;
