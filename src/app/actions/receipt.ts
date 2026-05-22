/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { createExtractor } from "receipt-ocr-ng";

// 1. Initialize the extractor once outside the execution function.
// This preserves the instance across Server Action invocations (Singleton pattern).
if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not configured in environment variables");
}

const extractor = createExtractor({
    groqApiKey: process.env.GROQ_API_KEY,
});

export async function analyzeReceipt(base64Image: string, mimeType: string) {
    try {
        if (!base64Image) {
            return { success: false, error: "No image content provided" };
        }

        // 2. Clean the Base64 input string to ensure it contains only pure payload.
        // Strips out data prefix parameters like 'data:image/png;base64,' if passed by accident.
        const cleanBase64 = base64Image.replace(/^data:image\/[a-z]+;base64,/, "");

        const result = await extractor.extractFromBase64(cleanBase64, mimeType as any);

        return {
            success: true,
            transaction: result.transaction,
        };
    } catch (error: any) {
        console.error("Error extracting receipt structural data:", error);
        return {
            success: false,
            error: error.message || "Failed to analyze receipt data payload",
        };
    }
}
