// Template tags are stored canonically as `{{name}}` tokens everywhere (DB
// templates, the email queue, the worker). Inside the Tiptap editor we render
// them as "mention" pill nodes so non-technical staff see a friendly chip
// instead of raw braces. These helpers convert between the two forms so the
// stored HTML NEVER contains pill markup — the email worker keeps seeing
// `{{name}}` and substitutes it unchanged.

const TOKEN_RE = /\{\{(\w+)\}\}/g;

/**
 * `{{name}}` → `<span data-type="mention" data-id="name" data-label="…"></span>`
 * so Tiptap parses the tokens into mention pill nodes when loading `value`. The
 * optional `labelFor` resolves the friendly label so reloaded pills read e.g.
 * "#Order number" rather than the raw token name.
 */
export function tokensToEditorHtml(
    value: string,
    labelFor?: (name: string) => string | undefined
): string {
    if (!value) return "";
    return value.replace(TOKEN_RE, (_match, name: string) => {
        const label = labelFor?.(name);
        const labelAttr = label
            ? ` data-label="${label.replace(/"/g, "&quot;")}"`
            : "";
        return `<span data-type="mention" data-id="${name}"${labelAttr}></span>`;
    });
}

/**
 * The reverse: collapse the mention pill spans Tiptap renders back into bare
 * `{{name}}` tokens. Mention nodes are atomic inline spans with no nested
 * elements, so a single span with non-`<` label content is safe to match.
 */
export function editorHtmlToTokens(html: string): string {
    if (!html) return "";
    return html.replace(
        /<span\b[^>]*data-type=["']mention["'][^>]*>[^<]*<\/span>/gi,
        (span) => {
            const id = /data-id=["']([^"']+)["']/i.exec(span)?.[1];
            return id ? `{{${id}}}` : "";
        }
    );
}
