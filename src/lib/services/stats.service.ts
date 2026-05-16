// ─── Stats Service ────────────────────────────────────────────────────────────
import { DEMO_MODE } from "@/lib/config";
import { getDemoStats } from "@/lib/data/orders";

export interface DashboardStats {
    totalOrders: number;
    totalRevenue: number;
    pendingReview: number;
    flaggedOrders: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
    if (DEMO_MODE) {
        const s = getDemoStats();
        return {
            totalOrders: s.total,
            totalRevenue: s.revenue,
            pendingReview: s.pending,
            flaggedOrders: s.flagged,
        };
    }
    // TODO: replace with ICT team's Supabase library call
    throw new Error("Live stats fetch not yet implemented");
}
