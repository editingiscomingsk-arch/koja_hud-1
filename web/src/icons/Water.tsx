import React, { useId } from "react";

interface WaterProps {
    fillPercentage: number;
    color: string;
}

const Water: React.FC<WaterProps> = ({ fillPercentage = 50, color }) => {
    const gradientId = useId();
    const gradientOffset = `${fillPercentage}%`;

    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <defs>
            <linearGradient id={gradientId} x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset={gradientOffset} style={{ stopColor: color, stopOpacity: 0.7 }} />
            <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.2 }} />
            </linearGradient>
        </defs>
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M10.708 2.372a2.382 2.382 0 0 0 -.71 .686l-4.892 7.26c-1.981 3.314 -1.22 7.466 1.767 9.882c2.969 2.402 7.286 2.402 10.254 0c2.987 -2.416 3.748 -6.569 1.795 -9.836l-4.919 -7.306c-.722 -1.075 -2.192 -1.376 -3.295 -.686z" fill={`url(#${gradientId})`} stroke={color} strokeWidth=".8"/>
        </svg>
    );
};

export default Water;
