import React, { createContext, useContext, useState, useCallback } from "react";
import config from "../../../editable/shared/js.json";
import { deepMerge, setNestedValue } from "../utils/nested";

export interface CustomBind {
    key: string;
    command: string;
}

export interface BuiltinBindSetting extends CustomBind {
    id: string;
}

export interface LayoutOffset {
    x: number;
    y: number;
    scale?: number;
}

type DefaultSettings = typeof config.default_settings;

export type StoredSettings = Omit<DefaultSettings, "customBinds" | "builtinBinds" | "layout"> & {
    customBinds: CustomBind[];
    builtinBinds?: BuiltinBindSetting[];
    layout: Record<string, LayoutOffset | undefined>;
};

export interface ServerFeatures {
    compass: boolean;
    watermark: boolean;
}

export interface ServerConfig {
    defaults: Partial<Record<keyof StoredSettings, unknown>>;
    features: ServerFeatures;
    bindKeys: string[];
}

interface SettingsContextProps {
    settings: StoredSettings;
    serverConfig: ServerConfig;
    updateSetting: (id: string, value: unknown) => void;
    resetSettings: () => void;
    refreshSettings: () => void;
    applyServerConfig: (serverConfig: Partial<ServerConfig>) => StoredSettings;
    getDefaultSettings: () => StoredSettings;
    editMode: boolean;
    setEditMode: (value: boolean) => void;
}

const STORAGE_KEY = "settings";

const DEFAULT_SERVER_CONFIG: ServerConfig = {
    defaults: {},
    features: { compass: true, watermark: true },
    bindKeys: [],
};

let serverDefaults: ServerConfig["defaults"] = {};
let cachedDefaults: StoredSettings | null = null;

const SettingsContext = createContext<SettingsContextProps | undefined>(undefined);

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error("useSettings must be used within a SettingsProvider");
    }
    return context;
};

const readStoredSettings = (): Record<string, unknown> => {
    try {
        const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
        return typeof parsed === "object" && parsed !== null ? parsed : {};
    }
    catch {
        return {};
    }
};

const writeStoredSettings = (settings: Record<string, unknown>) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
};

export const getDefaultSettings = (): StoredSettings => {
    if (!cachedDefaults) {
        cachedDefaults = deepMerge(config.default_settings as unknown as StoredSettings, serverDefaults);
    }
    return cachedDefaults;
};

export const setSetting = (id: string, value: unknown) => {
    const stored = readStoredSettings();
    setNestedValue(stored, id, value);
    writeStoredSettings(stored);
};

const migrateStoredSettings = (stored: Record<string, unknown>): boolean => {
    let dirty = false;
    const layout = stored.layout as Record<string, Record<string, unknown> | undefined> | undefined;
    const minimapLayout = layout?.minimap;
    if (layout && minimapLayout && (minimapLayout.width !== undefined || minimapLayout.height !== undefined || minimapLayout.scale === undefined)) {
        layout.minimap = { x: 0, y: 0, scale: 1 };
        dirty = true;
    }
    const minimap = stored.minimap as Record<string, unknown> | undefined;
    if (minimap !== undefined && (typeof minimap !== "object" || minimap === null || minimap.visibility === undefined)) {
        delete stored.minimap;
        dirty = true;
    }
    const compass = stored.compass as Record<string, unknown> | undefined;
    if (compass && typeof compass.visibility === "boolean") {
        compass.visibility = compass.visibility ? "always" : "never";
        dirty = true;
    }
    return dirty;
};

export const getSettings = (): StoredSettings => {
    const stored = readStoredSettings();
    if (migrateStoredSettings(stored)) {
        writeStoredSettings(stored);
    }
    return deepMerge(getDefaultSettings(), stored);
};

export const SettingsProvider: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    const [settings, setSettings] = useState<StoredSettings>(getSettings);
    const [serverConfig, setServerConfig] = useState<ServerConfig>(DEFAULT_SERVER_CONFIG);
    const [editMode, setEditMode] = useState<boolean>(false);

    const refreshSettings = useCallback(() => {
        setSettings(getSettings());
    }, []);

    const updateSetting = useCallback((id: string, value: unknown) => {
        setSetting(id, value);
        refreshSettings();
    }, [refreshSettings]);

    const resetSettings = useCallback(() => {
        localStorage.removeItem(STORAGE_KEY);
        refreshSettings();
    }, [refreshSettings]);

    const applyServerConfig = useCallback((incoming: Partial<ServerConfig>) => {
        serverDefaults = incoming.defaults ?? {};
        cachedDefaults = null;
        setServerConfig({
            defaults: serverDefaults,
            features: { ...DEFAULT_SERVER_CONFIG.features, ...incoming.features },
            bindKeys: Array.isArray(incoming.bindKeys) ? incoming.bindKeys : [],
        });
        const merged = getSettings();
        setSettings(merged);
        return merged;
    }, []);

    return (<SettingsContext.Provider value={{ settings, serverConfig, updateSetting, resetSettings, refreshSettings, applyServerConfig, getDefaultSettings, editMode, setEditMode }}>
      {children}
    </SettingsContext.Provider>);
};
