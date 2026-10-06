import React, { useId } from "react";
interface StressProps {
    fillPercentage: number;
    color: string;
}
const Stress: React.FC<StressProps> = ({ fillPercentage, color }) => {
    const gradientId = useId();
    const maskId = useId();
    const gradientOffset = `${fillPercentage}%`;
    return (<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none">
            <defs>
                <linearGradient id={gradientId} x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stopColor={color} stopOpacity="0.1"/>
                    <stop offset={gradientOffset} stopColor={color} stopOpacity="0.8"/>
                    <stop offset="100%" stopColor={color} stopOpacity="0.9"/>
                </linearGradient>
                <mask id={maskId}>
                    <rect width="24" height="24" fill="white"/>
                    <rect width="24" height={`${24 - (fillPercentage / 100) * 24}`} fill="black"/>
                </mask>
            </defs>
            
            
            <g stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.3" fill="none">
                <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/>
                <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/>
                <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/>
                <path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/>
                <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/>
                <path d="M3.477 10.896a4 4 0 0 1 .585-.396"/>
                <path d="M19.938 10.5a4 4 0 0 1 .585.396"/>
                <path d="M6 18a4 4 0 0 1-1.967-.516"/>
                <path d="M19.967 17.484A4 4 0 0 1 18 18"/>
            </g>
            
            
            <g mask={`url(#${maskId})`} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill={`url(#${gradientId})`}>
                <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/>
                <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/>
                <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/>
                <path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/>
                <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/>
                <path d="M3.477 10.896a4 4 0 0 1 .585-.396"/>
                <path d="M19.938 10.5a4 4 0 0 1 .585.396"/>
                <path d="M6 18a4 4 0 0 1-1.967-.516"/>
                <path d="M19.967 17.484A4 4 0 0 1 18 18"/>
            </g>
        </svg>);
};
export default Stress;
