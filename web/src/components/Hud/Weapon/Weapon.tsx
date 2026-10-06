import React from "react";
import './Weapon.scss';
import { useSettings } from '../../../providers/settingsProvider';
interface WeaponData {
    active: boolean;
    name: string;
    ammo: number;
    total: number;
}
interface WeaponProps {
    data?: WeaponData;
    editMode?: boolean;
}
const SAMPLE_WEAPON: WeaponData = { active: true, name: "Pistol", ammo: 12, total: 36 };
const Weapon: React.FC<WeaponProps> = ({ data, editMode }) => {
    const { settings, getDefaultSettings } = useSettings();
    const defaultSettings = getDefaultSettings();
    const visibility = settings?.weapon?.visibility ?? defaultSettings?.weapon?.visibility ?? false;
    if (editMode)
        data = SAMPLE_WEAPON;
    else if (!visibility || !data?.active || !data?.name)
        return null;
    return (<div className="weapon fade-in-faster">
            <div className="icon">
                <i className="fa-solid fa-gun"></i>
            </div>
            <div className="details">
                <div className="name">{data.name}</div>
                <div className="ammo">
                    <span className="clip">{data.ammo}</span>
                    <span className="slash">/</span>
                    <span className="total">{data.total}</span>
                </div>
            </div>
        </div>);
};
export default Weapon;
