"use server";

// Server actions for the sponsor feature.
//  - Public: register a sign-up, opt out.
//  - Admin:  create / update / delete sponsor profiles.

import {
    registerSponsorLead,
    optOutSponsorLead,
    getSponsorBySlug,
    createSponsor,
    updateSponsor,
    deleteSponsor,
    type RegisterSponsorLeadInput,
    type SponsorInput,
} from "@/lib/services/sponsors.service";
import { FELLOWSHIP } from "@/lib/config";
import type { ServiceResult } from "@/lib/data/types";

export interface SponsorRegistrationInput {
    fullName: string;
    email: string;
    whatsapp: string;
    skill?: string | null;
    consent: boolean;
}

/**
 * Canonical, plain-text consent wording — built server-side so the stored
 * snapshot is authoritative regardless of what the client rendered.
 */
async function buildConsentText(slug: string): Promise<string> {
    const sponsor = await getSponsorBySlug(slug);
    const name = sponsor?.name ?? "the sponsor";
    return (
        `I consent to ${FELLOWSHIP.shortName} sharing my full name, email address, ` +
        `WhatsApp number and (if provided) my skill of interest with ${name}, an ` +
        `independent education sponsor, for the purpose of enrolling me in ${name}'s ` +
        `free courses. I understand ${name} may contact me about these courses, that ` +
        `participation is voluntary, and that I may withdraw or opt out at any time.`
    );
}

// ─── Public ───────────────────────────────────────────────────────────────────

export async function submitSponsorRegistration(
    slug: string,
    input: SponsorRegistrationInput
): Promise<ServiceResult> {
    const payload: RegisterSponsorLeadInput = {
        fullName: input.fullName,
        email: input.email,
        whatsapp: input.whatsapp,
        skill: input.skill ?? null,
        consent: input.consent,
        consentText: await buildConsentText(slug),
    };
    const result = await registerSponsorLead(slug, payload);
    return { success: result.success, error: result.error };
}

/** Opt out by email OR phone (auto-detected in the service). */
export async function submitSponsorOptOut(
    slug: string,
    identifier: string
): Promise<ServiceResult<{ matched: number }>> {
    return await optOutSponsorLead(slug, identifier);
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export async function createSponsorAction(input: SponsorInput): Promise<ServiceResult> {
    const result = await createSponsor(input);
    return { success: result.success, error: result.error };
}

export async function updateSponsorAction(
    id: string,
    patch: Partial<SponsorInput>
): Promise<ServiceResult> {
    const result = await updateSponsor(id, patch);
    return { success: result.success, error: result.error };
}

export async function deleteSponsorAction(id: string): Promise<ServiceResult> {
    return await deleteSponsor(id);
}
