import React, { useState, useEffect } from "react";
import "./textui.scss";
import { useNuiEvent } from "../../../hooks/useNuiEvent";
import { useSettings } from "../../../providers/settingsProvider";
interface TextuiData {
    input: string;
    type: string;
    desc: string;
}
const Textui: React.FC = () => {
    const { editMode } = useSettings();
    const [textuiData, setTextuiData] = useState<TextuiData | null>(null);
    const [visible, setVisible] = useState(false);
    const [inputActive, setInputActive] = useState(false);
    useNuiEvent("koja_hud:startTextui", (data: TextuiData) => {
        setTextuiData(data);
        setVisible(true);
        setInputActive(false);
    });
    useNuiEvent("koja_hud:cancelTextui", () => {
        setVisible(false);
        setTextuiData(null);
        setInputActive(false);
    });
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (!textuiData)
                return;
            if (event.key.toLowerCase() === textuiData.input.toLowerCase()) {
                setInputActive(true);
            }
        };
        const handleKeyUp = (event: KeyboardEvent) => {
            if (!textuiData)
                return;
            if (event.key.toLowerCase() === textuiData.input.toLowerCase()) {
                setInputActive(false);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, [textuiData]);
    if (!visible || !textuiData) {
        if (editMode) {
            return (<div className="textui fade-in-faster">
          <div className="light"></div>
          <div className="input">E</div>
          <div className="text">
            <div className="type">Text UI</div>
            <div className="desc">Interaction hint preview</div>
          </div>
        </div>);
        }
        return null;
    }
    return (<div className={`textui ${inputActive ? "active" : ""} fade-in-faster`}>
      <div className="light"></div>
      <div className="input">
        {textuiData.input}
      </div>
      <div className="text">
        <div className="type">{textuiData.type}</div>
        <div className="desc">{textuiData.desc}</div>
      </div>
    </div>);
};
export default Textui;
