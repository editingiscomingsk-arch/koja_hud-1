import React, { useState, useEffect, useCallback } from "react";
import "./VehicleMenu.scss";
import { useNuiEvent } from "../../hooks/useNuiEvent";
import { fetchNui } from "../../utils/fetchNui";
import { useLocales } from "../../providers/LocaleProvider";
interface VehicleState {
    engine: boolean;
    seatbelt: boolean;
    lights: boolean;
    indicatorLeft: boolean;
    indicatorRight: boolean;
    hazard: boolean;
    doors: {
        frontLeft: boolean;
        frontRight: boolean;
        rearLeft: boolean;
        rearRight: boolean;
        hood: boolean;
        trunk: boolean;
    };
}
const DOOR_KEYS = ["frontLeft", "frontRight", "rearLeft", "rearRight", "hood", "trunk"] as const;
interface BtnProps {
    icon: string;
    label: string;
    active: boolean;
    onClick: () => void;
}
const Btn: React.FC<BtnProps> = ({ icon, label, active, onClick }) => (<div className={`vm-btn ${active ? "active" : ""}`} onClick={onClick}>
        <div className="vm-icon"><i className={icon}></i></div>
        <span>{label}</span>
    </div>);
const VehicleMenu: React.FC = () => {
    const { locale } = useLocales();
    const t = locale.ui.vehiclemenu;
    const [visible, setVisible] = useState(false);
    const [state, setState] = useState<VehicleState | null>(null);
    useNuiEvent<VehicleState>("koja_hud:openVehicleMenu", (data) => {
        setState(data);
        setVisible(true);
    });
    useNuiEvent("koja_hud:closeVehicleMenu", () => {
        setVisible(false);
    });
    const close = useCallback(() => {
        setVisible(false);
        fetchNui("koja_hud:closeVehicleMenu");
    }, []);
    useEffect(() => {
        if (!visible)
            return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape")
                close();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [visible, close]);
    const action = async (act: string, index?: number) => {
        setState(prev => {
            if (!prev)
                return prev;
            const next: VehicleState = { ...prev, doors: { ...prev.doors } };
            switch (act) {
                case "engine":
                    next.engine = !prev.engine;
                    break;
                case "seatbelt":
                    next.seatbelt = !prev.seatbelt;
                    break;
                case "lights":
                    next.lights = !prev.lights;
                    break;
                case "indicatorLeft":
                    next.indicatorLeft = !prev.indicatorLeft;
                    if (next.indicatorLeft) {
                        next.indicatorRight = false;
                        next.hazard = false;
                    }
                    break;
                case "indicatorRight":
                    next.indicatorRight = !prev.indicatorRight;
                    if (next.indicatorRight) {
                        next.indicatorLeft = false;
                        next.hazard = false;
                    }
                    break;
                case "hazard":
                    next.hazard = !prev.hazard;
                    if (next.hazard) {
                        next.indicatorLeft = false;
                        next.indicatorRight = false;
                    }
                    break;
                case "door": {
                    const key = index === undefined ? undefined : DOOR_KEYS[index];
                    if (key)
                        next.doors[key] = !prev.doors[key];
                    break;
                }
            }
            return next;
        });
        const res = await fetchNui<VehicleState>("koja_hud:vehicleAction", { action: act, index });
        if (res && typeof res === "object" && "engine" in res)
            setState(res);
    };
    if (!visible || !state)
        return null;
    const doorIcon = (open: boolean) => open ? "fa-solid fa-door-open" : "fa-solid fa-door-closed";
    return (<div className="vehicle-menu-screen">
            <div className="vehicle-menu pop-in">
                <div className="vm-head">
                    <div className="vm-title">
                        <i className="fa-solid fa-car-side"></i>
                        {t.title}
                    </div>
                    <div className="vm-close" onClick={close}>
                        <span className="esc">ESC</span>
                        {t.close}
                    </div>
                </div>

                <div className="vm-body">
                    <div className="vm-section">
                        <div className="vm-section-title">{t.signals}</div>
                        <div className="vm-row">
                            <Btn icon="fa-solid fa-arrow-left" label={t.left} active={state.indicatorLeft} onClick={() => action("indicatorLeft")}/>
                            <Btn icon="fa-solid fa-triangle-exclamation" label={t.hazards} active={state.hazard} onClick={() => action("hazard")}/>
                            <Btn icon="fa-solid fa-arrow-right" label={t.right} active={state.indicatorRight} onClick={() => action("indicatorRight")}/>
                        </div>
                    </div>

                    <div className="vm-section">
                        <div className="vm-section-title">{t.controls}</div>
                        <div className="vm-row">
                            <Btn icon="fa-solid fa-power-off" label={t.engine} active={state.engine} onClick={() => action("engine")}/>
                            <Btn icon="fa-solid fa-user-shield" label={t.seatbelt} active={state.seatbelt} onClick={() => action("seatbelt")}/>
                            <Btn icon="fa-solid fa-lightbulb" label={t.lights} active={state.lights} onClick={() => action("lights")}/>
                        </div>
                    </div>

                    <div className="vm-section">
                        <div className="vm-section-title">{t.doors}</div>
                        <div className="vm-row grid">
                            <Btn icon={doorIcon(state.doors.frontLeft)} label={t.front_left} active={state.doors.frontLeft} onClick={() => action("door", 0)}/>
                            <Btn icon={doorIcon(state.doors.frontRight)} label={t.front_right} active={state.doors.frontRight} onClick={() => action("door", 1)}/>
                            <Btn icon={doorIcon(state.doors.rearLeft)} label={t.rear_left} active={state.doors.rearLeft} onClick={() => action("door", 2)}/>
                            <Btn icon={doorIcon(state.doors.rearRight)} label={t.rear_right} active={state.doors.rearRight} onClick={() => action("door", 3)}/>
                            <Btn icon="fa-solid fa-car" label={t.hood} active={state.doors.hood} onClick={() => action("door", 4)}/>
                            <Btn icon="fa-solid fa-car-rear" label={t.trunk} active={state.doors.trunk} onClick={() => action("door", 5)}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>);
};
export default VehicleMenu;
