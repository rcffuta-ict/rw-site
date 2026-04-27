export type MerchItem = {
    id: string;
    name: string;
    description: string;
    basePriceNgn: number;
    sizes: string[];
    active: boolean;
};

export type OrderLineInput = {
    merchItemId: string;
    size: string;
    qty: number;
};

export type OrderStatus =
    | "pending_payment"
    | "receipt_submitted"
    | "confirmed"
    | "rejected"
    | "fulfilled";

export type Order = {
    id: string;
    createdAt: string;
    status: OrderStatus;
    customerName: string;
    phone: string;
    email?: string;
    lines: Array<{
        merchItemId: string;
        merchItemName: string;
        size: string;
        qty: number;
        unitPriceNgn: number;
    }>;
    totalNgn: number;
    receipt?: {
        filename: string;
        uploadedAt: string;
    };
};
