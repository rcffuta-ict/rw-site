"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { createTemplateMention } from "./richtext/templateMention";
import { tokensToEditorHtml, editorHtmlToTokens } from "./richtext/serialize";
import { MentionList } from "./richtext/MentionList";

export interface EditorVariable {
    /** Token name as stored, e.g. "customer_name" */
    name: string;
    /** Friendly label shown to non-technical users, e.g. "Customer name" */
    label: string;
    /** One-line explanation shown in the "#" picker. */
    description?: string;
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
 * A friendly WYSIWYG editor (Tiptap) that outputs HTML — a shared form
 * primitive alongside Input / Textarea.
 *
 * - "Visual" mode lets non-technical users format text (bold, headings,
 *   lists, links) without touching HTML.
 * - "Code" mode exposes the raw HTML for power users.
 * - Template tags render as pills. Typing "#" (or the "Insert field" menu)
 *   inserts one. Pills are UI-only — `onChange` always emits canonical
 *   `{{name}}` tokens so the email worker substitutes them unchanged.
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
    const [mode, setMode] = useState<"visual" | "code">("visual");
    const [showFields, setShowFields] = useState(false);

    // Read the latest props from inside Tiptap callbacks without rebuilding the
    // editor (which would lose focus/selection on every render). The refs are
    // kept fresh in an effect; the closures below only read them lazily (on a
    // keystroke / "#" trigger), never during render.
    const onChangeRef = useRef(onChange);
    const variablesRef = useRef(variables);
    useEffect(() => {
        onChangeRef.current = onChange;
        variablesRef.current = variables;
    });

    const labelFor = useCallback(
        (name: string) => variables.find((v) => v.name === name)?.label,
        [variables]
    );

    const editor = useEditor({
        immediatelyRender: false, // avoids SSR hydration mismatch in Next
        extensions: [
            StarterKit,
            Underline,
            Link.configure({
                openOnClick: false,
                autolink: true,
                // Inline style so links stay underlined + brand-coloured in the
                // editor AND in the sent email (email clients ignore CSS classes).
                HTMLAttributes: {
                    style: "color:#FF0015;text-decoration:underline;",
                    rel: "noopener noreferrer",
                },
            }),
            Placeholder.configure({ placeholder }),
            // eslint-disable-next-line react-hooks/refs -- read lazily at "#" time, not during render
            createTemplateMention(() => variablesRef.current),
        ],
        content: tokensToEditorHtml(value, labelFor),
        onUpdate: ({ editor }) => {
            onChangeRef.current(editorHtmlToTokens(editor.getHTML()));
        },
    });

