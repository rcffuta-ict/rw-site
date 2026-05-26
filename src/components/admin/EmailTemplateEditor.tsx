// components/admin/EmailTemplateEditor.tsx
"use client";

import { useState, useCallback } from "react";
import { updateEmailTemplate } from "@/lib/services/email-templates.service";
import type { EmailTemplate } from "@/lib/data/types";
import { toast } from "sonner";

interface EmailTemplateEditorProps {
    template: EmailTemplate;
    adminEmail?: string;
    onUpdate?: (updated: EmailTemplate) => void;
}

/**
 * Email Template Editor Component
 * Allows admins to edit template subject, body HTML, and active status.
 * Shows supported variables and has a live preview.
 */
export function EmailTemplateEditor({
    template,
    adminEmail,
    onUpdate,
}: EmailTemplateEditorProps) {
    const [formData, setFormData] = useState({
        subject: template.subject,
        bodyHtml: template.bodyHtml,
        isActive: template.isActive,
        label: template.label,
    });

    const [isSaving, setIsSaving] = useState(false);
    const [previewHtml, setPreviewHtml] = useState("");

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.currentTarget;
        setFormData((prev) => ({
            ...prev,
            [name]:
                type === "checkbox"
                    ? (e.currentTarget as HTMLInputElement).checked
                    : value,
        }));
    };

    const handlePreview = useCallback(() => {
        // Generate preview with sample data
        const sampleVars: Record<string, string> = {
            customer_name: "John Doe",
            order_ref: "FF3A9C",
            total_amount: "₦15,000",
            amount_paid: "₦10,000",
            balance: "₦5,000",
            items_html: `
        <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:14px;">
          <thead>
            <tr style="background:#fdf6e8;">
              <th style="padding:8px;text-align:left;color:#5c4a1e;">Item</th>
              <th style="padding:8px;text-align:left;color:#5c4a1e;">Variant</th>
              <th style="padding:8px;text-align:center;color:#5c4a1e;">Qty</th>
              <th style="padding:8px;text-align:right;color:#5c4a1e;">Price</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding:8px 0;border-bottom:1px solid #f0e8d6;">T-Shirt</td>
              <td style="padding:8px 0;border-bottom:1px solid #f0e8d6;color:#8b6914;">Black · L · Holy Spirit</td>
              <td style="padding:8px 0;border-bottom:1px solid #f0e8d6;text-align:center;">2</td>
              <td style="padding:8px 0;border-bottom:1px solid #f0e8d6;text-align:right;">₦7,500</td>
            </tr>
          </tbody>
        </table>
      `,
        };

        const preview = formData.bodyHtml.replace(
            /\{\{(\w+)\}\}/g,
            (_, key) => sampleVars[key] ?? `{{${key}}}`
        );

        setPreviewHtml(preview);
    }, [formData.bodyHtml]);

    const handleSave = async () => {
        if (!formData.subject.trim()) {
            toast.error("Subject is required");
            return;
        }
        if (!formData.bodyHtml.trim()) {
            toast.error("Body HTML is required");
            return;
        }

        setIsSaving(true);
        try {
            const result = await updateEmailTemplate(
                template.id,
                {
                    subject: formData.subject,
                    bodyHtml: formData.bodyHtml,
                    isActive: formData.isActive,
                    label: formData.label,
                },
                adminEmail
            );

            if (result.success && result.data) {
                toast.success("Template updated successfully");
                onUpdate?.(result.data);
            } else {
                toast.error(result.error || "Failed to update template");
            }
        } catch (err) {
            toast.error(`Error: ${String(err)}`);
        } finally {
            setIsSaving(false);
        }
    };

    const supportedVars = [
        { key: "customer_name", desc: "Customer first name" },
        { key: "order_ref", desc: "Order reference code (e.g. FF3A9C)" },
        { key: "total_amount", desc: "Total order amount (formatted with ₦)" },
        { key: "amount_paid", desc: "Amount paid so far (formatted with ₦)" },
        { key: "balance", desc: "Remaining balance (formatted with ₦)" },
        { key: "items_html", desc: "HTML table of order items" },
    ];

    return (
        <div className="space-y-6 bg-white rounded-lg border border-gray-200 p-6">
            {/* Header */}
            <div className="border-b pb-4">
                <h2 className="text-2xl font-semibold text-gray-900">{template.label}</h2>
                <p className="text-sm text-gray-500 mt-1">
                    Template key:{" "}
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {template.templateKey}
                    </code>
                </p>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
                {/* Label */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Template Label
                    </label>
                    <input
                        type="text"
                        name="label"
                        value={formData.label}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="e.g. Order Confirmed"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Display name for this template
                    </p>
                </div>

                {/* Subject */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Subject
                    </label>
                    <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="e.g. Your Order #{{order_ref}} is Confirmed"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Use {{ variable }} syntax for dynamic content
                    </p>
                </div>

                {/* Body HTML */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Body (HTML)
                    </label>
                    <textarea
                        name="bodyHtml"
                        value={formData.bodyHtml}
                        onChange={handleInputChange}
                        rows={12}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-sm"
                        placeholder="<p>Hi {{customer_name}},</p><p>Your order has been confirmed...</p>"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Raw HTML. The email shell and styling are added automatically.
                    </p>
                </div>

                {/* Active Toggle */}
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        name="isActive"
                        id="isActive"
                        checked={formData.isActive}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                    />
                    <label
                        htmlFor="isActive"
                        className="ml-2 block text-sm text-gray-700"
                    >
                        Template is active (used by email triggers)
                    </label>
                </div>
            </div>

            {/* Supported Variables */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h3 className="font-semibold text-sm text-blue-900 mb-2">
                    Supported Variables
                </h3>
                <div className="space-y-1">
                    {supportedVars.map((v) => (
                        <div key={v.key} className="text-sm">
                            <code className="text-xs bg-blue-100 px-2 py-0.5 rounded font-mono">
                                {`{{${v.key}}}`}
                            </code>
                            <span className="ml-2 text-blue-700">{v.desc}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Preview Section */}
            <div className="border-t pt-4">
                <button
                    onClick={handlePreview}
                    className="mb-3 inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                >
                    Preview
                </button>

                {previewHtml && (
                    <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                        <div className="bg-gray-100 px-4 py-2 text-xs font-mono text-gray-600 border-b">
                            Preview (sample data)
                        </div>
                        <div
                            className="p-4 max-h-96 overflow-auto"
                            dangerouslySetInnerHTML={{ __html: previewHtml }}
                        />
                    </div>
                )}
            </div>

            {/* Save Button */}
            <div className="flex justify-end gap-2 border-t pt-4">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 rounded-lg transition"
                >
                    {isSaving ? "Saving..." : "Save Template"}
                </button>
            </div>
        </div>
    );
}
