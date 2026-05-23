import type { Template } from "../types";

interface SidebarItemProps {
  template: Template;
  isActive: boolean;
  isDirty: boolean;
  onClick: (key: string) => void;
}

export function SidebarItem({ template, isActive, onClick, isDirty }: SidebarItemProps) {
  return (
    <button
      onClick={() => onClick(template.key)}
      className={`flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm transition-all ${
        isActive
          ? "bg-rw-crimson/8 text-rw-crimson font-semibold border-l-2 border-rw-crimson"
          : "text-rw-text-2 hover:text-rw-ink hover:bg-rw-bg-alt"
      }`}
    >
      <span className="text-base">{template.icon}</span>
      <span className="flex-1 text-left">
        <span className="block text-xs font-medium">{template.label}</span>
      </span>
      {isDirty && <span className="text-rw-crimson text-xs font-bold">●</span>}
    </button>
  );
}
