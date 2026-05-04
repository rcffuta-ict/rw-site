export function ph(w: number, h: number, label = "", bg = "f3f4f6", fg = "9ca3af") {
    const text = encodeURIComponent(label ? `${label}\n${w}×${h}` : `${w}×${h}`);
    return `https://placehold.co/${w}x${h}/${bg}/${fg}?text=${text}`;
}
