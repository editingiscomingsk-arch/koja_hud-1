import React from "react";
import Heart from '../../../../../icons/Heart';
import Shield from '../../../../../icons/Shield';
import Food from '../../../../../icons/Food';
import Water from '../../../../../icons/Water';
import Stamina from '../../../../../icons/Stamina';
import Oxygen from '../../../../../icons/Oxygen';
import Voice from '../../../../../icons/Voice';
import Stress from '../../../../../icons/stress';

interface ItemProps {
    status: number;
    radius: number;
    type: string;
    color: string;
    isTalking?: boolean;
}

const hexToRgba = (hex: string, opacity: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const Item: React.FC<ItemProps> = ({ status, type, color, isTalking }) => {

    const getIcon = (type: string) => {
        switch (type) {
            case 'health':
                return <Heart fillPercentage={100} color={color} />;
            case 'shield':
                return <Shield fillPercentage={100} color={color} />;
            case 'food':
                return <Food fillPercentage={100} color={color} />;
            case 'water':
                return <Water fillPercentage={100} color={color} />;
            case 'stamina':
                return <Stamina fillPercentage={100} color={color} />;
            case 'oxygen':
                return <Oxygen fillPercentage={100} color={color} />;
            case 'voice':
                return <Voice fillPercentage={100} color={color} isTalking={isTalking} />;
            case 'stress':
                return <Stress fillPercentage={100} color={color} />;
        }
    };

    return (
        <div
            className="item"
            style={{
                boxShadow: `0 0 0.7vw ${hexToRgba(color, 0.45)}, inset 0 0 0.5vw ${hexToRgba(color, 0.15)}`,
                opacity: type === 'voice' && isTalking !== undefined ? (isTalking ? 0.4 : 1) : 1,
                transform: type === 'voice' && isTalking !== undefined ? (isTalking ? 'scale(0.95)' : 'scale(1)') : 'scale(1)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
        >
            <div
                className="ring"
                style={{
                    background: `conic-gradient(${color} 0% ${status}%, rgba(255, 255, 255, 0.1) ${status}% 100%)`,
                }}
            ></div>
            <div className="icon">{getIcon(type)}</div>
        </div>
    );
};

export default Item;
