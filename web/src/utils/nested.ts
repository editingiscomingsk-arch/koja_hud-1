type Tree = Record<string, unknown>;

const isTree = (value: unknown): value is Tree =>
    typeof value === "object" && value !== null && !Array.isArray(value);

export const getNestedValue = <T = unknown>(obj: unknown, path: string): T | undefined => {
    let current: unknown = obj;
    for (const key of path.split(".")) {
        if (!isTree(current) || current[key] === undefined) {
            return undefined;
        }
        current = current[key];
    }
    return current as T;
};

export const setNestedValue = (obj: Tree, path: string, value: unknown): void => {
    const keys = path.split(".");
    const lastKey = keys.pop();
    if (!lastKey) {
        return;
    }
    let current = obj;
    for (const key of keys) {
        if (!isTree(current[key])) {
            current[key] = {};
        }
        current = current[key] as Tree;
    }
    current[lastKey] = value;
};

export const deepMerge = <T>(base: T, override: unknown): T => {
    if (!isTree(base) || !isTree(override)) {
        return (override === undefined ? base : override) as T;
    }
    const result: Tree = { ...base };
    for (const key of Object.keys(override)) {
        const value = override[key];
        result[key] = isTree(value) ? deepMerge(result[key] ?? {}, value) : value;
    }
    return result as T;
};
