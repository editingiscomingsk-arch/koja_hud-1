import React, { useId } from "react";

interface StaminaProps {
    fillPercentage: number;
    color: string;
}

const Stamina: React.FC<StaminaProps> = ({ fillPercentage = 50, color }) => {
    const gradientId = useId();
    const gradientOffset = `${fillPercentage}%`;

    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="size-6">
            <defs>
                <linearGradient id={gradientId} x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset={gradientOffset} style={{ stopColor: color, stopOpacity: 0.7 }} />
                    <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.2 }} />
                </linearGradient>
            </defs>
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M13 3l0 7l6 0l-8 11l0 -7l-6 0l8 -11" fill={`url(#${gradientId})`} stroke={color} strokeWidth=".8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );
};

export default Stamina;
