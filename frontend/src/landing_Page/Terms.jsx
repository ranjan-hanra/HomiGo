function Terms() {
    const sections = [
        { id: "about", title: "About HomiGo" },
        { id: "account", title: "User Account" },
        { id: "booking", title: "Booking Services" },
        { id: "prices", title: "Service Prices" },
        { id: "professionals", title: "Service Professionals" },
        { id: "responsibilities", title: "User Responsibilities" },
        { id: "cancellation", title: "Cancellation" },
        { id: "payments", title: "Payments" },
        { id: "refunds", title: "Refunds" },
        { id: "quality", title: "Service Quality & Complaints" },
        { id: "prohibited", title: "Prohibited Activities" },
        { id: "availability", title: "Platform Availability" },
        { id: "liability", title: "Limitation of Liability" },
        { id: "privacy", title: "Privacy" },
        { id: "changes", title: "Changes to These Terms" },
        { id: "termination", title: "Termination" },
        { id: "law", title: "Governing Law" },
        { id: "contact", title: "Contact" },
    ];

    return (
        <div className="terms-page">

            {/* Hero Section */}
            <div className="terms-hero">
                <div className="container">
                    <div className="hero-content">
                        <span className="terms-badge">
                            <i className="bi bi-file-earmark-text me-2"></i>
                            Legal Information
                        </span>

                        <h1>Terms & Conditions</h1>

                        <p className="hero-description">
                            Please read these terms carefully before using the
                            HomiGo platform and its services.
                        </p>

                        <div className="updated-date">
                            <i className="bi bi-calendar3 me-2"></i>
                            Last Updated: August 28, 2026
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container terms-container">

                <div className="row g-4">

                    {/* Table of Contents */}
                    <div className="col-lg-3">

                        <div className="terms-sidebar">

                            <div className="sidebar-title">
                                <i className="bi bi-list-ul me-2"></i>
                                Contents
                            </div>

                            <div className="toc-list">
                                {sections.map((section, index) => (
                                    <a
                                        href={`#${section.id}`}
                                        key={section.id}
                                        className="toc-link"
                                    >
                                        <span>{index + 1}</span>
                                        {section.title}
                                    </a>
                                ))}
                            </div>

                        </div>

                    </div>

                    {/* Terms Content */}
                    <div className="col-lg-9">

                        <div className="terms-card">

                            {/* Introduction */}
                            <div className="intro-box">
                                <div className="intro-icon">
                                    <i className="bi bi-info-circle"></i>
                                </div>

                                <div>
                                    <h5>Welcome to HomiGo</h5>
                                    <p>
                                        These Terms & Conditions govern your use
                                        of the HomiGo platform and the services
                                        available through it. By using HomiGo,
                                        you agree to comply with these terms.
                                    </p>
                                </div>
                            </div>


                            {/* 1 */}
                            <section id="about" className="terms-section">
                                <SectionTitle number="01" title="About HomiGo" />

                                <p>
                                    HomiGo is a platform that allows users to
                                    discover and book doorstep services such as
                                    home maintenance, repair, cleaning, and
                                    other related services.
                                </p>

                                <p>
                                    HomiGo may act as a platform connecting
                                    customers with service professionals. The
                                    availability and quality of individual
                                    services may depend on the respective
                                    service provider.
                                </p>
                            </section>


                            {/* 2 */}
                            <section id="account" className="terms-section">
                                <SectionTitle number="02" title="User Account" />

                                <p>
                                    To use certain features of HomiGo, you may
                                    be required to create an account.
                                </p>

                                <p>You agree to:</p>

                                <BulletList
                                    items={[
                                        "Provide accurate and complete information.",
                                        "Keep your account information updated.",
                                        "Keep your login credentials confidential.",
                                        "Not use another person's account without permission.",
                                        "Notify HomiGo if you suspect unauthorized access to your account.",
                                    ]}
                                />

                                <p>
                                    You are responsible for activities performed
                                    through your account.
                                </p>
                            </section>


                            {/* 3 */}
                            <section id="booking" className="terms-section">
                                <SectionTitle number="03" title="Booking Services" />

                                <p>
                                    When booking a service through HomiGo:
                                </p>

                                <BulletList
                                    items={[
                                        "You must provide accurate booking information.",
                                        "The selected service, date, time, quantity, and address should be correct.",
                                        "A booking request may initially have a Pending status.",
                                        "A booking becomes confirmed only when the booking is accepted according to the platform's booking process.",
                                        "Service availability may vary depending on the selected date, time, location, and service professionals.",
                                    ]}
                                />

                                <p>
                                    HomiGo reserves the right to reject or
                                    cancel a booking when necessary.
                                </p>
                            </section>


                            {/* 4 */}
                            <section id="prices" className="terms-section">
                                <SectionTitle number="04" title="Service Prices" />

                                <p>
                                    The price displayed at the time of booking
                                    represents the applicable service price
                                    shown on HomiGo.
                                </p>

                                <p>
                                    Prices may change from time to time. Any
                                    applicable price at the time of booking will
                                    be displayed to the user before confirmation.
                                </p>

                                <p>
                                    Additional charges may apply if the requested
                                    work differs substantially from the selected
                                    service.
                                </p>
                            </section>


                            {/* 5 */}
                            <section id="professionals" className="terms-section">
                                <SectionTitle number="05" title="Service Professionals" />

                                <p>
                                    Service professionals are responsible for
                                    providing the requested service in a
                                    professional and appropriate manner.
                                </p>

                                <p>
                                    HomiGo may facilitate communication and
                                    booking between users and professionals but
                                    does not guarantee that every service will
                                    meet a user's expectations.
                                </p>

                                <p>
                                    Professionals may be assigned to bookings
                                    based on availability, location, service
                                    type, and other operational factors.
                                </p>
                            </section>


                            {/* 6 */}
                            <section id="responsibilities" className="terms-section">
                                <SectionTitle number="06" title="User Responsibilities" />

                                <p>Users must:</p>

                                <BulletList
                                    items={[
                                        "Provide a safe and accessible location for the service.",
                                        "Provide accurate contact and address information.",
                                        "Treat service professionals respectfully.",
                                        "Avoid requesting illegal, unsafe, or unauthorized services.",
                                        "Ensure that the information provided during booking is accurate.",
                                    ]}
                                />

                                <p>
                                    Users must not use HomiGo for fraudulent,
                                    abusive, or unlawful activities.
                                </p>
                            </section>


                            {/* 7 */}
                            <section id="cancellation" className="terms-section">
                                <SectionTitle number="07" title="Cancellation" />

                                <p>
                                    A user may cancel a booking according to the
                                    cancellation rules applicable to that booking.
                                </p>

                                <p>HomiGo may cancel a booking because of:</p>

                                <BulletList
                                    items={[
                                        "Service professional unavailability.",
                                        "Incorrect or incomplete booking information.",
                                        "Operational or technical problems.",
                                        "Safety concerns.",
                                        "Violation of these Terms & Conditions.",
                                    ]}
                                />

                                <p>
                                    Any applicable cancellation charges or
                                    refunds will be handled according to
                                    HomiGo's applicable cancellation and refund
                                    policy.
                                </p>
                            </section>


                            {/* 8 */}
                            <section id="payments" className="terms-section">
                                <SectionTitle number="08" title="Payments" />

                                <p>
                                    Users are responsible for paying the
                                    applicable amount for booked services.
                                </p>

                                <p>
                                    Depending on the payment option available
                                    on HomiGo, payment may be made through
                                    supported online payment methods or other
                                    methods provided by the platform.
                                </p>

                                <div className="status-box">
                                    <span>
                                        <i className="bi bi-hourglass-split"></i>
                                        Pending
                                    </span>
                                    <span>
                                        <i className="bi bi-check-circle"></i>
                                        Paid
                                    </span>
                                    <span>
                                        <i className="bi bi-x-circle"></i>
                                        Failed
                                    </span>
                                    <span>
                                        <i className="bi bi-arrow-counterclockwise"></i>
                                        Refunded
                                    </span>
                                </div>
                            </section>


                            {/* 9 */}
                            <section id="refunds" className="terms-section">
                                <SectionTitle number="09" title="Refunds" />

                                <p>
                                    Refund eligibility depends on the reason for
                                    cancellation, payment status, and applicable
                                    HomiGo policies.
                                </p>

                                <p>
                                    Where a refund is approved, it will generally
                                    be processed using the applicable payment
                                    method or process used for the original
                                    transaction.
                                </p>
                            </section>


                            {/* 10 */}
                            <section id="quality" className="terms-section">
                                <SectionTitle
                                    number="10"
                                    title="Service Quality and Complaints"
                                />

                                <p>
                                    If a user experiences an issue with a
                                    service, the user should report the issue
                                    to HomiGo through the available support
                                    channels.
                                </p>

                                <p>
                                    HomiGo may review complaints and take
                                    appropriate action based on the circumstances.
                                </p>
                            </section>


                            {/* 11 */}
                            <section id="prohibited" className="terms-section">
                                <SectionTitle
                                    number="11"
                                    title="Prohibited Activities"
                                />

                                <p>Users must not:</p>

                                <BulletList
                                    items={[
                                        "Provide false information.",
                                        "Attempt to misuse or manipulate the booking system.",
                                        "Create accounts for fraudulent purposes.",
                                        "Harass or threaten service professionals or other users.",
                                        "Attempt unauthorized access to HomiGo systems.",
                                        "Use HomiGo for unlawful activities.",
                                        "Interfere with the normal operation of the platform.",
                                    ]}
                                />

                                <p>
                                    Violation of these rules may result in
                                    suspension or termination of an account.
                                </p>
                            </section>


                            {/* 12 */}
                            <section id="availability" className="terms-section">
                                <SectionTitle
                                    number="12"
                                    title="Platform Availability"
                                />

                                <p>
                                    HomiGo aims to keep the platform available
                                    and functional but does not guarantee
                                    uninterrupted access.
                                </p>

                                <p>The platform may occasionally be unavailable because of:</p>

                                <BulletList
                                    items={[
                                        "Maintenance.",
                                        "Technical issues.",
                                        "Network problems.",
                                        "Server failures.",
                                        "Security incidents.",
                                        "Circumstances beyond HomiGo's reasonable control.",
                                    ]}
                                />
                            </section>


                            {/* 13 */}
                            <section id="liability" className="terms-section">
                                <SectionTitle
                                    number="13"
                                    title="Limitation of Liability"
                                />

                                <p>
                                    HomiGo will make reasonable efforts to
                                    provide a reliable platform. However, to
                                    the extent permitted by applicable law,
                                    HomiGo is not responsible for losses
                                    resulting from circumstances beyond its
                                    reasonable control or from information
                                    supplied incorrectly by users.
                                </p>

                                <p>
                                    Nothing in these Terms is intended to exclude
                                    any liability that cannot legally be excluded.
                                </p>
                            </section>


                            {/* 14 */}
                            <section id="privacy" className="terms-section">
                                <SectionTitle number="14" title="Privacy" />

                                <p>
                                    Your use of HomiGo may involve the collection
                                    and processing of information required to
                                    provide the platform and its services.
                                </p>

                                <p>
                                    HomiGo will handle personal information
                                    according to its applicable Privacy Policy.
                                </p>
                            </section>


                            {/* 15 */}
                            <section id="changes" className="terms-section">
                                <SectionTitle
                                    number="15"
                                    title="Changes to These Terms"
                                />

                                <p>
                                    HomiGo may update these Terms & Conditions
                                    from time to time.
                                </p>

                                <p>
                                    Updated terms will be made available through
                                    the platform. Continued use of HomiGo after
                                    changes are published may constitute
                                    acceptance of the updated terms.
                                </p>
                            </section>


                            {/* 16 */}
                            <section id="termination" className="terms-section">
                                <SectionTitle number="16" title="Termination" />

                                <p>
                                    HomiGo may suspend or terminate access to an
                                    account if the user:
                                </p>

                                <BulletList
                                    items={[
                                        "Violates these Terms & Conditions.",
                                        "Uses the platform fraudulently.",
                                        "Engages in abusive or unlawful behavior.",
                                        "Attempts to compromise the security of the platform.",
                                    ]}
                                />

                                <p>
                                    Users may also stop using HomiGo at any time.
                                </p>
                            </section>


                            {/* 17 */}
                            <section id="law" className="terms-section">
                                <SectionTitle number="17" title="Governing Law" />

                                <p>
                                    These Terms & Conditions shall be governed
                                    by the applicable laws of India.
                                </p>

                                <p>
                                    Any disputes relating to the use of HomiGo
                                    shall be subject to the jurisdiction of the
                                    appropriate courts, subject to applicable law.
                                </p>
                            </section>


                            {/* 18 */}
                            <section id="contact" className="terms-section">
                                <SectionTitle number="18" title="Contact" />

                                <p>
                                    If you have questions, complaints, or
                                    concerns regarding these Terms & Conditions,
                                    please contact the HomiGo support team
                                    through the contact information provided
                                    on the platform.
                                </p>
                            </section>


                            {/* Agreement */}
                            <div className="agreement-box">
                                <div className="agreement-icon">
                                    <i className="bi bi-shield-check"></i>
                                </div>

                                <div>
                                    <h5>Agreement to Terms</h5>
                                    <p>
                                        By using HomiGo, you acknowledge that you
                                        have read, understood, and agreed to
                                        these Terms & Conditions.
                                    </p>
                                </div>
                            </div>

                        </div>

                    </div>

                </div>
            </div>

            {/* CSS */}
            <style>{`

                .terms-page {
                    min-height: 100vh;
                    background: #f6f8f7;
                    color: #26332d;
                    padding-bottom: 70px;
                }

                /* HERO */

                .terms-hero {
                    background: linear-gradient(
                        135deg,
                        #0f5132 0%,
                        #157347 50%,
                        #198754 100%
                    );
                    color: white;
                    padding: 75px 0 90px;
                    position: relative;
                    overflow: hidden;
                }

                .terms-hero::before {
                    content: "";
                    position: absolute;
                    width: 300px;
                    height: 300px;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.06);
                    top: -150px;
                    right: 8%;
                }

                .terms-hero::after {
                    content: "";
                    position: absolute;
                    width: 200px;
                    height: 200px;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.05);
                    bottom: -100px;
                    left: 10%;
                }

                .hero-content {
                    max-width: 850px;
                    position: relative;
                    z-index: 2;
                }

                .terms-badge {
                    display: inline-flex;
                    align-items: center;
                    padding: 8px 15px;
                    border-radius: 30px;
                    background: rgba(255,255,255,0.13);
                    border: 1px solid rgba(255,255,255,0.18);
                    font-size: 13px;
                    margin-bottom: 20px;
                }

                .terms-hero h1 {
                    font-size: clamp(38px, 5vw, 58px);
                    font-weight: 700;
                    margin-bottom: 18px;
                    letter-spacing: -1px;
                }

                .hero-description {
                    max-width: 650px;
                    font-size: 18px;
                    line-height: 1.7;
                    color: rgba(255,255,255,0.85);
                    margin-bottom: 25px;
                }

                .updated-date {
                    display: inline-flex;
                    align-items: center;
                    font-size: 14px;
                    color: rgba(255,255,255,0.8);
                }


                /* MAIN */

                .terms-container {
                    margin-top: -45px;
                    position: relative;
                    z-index: 5;
                }


                /* SIDEBAR */

                .terms-sidebar {
                    background: white;
                    border-radius: 16px;
                    border: 1px solid #e4e9e6;
                    padding: 22px;
                    position: sticky;
                    top: 25px;
                    box-shadow: 0 8px 30px rgba(20,40,30,0.06);
                }

                .sidebar-title {
                    font-size: 16px;
                    font-weight: 700;
                    padding-bottom: 15px;
                    margin-bottom: 8px;
                    border-bottom: 1px solid #edf0ee;
                    color: #173b2a;
                }

                .toc-list {
                    max-height: 65vh;
                    overflow-y: auto;
                    padding-right: 5px;
                }

                .toc-list::-webkit-scrollbar {
                    width: 4px;
                }

                .toc-list::-webkit-scrollbar-thumb {
                    background: #b9cfc2;
                    border-radius: 10px;
                }

                .toc-link {
                    display: flex;
                    align-items: flex-start;
                    gap: 9px;
                    text-decoration: none;
                    color: #65736c;
                    font-size: 13px;
                    line-height: 1.4;
                    padding: 8px 5px;
                    border-radius: 7px;
                    transition: all 0.2s ease;
                }

                .toc-link span {
                    min-width: 21px;
                    height: 21px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #edf6f1;
                    color: #157347;
                    border-radius: 5px;
                    font-size: 10px;
                    font-weight: 700;
                }

                .toc-link:hover {
                    background: #f1f8f4;
                    color: #157347;
                    padding-left: 9px;
                }


                /* CONTENT CARD */

                .terms-card {
                    background: white;
                    border: 1px solid #e4e9e6;
                    border-radius: 18px;
                    padding: 45px;
                    box-shadow: 0 8px 35px rgba(20,40,30,0.06);
                }


                /* INTRO */

                .intro-box {
                    display: flex;
                    gap: 18px;
                    background: #f0f8f4;
                    border: 1px solid #d8eee2;
                    border-radius: 14px;
                    padding: 23px;
                    margin-bottom: 45px;
                }

                .intro-icon,
                .agreement-icon {
                    flex-shrink: 0;
                    width: 45px;
                    height: 45px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 12px;
                    background: #198754;
                    color: white;
                    font-size: 20px;
                }

                .intro-box h5 {
                    color: #164c32;
                    font-weight: 700;
                    margin-bottom: 7px;
                }

                .intro-box p {
                    margin: 0;
                    color: #5d6b64;
                    line-height: 1.7;
                }


                /* SECTIONS */

                .terms-section {
                    scroll-margin-top: 30px;
                    padding-bottom: 35px;
                    margin-bottom: 35px;
                    border-bottom: 1px solid #edf0ee;
                }

                .terms-section:last-of-type {
                    border-bottom: none;
                }

                .section-title {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    margin-bottom: 20px;
                }

                .section-number {
                    width: 42px;
                    height: 42px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 11px;
                    background: #eaf6f0;
                    color: #157347;
                    font-size: 12px;
                    font-weight: 800;
                }

                .section-title h2 {
                    font-size: 22px;
                    font-weight: 700;
                    margin: 0;
                    color: #173b2a;
                }

                .terms-section p {
                    color: #59665f;
                    line-height: 1.85;
                    font-size: 15px;
                    margin-bottom: 15px;
                }


                /* BULLETS */

                .terms-list {
                    list-style: none;
                    padding: 0;
                    margin: 12px 0 20px;
                }

                .terms-list li {
                    position: relative;
                    padding: 8px 0 8px 28px;
                    color: #59665f;
                    line-height: 1.65;
                    font-size: 15px;
                }

                .terms-list li::before {
                    content: "✓";
                    position: absolute;
                    left: 0;
                    top: 8px;
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #eaf6f0;
                    color: #198754;
                    border-radius: 50%;
                    font-size: 11px;
                    font-weight: 700;
                }


                /* PAYMENT STATUS */

                .status-box {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px;
                    margin-top: 20px;
                }

                .status-box span {
                    display: inline-flex;
                    align-items: center;
                    gap: 7px;
                    background: #f7f9f8;
                    border: 1px solid #e3e9e5;
                    padding: 8px 12px;
                    border-radius: 8px;
                    font-size: 12px;
                    color: #526159;
                }


                /* AGREEMENT */

                .agreement-box {
                    display: flex;
                    align-items: center;
                    gap: 18px;
                    background: #173b2a;
                    color: white;
                    border-radius: 15px;
                    padding: 25px;
                    margin-top: 10px;
                }

                .agreement-icon {
                    background: rgba(255,255,255,0.12);
                }

                .agreement-box h5 {
                    margin-bottom: 7px;
                    font-weight: 700;
                }

                .agreement-box p {
                    margin: 0;
                    color: rgba(255,255,255,0.72);
                    line-height: 1.6;
                    font-size: 14px;
                }


                /* RESPONSIVE */

                @media (max-width: 991px) {

                    .terms-sidebar {
                        position: relative;
                        top: 0;
                    }

                    .toc-list {
                        max-height: 250px;
                    }

                    .terms-card {
                        padding: 30px;
                    }

                }

                @media (max-width: 576px) {

                    .terms-hero {
                        padding: 50px 0 75px;
                    }

                    .terms-hero h1 {
                        font-size: 36px;
                    }

                    .hero-description {
                        font-size: 15px;
                    }

                    .terms-container {
                        margin-top: -35px;
                    }

                    .terms-card {
                        padding: 20px;
                        border-radius: 14px;
                    }

                    .intro-box {
                        padding: 18px;
                        gap: 12px;
                    }

                    .intro-icon,
                    .agreement-icon {
                        width: 38px;
                        height: 38px;
                        font-size: 16px;
                    }

                    .section-title {
                        gap: 10px;
                    }

                    .section-number {
                        width: 36px;
                        height: 36px;
                    }

                    .section-title h2 {
                        font-size: 19px;
                    }

                    .terms-section p,
                    .terms-list li {
                        font-size: 14px;
                    }

                    .agreement-box {
                        align-items: flex-start;
                        padding: 18px;
                    }

                }

            `}</style>

        </div>
    );
}


/* Section Title Component */
function SectionTitle({ number, title }) {
    return (
        <div className="section-title">
            <div className="section-number">
                {number}
            </div>

            <h2>{title}</h2>
        </div>
    );
}


/* Bullet List Component */
function BulletList({ items }) {
    return (
        <ul className="terms-list">
            {items.map((item, index) => (
                <li key={index}>{item}</li>
            ))}
        </ul>
    );
}

export default Terms;
