import React, { useState, useContext, useEffect, useMemo, useRef, useCallback } from "react";
import "./Settings.scss";
import Switch from "./components/Switch";
import Dropdown from "./components/select";
import StyleCards from "./components/styleCards";
import Color from "./components/color";
import Slider from "./components/slider";
import Percent from "./components/percent";
import Toggles from "./components/toggles";
import LayoutEditor from "./LayoutEditor";
import CustomBinds from "./components/customBinds";
import { useSettings } from "../../providers/settingsProvider";
import config from "../../../../editable/shared/js.json";
import { fetchNui } from "../../utils/fetchNui";
import { VisibilityCtx } from "../../providers/VisibilityProvider";
import { useLocales } from "../../providers/LocaleProvider";
import { getNestedValue } from "../../utils/nested";
type CategoryKey = keyof typeof config.options_settings | "binds";
interface OptionChoice {
    id: string;
    label: string;
}
interface SettingDefinition {
    type: string;
    id: string;
    title: string;
    description: string;
    options?: OptionChoice[];
    min?: number;
    max?: number;
}
interface SettingsWindow {
    window: string;
    icon: string;
    title: string;
    description: string;
    color: string;
    settings: SettingDefinition[];
}
const optionsSettings = config.options_settings as unknown as Record<Exclude<CategoryKey, "binds">, SettingsWindow[]>;
const PREVIEW_DELAY_MS = 80;
const CARHUD_STYLE_ELEMENTS: Record<string, string[]> = {
    default: ["gear", "fuel", "nitro", "seatbelt", "engine"],
    compact: ["gear", "fuel", "nitro", "seatbelt", "engine"],
    gauge: ["gear", "fuel", "nitro", "seatbelt", "engine", "rpm", "engineHealth", "lights", "indicators", "cruise"],
    minimal: ["gear"],
    pvp: ["gear"],
};
const categoryMeta: Record<CategoryKey, {
    icon: string;
    accent: string;
}> = {
    hud: { icon: "fa-solid fa-eye-dropper", accent: "purple" },
    status: { icon: "fa-solid fa-heart", accent: "red" },
    carhud: { icon: "fa-solid fa-car-side", accent: "amber" },
    binds: { icon: "fa-solid fa-keyboard", accent: "cyan" },
};
const Settings: React.FC = () => {
    const { toggleVisibility } = useContext(VisibilityCtx);
    const { settings, updateSetting, resetSettings, editMode, setEditMode } = useSettings();
    const { locale } = useLocales();
    const [activeCategory, setActiveCategory] = useState<CategoryKey>("hud");
    const contentRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        return () => setEditMode(false);
    }, [setEditMode]);
    const categories: Record<CategoryKey, string> = {
        hud: locale.ui.settings.categories.hud,
        status: locale.ui.settings.categories.status,
        carhud: locale.ui.settings.categories.carhud,
        binds: locale.ui.settings.categories.binds,
    };
    const t = useCallback((key: string): string => {
        if (!key || key.trim() === "")
            return "";
        if (key.indexOf(".") === -1)
            return key;
        const result = getNestedValue(locale.ui.settings, key);
        return typeof result === "string" ? result : key;
    }, [locale]);
    const [searchQuery, setSearchQuery] = useState("");
    const searchResults = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        if (!query)
            return [];
        return Object.entries(optionsSettings).flatMap(([category, windows]) => windows.flatMap((window) => (window.settings || []).map((option) => {
            const title = t(option.title);
            const description = t(option.description);
            const optionLabels = (option.options || []).map((item) => t(item.label)).join(" ");
            const haystack = `${title} ${description} ${optionLabels} ${option.id}`.toLowerCase();
            return haystack.includes(query) ? { id: option.id, category: category as CategoryKey, title, description } : null;
        }))).filter(Boolean) as {
            id: string;
            category: CategoryKey;
            title: string;
            description: string;
        }[];
    }, [searchQuery, t]);
    const openSearchResult = (result: {
        id: string;
        category: CategoryKey;
    }) => {
        setActiveCategory(result.category);
        setSearchQuery("");
        window.setTimeout(() => {
            const container = contentRef.current;
            const target = document.getElementById(result.id);
            if (!container || !target)
                return;
            const containerRect = container.getBoundingClientRect();
            const targetRect = target.getBoundingClientRect();
            const targetOffset = targetRect.top - containerRect.top + container.scrollTop;
            const centeredOffset = targetOffset - (container.clientHeight - targetRect.height) / 2;
            container.scrollTo({ top: Math.max(0, centeredOffset), behavior: "smooth" });
        }, 120);
    };
    const handleChange = (id: string, value: unknown) => {
        updateSetting(id, value);
        if (id === "minimap.visibility") {
            fetchNui("koja_hud:updateMinimapVisibility", { mode: value });
        }
        if (id.startsWith("killfeed.")) {
            const kf = { ...settings.killfeed, [id.split(".")[1]]: value };
            fetchNui("koja_hud:updateKillfeed", {
                enabled: kf.enabled,
                anyDistance: kf.anyDistance,
                distance: kf.distance,
            });
        }
        if (id === "killfeed.style") {
            setTimeout(() => {
                window.dispatchEvent(new MessageEvent("message", {
                    data: {
                        action: "koja_hud:killfeed",
                        data: {
                            killer: "You",
                            victim: "Player_47",
                            weapon: "fa-solid fa-gun",
                            distance: 62,
                            preview: true,
                        },
                    },
                }));
            }, PREVIEW_DELAY_MS);
        }
        if (id === "notify.style") {
            const notifyLocale = locale.ui.settings.notify_settings;
            setTimeout(() => {
                window.dispatchEvent(new MessageEvent("message", {
                    data: {
                        action: "koja_hud:sendNotify",
                        data: {
                            icon: "fa-solid fa-bell",
                            color: "#35c76c",
                            title: notifyLocale.test_title || "New style",
                            desc: notifyLocale.test_desc || "This is how your notifications will look!",
                            time: 4000,
                        },
                    },
                }));
            }, PREVIEW_DELAY_MS);
        }
    };
    const handleCloseSettings = () => {
        fetchNui("koja_hud:closeSettings");
        toggleVisibility("settings", false);
    };
    const handleRestartSettings = () => {
        resetSettings();
    };
    const renderOption = (option: SettingDefinition) => {
        if (option.id === "status.borderradius" && settings.status.style === "circle") {
            return null;
        }
        switch (option.type) {
            case "switch":
                return (<Switch key={option.id} id={option.id} label={t(option.title)} description={t(option.description)} onChange={(checked: boolean) => handleChange(option.id, checked)}/>);
            case "dropdown": {
                const options = (option.options ?? []).map((opt) => ({
                    id: opt.id,
                    label: t(opt.label),
                }));
                if (option.id === "status.style" || option.id === "carhud.style") {
                    return (<StyleCards key={option.id} id={option.id} title={t(option.title)} description={t(option.description)} options={options} onChange={(value: string) => handleChange(option.id, value)}/>);
                }
                return (<Dropdown key={option.id} id={option.id} title={t(option.title)} description={t(option.description)} options={options} onChange={(value: string) => handleChange(option.id, value)}/>);
            }
            case "color":
                return (<Color key={option.id} id={option.id} title={t(option.title)} description={t(option.description)} options={(option.options ?? []).map((opt) => ({
                        id: opt.id,
                        label: t(opt.label),
                    }))} onChange={(optionId: string, colorValue: string) => handleChange(`${option.id}.${optionId}`, colorValue)}/>);
            case "slider":
                return (<Slider key={option.id} id={option.id} title={t(option.title)} description={t(option.description)} min={option.min ?? 0} max={option.max ?? 1} onChange={(value: number) => handleChange(option.id, value)}/>);
            case "toggles": {
                let toggleOptions = option.options ?? [];
                if (option.id === "carhud.elements") {
                    const supported = CARHUD_STYLE_ELEMENTS[settings.carhud.style] ?? CARHUD_STYLE_ELEMENTS.gauge;
                    toggleOptions = toggleOptions.filter((opt) => supported.includes(opt.id));
                }
                return (<Toggles key={option.id} id={option.id} title={t(option.title)} description={t(option.description)} options={toggleOptions.map((opt) => ({
                        id: opt.id,
                        label: t(opt.label),
                    }))} onChange={(optionId: string, value: boolean) => handleChange(`${option.id}.${optionId}`, value)}/>);
            }
            case "percent":
                return (<Percent key={option.id} id={option.id} title={t(option.title)} description={t(option.description)} onChange={(data) => {
                        updateSetting(option.id, data);
                    }}/>);
            default:
                return null;
        }
    };
    const renderWindow = (window: SettingsWindow) => {
        return (<div key={window.window} className="sector">
        <div className="sector-head">
          <div className="icon" style={{ backgroundColor: `${window.color}14` }}>
            <i className={window.icon} style={{ color: window.color, opacity: 0.9 }}></i>
          </div>
          <div className="texts">
            <div className="sector-title">{t(window.title)}</div>
            <div className="desc">{t(window.description)}</div>
          </div>
        </div>
        <div className="list">
          {window.settings.map((option) => renderOption(option))}
        </div>
      </div>);
    };
    if (editMode) {
        return <LayoutEditor onClose={() => setEditMode(false)}/>;
    }
    return (<div className="settings pop-in">
      <div className="topbar">
        <div className="tabs">
          {Object.keys(categories).map((categoryKey) => (<div className={`tab-icon accent-${categoryMeta[categoryKey as CategoryKey].accent} ${activeCategory === categoryKey ? "active" : ""}`} key={categoryKey} onClick={() => setActiveCategory(categoryKey as CategoryKey)}>
              <i className={categoryMeta[categoryKey as CategoryKey].icon}></i>
              <span className="tab-tip">{categories[categoryKey as CategoryKey]}</span>
            </div>))}
        </div>
        <div className="settings-search">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder={locale.ui.settings.search_placeholder} spellCheck={false}/>
          {searchQuery && <button onClick={() => setSearchQuery("")} aria-label="Clear search">×</button>}
        </div>
        <div className="actions">
          <div className="action-btn wide" onClick={() => setEditMode(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="5 9 2 12 5 15"/><polyline points="9 5 12 2 15 5"/><polyline points="15 19 12 22 9 19"/><polyline points="19 9 22 12 19 15"/><line x1="2" x2="22" y1="12" y2="12"/><line x1="12" x2="12" y1="2" y2="22"/></svg>
            <span>{locale.ui.settings.layout.edit}</span>
          </div>
          <div className="action-btn" onClick={handleRestartSettings}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
          </div>
          <div className="action-btn danger" onClick={handleCloseSettings}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18"/>
              <path d="m6 6 12 12"/>
            </svg>
          </div>
        </div>
      </div>
      {searchQuery && (<div className="settings-search-results">
          {searchResults.length === 0 && <div className="search-empty">{locale.ui.settings.search_empty}</div>}
          {searchResults.map((result) => (<div className="search-result" key={`${result.category}-${result.id}`} onClick={() => openSearchResult(result)}>
              <div>
                <div className="search-result-title">{result.title}</div>
                <div className="search-result-desc">{result.description}</div>
              </div>
              <span>{categories[result.category]}</span>
            </div>))}
        </div>)}
      <div className="content" ref={contentRef}>
        {activeCategory === "binds" ? (<CustomBinds />) : (optionsSettings[activeCategory].map((window) => renderWindow(window)))}
      </div>
    </div>);
};
export default Settings;
