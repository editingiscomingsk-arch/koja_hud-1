import React, { useId } from "react";

interface OxygenProps {
    fillPercentage: number;
    color: string;
}

const Oxygen: React.FC<OxygenProps> = ({ fillPercentage = 50, color }) => {
    const gradientId = useId();
    const gradientOffset = `${fillPercentage}%`;

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <defs>
                <linearGradient id={gradientId} x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset={gradientOffset} style={{ stopColor: color, stopOpacity: 0.7 }} />
                    <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.2 }} />
                </linearGradient>
            </defs>
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path
                d="M6 16m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"
                fill={`url(#${gradientId})`}
                stroke={color}
            />
            <path
                d="M16 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"
                fill={`url(#${gradientId})`}
                stroke={color}
            />
            <path
                d="M14.5 7.5m-4.5 0a4.5 4.5 0 1 0 9 0a4.5 4.5 0 1 0 -9 0"
                fill={`url(#${gradientId})`}
                stroke={color}
            />
        </svg>
    );
};

export default Oxygen;
