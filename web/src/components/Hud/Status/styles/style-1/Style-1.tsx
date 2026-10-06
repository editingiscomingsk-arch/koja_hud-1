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
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
        r = parseInt(hex[1] + hex[2], 16);
        g = parseInt(hex[3] + hex[4], 16);
        b = parseInt(hex[5] + hex[6], 16);
    }
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

const Item: React.FC<ItemProps> = ({ status, type, radius, color, isTalking }) => {

    const getIcon = (type: string, status: number) => {
        switch (type) {
            case 'health':
                return <Heart fillPercentage={status} color={color} />;
            case 'shield':
                return <Shield fillPercentage={status} color={color} />;
            case 'food':
                return <Food fillPercentage={status} color={color} />;
            case 'water':
                return <Water fillPercentage={status} color={color} />;
            case 'stamina':
                return <Stamina fillPercentage={status} color={color} />;
            case 'oxygen':
                return <Oxygen fillPercentage={status} color={color} />;
            case 'voice':
                return <Voice fillPercentage={status} color={color} isTalking={isTalking} />;
            case 'stress':
                return <Stress fillPercentage={status} color={color} />;
        }
    };

    return (
        <div
            className="item"
            style={{
                backgroundColor: hexToRgba(color, 0.16),
                borderRadius: `${radius}vw`,
                boxShadow: `0 0.2vw 0.7vw rgba(0, 0, 0, 0.4)`,
                opacity: type === 'voice' && isTalking !== undefined ? (isTalking ? 0.4 : 1) : 1,
                transform: type === 'voice' && isTalking !== undefined ? (isTalking ? 'scale(0.95)' : 'scale(1)') : 'scale(1)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                filter: type === 'voice' && isTalking !== undefined ? (isTalking ? 'brightness(0.6)' : 'brightness(1)') : 'brightness(1)'
            }}
        >
            <div className="overlay" style={{ borderRadius: `${radius * 0.88}vw` }}>
                <div
                    className="overlay-inner"
                    style={{
                        borderRadius: `${radius * 0.88}vw`,
                        background: `radial-gradient(120% 95% at 50% 108%, ${hexToRgba(color, 0.22)} 0%, rgba(0, 0, 0, 0) 62%)`,
                    }}
                >
                    {getIcon(type, status)}
                </div>
            </div>
            <div
                className="progress-holder"
                style={{
                    background: `conic-gradient(${color} 0% ${status}%, #00000000 0% 0%)`,
                }}
            />
        </div>
    );
};

export default Item;
