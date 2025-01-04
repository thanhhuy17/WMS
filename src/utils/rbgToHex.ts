// ---------- CONVERT RBG TO HEX ----------
export const rgbToHex = (r: number, g: number, b: number) => {
    const toHex = (value: number) => value.toString(16).padStart(2, "0");
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};