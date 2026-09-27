import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ProviderLogin = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (!formData.email || !formData.password) {
            setError("Please enter email and password");
            return;
        }

        try {
            setLoading(true);

            const response = await axios.post(
                "http://localhost:3002/api/provider/login",
                formData,
                {
                    withCredentials: true
                }
            );

            if (response.data.success) {
                navigate("/provider");
            }

        } catch (error) {
            console.error("Provider Login Error:", error);

            setError(
                error.response?.data?.message ||
                "Invalid email or password"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center p-3">

            <div
                className="card border-0 shadow-sm"
                style={{
                    width: "100%",
                    maxWidth: "420px",
                    borderRadius: "16px"
                }}
            >

                <div className="card-body p-4 p-md-5">

                    {/* Logo */}
                    <div className="text-center mb-4">
                        <h2 className="fw-bold mb-1">
                            HomiGo
                        </h2>

                        <p className="text-muted mb-0">
                            Provider Portal
                        </p>
                    </div>

                    <h4 className="fw-semibold mb-1">
                        Welcome Back
                    </h4>

                    <p className="text-muted small mb-4">
                        Login to manage your services and bookings.
                    </p>

                    {error && (
                        <div
                            className="alert alert-danger py-2 small"
                            role="alert"
                        >
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>

                        {/* Email */}
                        <div className="mb-3">
                            <label className="form-label fw-semibold">
                                Email
                            </label>

                            <input
                                type="email"
                                name="email"
                                className="form-control"
                                placeholder="provider@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                autoComplete="email"
                            />
                        </div>

                        {/* Password */}
                        <div className="mb-4">
                            <label className="form-label fw-semibold">
                                Password
                            </label>

                            <input
                                type="password"
                                name="password"
                                className="form-control"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                autoComplete="current-password"
                            />
                        </div>

                        {/* Login */}
                        <button
                            type="submit"
                            className="btn btn-dark w-100 py-2"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span
                                        className="spinner-border spinner-border-sm me-2"
                                        role="status"
                                    ></span>

                                    Logging in...
                                </>
                            ) : (
                                "Login"
                            )}
                        </button>

                    </form>

                </div>
            </div>

        </div>
    );
};

export default ProviderLogin;