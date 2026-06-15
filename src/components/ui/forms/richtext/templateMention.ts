"use client";

import Mention from "@tiptap/extension-mention";
import { ReactRenderer } from "@tiptap/react";
import tippy, { type Instance as TippyInstance } from "tippy.js";
import type { SuggestionProps } from "@tiptap/suggestion";
import { MentionList, type MentionListRef } from "./MentionList";
import type { EditorVariable } from "../RichTextEditor";

/**
 * The "#"-triggered template-tag mention. Pills render the friendly label;
 * `getVariables` is read lazily so the latest list (with descriptions) is
 * always used without rebuilding the editor.
 */
export function createTemplateMention(getVariables: () => EditorVariable[]) {
    return Mention.configure({
        HTMLAttributes: { class: "rw-tag-pill" },
        // What lands on the clipboard / plain-text serialization.
        renderText: ({ node }) => `{{${node.attrs.id}}}`,
        suggestion: {
            char: "#",
            items: ({ query }): EditorVariable[] => {
                const q = query.toLowerCase();
                return getVariables().filter(
                    (v) =>
                        v.name.toLowerCase().includes(q) ||
                        v.label.toLowerCase().includes(q)
                );
            },
            command: ({ editor, range, props }) => {
                const item = props as unknown as EditorVariable;
                editor
                    .chain()
                    .focus()
                    .insertContentAt(range, [
                        {
                            type: "mention",
                            attrs: { id: item.name, label: item.label },
                        },
                        { type: "text", text: " " },
                    ])
                    .run();
            },
            render: () => {
                let component: ReactRenderer<MentionListRef, MentionListProps>;
                let popup: TippyInstance[];

                return {
                    onStart: (props: SuggestionProps<EditorVariable>) => {
                        component = new ReactRenderer(MentionList, {
                            props: {
                                items: props.items,
                                command: (item: EditorVariable) =>
                                    props.command(item),
                            },
                            editor: props.editor,
                        });

                        if (!props.clientRect) return;

                        popup = tippy("body", {
                            getReferenceClientRect:
                                props.clientRect as () => DOMRect,
                            appendTo: () => document.body,
                            content: component.element,
                            showOnCreate: true,
                            interactive: true,
                            trigger: "manual",
                            placement: "bottom-start",
                        });
                    },
                    onUpdate: (props: SuggestionProps<EditorVariable>) => {
                        component.updateProps({
                            items: props.items,
                            command: (item: EditorVariable) =>
                                props.command(item),
                        });
                        if (props.clientRect) {
                            popup?.[0]?.setProps({
                                getReferenceClientRect:
                                    props.clientRect as () => DOMRect,
                            });
                        }
                    },
                    onKeyDown: (props: { event: KeyboardEvent }) => {
                        if (props.event.key === "Escape") {
                            popup?.[0]?.hide();
                            return true;
                        }
                        return component.ref?.onKeyDown(props) ?? false;
                    },
                    onExit: () => {
                        popup?.[0]?.destroy();
                        component?.destroy();
                    },
                };
            },
        },
    });
}

interface MentionListProps {
    items: EditorVariable[];
    command: (item: EditorVariable) => void;
}
