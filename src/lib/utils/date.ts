/**
 * Parse the free-text transaction date returned by the receipt OCR extractor.
 *
 * The model is instructed to return the date "as it appears" on the receipt, so
 * the value can take many shapes depending on the bank:
 *   - ISO:            "2026-06-15"
 *   - Day-first:      "15/06/2026 08:01", "15-06-2026 14:05"
 *   - Long-form:      "Thursday, June 18th, 2026 | 9:38 PM" (Moniepoint, etc.)
 *
 * The native `Date` constructor cannot handle ordinal suffixes ("18th"), the
 * "|" date/time separator, or day-first numeric dates (which it silently
 * misreads as US month-first). This normalizes those quirks before parsing.
 *
 * @returns a valid `Date`, or `null` if the string can't be resolved.
 */
export function parseReceiptDate(raw: string | null | undefined): Date | null {
    if (!raw) return null;

    const normalized = String(raw)
        // "June 18th, 2026 | 9:38 PM" -> drop the "|" date/time separator
        .replace(/\|/g, " ")
        // "18th" -> "18": ordinal suffixes break Date parsing
        .replace(/\b(\d{1,2})(st|nd|rd|th)\b/gi, "$1")
        .replace(/\s+/g, " ")
        .trim();

    // Day-first numeric formats (DD/MM/YYYY) are standard in Nigeria but are
    // either unparseable or misread as MM/DD by the native Date constructor,
    // so resolve them explicitly before falling back to native parsing.
    const dmy = normalized.match(
        /^(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{2,4})(?:[ ,]+(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(am|pm)?)?$/i
    );
    if (dmy) {
        const [, dd, mm, yyyyRaw, hh = "0", min = "0", ss = "0", ampm] = dmy;
        let year = Number(yyyyRaw);
        if (year < 100) year += 2000;
        let hour = Number(hh);
        const meridiem = ampm?.toLowerCase();
        if (meridiem === "pm" && hour < 12) hour += 12;
        if (meridiem === "am" && hour === 12) hour = 0;

        const d = new Date(
            year,
            Number(mm) - 1,
            Number(dd),
            hour,
            Number(min),
            Number(ss)
        );
        if (!isNaN(d.getTime())) return d;
    }

    // Native parsing handles ISO and long-form strings once normalized.
    const native = new Date(normalized);
    if (!isNaN(native.getTime())) return native;

    return null;
}
