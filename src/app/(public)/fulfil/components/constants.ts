export const PAYMENT_CONFIG = {
    bank: "First Bank",
    accountName: "RCF FUTA",
    accountNumber: "3012345678",
    minPercent: 50,
};

export const MOCK_EXTRACTION = {
    senderName: "Adewale Ogundimu",
    amount: null as number | null,
    date: new Date().toISOString().split("T")[0],
    time: new Date().toTimeString().slice(0, 5),
    bank: "GTBank",
    confidence: "high" as const,
};
