export const NIGHTS = [
    { day: "Mon", name: "Opening Ceremony",      unit: "All Units",                  desc: "A grand opening celebrating Nigerian cultures, 38 years of God's faithfulness, and the start of a glorious week." },
    { day: "Tue", name: "Word Night",             unit: "Bible Study Unit",           desc: "An evening of the undiluted Word. Hearts fed, faith built, doctrine grounded." },
    { day: "Wed", name: "Power Night",            unit: "Prayer Unit",                desc: "Impartations, healings, and activations. A reminder that RCFFUTA is a house of prayer." },
    { day: "Thu", name: "Drama Night — Acts '26", unit: "Drama Unit",                 desc: "A rollercoaster of emotion and revival through powerful on-stage storytelling." },
    { day: "Fri", name: "Choir Concert",          unit: "Choir Unit",                 desc: "Dance like David danced. A night of praise, worship, and glorious melodies." },
    { day: "Sat", name: "RIFE & Alumni Reunion",  unit: "Alumni Relations + Welfare", desc: "Alumni come home. Knowledge passed down, final-years inducted, bonds formed over food and stories." },
    { day: "Sun", name: "Handing Over",           unit: "All Units",                  desc: "The mantle passes. Elijah to Elisha. A joyful finale as new leaders are commissioned." },
];

export function ph(w: number, h: number, label = "") {
    const text = encodeURIComponent(label ? `${label}\n${w}×${h}` : `${w}×${h}`);
    return `https://placehold.co/${w}x${h}/f3f4f6/9ca3af?text=${text}`;
}
