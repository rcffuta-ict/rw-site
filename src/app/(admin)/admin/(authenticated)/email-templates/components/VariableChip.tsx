interface VariableChipProps {
  name: string;
  desc: string;
  onInsert: (name: string) => void;
}

export function VariableChip({ name, desc, onInsert }: VariableChipProps) {
  return (
    <button
      onClick={() => onInsert(name)}
      title={`Insert {{${name}}} — ${desc}`}
      className="px-2.5 py-1 bg-rw-bg-alt border border-[var(--rw-border)] rounded-md text-xs font-mono text-rw-text-2 hover:text-rw-ink hover:bg-white transition-colors"
    >
      {"{{" + name + "}}"}
    </button>
  );
}
