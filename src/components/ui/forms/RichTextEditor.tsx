"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

export interface EditorVariable {
    /** Token name as stored, e.g. "customer_name" */
    name: string;
    /** Friendly label shown to non-technical users, e.g. "Customer name" */
    label: string;
}

export interface RichTextEditorProps {
    value: string;
    onChange: (html: string) => void;
    /** Optional insertable placeholders (e.g. {{customer_name}}). */
    variables?: EditorVariable[];
    /** When this changes the editor reloads `value` into the DOM (e.g. switching record). */
    reloadKey?: string;
    placeholder?: string;
    label?: React.ReactNode;
    description?: React.ReactNode;
    error?: string;
    required?: boolean;
    containerClassName?: string;
}

type ToolbarButtonProps = {
    onClick: () => void;
    title: string;
    children: React.ReactNode;
    active?: boolean;
};

function ToolbarButton({ onClick, title, children, active }: ToolbarButtonProps) {
    return (
        <button
            type="button"
            // onMouseDown (not onClick) so the editor keeps its text selection
            onMouseDown={(e) => {
                e.preventDefault();
                onClick();
            }}
            title={title}
            className={`h-8 min-w-8 px-2 inline-flex items-center justify-center rounded-md text-sm transition-colors ${
                active
                    ? "bg-rw-crimson/10 text-rw-crimson"
                    : "text-rw-text-2 hover:bg-rw-bg-alt hover:text-rw-ink"
            }`}
        >
            {children}
        </button>
    );
}

/**
 * A friendly WYSIWYG editor that outputs HTML — a shared form primitive
 * alongside Input / Textarea.
 *
 * - "Visual" mode lets non-technical users format text (bold, headings,
 *   lists, links) without touching HTML.
 * - "Code" mode exposes the raw HTML for power users.
 * - The optional "Insert field" menu drops placeholders at the cursor.
 */
