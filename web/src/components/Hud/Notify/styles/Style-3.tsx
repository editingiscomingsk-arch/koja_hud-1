import React from "react";
import { NotificationItemProps } from "../types";

const Item: React.FC<NotificationItemProps> = ({ notification }) => {
    const elapsed = Date.now() - notification.createdAt;
    const remainingTime = Math.max(notification.time - elapsed, 0);

    return (
        <div className={`notify ${remainingTime <= 700 ? 'fade-out' : 'fade-in-faster'}`}>
            <div className="title" style={{ background: notification.color }}>
                <i className={`${notification.icon}`}></i>
                {notification.title}
            </div>
            <div className="desc">
                <div className="wrapper" dangerouslySetInnerHTML={{ __html: notification.desc }}></div>
            </div>
        </div>
    );
};

export default Item;
