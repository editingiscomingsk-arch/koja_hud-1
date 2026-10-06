import React, { useState } from "react";
import './Hud.scss';
import Status from './Status/Status';
import CarHud from './CarHud/CarHud';
import Progressbar from './Progressbar/Progressbar';
import Notify from './Notify/Notify';
import Textui from './Textui/textui';
import Informations from './Informations/Informations';
import Keybinds from './Keybinds/Keybinds';
import Compass from './Compass/Compass';
import Weapon from './Weapon/Weapon';
import Watermark from './Watermark/Watermark';
import Killfeed from './Killfeed/Killfeed';
import Warnings from './Warnings/Warnings';
import StatusEffects from './StatusEffects/StatusEffects';
import { useSettings } from '../../providers/settingsProvider';
import { useNuiEvent } from "../../hooks/useNuiEvent";
import { HudData } from '../../types/data';
interface HudProps {
    data: HudData | null;
}
interface HideComponents {
    status: boolean;
    carhud: boolean;
    progressbar: boolean;
    notify: boolean;
    textui: boolean;
    informations: boolean;
}
interface OffsetProps {
    id: string;
    children: React.ReactNode;
}
const Offset: React.FC<OffsetProps> = ({ id, children }) => {
    const { settings } = useSettings();
    const offset = settings?.layout?.[id];
    const hasOffset = offset && (offset.x !== 0 || offset.y !== 0);
    return (<div className="hud-offset" style={hasOffset ? { transform: `translate(${offset.x}vw, ${offset.y}vh)` } : undefined}>
            {children}
        </div>);
};
const Hud: React.FC<HudProps> = ({ data }) => {
    const { settings, getDefaultSettings, editMode } = useSettings();
    const defaultSettings = getDefaultSettings();
    const [showCarHud, setShowCarHud] = useState<boolean>(false);
    const [isHudVisible, setIsHudVisible] = useState<boolean>(true);
    const [isPauseHidden, setIsPauseHidden] = useState<boolean>(false);
    const [hideComponents, setHideComponents] = useState<HideComponents>({
        status: false,
        carhud: false,
        progressbar: false,
        notify: false,
        textui: false,
        informations: false
    });
    useNuiEvent('koja_hud:showCarHud', (data: boolean) => {
        setShowCarHud(data);
    });
    useNuiEvent('koja_hud:hideComponents', (data: HideComponents) => {
        setHideComponents(data);
    });
    useNuiEvent('koja_hud:toggleHud', (visible: boolean) => {
        setIsHudVisible(visible);
    });
    useNuiEvent('koja_hud:pauseHud', (paused: boolean) => {
        setIsPauseHidden(paused);
    });
    const hudVisibility = settings?.hud?.visibility ?? defaultSettings?.hud?.visibility;
    const statusVisibility = settings?.status?.visibility ?? defaultSettings?.status?.visibility;
    const notifyStyle = settings?.notify?.style ?? defaultSettings?.notify?.style;
    const pvpMode = settings?.pvp?.enabled ?? defaultSettings?.pvp?.enabled ?? false;
    const statusStyle = settings?.status?.style || defaultSettings?.status?.style;
    const carhudStyle = pvpMode ? "pvp" : settings?.carhud?.style;
    const shouldShowStatus = statusVisibility && !hideComponents.status && !pvpMode;
    const shouldShowCarHud = (showCarHud || editMode) && !hideComponents.carhud;
    const shouldShowProgressbar = !hideComponents.progressbar;
    const shouldShowNotify = !hideComponents.notify;
    const shouldShowTextui = !hideComponents.textui;
    const shouldShowInformations = !hideComponents.informations && !pvpMode;
    const shouldShowKeybinds = !pvpMode;
    const shouldShowCompass = !pvpMode;
    const shouldShowWeapon = !pvpMode || editMode;
    const killfeedEnabled = settings?.killfeed?.enabled ?? defaultSettings?.killfeed?.enabled ?? false;
    const shouldShowKillfeed = killfeedEnabled || pvpMode;
    const voiceStatus = data?.status?.find((item) => item.id === 'voice')?.status;
    const compassHeading = data?.compass?.heading ?? 0;
    const healthValue = data?.status?.find((item) => item.id === 'health')?.status ?? 100;
    const fuelMax = data?.car?.fuel?.max ?? 0;
    const fuelPct = fuelMax > 0 ? Math.max(0, Math.min(100, ((data?.car?.fuel?.min ?? 0) / fuelMax) * 100)) : 100;
    return (<>
            {isHudVisible && hudVisibility && !isPauseHidden && (<div className='hud fade-in-faster'>
                    <Offset id="watermark"><Watermark text={data?.watermark?.text ?? ""} status={data?.status} pvp={pvpMode}/></Offset>
                    <Offset id="killfeed"><Killfeed enabled={shouldShowKillfeed}/></Offset>
                    {shouldShowStatus && <Offset id="status"><Status style={statusStyle} data={data?.status}/></Offset>}
                    {shouldShowCarHud && <Offset id="carhud"><CarHud style={carhudStyle} data={data?.car} editMode={editMode}/></Offset>}
                    {shouldShowProgressbar && <Offset id="progressbar"><Progressbar /></Offset>}
                    {shouldShowTextui && <Offset id="textui"><Textui /></Offset>}
                    {shouldShowInformations && <Offset id="informations"><Informations data={data?.informations} voice={voiceStatus}/></Offset>}
                    {shouldShowKeybinds && <Offset id="keybinds"><Keybinds /></Offset>}
                    {shouldShowCompass && <Offset id="compass"><Compass heading={compassHeading} inVehicle={showCarHud}/></Offset>}
                    {shouldShowWeapon && <Offset id="weapon"><Weapon data={data?.weapon} editMode={editMode}/></Offset>}
                    {shouldShowNotify && <Offset id="notify"><Notify style={notifyStyle}/></Offset>}
                    <Warnings health={healthValue} inVehicle={showCarHud} fuel={fuelPct} editMode={editMode}/>
                    <Offset id="statuseffects"><StatusEffects editMode={editMode}/></Offset>
                </div>)}
        </>);
};
export default Hud;