export function RichTextEditor({
    value,
    onChange,
    variables = [],
    reloadKey = "",
    placeholder = "Write here…",
    label,
    description,
    error,
    required,
    containerClassName = "",
}: RichTextEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const [mode, setMode] = useState<"visual" | "code">("visual");
    const [showFields, setShowFields] = useState(false);

    // Load content into the visual editor only when the record changes or we
    // switch back from code view — NOT on every keystroke (which resets the caret).
    useEffect(() => {
        if (mode === "visual" && editorRef.current) {
            editorRef.current.innerHTML = value || "";
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reloadKey, mode]);

    const emit = useCallback(() => {
        if (editorRef.current) onChange(editorRef.current.innerHTML);
    }, [onChange]);

    const exec = useCallback(
        (command: string, arg?: string) => {
            editorRef.current?.focus();
            document.execCommand(command, false, arg);
            emit();
        },
        [emit]
    );

    const insertField = useCallback(
        (name: string) => {
            editorRef.current?.focus();
            document.execCommand("insertText", false, `{{${name}}}`);
            setShowFields(false);
            emit();
        },
        [emit]
    );

    const addLink = useCallback(() => {
        const url = window.prompt("Link address (e.g. https://rcffuta.com)");
        if (url) exec("createLink", url);
    }, [exec]);

    return (
        <div className={`flex flex-col gap-2 w-full ${containerClassName}`}>
            {label && (
                <label className="text-[11px] font-bold uppercase tracking-widest leading-none text-rw-muted">
                    {label} {required && <span className="text-rw-crimson">*</span>}
                </label>
            )}

            <div
                className={`flex flex-col flex-1 min-h-0 rounded-xl border bg-white overflow-hidden transition-all
                    ${
                        error
                            ? "border-rw-crimson ring-4 ring-rw-crimson/12"
                            : "border-(--rw-border) focus-within:border-rw-crimson focus-within:ring-4 focus-within:ring-rw-crimson/12"
                    }`}
            >
                {/* Toolbar */}
                <div className="flex items-center gap-1 flex-wrap px-2 py-1.5 border-b border-(--rw-border) bg-rw-bg-alt/40">
                    {mode === "visual" ? (
                        <>
                            <ToolbarButton onClick={() => exec("bold")} title="Bold">
                                <span className="font-bold">B</span>
                            </ToolbarButton>
                            <ToolbarButton onClick={() => exec("italic")} title="Italic">
                                <span className="italic font-serif">I</span>
                            </ToolbarButton>
                            <ToolbarButton
                                onClick={() => exec("underline")}
                                title="Underline"
                            >
                                <span className="underline">U</span>
                            </ToolbarButton>

                            <span className="w-px h-5 bg-(--rw-border) mx-1" />

                            <ToolbarButton
                                onClick={() => exec("formatBlock", "h2")}
                                title="Heading"
                            >
                                <span className="font-bold text-xs">H</span>
                            </ToolbarButton>
                            <ToolbarButton
                                onClick={() => exec("formatBlock", "p")}
                                title="Normal text"
                            >
                                <span className="text-xs">¶</span>
                            </ToolbarButton>
                            <ToolbarButton
                                onClick={() => exec("insertUnorderedList")}
                                title="Bullet list"
                            >
                                <span className="text-xs">• —</span>
                            </ToolbarButton>
                            <ToolbarButton
                                onClick={() => exec("insertOrderedList")}
                                title="Numbered list"
                            >
                                <span className="text-xs">1.</span>
                            </ToolbarButton>

                            <span className="w-px h-5 bg-(--rw-border) mx-1" />

                            <ToolbarButton onClick={addLink} title="Add link">
                                <span className="text-xs">🔗</span>
                            </ToolbarButton>
                            <ToolbarButton
                                onClick={() => exec("unlink")}
                                title="Remove link"
                            >
                                <span className="text-xs line-through">🔗</span>
                            </ToolbarButton>

                            {variables.length > 0 && (
                                <>
                                    <span className="w-px h-5 bg-(--rw-border) mx-1" />
                                    <div className="relative">
                                        <button
                                            type="button"
                                            onMouseDown={(e) => {
                                                e.preventDefault();
                                                setShowFields((s) => !s);
                                            }}
                                            className="h-8 px-3 inline-flex items-center gap-1.5 rounded-md text-xs font-semibold bg-rw-ink text-white hover:bg-rw-ink/90 transition-colors"
                                        >
                                            + Insert field
                                        </button>
                                        {showFields && (
                                            <>
                                                <div
                                                    className="fixed inset-0 z-10"
                                                    onMouseDown={() =>
                                                        setShowFields(false)
                                                    }
                                                />
                                                <div className="absolute left-0 top-full mt-1 z-20 w-56 max-h-64 overflow-y-auto rounded-lg border border-(--rw-border) bg-white shadow-xl py-1">
                                                    <p className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-rw-muted font-bold">
                                                        Auto-filled per customer
                                                    </p>
                                                    {variables.map((v) => (
                                                        <button
                                                            key={v.name}
                                                            type="button"
                                                            onMouseDown={(e) => {
                                                                e.preventDefault();
                                                                insertField(v.name);
                                                            }}
                                                            className="w-full text-left px-3 py-2 hover:bg-rw-bg-alt transition-colors"
                                                        >
                                                            <span className="block text-sm font-medium text-rw-ink">
                                                                {v.label}
                                                            </span>
                                                            <span className="block text-[11px] text-rw-muted font-mono">
                                                                {`{{${v.name}}}`}
                                                            </span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </>
                            )}
                        </>
                    ) : (
                        <span className="px-2 py-1 text-xs text-rw-muted font-medium">
                            Raw HTML — for advanced edits
                        </span>
                    )}

                    <div className="ml-auto">
                        <ToolbarButton
                            onClick={() =>
                                setMode((m) => (m === "visual" ? "code" : "visual"))
                            }
                            title={
                                mode === "visual"
                                    ? "Edit raw HTML"
                                    : "Back to visual editor"
                            }
                            active={mode === "code"}
                        >
                            <span className="text-xs font-mono">&lt;/&gt;</span>
                        </ToolbarButton>
                    </div>
                </div>

                {/* Editing surface */}
                {mode === "visual" ? (
                    <div
                        ref={editorRef}
                        contentEditable
                        suppressContentEditableWarning
                        onInput={emit}
                        onFocus={() =>
                            document.execCommand("defaultParagraphSeparator", false, "p")
                        }
                        data-placeholder={placeholder}
                        className="flex-1 min-h-[220px] overflow-y-auto px-4 py-3 text-sm text-rw-ink leading-relaxed focus:outline-none
                            [&:empty]:before:content-[attr(data-placeholder)] [&:empty]:before:text-rw-muted/50
                            [&_h2]:text-lg [&_h2]:font-bold [&_h2]:my-2
                            [&_p]:my-2 [&_strong]:font-semibold
                            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-2
                            [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-2
                            [&_a]:text-rw-crimson [&_a]:underline"
                    />
                ) : (
                    <textarea
                        value={value}
                        onChange={(e) => onChange(e.currentTarget.value)}
                        spellCheck={false}
                        className="flex-1 min-h-[220px] px-4 py-3 text-xs font-mono text-rw-ink bg-white focus:outline-none resize-none leading-relaxed"
                    />
                )}
            </div>

            {description && !error && (
                <p className="text-[11px] text-rw-muted leading-snug pl-0.5">
                    {description}
                </p>
            )}
            {error && (
                <p className="text-[11px] font-bold text-rw-crimson uppercase tracking-wide leading-none pl-0.5">
                    {error}
                </p>
            )}
        </div>
    );
}
