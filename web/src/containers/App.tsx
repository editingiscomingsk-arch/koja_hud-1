import React, { useContext, useEffect } from "react";
import { debugData } from "../utils/debugData";
import { useNuiEvent } from "../hooks/useNuiEvent";
import { VisibilityCtx } from '../providers/VisibilityProvider';
import { ServerConfig, useSettings } from '../providers/settingsProvider';
import { HudData, useHudData, useHudDataUpdate } from '../types/data';
import { fetchNui } from '../utils/fetchNui';
import { MinimapRect, setMinimapRect } from '../utils/minimapRect';
import config from '../../../editable/shared/js.json';
import '../index.css';
import './App.scss';
import Hud from "../components/Hud/Hud";
import Settings from "../components/Settings/Settings";
import VehicleMenu from "../components/VehicleMenu/VehicleMenu";
debugData([
    { action: 'koja_hud:openHud', data: true },
], 500);
debugData([
    { action: 'koja_hud:openSettings', data: true },
], 800);
debugData([
    { action: 'koja_hud:setTalking', data: false },
], 1500);
debugData([
    { action: 'koja_hud:showCarHud', data: true },
], 1500);
debugData([
    {
        action: 'koja_hud:startProgressbar', data: {
            icon: "fa-solid fa-exclamation",
            label: "Error",
            time: 30
        }
    },
], 1500);
debugData([
    {
        action: 'koja_hud:refreshHud', data: {
            status: [
                { id: "health", status: 90 },
                { id: "shield", status: 100 },
                { id: "food", status: 30 },
                { id: "water", status: 35 },
                { id: "stamina", status: 1 },
                { id: "oxygen", status: 0 },
                { id: "voice", status: 25 },
                { id: "stress", status: 70 }
            ],
            car: {
                speed: 54,
                gear: 2,
                engine: true,
                seatbelt: true,
                keys: true,
                nitro: 55,
                fuel: {
                    type: "gas",
                    min: 15,
                    max: 100
                }
            },
            informations: {
                cash: 122222553000,
                bank: 55555,
                job: "Police",
                id: 5255
            },
            watermark: {
                text: "HEXEL RP"
            }
        }
    },
], 1500);
debugData([
    {
        action: 'koja_hud:sendNotify', data: {
            icon: "fa-solid fa-exclamation",
            color: "#ff0000",
            title: "Error",
            desc: "Something failed.",
            time: 98500
        }
    },
], 1800);
debugData([
    {
        action: 'koja_hud:sendNotify', data: {
            icon: "fa-solid fa-check",
            color: "#7cf14e",
            title: "Success",
            desc: "You earned <strong><span style='color: #7cf14e'>$5,463</span></strong> for finished work.",
            time: 8500
        }
    },
], 1800);
debugData([
    {
        action: 'koja_hud:startTextui', data: {
            type: "press",
            input: "e",
            desc: "Press 'E' to open the menu"
        }
    },
], 1800);
debugData([
    {
        action: 'koja_hud:refreshHud', data: {
            compass: { heading: 45 },
            weapon: { active: true, name: "Assault Rifle Mk II", ammo: 69, total: 210 }
        }
    },
], 1500);
debugData([
    { action: 'koja_hud:killfeed', data: { killer: "You", victim: "John_Doe", weapon: "fa-solid fa-gun", distance: 48 } },
], 2200);
debugData([
    { action: 'koja_hud:killfeed', data: { killer: "Mike_R", victim: "Alex_92", weapon: "fa-solid fa-crosshairs", distance: 122 } },
], 2600);
debugData([
    { action: 'koja_hud:statuseffects', data: [
            { id: "sprint", icon: "fa-solid fa-person-running", color: "#8dd82b" },
            { id: "drunk", icon: "fa-solid fa-wine-bottle", color: "#c77dff", duration: 28 },
            { id: "cold", icon: "fa-solid fa-snowflake", color: "#6ab7ff", duration: 14 },
        ] },
], 1600);
const App: React.FC = () => {
    const { toggleVisibility, isHudVisible, isSettingsVisible } = useContext(VisibilityCtx);
    const { applyServerConfig } = useSettings();
    const { HudData } = useHudData();
    const updateHudData = useHudDataUpdate();
    useEffect(() => {
        const syncWithGame = async () => {
            const serverConfig = await fetchNui<Partial<ServerConfig> | null>('koja_hud:getConfig').catch(() => null);
            const settings = applyServerConfig(serverConfig ?? {});
            fetchNui('koja_hud:updateCustomBinds', { binds: settings.customBinds ?? [] });
            const builtinBinds = settings.builtinBinds ?? config.ui.activeBinds.map(({ id, key, command }) => ({ id, key, command }));
            fetchNui('koja_hud:updateBuiltinBinds', { binds: builtinBinds });
            const minimap = settings.layout.minimap;
            const mmX = minimap?.x ?? 0;
            const mmY = minimap?.y ?? 0;
            const mmScale = minimap?.scale ?? 1;
            if (mmX !== 0 || mmY !== 0 || mmScale !== 1) {
                fetchNui('koja_hud:updateMinimap', { x: mmX, y: mmY, scale: mmScale });
            }
            fetchNui('koja_hud:updateMinimapVisibility', { mode: settings.minimap.visibility });
            fetchNui('koja_hud:updateKillfeed', {
                enabled: settings.killfeed.enabled,
                anyDistance: settings.killfeed.anyDistance,
                distance: settings.killfeed.distance,
            });
        };
        syncWithGame();
    }, [applyServerConfig]);
    useNuiEvent<boolean>("koja_hud:openHud", data => toggleVisibility('hud', data === true));
    useNuiEvent<Partial<HudData>>("koja_hud:refreshHud", updateHudData);
    useNuiEvent("koja_hud:openSettings", () => {
        toggleVisibility('settings', true);
    });
    useNuiEvent<Partial<MinimapRect>>("koja_hud:minimapRect", setMinimapRect);
    return (<div className='app'>
            {isHudVisible && <Hud data={HudData}/>}
            {isSettingsVisible && <Settings />}
            <VehicleMenu />
        </div>);
};
export default App;
