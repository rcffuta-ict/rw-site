import { CONTACTS, FELLOWSHIP, PAYMENT_CONFIG, TENURE } from "@/lib/config";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: `Privacy Policy - ${TENURE.brandLabel} Pre-Order Platform`,
    description: `Please read our privacy policy carefully before using the ${TENURE.brandLabel} Pre-Order Platform.`,
};
export default function PrivacyPage() {
    return (
        <div className=" max-w-4xl">
            {/* 1. Introduction */}
            <section>
                <h2 className="font-display font-bold text-2xl text-rw-ink my-4">
                    1. Introduction
                </h2>
                <p className="text-rw-text-2 leading-relaxed">
                    The {FELLOWSHIP.fullName} (&ldquo;
                    {FELLOWSHIP.shortName}&rdquo;, &ldquo;we,&rdquo; &ldquo;us,&rdquo; or
                    &ldquo;our&rdquo;) operates the {TENURE.brandLabel} Pre-Order Platform
                    (&ldquo;the Platform&rdquo;). We are committed to protecting your
                    privacy and ensuring that you have a positive experience on our
                    Platform. This Privacy Policy explains how we collect, use, disclose,
                    and safeguard your information when you visit the Platform, place
                    orders, and submit payment information.
                </p>
            </section>

            {/* 2. Information We Collect */}
            <section>
                <h2 className="font-display font-bold text-2xl text-rw-ink my-4">
                    2. Information We Collect
                </h2>
                <p className="text-rw-text-2 leading-relaxed mb-4">
                    <strong>2.1 Information You Provide:</strong>
                </p>
                <ul className="space-y-2 text-rw-text-2 ml-6 mb-4">
                    <li>
                        &bull; <strong>Order Information:</strong> Full name, email
                        address, phone number, six-digit order reference, items selected,
                        and any order notes
                    </li>
                    <li>
                        &bull; <strong>Payment Receipt Data:</strong> Images of bank
                        transfer receipts uploaded through the fulfilment page, and
                        transaction details automatically extracted from those images via
                        AI-assisted processing (see Section 5 of our Terms of Service)
                    </li>
                    <li>
                        &bull; <strong>Communications:</strong> Any messages you send via
                        email or through support channels
                    </li>
                </ul>
                <p className="text-rw-text-2 leading-relaxed mb-4">
                    <strong>2.2 Automatically Collected Information:</strong>
                </p>
                <ul className="space-y-2 text-rw-text-2 ml-6">
                    <li>
                        &bull; Device information (browser type, IP address, operating
                        system)
                    </li>
                    <li>
                        &bull; Usage data (pages visited, time spent, clicks, referral
                        sources)
                    </li>
                    <li>&bull; Cookies and similar tracking technologies</li>
                    <li>&bull; Approximate location (derived from IP address)</li>
                </ul>
            </section>

            {/* 3. How We Use Your Information */}
            <section>
                <h2 className="font-display font-bold text-2xl text-rw-ink my-4">
                    3. How We Use Your Information
                </h2>
                <p className="text-rw-text-2 leading-relaxed mb-4">
                    We use the information we collect for the following purposes:
                </p>
                <ul className="space-y-2 text-rw-text-2 ml-6">
                    <li>
                        &bull; <strong>Order Processing:</strong> To create and manage
                        your pre-orders and confirm transactions
                    </li>
                    <li>
                        &bull; <strong>Payment Verification:</strong> To facilitate Merch
                        Committee review of uploaded receipts and validate payments
                        against our bank records
                    </li>
                    <li>
                        &bull; <strong>Communication:</strong> To send order
                        confirmations, payment status updates, and delivery information
                        exclusively from info@rw.rcffuta.com
                    </li>
                    <li>
                        &bull; <strong>Customer Support:</strong> To respond to enquiries,
                        resolve disputes, and provide assistance
                    </li>
                    <li>
                        &bull; <strong>Analytics:</strong> To understand how users
                        interact with the Platform and improve the user experience
                    </li>
                    <li>
                        &bull; <strong>Event Communications:</strong> To send information
                        about {TENURE.brandLabel} merchandise updates and event logistics,
                        with your consent
                    </li>
                    <li>
                        &bull; <strong>Security:</strong> To detect, prevent, and address
                        fraud, falsified receipts, and other unlawful activity
                    </li>
                    <li>
                        &bull; <strong>Compliance:</strong> To comply with legal
                        obligations and respond to lawful requests from authorities
                    </li>
                </ul>
            </section>

            {/* 4. Data Sharing */}
            <section>
                <h2 className="font-display font-bold text-2xl text-rw-ink my-4">
                    4. Data Sharing and Disclosure
                </h2>
                <p className="text-rw-text-2 leading-relaxed mb-4">
                    <strong>4.1 Internal Sharing:</strong> Your information will be shared
                    with the Merch Committee, finance team, and logistics partners of the{" "}
                    {FELLOWSHIP.fullName} strictly to the extent necessary to fulfil your
                    order. These individuals are bound by confidentiality obligations.
                </p>
                <p className="text-rw-text-2 leading-relaxed mb-4">
                    <strong>4.2 Third-Party Service Providers:</strong> We may share
                    limited information with third-party providers who assist us in
                    operating the Platform, including email delivery, hosting, technical
                    infrastructure, analytics, and AI-assisted receipt processing. Such
                    providers are engaged only for the purposes described in this Policy.
                </p>
                <p className="text-rw-text-2 leading-relaxed mb-4">
                    <strong>4.3 Legal Requirements:</strong> We may disclose your
                    information if required by law, government request, or court order,
                    including in cases of suspected fraud or submission of falsified
                    payment evidence. We will endeavour to notify you of such disclosure
                    unless prohibited by law.
                </p>
                <p className="text-rw-text-2 leading-relaxed mb-4">
                    <strong>4.4 No Sale of Data:</strong> We do not sell, rent, or trade
                    your personal information to third parties for marketing or commercial
                    purposes under any circumstances.
                </p>
            </section>

            {/* 5. Data Security */}
            <section>
                <h2 className="font-display font-bold text-2xl text-rw-ink my-4">
                    5. Data Security
                </h2>
                <p className="text-rw-text-2 leading-relaxed mb-4">
                    We implement reasonable technical, administrative, and physical
                    safeguards to protect your personal information against unauthorised
                    access, alteration, disclosure, or destruction. These measures include
                    encrypted data transmission (HTTPS/SSL), secure database access
                    controls, and access limited to authorised personnel on a need-to-know
                    basis.
                </p>
                <p className="text-rw-text-2 leading-relaxed mb-4">
                    <strong>Important:</strong> While we employ industry-standard security
                    measures, no method of transmission over the internet or electronic
                    storage is 100% secure. The {FELLOWSHIP.fullName} cannot guarantee the
                    absolute security of your data.
                </p>
            </section>

            {/* 6. Cookies and Tracking */}
            <section>
                <h2 className="font-display font-bold text-2xl text-rw-ink my-4">
                    6. Cookies and Tracking Technologies
                </h2>
                <p className="text-rw-text-2 leading-relaxed mb-4">
                    The Platform uses cookies to enhance your browsing experience,
                    remember preferences, and analyse usage patterns. We use essential
                    cookies (required for core Platform functionality), analytics cookies
                    (to track aggregate user behaviour for optimisation), and preference
                    cookies (to remember your settings). You may disable cookies through
                    your browser settings, but this may affect Platform functionality. We
                    respect Do Not Track (DNT) signals where detected.
                </p>
            </section>

            {/* 7. Retention */}
            <section>
                <h2 className="font-display font-bold text-2xl text-rw-ink my-4">
                    7. Data Retention
                </h2>
                <p className="text-rw-text-2 leading-relaxed mb-4">
                    We retain your personal information for as long as necessary to fulfil
                    the purposes for which it was collected, comply with legal and
                    regulatory requirements, resolve disputes, and support event
                    record-keeping. Order records — including receipt images and
                    AI-extracted payment data — are typically retained for 3 years
                    following the conclusion of the {TENURE.eventName} {TENURE.year}{" "}
                    event. You may request deletion of your data at any time, subject to
                    legal retention requirements, by contacting us using the details in
                    Section 13.
                </p>
            </section>

            {/* 8. Email Communications */}
            <section>
                <h2 className="font-display font-bold text-2xl text-rw-ink my-4">
                    8. Email Communications
                </h2>
                <p className="text-rw-text-2 leading-relaxed mb-4">
                    <strong>8.1 Transactional Emails:</strong> We will send you order
                    confirmations, payment updates, and fulfilment information from{" "}
                    <strong>info@rw.rcffuta.com</strong>. These are essential
                    communications and cannot be opted out of while you have an active
                    order.
                </p>
                <p className="text-rw-text-2 leading-relaxed mb-4">
                    <strong>8.2 Event Communications:</strong> With your consent, we may
                    send information about new merchandise releases, {TENURE.brandLabel}{" "}
                    updates, and related events. You may unsubscribe from these
                    communications at any time by clicking the &ldquo;Unsubscribe&rdquo;
                    link in any such email, or by contacting us directly. We will not send
                    marketing emails more than once per week.
                </p>
            </section>

            {/* 9. Your Rights */}
            <section>
                <h2 className="font-display font-bold text-2xl text-rw-ink my-4">
                    9. Your Privacy Rights
                </h2>
                <p className="text-rw-text-2 leading-relaxed mb-4">
                    Subject to applicable Nigerian law, you may have the following rights
                    in respect of your personal data:
                </p>
                <ul className="space-y-2 text-rw-text-2 ml-6 mb-4">
                    <li>
                        &bull; <strong>Access:</strong> Request a copy of the personal
                        data we hold about you
                    </li>
                    <li>
                        &bull; <strong>Correction:</strong> Request that we correct
                        inaccurate or incomplete information
                    </li>
                    <li>
                        &bull; <strong>Deletion:</strong> Request erasure of your data,
                        subject to legal retention requirements
                    </li>
                    <li>
                        &bull; <strong>Objection:</strong> Object to processing of your
                        data for marketing or analytics purposes
                    </li>
                    <li>
                        &bull; <strong>Withdraw Consent:</strong> Withdraw consent for
                        specific uses of your data at any time
                    </li>
                </ul>
                <p className="text-rw-text-2 leading-relaxed mb-4">
                    To exercise any of these rights, please contact us using the
                    information provided in Section 13. We aim to respond to privacy
                    requests within 7 business days.
                </p>
            </section>

            {/* 10. Children's Privacy */}
            <section>
                <h2 className="font-display font-bold text-2xl text-rw-ink my-4">
                    10. Children&apos;s Privacy
                </h2>
                <p className="text-rw-text-2 leading-relaxed mb-4">
                    The Platform is not intended for persons under 18 years of age. The{" "}
                    {FELLOWSHIP.fullName} does not knowingly collect personal information
                    from minors. If we become aware that a minor has submitted information
                    through the Platform, we will delete that data promptly. Parents or
                    guardians who believe their child has submitted information should
                    contact us immediately using the details in Section 13.
                </p>
            </section>

            {/* 11. Third-Party Links */}
            <section>
                <h2 className="font-display font-bold text-2xl text-rw-ink my-4">
                    11. Third-Party Links and Services
                </h2>
                <p className="text-rw-text-2 leading-relaxed mb-4">
                    The Platform may contain links to third-party websites, including the{" "}
                    {FELLOWSHIP.shortName} main website ({FELLOWSHIP.website}) and
                    navigation services. The {FELLOWSHIP.fullName} is not responsible for
                    the privacy practices of such external sites. We encourage you to
                    review their privacy policies before providing any personal
                    information. Your use of third-party services is governed by their own
                    terms and policies.
                </p>
            </section>

            {/* 12. Policy Updates */}
            <section>
                <h2 className="font-display font-bold text-2xl text-rw-ink my-4">
                    12. Updates to This Policy
                </h2>
                <p className="text-rw-text-2 leading-relaxed mb-4">
                    We may update this Privacy Policy from time to time to reflect changes
                    in our practices, technology, or legal obligations. We will notify you
                    of material changes by posting the updated policy on the Platform and
                    updating the &ldquo;Last Updated&rdquo; date at the top of this page.
                    Your continued use of the Platform following notification of changes
                    constitutes your acceptance of the updated Privacy Policy.
                </p>
            </section>

            {/* 13. Contact Us */}
            <section>
                <h2 className="font-display font-bold text-2xl text-rw-ink my-4">
                    13. Contact Us
                </h2>
                <p className="text-rw-text-2 leading-relaxed mb-4">
                    If you have questions, concerns, or requests regarding this Privacy
                    Policy or our data handling practices, please contact us through the
                    appropriate channel below:
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
                            <strong>Email:</strong> info@rw.rcffuta.com
                        </p>
                        <p className="text-rw-text-2">
                            <strong>Live support (WhatsApp):</strong> +
                            {PAYMENT_CONFIG.supportContacts.at(0)?.phone}
                        </p>
                    </div>
                    <div>
                        <p className="text-rw-text-2 font-semibold mb-2">
                            Organising Committee:
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

            {/* 14. Data Protection Principles */}
            <section>
                <h2 className="font-display font-bold text-2xl text-rw-ink my-4">
                    14. Data Protection Principles
                </h2>
                <p className="text-rw-text-2 leading-relaxed mb-4">
                    The {FELLOWSHIP.fullName} adheres to the following core data
                    protection principles in all its data handling activities:
                </p>
                <ul className="space-y-2 text-rw-text-2 ml-6">
                    <li>
                        &bull; <strong>Lawfulness:</strong> We collect and use data only
                        on the basis of legitimate and disclosed purposes
                    </li>
                    <li>
                        &bull; <strong>Transparency:</strong> We clearly communicate our
                        data practices through this Policy
                    </li>
                    <li>
                        &bull; <strong>Minimisation:</strong> We collect only the data
                        strictly necessary for the purposes stated herein
                    </li>
                    <li>
                        &bull; <strong>Accuracy:</strong> We endeavour to maintain
                        accurate and current records of your information
                    </li>
                    <li>
                        &bull; <strong>Security:</strong> We protect your data from
                        unauthorised access, loss, and misuse through appropriate
                        technical and organisational measures
                    </li>
                </ul>
            </section>
        </div>
    );
}
