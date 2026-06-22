"use client";

// Professional, print-ready production verdict — rendered with @react-pdf/renderer.
// react-pdf has its own primitives + StyleSheet (no Tailwind/HTML), and the
// default Helvetica font lacks the ₦ glyph, so money is shown as "NGN".

import {
    Document,
    Page,
    View,
    Text,
    Image,
    StyleSheet,
} from "@react-pdf/renderer";
import { LOGOS, TENURE, FELLOWSHIP } from "@/lib/config";
import type { Verdict, VerdictManifestItem } from "@/lib/data/types";

// ─── Palette (mirrors the app brand tokens) ──────────────────────────────────
const INK = "#1C0003";
const CRIMSON = "#FF0015";
const GOLD = "#FF6A00";
const MUTED = "#8a7479";
const BORDER = "#e8d0d4";
const PAPER = "#ffffff";
const WASH = "#fbf6f7";

const fmt = (n: number) => `NGN ${Math.round(n).toLocaleString()}`;

const styles = StyleSheet.create({
    page: {
        backgroundColor: PAPER,
        paddingTop: 0,
        paddingBottom: 64,
        paddingHorizontal: 0,
        fontSize: 9,
        color: INK,
        fontFamily: "Helvetica",
    },

    // Header band
    header: {
        backgroundColor: INK,
        paddingVertical: 22,
        paddingHorizontal: 36,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    headerLeft: { flexDirection: "row", alignItems: "center" },
    logo: { width: 38, height: 38, marginRight: 12, objectFit: "contain" },
    brand: { fontFamily: "Helvetica-Bold", fontSize: 15, color: PAPER, letterSpacing: 1 },
    brandSub: { fontSize: 7, color: "#c9b9bc", letterSpacing: 2, marginTop: 3, textTransform: "uppercase" },
    docTitleWrap: { alignItems: "flex-end" },
    docTitle: { fontFamily: "Helvetica-Bold", fontSize: 10, color: GOLD, letterSpacing: 2 },
    docRef: { fontFamily: "Helvetica-Bold", fontSize: 13, color: PAPER, marginTop: 4 },
    docDate: { fontSize: 7, color: "#c9b9bc", marginTop: 3 },

    accent: { height: 3, backgroundColor: CRIMSON },

    body: { paddingHorizontal: 36, paddingTop: 22 },

    // Meta strip
    metaRow: { flexDirection: "row", marginBottom: 18 },
    metaCell: { flex: 1, paddingRight: 12 },
    metaLabel: { fontSize: 6.5, color: MUTED, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 3 },
    metaValue: { fontFamily: "Helvetica-Bold", fontSize: 9, color: INK },

    sectionTitle: {
        fontFamily: "Helvetica-Bold",
        fontSize: 8.5,
        letterSpacing: 2,
        textTransform: "uppercase",
        color: INK,
        marginBottom: 8,
        paddingBottom: 5,
        borderBottomWidth: 1.5,
        borderBottomColor: INK,
    },

    // Manifest
    manifestGroup: { marginBottom: 10 },
    manifestProduct: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 4,
    },
    manifestProductName: { fontFamily: "Helvetica-Bold", fontSize: 10, color: INK },
    manifestProductQty: { fontFamily: "Helvetica-Bold", fontSize: 7, color: CRIMSON, letterSpacing: 1 },
    manifestLine: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 3,
        paddingLeft: 10,
        borderLeftWidth: 1.5,
        borderLeftColor: BORDER,
        marginLeft: 2,
    },
    qtyChip: {
        fontFamily: "Helvetica-Bold",
        fontSize: 9,
        color: INK,
        width: 34,
    },
    variantLabel: { fontSize: 9, color: "#43292d" },

    // Generic table (orders)
    tHead: {
        flexDirection: "row",
        backgroundColor: WASH,
        paddingVertical: 5,
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderBottomColor: BORDER,
    },
    tHeadCell: { fontFamily: "Helvetica-Bold", fontSize: 6.5, color: MUTED, letterSpacing: 1, textTransform: "uppercase" },
    tRow: {
        flexDirection: "row",
        paddingVertical: 5,
        paddingHorizontal: 8,
        borderBottomWidth: 0.5,
        borderBottomColor: BORDER,
    },
    tCell: { fontSize: 8.5, color: INK },
    cRef: { width: "26%", fontFamily: "Helvetica-Bold" },
    cName: { width: "48%" },
    cAmt: { width: "26%", textAlign: "right" },

    // Two-column lower area
    lower: { flexDirection: "row", marginTop: 20 },
    colLeft: { width: "52%", paddingRight: 18 },
    colRight: { width: "48%" },

    // Financials
    finRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 4,
    },
    finLabel: { fontSize: 8.5, color: MUTED },
    finValue: { fontSize: 8.5, color: INK, fontFamily: "Helvetica-Bold" },
    debitBox: {
        marginTop: 8,
        backgroundColor: INK,
        borderRadius: 6,
        padding: 12,
    },
    debitLabel: { fontSize: 7, color: "#c9b9bc", letterSpacing: 1.5, textTransform: "uppercase" },
    debitValue: { fontFamily: "Helvetica-Bold", fontSize: 18, color: PAPER, marginTop: 3 },
    bankBox: {
        marginTop: 8,
        borderWidth: 1,
        borderColor: BORDER,
        borderRadius: 6,
        padding: 10,
    },
    bankLine: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 2 },
    bankLabel: { fontSize: 7.5, color: MUTED },
    bankValue: { fontSize: 8, color: INK, fontFamily: "Helvetica-Bold" },

    // Authorization
    authBox: {
        borderWidth: 1,
        borderColor: BORDER,
        borderRadius: 6,
        padding: 14,
    },
    sigLine: { borderBottomWidth: 1.2, borderBottomColor: INK, height: 26, marginBottom: 6 },
    sigName: { fontFamily: "Helvetica-Bold", fontSize: 11, color: INK },
    sigRole: { fontSize: 6.5, color: CRIMSON, letterSpacing: 1.5, textTransform: "uppercase", marginTop: 3 },
    sigMeta: { fontSize: 7, color: MUTED, marginTop: 5 },

    noteBox: {
        marginTop: 14,
        backgroundColor: WASH,
        borderRadius: 6,
        padding: 10,
    },
    noteLabel: { fontSize: 6.5, color: MUTED, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 3 },
    noteText: { fontSize: 8, color: "#43292d", lineHeight: 1.4 },

    // Footer
    footer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: INK,
        paddingVertical: 9,
        paddingHorizontal: 36,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    footerText: { fontSize: 6.5, color: "#c9b9bc", letterSpacing: 1, textTransform: "uppercase" },
});

