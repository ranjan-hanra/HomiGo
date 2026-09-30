import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import AdminButton from "./admin/AdminButton";
import "./Navbar.css";
import axios from "axios";

function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();

    // User will come ONLY from backend
    const [user, setUser] = useState(null);

    const [showProfile, setShowProfile] = useState(false);

    // =========================
    // GET USER PROFILE
    // =========================
    const getProfile = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/profile`,
                {
                    withCredentials: true,
                }
            );

            console.log("Profile response:", response.data);

            // Supports both:
            // { fullname, email }
            // and
            // { user: { fullname, email } }
            const profileData = response.data.user || response.data;

            setUser(profileData);

        } catch (error) {
            console.log(
                "Profile fetch error:",
                error.response?.data || error.message
            );

            setUser(null);
        }
    };

    // Fetch profile whenever route changes.
    // This also runs after login when user is redirected.
    useEffect(() => {
        getProfile();
    }, [location.pathname]);


    // Get initials from full name
    const getInitials = (fullname) => {
        if (!fullname) return "";

        const nameParts = fullname.trim().split(" ");

        if (nameParts.length === 1) {
            return nameParts[0].charAt(0).toUpperCase();
        }

        return (
            nameParts[0].charAt(0).toUpperCase() +
            nameParts[1].charAt(0).toUpperCase()
        );
    };


    // =========================
    // LOGOUT
    // =========================
    const handleLogout = async () => {
        try {
            await axios.post(
                `${import.meta.env.VITE_API_URL}/logout`,
                {},
                {
                    withCredentials: true,
                }
            );
        } catch (error) {
            console.error("Logout error:", error);
        }

        setUser(null);
        setShowProfile(false);
        navigate("/");
    };


    return (
        <>
            <nav
                className="navbar navbar-expand-lg navbar-light bg-light border-bottom fixed-top"
                style={{
                    height: "90px",
                    padding: "0",
                    zIndex: 1030,
                }}
            >
                <div
                    className="container px-2"
                    style={{
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                    }}
                >

                    {/* Logo */}
                    <Link
                        className="navbar-brand"
                        to="/"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            margin: "0",
                        }}
                    >
                        <img
                            src="/media/images/HomiGoLogo.png"
                            alt="logo"
                            style={{
                                width: "140px",
                                height: "auto",
                                display: "block",
                            }}
                        />
                    </Link>

                    <div
                        className="collapse navbar-collapse justify-content-end"
                        id="navbarSupportedContent"
                    >
                        <ul
                            className="navbar-nav gap-3"
                            style={{
                                alignItems: "center",
                            }}
                        >

                            {/* Services */}
                            <li className="nav-item">
                                <Link
                                    className={`nav-link ${
                                        location.pathname === "/services"
                                            ? "active-nav"
                                            : ""
                                    }`}
                                    to="/services"
                                >
                                    Services
                                </Link>
                            </li>

                            {/* Careers */}
                            <li className="nav-item">
                                <Link
                                    className={`nav-link ${
                                        location.pathname === "/careers"
                                            ? "active-nav"
                                            : ""
                                    }`}
                                    to="/careers"
                                >
                                    Careers
                                </Link>
                            </li>

                            {/* My Bookings */}
                            {user && (
                                <li className="nav-item">
                                    <Link
                                        className={`nav-link ${
                                            location.pathname === "/mybookings"
                                                ? "active-nav"
                                                : ""
                                        }`}
                                        to="/mybookings"
                                    >
                                        My Bookings
                                    </Link>
                                </li>
                            )}

                            {/* Support */}
                            <li className="nav-item">
                                <Link
                                    className={`nav-link ${
                                        location.pathname === "/support"
                                            ? "active-nav"
                                            : ""
                                    }`}
                                    to="/support"
                                >
                                    Support
                                </Link>
                            </li>


                            {/* ========================= */}
                            {/* LOGGED OUT */}
                            {/* ========================= */}

                            {!user && (
                                <>
                                    {/* Login */}
                                    <li
                                        className="nav-item login"
                                        style={{
                                            border: "1px solid grey",
                                            borderRadius: "8px",
                                        }}
                                    >
                                        <Link
                                            className="nav-link"
                                            to="/login"
                                            style={{
                                                padding: "8px 16px",
                                            }}
                                        >
                                            Login
                                        </Link>
                                    </li>

                                    {/* Sign Up */}
                                    <li
                                        className="nav-item signup"
                                        style={{
                                            border: "1px solid #00BFA6",
                                            borderRadius: "8px",
                                            backgroundColor: "#00BFA6",
                                        }}
                                    >
                                        <Link
                                            className="nav-link text-white"
                                            to="/signup"
                                            style={{
                                                padding: "8px 16px",
                                            }}
                                        >
                                            Sign Up
                                        </Link>
                                    </li>

                                    {/* Admin */}
                                    <AdminButton />
                                </>
                            )}


                            {/* ========================= */}
                            {/* LOGGED IN */}
                            {/* ========================= */}

                            {user && (
                                <li
                                    className="nav-item position-relative"
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >

                                    {/* Profile Button */}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowProfile(!showProfile)
                                        }
                                        style={{
                                            border: "none",
                                            background: "transparent",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "10px",
                                            cursor: "pointer",
                                            padding: "4px",
                                        }}
                                    >

                                        {/* Profile Circle */}
                                        <span
                                            style={{
                                                width: "42px",
                                                height: "42px",
                                                borderRadius: "50%",
                                                backgroundColor: "#00BFA6",
                                                color: "white",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontWeight: "600",
                                                fontSize: "15px",
                                            }}
                                        >
                                            {getInitials(user.fullname)}
                                        </span>

                                        {/* Full Name */}
                                        <span
                                            style={{
                                                fontWeight: "500",
                                                color: "#333",
                                            }}
                                        >
                                            {user.fullname}
                                        </span>

                                        <span style={{ fontSize: "12px" }}>
                                            ▼
                                        </span>

                                    </button>


                                    {/* Profile Dropdown */}
                                    {showProfile && (
                                        <div
                                            style={{
                                                position: "absolute",
                                                top: "55px",
                                                right: "0",
                                                width: "230px",
                                                backgroundColor: "white",
                                                borderRadius: "10px",
                                                boxShadow:
                                                    "0 5px 20px rgba(0,0,0,0.15)",
                                                padding: "15px",
                                                zIndex: 2000,
                                            }}
                                        >

                                            {/* User Info */}
                                            <div
                                                style={{
                                                    paddingBottom: "12px",
                                                    borderBottom:
                                                        "1px solid #eee",
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        fontWeight: "600",
                                                    }}
                                                >
                                                    {user.fullname}
                                                </div>

                                                <small className="text-secondary">
                                                    {user.email}
                                                </small>
                                            </div>


                                            {/* Profile */}
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowProfile(false);
                                                    navigate("/myprofile");
                                                }}
                                                className="btn btn-light w-100 mt-3"
                                            >
                                                My Profile
                                            </button>


                                            {/* Logout */}
                                            <button
                                                type="button"
                                                onClick={handleLogout}
                                                className="btn btn-outline-danger w-100 mt-2"
                                            >
                                                Logout
                                            </button>

                                        </div>
                                    )}

                                </li>
                            )}

                        </ul>
                    </div>
                </div>
            </nav>

            {/* Space for fixed navbar */}
            <div style={{ height: "30px" }}></div>
        </>
    );
}

export default Navbar;