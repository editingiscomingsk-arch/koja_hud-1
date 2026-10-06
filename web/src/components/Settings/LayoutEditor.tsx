import React, { useLayoutEffect, useRef, useState } from "react";
import "./LayoutEditor.scss";
import { useSettings } from "../../providers/settingsProvider";
import { useLocales } from "../../providers/LocaleProvider";
import { fetchNui } from "../../utils/fetchNui";
import { minimapRect } from "../../utils/minimapRect";
import { isEnvBrowser } from "../../utils/misc";
interface LayoutEditorProps {
    onClose: () => void;
}
interface Vec {
    x: number;
    y: number;
}
interface Rect {
    left: number;
    top?: number;
    bottom?: number;
    width: number;
    height: number;
}
interface CompDef {
    id: string;
    icon: string;
    selector?: string;
    fallback: Rect;
}
const MINIMAP_MIN_SCALE = 0.6;
const MINIMAP_MAX_SCALE = 1.9;
const clampScale = (s: number) => Math.min(MINIMAP_MAX_SCALE, Math.max(MINIMAP_MIN_SCALE, Math.round(s * 100) / 100));
const COMPONENTS: CompDef[] = [
    { id: "status", icon: "fa-solid fa-heart", selector: ".status .style-1, .status .style-shape, .status .style-2", fallback: { left: 40, bottom: 4, width: 20, height: 5 } },
    { id: "carhud", icon: "fa-solid fa-gauge-high", selector: ".carhud .style-1, .carhud .style-2, .carhud .style-3, .carhud .style-4, .carhud .style-5", fallback: { left: 82, bottom: 2, width: 15, height: 10 } },
    { id: "informations", icon: "fa-solid fa-circle-info", selector: ".informations", fallback: { left: 84, top: 2, width: 14, height: 8 } },
    { id: "notify", icon: "fa-solid fa-bell", selector: ".notify-screen .notify, .notify-screen", fallback: { left: 82, top: 12, width: 16, height: 10 } },
    { id: "progressbar", icon: "fa-solid fa-bars-progress", selector: ".progressbar", fallback: { left: 43, bottom: 9, width: 13, height: 3.2 } },
    { id: "textui", icon: "fa-solid fa-font", selector: ".textui", fallback: { left: 44, bottom: 16, width: 11, height: 3.2 } },
    { id: "keybinds", icon: "fa-solid fa-keyboard", selector: ".keybinds", fallback: { left: 86, top: 36, width: 12, height: 22 } },
    { id: "compass", icon: "fa-solid fa-compass", selector: ".compass", fallback: { left: 40, top: 5, width: 20, height: 4 } },
    { id: "weapon", icon: "fa-solid fa-gun", selector: ".weapon", fallback: { left: 1, top: 2, width: 11, height: 5 } },
    { id: "watermark", icon: "fa-solid fa-signature", selector: ".watermark", fallback: { left: 44, top: 1, width: 12, height: 3 } },
    { id: "killfeed", icon: "fa-solid fa-skull", selector: ".killfeed", fallback: { left: 1, top: 14, width: 15, height: 10 } },
    { id: "statuseffects", icon: "fa-solid fa-bolt", selector: ".status-effects", fallback: { left: 42, top: 11, width: 16, height: 5 } },
    { id: "minimap", icon: "fa-solid fa-map-location-dot", fallback: { left: 1, bottom: 5, width: 15, height: 18.9 } },
];
const isMinimapEditable = () => minimapRect.enabled || isEnvBrowser();
const toVw = (px: number) => (px / window.innerWidth) * 100;
const toVh = (px: number) => (px / window.innerHeight) * 100;
const LayoutEditor: React.FC<LayoutEditorProps> = ({ onClose }) => {
    const { settings, updateSetting } = useSettings();
    const { locale } = useLocales();
    const t = locale.ui.settings.layout;
    const itemLabels: Record<string, string | undefined> = t.items;
    const [initialLayout] = useState(() => settings.layout);
    const [measured, setMeasured] = useState<Record<string, Rect>>({});
    const [delta, setDelta] = useState<Record<string, Vec>>({});
    const [minimapScale, setMinimapScale] = useState<number>(clampScale(settings.layout.minimap?.scale ?? 1));
    const scaleRef = useRef(minimapScale);
    scaleRef.current = minimapScale;
    const baseRef = useRef<Record<string, Vec>>({});
    const dragRef = useRef<{
        id: string;
        startX: number;
        startY: number;
        baseX: number;
        baseY: number;
    } | null>(null);
    useLayoutEffect(() => {
        const m: Record<string, Rect> = {};
        const b: Record<string, Vec> = {};
        COMPONENTS.forEach(c => {
            b[c.id] = { x: initialLayout[c.id]?.x ?? 0, y: initialLayout[c.id]?.y ?? 0 };
            if (c.id === "minimap") {
                if (!isMinimapEditable())
                    return;
                m[c.id] = { left: minimapRect.left, bottom: minimapRect.bottom, width: minimapRect.width, height: minimapRect.height };
                return;
            }
            const el = c.selector ? document.querySelector(c.selector) : null;
            if (el) {
                const r = el.getBoundingClientRect();
                if (r.width > 1 && r.height > 1) {
                    const padVw = 0.5;
                    const padVh = 0.7;
                    m[c.id] = {
                        left: toVw(r.left) - padVw,
                        top: toVh(r.top) - padVh,
                        width: toVw(r.width) + padVw * 2,
                        height: toVh(r.height) + padVh * 2,
                    };
                    return;
                }
            }
            m[c.id] = c.fallback;
        });
        baseRef.current = b;
        setMeasured(m);
        setDelta({});
    }, [initialLayout]);
    const syncMinimap = (x: number, y: number, scale: number) => {
        if (!isMinimapEditable())
            return;
        fetchNui("koja_hud:updateMinimap", { x, y, scale });
    };
    const saveOffset = (id: string, d: Vec) => {
        const base = baseRef.current[id] ?? { x: 0, y: 0 };
        const x = Math.round((base.x + d.x) * 100) / 100;
        const y = Math.round((base.y + d.y) * 100) / 100;
        if (id === "minimap") {
            updateSetting("layout.minimap", { x, y, scale: scaleRef.current });
            syncMinimap(x, y, scaleRef.current);
        }
        else {
            updateSetting(`layout.${id}`, { x, y });
        }
    };
    const handleMouseDown = (event: React.MouseEvent, id: string) => {
        event.preventDefault();
        const cur = delta[id] ?? { x: 0, y: 0 };
        dragRef.current = { id, startX: event.clientX, startY: event.clientY, baseX: cur.x, baseY: cur.y };
        const handleMove = (e: MouseEvent) => {
            const drag = dragRef.current;
            if (!drag)
                return;
            const dx = toVw(e.clientX - drag.startX);
            const dy = toVh(e.clientY - drag.startY);
            setDelta(prev => ({ ...prev, [drag.id]: { x: drag.baseX + dx, y: drag.baseY + dy } }));
        };
        const handleUp = (e: MouseEvent) => {
            const drag = dragRef.current;
            if (drag) {
                const dx = toVw(e.clientX - drag.startX);
                const dy = toVh(e.clientY - drag.startY);
                const d = { x: drag.baseX + dx, y: drag.baseY + dy };
                setDelta(prev => ({ ...prev, [drag.id]: d }));
                saveOffset(drag.id, d);
            }
            dragRef.current = null;
            window.removeEventListener("mousemove", handleMove);
            window.removeEventListener("mouseup", handleUp);
        };
        window.addEventListener("mousemove", handleMove);
        window.addEventListener("mouseup", handleUp);
    };
    const handleResizeMouseDown = (event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        const startX = event.clientX;
        const startY = event.clientY;
        const startScale = scaleRef.current;
        const compute = (e: MouseEvent) => {
            const dxVw = toVw(e.clientX - startX);
            const dyVw = toVw(e.clientY - startY);
            return clampScale(startScale + (dxVw - dyVw) / 2 / (minimapRect.width || 15));
        };
        const move = (e: MouseEvent) => setMinimapScale(compute(e));
        const up = (e: MouseEvent) => {
            const s = compute(e);
            setMinimapScale(s);
            scaleRef.current = s;
            const d = delta.minimap ?? { x: 0, y: 0 };
            saveOffset("minimap", d);
            window.removeEventListener("mousemove", move);
            window.removeEventListener("mouseup", up);
        };
        window.addEventListener("mousemove", move);
        window.addEventListener("mouseup", up);
    };
    const handleReset = () => {
        const cleared: Record<string, Vec> = {};
        COMPONENTS.forEach(c => {
            const base = baseRef.current[c.id] ?? { x: 0, y: 0 };
            cleared[c.id] = { x: -base.x, y: -base.y };
            if (c.id === "minimap") {
                if (!isMinimapEditable())
                    return;
                updateSetting("layout.minimap", { x: 0, y: 0, scale: 1 });
            }
            else {
                updateSetting(`layout.${c.id}`, { x: 0, y: 0 });
            }
        });
        setDelta(cleared);
        setMinimapScale(1);
        scaleRef.current = 1;
        syncMinimap(0, 0, 1);
    };
    return (<div className="layout-editor">
            <div className="layout-toolbar pop-in">
                <div className="texts">
                    <div className="title">{t.edit}</div>
                    <div className="hint">{t.hint}</div>
                </div>
                <div className="buttons">
                    <div className="btn ghost" onClick={handleReset}>{t.reset}</div>
                    <div className="btn primary" onClick={onClose}>{t.save}</div>
                </div>
            </div>
            {COMPONENTS.map(c => {
            const mr = measured[c.id];
            if (!mr)
                return null;
            const d = delta[c.id] ?? { x: 0, y: 0 };
            const isMinimap = c.id === "minimap";
            const base = baseRef.current[c.id] ?? { x: 0, y: 0 };
            const tx = isMinimap ? base.x + d.x : d.x;
            const ty = isMinimap ? base.y + d.y : d.y;
            const style: React.CSSProperties = isMinimap
                ? {
                    left: `${mr.left}vw`,
                    bottom: `${mr.bottom}vh`,
                    width: `${mr.width * minimapScale}vw`,
                    height: `${mr.height * minimapScale}vh`,
                    transform: `translate(${tx}vw, ${ty}vh)`,
                }
                : {
                    left: `${mr.left}vw`,
                    top: `${mr.top}vh`,
                    width: `${mr.width}vw`,
                    height: `${mr.height}vh`,
                    transform: `translate(${tx}vw, ${ty}vh)`,
                };
            const labelBelow = !isMinimap && (mr.top ?? 100) < 5;
            return (<div key={c.id} className={`layout-proxy ${isMinimap ? "minimap" : ""} ${labelBelow ? "label-below" : "label-above"}`} style={style} onMouseDown={(e) => handleMouseDown(e, c.id)}>
                        <div className="proxy-label">
                            <i className={c.icon}></i>
                            <span>{itemLabels[c.id] ?? c.id}</span>
                        </div>
                        {isMinimap && (<>
                                <span className="frame-corner tl"></span>
                                <span className="frame-corner tr"></span>
                                <span className="frame-corner bl"></span>
                                <span className="frame-corner br"></span>
                                <div className="resize-handle corner" onMouseDown={handleResizeMouseDown} aria-label="Resize minimap">
                                    <i className="fa-solid fa-up-right-and-down-left-from-center"></i>
                                </div>
                            </>)}
                    </div>);
        })}
        </div>);
};
export default LayoutEditor;
