import React, { useEffect, useState } from "react";
import axios from "axios";

const MyBookingPage = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cancellingId, setCancellingId] = useState(null);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/mybookings`,
                    { withCredentials: true }
                );

                if (response.data.success) {
                    setBookings(response.data.bookings || []);
                }
            } catch (error) {
                console.error("Error fetching bookings:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    const handleCancelBooking = async (bookingId) => {
        if (!window.confirm("Are you sure you want to cancel this booking?")) {
            return;
        }

        try {
            setCancellingId(bookingId);

            const response = await axios.patch(
                `${import.meta.env.VITE_API_URL}/cancelbooking/${bookingId}`,
                {},
                { withCredentials: true }
            );

            if (response.data.success) {
                setBookings((prev) =>
                    prev.map((booking) =>
                        booking._id === bookingId
                            ? { ...booking, status: "cancelled" }
                            : booking
                    )
                );
            }
        } catch (error) {
            console.error("Cancel booking error:", error);
            alert(
                error.response?.data?.message ||
                    "Unable to cancel booking"
            );
        } finally {
            setCancellingId(null);
        }
    };

    const formatDate = (date) => {
        if (!date) return "N/A";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const formatMoney = (amount) =>
        `₹${Number(amount || 0).toLocaleString("en-IN")}`;

    const formatStatus = (status) =>
        String(status || "pending")
            .replaceAll("_", " ")
            .replace(/\b\w/g, (char) => char.toUpperCase());

    const statusStyle = (status) => {
        switch (status) {
            case "accepted":
                return {
                    box: "bg-primary-subtle text-primary border border-primary-subtle",
                    icon: "✓",
                };
            case "in_progress":
                return {
                    box: "bg-warning-subtle text-warning-emphasis border border-warning-subtle",
                    icon: "⚙",
                };
            case "completed":
                return {
                    box: "bg-success-subtle text-success border border-success-subtle",
                    icon: "✓",
                };
            case "cancelled":
                return {
                    box: "bg-danger-subtle text-danger border border-danger-subtle",
                    icon: "×",
                };
            default:
                return {
                    box: "bg-secondary-subtle text-secondary border border-secondary-subtle",
                    icon: "●",
                };
        }
    };

    const paymentStyle = (status) => {
        switch (status) {
            case "paid":
                return {
                    box: "bg-success-subtle text-success border border-success-subtle",
                    icon: "✓",
                };
            case "pending":
                return {
                    box: "bg-warning-subtle text-warning-emphasis border border-warning-subtle",
                    icon: "◷",
                };
            case "failed":
                return {
                    box: "bg-danger-subtle text-danger border border-danger-subtle",
                    icon: "×",
                };
            case "refunded":
                return {
                    box: "bg-info-subtle text-info border border-info-subtle",
                    icon: "↩",
                };
            default:
                return {
                    box: "bg-secondary-subtle text-secondary border border-secondary-subtle",
                    icon: "●",
                };
        }
    };

    if (loading) {
        return (
            <div className="container py-5 text-center">
                <div className="spinner-border spinner-border-sm text-success" />
                <div className="small text-muted mt-2">
                    Loading bookings...
                </div>
            </div>
        );
    }

    return (
        <div className="bg-light min-vh-100 py-4">
            <div className="container">

                {/* HEADER */}
                <div className="bg-white border rounded-3 shadow-sm p-3 p-md-4 mb-3">
                    <div className="row align-items-center g-3">
                        <div className="col">
                            <div className="d-flex align-items-center gap-2">
                                <span className="fs-4">📋</span>
                                <h3 className="fw-semibold mb-0">
                                    My Bookings
                                </h3>
                            </div>
                            <div className="small text-muted mt-1">
                                Manage and track your services
                            </div>
                        </div>

                        <div className="col-auto">
                            <div className="border rounded-3 px-3 py-2 text-center bg-light">
                                <div className="small text-muted">
                                    Total
                                </div>
                                <div className="fw-bold text-success">
                                    {bookings.length}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* EMPTY */}
                {bookings.length === 0 ? (
                    <div className="bg-white border rounded-3 shadow-sm text-center p-5">
                        <div className="fs-1 mb-2">📭</div>
                        <h5 className="fw-semibold">No bookings yet</h5>
                        <p className="small text-muted mb-3">
                            Book a service to see it here.
                        </p>
                        <a
                            href="/services"
                            className="btn btn-success btn-sm"
                        >
                            Browse Services
                        </a>
                    </div>
                ) : (
                    <div className="row g-3">
                        {bookings.map((booking) => {
                            const status = statusStyle(booking.status);
                            const payment = paymentStyle(
                                booking.paymentStatus
                            );

                            return (
                                <div
                                    className="col-12 col-lg-6"
                                    key={booking._id}
                                >
                                    <div className="bg-white border rounded-3 shadow-sm h-100 overflow-hidden">

                                        {/* CARD HEADER */}
                                        <div className="p-3 border-bottom">
                                            <div className="row g-3 align-items-center">

                                                {/* SERVICE BOX */}
                                                <div className="col-12 col-sm">
                                                    <div className="border rounded-3 p-3 h-100">
                                                        <div className="small text-muted mb-1">
                                                            🛠 Service
                                                        </div>
                                                        <div className="fw-semibold text-break">
                                                            {booking.serviceName ||
                                                                "Service"}
                                                        </div>
                                                        <div className="small text-muted text-break mt-1">
                                                            ID: #
                                                            {booking._id
                                                                ?.slice(-8)
                                                                .toUpperCase()}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* STATUS BOX */}
                                                <div className="col-12 col-sm-auto">
                                                    <div
                                                        className={`border rounded-3 p-3 text-center ${status.box}`}
                                                    >
                                                        <div className="small opacity-75 mb-1">
                                                            Status
                                                        </div>
                                                        <div className="fw-semibold text-nowrap">
                                                            <span className="me-1">
                                                                {status.icon}
                                                            </span>
                                                            {formatStatus(
                                                                booking.status
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* DETAILS */}
                                        <div className="p-3">
                                            <div className="row g-3">

                                                {/* DATE BOX */}
                                                <div className="col-6">
                                                    <div className="border rounded-3 p-3 h-100">
                                                        <div className="small text-muted mb-1">
                                                            📅 Date
                                                        </div>
                                                        <div className="fw-medium text-break">
                                                            {formatDate(
                                                                booking.bookingDate
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* TIME BOX */}
                                                <div className="col-6">
                                                    <div className="border rounded-3 p-3 h-100">
                                                        <div className="small text-muted mb-1">
                                                            🕐 Time
                                                        </div>
                                                        <div className="fw-medium text-break">
                                                            {booking.bookingTime ||
                                                                "N/A"}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* PROVIDER BOX */}
                                                <div className="col-12">
                                                    <div className="border rounded-3 p-3">
                                                        <div className="small text-muted mb-2">
                                                            👨‍🔧 Service Provider
                                                        </div>

                                                        {booking.provider ? (
                                                            <div className="row g-2 align-items-center">
                                                                <div className="col">
                                                                    <div className="fw-semibold text-break">
                                                                        {booking
                                                                            .provider
                                                                            .name}
                                                                    </div>

                                                                    {booking
                                                                        .provider
                                                                        .phoneNo && (
                                                                        <div className="small text-muted mt-1 text-break">
                                                                            📞{" "}
                                                                            {
                                                                                booking
                                                                                    .provider
                                                                                    .phoneNo
                                                                            }
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                {booking.provider
                                                                    .phoneNo && (
                                                                    <div className="col-auto">
                                                                        <a
                                                                            href={`tel:${booking.provider.phoneNo}`}
                                                                            className="btn btn-outline-success btn-sm"
                                                                            title="Call provider"
                                                                        >
                                                                            ☎ Call
                                                                        </a>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <div className="small text-muted">
                                                                Provider not assigned yet
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* ADDRESS BOX */}
                                                <div className="col-12">
                                                    <div className="border rounded-3 p-3">
                                                        <div className="small text-muted mb-1">
                                                            📍 Service Address
                                                        </div>
                                                        <div className="text-break">
                                                            {booking.address ||
                                                                "N/A"}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* AMOUNT BOX */}
                                                <div className="col-6">
                                                    <div className="border rounded-3 p-3 h-100">
                                                        <div className="small text-muted mb-1">
                                                            💰 Total Amount
                                                        </div>
                                                        <div className="fw-bold fs-5 text-break">
                                                            {formatMoney(
                                                                booking.totalAmount
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* PAYMENT BOX */}
                                                <div className="col-6">
                                                    <div
                                                        className={`border rounded-3 p-3 h-100 ${payment.box}`}
                                                    >
                                                        <div className="small opacity-75 mb-1">
                                                            💳 Payment
                                                        </div>
                                                        <div className="fw-semibold text-break">
                                                            <span className="me-1">
                                                                {payment.icon}
                                                            </span>
                                                            {formatStatus(
                                                                booking.paymentStatus
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* CANCEL BOX */}
                                                {booking.status !== "cancelled" &&
                                                    booking.status !==
                                                        "completed" && (
                                                        <div className="col-12">
                                                            <div className="border rounded-3 p-2">
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-outline-danger btn-sm w-100"
                                                                    disabled={
                                                                        cancellingId ===
                                                                        booking._id
                                                                    }
                                                                    onClick={() =>
                                                                        handleCancelBooking(
                                                                            booking._id
                                                                        )
                                                                    }
                                                                >
                                                                    {cancellingId ===
                                                                    booking._id ? (
                                                                        <>
                                                                            <span className="spinner-border spinner-border-sm me-2" />
                                                                            Cancelling...
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            ✕{" "}
                                                                            Cancel
                                                                            Booking
                                                                        </>
                                                                    )}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBookingPage;
