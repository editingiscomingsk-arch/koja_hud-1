import React from "react";
import { useSettings } from '../../../providers/settingsProvider';
import './CarHud.scss';
import Style1 from './styles/style-1/Style-1';
import Style2 from './styles/style-2/Style-2';
import Style3 from './styles/style-3/Style-3';
import Style4 from './styles/style-4/Style-4';
import Style5 from './styles/style-5/Style-5';
import { Car } from '../../../types/data';
import { CarElements, CarStyleProps } from '../../../types/carhud';
interface CarHudProps {
    style: string;
    editMode?: boolean;
    data: Car | undefined;
}
const SAMPLE_CAR: Car = {
    speed: 33, gear: 3, engine: true, seatbelt: true, keys: true, nitro: 55,
    fuel: { type: "gas", min: 60, max: 100 },
    rpm: 0.55, engineHealth: 82, lights: true, highbeam: false, indicators: 1, cruise: true,
};
const CarHud: React.FC<CarHudProps> = ({ style, data, editMode }) => {
    const { settings } = useSettings();
    const speedometerVisibility = settings.carhud.visibility;
    const metertype = settings.carhud.metertype;
    const el: Partial<Record<keyof CarElements, boolean>> = settings.carhud.elements ?? {};
    const elements: CarElements = {
        gear: el.gear !== false,
        fuel: el.fuel !== false,
        nitro: el.nitro !== false,
        seatbelt: el.seatbelt !== false,
        engine: el.engine !== false,
        rpm: el.rpm === true,
        engineHealth: el.engineHealth === true,
        lights: el.lights === true,
        indicators: el.indicators === true,
        cruise: el.cruise === true,
    };
    const car = data ?? (editMode ? SAMPLE_CAR : undefined);
    if (!car)
        return null;
    const renderCarHud = () => {
        const props: CarStyleProps = {
            speed: Math.floor(metertype === 'kmh' ? car.speed * 3.6 : car.speed * 2.236936),
            gear: car.gear,
            engine: car.engine,
            seatbelt: car.seatbelt,
            keys: car.keys,
            nitro: car.nitro,
            fuelMin: Math.round(car.fuel.min),
            fuelMax: car.fuel.max,
            fuelType: car.fuel.type === 'electric' ? 'electric' : 'gas',
            rpm: car.rpm ?? 0,
            engineHealth: car.engineHealth ?? 100,
            lights: car.lights ?? false,
            highbeam: car.highbeam ?? false,
            indicators: car.indicators ?? 0,
            cruise: car.cruise ?? false,
            elements,
        };
        switch (style) {
            case 'default':
                return <Style1 {...props}/>;
            case 'compact':
                return <Style2 {...props}/>;
            case 'gauge':
                return <Style3 {...props}/>;
            case 'minimal':
                return <Style4 {...props}/>;
            case 'pvp':
                return <Style5 {...props}/>;
            default:
                return <Style1 {...props}/>;
        }
    };
    if (!speedometerVisibility && !editMode)
        return null;
    return (<div className='carhud fade-in-faster'>
                {renderCarHud()}
            </div>);
};
export default CarHud;
