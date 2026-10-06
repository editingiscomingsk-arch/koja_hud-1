import React from "react";
import { NotificationItemProps } from "../types";

const hexToRgba = (hex: string, opacity: number) => {
    let r = 255, g = 255, b = 255;
    if (hex && hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
    } else if (hex && hex.length === 7) {
        r = parseInt(hex[1] + hex[2], 16);
        g = parseInt(hex[3] + hex[4], 16);
        b = parseInt(hex[5] + hex[6], 16);
    }
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

const Item: React.FC<NotificationItemProps> = ({ notification }) => {
    const elapsed = Date.now() - notification.createdAt;
    const remainingTime = Math.max(notification.time - elapsed, 0);
    const width = (remainingTime / notification.time) * 100;

    return (
        <div
            className={`notify ${remainingTime <= 700 ? 'fade-out' : 'pop-in'}`}
            style={{ borderColor: hexToRgba(notification.color, 0.22) }}
        >
            <div
                className="tint"
                style={{ background: `linear-gradient(100deg, ${hexToRgba(notification.color, 0.14)} 0%, transparent 55%)` }}
            ></div>
            <div
                className="icon-squircle"
                style={{
                    background: hexToRgba(notification.color, 0.92),
                    boxShadow: `0 0 .6vw ${hexToRgba(notification.color, 0.3)}`,
                }}
            >
                <i className={`${notification.icon}`}></i>
            </div>
            <div className="content">
                <div className="title">{notification.title}</div>
                <div className="desc" dangerouslySetInnerHTML={{ __html: notification.desc }}></div>
            </div>
            <div className="progress-track">
                <div
                    className="bar"
                    style={{
                        width: `${width}%`,
                        backgroundColor: notification.color,
                        boxShadow: `0 0 .5vw ${hexToRgba(notification.color, 0.8)}`,
                    }}
                ></div>
            </div>
        </div>
    );
};

export default Item;
