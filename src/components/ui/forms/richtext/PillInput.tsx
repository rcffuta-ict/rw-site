"use client";

import React, {
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useRef,
} from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Document from "@tiptap/extension-document";
import Placeholder from "@tiptap/extension-placeholder";
import type { Node as PMNode } from "@tiptap/pm/model";
import { createTemplateMention } from "./templateMention";
import { tokensToEditorHtml } from "./serialize";
import type { EditorVariable } from "../RichTextEditor";

/** Single-paragraph document so Enter can't create a second line. */
const OneLineDocument = Document.extend({ content: "paragraph" });

/** Serializes mention pills back to `{{name}}` tokens when reading the value. */
const MENTION_TEXT = {
    mention: ({ node }: { node: PMNode }) => `{{${node.attrs.id}}}`,
};

export interface PillInputHandle {
    /** Insert a template-tag pill at the cursor (used by the chips above). */
    insertVariable: (v: EditorVariable) => void;
    focus: () => void;
}

export interface PillInputProps {
    value: string;
    onChange: (value: string) => void;
    variables?: EditorVariable[];
    reloadKey?: string;
    placeholder?: string;
    label?: React.ReactNode;
    required?: boolean;
    error?: string;
    containerClassName?: string;
}

/**
 * A one-line, input-styled editor that renders template tags as pills — the
 * subject-line counterpart to RichTextEditor. Type "#" for the tag picker.
 * Emits a plain-text subject where pills serialize back to `{{name}}` tokens,
 * so nothing downstream changes.
 */
export const PillInput = forwardRef<PillInputHandle, PillInputProps>(
    function PillInput(
        {
            value,
            onChange,
            variables = [],
            reloadKey = "",
            placeholder = "Subject line…",
            label,
            required,
            error,
            containerClassName = "",
        },
        ref
    ) {
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
            immediatelyRender: false,
            extensions: [
                OneLineDocument,
                StarterKit.configure({
                    document: false,
                    heading: false,
                    blockquote: false,
                    bulletList: false,
                    orderedList: false,
                    listItem: false,
                    codeBlock: false,
                    horizontalRule: false,
                    bold: false,
                    italic: false,
                    strike: false,
                    code: false,
                    hardBreak: false,
                }),
                Placeholder.configure({ placeholder }),
                createTemplateMention(() => variablesRef.current),
            ],
            content: tokensToEditorHtml(value, labelFor),
            onUpdate: ({ editor }) => {
                onChangeRef.current(
                    editor.getText({ blockSeparator: " ", textSerializers: MENTION_TEXT })
                );
            },
        });

        const prevReloadKey = useRef(reloadKey);
        useEffect(() => {
            if (!editor) return;
            if (prevReloadKey.current === reloadKey) return;
            prevReloadKey.current = reloadKey;
            editor.commands.setContent(tokensToEditorHtml(value, labelFor), false);
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [reloadKey, editor]);

        useImperativeHandle(ref, () => ({
            insertVariable: (v) => {
                editor
                    ?.chain()
                    .focus()
                    .insertContent({
                        type: "mention",
                        attrs: { id: v.name, label: v.label },
                    })
                    .run();
            },
            focus: () => editor?.commands.focus(),
        }));

        return (
            <div className={`flex flex-col gap-2 w-full ${containerClassName}`}>
                {label && (
                    <label className="text-[11px] font-bold uppercase tracking-widest leading-none text-rw-muted">
                        {label} {required && <span className="text-rw-crimson">*</span>}
                    </label>
                )}
                <EditorContent
                    editor={editor}
                    className={`w-full rounded-xl border text-sm font-medium transition-all shadow-sm
                        ${
                            error
                                ? "border-rw-crimson bg-rw-crimson/5"
                                : "border-[var(--rw-border)] bg-rw-bg-alt/20 hover:bg-white focus-within:bg-white focus-within:border-rw-crimson focus-within:ring-4 focus-within:ring-rw-crimson/12"
                        }
                        [&_.ProseMirror]:outline-none [&_.ProseMirror]:px-4 [&_.ProseMirror]:py-3 [&_.ProseMirror]:text-rw-ink [&_.ProseMirror]:leading-normal [&_.ProseMirror]:whitespace-nowrap [&_.ProseMirror]:overflow-x-auto
                        [&_.rw-tag-pill]:inline-flex [&_.rw-tag-pill]:items-center [&_.rw-tag-pill]:rounded-md [&_.rw-tag-pill]:bg-rw-crimson/10 [&_.rw-tag-pill]:text-rw-crimson [&_.rw-tag-pill]:px-1.5 [&_.rw-tag-pill]:py-0.5 [&_.rw-tag-pill]:mx-0.5 [&_.rw-tag-pill]:text-[0.85em] [&_.rw-tag-pill]:font-medium [&_.rw-tag-pill]:whitespace-nowrap
                        [&_.ProseMirror_.is-editor-empty:first-child]:before:content-[attr(data-placeholder)] [&_.ProseMirror_.is-editor-empty:first-child]:before:text-rw-muted/50 [&_.ProseMirror_.is-editor-empty:first-child]:before:float-left [&_.ProseMirror_.is-editor-empty:first-child]:before:h-0 [&_.ProseMirror_.is-editor-empty:first-child]:before:pointer-events-none`}
                />
                {error && (
                    <p className="text-[11px] font-bold text-rw-crimson uppercase tracking-wide leading-none pl-0.5">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);
