"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/forms/Button";
import { TENURE } from "@/lib/config";

type DocSection = "overview" | "shopping" | "fulfil" | "orders";

const sections: { id: DocSection; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "shopping", label: "Shopping & Checkout" },
    { id: "fulfil", label: "Payment & Fulfillment" },
    { id: "orders", label: "Order Lookup" },
];

export default function DocsPage() {
    const [activeSection, setActiveSection] = useState<DocSection>("overview");

    return (
        <>
            <div className="flex flex-col lg:flex-row gap-10 mt-10">
                {/* Sidebar Navigation - Desktop Only */}
                <div className="w-72 hidden lg:block sticky top-20 self-start">
                    <div className="text-sm font-semibold text-rw-ink mb-4 px-3">
                        TABLE OF CONTENTS
                    </div>
                    <nav className="space-y-1">
                        {sections.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className={`w-full text-left px-4 py-3.5 rounded-2xl transition-all flex items-center gap-3 text-[15px] ${
                                    activeSection === section.id
                                        ? "bg-rw-crimson text-white font-medium shadow-sm"
                                        : "hover:bg-slate-100 text-slate-700"
                                }`}
                            >
                                {section.label}
                            </button>
                        ))}
                    </nav>

                    <div className="mt-10 px-3">
                        <Link href="/shop">
                            <Button variant="primary" className="w-full">
                                Start Shopping
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 min-w-0">
                    {/* Mobile Tabs */}
                    <div className="lg:hidden mb-8 -mx-1">
                        <div className="flex gap-2 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
                            {sections.map((section) => (
                                <button
                                    key={section.id}
                                    onClick={() => setActiveSection(section.id)}
                                    className={`px-6 py-3 whitespace-nowrap font-medium rounded-2xl text-sm transition-all snap-start flex-shrink-0 ${
                                        activeSection === section.id
                                            ? "bg-rw-crimson text-white shadow-sm"
                                            : "bg-slate-100 text-slate-700 active:bg-slate-200"
                                    }`}
                                >
                                    {section.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content Sections */}
                    <div className="space-y-16 md:space-y-20">
                        {activeSection === "overview" && <OverviewSection />}
                        {activeSection === "shopping" && <ShoppingSection />}
                        {activeSection === "fulfil" && <FulfillmentSection />}
                        {activeSection === "orders" && <OrderLookupSection />}
                    </div>
                </div>
            </div>

            {/* CTA Banner */}
            <>
                <div className="rw-card p-8 md:p-12 bg-gradient-to-r from-rw-crimson/10 to-amber-50 border border-rw-crimson/20">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                        <div>
                            <p className="uppercase tracking-widest text-rw-crimson text-sm font-bold mb-2">
                                Ready to begin?
                            </p>
                            <h3 className="font-display text-3xl font-bold text-rw-ink">
                                Start your order now
                            </h3>
                        </div>
                        <Link href="/shop">
                            <Button size="lg" variant="primary" className="min-w-[180px]">
                                Browse Merchandise →
                            </Button>
                        </Link>
                    </div>
                </div>
            </>
        </>
    );
}

/* ====================== SECTION COMPONENTS ====================== */

function OverviewSection() {
    return (
        <div className="space-y-12">
            <div>
                <h2 className="font-display font-bold text-3xl md:text-4xl text-rw-ink mb-4">
                    Welcome to {TENURE.brandLabel} Pre-Order
                </h2>
                <p className="text-lg text-rw-text-2 leading-relaxed">
                    Our platform is built to make ordering simple, transparent, and
                    secure.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {[
                    { num: "1", title: "Create Your Cart", desc: "Browse and add items" },
                    {
                        num: "2",
                        title: "Get Order Reference",
                        desc: "Checkout to receive your unique ID",
                    },
                    { num: "3", title: "Submit Payment", desc: "Pay via bank transfer" },
                ].map((step) => (
                    <div
                        key={step.num}
                        className="rw-card p-7 md:p-8 border-t-4 border-t-rw-crimson hover:shadow-lg transition-all"
                    >
                        <div className="h-11 w-11 bg-rw-crimson text-white rounded-2xl flex items-center justify-center font-bold text-2xl mb-6">
                            {step.num}
                        </div>
                        <h3 className="font-bold text-xl mb-2">{step.title}</h3>
                        <p className="text-rw-text-2">{step.desc}</p>
                    </div>
                ))}
            </div>

            <div className="rw-card p-7 md:p-8 bg-blue-50 border-l-4 border-l-blue-600">
                <h3 className="font-bold text-blue-900 mb-3">
                    Secure &amp; Transparent Process
                </h3>
                <p className="text-blue-800">
                    All payments are done via bank transfer. Your receipt is reviewed by
                    the Merch Committee before approval.
                </p>
            </div>
        </div>
    );
}

function ShoppingSection() {
    return (
        <div className="space-y-14">
            <div>
                <h2 className="font-display font-bold text-3xl md:text-4xl text-rw-ink">
                    Shopping &amp; Checkout
                </h2>
                <p className="text-lg text-rw-text-2 mt-3">
                    Step-by-step guide to building your cart
                </p>
            </div>

            <Step number="1" title="Browse the Shop">
                Visit the{" "}
                <Link
                    href="/shop"
                    className="text-rw-crimson hover:underline font-medium"
                >
                    Shop page
                </Link>{" "}
                and explore available items.
            </Step>

            <Step number="2" title="Select Options">
                Choose color/variant and quantity. The total updates automatically.
            </Step>

            <Step number="3" title="Add to Cart">
                Click &quot;Add to Cart&quot;. You can continue shopping or proceed.
            </Step>

            <Step number="4" title="Review & Checkout">
                Review items, adjust quantities, then click &quot;Proceed to
                Checkout&quot;.
            </Step>

            <Step number="5" title="Order Created" accent="green">
                You will receive an <strong>Order Reference</strong> (e.g., ABC123). Save
                this — you’ll need it for payment.
            </Step>
        </div>
    );
}

function FulfillmentSection() {
    return (
        <div className="space-y-14">
            <div>
                <h2 className="font-display font-bold text-3xl md:text-4xl text-rw-ink">
                    Payment &amp; Fulfillment
                </h2>
                <p className="text-lg text-rw-text-2 mt-3">
                    How to complete your payment
                </p>
            </div>

            <div className="rw-card p-7 md:p-8 bg-amber-50 border-l-4 border-l-amber-600">
                <p className="font-semibold text-amber-900">
                    Make sure you have your Order Reference before proceeding.
                </p>
            </div>

            <Step number="1" title="Go to Fulfillment">
                Navigate to the{" "}
                <Link
                    href="/fulfil"
                    className="text-rw-crimson hover:underline font-medium"
                >
                    Fulfillment page
                </Link>
                .
            </Step>

            <Step number="2" title="Enter Order Reference">
                Input your order ID. Your order details will load automatically.
            </Step>

            <Step number="3" title="Choose Payment Type">
                Pay in Full or Pay in Part (if available).
            </Step>

            <Step number="4" title="Make Bank Transfer">
                Transfer the exact amount to the provided account details.
            </Step>

            <Step number="5" title="Upload Receipt">
                Take a clear photo/screenshot and upload it.
            </Step>

            <Step number="6" title="Receipt Review & Confirmation">
                The system will extract details. Review and confirm.
            </Step>
        </div>
    );
}

function OrderLookupSection() {
    const statuses = [
        { key: "pending", label: "Pending", desc: "Order created, awaiting payment" },
        {
            key: "flagged",
            label: "Payment Received",
            desc: "Under review by Merch Committee",
        },
        { key: "approved", label: "Approved", desc: "Payment verified and approved" },
        {
            key: "in_production",
            label: "In Production",
            desc: "Your items are being prepared",
        },
        { key: "delivered", label: "Delivered", desc: "Order completed and delivered" },
        { key: "cancelled", label: "Cancelled", desc: "Order was cancelled" },
    ];

    return (
        <div className="space-y-12">
            <div>
                <h2 className="font-display font-bold text-3xl md:text-4xl text-rw-ink">
                    Order Lookup
                </h2>
                <p className="text-lg text-rw-text-2 mt-3">
                    Track your order status anytime
                </p>
            </div>

            <div className="rw-card p-7 md:p-8 bg-rw-bg-alt">
                <h3 className="font-bold text-xl mb-6">How to Check Your Order</h3>
                <ol className="space-y-6 list-decimal list-inside text-rw-text-2">
                    <li>
                        Go to{" "}
                        <Link href="/orders" className="text-rw-crimson hover:underline">
                            /orders
                        </Link>
                    </li>
                    <li>Enter your Order Reference</li>
                    <li>Enter the email used during checkout</li>
                    <li>Click Search</li>
                </ol>
            </div>

            {/* Order Status Timeline */}
            <div className="rw-card p-7 md:p-8">
                <h3 className="font-bold text-xl mb-8">Order Status Timeline</h3>

                <div className="relative pl-8 md:pl-10 space-y-10">
                    {statuses.map((status, index) => (
                        <div key={status.key} className="relative">
                            {/* Timeline Line */}
                            {index !== statuses.length - 1 && (
                                <div className="absolute left-[13px] md:left-[17px] top-8 bottom-[-40px] w-[2px] bg-gradient-to-b from-rw-crimson/30 to-transparent" />
                            )}

                            <div className="flex gap-5 items-start">
                                {/* Status Dot */}
                                <div className="flex-shrink-0 mt-1">
                                    <div className="h-7 w-7 rounded-full border-2 border-rw-crimson bg-white flex items-center justify-center">
                                        <div className="h-3 w-3 rounded-full bg-rw-crimson" />
                                    </div>
                                </div>

                                <div className="flex-1 pt-0.5">
                                    <p className="font-semibold text-rw-ink text-lg capitalize">
                                        {status.label}
                                    </p>
                                    <p className="text-rw-text-2 mt-1 leading-relaxed">
                                        {status.desc}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/* ====================== REUSABLE STEP ====================== */
function Step({
    number,
    title,
    children,
    accent = "crimson",
}: {
    number: string;
    title: string;
    children: React.ReactNode;
    accent?: "crimson" | "green";
}) {
    const borderColor = accent === "green" ? "border-l-green-500" : "border-l-rw-crimson";
    const textColor = accent === "green" ? "text-green-900" : "text-rw-ink";

    return (
        <div className={`border-l-4 ${borderColor} pl-6 md:pl-8 py-2`}>
            <div className="flex items-center gap-4 mb-4">
                <div className="h-8 w-8 md:h-9 md:w-9 rounded-2xl bg-white border-2 border-current flex items-center justify-center font-bold text-lg flex-shrink-0">
                    {number}
                </div>
                <h3 className={`font-bold text-xl md:text-2xl ${textColor}`}>{title}</h3>
            </div>
            <div className="text-rw-text-2 text-[17px] leading-relaxed pl-1 md:pl-2">
                {children}
            </div>
        </div>
    );
}
