"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/forms/Button";
import { Input } from "@/components/ui/forms/Input";
import { Textarea } from "@/components/ui/forms/Textarea";
import { ColorInput } from "@/components/ui/forms/ColorInput";
import { PillInput } from "@/components/ui/forms/PillInput";
import { ImageUpload } from "@/components/ui/forms/ImageUpload";
import { SponsorLogo } from "@/components/common/SponsorLogo";
import type { Sponsor } from "@/lib/services/sponsors.service";
import { createSponsorAction, updateSponsorAction } from "@/app/actions/sponsors";

interface Props {
    /** Present when editing; omit to create. */
    sponsor?: Sponsor;
}

function slugify(name: string): string {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

export function SponsorForm({ sponsor }: Props) {
    const router = useRouter();
    const editing = !!sponsor;

    const [name, setName] = useState(sponsor?.name ?? "");
    const [slug, setSlug] = useState(sponsor?.slug ?? "");
    const [slugTouched, setSlugTouched] = useState(editing);
    const [tagline, setTagline] = useState(sponsor?.tagline ?? "");
    const [description, setDescription] = useState(sponsor?.description ?? "");
    const [url, setUrl] = useState(sponsor?.url ?? "");
    const [brandColor, setBrandColor] = useState(sponsor?.brandColor ?? "#1B4DF5");
    const [courses, setCourses] = useState<string[]>(sponsor?.courses ?? []);
    const [collectsData, setCollectsData] = useState(sponsor?.collectsData ?? true);
    const [active, setActive] = useState(sponsor?.active ?? true);

    const [logoUrl, setLogoUrl] = useState(sponsor?.logoUrl ?? "");
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Keep the slug in sync with the name until the admin edits it manually.
    function onNameChange(v: string) {
        setName(v);
        if (!slugTouched) setSlug(slugify(v));
    }

    async function onLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const fd = new FormData();
            fd.append("file", file);
            fd.append("variantId", `sponsor-${slug || slugify(name) || Date.now()}`);
            const res = await fetch("/api/cloudinary/upload", { method: "POST", body: fd });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Upload failed");
            setLogoUrl(data.url);
            toast.success("Logo uploaded.");
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Upload failed.");
        } finally {
            setUploading(false);
        }
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        if (name.trim().length < 2) return setError("Name is required.");
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))
            return setError("Slug must be lowercase letters, numbers and hyphens.");

        const payload = {
            slug,
            name,
            tagline,
            description,
            url,
            logoUrl,
            brandColor,
            courses,
            collectsData,
            active,
        };

        setSubmitting(true);
        try {
            const result = editing
                ? await updateSponsorAction(sponsor!.id, payload)
                : await createSponsorAction(payload);
            if (result.success) {
                toast.success(editing ? "Sponsor updated." : "Sponsor created.");
                router.push(`/admin/sponsors/${slug}`);
                router.refresh();
            } else {
                setError(result.error || "Something went wrong.");
            }
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <form onSubmit={onSubmit} className="max-w-2xl flex flex-col gap-6">
            <div className="grid sm:grid-cols-2 gap-5">
                <Input
                    label="Sponsor name"
                    required
                    value={name}
                    onChange={(e) => onNameChange(e.target.value)}
                    placeholder="e.g. Skybil"
                />
                <Input
                    label="Slug (URL)"
                    required
                    value={slug}
                    onChange={(e) => {
                        setSlugTouched(true);
                        setSlug(e.target.value);
                    }}
                    description={`/sponsors/${slug || "your-slug"}`}
                    placeholder="skybil"
                />
            </div>

            <Input
                label="Tagline"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. Elevate Your Skills in Tech and Finance"
            />

            <Textarea
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="A short paragraph about the sponsor and the partnership."
            />

            <Input
                label="Website URL"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://sponsor.com"
            />

            <div className="grid sm:grid-cols-2 gap-5 items-start">
                <ColorInput label="Brand colour" value={brandColor} onChange={setBrandColor} />
                <div className="flex items-end gap-4">
                    <ImageUpload
                        label="Logo"
                        onChange={onLogoChange}
                        disabled={uploading}
                        previewUrl={logoUrl && logoUrl.includes("res.cloudinary.com") ? logoUrl : undefined}
                        description={uploading ? "Uploading…" : "Square image works best."}
                        containerClassName="flex-1"
                    />
                    {logoUrl && (
                        <div className="shrink-0 rounded-xl p-2" style={{ backgroundColor: brandColor }}>
                            <SponsorLogo src={logoUrl} alt="Logo preview" size={40} className="h-10 w-10 rounded-lg object-contain" />
                        </div>
                    )}
                </div>
            </div>

            <PillInput
                label="Courses / offerings"
                description="Shown on the page and used as the sign-up skill options. Press Enter to add."
                value={courses}
                onChange={setCourses}
                placeholder="e.g. Web Development"
            />

            <div className="flex flex-col gap-3 rounded-2xl border border-[var(--rw-border)] p-5">
                <ToggleRow
                    label="Collects member data"
                    hint="Show a sign-up form + opt-out. Turn off for a showcase-only sponsor."
                    checked={collectsData}
                    onChange={setCollectsData}
                />
                <ToggleRow
                    label="Active"
                    hint="Visible on the public site."
                    checked={active}
                    onChange={setActive}
                />
            </div>

            {error && <p className="text-sm font-semibold text-rw-crimson">{error}</p>}

            <div className="flex items-center gap-3">
                <Button type="submit" size="lg" loading={submitting} disabled={uploading}>
                    {editing ? "Save changes" : "Create sponsor"}
                </Button>
                <Button type="button" variant="ghost" size="lg" onClick={() => router.back()}>
                    Cancel
                </Button>
            </div>
        </form>
    );
}

function ToggleRow({
    label,
    hint,
    checked,
    onChange,
}: {
    label: string;
    hint: string;
    checked: boolean;
    onChange: (v: boolean) => void;
}) {
    return (
        <label className="flex items-start gap-3 cursor-pointer">
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-[var(--rw-border-strong)] accent-rw-crimson cursor-pointer"
            />
            <span>
                <span className="block text-sm font-semibold text-rw-ink">{label}</span>
                <span className="block text-xs text-rw-muted">{hint}</span>
            </span>
        </label>
    );
}
