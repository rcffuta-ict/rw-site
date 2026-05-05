"use client";

import React from "react";
import { Payment } from "@/lib/data/types";
import { PaymentReviewCard } from "../PaymentReviewCard";

export function PaymentHistory({ payments }: { payments: Payment[] }) {
    const handleApprove = (id: string) => {
        console.log("Approve", id);
        // In a real app, this would be a server action or API call
        alert(`Payment ${id} approved (Demo Mode)`);
    };

    const handleFlag = (id: string, note: string) => {
        console.log("Flag", id, note);
        alert(`Payment ${id} flagged: ${note} (Demo Mode)`);
    };

    const handleReject = (id: string, note: string) => {
        console.log("Reject", id, note);
        alert(`Payment ${id} rejected: ${note} (Demo Mode)`);
    };

    if (payments.length === 0) {
        return (
            <div className="rw-card p-10 text-center">
                <p className="text-rw-muted font-medium italic">
                    No payment submissions found for this order.
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            {payments.map((p) => (
                <div key={p.id} className="animate-scale-in">
                    <PaymentReviewCard
                        payment={p}
                        onApprove={handleApprove}
                        onFlag={handleFlag}
                        onReject={handleReject}
                    />
                </div>
            ))}
        </div>
    );
}
