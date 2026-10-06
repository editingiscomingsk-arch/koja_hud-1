import React, { useState } from "react";
import Status1 from "./styles/style-1/Style-1";
import Circle from "./styles/circle/Circle";
import Echo from "./styles/echo/Echo";
import Minimal from "./styles/minimal/Minimal";
import Hexagon from "./styles/hexagon/Hexagon";
import "./Status.scss";
import { useSettings } from "../../../providers/settingsProvider";
import { useNuiEvent } from "../../../hooks/useNuiEvent";
interface ShapeProps {
    type: string;
    radius: number;
    status: number;
    color: string;
    isTalking?: boolean;
}
interface StatusProps {
    style: string;
    data: {
        id: string;
        status: number;
    }[] | undefined;
}
interface PercentSetting {
    value: number;
    action: string;
    visibility: boolean;
}
const getColor = (colors: Record<string, string | undefined>, key: string): string => colors[key] || "#ffffff";
const Status: React.FC<StatusProps> = ({ style, data }) => {
    const { settings, getDefaultSettings } = useSettings();
    const defaultSettings = getDefaultSettings();
    const [isTalking, setIsTalking] = useState(false);
    useNuiEvent<boolean>("koja_hud:setTalking", (talking: boolean) => {
        setIsTalking(talking);
    });
    const scale = settings?.status?.scale ?? defaultSettings?.status?.scale ?? 1;
    const borderRadius = settings?.status?.borderradius ??
        defaultSettings?.status?.borderradius ??
        0;
    let scaleClass = "";
    if (scale <= "0.5") {
        scaleClass = "small";
    }
    else if (scale <= "1.5") {
        scaleClass = "default";
    }
    else {
        scaleClass = "big";
    }
    const currentStyle = style || settings?.status?.style || defaultSettings?.status?.style;
    const percentSettings: Record<string, PercentSetting | undefined> = settings.status.percent;
    const enabledSettings: Record<string, boolean | undefined> = settings.status.enabled;
    const colors: Record<string, string | undefined> = settings.status.colors;
    const visibleData = data
        ? data.filter((item) => {
            if (enabledSettings[item.id] === false)
                return false;
            const setting = percentSettings[item.id];
            if (!setting)
                return true;
            if (setting.visibility)
                return true;
            if (setting.action === "above")
                return item.status > setting.value;
            if (setting.action === "below")
                return item.status < setting.value;
            return true;
        })
        : [];
    const shapeComponents: Record<string, React.FC<ShapeProps>> = {
        circle: Circle,
        echo: Echo,
        minimal: Minimal,
        hexagon: Hexagon,
    };
    const renderDefault = () => (<div className="style-1" style={{ borderRadius: `${borderRadius * 100}%` }}>
            <div className="info">
                {visibleData.map((item) => (<Status1 key={item.id} type={item.id} radius={borderRadius} status={item.status} color={getColor(colors, item.id)} isTalking={item.id === 'voice' ? isTalking : undefined}/>))}
            </div>
        </div>);
    const renderStatus = () => {
        if (!visibleData || visibleData.length === 0)
            return null;
        if (shapeComponents[currentStyle]) {
            const Shape = shapeComponents[currentStyle];
            return (<div className={`style-shape style-${currentStyle}`}>
                    <div className="info">
                        {visibleData.map((item) => (<Shape key={item.id} type={item.id} radius={borderRadius} status={item.status} color={getColor(colors, item.id)} isTalking={item.id === 'voice' ? isTalking : undefined}/>))}
                    </div>
                </div>);
        }
        return renderDefault();
    };
    return (<div className={`status fade-in-faster ${scaleClass}`}>
            {renderStatus()}
        </div>);
};
export default Status;
