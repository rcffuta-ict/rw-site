/**
 * Placeholder webhook endpoint for Squad callbacks.
 *
 * When we enable Squad:
 * - verify webhook signature (per Squad docs)
 * - confirm transaction status by querying Squad API
 * - update order status to confirmed
 */
export async function POST() {
    return Response.json({ ok: true });
}
