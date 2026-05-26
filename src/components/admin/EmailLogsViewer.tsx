// components/admin/EmailLogsViewer.tsx
"use client";

import type { EmailLog } from "@/lib/data/types";
import { formatDistanceToNow } from "date-fns";

interface EmailLogsViewerProps {
    logs: EmailLog[];
}

/**
 * Display recent email send logs
 */
export function EmailLogsViewer({ logs }: EmailLogsViewerProps) {
    if (logs.length === 0) {
        return (
            <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
                <p className="text-gray-500">No email logs yet</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th className="px-4 py-3 text-left font-medium text-gray-700">
                            Sent
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-gray-700">
                            Template
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-gray-700">
                            Recipient
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-gray-700">
                            Status
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-gray-700">
                            Subject
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {logs.map((log) => (
                        <tr key={log.id} className="hover:bg-gray-50 transition">
                            <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                                {formatDistanceToNow(new Date(log.sentAt), {
                                    addSuffix: true,
                                })}
                            </td>
                            <td className="px-4 py-3">
                                <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                                    {log.templateKey}
                                </code>
                            </td>
                            <td className="px-4 py-3 text-gray-700 truncate">
                                {log.recipientEmail}
                            </td>
                            <td className="px-4 py-3">
                                {log.success ? (
                                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                                        ✓ Sent
                                    </span>
                                ) : (
                                    <span
                                        className="inline-flex items-center px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded cursor-help"
                                        title={log.errorMessage || "Unknown error"}
                                    >
                                        ✗ Failed
                                    </span>
                                )}
                            </td>
                            <td className="px-4 py-3 text-gray-700 truncate">
                                {log.subject || "—"}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
