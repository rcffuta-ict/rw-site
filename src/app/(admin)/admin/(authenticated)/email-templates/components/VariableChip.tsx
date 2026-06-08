interface VariableChipProps {
  name: string;
  /** Friendly label shown on the pill, e.g. "Order number". */
  desc: string;
  onInsert: (name: string) => void;
}

export function VariableChip({ name, desc, onInsert }: VariableChipProps) {
  return (
    <button
      type="button"
      onMouseDown={(e) => {
        // Keep the editor's selection so the tag inserts at the caret.
        e.preventDefault();
        onInsert(name);
      }}
      title={`Insert {{${name}}} — ${desc}`}
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rw-crimson/10 text-rw-crimson border border-rw-crimson/15 text-xs font-medium hover:bg-rw-crimson/15 transition-colors"
    >
      <span className="text-rw-crimson/50 font-bold leading-none">#</span>
      {desc}
    </button>
  );
}
