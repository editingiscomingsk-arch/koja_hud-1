import React from "react";
import { NotificationItemProps } from "../types";

const Item: React.FC<NotificationItemProps> = ({ notification }) => {
    const elapsed = Date.now() - notification.createdAt;
    const remainingTime = Math.max(notification.time - elapsed, 0);

    return (
        <div className={`notify ${remainingTime <= 700 ? 'fade-out' : 'fade-in-faster'}`}>
            <div className="top">
                <i className={`${notification.icon}`} style={{ color: notification.color }}></i>
                <div className="title" style={{ color: notification.color }}>
                    {notification.title}
                </div>
            </div>
            <div className="bottom">
                <div className="desc" dangerouslySetInnerHTML={{ __html: notification.desc }}></div>
            </div>
        </div>
    );
};

export default Item;
