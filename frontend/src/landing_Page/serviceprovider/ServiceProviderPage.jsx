import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";

const providerApi = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api/provider`,
    withCredentials: true,
});

const menuItems = [
    { id: "overview", label: "Overview", icon: "▦" },
    { id: "current", label: "Current Booking", icon: "▣" },
    { id: "history", label: "Booking History", icon: "◷" },
    { id: "profile", label: "Profile", icon: "◉" },
];

const CURRENT_STATUSES = ["pending", "accepted", "in_progress", "upcoming"];
const HISTORY_STATUSES = ["completed", "cancelled"];

function getBookingId(booking) {
    return booking?._id || booking?.id || "";
}

function getCustomer(booking) {
    return booking?.user?.name || booking?.customerName || "Customer";
}

function getService(booking) {
    return booking?.service?.name || booking?.serviceName || "Service";
}

function getAmount(booking) {
    return booking?.totalAmount ?? booking?.amount ?? 0;
}

function getPaymentStatus(booking) {
    return booking?.paymentStatus || "pending";
}

function formatMoney(value) {
    return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function formatDate(value) {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "—";

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

function prettyStatus(value) {
    return String(value || "pending")
        .replaceAll("_", " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

function StatusBadge({ status }) {
    const normalized = String(status || "pending").toLowerCase();

    const className =
        {
            pending: "text-bg-secondary",
            accepted: "text-bg-primary",
            upcoming: "text-bg-warning",
            in_progress: "text-bg-warning",
            completed: "text-bg-success",
            cancelled: "text-bg-danger",
        }[normalized] || "text-bg-secondary";

    return (
        <span className={`badge ${className}`}>
            {prettyStatus(status)}
        </span>
    );
}

function PaymentBadge({ status }) {
    const normalized = String(status || "pending").toLowerCase();

    const className =
        {
            paid: "text-bg-success",
            pending: "text-bg-warning",
            failed: "text-bg-danger",
            refunded: "text-bg-info",
        }[normalized] || "text-bg-secondary";

    return (
        <span className={`badge ${className}`}>
            {prettyStatus(status)}
        </span>
    );
}

function Avatar({ name, size = 42 }) {
    return (
        <div
            className="rounded-circle bg-success-subtle text-success fw-bold d-flex align-items-center justify-content-center flex-shrink-0"
            style={{ width: size, height: size }}
        >
            {(name || "P").charAt(0).toUpperCase()}
        </div>
    );
}

function Card({ title, action, children, className = "" }) {
    return (
        <div className={`card border-0 shadow-sm ${className}`}>
            {(title || action) && (
                <div className="card-header bg-white border-0 px-3 px-md-4 pt-3 pt-md-4">
                    <div className="d-flex justify-content-between align-items-center gap-2">
                        {title && <h5 className="mb-0 fw-semibold">{title}</h5>}
                        {action}
                    </div>
                </div>
            )}

            <div className="card-body px-3 px-md-4">{children}</div>
        </div>
    );
}

function Sidebar({
    providerName,
    activePage,
    goTo,
    availability,
    toggleAvailability,
    open,
    logout,
}) {
    return (
        <>
            <aside
                className={`bg-white border-end position-fixed top-0 bottom-0 start-0 z-3 ${
                    open ? "d-block" : "d-none"
                } d-lg-block`}
                style={{ width: 250 }}
            >
                <div className="d-flex flex-column h-100 p-3">
                    <div className="d-flex align-items-center gap-2 px-2 mb-4">
                        <img
                            src="/media/images/HomiGoLogo.png"
                            alt="HomiGo"
                            style={{
                                width: 38,
                                height: 38,
                                objectFit: "contain",
                            }}
                        />
                        <span className="fs-4 fw-bold">HomiGo</span>
                    </div>

                    <div className="d-flex align-items-center gap-2 px-2 mb-4">
                        <Avatar name={providerName} />
                        <div className="min-w-0">
                            <div className="fw-semibold text-truncate">
                                {providerName}
                            </div>
                            <small className="text-muted">
                                Service Provider
                            </small>
                        </div>
                    </div>

                    <div className="border rounded-3 p-3 mb-3">
                        <div className="d-flex justify-content-between align-items-center gap-2">
                            <div>
                                <div className="small fw-semibold">
                                    {availability
                                        ? "Available"
                                        : "Not available"}
                                </div>

                                <small className="text-muted">
                                    {availability
                                        ? "Accepting bookings"
                                        : "Bookings paused"}
                                </small>
                            </div>

                            <div className="form-check form-switch m-0">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    role="switch"
                                    checked={availability}
                                    onChange={toggleAvailability}
                                />
                            </div>
                        </div>
                    </div>

                    <nav className="nav nav-pills flex-column gap-1">
                        {menuItems.map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                className={`nav-link text-start d-flex align-items-center gap-3 ${
                                    activePage === item.id
                                        ? "active"
                                        : "text-dark"
                                }`}
                                onClick={() => goTo(item.id)}
                            >
                                <span>{item.icon}</span>
                                <span>{item.label}</span>
                            </button>
                        ))}
                    </nav>

                    <div className="mt-auto">
                        <button
                            type="button"
                            className="btn btn-light w-100 text-start mb-2"
                            onClick={() => (window.location.href = "/")}
                        >
                            ← Back to HomiGo
                        </button>

                        <button
                            type="button"
                            className="btn btn-outline-danger w-100"
                            onClick={logout}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </aside>

            {open && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-25 z-2 d-lg-none"
                    onClick={() => goTo(activePage)}
                />
            )}
        </>
    );
}

function Topbar({
    providerName,
    availability,
    toggleAvailability,
    openMenu,
    notificationCount,
    notificationOpen,
    setNotificationOpen,
    currentBookings,
    goTo,
}) {
    return (
        <header className="bg-white border-bottom sticky-top">
            <div className="container-fluid px-3 px-md-4">
                <div className="d-flex align-items-center justify-content-between gap-3 py-3">
                    <div className="d-flex align-items-center gap-2">
                        <button
                            type="button"
                            className="btn btn-light d-lg-none"
                            onClick={openMenu}
                        >
                            ☰
                        </button>

                        <div>
                            <div className="fw-semibold">
                                Provider Dashboard
                            </div>
                            <small className="text-muted d-none d-sm-block">
                                Manage your bookings
                            </small>
                        </div>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                        <button
                            type="button"
                            className="btn btn-sm d-none d-sm-inline-block"
                            onClick={toggleAvailability}
                        >
                            <span
                                className={`badge ${
                                    availability
                                        ? "text-bg-success"
                                        : "text-bg-secondary"
                                }`}
                            >
                                {availability ? "Available" : "Not Available"}
                            </span>
                        </button>

                        <div className="position-relative">
                            <button
                                type="button"
                                className="btn btn-light position-relative"
                                onClick={() =>
                                    setNotificationOpen((value) => !value)
                                }
                                aria-label="Notifications"
                            >
                                🔔

                                {notificationCount > 0 && (
                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill text-bg-danger">
                                        {notificationCount}
                                    </span>
                                )}
                            </button>

                            {notificationOpen && (
                                <div
                                    className="position-absolute end-0 mt-2 bg-white border rounded-3 shadow p-3"
                                    style={{ width: 300, zIndex: 1100 }}
                                >
                                    <div className="fw-semibold">
                                        Notifications
                                    </div>

                                    <hr className="my-2" />

                                    {currentBookings.length === 0 ? (
                                        <small className="text-muted">
                                            No current bookings.
                                        </small>
                                    ) : (
                                        <>
                                            <small className="text-muted d-block mb-2">
                                                You have{" "}
                                                {currentBookings.length} current
                                                booking
                                                {currentBookings.length > 1
                                                    ? "s"
                                                    : ""}
                                                .
                                            </small>

                                            {currentBookings
                                                .slice(0, 3)
                                                .map((booking) => (
                                                    <button
                                                        type="button"
                                                        key={getBookingId(
                                                            booking
                                                        )}
                                                        className="border rounded-2 p-2 mb-2 w-100 text-start bg-white"
                                                        onClick={() => {
                                                            setNotificationOpen(
                                                                false
                                                            );
                                                            goTo("current");
                                                        }}
                                                    >
                                                        <div className="fw-semibold small">
                                                            {getService(
                                                                booking
                                                            )}
                                                        </div>

                                                        <div className="small text-muted">
                                                            {getCustomer(
                                                                booking
                                                            )}
                                                        </div>
                                                    </button>
                                                ))}
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="d-none d-md-flex align-items-center gap-2">
                            <Avatar name={providerName} size={38} />

                            <div>
                                <div className="small fw-semibold">
                                    {providerName}
                                </div>
                                <small className="text-muted">Provider</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

function Overview({ providerName, dashboard, currentBookings, goTo }) {
    const stats = dashboard?.stats || {};
    const recentBookings = dashboard?.recentBookings || [];

    const firstName = (providerName || "Provider").split(" ")[0];

    return (
        <div className="container-fluid px-3 px-md-4 py-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                <div>
                    <small className="text-success fw-semibold">
                        DASHBOARD
                    </small>

                    <h1 className="h3 fw-bold mt-1 mb-1">
                        Welcome back, {firstName}!
                    </h1>

                    <p className="text-muted mb-0">
                        Here is your booking overview.
                    </p>
                </div>

                <button
                    type="button"
                    className="btn btn-success"
                    onClick={() => goTo("current")}
                >
                    View Current Booking
                </button>
            </div>

            <div className="row g-3 mb-4">
                {[
                    [
                        "Total Earnings",
                        formatMoney(stats.totalEarnings),
                        "Completed bookings",
                    ],
                    [
                        "Total Bookings",
                        stats.totalBookings || 0,
                        "Assigned bookings",
                    ],
                    [
                        "Completed Jobs",
                        stats.completedBookings || 0,
                        "Completed bookings",
                    ],
                    [
                        "Current Bookings",
                        currentBookings.length,
                        "Active assigned work",
                    ],
                ].map(([label, value, sub]) => (
                    <div
                        className="col-12 col-sm-6 col-xl-3"
                        key={label}
                    >
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-body p-3 p-md-4">
                                <small className="text-muted">{label}</small>
                                <div className="h3 fw-bold mb-1 mt-1">
                                    {value}
                                </div>
                                <small className="text-success">{sub}</small>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="row g-3">
                <div className="col-12 col-xl-7">
                    <Card title="Current Booking">
                        {currentBookings.length === 0 ? (
                            <div className="text-muted py-4">
                                No current booking.
                            </div>
                        ) : (
                            currentBookings.slice(0, 3).map((booking) => (
                                <div
                                    key={getBookingId(booking)}
                                    className="d-flex align-items-center gap-3 border-bottom py-3"
                                >
                                    <Avatar name={getCustomer(booking)} />

                                    <div className="flex-grow-1 min-w-0">
                                        <div className="fw-semibold text-truncate">
                                            {getService(booking)}
                                        </div>

                                        <small className="text-muted">
                                            {getCustomer(booking)} ·{" "}
                                            {formatDate(
                                                booking.bookingDate
                                            )}
                                        </small>
                                    </div>

                                    <div className="text-end">
                                        <div className="fw-semibold">
                                            {formatMoney(
                                                getAmount(booking)
                                            )}
                                        </div>
                                        <StatusBadge status={booking.status} />
                                    </div>
                                </div>
                            ))
                        )}

                        {currentBookings.length > 0 && (
                            <button
                                type="button"
                                className="btn btn-sm btn-outline-success mt-3"
                                onClick={() => goTo("current")}
                            >
                                Open Current Booking
                            </button>
                        )}
                    </Card>
                </div>

                <div className="col-12 col-xl-5">
                    <Card
                        title="Recent Bookings"
                        action={
                            <button
                                type="button"
                                className="btn btn-sm btn-link text-success p-0 text-decoration-none"
                                onClick={() => goTo("history")}
                            >
                                View history
                            </button>
                        }
                    >
                        {recentBookings.length === 0 ? (
                            <p className="text-muted mb-0">
                                No bookings yet.
                            </p>
                        ) : (
                            recentBookings.slice(0, 5).map((booking) => (
                                <div
                                    key={getBookingId(booking)}
                                    className="d-flex align-items-center gap-2 border-bottom py-2"
                                >
                                    <Avatar
                                        name={getCustomer(booking)}
                                        size={36}
                                    />

                                    <div className="flex-grow-1 min-w-0">
                                        <div className="small fw-semibold text-truncate">
                                            {getService(booking)}
                                        </div>

                                        <small className="text-muted text-truncate d-block">
                                            {getCustomer(booking)}
                                        </small>
                                    </div>

                                    <div className="text-end">
                                        <div className="small fw-semibold">
                                            {formatMoney(
                                                getAmount(booking)
                                            )}
                                        </div>

                                        <StatusBadge status={booking.status} />
                                    </div>
                                </div>
                            ))
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
}

function CurrentBookingCard({
    booking,
    onSaveBilling,
    onStatusChange,
    saving,
}) {
    const [amount, setAmount] = useState(String(getAmount(booking)));
    const [paymentStatus, setPaymentStatus] = useState(
        getPaymentStatus(booking)
    );

    useEffect(() => {
        setAmount(String(getAmount(booking)));
        setPaymentStatus(getPaymentStatus(booking));
    }, [booking]);

    const handleSave = () => {
        const numericAmount = Number(amount);

        if (!Number.isFinite(numericAmount) || numericAmount < 0) {
            window.alert("Please enter a valid booking amount.");
            return;
        }

        onSaveBilling(
            getBookingId(booking),
            numericAmount,
            paymentStatus
        );
    };

    return (
        <div className="card border-0 shadow-sm mb-3">
            <div className="card-body p-3 p-md-4">
                <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap">
                    <div>
                        <small className="text-success fw-semibold">
                            CURRENT BOOKING
                        </small>

                        <h2 className="h4 fw-bold mt-1 mb-1">
                            {getService(booking)}
                        </h2>

                        <small className="text-muted">
                            Booking #
                            {String(getBookingId(booking))
                                .slice(-6)
                                .toUpperCase()}
                        </small>
                    </div>

                    <StatusBadge status={booking.status} />
                </div>

                <hr />

                <div className="row g-3">
                    <div className="col-12 col-md-6">
                        <div className="small text-muted">Customer</div>

                        <div className="fw-semibold">
                            {getCustomer(booking)}
                        </div>

                        {booking.user?.phoneNo && (
                            <small className="text-muted">
                                {booking.user.phoneNo}
                            </small>
                        )}
                    </div>

                    <div className="col-12 col-md-6">
                        <div className="small text-muted">
                            Date & Time
                        </div>

                        <div className="fw-semibold">
                            {formatDate(booking.bookingDate)} ·{" "}
                            {booking.bookingTime || "—"}
                        </div>
                    </div>

                    <div className="col-12">
                        <div className="small text-muted">Address</div>

                        <div className="fw-semibold text-break">
                            {booking.address || "—"}
                        </div>
                    </div>
                </div>

                <div className="row g-3 mt-1">
                    <div className="col-12 col-md-6">
                        <label className="form-label fw-semibold">
                            Booking Amount
                        </label>

                        <div className="input-group">
                            <span className="input-group-text">₹</span>

                            <input
                                type="number"
                                min="0"
                                step="1"
                                className="form-control"
                                value={amount}
                                onChange={(event) =>
                                    setAmount(event.target.value)
                                }
                            />
                        </div>
                    </div>

                    <div className="col-12 col-md-6">
                        <label className="form-label fw-semibold">
                            Payment Status
                        </label>

                        <select
                            className="form-select"
                            value={paymentStatus}
                            onChange={(event) =>
                                setPaymentStatus(event.target.value)
                            }
                        >
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="failed">Failed</option>
                            <option value="refunded">Refunded</option>
                        </select>

                        <small className="text-muted">
                            Saved:{" "}
                            <strong>
                                {prettyStatus(
                                    getPaymentStatus(booking)
                                )}
                            </strong>
                        </small>
                    </div>
                </div>

                <div className="d-flex justify-content-between align-items-center gap-2 flex-wrap mt-4">
                    <div>
                        <small className="text-muted d-block">
                            Current saved amount
                        </small>

                        <strong className="fs-5">
                            {formatMoney(getAmount(booking))}
                        </strong>
                    </div>

                    <div className="d-flex gap-2 flex-wrap">
                        {booking.status === "accepted" && (
                            <button
                                type="button"
                                className="btn btn-success"
                                disabled={saving}
                                onClick={() =>
                                    onStatusChange(
                                        getBookingId(booking),
                                        "in_progress"
                                    )
                                }
                            >
                                Start Service
                            </button>
                        )}

                        {booking.status === "in_progress" && (
                            <button
                                type="button"
                                className="btn btn-success"
                                disabled={saving}
                                onClick={() =>
                                    onStatusChange(
                                        getBookingId(booking),
                                        "completed"
                                    )
                                }
                            >
                                Mark Completed
                            </button>
                        )}

                        {!["completed", "cancelled"].includes(
                            booking.status
                        ) && (
                            <button
                                type="button"
                                className="btn btn-outline-danger"
                                disabled={saving}
                                onClick={() =>
                                    onStatusChange(
                                        getBookingId(booking),
                                        "cancelled"
                                    )
                                }
                            >
                                Cancel
                            </button>
                        )}

                        <button
                            type="button"
                            className="btn btn-primary"
                            disabled={saving}
                            onClick={handleSave}
                        >
                            {saving
                                ? "Saving..."
                                : "Save Amount & Payment"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function CurrentBookingsPage({
    bookings,
    onSaveBilling,
    onStatusChange,
    savingId,
}) {
    return (
        <div className="container-fluid px-3 px-md-4 py-4">
            <div className="mb-4">
                <small className="text-success fw-semibold">
                    ACTIVE WORK
                </small>

                <h1 className="h3 fw-bold mt-1 mb-1">
                    Current Booking
                </h1>

                <p className="text-muted mb-0">
                    Assigned bookings appear here automatically.
                </p>
            </div>

            {bookings.length === 0 ? (
                <Card>
                    <div className="text-center py-5">
                        <div className="display-6 mb-2">✓</div>
                        <h5>No current booking</h5>
                        <p className="text-muted mb-0">
                            New assigned bookings will appear here.
                        </p>
                    </div>
                </Card>
            ) : (
                bookings.map((booking) => (
                    <CurrentBookingCard
                        key={getBookingId(booking)}
                        booking={booking}
                        onSaveBilling={onSaveBilling}
                        onStatusChange={onStatusChange}
                        saving={savingId === getBookingId(booking)}
                    />
                ))
            )}
        </div>
    );
}

function BookingHistoryPage({ bookings }) {
    return (
        <div className="container-fluid px-3 px-md-4 py-4">
            <div className="mb-4">
                <small className="text-success fw-semibold">
                    PAST WORK
                </small>

                <h1 className="h3 fw-bold mt-1 mb-1">
                    Booking History
                </h1>

                <p className="text-muted mb-0">
                    Completed and cancelled bookings.
                </p>
            </div>

            <Card>
                <div className="table-responsive">
                    <table className="table align-middle mb-0">
                        <thead>
                            <tr>
                                <th>Booking</th>
                                <th>Customer</th>
                                <th>Service</th>
                                <th>Date & Time</th>
                                <th>Amount</th>
                                <th>Payment</th>
                                <th>Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {bookings.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="7"
                                        className="text-center text-muted py-5"
                                    >
                                        No booking history yet.
                                    </td>
                                </tr>
                            ) : (
                                bookings.map((booking) => (
                                    <tr key={getBookingId(booking)}>
                                        <td className="fw-semibold">
                                            #
                                            {String(
                                                getBookingId(booking)
                                            )
                                                .slice(-6)
                                                .toUpperCase()}
                                        </td>

                                        <td>
                                            <div className="fw-semibold">
                                                {getCustomer(booking)}
                                            </div>

                                            <small className="text-muted">
                                                {booking.user?.phoneNo || ""}
                                            </small>
                                        </td>

                                        <td>{getService(booking)}</td>

                                        <td>
                                            <div>
                                                {formatDate(
                                                    booking.bookingDate
                                                )}
                                            </div>

                                            <small className="text-muted">
                                                {booking.bookingTime || "—"}
                                            </small>
                                        </td>

                                        <td className="fw-semibold">
                                            {formatMoney(
                                                getAmount(booking)
                                            )}
                                        </td>

                                        <td>
                                            <PaymentBadge
                                                status={getPaymentStatus(
                                                    booking
                                                )}
                                            />
                                        </td>

                                        <td>
                                            <StatusBadge
                                                status={booking.status}
                                            />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}

function ProfilePage({ provider, availability }) {
    return (
        <div className="container-fluid px-3 px-md-4 py-4">
            <div className="mb-4">
                <small className="text-success fw-semibold">
                    ACCOUNT
                </small>

                <h1 className="h3 fw-bold mt-1 mb-1">
                    My Profile
                </h1>

                <p className="text-muted mb-0">
                    Your provider account information.
                </p>
            </div>

            <Card>
                <div className="d-flex align-items-center gap-3 mb-4">
                    <Avatar name={provider?.name} size={64} />

                    <div>
                        <h4 className="mb-1">
                            {provider?.name || "Service Provider"}
                        </h4>

                        <p className="text-muted mb-0">
                            {provider?.email || "—"}
                        </p>
                    </div>
                </div>

                <div className="row g-3">
                    <div className="col-12 col-md-6">
                        <label className="form-label text-muted">
                            Phone
                        </label>

                        <input
                            className="form-control"
                            value={provider?.phoneNo || ""}
                            readOnly
                        />
                    </div>

                    <div className="col-12 col-md-6">
                        <label className="form-label text-muted">
                            Verification
                        </label>

                        <input
                            className="form-control"
                            value={
                                provider?.isVerified
                                    ? "Verified"
                                    : "Not Verified"
                            }
                            readOnly
                        />
                    </div>

                    <div className="col-12 col-md-6">
                        <label className="form-label text-muted">
                            Availability
                        </label>

                        <input
                            className="form-control"
                            value={
                                availability
                                    ? "Available"
                                    : "Not Available"
                            }
                            readOnly
                        />
                    </div>
                </div>
            </Card>
        </div>
    );
}

export default function ServiceProviderPage() {
    const [activePage, setActivePage] = useState("overview");
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [provider, setProvider] = useState(null);
    const [dashboard, setDashboard] = useState({
        stats: {},
        recentBookings: [],
    });

    const [currentBookings, setCurrentBookings] = useState([]);
    const [historyBookings, setHistoryBookings] = useState([]);

    const [availability, setAvailability] = useState(true);

    const [loading, setLoading] = useState(true);
    const [savingId, setSavingId] = useState(null);
    const [error, setError] = useState("");

    const [notificationOpen, setNotificationOpen] = useState(false);
    const [notificationCount, setNotificationCount] = useState(0);
    const [toast, setToast] = useState("");

    const seenBookingIdsRef = useRef(new Set());
    const firstLoadRef = useRef(true);

    const providerName = provider?.name || "Service Provider";

    const goTo = (page) => {
        setActivePage(page);
        setSidebarOpen(false);

        if (page === "current") {
            setNotificationCount(0);
        }
    };

    const handleAuthError = useCallback((error) => {
        if (error?.response?.status === 401) {
            window.location.href = "/provider/login";
            return true;
        }

        return false;
    }, []);

    const showToast = useCallback((message) => {
        setToast(message);

        window.setTimeout(() => {
            setToast("");
        }, 3500);
    }, []);

    const loadDashboard = useCallback(async () => {
        const response = await providerApi.get("/dashboard");

        setDashboard(
            response.data || {
                stats: {},
                recentBookings: [],
            }
        );
    }, []);

    /*
     * IMPORTANT:
     * There is only ONE booking read route:
     * GET /api/provider/bookings/my-bookings
     *
     * Current Booking and Booking History are separated here
     * in React. No /current or /history backend route is required.
     */
    const loadMyBookings = useCallback(
        async (checkForNewBookings = false) => {
            const response = await providerApi.get(
                "/bookings/my-bookings"
            );

            const allBookings = response.data?.bookings || [];

            const current = allBookings.filter((booking) =>
                CURRENT_STATUSES.includes(
                    String(booking.status || "").toLowerCase()
                )
            );

            const history = allBookings.filter((booking) =>
                HISTORY_STATUSES.includes(
                    String(booking.status || "").toLowerCase()
                )
            );

            if (checkForNewBookings) {
                const currentIds = current
                    .map(getBookingId)
                    .filter(Boolean);

                if (!firstLoadRef.current) {
                    const newIds = currentIds.filter(
                        (id) => !seenBookingIdsRef.current.has(id)
                    );

                    if (newIds.length > 0) {
                        setNotificationCount(
                            (count) => count + newIds.length
                        );

                        showToast(
                            `${newIds.length} new booking${
                                newIds.length > 1 ? "s" : ""
                            } received.`
                        );
                    }
                }

                seenBookingIdsRef.current = new Set(currentIds);
            }

            setCurrentBookings(current);
            setHistoryBookings(history);

            return allBookings;
        },
        [showToast]
    );

    const loadAllProviderData = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const [meResponse, availabilityResponse] =
                await Promise.all([
                    providerApi.get("/me"),
                    providerApi.get("/availability"),
                ]);

            const providerData =
                meResponse.data?.provider || meResponse.data;

            setProvider(providerData);

            setAvailability(
                availabilityResponse.data?.isAvailable ??
                    providerData?.isAvailable ??
                    true
            );

            await Promise.all([
                loadDashboard(),
                loadMyBookings(false),
            ]);

            firstLoadRef.current = false;
        } catch (error) {
            console.error(
                "Provider dashboard load error:",
                error
            );

            if (!handleAuthError(error)) {
                setError(
                    error.response?.data?.message ||
                        "Unable to load provider dashboard."
                );
            }
        } finally {
            setLoading(false);
        }
    }, [
        handleAuthError,
        loadDashboard,
        loadMyBookings,
    ]);

    useEffect(() => {
        loadAllProviderData();
    }, [loadAllProviderData]);

    /*
     * Polling is only for refreshing /my-bookings.
     * No separate current/history endpoint is used.
     */
    useEffect(() => {
        const interval = window.setInterval(async () => {
            try {
                await Promise.all([
                    loadMyBookings(true),
                    loadDashboard(),
                ]);
            } catch (error) {
                if (!handleAuthError(error)) {
                    console.error(
                        "Provider polling error:",
                        error
                    );
                }
            }
        }, 10000);

        return () => window.clearInterval(interval);
    }, [
        handleAuthError,
        loadMyBookings,
        loadDashboard,
    ]);

    const toggleAvailability = async () => {
        try {
            const nextValue = !availability;

            const response = await providerApi.put(
                "/availability",
                {
                    isAvailable: nextValue,
                }
            );

            const savedValue =
                response.data?.isAvailable ?? nextValue;

            setAvailability(savedValue);

            setProvider((current) =>
                current
                    ? {
                          ...current,
                          isAvailable: savedValue,
                      }
                    : current
            );

            showToast(
                savedValue
                    ? "You are now available for bookings."
                    : "Bookings are now paused."
            );
        } catch (error) {
            console.error(
                "Availability update error:",
                error
            );

            if (!handleAuthError(error)) {
                showToast(
                    error.response?.data?.message ||
                        "Failed to update availability."
                );
            }
        }
    };

    /*
     * NO /billing ROUTE.
     *
     * Existing backend route:
     * PUT /api/provider/bookings/:bookingId/accept
     *
     * It must accept { amount, paymentStatus } when the booking
     * already belongs to the logged-in provider.
     */
    const saveBookingBilling = async (
        bookingId,
        amount,
        paymentStatus
    ) => {
        try {
            setSavingId(bookingId);
            setError("");

            await providerApi.put(
                `/bookings/${bookingId}/accept`,
                {
                    amount,
                    paymentStatus,
                }
            );

            await Promise.all([
                loadMyBookings(false),
                loadDashboard(),
            ]);

            showToast(
                "Booking amount and payment status updated."
            );
        } catch (error) {
            console.error(
                "Booking billing update error:",
                error
            );

            if (!handleAuthError(error)) {
                showToast(
                    error.response?.data?.message ||
                        "Failed to update booking billing."
                );
            }
        } finally {
            setSavingId(null);
        }
    };

    const updateBookingStatus = async (
        bookingId,
        status
    ) => {
        try {
            setSavingId(bookingId);
            setError("");

            await providerApi.put(
                `/bookings/${bookingId}/status`,
                { status }
            );

            await Promise.all([
                loadMyBookings(false),
                loadDashboard(),
            ]);

            showToast(
                `Booking marked as ${prettyStatus(status)}.`
            );
        } catch (error) {
            console.error(
                "Booking status update error:",
                error
            );

            if (!handleAuthError(error)) {
                showToast(
                    error.response?.data?.message ||
                        "Failed to update booking status."
                );
            }
        } finally {
            setSavingId(null);
        }
    };

    const logout = async () => {
        try {
            await providerApi.post("/logout");
        } catch (error) {
            console.error("Provider logout error:", error);
        } finally {
            window.location.href = "/provider/login";
        }
    };

    if (loading) {
        return (
            <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center">
                <div className="text-center">
                    <div className="spinner-border text-success mb-3" />

                    <div className="fw-semibold">
                        Loading provider dashboard...
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-vh-100 bg-light">
            <Sidebar
                providerName={providerName}
                activePage={activePage}
                goTo={goTo}
                availability={availability}
                toggleAvailability={toggleAvailability}
                open={sidebarOpen}
                logout={logout}
            />

            <div>
                <div className="d-lg-none">
                    <Topbar
                        providerName={providerName}
                        availability={availability}
                        toggleAvailability={toggleAvailability}
                        openMenu={() => setSidebarOpen(true)}
                        notificationCount={notificationCount}
                        notificationOpen={notificationOpen}
                        setNotificationOpen={
                            setNotificationOpen
                        }
                        currentBookings={currentBookings}
                        goTo={goTo}
                    />
                </div>

                <div
                    className="d-none d-lg-block"
                    style={{ marginLeft: 250 }}
                >
                    <Topbar
                        providerName={providerName}
                        availability={availability}
                        toggleAvailability={toggleAvailability}
                        openMenu={() => setSidebarOpen(true)}
                        notificationCount={notificationCount}
                        notificationOpen={notificationOpen}
                        setNotificationOpen={
                            setNotificationOpen
                        }
                        currentBookings={currentBookings}
                        goTo={goTo}
                    />
                </div>

                {error && (
                    <div className="container-fluid px-3 px-md-4 pt-3">
                        <div className="alert alert-danger d-flex justify-content-between align-items-start gap-3">
                            <span>{error}</span>

                            <button
                                type="button"
                                className="btn-close"
                                onClick={() => setError("")}
                            />
                        </div>
                    </div>
                )}

                {toast && (
                    <div
                        className="position-fixed top-0 start-50 translate-middle-x p-3"
                        style={{
                            zIndex: 2000,
                            marginTop: 70,
                        }}
                    >
                        <div className="alert alert-success shadow mb-0">
                            {toast}
                        </div>
                    </div>
                )}

                <main
                    style={{
                        marginLeft:
                            window.innerWidth >= 992 ? 250 : 0,
                    }}
                >
                    {activePage === "overview" && (
                        <Overview
                            providerName={providerName}
                            dashboard={dashboard}
                            currentBookings={currentBookings}
                            goTo={goTo}
                        />
                    )}

                    {activePage === "current" && (
                        <CurrentBookingsPage
                            bookings={currentBookings}
                            onSaveBilling={saveBookingBilling}
                            onStatusChange={updateBookingStatus}
                            savingId={savingId}
                        />
                    )}

                    {activePage === "history" && (
                        <BookingHistoryPage
                            bookings={historyBookings}
                        />
                    )}

                    {activePage === "profile" && (
                        <ProfilePage
                            provider={provider}
                            availability={availability}
                        />
                    )}
                </main>
            </div>
        </div>
    );
}
