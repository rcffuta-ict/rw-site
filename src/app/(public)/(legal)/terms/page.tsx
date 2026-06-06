import { CONTACTS, FELLOWSHIP, PAYMENT_CONFIG, TENURE } from "@/lib/config";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: `Terms of Service - ${TENURE.brandLabel} Pre-Order Platform`,
    description: `Please read these terms carefully before using the ${TENURE.brandLabel} Pre-Order Platform.`,
};
export default function TermsPage() {
    return (
        <div className=" max-w-4xl">
            {/* 1. Acceptance */}
            <section>
                <h2 className="font-display font-bold text-2xl text-rw-ink my-4">
                    1. Acceptance of Terms
                </h2>
                <p className="text-rw-text-2 leading-relaxed">
                    By accessing and using the {TENURE.brandLabel} Pre-Order Platform
                    (&ldquo;the Platform&rdquo;), you agree to be bound by these Terms of
                    Service in their entirety. If you do not agree to these terms, you
                    must not use the Platform. The {FELLOWSHIP.fullName} (&ldquo;
                    {FELLOWSHIP.shortName}&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or
                    &ldquo;our&rdquo;) reserves the right to modify these terms at any
                    time without prior notice. Continued use of the Platform following any
                    modification constitutes your unconditional acceptance of the updated
                    terms.
                </p>
            </section>

            {/* 2. Eligibility & Community Affiliation */}
            <section>
                <h2 className="font-display font-bold text-2xl text-rw-ink my-4">
                    2. Eligibility and Community Affiliation
                </h2>
                <p className="text-rw-text-2 leading-relaxed mb-4">
                    By using this Platform, you represent and warrant that you are at
                    least 18 years old, or are accessing the Platform with the knowledge
                    and consent of a parent or legal guardian. You further represent that
                    you are a member of, affiliated with, or are otherwise informed about
                    the activities of the {FELLOWSHIP.fullName}, and that you are engaging
                    with the Platform in connection with the {TENURE.eventName} event.
                </p>
                <p className="text-rw-text-2 leading-relaxed mb-4">
                    By placing a pre-order, you acknowledge that you have been duly
                    informed of the nature, purpose, and logistics of the{" "}
                    {TENURE.eventName} event and that no representations have been made to
                    you beyond what is expressly stated on this Platform. You agree to use
                    the Platform solely for lawful purposes and in a manner that does not
                    infringe the rights of others. You must not:
                </p>
                <ul className="space-y-2 text-rw-text-2 ml-6">
                    <li>
                        &bull; Harass, abuse, or threaten other users or members of the
                        organising committee
                    </li>
                    <li>
                        &bull; Use the Platform to distribute spam, malware, or fraudulent
                        content
                    </li>
                    <li>
                        &bull; Attempt to gain unauthorised access to any portion of the
                        Platform or its administrative systems
                    </li>
                    <li>
                        &bull; Reverse engineer, decompile, or attempt to derive the
                        source code of the Platform
                    </li>
                    <li>
                        &bull; Submit fraudulent, falsified, or altered payment receipts
                        or order information
                    </li>
                </ul>
            </section>

            {/* 3. Pre-Order Sales */}
            <section>
                <h2 className="font-display font-bold text-2xl text-rw-ink my-4">
                    3. Pre-Order Sales and Merchandise
                </h2>
                <p className="text-rw-text-2 leading-relaxed mb-4">
                    <strong>3.1 Product Descriptions:</strong> We strive to provide
                    accurate descriptions and images of all merchandise available for
                    pre-order. However, colours may vary across different screens and
                    devices, and minor variations may exist between product images and the
                    final delivered item. All images are for illustrative purposes only
                    and do not constitute a warranty of exact appearance.
                </p>
                <p className="text-rw-text-2 leading-relaxed mb-4">
                    <strong>3.2 Availability:</strong> All merchandise is offered strictly
                    on a pre-order basis and is subject to availability. We do not
                    guarantee stock and reserve the right to cancel or limit orders where
                    items become unavailable due to circumstances beyond our reasonable
                    control, including but not limited to production failures, supplier
                    issues, or force majeure events.
                </p>
                <p className="text-rw-text-2 leading-relaxed mb-4">
                    <strong>3.3 Pricing:</strong> All prices are displayed in Nigerian
                    Naira (NGN) and are subject to change without prior notice. Any price
                    changes will be reflected on the Platform prior to checkout. Displayed
                    prices do not include applicable taxes or additional fees unless
                    explicitly stated.
                </p>
            </section>

            {/* 4. Payment Terms */}
            <section>
                <h2 className="font-display font-bold text-2xl text-rw-ink my-4">
                    4. Payment Terms
                </h2>
                <p className="text-rw-text-2 leading-relaxed mb-4">
                    <strong>4.1 Accepted Payment Method:</strong> We accept bank transfers
                    only. All payments must be made directly to the verified{" "}
                    {FELLOWSHIP.shortName} bank account as displayed on the fulfilment
                    page of the Platform. We do not process or receive payments through
                    any other channel, including but not limited to direct messages,
                    third-party payment links, or cash.
                </p>
                <p className="text-rw-text-2 leading-relaxed mb-4">
                    <strong>4.2 Full and Partial Payment:</strong> Full payment is
                    required for all merchandise unless a partial payment arrangement is
                    explicitly made available at checkout. Where partial payment is
                    offered, the minimum deposit amount is configured by the Platform
                    administrator and will be clearly displayed prior to submission. Any
                    partial payment submitted must not be less than the minimum deposit
                    amount as configured at the time of payment. Outstanding balances
                    remain the sole responsibility of the customer and must be settled
                    prior to order fulfilment.
                </p>
                <p className="text-rw-text-2 leading-relaxed mb-4">
                    <strong>4.3 Payment Verification:</strong> After submitting proof of
                    payment through the Platform&rsquo;s designated fulfilment page, our
                    Merch Committee will review and verify the transaction against the{" "}
                    {FELLOWSHIP.shortName} bank account records. Verification typically
                    takes up to 24 hours. A payment is not formally recognised until it
                    has been approved by the Merch Committee and is consistent with our
                    bank account records. Submission of a receipt does not constitute
                    confirmed payment.
                </p>
                <p className="text-rw-text-2 leading-relaxed mb-4">
                    <strong>4.4 Pending and Failed Payments:</strong> If a submitted
                    payment cannot be verified, does not match your order details, or is
                    inconsistent with our bank account records, your order will remain in
                    pending status. You will be notified via email to resubmit or take
                    corrective action. {FELLOWSHIP.shortName} shall not be held liable for
                    delays arising from payment discrepancies attributable to the
                    customer.
                </p>
                <p className="text-rw-text-2 leading-relaxed mb-4">
                    <strong>4.5 Source of Truth for Payment Accounting:</strong> The sole
                    authoritative record of payments received by the {FELLOWSHIP.fullName}{" "}
                    is the balance and transaction history maintained by our designated
                    bank provider. The Platform processes and accounts for payments
                    strictly as they are reflected in our bank records. Any discrepancy
                    between a submitted receipt and our bank account record will result in
                    that payment not being recognised for order fulfilment purposes.
                </p>
                <p className="text-rw-text-2 leading-relaxed mb-4">
                    <strong>4.6 Unaccounted Funds:</strong> Any funds received into the{" "}
                    {FELLOWSHIP.shortName} bank account that cannot be matched to a valid
                    order on the Platform — whether due to incorrect payment references,
                    incorrect amounts, the absence of a corresponding order, or any other
                    reason — shall be treated as a voluntary financial contribution to the{" "}
                    {TENURE.eventName} {TENURE.year} event. Such funds will not be
                    refunded under any circumstances. It is your sole responsibility to
                    ensure that all transfer details, including the correct six-digit
                    order reference, are accurate before initiating any payment.
                </p>
                <p className="text-rw-text-2 leading-relaxed mb-4">
                    <strong>4.7 Payment Disputes:</strong> If you believe a payment was
                    processed or recorded in error, you must contact us immediately at{" "}
                    <strong>info@rw.rcffuta.com</strong> or through the contacts listed in
                    Section 17. We will investigate and seek to resolve disputes in good
                    faith, subject to verification against our bank records.
                </p>
            </section>

            {/* 5. Receipt Submission and AI Processing */}
            <section>
                <h2 className="font-display font-bold text-2xl text-rw-ink my-4">
                    5. Receipt Submission and AI-Assisted Verification
                </h2>
                <p className="text-rw-text-2 leading-relaxed mb-4">
                    <strong>5.1 Submission Channel:</strong> Proof of payment must be
                    submitted exclusively through the designated fulfilment page on the
                    Platform using your six-digit order reference. Under no circumstances
                    will receipts submitted via direct messages, email, social media, or
                    any other channel outside the Platform be accepted or acknowledged.
                    The {FELLOWSHIP.fullName} bears no responsibility for payments
                    communicated outside the Platform.
                </p>
                <p className="text-rw-text-2 leading-relaxed mb-4">
                    <strong>5.2 AI-Assisted Data Extraction:</strong> Upon upload of your
                    payment receipt, the Platform employs an automated artificial
                    intelligence system to extract transaction details from the image,
                    including but not limited to the transaction amount, date, sender
                    name, and reference number. This extraction is performed to facilitate
                    review by the Merch Committee.
                </p>
                <p className="text-rw-text-2 leading-relaxed mb-4">
                    <strong>5.3 Customer Confirmation Obligation:</strong> You are
                    required to review and confirm the accuracy of all AI-extracted
                    details before final submission. By selecting &ldquo;Confirm&rdquo; on
                    the review prompt, you acknowledge that the extracted information is,
                    to the best of your knowledge, an accurate representation of your
                    payment receipt. If the extracted details are inaccurate, you must
                    select &ldquo;Incorrect&rdquo; and resubmit a clearer or valid receipt
                    image.
                </p>
                <p className="text-rw-text-2 leading-relaxed mb-4">
                    <strong>5.4 Disclaimer on AI Accuracy:</strong> The AI-assisted
                    extraction is provided as a convenience tool and is not guaranteed to
                    be error-free. The {FELLOWSHIP.fullName} accepts no liability for
                    inaccuracies arising from the automated extraction process. Final
                    payment determination rests solely with the Merch Committee, based on
                    consistency with our bank records, irrespective of what was extracted
                    or confirmed on the Platform.
                </p>
                <p className="text-rw-text-2 leading-relaxed mb-4">
                    <strong>5.5 Flagged Submissions:</strong> Where the Merch Committee
                    determines that a submitted receipt is inconsistent with{" "}
                    {FELLOWSHIP.shortName}&rsquo;s bank records — whether due to
                    alteration, duplication, incorrect details, or any other irregularity
                    — the payment record will be flagged and will not be registered.
                    Repeated or deliberate submission of false payment evidence may result
                    in permanent disqualification from the Platform and may be reported to
                    the appropriate authorities.
                </p>
                <p className="text-rw-text-2 leading-relaxed mb-4">
                    <strong>5.6 Retention of Receipt Data:</strong> By submitting a
                    receipt image, you consent to the {FELLOWSHIP.fullName} storing the
                    receipt image and all associated AI-extracted transaction data for the
                    duration necessary to fulfil and administer your order, and for such
                    additional period as may be required for record-keeping, dispute
                    resolution, or compliance purposes.
                </p>
            </section>

            {/* 6. Order Fulfillment */}
            <section>
                <h2 className="font-display font-bold text-2xl text-rw-ink my-4">
                    6. Order Fulfilment and Delivery
                </h2>
                <p className="text-rw-text-2 leading-relaxed mb-4">
                    <strong>6.1 Fulfilment Timeline:</strong> Once payment is verified and
                    approved by the Merch Committee, your order will move to production.
                    Estimated delivery timelines will be communicated via email and are
                    subject to production capacity and logistics.
                </p>
                <p className="text-rw-text-2 leading-relaxed mb-4">
                    <strong>6.2 Delivery Location:</strong> All merchandise will be made
                    available for collection exclusively at{" "}
                    <strong>{TENURE.venue}</strong> during the {TENURE.eventName}{" "}
                    {TENURE.year} event ({TENURE.dateRange}
                    ), or as otherwise communicated in your order updates. No shipping to
                    external addresses is offered. Customers are solely responsible for
                    collecting their orders at the specified location within the
                    communicated collection window. The {FELLOWSHIP.fullName} shall not be
                    liable for uncollected orders after the designated period.
                </p>
                <p className="text-rw-text-2 leading-relaxed mb-4">
                    <strong>6.3 Delivery Delays:</strong> While we aim to deliver
                    merchandise on schedule, the {FELLOWSHIP.fullName} does not guarantee
                    timely delivery. Unforeseen circumstances including production delays,
                    logistics disruptions, or force majeure events may affect delivery
                    timelines. Customers will be notified of significant delays via email.
                </p>
            </section>

            {/* 7. Cancellations and Refunds */}
            <section>
                <h2 className="font-display font-bold text-2xl text-rw-ink my-4">
                    7. Cancellations and Refund Policy
                </h2>
                <p className="text-rw-text-2 leading-relaxed mb-4">
                    <strong>7.1 No Refund Policy:</strong> All sales on the Platform are
                    final. The {FELLOWSHIP.fullName} operates a strict no-refund policy.
                    Once a payment has been submitted and an order placed, no refunds will
                    be issued under any circumstances, including but not limited to change
                    of mind, failure to collect merchandise, or event cancellation due to
                    force majeure. By completing a pre-order, you expressly acknowledge
                    and accept this policy.
                </p>
                <p className="text-rw-text-2 leading-relaxed mb-4">
                    <strong>7.2 Order Cancellation:</strong> Orders may be cancelled by
                    the customer within 24 hours of placement, provided that payment has
                    not yet been verified by the Merch Committee. After payment
                    verification, cancellations will not be accepted. The{" "}
                    {FELLOWSHIP.fullName} reserves the right to cancel any order at its
                    sole discretion, including where items become unavailable or where
                    fraudulent activity is suspected.
                </p>
                <p className="text-rw-text-2 leading-relaxed mb-4">
                    <strong>7.3 Defective or Incorrect Items:</strong> If you receive
                    merchandise that is materially defective or substantially different
                    from what was ordered, you must report the issue to the Merch
                    Committee within 48 hours of collection at {TENURE.venue}. We will
                    assess the claim and, at our sole discretion, offer a replacement
                    subject to availability. No monetary refunds will be issued in respect
                    of defective items.
                </p>
                <p className="text-rw-text-2 leading-relaxed mb-4">
                    <strong>7.4 Unaccounted Payments:</strong> As stated in Section 4.6,
                    any funds received that cannot be matched to a valid Platform order
                    will be treated as a voluntary contribution to the {TENURE.eventName}{" "}
                    {TENURE.year} event and will not be refunded.
                </p>
            </section>

            {/* 8. Communications */}
            <section>
                <h2 className="font-display font-bold text-2xl text-rw-ink my-4">
                    8. Official Communications
                </h2>
                <p className="text-rw-text-2 leading-relaxed mb-4">
                    <strong>8.1 Email Communications:</strong> All official communications
                    relating to your order — including order confirmations, payment status
                    updates, delivery notifications, and dispute correspondence — will be
                    issued exclusively from <strong>info@rw.rcffuta.com</strong>. You are
                    responsible for ensuring that the email address provided at checkout
                    is valid and accessible. The {FELLOWSHIP.fullName} shall not be
                    responsible for communications that fail to reach you due to an
                    incorrect or inactive email address.
                </p>
                <p className="text-rw-text-2 leading-relaxed mb-4">
                    <strong>8.2 Live Customer Support:</strong> Live customer support is
                    available strictly via the phone number displayed on the fulfilment
                    page of the Platform. Support is provided on a best-effort basis
                    during event preparation and fulfilment periods.
                </p>
                <p className="text-rw-text-2 leading-relaxed mb-4">
                    <strong>8.3 General Enquiries:</strong> For general enquiries not
                    related to a specific order, including technical issues with the
                    Platform or questions about the {TENURE.eventName} event, you may
                    direct your enquiry to the ICT Coordinator of the{" "}
                    {FELLOWSHIP.shortName} fellowship via the contact details listed in
                    Section 17, or through the WhatsApp number displayed on the Platform.
                </p>
                <p className="text-rw-text-2 leading-relaxed mb-4">
                    <strong>8.4 No Receipt Submissions via Direct Message:</strong>{" "}
                    Payment receipts submitted via direct messages on any platform —
                    including but not limited to WhatsApp, Instagram, Telegram, or email —
                    will not be accepted, acknowledged, or processed. The{" "}
                    {FELLOWSHIP.fullName} accepts no responsibility for payments
                    communicated outside the Platform&rsquo;s designated fulfilment page.
                </p>
            </section>

            {/* 9. Intellectual Property */}
            <section>
                <h2 className="font-display font-bold text-2xl text-rw-ink my-4">
                    9. Intellectual Property Rights
                </h2>
                <p className="text-rw-text-2 leading-relaxed mb-4">
                    All content on the Platform — including but not limited to text,
                    graphics, logos, product images, and merchandise designs — is the
                    property of the {FELLOWSHIP.fullName} or is used with express
                    permission. You may not reproduce, distribute, transmit, or
                    commercially exploit any content from the Platform without explicit
                    prior written permission from the {FELLOWSHIP.fullName}. All
                    merchandise designs are copyrighted. Unauthorised reproduction,
                    counterfeiting, or resale of merchandise is strictly prohibited and
                    may attract legal liability.
                </p>
            </section>

            {/* 10. Limitation of Liability */}
            <section>
                <h2 className="font-display font-bold text-2xl text-rw-ink my-4">
                    10. Limitation of Liability
                </h2>
                <p className="text-rw-text-2 leading-relaxed mb-4">
                    To the fullest extent permitted by applicable Nigerian law, the{" "}
                    {FELLOWSHIP.fullName} and the {TENURE.brandLabel} organising committee
                    shall not be liable for any indirect, incidental, special,
                    consequential, or punitive damages — including loss of profits, loss
                    of data, business interruption, or loss of goodwill — arising from
                    your use of the Platform or in connection with merchandise purchased
                    through it, even if the {FELLOWSHIP.shortName} has been advised of the
                    possibility of such damages.
                </p>
                <p className="text-rw-text-2 leading-relaxed mb-4">
                    Our total aggregate liability for any claim arising out of or in
                    connection with these Terms shall not exceed the total amount paid by
                    you for the specific merchandise to which the claim relates.
                </p>
            </section>

            {/* 11. Disclaimer of Warranties */}
            <section>
                <h2 className="font-display font-bold text-2xl text-rw-ink my-4">
                    11. Disclaimer of Warranties
                </h2>
                <p className="text-rw-text-2 leading-relaxed mb-4">
                    The Platform and all merchandise are provided on an &ldquo;as
                    is&rdquo; and &ldquo;as available&rdquo; basis, without warranty of
                    any kind, whether express or implied. The {FELLOWSHIP.fullName} does
                    not warrant that the Platform will be continuously available,
                    error-free, secure, or free of viruses or harmful components. We
                    disclaim all warranties including those of merchantability, fitness
                    for a particular purpose, title, and non-infringement, to the maximum
                    extent permitted by law.
                </p>
            </section>

            {/* 12. User Data and Privacy */}
            <section>
                <h2 className="font-display font-bold text-2xl text-rw-ink my-4">
                    12. User Data, Privacy, and Receipt Storage
                </h2>
                <p className="text-rw-text-2 leading-relaxed mb-4">
                    By using the Platform, you consent to the {FELLOWSHIP.fullName}{" "}
                    collecting, storing, and processing your personal information —
                    including your full name, email address, phone number, and order
                    details — for the purposes of order processing, payment verification,
                    customer communication, and event administration. Your data will be
                    handled in accordance with our Privacy Policy.
                </p>
                <p className="text-rw-text-2 leading-relaxed mb-4">
                    You additionally consent to the storage of any payment receipt images
                    and associated AI-extracted transaction data submitted through the
                    Platform, for the purposes set out in Section 5.6 of these Terms. You
                    further consent to receiving order updates, payment confirmations, and
                    event information via the email address provided at checkout.
                </p>
            </section>

            {/* 13. Payment Security */}
            <section>
                <h2 className="font-display font-bold text-2xl text-rw-ink my-4">
                    13. Payment Security
                </h2>
                <p className="text-rw-text-2 leading-relaxed mb-4">
                    We recommend using banking applications that generate clear, legible
                    digital receipts — such as OPay, Kuda, Access Bank, or GTBank — to
                    minimise issues during AI-assisted extraction or manual verification.
                    You must always verify the {FELLOWSHIP.shortName} bank account details
                    displayed on the fulfilment page before initiating any transfer. The{" "}
                    {FELLOWSHIP.fullName} is not responsible for losses arising from
                    unauthorised transfers, phishing attempts, or incorrect account
                    details entered by the customer.
                </p>
            </section>

            {/* 14. Sponsorship and General Donations */}
            <section>
                <h2 className="font-display font-bold text-2xl text-rw-ink my-4">
                    14. Sponsorship and General Donations
                </h2>
                <p className="text-rw-text-2 leading-relaxed mb-4">
                    The Platform also facilitates general financial support for the{" "}
                    {TENURE.eventName} {TENURE.year} event through a separate donations
                    and sponsorship channel. Funds contributed through the sponsorship or
                    general support account are entirely voluntary and are not linked to
                    merchandise orders. All such contributions are non-refundable and are
                    applied at the sole discretion of the {FELLOWSHIP.fullName} organising
                    committee toward event expenses. Organisations wishing to explore
                    formal partnership arrangements may download the event prospectus from
                    the Platform.
                </p>
            </section>

            {/* 15. Governing Law */}
            <section>
                <h2 className="font-display font-bold text-2xl text-rw-ink my-4">
                    15. Governing Law and Jurisdiction
                </h2>
                <p className="text-rw-text-2 leading-relaxed mb-4">
                    These Terms of Service are governed by and shall be construed in
                    accordance with the laws of the Federal Republic of Nigeria. Any
                    dispute, claim, or legal proceeding arising out of or in connection
                    with these Terms or the use of the Platform shall be subject to the
                    exclusive jurisdiction of the courts of Nigeria, and you hereby
                    irrevocably submit to the jurisdiction of such courts.
                </p>
            </section>

            {/* 16. Severability and Entire Agreement */}
            <section>
                <h2 className="font-display font-bold text-2xl text-rw-ink my-4">
                    16. Severability and Entire Agreement
                </h2>
                <p className="text-rw-text-2 leading-relaxed mb-4">
                    If any provision of these Terms is found to be unlawful, void, or
                    unenforceable by a court of competent jurisdiction, that provision
                    shall be deemed severed from these Terms without affecting the
                    validity and enforceability of the remaining provisions. These Terms,
                    together with any policies referenced herein, constitute the entire
                    agreement between you and the {FELLOWSHIP.fullName} with respect to
                    your use of the Platform and supersede all prior agreements or
                    understandings relating to the same subject matter.
                </p>
            </section>

            {/* 17. Contact */}
            <section>
                <h2 className="font-display font-bold text-2xl text-rw-ink my-4">
                    17. Contact Information
                </h2>
                <p className="text-rw-text-2 leading-relaxed mb-4">
                    For questions, concerns, or reports of violations of these Terms,
                    please contact us through the appropriate channel below:
                </p>
                <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 mt-4 space-y-4">
                    <div>
                        <p className="text-rw-text-2">
                            <strong>Organisation:</strong> {FELLOWSHIP.fullName}
                        </p>
                        <p className="text-rw-text-2">
                            <strong>Event:</strong> {TENURE.brandLabel} &mdash;{" "}
                            {TENURE.anniversaryLabel}
                        </p>
                        <p className="text-rw-text-2">
                            <strong>Order & official enquiries:</strong>{" "}
                            info@rw.rcffuta.com
                        </p>
                        <p className="text-rw-text-2">
                            <strong>Live support (WhatsApp):</strong> +
                            {PAYMENT_CONFIG.supportContacts.at(0)?.phone}
                        </p>
                    </div>
                    <div>
                        <p className="text-rw-text-2 font-semibold mb-2">
                            Organising Committee Contacts:
                        </p>
                        {CONTACTS.map((contact) => (
                            <p key={contact.email} className="text-rw-text-2 mb-1">
                                <strong>{contact.title}:</strong> {contact.name} &mdash;{" "}
                                {contact.phone}
                            </p>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
