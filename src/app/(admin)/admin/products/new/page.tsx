"use client";

import React, { useState } from "react";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import Link from "next/link";

export default function NewProductPage() {
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            alert("Product created successfully (Demo Mode)");
            setIsSaving(false);
        }, 1500);
    };

    return (
        <div className="flex flex-col gap-10 animate-fade-in pb-20">
            <AdminBreadcrumb
                items={[
                    { label: "Products", href: "/admin/products" },
                    { label: "Add New Product" }
                ]}
            />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-[var(--rw-border)] pb-8">
                <div className="flex flex-col gap-2">
                    <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-rw-ink tracking-tight">Create Product</h1>
                    <p className="text-sm text-rw-muted font-medium">Initialize a new base product and configure its primary attributes.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/admin/products" className="btn-secondary !h-12 px-8 text-sm font-bold">
                        Cancel
                    </Link>
                    <button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className="btn-primary !h-12 px-10 text-sm font-bold shadow-xl flex items-center gap-2"
                    >
                        {isSaving ? (
                            <>
                                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                                Saving...
                            </>
                        ) : (
                            "Publish Product"
                        )}
                    </button>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-2 flex flex-col gap-8">
                    {/* General Information */}
                    <div className="rw-card p-8 space-y-8">
                        <div className="flex items-center gap-2">
                            <span className="h-1 w-6 bg-rw-crimson rounded-full" />
                            <h2 className="font-display font-bold text-rw-ink text-lg uppercase tracking-wider">General Information</h2>
                        </div>

                        <div className="grid gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-bold text-rw-muted uppercase tracking-[0.2em]">Product Name</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. RW'26 Commemorative Tee"
                                    className="rw-input !bg-rw-bg-alt/50 focus:!bg-white"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-bold text-rw-muted uppercase tracking-[0.2em]">Description</label>
                                <textarea 
                                    rows={5}
                                    placeholder="Write a compelling description for this product..."
                                    className="rw-input !h-auto py-4 !bg-rw-bg-alt/50 focus:!bg-white resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Pricing & Logistics */}
                    <div className="rw-card p-8 space-y-8">
                        <div className="flex items-center gap-2">
                            <span className="h-1 w-6 bg-rw-crimson rounded-full" />
                            <h2 className="font-display font-bold text-rw-ink text-lg uppercase tracking-wider">Pricing & Logistics</h2>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-8">
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-bold text-rw-muted uppercase tracking-[0.2em]">Base Price (₦)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-rw-muted">₦</span>
                                    <input 
                                        type="number" 
                                        defaultValue={0}
                                        className="rw-input !pl-10 !bg-rw-bg-alt/50 focus:!bg-white font-mono font-bold"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-bold text-rw-muted uppercase tracking-[0.2em]">Category</label>
                                <select className="rw-input !bg-rw-bg-alt/50 focus:!bg-white appearance-none cursor-pointer">
                                    <option value="tshirt">T-Shirt</option>
                                    <option value="hoodie">Hoodie</option>
                                    <option value="accessory">Accessory</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Variants Preview */}
                    <div className="rw-card p-8 space-y-8 opacity-60">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="h-1 w-6 bg-rw-muted rounded-full" />
                                <h2 className="font-display font-bold text-rw-muted text-lg uppercase tracking-wider">Initial Variants</h2>
                            </div>
                            <span className="text-[10px] font-bold text-rw-crimson bg-rw-crimson/5 px-3 py-1 rounded-full uppercase tracking-widest">Auto-generated</span>
                        </div>
                        <p className="text-sm text-rw-muted italic">Variants will be configurable after the base product is initialized.</p>
                        <div className="h-24 border-2 border-dashed border-[var(--rw-border)] rounded-2xl flex items-center justify-center">
                            <span className="text-[11px] font-bold text-rw-muted uppercase tracking-widest">Locked Stage</span>
                        </div>
                    </div>
                </div>

                {/* Sidebar / Settings */}
                <div className="flex flex-col gap-8">
                    {/* Media Upload */}
                    <div className="rw-card p-8 space-y-6">
                        <div className="flex items-center gap-2">
                            <span className="h-1 w-6 bg-rw-crimson rounded-full" />
                            <h2 className="font-display font-bold text-rw-ink text-lg uppercase tracking-wider">Product Media</h2>
                        </div>
                        <div className="aspect-[3/4] rounded-2xl bg-rw-bg-alt border-2 border-dashed border-[var(--rw-border)] flex flex-col items-center justify-center gap-4 group cursor-pointer hover:bg-rw-bg-alt/80 transition-colors">
                            <div className="h-12 w-12 rounded-full bg-white shadow-sm flex items-center justify-center text-rw-muted group-hover:text-rw-crimson transition-colors">
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                            </div>
                            <div className="text-center">
                                <p className="text-xs font-bold text-rw-ink">Upload Primary Image</p>
                                <p className="text-[10px] text-rw-muted mt-1 uppercase tracking-widest">PNG, JPG up to 10MB</p>
                            </div>
                        </div>
                    </div>

                    {/* Visibility */}
                    <div className="rw-card p-8 space-y-6 bg-rw-ink text-white border-none shadow-xl">
                        <div className="flex items-center gap-2">
                            <span className="h-1 w-6 bg-rw-crimson rounded-full" />
                            <h2 className="font-display font-bold text-white text-lg uppercase tracking-wider">Visibility</h2>
                        </div>
                        <div className="space-y-4">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className="h-5 w-5 rounded-md border-2 border-white/20 flex items-center justify-center group-hover:border-rw-crimson transition-colors">
                                    <div className="h-2.5 w-2.5 rounded-sm bg-rw-crimson" />
                                </div>
                                <span className="text-sm font-bold">Active on Public Site</span>
                            </label>
                            <p className="text-[10px] text-white/50 leading-relaxed uppercase tracking-widest">
                                Setting this to active will immediately display the product in the storefront once variants are configured.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
