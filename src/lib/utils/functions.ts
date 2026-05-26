export function ph(w: number, h: number, label = "", bg = "f3f4f6", fg = "9ca3af") {
    const text = encodeURIComponent(label ? `${label}\n${w}×${h}` : `${w}×${h}`);
    return `https://placehold.co/${w}x${h}/${bg}/${fg}?text=${text}`;
}

export const COLOR_HEX: Record<string, string> = {
    Black: "1a1a1a",
    White: "f5f5f0",
    Burgundy: "7a0c31",
    "Wine Red": "940011",
    Navy: "0a1628",
    Grey: "6b7280",
};

export function productImageUrl(
    name: string,
    color: string | null,
    width: number = 360,
    height: number = 480
) {
    const bg = color && COLOR_HEX[color] ? COLOR_HEX[color] : "f3f4f6";
    const fg = color ? "e0e0e0" : "9ca3af";
    const label = `${name}${color ? `\n${color}` : ""}`;
    return ph(width, height, label, bg, fg);
}

export function fmtNaira(n: number) {
    return `₦${Math.round(n).toLocaleString()}`;
}

export const formatNaira = fmtNaira;
