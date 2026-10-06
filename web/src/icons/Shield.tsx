import React, { useId } from "react";

interface ShieldProps {
    fillPercentage: number;
    color: string;
}

const Shield: React.FC<ShieldProps> = ({ fillPercentage = 50, color }) => {
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
        <path
            d="M11.884 2.007l.114 -.007l.118 .007l.059 .008l.061 .013l.111 .034a.993 .993 0 0 1 .217 .112l.104 .082l.255 .218a11 11 0 0 0 7.189 2.537l.342 -.01a1 1 0 0 1 1.005 .717a13 13 0 0 1 -9.208 16.25a1 1 0 0 1 -.502 0a13 13 0 0 1 -9.209 -16.25a1 1 0 0 1 1.005 -.717a11 11 0 0 0 7.531 -2.527l.263 -.225l.096 -.075a.993 .993 0 0 1 .217 -.112l.112 -.034a.97 .97 0 0 1 .119 -.021z"
            fill={`url(#${gradientId})`}
            stroke={color}
            strokeWidth=".8"
        />
        </svg>
    );
};

export default Shield;
