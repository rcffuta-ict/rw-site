"use client";

import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useState,
} from "react";
import type { EditorVariable } from "../RichTextEditor";

export interface MentionListRef {
    onKeyDown: (props: { event: KeyboardEvent }) => boolean;
}

interface MentionListProps {
    items: EditorVariable[];
    command: (item: EditorVariable) => void;
}

/**
 * The popup shown when staff type "#" in the editor. Lists the template tags
 * that match what they've typed (by name or friendly label), each with its
 * description so they understand what the tag fills in. Selecting one inserts
 * a pill. Keyboard: ↑/↓ to move, Enter to choose.
 */
export const MentionList = forwardRef<MentionListRef, MentionListProps>(
    function MentionList({ items, command }, ref) {
        const [selectedIndex, setSelectedIndex] = useState(0);

        useEffect(() => setSelectedIndex(0), [items]);

        const selectItem = (index: number) => {
            const item = items[index];
            if (item) command(item);
        };

        useImperativeHandle(ref, () => ({
            onKeyDown: ({ event }) => {
                if (items.length === 0) return false;
                if (event.key === "ArrowUp") {
                    setSelectedIndex((i) => (i + items.length - 1) % items.length);
                    return true;
                }
                if (event.key === "ArrowDown") {
                    setSelectedIndex((i) => (i + 1) % items.length);
                    return true;
                }
                if (event.key === "Enter") {
                    selectItem(selectedIndex);
                    return true;
                }
                return false;
            },
        }));

        if (items.length === 0) {
            return (
                <div className="w-64 rounded-lg border border-(--rw-border) bg-white shadow-xl px-3 py-2.5 text-xs text-rw-muted">
                    No matching tag
                </div>
            );
        }

        return (
            <div className="w-64 max-h-64 overflow-y-auto rounded-lg border border-(--rw-border) bg-white shadow-xl py-1">
                <p className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-rw-muted font-bold">
                    Auto-filled per customer
                </p>
                {items.map((item, index) => (
                    <button
                        key={item.name}
                        type="button"
                        onMouseDown={(e) => {
                            e.preventDefault();
                            selectItem(index);
                        }}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`w-full text-left px-3 py-2 transition-colors ${
                            index === selectedIndex
                                ? "bg-rw-bg-alt"
                                : "hover:bg-rw-bg-alt/60"
                        }`}
                    >
                        <span className="flex items-center justify-between gap-2">
                            <span className="text-sm font-medium text-rw-ink">
                                {item.label}
                            </span>
                            <span className="text-[11px] text-rw-muted font-mono shrink-0">
                                {`{{${item.name}}}`}
                            </span>
                        </span>
                        {item.description && (
                            <span className="block text-[11px] text-rw-muted leading-snug mt-0.5">
                                {item.description}
                            </span>
                        )}
                    </button>
                ))}
            </div>
        );
    }
);
