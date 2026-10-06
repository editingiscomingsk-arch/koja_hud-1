import React from "react";
import "./Watermark.scss";
import { useSettings } from "../../../providers/settingsProvider";
interface WatermarkProps {
    text: string;
    status: {
        id: string;
        status: number;
    }[] | undefined;
    pvp: boolean;
}
const Watermark: React.FC<WatermarkProps> = ({ text, status, pvp }) => {
    const { settings, serverConfig } = useSettings();
    const { visibility, style, font, size } = settings.watermark;
    const color = settings.watermark.color.text;
    const brand = text.trim();
    if (!visibility || !serverConfig.features.watermark || !brand)
        return null;
    const hp = Math.round(status?.find((s) => s.id === "health")?.status ?? 0);
    const armor = Math.round(status?.find((s) => s.id === "shield")?.status ?? 0);
    const brandStyle: React.CSSProperties = {
        fontFamily: `"${font}", "Poppins", sans-serif`,
        fontSize: `${size}vw`,
        color,
    };
    return (<div className={`watermark style-${style} ${pvp ? "pvp" : ""} fade-in-faster`}>
            <div className="brand" style={brandStyle}>{brand}</div>
            {pvp && (<div className="wm-stats">
                    <div className="stat hp">
                        <i className="fa-solid fa-heart"></i>
                        <span>{hp}</span>
                    </div>
                    <div className="stat armor">
                        <i className="fa-solid fa-shield-halved"></i>
                        <span>{armor}</span>
                    </div>
                </div>)}
        </div>);
};
export default Watermark;
