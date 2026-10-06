export interface Notification {
    id: string;
    type: string;
    icon: string;
    color: string;
    title: string;
    desc: string;
    time: number;
    createdAt: number;
}

export interface NotificationItemProps {
    notification: Notification;
}
