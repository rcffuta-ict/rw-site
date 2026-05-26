// app/(admin)/admin/email-templates/page.tsx
import { getEmailTemplates, getRecentEmailLogs, getEmailStats } from "@/lib/services/email-templates.service";
import { EmailTemplateEditor } from "@/components/admin/EmailTemplateEditor";
import { EmailLogsViewer } from "@/components/admin/EmailLogsViewer";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export default async function EmailTemplatesPage() {
    const templatesResult = await getEmailTemplates();
    const logsResult = await getRecentEmailLogs(20);
    const statsResult = await getEmailStats(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));

    // Get current admin info
    const supabase = createSupabaseAdminClient();
    const { data: { user } } = await supabase.auth.admin.getUserBySomething?.() || { data: { user: null } };

    if (!templatesResult.success) {
        return (
            <div className="p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="font-semibold text-red-900">Error Loading Templates</h3>
                    <p className="text-red-700 text-sm mt-1">{templatesResult.error}</p>
                </div>
            </div>
        );
    }

    const templates = templatesResult.data || [];
    const logs = logsResult.data || [];
    const stats = statsResult.data;

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Email Templates</h1>
                <p className="text-gray-600 mt-2">
                    Manage transactional email templates. Edit subjects, HTML bodies, and control which templates are active.
                </p>
            </div>

            {/* Email Stats */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <p className="text-sm text-gray-600">Total Sent (30 days)</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total_sent}</p>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <p className="text-sm text-gray-600">Successful</p>
                        <p className="text-2xl font-bold text-green-600 mt-1">{stats.successful}</p>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <p className="text-sm text-gray-600">Failed</p>
                        <p className="text-2xl font-bold text-red-600 mt-1">{stats.failed}</p>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <p className="text-sm text-gray-600">Success Rate</p>
                        <p className="text-2xl font-bold text-blue-600 mt-1">{stats.success_rate}%</p>
                    </div>
                </div>
            )}

            {/* Templates List */}
            <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Templates</h2>
                {templates.length === 0 ? (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-yellow-900">No templates configured. Run the seed script to create default templates.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {templates.map((template) => (
                            <details
                                key={template.id}
                                className="group border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition"
                            >
                                <summary className="px-4 py-3 bg-gray-50 cursor-pointer hover:bg-gray-100 flex items-center justify-between">
                                    <div>
                                        <h3 className="font-medium text-gray-900">{template.label}</h3>
                                        <p className="text-xs text-gray-500">
                                            {template.templateKey}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {template.isActive ? (
                                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                                                Active
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                                                Inactive
                                            </span>
                                        )}
                                        <svg
                                            className="w-5 h-5 text-gray-400 group-open:rotate-180 transition"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 14l-7 7m0 0l-7-7m7 7V3"
                                            />
                                        </svg>
                                    </div>
                                </summary>
                                <div className="p-4 border-t border-gray-200">
                                    <EmailTemplateEditor
                                        template={template}
                                        adminEmail={user?.email}
                                    />
                                </div>
                            </details>
                        ))}
                    </div>
                )}
            </div>

            {/* Recent Email Logs */}
            <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Email Sends</h2>
                <EmailLogsViewer logs={logs} />
            </div>
        </div>
    );
}
