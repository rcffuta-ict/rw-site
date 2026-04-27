export type ProgrammeDay = {
  id: string;
  dayLabel: string;
  title: string;
  subtitle?: string;
  description?: string;
};

export const seedProgramme: ProgrammeDay[] = [
  {
    id: "mon",
    dayLabel: "Monday",
    title: "Opening Ceremony",
    description: "Theme unveiling, welcome, and opening charge.",
  },
  {
    id: "tue",
    dayLabel: "Tuesday",
    title: "Word Night",
    subtitle: "Word Conference",
    description: "An evening focused on sound teaching and clarity.",
  },
  {
    id: "wed",
    dayLabel: "Wednesday",
    title: "Power Night",
    subtitle: "Prayer Conference",
    description: "A night of prayer, intercession, and ministry time.",
  },
  { id: "thu", dayLabel: "Thursday", title: "Drama Night", description: "Drama, stories, and expression." },
  { id: "fri", dayLabel: "Friday", title: "Choir Concert", description: "Worship, songs, and a concert atmosphere." },
  { id: "sat", dayLabel: "Saturday", title: "Alumni Reunion", description: "Connection, community, and celebration." },
  { id: "sun", dayLabel: "Sunday", title: "Handing Over Service", description: "Thanksgiving and transition service." },
];