// Group consolidated manifest lines by product for a clean, readable layout.
function groupByProduct(manifest: VerdictManifestItem[]) {
    const groups = new Map<string, { product: string; total: number; lines: VerdictManifestItem[] }>();
    for (const item of manifest) {
        const g = groups.get(item.productName) ?? {
            product: item.productName,
            total: 0,
            lines: [],
        };
        g.lines.push(item);
        g.total += item.quantity;
        groups.set(item.productName, g);
    }
    return [...groups.values()];
}

function formatIssuedDate(iso: string) {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleString("en-NG", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
}

export function VerdictPdfDocument({ verdict }: { verdict: Verdict }) {
    const groups = groupByProduct(verdict.manifest);
    const issued = formatIssuedDate(verdict.createdAt);

    return (
        <Document
            title={`Production Verdict ${verdict.verdictRef}`}
            author={FELLOWSHIP.shortName}
            subject="Official Production Verdict"
        >
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header} fixed>
                    <View style={styles.headerLeft}>
                        {/* eslint-disable-next-line jsx-a11y/alt-text */}
                        <Image src={LOGOS.tenureIcon} style={styles.logo} />
                        <View>
                            <Text style={styles.brand}>{TENURE.brandLabel.toUpperCase()}</Text>
                            <Text style={styles.brandSub}>{FELLOWSHIP.shortName} · Production Directive</Text>
                        </View>
                    </View>
                    <View style={styles.docTitleWrap}>
                        <Text style={styles.docTitle}>PRODUCTION VERDICT</Text>
                        <Text style={styles.docRef}>{verdict.verdictRef}</Text>
                        <Text style={styles.docDate}>Issued {issued}</Text>
                    </View>
                </View>
                <View style={styles.accent} fixed />

                <View style={styles.body}>
                    {/* Meta strip */}
                    <View style={styles.metaRow}>
                        <View style={styles.metaCell}>
                            <Text style={styles.metaLabel}>Orders Covered</Text>
                            <Text style={styles.metaValue}>{verdict.orderCount}</Text>
                        </View>
                        <View style={styles.metaCell}>
                            <Text style={styles.metaLabel}>Total Units</Text>
                            <Text style={styles.metaValue}>{verdict.totalUnits}</Text>
                        </View>
                        <View style={styles.metaCell}>
                            <Text style={styles.metaLabel}>Total Value</Text>
                            <Text style={styles.metaValue}>{fmt(verdict.totalAmount)}</Text>
                        </View>
                        <View style={styles.metaCell}>
                            <Text style={styles.metaLabel}>Status</Text>
                            <Text style={styles.metaValue}>{verdict.status.toUpperCase()}</Text>
                        </View>
                    </View>

                    {/* Manifest */}
                    <Text style={styles.sectionTitle}>Production Manifest — What To Produce</Text>
                    {groups.map((g, gi) => (
                        <View key={gi} style={styles.manifestGroup} wrap={false}>
                            <View style={styles.manifestProduct}>
                                <Text style={styles.manifestProductName}>{g.product}</Text>
                                <Text style={styles.manifestProductQty}>{g.total} UNITS</Text>
                            </View>
                            {g.lines.map((line, li) => (
                                <View key={li} style={styles.manifestLine}>
                                    <Text style={styles.qtyChip}>{line.quantity}×</Text>
                                    <Text style={styles.variantLabel}>{line.variantLabel}</Text>
                                </View>
                            ))}
                        </View>
                    ))}

                    {/* Lower: orders + financials */}
                    <View style={styles.lower}>
                        <View style={styles.colLeft}>
                            <Text style={styles.sectionTitle}>Covered Orders</Text>
                            <View style={styles.tHead}>
                                <Text style={[styles.tHeadCell, styles.cRef]}>Ref</Text>
                                <Text style={[styles.tHeadCell, styles.cName]}>Customer</Text>
                                <Text style={[styles.tHeadCell, styles.cAmt]}>Amount</Text>
                            </View>
                            {verdict.orders.map((o) => (
                                <View key={o.id} style={styles.tRow} wrap={false}>
                                    <Text style={[styles.tCell, styles.cRef]}>{o.orderRef}</Text>
                                    <Text style={[styles.tCell, styles.cName]}>{o.customerName}</Text>
                                    <Text style={[styles.tCell, styles.cAmt]}>{fmt(o.totalAmount)}</Text>
                                </View>
                            ))}
                            <Text style={styles.noteText}>
                                {"\n"}Resolve full customer & item details from each order
                                reference in the admin app.
                            </Text>
                        </View>

                        <View style={styles.colRight}>
                            <Text style={styles.sectionTitle}>Financial Directive</Text>
                            <View style={styles.finRow}>
                                <Text style={styles.finLabel}>Gross order value</Text>
                                <Text style={styles.finValue}>{fmt(verdict.totalAmount)}</Text>
                            </View>
                            <View style={styles.finRow}>
                                <Text style={styles.finLabel}>Orders</Text>
                                <Text style={styles.finValue}>{verdict.orderCount}</Text>
                            </View>

                            <View style={styles.debitBox}>
                                <Text style={styles.debitLabel}>Total To Debit</Text>
                                <Text style={styles.debitValue}>{fmt(verdict.totalAmount)}</Text>
                            </View>

                            <View style={styles.bankBox}>
                                <Text style={[styles.metaLabel, { marginBottom: 5 }]}>
                                    Debit From Account
                                </Text>
                                <View style={styles.bankLine}>
                                    <Text style={styles.bankLabel}>Bank</Text>
                                    <Text style={styles.bankValue}>{verdict.bankName || "—"}</Text>
                                </View>
                                <View style={styles.bankLine}>
                                    <Text style={styles.bankLabel}>Account name</Text>
                                    <Text style={styles.bankValue}>{verdict.bankAccountName || "—"}</Text>
                                </View>
                                <View style={styles.bankLine}>
                                    <Text style={styles.bankLabel}>Account no.</Text>
                                    <Text style={styles.bankValue}>{verdict.bankAccountNumber || "—"}</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Optional note */}
                    {verdict.note ? (
                        <View style={styles.noteBox}>
                            <Text style={styles.noteLabel}>Directive Note</Text>
                            <Text style={styles.noteText}>{verdict.note}</Text>
                        </View>
                    ) : null}

                    {/* Authorization */}
                    <View style={{ marginTop: 18 }} wrap={false}>
                        <Text style={styles.sectionTitle}>Authorization</Text>
                        <View style={styles.authBox}>
                            <View style={styles.sigLine} />
                            <Text style={styles.sigName}>{verdict.issuedByName}</Text>
                            <Text style={styles.sigRole}>Authorizing Administrator</Text>
                            <Text style={styles.sigMeta}>{verdict.issuedByEmail}</Text>
                            <Text style={styles.sigMeta}>
                                {verdict.verdictRef} · Issued {issued}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer} fixed>
                    <Text style={styles.footerText}>
                        {TENURE.brandLabel} · Official Production Verdict
                    </Text>
                    <Text
                        style={styles.footerText}
                        render={({ pageNumber, totalPages }) =>
                            `${verdict.verdictRef}  ·  ${pageNumber}/${totalPages}`
                        }
                    />
                </View>
            </Page>
        </Document>
    );
}
