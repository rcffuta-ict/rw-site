import { TENURE } from "@/lib/config";

export default function TermsPage() {
    return (
        <>
            {/* 1. Acceptance */}
            <section>
                <h2 className="font-display font-bold text-2xl text-rw-ink mb-4">
                    1. Acceptance of Terms
                </h2>
                <p className="text-rw-text-2 leading-relaxed">
                    By accessing and using the {TENURE.brandLabel} Pre-Order
                    Platform (&ldquo;the Platform&rdquo;), you agree to be
                    bound by these Terms of Service. If you do not agree to
                    these terms, please do not use the Platform. We reserve
                    the right to modify these terms at any time, and continued
                    use of the Platform following any modifications
                    constitutes your acceptance of the updated terms.
                </p>
            </section>

            {/* 2. Eligibility */}
            <section>
                <h2 className="font-display font-bold text-2xl text-rw-ink mb-4">
                    2. Eligibility
                </h2>
                <p className="text-rw-text-2 leading-relaxed mb-4">
                    By using this Platform, you represent and warrant that you
                    are at least 18 years old or have parental/guardian
                    consent. You must be a member of the Christian community
                    or have legitimate interest in {TENURE.brandLabel}{" "}
                    merchandise and events. You agree to use the Platform only
                    for lawful purposes and in a way that does not infringe
                    upon the rights of others or restrict their use and
                    enjoyment of the Platform.
                </p>
                <ul className="space-y-2 text-rw-text-2 ml-6">
                    <li>
                        • You will not harass, abuse, or threaten other users
                    </li>
                    <li>
                        • You will not use the Platform to distribute spam or
                        malware
                    </li>
                    <li>
                        • You will not attempt to gain unauthorized access to
                        the Platform
                    </li>
                    <li>
                        • You will not reverse engineer or attempt to derive
                        source code
                    </li>
                </ul>
            </section>

            {/* 3. Pre-Order Sales */}
            <section>
                <h2 className="font-display font-bold text-2xl text-rw-ink mb-4">
                    3. Pre-Order Sales and Merchandise
                </h2>
                <p className="text-rw-text-2 leading-relaxed mb-4">
                    <strong>3.1 Product Descriptions:</strong> We strive to
                    provide accurate descriptions and images of merchandise
                    available for pre-order. However, colors may appear
                    differently on different screens, and minor variations may
                    occur in the final product. All images are for
                    illustrative purposes.
                </p>
                <p className="text-rw-text-2 leading-relaxed mb-4">
                    <strong>3.2 Availability:</strong> All merchandise is
                    offered on a pre-order basis and subject to availability.
                    We do not guarantee stock availability and reserve the
                    right to cancel orders if items become unavailable due to
                    circumstances beyond our control.
                </p>
                <p className="text-rw-text-2 leading-relaxed mb-4">
                    <strong>3.3 Pricing:</strong> Prices are displayed in
                    Nigerian Naira (NGN) and are subject to change without
                    notice. Any price changes will be reflected on the website
                    prior to checkout. Prices do not include taxes or
                    additional fees unless explicitly stated.
                </p>
            </section>

            {/* 4. Payment Terms */}
            <section>
                <h2 className="font-display font-bold text-2xl text-rw-ink mb-4">
                    4. Payment Terms
                </h2>
                <p className="text-rw-text-2 leading-relaxed mb-4">
                    <strong>4.1 Payment Methods:</strong> We accept bank
                    transfers only. Payment must be made to the verified RCF
                    Headquarters account as displayed on the fulfillment page.
                    We do not process payments directly through the Platform.
                </p>
                <p className="text-rw-text-2 leading-relaxed mb-4">
                    <strong>4.2 Payment Verification:</strong> After you
                    submit proof of payment (receipt), our Merch Committee
                    reviews and verifies the transaction. This verification
                    process typically takes up to 24 hours. Full payment is
                    required for all merchandise unless a deposit arrangement
                    is explicitly offered and confirmed.
                </p>
                <p className="text-rw-text-2 leading-relaxed mb-4">
                    <strong>4.3 Payment Disputes:</strong> If you believe a
                    payment was processed in error, contact us immediately at
                    the support email provided in your order confirmation. We
                    will investigate and resolve disputes in good faith.
                </p>
                <p className="text-rw-text-2 leading-relaxed mb-4">
                    <strong>4.4 Failed Payments:</strong> If a payment fails
                    verification or does not match order details, your order
                    will remain in pending status. You will be notified via
                    email to resubmit payment or take corrective action.
                </p>
            </section>

            {/* 5. Order Fulfillment */}
            <section>
                <h2 className="font-display font-bold text-2xl text-rw-ink mb-4">
                    5. Order Fulfillment and Delivery
                </h2>
                <p className="text-rw-text-2 leading-relaxed mb-4">
                    <strong>5.1 Fulfillment Timeline:</strong> Once payment is
                    verified, your order moves to production. Delivery
                    timelines will be communicated via email and depend on
                    production capacity. Items are typically delivered during
                    the designated {TENURE.eventName} dates or as communicated
                    in order updates.
                </p>
                <p className="text-rw-text-2 leading-relaxed mb-4">
                    <strong>5.2 Delivery Method:</strong> All merchandise will
                    be delivered/available for pickup at the designated{" "}
                    {TENURE.eventName} location as communicated in order
                    confirmations. Shipping to external locations is not
                    available at this time.
                </p>
                <p className="text-rw-text-2 leading-relaxed mb-4">
                    <strong>5.3 No Guarantee of Timely Delivery:</strong>{" "}
                    While we aim to deliver on schedule, unforeseen
                    circumstances (production delays, logistics issues, force
                    majeure) may affect delivery dates. We will keep you
                    informed of any delays via email.
                </p>
            </section>

            {/* 6. Cancellations and Refunds */}
            <section>
                <h2 className="font-display font-bold text-2xl text-rw-ink mb-4">
                    6. Cancellations and Refunds
                </h2>
                <p className="text-rw-text-2 leading-relaxed mb-4">
                    <strong>6.1 Cancellation Policy:</strong> Orders may be
                    cancelled within 7 days of creation if payment has not yet
                    been verified. After payment verification, cancellations
                    are subject to approval and may incur administrative fees.
                </p>
                <p className="text-rw-text-2 leading-relaxed mb-4">
                    <strong>6.2 Refund Eligibility:</strong> Refunds are
                    processed only for cancelled orders or payment errors.
                    Refunds will be issued to the original bank account used
                    for payment within 5-7 business days.
                </p>
                <p className="text-rw-text-2 leading-relaxed mb-4">
                    <strong>6.3 Non-Refundable:</strong> Once merchandise is
                    produced or is in transit for delivery, no refunds will be
                    issued. You may request exchanges subject to availability.
                </p>
                <p className="text-rw-text-2 leading-relaxed mb-4">
                    <strong>6.4 Defective Items:</strong> If you receive
                    damaged or defective merchandise, report it within 48
                    hours of delivery. We will verify and offer replacement or
                    refund at our discretion.
                </p>
            </section>

            {/* 7. Intellectual Property */}
            <section>
                <h2 className="font-display font-bold text-2xl text-rw-ink mb-4">
                    7. Intellectual Property Rights
                </h2>
                <p className="text-rw-text-2 leading-relaxed mb-4">
                    All content on the Platform, including but not limited to
                    text, graphics, logos, product images, and designs, are
                    the property of RCF FUTA or used with permission. You may
                    not reproduce, distribute, or transmit any content without
                    explicit written permission. Merchandise designs are
                    copyrighted, and unauthorized reproduction or
                    counterfeiting is strictly prohibited.
                </p>
            </section>

            {/* 8. Limitation of Liability */}
            <section>
                <h2 className="font-display font-bold text-2xl text-rw-ink mb-4">
                    8. Limitation of Liability
                </h2>
                <p className="text-rw-text-2 leading-relaxed mb-4">
                    To the fullest extent permitted by law, RCF FUTA and the{" "}
                    {TENURE.brandLabel} organizing committee shall not be
                    liable for any indirect, incidental, special,
                    consequential, or punitive damages, including loss of
                    profits, data, or goodwill, arising from your use of the
                    Platform or merchandise purchased through it, even if
                    advised of the possibility of such damages.
                </p>
                <p className="text-rw-text-2 leading-relaxed mb-4">
                    Our total liability for any claim shall not exceed the
                    amount paid by you for the merchandise in question.
                </p>
            </section>

            {/* 9. Disclaimer of Warranties */}
            <section>
                <h2 className="font-display font-bold text-2xl text-rw-ink mb-4">
                    9. Disclaimer of Warranties
                </h2>
                <p className="text-rw-text-2 leading-relaxed mb-4">
                    The Platform and all merchandise are provided &ldquo;as
                    is&rdquo; without warranty of any kind, express or
                    implied. We do not warrant that the Platform will be
                    uninterrupted, error-free, or free of viruses or harmful
                    components. We disclaim all warranties including
                    merchantability, fitness for a particular purpose, and
                    non-infringement.
                </p>
            </section>

            {/* 10. User Data and Privacy */}
            <section>
                <h2 className="font-display font-bold text-2xl text-rw-ink mb-4">
                    10. User Data and Communications
                </h2>
                <p className="text-rw-text-2 leading-relaxed mb-4">
                    By using the Platform, you agree that we may collect, use,
                    and store your personal information (name, email, contact
                    details) for order processing, communication, and
                    analytics purposes. Your data will be handled in
                    accordance with our Privacy Policy. You consent to receive
                    order updates, payment confirmations, and event
                    information via email.
                </p>
            </section>

            {/* 11. Payment Security */}
            <section>
                <h2 className="font-display font-bold text-2xl text-rw-ink mb-4">
                    11. Payment Security Disclaimer
                </h2>
                <p className="text-rw-text-2 leading-relaxed mb-4">
                    We advise you to use recommended banking channels (OPAY,
                    KUDA, Access Bank, GTBank) that provide clear transaction
                    receipts. RCF FUTA is not responsible for unauthorized
                    bank transfers, phishing attempts, or incorrect payment
                    details entered by users. Always verify the account
                    details on the fulfillment page before making payment.
                </p>
            </section>

            {/* 12. Governing Law */}
            <section>
                <h2 className="font-display font-bold text-2xl text-rw-ink mb-4">
                    12. Governing Law and Jurisdiction
                </h2>
                <p className="text-rw-text-2 leading-relaxed mb-4">
                    These Terms of Service are governed by and construed in
                    accordance with the laws of Nigeria. Any legal action or
                    proceeding relating to the Platform shall be brought
                    exclusively in the courts located in Nigeria, and you
                    hereby consent to the exclusive jurisdiction of such
                    courts.
                </p>
            </section>

            {/* 13. Contact */}
            <section>
                <h2 className="font-display font-bold text-2xl text-rw-ink mb-4">
                    13. Contact Information
                </h2>
                <p className="text-rw-text-2 leading-relaxed mb-4">
                    For questions regarding these Terms of Service, or to
                    report violations, please contact us at:
                </p>
                <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 mt-4">
                    <p className="text-rw-text-2">
                        <strong>Organization:</strong> RCF FUTA
                        <br />
                        <strong>Event:</strong> {TENURE.brandLabel}
                        <br />
                        <strong>Support:</strong> Available through order
                        confirmation email
                    </p>
                </div>
            </section>
        </>
    );
}
