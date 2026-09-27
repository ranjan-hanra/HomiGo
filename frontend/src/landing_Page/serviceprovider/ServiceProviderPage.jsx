import { useMemo, useState } from "react";
import "./ServiceProviderPage.css";

const menuItems = [
    { id: "overview", label: "Overview", icon: "fa-house" },
    { id: "bookings", label: "Bookings", icon: "fa-calendar-check" },
    { id: "earnings", label: "Earnings", icon: "fa-wallet" },
    { id: "services", label: "My Services", icon: "fa-briefcase" },
    { id: "profile", label: "Profile", icon: "fa-user" },
    { id: "support", label: "Support", icon: "fa-headset" },
    { id: "settings", label: "Settings", icon: "fa-gear" },
];

const bookings = [
    { id: "#BOOK-1234", service: "Home Cleaning", date: "May 26, 10:30 AM", status: "Upcoming" },
    { id: "#BOOK-1233", service: "AC Repair", date: "May 26, 01:15 PM", status: "Ongoing" },
    { id: "#BOOK-1232", service: "Plumbing", date: "May 25, 03:00 PM", status: "Completed" },
    { id: "#BOOK-1231", service: "Salon for Women", date: "May 24, 11:00 AM", status: "Completed" },
    { id: "#BOOK-1230", service: "Tiles Style", date: "May 24, 09:30 AM", status: "Cancelled" },
];

const services = [
    { name: "Home Cleaning", bookings: 18, price: "₹699", status: "Active" },
    { name: "AC Repair", bookings: 12, price: "₹499", status: "Active" },
    { name: "Plumbing", bookings: 8, price: "₹399", status: "Active" },
    { name: "Salon for Women", bookings: 5, price: "₹599", status: "Active" },
    { name: "Painting", bookings: 3, price: "₹1,299", status: "Paused" },
];

function StatCard({ icon, label, value, change, iconClass = "" }) {
    return (
        <div className="provider-stat-card">
            <div className={`provider-stat-icon ${iconClass}`}>
                <i className={`fa-solid ${icon}`} />
            </div>
            <div className="provider-stat-content">
                <span>{label}</span>
                <strong>{value}</strong>
                {change && <small><i className="fa-solid fa-arrow-up" /> {change}</small>}
            </div>
        </div>
    );
}

function StatusBadge({ status }) {
    return <span className={`provider-status provider-status-${status.toLowerCase()}`}>{status}</span>;
}

