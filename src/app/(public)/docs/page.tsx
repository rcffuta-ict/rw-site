"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/forms/Button";
import { BrandDisplay } from "@/components/common/BrandDisplay";
import { TENURE } from "@/lib/config";

type DocSection = "overview" | "shopping" | "fulfil" | "orders";

export default function DocsPage() {
    const [activeSection, setActiveSection] = useState<DocSection>("overview");

    const sections: { id: DocSection; label: string }[] = [
        { id: "overview", label: "Overview" },
        { id: "shopping", label: "Shopping & Checkout" },
        { id: "fulfil", label: "Payment & Fulfillment" },
        { id: "orders", label: "Order Lookup" },
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Premium Hero Banner */}
            <div className="relative overflow-hidden bg-gradient-to-br from-rw-crimson via-rw-crimson/95 to-purple-900 min-h-[340px] md:min-h-[420px] flex items-center border-b border-black/10">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,white_0.5px,transparent_0.5px)] bg-[length:20px_20px]" />
                </div>

                {/* Gradient overlays for smooth transition */}
                <div className="absolute inset-0 bg-gradient-to-r from-rw-crimson via-rw-crimson/60 to-transparent md:block hidden" />
                <div className="absolute inset-0 bg-rw-crimson/80 md:hidden block" />

                {/* Bottom feather effect */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-rw-crimson via-rw-crimson/40 to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white/10 to-transparent pointer-events-none" />

                {/* Content */}
                <div className="section-container relative z-10 w-full py-16 md:py-24">
                    <p className="eyebrow mb-3 !text-amber-300 tracking-widest text-xs uppercase font-semibold">
                        Complete Ordering Guide
                    </p>

                    <h1
                        className="font-display font-extrabold text-white leading-none tracking-tight"
                        style={{ fontSize: "clamp(2.5rem, 5.5vw, 4.5rem)" }}
                    >
                        How to Order
                    </h1>

                    <p className="mt-4 text-white/80 text-sm md:text-base leading-relaxed max-w-[50ch]">
                        Everything you need to know about shopping, paying, and completing
                        your {TENURE.brandLabel} order. Follow our simple step-by-step
                        guide.
                    </p>
                </div>
            </div>

            {/* Branded Section */}
            <div className="bg-gradient-to-b from-slate-50/60 to-white py-12">
                <div className="section-container">
                    <BrandDisplay />
                </div>
            </div>

            {/* Navigation Tabs with Content */}
            <div className="bg-gradient-to-b from-slate-50/60 to-white py-16">
                <div className="section-container">
                    {/* Tabs */}
                    <div className="mb-12">
                        <div className="flex gap-3 border-b border-slate-200 pb-4 overflow-x-auto">
                            {sections.map((section) => (
                                <button
                                    key={section.id}
                                    onClick={() => setActiveSection(section.id)}
                                    className={`px-4 py-2 font-semibold text-sm whitespace-nowrap transition-all border-b-2 -mb-4 ${
                                        activeSection === section.id
                                            ? "border-rw-crimson text-rw-crimson"
                                            : "border-transparent text-slate-600 hover:text-slate-900"
                                    }`}
                                >
                                    {section.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content Sections */}
                    <div className="max-w-4xl">
                        {/* Overview */}
                        {activeSection === "overview" && (
                            <div className="space-y-12 animate-fade-in">
                                <div className="space-y-4">
                                    <h2 className="font-display font-bold text-3xl text-rw-ink">
                                        Welcome to {TENURE.brandLabel}
                                    </h2>
                                    <p className="text-lg text-rw-text-2 leading-relaxed">
                                        The {TENURE.brandLabel} Pre-Order Platform is
                                        designed to make ordering and payment simple and
                                        secure. Whether you&apos;re purchasing merchandise
                                        or event items, follow the three simple steps
                                        below to complete your order.
                                    </p>
                                </div>

                                <div className="grid md:grid-cols-3 gap-6">
                                    {[
                                        {
                                            num: "1",
                                            title: "Create Your Cart",
                                            desc: "Browse items and add them to your cart. Checkout to create an order.",
                                        },
                                        {
                                            num: "2",
                                            title: "Get Order Reference",
                                            desc: "After checkout, you'll receive a unique order reference number.",
                                        },
                                        {
                                            num: "3",
                                            title: "Submit Payment",
                                            desc: "Use your order reference in the fulfillment section to submit proof of payment.",
                                        },
                                    ].map((step) => (
                                        <div
                                            key={step.num}
                                            className="rw-card p-8 border-t-4 border-t-rw-crimson hover:shadow-lg transition-shadow"
                                        >
                                            <div className="h-12 w-12 bg-rw-crimson text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">
                                                {step.num}
                                            </div>
                                            <h3 className="font-bold text-lg text-rw-ink mb-2">
                                                {step.title}
                                            </h3>
                                            <p className="text-sm text-rw-text-2">
                                                {step.desc}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                <div className="rw-card p-8 bg-blue-50 border-l-4 border-l-blue-500">
                                    <h3 className="font-bold text-lg text-blue-900 mb-3 flex items-center gap-2">
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                        Secure Payment Processing
                                    </h3>
                                    <p className="text-sm text-blue-800">
                                        All transactions are secure. You can make payment
                                        through our verified bank account using bank
                                        transfer. Your receipt is uploaded and reviewed by
                                        the Merch Committee to ensure accuracy before
                                        approval.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Shopping & Checkout */}
                        {activeSection === "shopping" && (
                            <div className="space-y-12 animate-fade-in">
                                <div className="space-y-4">
                                    <h2 className="font-display font-bold text-3xl text-rw-ink">
                                        Shopping & Checkout
                                    </h2>
                                    <p className="text-lg text-rw-text-2">
                                        Step-by-step guide to creating your cart and
                                        completing checkout.
                                    </p>
                                </div>

                                <div className="space-y-8">
                                    <div className="border-l-4 border-l-rw-crimson pl-6">
                                        <h3 className="font-bold text-xl text-rw-ink mb-3">
                                            1. Browse the Shop
                                        </h3>
                                        <p className="text-rw-text-2 mb-4">
                                            Visit the{" "}
                                            <Link
                                                href="/shop"
                                                className="text-rw-crimson font-semibold hover:underline"
                                            >
                                                Shop page
                                            </Link>{" "}
                                            to view all available items. Each product
                                            displays:
                                        </p>
                                        <ul className="space-y-2 ml-4 text-rw-text-2">
                                            <li className="flex items-start gap-2">
                                                <span className="text-rw-crimson font-bold">
                                                    •
                                                </span>
                                                <span>Product name and description</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-rw-crimson font-bold">
                                                    •
                                                </span>
                                                <span>Available colors/variants</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-rw-crimson font-bold">
                                                    •
                                                </span>
                                                <span>Price per item</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-rw-crimson font-bold">
                                                    •
                                                </span>
                                                <span>Product images</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="border-l-4 border-l-rw-crimson pl-6">
                                        <h3 className="font-bold text-xl text-rw-ink mb-3">
                                            2. Select Items
                                        </h3>
                                        <p className="text-rw-text-2 mb-4">
                                            Click on a product to view details and select:
                                        </p>
                                        <ul className="space-y-2 ml-4 text-rw-text-2">
                                            <li className="flex items-start gap-2">
                                                <span className="text-rw-crimson font-bold">
                                                    •
                                                </span>
                                                <span>
                                                    <strong>Color/Variant:</strong> Choose
                                                    from available options
                                                </span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-rw-crimson font-bold">
                                                    •
                                                </span>
                                                <span>
                                                    <strong>Quantity:</strong> Enter how
                                                    many you want
                                                </span>
                                            </li>
                                        </ul>
                                        <p className="text-sm text-rw-muted mt-4">
                                            The total price will automatically update
                                            based on your selections.
                                        </p>
                                    </div>

                                    <div className="border-l-4 border-l-rw-crimson pl-6">
                                        <h3 className="font-bold text-xl text-rw-ink mb-3">
                                            3. Add to Cart
                                        </h3>
                                        <p className="text-rw-text-2">
                                            Click the &ldquo;Add to Cart&rdquo; button.
                                            Your items are now saved in your cart. You can
                                            continue shopping or proceed to checkout.
                                        </p>
                                    </div>

                                    <div className="border-l-4 border-l-rw-crimson pl-6">
                                        <h3 className="font-bold text-xl text-rw-ink mb-3">
                                            4. Review Cart
                                        </h3>
                                        <p className="text-rw-text-2 mb-4">
                                            Click the cart icon to review your items:
                                        </p>
                                        <ul className="space-y-2 ml-4 text-rw-text-2">
                                            <li className="flex items-start gap-2">
                                                <span className="text-rw-crimson font-bold">
                                                    •
                                                </span>
                                                <span>View all items in your cart</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-rw-crimson font-bold">
                                                    •
                                                </span>
                                                <span>
                                                    Adjust quantities or remove items
                                                </span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-rw-crimson font-bold">
                                                    •
                                                </span>
                                                <span>See your total amount</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="border-l-4 border-l-rw-crimson pl-6">
                                        <h3 className="font-bold text-xl text-rw-ink mb-3">
                                            5. Checkout
                                        </h3>
                                        <p className="text-rw-text-2 mb-4">
                                            Click &ldquo;Proceed to Checkout&rdquo;.
                                            You&apos;ll need to provide:
                                        </p>
                                        <ul className="space-y-2 ml-4 text-rw-text-2">
                                            <li className="flex items-start gap-2">
                                                <span className="text-rw-crimson font-bold">
                                                    •
                                                </span>
                                                <span>
                                                    <strong>Full Name</strong>
                                                </span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-rw-crimson font-bold">
                                                    •
                                                </span>
                                                <span>
                                                    <strong>Email Address</strong>
                                                </span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="border-l-4 border-l-green-500 pl-6">
                                        <h3 className="font-bold text-xl text-green-900 mb-3">
                                            6. Order Created!
                                        </h3>
                                        <p className="text-green-800 mb-4 font-semibold">
                                            ✓ Your order has been created successfully
                                        </p>
                                        <p className="text-rw-text-2 mb-4">
                                            You&apos;ll see:
                                        </p>
                                        <ul className="space-y-2 ml-4 text-rw-text-2">
                                            <li className="flex items-start gap-2">
                                                <span className="text-green-600 font-bold">
                                                    ✓
                                                </span>
                                                <span>
                                                    <strong>Order Reference:</strong> A
                                                    unique ID (e.g., ABC123)
                                                </span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-green-600 font-bold">
                                                    ✓
                                                </span>
                                                <span>
                                                    <strong>Total Amount:</strong> The
                                                    exact amount to transfer
                                                </span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-green-600 font-bold">
                                                    ✓
                                                </span>
                                                <span>
                                                    <strong>Bank Details:</strong> Where
                                                    to send your payment
                                                </span>
                                            </li>
                                        </ul>
                                        <p className="text-rw-text-2 mt-4">
                                            <strong>Save your order reference!</strong>{" "}
                                            You&apos;ll need it in the next step.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Payment & Fulfillment */}
                        {activeSection === "fulfil" && (
                            <div className="space-y-12 animate-fade-in">
                                <div className="space-y-4">
                                    <h2 className="font-display font-bold text-3xl text-rw-ink">
                                        Payment &amp; Fulfillment
                                    </h2>
                                    <p className="text-lg text-rw-text-2">
                                        Complete your payment using bank transfer and
                                        submit proof of payment.
                                    </p>
                                </div>

                                <div className="rw-card p-8 bg-amber-50 border-l-4 border-l-amber-600 mb-8">
                                    <h3 className="font-bold text-lg text-amber-900 mb-2">
                                        📌 Before You Start
                                    </h3>
                                    <p className="text-sm text-amber-800">
                                        Make sure you have your{" "}
                                        <strong>Order Reference</strong> from the checkout
                                        confirmation. This is what links your payment to
                                        your order.
                                    </p>
                                </div>

                                <div className="space-y-8">
                                    <div className="border-l-4 border-l-rw-crimson pl-6">
                                        <h3 className="font-bold text-xl text-rw-ink mb-3">
                                            Step 1: Go to Fulfillment
                                        </h3>
                                        <p className="text-rw-text-2">
                                            Navigate to the{" "}
                                            <Link
                                                href="/fulfil"
                                                className="text-rw-crimson font-semibold hover:underline"
                                            >
                                                Fulfillment Page
                                            </Link>
                                            . Here you&apos;ll submit your payment proof.
                                        </p>
                                    </div>

                                    <div className="border-l-4 border-l-rw-crimson pl-6">
                                        <h3 className="font-bold text-xl text-rw-ink mb-3">
                                            Step 2: Enter Your Order Reference
                                        </h3>
                                        <p className="text-rw-text-2 mb-3">
                                            Input your order reference (e.g., ABC123). The
                                            system will pull up your order details
                                            automatically.
                                        </p>
                                        <div className="bg-rw-bg-alt p-4 rounded-lg">
                                            <p className="text-sm text-rw-muted font-mono">
                                                Example: <strong>ABC123</strong>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="border-l-4 border-l-rw-crimson pl-6">
                                        <h3 className="font-bold text-xl text-rw-ink mb-3">
                                            Step 3: Choose Payment Type
                                        </h3>
                                        <p className="text-rw-text-2 mb-4">
                                            Select how you want to pay:
                                        </p>
                                        <div className="space-y-4 ml-4">
                                            <div className="rw-card p-4 bg-rw-bg-alt">
                                                <p className="font-semibold text-rw-ink mb-2">
                                                    💰 Pay in Full
                                                </p>
                                                <p className="text-sm text-rw-text-2">
                                                    Pay the complete order amount at once.
                                                    The amount you transfer{" "}
                                                    <strong>must exactly match</strong>{" "}
                                                    the order total.
                                                </p>
                                            </div>
                                            <div className="rw-card p-4 bg-rw-bg-alt">
                                                <p className="font-semibold text-rw-ink mb-2">
                                                    📅 Pay in Part (if available)
                                                </p>
                                                <p className="text-sm text-rw-text-2">
                                                    Make a deposit now and pay the balance
                                                    later. You&apos;ll enter the amount
                                                    you&apos;re paying now.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-l-4 border-l-rw-crimson pl-6">
                                        <h3 className="font-bold text-xl text-rw-ink mb-3">
                                            Step 4: Make Your Bank Transfer
                                        </h3>
                                        <p className="text-rw-text-2 mb-4">
                                            Transfer the specified amount to:
                                        </p>
                                        <div className="bg-rw-bg-alt p-6 rounded-lg space-y-3 ml-4">
                                            <div>
                                                <p className="text-xs text-rw-muted uppercase tracking-wide">
                                                    Bank
                                                </p>
                                                <p className="font-bold text-rw-ink">
                                                    [Whatever you see as Bank]
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-rw-muted uppercase tracking-wide">
                                                    Account Name
                                                </p>
                                                <p className="font-bold text-rw-ink">
                                                    [Whatever name you see as account
                                                    name]
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-rw-muted uppercase tracking-wide">
                                                    Account Number
                                                </p>
                                                <p className="font-mono text-lg font-bold text-rw-crimson">
                                                    [Whatever the account number is given]
                                                </p>
                                            </div>
                                        </div>
                                        <p className="text-sm text-rw-muted mt-4 ml-4">
                                            💡 Tip: Include your order reference in the
                                            transfer narration/description for easier
                                            verification. We recommend banks like{" "}
                                            <strong>OPAY</strong>, <strong>KUDA</strong>,{" "}
                                            <strong>Access Bank</strong>, and{" "}
                                            <strong>GTBank</strong> whose receipts show
                                            clear transaction details.
                                        </p>
                                    </div>

                                    <div className="border-l-4 border-l-rw-crimson pl-6">
                                        <h3 className="font-bold text-xl text-rw-ink mb-3">
                                            Step 5: Upload Receipt
                                        </h3>
                                        <p className="text-rw-text-2 mb-4">
                                            Once transferred, take a screenshot or photo
                                            of your receipt. Upload it on the fulfillment
                                            page.
                                        </p>
                                        <div className="bg-blue-50 p-4 rounded-lg ml-4">
                                            <p className="text-sm text-blue-900 font-semibold mb-2">
                                                ✓ Accepted formats:
                                            </p>
                                            <p className="text-sm text-blue-800">
                                                JPG, PNG, or any common image format (Max
                                                6MB)
                                            </p>
                                        </div>
                                    </div>

                                    <div className="border-l-4 border-l-rw-crimson pl-6">
                                        <h3 className="font-bold text-xl text-rw-ink mb-3">
                                            Step 6: Receipt Review
                                        </h3>
                                        <p className="text-rw-text-2 mb-4">
                                            The system will analyze your receipt and
                                            confirm the extracted information:
                                        </p>
                                        <ul className="space-y-2 ml-4 text-rw-text-2">
                                            <li className="flex items-start gap-2">
                                                <span className="text-rw-crimson font-bold">
                                                    •
                                                </span>
                                                <span>Sender name</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-rw-crimson font-bold">
                                                    •
                                                </span>
                                                <span>Amount transferred</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-rw-crimson font-bold">
                                                    •
                                                </span>
                                                <span>Date and time</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-rw-crimson font-bold">
                                                    •
                                                </span>
                                                <span>Bank and reference</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="border-l-4 border-l-rw-crimson pl-6">
                                        <h3 className="font-bold text-xl text-rw-ink mb-3">
                                            Step 7: Verify &amp; Confirm
                                        </h3>
                                        <p className="text-rw-text-2 mb-4">
                                            Review the extracted information and confirm
                                            it&apos;s correct:
                                        </p>
                                        <div className="bg-green-50 p-4 rounded-lg ml-4 mb-4">
                                            <p className="text-sm text-green-900 font-semibold mb-2">
                                                ✓ What we check:
                                            </p>
                                            <ul className="space-y-1 text-sm text-green-800">
                                                <li>
                                                    • Amount matches your order (or
                                                    deposit amount for partial payments)
                                                </li>
                                                <li>• Transfer is recent</li>
                                                <li>• Sent to the correct account</li>
                                            </ul>
                                        </div>
                                        <p className="text-rw-text-2 mt-4">
                                            If everything looks good, click &ldquo;Confirm
                                            &amp; Complete&rdquo;. If there are issues,
                                            re-upload a clearer receipt image.
                                        </p>
                                    </div>

                                    <div className="border-l-4 border-l-green-500 pl-6">
                                        <h3 className="font-bold text-xl text-green-900 mb-3">
                                            ✓ Payment Submitted!
                                        </h3>
                                        <p className="text-green-800 mb-4">
                                            Your receipt has been submitted for review.
                                            The Merch Committee will verify it and update
                                            your order status.
                                        </p>
                                        <div className="bg-green-50 p-4 rounded-lg ml-4">
                                            <p className="text-sm text-green-800 mb-2">
                                                <strong>Next:</strong>
                                            </p>
                                            <ul className="space-y-1 text-sm text-green-800">
                                                <li>
                                                    • Merch Committee reviews your receipt
                                                </li>
                                                <li>
                                                    • Order status updates to
                                                    &ldquo;Approved&rdquo;
                                                </li>
                                                <li>• Confirmation email sent to you</li>
                                                <li>• Order moves to production</li>
                                            </ul>
                                        </div>
                                        <p className="text-rw-text-2 mt-4">
                                            <strong>Check your email regularly</strong>{" "}
                                            for updates on your order status and any
                                            additional information from the Merch
                                            Committee.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Order Lookup */}
                        {activeSection === "orders" && (
                            <div className="space-y-12 animate-fade-in">
                                <div className="space-y-4">
                                    <h2 className="font-display font-bold text-3xl text-rw-ink">
                                        Order Lookup
                                    </h2>
                                    <p className="text-lg text-rw-text-2">
                                        Track any order in the system using its order
                                        reference.
                                    </p>
                                </div>

                                <div className="rw-card p-8 bg-rw-bg-alt border-t-4 border-t-rw-crimson">
                                    <h3 className="font-bold text-xl text-rw-ink mb-4">
                                        How to Look Up an Order
                                    </h3>
                                    <ol className="space-y-4 list-decimal list-inside text-rw-text-2">
                                        <li>
                                            <span className="font-semibold">
                                                Visit the Orders page:
                                            </span>{" "}
                                            <Link
                                                href="/orders"
                                                className="text-rw-crimson font-semibold hover:underline"
                                            >
                                                /orders
                                            </Link>
                                        </li>
                                        <li>
                                            <span className="font-semibold">
                                                Enter your order reference:
                                            </span>{" "}
                                            Enter the order ID (e.g., ABC123)
                                        </li>
                                        <li>
                                            <span className="font-semibold">
                                                Enter your email:
                                            </span>{" "}
                                            Provide the email used when creating the order
                                        </li>
                                        <li>
                                            <span className="font-semibold">
                                                Click &ldquo;Search&rdquo;:
                                            </span>{" "}
                                            The system will retrieve your order details
                                        </li>
                                    </ol>
                                </div>

                                <div className="rw-card p-8">
                                    <h3 className="font-bold text-xl text-rw-ink mb-4">
                                        Order Status Timeline
                                    </h3>
                                    <p className="text-rw-text-2 mb-6">
                                        Track your order&apos;s progress through these
                                        stages:
                                    </p>
                                    <div className="space-y-4">
                                        {[
                                            {
                                                status: "pending",
                                                desc: "Order created, awaiting payment",
                                            },
                                            {
                                                status: "flagged",
                                                desc: "Payment received, under review by admin",
                                            },
                                            {
                                                status: "approved",
                                                desc: "Payment verified and approved",
                                            },
                                            {
                                                status: "in_production",
                                                desc: "Your items are being prepared",
                                            },
                                            {
                                                status: "delivered",
                                                desc: "Order completed and ready/delivered",
                                            },
                                            {
                                                status: "cancelled",
                                                desc: "Order was cancelled",
                                            },
                                        ].map((stage) => (
                                            <div
                                                key={stage.status}
                                                className="flex items-start gap-4 pb-4 border-b border-[var(--rw-border)] last:border-0"
                                            >
                                                <div className="flex-shrink-0">
                                                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-rw-crimson text-white text-xs font-bold">
                                                        ✓
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="font-bold text-rw-ink capitalize">
                                                        {stage.status.replace("_", " ")}
                                                    </p>
                                                    <p className="text-sm text-rw-text-2 mt-1">
                                                        {stage.desc}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="rw-card p-8 bg-blue-50 border-l-4 border-l-blue-500">
                                    <h3 className="font-bold text-lg text-blue-900 mb-3">
                                        💡 Pro Tips
                                    </h3>
                                    <ul className="space-y-3 text-sm text-blue-800">
                                        <li className="flex items-start gap-3">
                                            <span className="flex-shrink-0 font-bold">
                                                •
                                            </span>
                                            <span>
                                                <strong>
                                                    Save your order reference:
                                                </strong>{" "}
                                                You&apos;ll need it for payment and order
                                                lookup
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <span className="flex-shrink-0 font-bold">
                                                •
                                            </span>
                                            <span>
                                                <strong>Check your email:</strong> Status
                                                updates are sent to your registered email
                                                address
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <span className="flex-shrink-0 font-bold">
                                                •
                                            </span>
                                            <span>
                                                <strong>Use exact email:</strong> Order
                                                lookup requires the exact email used at
                                                checkout
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* CTA Banner */}
            <div className="bg-white border-t border-slate-200 py-16">
                <div className="section-container">
                    <div className="rw-card p-8 md:p-12 bg-gradient-to-r from-rw-crimson/10 to-rw-crimson/5 border-l-4 border-l-rw-crimson">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                            <div>
                                <p className="text-sm font-bold text-rw-crimson uppercase tracking-widest mb-2">
                                    Ready?
                                </p>
                                <h3 className="font-display font-bold text-3xl text-rw-ink mb-2">
                                    Start Shopping Now
                                </h3>
                                <p className="text-rw-text-2 max-w-lg">
                                    Get your {TENURE.brandLabel} merchandise secured with
                                    our easy 3-step process.
                                </p>
                            </div>
                            <div className="flex gap-3 flex-wrap md:flex-nowrap">
                                <Link href="/shop">
                                    <Button variant="outlined" size="lg">
                                        Browse Items
                                    </Button>
                                </Link>
                                <Link href="/checkout">
                                    <Button variant="primary" size="lg">
                                        Checkout
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
