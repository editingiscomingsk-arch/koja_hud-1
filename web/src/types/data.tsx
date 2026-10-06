import React, { createContext, useContext, useState, ReactNode } from 'react';
interface Status {
    id: string;
    status: number;
}
export interface Car {
    speed: number;
    gear: number | string;
    engine: boolean;
    seatbelt: boolean;
    keys: boolean;
    nitro: number;
    fuel: {
        type: string;
        min: number;
        max: number;
    };
    rpm?: number;
    engineHealth?: number;
    lights?: boolean;
    highbeam?: boolean;
    indicators?: number;
    cruise?: boolean;
}
interface Informations {
    cash: number;
    bank: number;
    job: string;
    id: number;
}
interface Gps {
    streetname: string;
    crossingroad: string;
}
interface Compass {
    heading: number;
}
interface Weapon {
    active: boolean;
    name: string;
    ammo: number;
    total: number;
}
interface Watermark {
    text: string;
}
export interface HudData {
    status: Status[];
    car: Car;
    informations: Informations;
    gps: Gps;
    compass: Compass;
    weapon: Weapon;
    watermark: Watermark;
}
const defaultHudData: HudData = {
    status: [
        { id: "health", status: 0 },
        { id: "shield", status: 0 },
        { id: "food", status: 0 },
        { id: "water", status: 0 },
        { id: "stamina", status: 100 },
        { id: "oxygen", status: 100 },
        { id: "voice", status: 100 },
        { id: "stress", status: 0 }
    ],
    car: {
        speed: 0,
        gear: 0,
        engine: false,
        seatbelt: false,
        keys: false,
        nitro: 0,
        fuel: { type: "gas", min: 0, max: 0 },
        rpm: 0,
        engineHealth: 100,
        lights: false,
        highbeam: false,
        indicators: 0,
        cruise: false,
    },
    informations: {
        cash: 0,
        bank: 0,
        job: "Unemployed",
        id: 0
    },
    gps: {
        streetname: "Street",
        crossingroad: "Road"
    },
    compass: {
        heading: 0
    },
    weapon: {
        active: false,
        name: "",
        ammo: 0,
        total: 0
    },
    watermark: {
        text: ""
    }
};
const HudDataContext = createContext<{
    HudData: HudData;
    setHudData: React.Dispatch<React.SetStateAction<HudData>>;
} | null>(null);
export const HudDataProvider: React.FC<{
    children: ReactNode;
}> = ({ children }) => {
    const [HudData, setHudData] = useState(defaultHudData);
    return (<HudDataContext.Provider value={{ HudData, setHudData }}>
            {children}
        </HudDataContext.Provider>);
};
export const useHudData = () => {
    const context = useContext(HudDataContext);
    if (!context) {
        throw new Error("useHudData must be used within a HudDataProvider");
    }
    return context;
};
const mergeHudData = (prevData: HudData, newData: Partial<HudData>): HudData => {
    const mergedStatus = prevData.status.map(item => {
        const newItem = newData.status?.find(({ id }) => id === item.id);
        return newItem ? { ...item, status: newItem.status } : item;
    });
    const mergedCar = {
        ...prevData.car,
        ...newData.car
    };
    const mergedInformations = {
        ...prevData.informations,
        ...newData.informations
    };
    const mergedGps = {
        ...prevData.gps,
        ...newData.gps
    };
    const mergedCompass = {
        ...prevData.compass,
        ...newData.compass
    };
    const mergedWeapon = {
        ...prevData.weapon,
        ...newData.weapon
    };
    const mergedWatermark = {
        ...prevData.watermark,
        ...newData.watermark
    };
    return {
        status: mergedStatus,
        car: mergedCar,
        informations: mergedInformations,
        gps: mergedGps,
        compass: mergedCompass,
        weapon: mergedWeapon,
        watermark: mergedWatermark
    };
};
export const useHudDataUpdate = () => {
    const { setHudData } = useHudData();
    const updateHudData = (newData: Partial<HudData>) => {
        setHudData(prevData => mergeHudData(prevData, newData));
    };
    return updateHudData;
};
