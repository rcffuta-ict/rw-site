// ─── Stats Service ────────────────────────────────────────────────────────────
// import { DEMO_MODE } from "@/lib/config";
// import { getDemoStats } from "@/lib/data/orders";

export interface DashboardStats {
    totalOrders: number;
    totalRevenue: number;
    pendingReview: number;
    flaggedOrders: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
    // TODO: replace with ICT team's Supabase library call
    throw new Error("Live stats fetch not yet implemented");
}
