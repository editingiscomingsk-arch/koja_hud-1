import React, { createContext, useMemo, useState, useEffect } from "react";
import { useNuiEvent } from "../hooks/useNuiEvent";
import { debugData } from "../utils/debugData";
import { fetchNui } from "../utils/fetchNui";
debugData([
    {
        action: "koja_hud:setVisible",
        data: true,
    },
]);
interface VisibilityProviderProps {
    children: React.ReactNode;
}
interface VisibilityContextType {
    visible: boolean;
    setVisible: (visible: boolean) => void;
    toggleVisibility: (type: 'hud' | 'settings', isVisible: boolean) => void;
    isHudVisible: boolean;
    isSettingsVisible: boolean;
}
const VisibilityCtx = createContext<VisibilityContextType>({} as VisibilityContextType);
const VisibilityProvider: React.FC<VisibilityProviderProps> = ({ children }) => {
    const [visible, setVisible] = useState(true);
    const [isHudVisible, setisHudVisible] = useState(false);
    const [isSettingsVisible, setisSettingsVisible] = useState(false);
    const toggleVisibility = (type: 'hud' | 'settings', isVisible: boolean) => {
        if (type === 'hud') {
            setisHudVisible(isVisible);
        }
        else if (type === 'settings') {
            setisSettingsVisible(isVisible);
        }
    };
    useNuiEvent<boolean>("koja_hud:setVisible", setVisible);
    useEffect(() => {
        if (!visible)
            return;
        const keyHandler = (e: KeyboardEvent) => {
            if (["Escape"].includes(e.code)) {
                if (isSettingsVisible) {
                    fetchNui("koja_hud:closeSettings");
                    setisSettingsVisible(false);
                }
            }
        };
        window.addEventListener("keydown", keyHandler);
        return () => window.removeEventListener("keydown", keyHandler);
    }, [visible, isSettingsVisible]);
    const value = useMemo(() => {
        return {
            visible,
            setVisible,
            toggleVisibility,
            isHudVisible,
            isSettingsVisible
        };
    }, [visible, isHudVisible, isSettingsVisible]);
    return (<VisibilityCtx.Provider value={value}>
      <main style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 0.5s ease",
            pointerEvents: visible ? "auto" : "none",
        }}>
        {children}
      </main>
    </VisibilityCtx.Provider>);
};
export { VisibilityProvider, VisibilityCtx };
