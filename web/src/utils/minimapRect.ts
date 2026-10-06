export interface MinimapRect {
    enabled: boolean;
    left: number;
    bottom: number;
    width: number;
    height: number;
}
export const minimapRect: MinimapRect = {
    enabled: false,
    left: 1,
    bottom: 5,
    width: 19.2,
    height: 21.2,
};
export const setMinimapRect = (r: Partial<MinimapRect>) => {
    if (!r)
        return;
    if (typeof r.enabled === "boolean")
        minimapRect.enabled = r.enabled;
    if (typeof r.left === "number")
        minimapRect.left = r.left;
    if (typeof r.bottom === "number")
        minimapRect.bottom = r.bottom;
    if (typeof r.width === "number")
        minimapRect.width = r.width;
    if (typeof r.height === "number")
        minimapRect.height = r.height;
};
