import React, { useId } from "react";

interface VoiceProps {
    fillPercentage: number;
    color: string;
    isTalking?: boolean;
}

const Voice: React.FC<VoiceProps> = ({ fillPercentage, color }) => {
    const gradientId = useId();
    const gradientOffset = `${fillPercentage}%`;

    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill={color} viewBox="0 0 24 24">
            <defs>
                <linearGradient id={gradientId} x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset={gradientOffset} style={{ stopColor: color, stopOpacity: 0.7 }} />
                    <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.2 }} />
                </linearGradient>
            </defs>
            <path stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9v3a5.006 5.006 0 0 1-5 5h-4a5.006 5.006 0 0 1-5-5V9m7 9v3m-3 0h6M11 3h2a3 3 0 0 1 3 3v5a3 3 0 0 1-3 3h-2a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3Z" fill={`url(#${gradientId})`} />
        </svg>
    );
};

export default Voice;
