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

const Item: React.FC<ItemProps> = ({ status, type, radius, color, isTalking }) => {

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
                borderRadius: `${radius}vw`,
                opacity: type === 'voice' && isTalking !== undefined ? (isTalking ? 0.4 : 1) : 1,
                transform: type === 'voice' && isTalking !== undefined ? (isTalking ? 'scale(0.95)' : 'scale(1)') : 'scale(1)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
        >
            <div
                className="ring"
                style={{
                    borderRadius: `${radius}vw`,
                    background: `conic-gradient(${color} 0% ${status}%, rgba(255, 255, 255, 0.13) ${status}% 100%)`,
                }}
            ></div>
            <div className="icon">{getIcon(type)}</div>
        </div>
    );
};

export default Item;
