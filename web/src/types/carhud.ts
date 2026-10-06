export interface CarElements {
    gear: boolean;
    fuel: boolean;
    nitro: boolean;
    seatbelt: boolean;
    engine: boolean;
    rpm?: boolean;
    engineHealth?: boolean;
    lights?: boolean;
    indicators?: boolean;
    cruise?: boolean;
}

export interface CarStyleProps {
    speed: number;
    gear: number | string;
    engine: boolean;
    seatbelt: boolean;
    keys: boolean;
    nitro: number;
    fuelMin: number;
    fuelMax: number;
    fuelType: "gas" | "electric";
    rpm?: number;
    engineHealth?: number;
    lights?: boolean;
    highbeam?: boolean;
    indicators?: number;
    cruise?: boolean;
    elements?: CarElements;
}
