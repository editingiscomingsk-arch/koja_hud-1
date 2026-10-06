import React, { useState, useEffect, useRef } from "react";
import { useSettings, getDefaultSettings, setSetting } from "../../../providers/settingsProvider";
import { getNestedValue } from '../../../utils/nested';
import "../Settings.scss";
import { useLocales } from "../../../providers/LocaleProvider";

export interface PercentSetting {
  value: number;
  action: "above" | "below";
  visibility: boolean;
}

interface PercentProps {
  id: string;
  title: string;
  description: string;
  onChange: (data: PercentSetting) => void;
}

const Percent: React.FC<PercentProps> = ({ id, title, description, onChange }) => {
  const { settings } = useSettings();
  const { locale } = useLocales();
  const defaultSettings = getDefaultSettings();
  const currentSetting: PercentSetting =
    getNestedValue<PercentSetting>(settings, id) ??
    getNestedValue<PercentSetting>(defaultSettings, id) ??
    { value: 50, action: "below", visibility: true };

  const [threshold, setThreshold] = useState<number>(currentSetting.value);
  const [lastAction, setLastAction] = useState<"above" | "below">(currentSetting.action);
  const [alwaysShow, setAlwaysShow] = useState<boolean>(currentSetting.visibility);
  const lastDataRef = useRef<PercentSetting>(currentSetting);

  useEffect(() => {
    const newData: PercentSetting = { value: threshold, action: lastAction, visibility: alwaysShow };
    if (JSON.stringify(newData) !== JSON.stringify(lastDataRef.current)) {
      lastDataRef.current = newData;
      onChange(newData);
      setSetting(id, newData);
    }
  }, [threshold, lastAction, alwaysShow, id, onChange]);

  return (
    <div className="list-option percent-setting">
      <div className="list-option-texts">
        <div className="label">{title}</div>
        <div className="desc">{description}</div>
      </div>
      <div className="percent">
        <div className="toggle">
          <div className={`button show ${alwaysShow ? "active" : ""}`} onClick={() => setAlwaysShow(true)}>
            {locale.ui.settings.misc.show}
          </div>
          <div
            className={`button ${!alwaysShow ? "active" : ""}`}
            onClick={() => {
              if (alwaysShow) {
                setAlwaysShow(false);
              } else {
                setLastAction(prev => (prev === "above" ? "below" : "above"));
              }
            }}
          >
            {lastAction === "above" ? locale.ui.settings.misc.over : locale.ui.settings.misc.under}
          </div>
        </div>
        <div className="input">
          <input
            type="number"
            value={threshold}
            onChange={(e) => {
              const newVal = parseInt(e.target.value, 10);
              if (!isNaN(newVal)) setThreshold(newVal);
            }}
            min={0}
            max={100}
          />
          <div className="unit">%</div>
        </div>
      </div>
    </div>
  );
};

export default Percent;
