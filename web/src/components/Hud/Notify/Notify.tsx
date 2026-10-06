import React, { useState, useEffect } from "react";
import './Notify.scss';
import { useNuiEvent } from "../../../hooks/useNuiEvent";
import { useSettings } from '../../../providers/settingsProvider';
import Status1 from './styles/Style-1';
import Status2 from './styles/Style-2';
import Status3 from './styles/Style-3';
import { Notification } from './types';
import { sanitizeHtml } from '../../../utils/sanitizeHtml';
interface NotifyProps {
    style: string;
}
let nextNotificationId = 0;
const generateId = () => `notify-${++nextNotificationId}`;
const Notify: React.FC<NotifyProps> = ({ style }) => {
    const { settings, editMode } = useSettings();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    useNuiEvent<Notification>("koja_hud:sendNotify", (data) => {
        addNotification(data);
    });
    const addNotification = (data: Notification) => {
        const color = getColorByType(data.type, data.color);
        const icon = getIconByType(data.type, data.icon);
        setNotifications(prev => {
            const newNotifications = [{
                    id: generateId(),
                    type: data.type,
                    icon: icon,
                    color: color,
                    title: String(data.title ?? ""),
                    desc: sanitizeHtml(String(data.desc ?? "")),
                    time: data.time || 3000,
                    createdAt: Date.now()
                }, ...prev];
            if (newNotifications.length > 6)
                newNotifications.pop();
            return newNotifications;
        });
    };
    const getColorByType = (type: string, defaultColor: string) => {
        switch (type) {
            case "success": return "#7cf14e";
            case "error": return "#ff0000";
            default: return defaultColor;
        }
    };
    const getIconByType = (type: string, defaultIcon: string) => {
        switch (type) {
            case "success": return "fa-solid fa-check";
            case "error": return "fa-solid fa-exclamation";
            default: return defaultIcon;
        }
    };
    useEffect(() => {
        const interval = setInterval(() => {
            setNotifications(prev => prev.filter(n => Date.now() - n.createdAt < n.time));
        }, 100);
        return () => clearInterval(interval);
    }, []);
    const renderStatus = () => {
        switch (style) {
            case "default":
                return Status1;
            case "minimalistic":
                return Status2;
            case "modern":
                return Status3;
            default:
                return null;
        }
    };
    const StatusComponent = renderStatus();
    const position = settings.notify.position;
    const notifyVisibility = settings.notify.visibility;
    const previewNotification: Notification = {
        id: 'preview',
        type: 'info',
        icon: 'fa-solid fa-bell',
        color: '#35c76c',
        title: 'Notification',
        desc: 'Preview notification',
        time: 999999,
        createdAt: Date.now(),
    };
    const list = editMode && notifications.length === 0 ? [previewNotification] : notifications;
    return (<>
            {(notifyVisibility || editMode) && <div className={`notify-screen ${style} ${position}`}>
                    {list.map(notification => {
                return StatusComponent ? (<StatusComponent key={notification.id} notification={notification}/>) : null;
            })}
                </div>}
        </>);
};
export default Notify;