    // Reload `value` into the editor only when the record changes (reloadKey) —
    // NOT on every keystroke, which would reset the caret. Skip the first run
    // since the initial content is set at construction.
    const prevReloadKey = useRef(reloadKey);
    useEffect(() => {
        if (!editor) return;
        if (prevReloadKey.current === reloadKey) return;
        prevReloadKey.current = reloadKey;
        editor.commands.setContent(tokensToEditorHtml(value, labelFor), false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reloadKey, editor]);

    const run = useCallback(
        (fn: (chain: ReturnType<Editor["chain"]>) => ReturnType<Editor["chain"]>) => {
            if (!editor) return;
            fn(editor.chain().focus()).run();
        },
        [editor]
    );

    const insertField = useCallback(
        (v: EditorVariable) => {
            if (!editor) return;
            editor
                .chain()
                .focus()
                .insertContent([
                    { type: "mention", attrs: { id: v.name, label: v.label } },
                    { type: "text", text: " " },
                ])
                .run();
            setShowFields(false);
        },
        [editor]
    );

    const addLink = useCallback(() => {
        const url = window.prompt("Link address (e.g. https://rcffuta.com)");
        if (url) run((c) => c.extendMarkRange("link").setLink({ href: url }));
    }, [run]);

    const switchToVisual = useCallback(() => {
        editor?.commands.setContent(tokensToEditorHtml(value, labelFor), false);
        setMode("visual");
    }, [editor, value, labelFor]);

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
                            <ToolbarButton
                                onClick={() => run((c) => c.toggleBold())}
                                title="Bold"
                                active={editor?.isActive("bold")}
                            >
                                <span className="font-bold">B</span>
                            </ToolbarButton>
                            <ToolbarButton
                                onClick={() => run((c) => c.toggleItalic())}
                                title="Italic"
                                active={editor?.isActive("italic")}
                            >
                                <span className="italic font-serif">I</span>
                            </ToolbarButton>
                            <ToolbarButton
                                onClick={() => run((c) => c.toggleUnderline())}
                                title="Underline"
                                active={editor?.isActive("underline")}
                            >
                                <span className="underline">U</span>
                            </ToolbarButton>

                            <span className="w-px h-5 bg-(--rw-border) mx-1" />

                            <ToolbarButton
                                onClick={() => run((c) => c.toggleHeading({ level: 2 }))}
                                title="Heading"
                                active={editor?.isActive("heading", { level: 2 })}
                            >
                                <span className="font-bold text-xs">H</span>
                            </ToolbarButton>
                            <ToolbarButton
                                onClick={() => run((c) => c.setParagraph())}
                                title="Normal text"
                                active={editor?.isActive("paragraph")}
                            >
                                <span className="text-xs">¶</span>
                            </ToolbarButton>
                            <ToolbarButton
                                onClick={() => run((c) => c.toggleBulletList())}
                                title="Bullet list"
                                active={editor?.isActive("bulletList")}
                            >
                                <span className="text-xs">• —</span>
                            </ToolbarButton>
                            <ToolbarButton
                                onClick={() => run((c) => c.toggleOrderedList())}
                                title="Numbered list"
                                active={editor?.isActive("orderedList")}
                            >
                                <span className="text-xs">1.</span>
                            </ToolbarButton>

                            <span className="w-px h-5 bg-(--rw-border) mx-1" />

                            <ToolbarButton
                                onClick={addLink}
                                title="Add link"
                                active={editor?.isActive("link")}
                            >
                                <span className="text-xs">🔗</span>
                            </ToolbarButton>
                            <ToolbarButton
                                onClick={() => run((c) => c.unsetLink())}
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
                                            title="Insert a template tag (or type # in the message)"
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
                                                <MentionList
                                                    items={variables}
                                                    command={insertField}
                                                    className="absolute right-0 top-full bg-white shadow-xl z-10"
                                                />
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
                                mode === "visual" ? setMode("code") : switchToVisual()
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
                <EditorContent
                    editor={editor}
                    className={`flex-1 min-h-0 overflow-y-auto text-sm text-rw-ink leading-relaxed ${
                        mode === "code" ? "hidden" : ""
                    }
                        [&_.ProseMirror]:min-h-[220px] [&_.ProseMirror]:px-4 [&_.ProseMirror]:py-3 [&_.ProseMirror]:outline-none
                        [&_.ProseMirror_h2]:text-lg [&_.ProseMirror_h2]:font-bold [&_.ProseMirror_h2]:my-2
                        [&_.ProseMirror_p]:my-2 [&_.ProseMirror_strong]:font-semibold
                        [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-6 [&_.ProseMirror_ul]:my-2
                        [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-6 [&_.ProseMirror_ol]:my-2
                        [&_.ProseMirror_a]:text-rw-crimson [&_.ProseMirror_a]:underline
                        [&_.rw-tag-pill]:inline-flex [&_.rw-tag-pill]:items-center [&_.rw-tag-pill]:rounded-md [&_.rw-tag-pill]:bg-rw-crimson/10 [&_.rw-tag-pill]:text-rw-crimson [&_.rw-tag-pill]:px-1.5 [&_.rw-tag-pill]:py-0.5 [&_.rw-tag-pill]:mx-0.5 [&_.rw-tag-pill]:text-[0.85em] [&_.rw-tag-pill]:font-medium [&_.rw-tag-pill]:whitespace-nowrap
                        [&_.ProseMirror_.is-editor-empty:first-child]:before:content-[attr(data-placeholder)] [&_.ProseMirror_.is-editor-empty:first-child]:before:text-rw-muted/50 [&_.ProseMirror_.is-editor-empty:first-child]:before:float-left [&_.ProseMirror_.is-editor-empty:first-child]:before:h-0 [&_.ProseMirror_.is-editor-empty:first-child]:before:pointer-events-none`}
                />
                {mode === "code" && (
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
