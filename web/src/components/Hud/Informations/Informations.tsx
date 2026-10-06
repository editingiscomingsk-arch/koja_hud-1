import React, { useEffect, useState } from "react";
import './Informations.scss';
import { useSettings } from '../../../providers/settingsProvider';
import { useNuiEvent } from "../../../hooks/useNuiEvent";
import config from "../../../../../editable/shared/js.json";

interface InformationsProps {
    data?: {
        cash?: number;
        bank?: number;
        job?: string;
        id?: number;
    };
    voice?: number;
}

const getTime = () => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
};

const Informations: React.FC<InformationsProps> = ({
    data = { cash: 0, bank: 0, job: "Unemployed", id: 0 },
    voice = 25,
}) => {
    const { settings } = useSettings();
    const [isTalking, setIsTalking] = useState(false);
    const [time, setTime] = useState(getTime());

    useNuiEvent<boolean>("koja_hud:setTalking", (talking: boolean) => {
        setIsTalking(talking);
    });

    useEffect(() => {
        const interval = setInterval(() => setTime(getTime()), 10000);
        return () => clearInterval(interval);
    }, []);

    const visibility = settings.informations.visibility;
    const opacity = settings.informations.opacity;

    const items: Record<string, boolean | undefined> = settings.informations.items;
    const showItem = (item: string): boolean => items[item] ?? true;

    const discord = config.ui.discord;
    const logo = config.ui.logo;
    const voiceLevel = voice <= 25 ? 1 : voice <= 75 ? 2 : 3;

    const formatCurrency = (amount: number) => {
        return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    if (!visibility) return null;

    const showLogo = logo && showItem('logo');
    const showTopRow = showItem('voice') || showItem('id') || showItem('time');
    const showMoneyRow = showItem('cash') || showItem('bank') || showItem('job');
    const showDiscord = discord && showItem('discord');

    if (!showLogo && !showTopRow && !showMoneyRow && !showDiscord) return null;

    return (
        <div className='informations fade-in-faster' style={{ opacity }}>
            {showLogo && (
                <div className="logo-row">
                    <img src={logo} alt="server logo" className="server-logo" />
                </div>
            )}
            {showTopRow && (
                <div className="row">
                    {showItem('voice') && (
                        <div className={`pill mic ${isTalking ? 'talking' : ''}`}>
                            <i className="fa-solid fa-microphone"></i>
                            <div className="bars">
                                {[1, 2, 3].map(level => (
                                    <span key={level} className={level <= voiceLevel ? 'on' : ''}></span>
                                ))}
                            </div>
                        </div>
                    )}
                    {showItem('id') && (
                        <div className="pill">
                            <i className="fa-solid fa-tower-broadcast"></i>
                            <span className="value">{data.id}</span>
                        </div>
                    )}
                    {showItem('time') && (
                        <div className="pill">
                            <i className="fa-solid fa-clock"></i>
                            <span className="value">{time}</span>
                        </div>
                    )}
                </div>
            )}
            {showMoneyRow && (
                <div className="row">
                    {showItem('cash') && (
                        <div className="pill">
                            <i className="fa-solid fa-money-bill"></i>
                            <span className="value">{formatCurrency(data.cash!)}</span>
                        </div>
                    )}
                    {showItem('bank') && (
                        <div className="pill">
                            <i className="fa-solid fa-building-columns"></i>
                            <span className="value">{formatCurrency(data.bank!)}</span>
                        </div>
                    )}
                    {showItem('job') && (
                        <div className="pill">
                            <i className="fa-solid fa-briefcase"></i>
                            <span className="value">{data.job}</span>
                        </div>
                    )}
                </div>
            )}
            {showDiscord && (
                <div className="row">
                    <div className="pill discord">
                        <i className="fa-brands fa-discord"></i>
                        <span className="value">{discord.toUpperCase()}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Informations;
