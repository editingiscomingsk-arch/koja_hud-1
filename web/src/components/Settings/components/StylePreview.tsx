import React from "react";
import { useSettings } from "../../../providers/settingsProvider";
import Status1 from "../../Hud/Status/styles/style-1/Style-1";
import Circle from "../../Hud/Status/styles/circle/Circle";
import Echo from "../../Hud/Status/styles/echo/Echo";
import Minimal from "../../Hud/Status/styles/minimal/Minimal";
import Hexagon from "../../Hud/Status/styles/hexagon/Hexagon";
import CarStyle1 from "../../Hud/CarHud/styles/style-1/Style-1";
import CarStyle2 from "../../Hud/CarHud/styles/style-2/Style-2";
import CarStyle3 from "../../Hud/CarHud/styles/style-3/Style-3";
import CarStyle4 from "../../Hud/CarHud/styles/style-4/Style-4";
import CarStyle5 from "../../Hud/CarHud/styles/style-5/Style-5";
import { CarStyleProps } from "../../../types/carhud";
interface StylePreviewProps {
    type: "status" | "carhud";
    styleId: string;
}
interface ShapeProps {
    type: string;
    radius: number;
    status: number;
    color: string;
    isTalking?: boolean;
}
const statusShapes: Record<string, React.FC<ShapeProps>> = {
    circle: Circle,
    echo: Echo,
    minimal: Minimal,
    hexagon: Hexagon,
};
const carStyles: Record<string, React.FC<CarStyleProps>> = {
    default: CarStyle1,
    compact: CarStyle2,
    gauge: CarStyle3,
    minimal: CarStyle4,
    pvp: CarStyle5,
};
const SCALE: Record<string, number> = {
    "status:default": 0.92,
    "status:circle": 0.92,
    "status:echo": 0.92,
    "status:minimal": 1.05,
    "status:hexagon": 0.92,
    "carhud:default": 0.62,
    "carhud:compact": 0.72,
    "carhud:gauge": 0.6,
    "carhud:minimal": 0.72,
    "carhud:pvp": 0.85,
};
const MOCK_STATUS = [
    { id: "health", status: 82 },
    { id: "shield", status: 64 },
    { id: "food", status: 48 },
    { id: "water", status: 73 },
];
const MOCK_CAR: CarStyleProps = {
    speed: 194,
    gear: 3,
    engine: true,
    seatbelt: false,
    keys: true,
    nitro: 0,
    fuelMin: 55,
    fuelMax: 100,
    fuelType: "gas",
};
const StylePreview: React.FC<StylePreviewProps> = ({ type, styleId }) => {
    const { settings } = useSettings();
    const scale = SCALE[`${type}:${styleId}`] ?? 0.9;
    const renderStatus = () => {
        const colors: Record<string, string | undefined> = settings.status.colors;
        const color = (key: string) => colors[key] || "#ffffff";
        const radius = settings.status.borderradius;
        if (styleId === "default" || (!statusShapes[styleId])) {
            return (<div className="status default">
                    <div className="style-1">
                        <div className="info">
                            {MOCK_STATUS.map(it => (<Status1 key={it.id} type={it.id} radius={radius} status={it.status} color={color(it.id)}/>))}
                        </div>
                    </div>
                </div>);
        }
        const Shape = statusShapes[styleId];
        return (<div className="status default">
                <div className={`style-shape style-${styleId}`}>
                    <div className="info">
                        {MOCK_STATUS.map(it => (<Shape key={it.id} type={it.id} radius={radius} status={it.status} color={color(it.id)}/>))}
                    </div>
                </div>
            </div>);
    };
    const renderCarhud = () => {
        const Comp = carStyles[styleId] || CarStyle1;
        return (<div className="carhud">
                <Comp {...MOCK_CAR}/>
            </div>);
    };
    return (<div className="style-preview" style={{ "--preview-scale": scale } as React.CSSProperties}>
            {type === "status" ? renderStatus() : renderCarhud()}
        </div>);
};
export default StylePreview;