function ServiceProviderPage() {
    const [activePage, setActivePage] = useState("overview");
    const [mobileMenu, setMobileMenu] = useState(false);
    const [availability, setAvailability] = useState(true);
    const [showNotifications, setShowNotifications] = useState(false);

    const savedUser = useMemo(() => {
        try {
            return JSON.parse(localStorage.getItem("user")) || null;
        } catch {
            return null;
        }
    }, []);

    const providerName = savedUser?.fullname || "Rohit Kumar";
    const initials = providerName.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();

    const selectPage = (page) => {
        setActivePage(page);
        setMobileMenu(false);
    };

    return (
        <div className="provider-dashboard">
            <aside className={`provider-sidebar ${mobileMenu ? "provider-sidebar-open" : ""}`}>
                <div className="provider-brand">
                    <img src="/media/images/HomiGoLogo.png" alt="HomiGo" />
                    <span>Provider Portal</span>
                </div>

                <div className="provider-profile-mini">
                    <div className="provider-avatar">{initials}</div>
                    <div>
                        <strong>{providerName}</strong>
                        <span>Service Provider</span>
                    </div>
                </div>

                <nav className="provider-nav">
                    <p className="provider-nav-title">WORKSPACE</p>
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            className={`provider-nav-item ${activePage === item.id ? "active" : ""}`}
                            onClick={() => selectPage(item.id)}
                        >
                            <i className={`fa-solid ${item.icon}`} />
                            <span>{item.label}</span>
                            {item.badge && <em>{item.badge}</em>}
                        </button>
                    ))}
                </nav>

                <div className="provider-sidebar-bottom">
                    <div className="provider-help-card">
                        <i className="fa-solid fa-circle-question" />
                        <div>
                            <strong>Need help?</strong>
                            <span>We're here for you.</span>
                        </div>
                    </div>
                    <button className="provider-logout" onClick={() => window.location.href = "/"}>
                        <i className="fa-solid fa-arrow-left" /> Back to HomiGo
                    </button>
                </div>
            </aside>

            {mobileMenu && <button className="provider-overlay" onClick={() => setMobileMenu(false)} aria-label="Close menu" />}

            <main className="provider-main">
                {activePage === "overview" && (
                <header className="provider-topbar">
                    <button className="provider-mobile-toggle" onClick={() => setMobileMenu(true)}>
                        <i className="fa-solid fa-bars" />
                    </button>
                    <div className="provider-top-title">
                        <span>HOMIGO PROVIDER PORTAL</span>
                        <h1>{menuItems.find((item) => item.id === activePage)?.label || "Overview"}</h1>
                    </div>
                    <div className="provider-top-actions">
                        <div className="provider-availability-toggle">
                            <span className={availability ? "online-dot" : "offline-dot"} />
                            <span>{availability ? "Available" : "Offline"}</span>
                            <button onClick={() => setAvailability(!availability)} className={availability ? "toggle-on" : "toggle-off"} aria-label="Toggle availability">
                                <span />
                            </button>
                        </div>
                        {activePage === "overview" && (
                            <div className="provider-notification-wrap">
                            <button className="provider-icon-button" onClick={() => setShowNotifications(!showNotifications)}>
                                <i className="fa-regular fa-bell" />
                                <b>3</b>
                            </button>
                            {showNotifications && (
                                <div className="provider-notification-popover">
                                    <strong>Notifications</strong>
                                    <p><i className="fa-solid fa-calendar-check" /> New booking request received.</p>
                                    <p><i className="fa-solid fa-star" /> You received a 5-star review.</p>
                                    <p><i className="fa-solid fa-wallet" /> Weekly payout is ready.</p>
                                </div>
                            )}
                        </div>
                        )}
                        <div className="provider-top-user">
                            <div className="provider-avatar small">{initials}</div>
                            <div><strong>{providerName}</strong><span>Provider</span></div>
                            <i className="fa-solid fa-chevron-down" />
                        </div>
                    </div>
                </header>
            )}

                <section className="provider-content">
                    {activePage !== "overview" && <button className="provider-mobile-toggle provider-section-mobile-toggle" onClick={() => setMobileMenu(true)} aria-label="Open menu"><i className="fa-solid fa-bars" /></button>}
                    {activePage === "overview" && (
                        <>
                            <div className="provider-welcome">
                                <div>
                                    <h2>Welcome back, {providerName.split(" ")[0]}! <span>👋</span></h2>
                                    <p>Here’s what’s happening with your HomiGo business today.</p>
                                </div>
                                <button className="provider-primary-btn" onClick={() => selectPage("services")}>
                                    <i className="fa-solid fa-plus" /> Add Service
                                </button>
                            </div>

                            <div className="provider-stats-grid">
                                <StatCard icon="fa-sack-dollar" label="Total Earnings" value="₹24,580" change="12.5% this month" />
                                <StatCard icon="fa-calendar-check" label="Total Bookings" value="48" change="8.2% this month" />
                                <StatCard icon="fa-circle-check" label="Completed Jobs" value="36" change="10.1% this month" />
                                <StatCard icon="fa-star" label="Rating" value="4.8" change="Based on 128 reviews" iconClass="rating-icon" />
                                <StatCard icon="fa-circle-check" label="Profile Status" value="Verified" change="All good!" iconClass="verified-icon" />
                            </div>

                            <div className="provider-main-grid">
                                <div className="provider-panel earnings-panel">
                                    <div className="provider-panel-heading">
                                        <div><h3>Earnings Overview</h3><span>Track your business performance</span></div>
                                        <select defaultValue="week"><option value="week">This Week</option><option value="month">This Month</option></select>
                                    </div>
                                    <div className="provider-chart">
                                        <div className="chart-y-labels"><span>₹8K</span><span>₹6K</span><span>₹4K</span><span>₹2K</span><span>₹0</span></div>
                                        <svg viewBox="0 0 700 260" preserveAspectRatio="none" role="img" aria-label="Earnings chart">
                                            <defs>
                                                <linearGradient id="providerFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#2cc6a5" stopOpacity=".28" /><stop offset="100%" stopColor="#2cc6a5" stopOpacity=".02" /></linearGradient>
                                            </defs>
                                            <line x1="0" y1="40" x2="700" y2="40" /><line x1="0" y1="95" x2="700" y2="95" /><line x1="0" y1="150" x2="700" y2="150" /><line x1="0" y1="205" x2="700" y2="205" />
                                            <path d="M0,205 C70,165 80,170 140,120 C190,78 205,135 260,145 C315,155 335,82 390,75 C445,68 470,75 520,78 C565,82 590,145 625,112 C650,88 675,48 700,35 L700,235 L0,235 Z" fill="url(#providerFill)" />
                                            <path d="M0,205 C70,165 80,170 140,120 C190,78 205,135 260,145 C315,155 335,82 390,75 C445,68 470,75 520,78 C565,82 590,145 625,112 C650,88 675,48 700,35" fill="none" stroke="#18b996" strokeWidth="4" strokeLinecap="round" />
                                            {[0,140,260,390,520,625,700].map((x, i) => <circle key={i} cx={x} cy={[205,120,145,75,78,112,35][i]} r="5" fill="#fff" stroke="#18b996" strokeWidth="3" />)}
                                        </svg>
                                        <div className="chart-x-labels"><span>May 20</span><span>May 21</span><span>May 22</span><span>May 23</span><span>May 24</span><span>May 25</span><span>May 26</span></div>
                                    </div>
                                </div>

                                <div className="provider-panel recent-panel">
                                    <div className="provider-panel-heading"><div><h3>Recent Bookings</h3><span>Latest activity</span></div><button onClick={() => selectPage("bookings")}>View All</button></div>
                                    <div className="provider-booking-list">
                                        {bookings.map((booking) => <div className="provider-booking-row" key={booking.id}><div><strong>{booking.id}</strong><span>{booking.service}</span><small>{booking.date}</small></div><StatusBadge status={booking.status} /></div>)}
                                    </div>
                                </div>
                            </div>

                            <div className="provider-bottom-grid">
                                <div className="provider-panel">
                                    <div className="provider-panel-heading"><div><h3>Top Services</h3><span>Most booked this month</span></div><button onClick={() => selectPage("services")}>View All</button></div>
                                    <div className="provider-simple-list">{services.slice(0, 5).map((service) => <div key={service.name}><span><i className="fa-solid fa-circle-check" /> {service.name}</span><strong>{service.bookings} bookings</strong></div>)}</div>
                                </div>
                                <div className="provider-panel">
                                    <div className="provider-panel-heading"><div><h3>Earnings Summary</h3><span>This month</span></div></div>
                                    <div className="provider-summary"><div><span>Total Earnings</span><strong>₹24,580</strong></div><div><span>Platform Fees</span><strong className="negative">- ₹2,150</strong></div><div><span>Other Deductions</span><strong className="negative">- ₹350</strong></div><div className="summary-total"><span>Net Payout</span><strong>₹22,080</strong></div></div>
                                    <button className="provider-outline-btn" onClick={() => selectPage("earnings")}>View Payout History</button>
                                </div>
                                <div className="provider-panel profile-completion">
                                    <div className="provider-panel-heading"><div><h3>Profile Completion</h3><span>Complete your profile to get more bookings.</span></div></div>
                                    <div className="completion-row"><div className="completion-ring"><span>80%</span></div><strong>Great!</strong></div>
                                    <ul><li>Basic Information <i className="fa-solid fa-circle-check" /></li><li>Identity Verification <i className="fa-solid fa-circle-check" /></li><li>Bank Details <i className="fa-solid fa-circle-check" /></li><li>Add Services <i className="fa-regular fa-circle" /></li></ul>
                                    <button className="provider-outline-btn" onClick={() => selectPage("profile")}>Complete Now</button>
                                </div>
                            </div>
                        </>
                    )}

                    {activePage === "bookings" && <DashboardSection title="Bookings" subtitle="Manage upcoming, ongoing and completed customer bookings."><div className="provider-table-wrap"><table className="provider-table"><thead><tr><th>Booking ID</th><th>Service</th><th>Date & Time</th><th>Status</th><th>Action</th></tr></thead><tbody>{bookings.map((b) => <tr key={b.id}><td><strong>{b.id}</strong></td><td>{b.service}</td><td>{b.date}</td><td><StatusBadge status={b.status} /></td><td><button className="table-action">View</button></td></tr>)}</tbody></table></div></DashboardSection>}

                    {activePage === "earnings" && <DashboardSection title="Earnings" subtitle="Track your earnings, fees and payout history."><div className="provider-stats-grid"><StatCard icon="fa-sack-dollar" label="Gross Earnings" value="₹24,580" change="12.5% this month" /><StatCard icon="fa-money-bill-transfer" label="Net Payout" value="₹22,080" change="After deductions" /><StatCard icon="fa-clock" label="Pending Payout" value="₹3,240" change="Processing" /></div><div className="provider-panel provider-large-panel"><h3>Recent Payouts</h3><div className="provider-simple-list payout-list"><div><span>May 24, 2026</span><strong>₹8,450 <StatusBadge status="Completed" /></strong></div><div><span>May 17, 2026</span><strong>₹7,120 <StatusBadge status="Completed" /></strong></div><div><span>May 10, 2026</span><strong>₹6,510 <StatusBadge status="Completed" /></strong></div></div></div></DashboardSection>}

                    {activePage === "services" && <DashboardSection title="My Services" subtitle="Manage the services, pricing and status visible to HomiGo customers."><div className="provider-service-grid">{services.map((service) => <div className="provider-service-card" key={service.name}><div className="service-card-icon"><i className="fa-solid fa-briefcase" /></div><div><h3>{service.name}</h3><p>{service.bookings} bookings this month</p><strong>{service.price}</strong></div><StatusBadge status={service.status} /><button className="provider-outline-btn">Edit Service</button></div>)}</div></DashboardSection>}

                    {activePage === "profile" && <DashboardSection title="Profile" subtitle="Keep your provider profile and verification details updated."><div className="provider-profile-layout"><div className="provider-panel profile-card"><div className="large-avatar">{initials}</div><h2>{providerName}</h2><p>Professional Service Provider</p><StatusBadge status="Verified" /><button className="provider-primary-btn">Edit Profile</button></div><div className="provider-panel details-card"><h3>Professional Details</h3><div className="detail-grid"><div><span>Email</span><strong>{savedUser?.email || "provider@homigo.com"}</strong></div><div><span>Phone</span><strong>+91 98765 43210</strong></div><div><span>Service Area</span><strong>Kolkata & nearby areas</strong></div><div><span>Experience</span><strong>5+ years</strong></div><div><span>Verification</span><strong>Identity Verified ✓</strong></div><div><span>Joined HomiGo</span><strong>January 2026</strong></div></div></div></div></DashboardSection>}

                    {activePage === "support" && <DashboardSection title="Support" subtitle="Need help? Raise a ticket and our team will get back to you."><div className="support-cards"><div className="provider-panel support-card"><i className="fa-solid fa-headset" /><h3>Provider Support</h3><p>Get help with bookings, payments or account issues.</p><button className="provider-primary-btn">Raise a Ticket</button></div><div className="provider-panel support-card"><i className="fa-regular fa-circle-question" /><h3>Help Center</h3><p>Find quick answers to common provider questions.</p><button className="provider-outline-btn">Browse Help</button></div></div></DashboardSection>}

                    {activePage === "settings" && <DashboardSection title="Settings" subtitle="Manage your account preferences and notifications."><div className="provider-panel settings-list"><label><span><strong>Booking notifications</strong><small>Get notified when a customer books your service.</small></span><input type="checkbox" defaultChecked /></label><label><span><strong>Payment notifications</strong><small>Receive updates when a payout is processed.</small></span><input type="checkbox" defaultChecked /></label><label><span><strong>Marketing updates</strong><small>Receive useful offers and growth tips from HomiGo.</small></span><input type="checkbox" /></label><label><span><strong>Profile visibility</strong><small>Allow customers to discover your provider profile.</small></span><input type="checkbox" defaultChecked /></label></div></DashboardSection>}
                </section>
            </main>
        </div>
    );
}

function DashboardSection({ title, subtitle, children }) {
    return <div className="provider-page-section"><div className="provider-section-heading"><div><span>HOMIGO PROVIDER PORTAL</span><h2>{title}</h2><p>{subtitle}</p></div><button className="provider-icon-action"><i className="fa-solid fa-ellipsis" /></button></div>{children}</div>;
}

export default ServiceProviderPage;
