"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import type { Category } from "@/lib/data/types";
import {
    createCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,
} from "@/lib/services/categories.service";

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconGripVertical() {
    return (
        <svg
            className="h-4 w-4 text-rw-muted"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6h16.5M3.75 12h16.5M3.75 18h16.5"
            />
        </svg>
    );
}
function IconPencil() {
    return (
        <svg
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487z"
            />
        </svg>
    );
}
function IconTrash() {
    return (
        <svg
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
            />
        </svg>
    );
}
function IconCheck() {
    return (
        <svg
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m4.5 12.75 6 6 9-13.5"
            />
        </svg>
    );
}
function IconX() {
    return (
        <svg
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
    );
}
function IconPlus() {
    return (
        <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
    );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface CategoryDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    categories: Category[];
    onChanged: (updated: Category[]) => void; // notify parent of any change
    /** Product counts per category id — for guarding deletes */
    productCounts?: Record<string, number>;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CategoryDrawer({
    isOpen,
    onClose,
    categories: initialCategories,
    onChanged,
    productCounts = {},
}: CategoryDrawerProps) {
    const [categories, setCategories] = useState<Category[]>(initialCategories);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editLabel, setEditLabel] = useState("");
    const [editDesc, setEditDesc] = useState("");
    const [addLabel, setAddLabel] = useState("");
    const [addDesc, setAddDesc] = useState("");
    const [isPending, startTransition] = useTransition();

    function pushChange(updated: Category[]) {
        setCategories(updated);
        onChanged(updated);
    }

    // ─── Edit ─────────────────────────────────────────────────────────────────

    function startEdit(cat: Category) {
        setEditingId(cat.id);
        setEditLabel(cat.label);
        setEditDesc(cat.description ?? "");
    }

    function cancelEdit() {
        setEditingId(null);
    }

    function saveEdit(cat: Category) {
        if (!editLabel.trim()) {
            toast.error("Label is required.");
            return;
        }
        startTransition(async () => {
            const res = await updateCategory(cat.id, {
                label: editLabel.trim(),
                description: editDesc.trim() || null,
            });
            if (!res.success) {
                toast.error("Failed to update category", { description: res.error });
                return;
            }
            pushChange(categories.map((c) => (c.id === cat.id ? res.data! : c)));
            setEditingId(null);
            toast.success("Category updated");
        });
    }

    // ─── Toggle active ─────────────────────────────────────────────────────────

    function toggleActive(cat: Category) {
        startTransition(async () => {
            const res = await updateCategory(cat.id, { isActive: !cat.isActive });
            if (!res.success) {
                toast.error("Failed to toggle category", { description: res.error });
                return;
            }
            pushChange(categories.map((c) => (c.id === cat.id ? res.data! : c)));
            toast.success(`Category ${res.data!.isActive ? "activated" : "deactivated"}`);
        });
    }

    // ─── Delete ───────────────────────────────────────────────────────────────

    function handleDelete(cat: Category) {
        const count = productCounts[cat.id] ?? 0;
        if (count > 0) {
            toast.error(`Cannot delete "${cat.label}"`, {
                description: `${count} product${count !== 1 ? "s" : ""} are assigned to it. Reassign them first.`,
            });
            return;
        }
        toast(`Delete "${cat.label}"?`, {
            description: "This cannot be undone.",
            action: {
                label: "Delete",
                onClick: () => {
                    startTransition(async () => {
                        const res = await deleteCategory(cat.id);
                        if (!res.success) {
                            toast.error("Failed to delete category", { description: res.error });
                            return;
                        }
                        pushChange(categories.filter((c) => c.id !== cat.id));
                        toast.success(`"${cat.label}" deleted`);
                    });
                },
            },
            cancel: { label: "Cancel", onClick: () => {} },
        });
    }

    // ─── Reorder (simple up/down) ─────────────────────────────────────────────

    function moveCategory(index: number, direction: "up" | "down") {
        const newCats = [...categories];
        const targetIndex = direction === "up" ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= newCats.length) return;
        [newCats[index], newCats[targetIndex]] = [newCats[targetIndex]!, newCats[index]!];
        const reordered = newCats.map((c, i) => ({ ...c, sortOrder: i + 1 }));
        pushChange(reordered);
        startTransition(async () => {
            await reorderCategories(reordered.map((c) => c.id));
        });
    }

    // ─── Add ──────────────────────────────────────────────────────────────────

    function handleAdd() {
        if (!addLabel.trim()) {
            toast.error("Category name is required.");
            return;
        }
        const slug = addLabel
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "");
        startTransition(async () => {
            const res = await createCategory({
                slug,
                label: addLabel.trim(),
                description: addDesc.trim() || null,
            });
            if (!res.success) {
                toast.error("Failed to create category", { description: res.error });
                return;
            }
            pushChange([...categories, res.data!]);
            setAddLabel("");
            setAddDesc("");
            toast.success(`"${res.data!.label}" created`);
        });
    }

    // ─── Render ───────────────────────────────────────────────────────────────

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Drawer panel */}
            <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md flex flex-col bg-white shadow-2xl border-l border-[var(--rw-border)] animate-slide-in-right">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--rw-border)]">
                    <div>
                        <h2 className="font-display font-bold text-xl text-rw-ink">
                            Manage Categories
                        </h2>
                        <p className="text-xs text-rw-muted mt-0.5">
                            Add, rename, reorder, or toggle categories
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-rw-bg-alt transition-colors text-rw-muted hover:text-rw-ink"
                        aria-label="Close"
                    >
                        <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18 18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                {/* Category list */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
                    {categories.length === 0 && (
                        <p className="text-sm text-rw-muted text-center py-10">
                            No categories yet. Add one below.
                        </p>
                    )}

                    {categories.map((cat, idx) => {
                        const isEditing = editingId === cat.id;
                        const count = productCounts[cat.id] ?? 0;

                        return (
                            <div
                                key={cat.id}
                                className={`rounded-xl border transition-all ${
                                    cat.isActive
                                        ? "bg-white border-[var(--rw-border)]"
                                        : "bg-rw-bg-alt/50 border-dashed border-[var(--rw-border)]"
                                }`}
                            >
                                {isEditing ? (
                                    /* Edit form */
                                    <div className="p-4 space-y-3">
                                        <input
                                            autoFocus
                                            value={editLabel}
                                            onChange={(e) => setEditLabel(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") saveEdit(cat);
                                                if (e.key === "Escape") cancelEdit();
                                            }}
                                            className="w-full rounded-lg border border-[var(--rw-border)] px-3 py-2 text-sm font-semibold text-rw-ink focus:outline-none focus:ring-2 focus:ring-rw-crimson/30 focus:border-rw-crimson"
                                            placeholder="Category label"
                                        />
                                        <input
                                            value={editDesc}
                                            onChange={(e) => setEditDesc(e.target.value)}
                                            className="w-full rounded-lg border border-[var(--rw-border)] px-3 py-2 text-xs text-rw-muted focus:outline-none focus:ring-2 focus:ring-rw-crimson/30 focus:border-rw-crimson"
                                            placeholder="Description (optional)"
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => saveEdit(cat)}
                                                disabled={isPending}
                                                className="flex items-center gap-1.5 rounded-lg bg-rw-ink px-3 py-1.5 text-[11px] font-bold text-white uppercase tracking-widest hover:bg-rw-crimson transition-colors disabled:opacity-50"
                                            >
                                                <IconCheck /> Save
                                            </button>
                                            <button
                                                onClick={cancelEdit}
                                                className="flex items-center gap-1.5 rounded-lg border border-[var(--rw-border)] px-3 py-1.5 text-[11px] font-bold text-rw-muted uppercase tracking-widest hover:border-rw-ink hover:text-rw-ink transition-colors"
                                            >
                                                <IconX /> Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    /* Display row */
                                    <div className="flex items-center gap-3 px-4 py-3">
                                        {/* Reorder */}
                                        <div className="flex flex-col gap-0.5 shrink-0">
                                            <button
                                                onClick={() => moveCategory(idx, "up")}
                                                disabled={idx === 0 || isPending}
                                                className="text-rw-muted hover:text-rw-ink disabled:opacity-20 transition-colors"
                                                aria-label="Move up"
                                            >
                                                <svg
                                                    className="h-3 w-3"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M14.77 12.79a.75.75 0 0 1-1.06-.02L10 8.832 6.29 12.77a.75.75 0 1 1-1.08-1.04l4.25-4.5a.75.75 0 0 1 1.08 0l4.25 4.5a.75.75 0 0 1-.02 1.06z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => moveCategory(idx, "down")}
                                                disabled={
                                                    idx === categories.length - 1 ||
                                                    isPending
                                                }
                                                className="text-rw-muted hover:text-rw-ink disabled:opacity-20 transition-colors"
                                                aria-label="Move down"
                                            >
                                                <svg
                                                    className="h-3 w-3"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </div>

                                        <IconGripVertical />

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className={`font-semibold text-sm truncate ${cat.isActive ? "text-rw-ink" : "text-rw-muted line-through"}`}
                                                >
                                                    {cat.label}
                                                </span>
                                                <span className="text-[10px] font-mono text-rw-muted shrink-0">
                                                    /{cat.slug}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                {count > 0 && (
                                                    <span className="text-[10px] text-rw-muted font-medium">
                                                        {count} product
                                                        {count !== 1 ? "s" : ""}
                                                    </span>
                                                )}
                                                {!cat.isActive && (
                                                    <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">
                                                        Inactive
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-1 shrink-0">
                                            {/* Active toggle */}
                                            <button
                                                onClick={() => toggleActive(cat)}
                                                disabled={isPending}
                                                title={
                                                    cat.isActive
                                                        ? "Deactivate"
                                                        : "Activate"
                                                }
                                                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-all duration-300 disabled:opacity-50 ${cat.isActive ? "bg-green-500" : "bg-gray-200"}`}
                                            >
                                                <span
                                                    className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform duration-300 ${cat.isActive ? "translate-x-4" : "translate-x-0.5"}`}
                                                />
                                            </button>

                                            {/* Edit */}
                                            <button
                                                onClick={() => startEdit(cat)}
                                                className="h-7 w-7 rounded-lg flex items-center justify-center text-rw-muted hover:text-rw-ink hover:bg-rw-bg-alt transition-colors"
                                                aria-label="Edit"
                                            >
                                                <IconPencil />
                                            </button>

                                            {/* Delete */}
                                            <button
                                                onClick={() => handleDelete(cat)}
                                                disabled={isPending}
                                                className="h-7 w-7 rounded-lg flex items-center justify-center text-rw-muted hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                                                aria-label="Delete"
                                            >
                                                <IconTrash />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Add new category */}
                <div className="border-t border-[var(--rw-border)] px-6 py-5 bg-rw-bg-alt/30">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-rw-muted mb-3">
                        Add New Category
                    </p>
                    <div className="space-y-2">
                        <input
                            value={addLabel}
                            onChange={(e) => {
                                setAddLabel(e.target.value);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleAdd();
                            }}
                            placeholder="Category name (e.g. Wristband)"
                            className="w-full rounded-xl border border-[var(--rw-border)] px-4 py-2.5 text-sm font-semibold text-rw-ink bg-white focus:outline-none focus:ring-2 focus:ring-rw-crimson/30 focus:border-rw-crimson placeholder:text-rw-muted/50 placeholder:font-normal"
                        />
                        <input
                            value={addDesc}
                            onChange={(e) => setAddDesc(e.target.value)}
                            placeholder="Description (optional)"
                            className="w-full rounded-xl border border-[var(--rw-border)] px-4 py-2.5 text-xs text-rw-muted bg-white focus:outline-none focus:ring-2 focus:ring-rw-crimson/30 focus:border-rw-crimson"
                        />
                        <button
                            onClick={handleAdd}
                            disabled={isPending || !addLabel.trim()}
                            className="w-full flex items-center justify-center gap-2 rounded-xl bg-rw-ink px-4 py-2.5 text-[11px] font-bold text-white uppercase tracking-widest hover:bg-rw-crimson transition-colors disabled:opacity-50"
                        >
                            <IconPlus /> Add Category
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
