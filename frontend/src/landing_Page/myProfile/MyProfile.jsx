import React, { useEffect, useState } from "react";
import axios from "axios";

/* ================= PASSWORD FIELD ================= */

const PasswordField = ({
  label,
  name,
  value,
  onChange,
  show,
  setShow,
  required = true,
  minLength,
  pattern,
}) => (
  <div className="mb-3">
    <label className="form-label fw-semibold small">
      {label}
    </label>

    <div className="password-input">
      <input
        type={show ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        className="form-control"
        placeholder={`Enter ${label.toLowerCase()}`}
        required={required}
        minLength={minLength}
        pattern={pattern}
      />

      <button
        type="button"
        className="password-toggle"
        onClick={() => setShow((prev) => !prev)}
      >
        {show ? "🙈" : "👁️"}
      </button>
    </div>

    <div className="invalid-feedback">
      {name === "currentPassword"
        ? "Please enter your current password."
        : name === "newPassword"
        ? "Password must be at least 6 characters."
        : "Please confirm your new password."}
    </div>
  </div>
);


/* ================= MAIN COMPONENT ================= */

const MyProfile = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const APP_URL = import.meta.env.VITE_APP_URL;

  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const [profileError, setProfileError] = useState("");
  const [ordersError, setOrdersError] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  const [profileValidated, setProfileValidated] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState("");

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phoneNo: "",
  });

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [passwordValidated, setPasswordValidated] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });


  /* ================= FETCH PROFILE ================= */

  const fetchProfile = async () => {
    try {
      setLoadingProfile(true);
      setProfileError("");

      const { data } = await axios.get(`${API_URL}/profile`, {
        withCredentials: true,
      });

      if (data.success) {
        setUser(data.user);

        setFormData({
          fullname: data.user.fullname || "",
          email: data.user.email || "",
          phoneNo: data.user.phoneNo || "",
        });
      }
    } catch (error) {
      console.error("Profile Error:", error);

      setProfileError(
        error.response?.data?.message ||
          "Unable to load profile."
      );
    } finally {
      setLoadingProfile(false);
    }
  };


  /* ================= FETCH ORDERS ================= */

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      setOrdersError("");

      const { data } = await axios.get(`${API_URL}/mybookings`, {
        withCredentials: true,
      });

      const bookings = data.bookings || data || [];

      setOrders(Array.isArray(bookings) ? bookings : []);
    } catch (error) {
      console.error("Orders Error:", error);

      setOrdersError(
        error.response?.data?.message ||
          "Unable to load order history."
      );
    } finally {
      setLoadingOrders(false);
    }
  };


  useEffect(() => {
    fetchProfile();
    fetchOrders();
  }, []);


  /* ================= INPUT HANDLERS ================= */

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setProfileSuccess("");
  };


  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setPasswordError("");
    setPasswordSuccess("");
  };


  /* ================= EDIT PROFILE ================= */

  const openEditProfile = () => {
    setFormData({
      fullname: user.fullname || "",
      email: user.email || "",
      phoneNo: user.phoneNo || "",
    });

    setProfileValidated(false);
    setProfileError("");
    setProfileSuccess("");
    setIsEditing(true);
  };


  const handleSaveProfile = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;

    setProfileValidated(true);
    setProfileSuccess("");
    setProfileError("");

    if (!form.checkValidity()) {
      return;
    }

    try {
      setSavingProfile(true);

      const { data } = await axios.put(
        `${API_URL}/profile`,
        {
          fullname: formData.fullname.trim(),
          email: formData.email.trim(),
          phoneNo: formData.phoneNo,
        },
        {
          withCredentials: true,
        }
      );

      if (data.success) {
        setUser(data.user);

        setFormData({
          fullname: data.user.fullname || "",
          email: data.user.email || "",
          phoneNo: data.user.phoneNo || "",
        });

        setProfileSuccess("Profile updated successfully.");

        setTimeout(() => {
          setIsEditing(false);
          setProfileSuccess("");
        }, 1200);
      }
    } catch (error) {
      console.error("Update Profile Error:", error);

      setProfileError(
        error.response?.data?.message ||
          "Unable to update profile."
      );
    } finally {
      setSavingProfile(false);
    }
  };


  /* ================= PASSWORD ================= */

  const handleChangePassword = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;

    setPasswordValidated(true);
    setPasswordError("");
    setPasswordSuccess("");

    const confirmInput = form.elements.confirmPassword;

    if (
      passwordData.newPassword !==
      passwordData.confirmPassword
    ) {
      confirmInput.setCustomValidity(
        "Passwords do not match."
      );
    } else {
      confirmInput.setCustomValidity("");
    }

    if (!form.checkValidity()) {
      return;
    }

    try {
      setChangingPassword(true);

      const { data } = await axios.put(
        `${API_URL}/change-password`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        {
          withCredentials: true,
        }
      );

      if (data.success) {
        setPasswordSuccess(
          "Password changed successfully."
        );

        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });

        setShowPassword({
          current: false,
          new: false,
          confirm: false,
        });

        setPasswordValidated(false);

        setTimeout(() => {
          setShowPasswordForm(false);
          setPasswordSuccess("");
        }, 1500);
      }
    } catch (error) {
      console.error("Change Password Error:", error);

      setPasswordError(
        error.response?.data?.message ||
          "Unable to change password."
      );
    } finally {
      setChangingPassword(false);
    }
  };


  /* ================= HELPERS ================= */

  const getInitials = (name = "") => {
    const words = name.trim().split(/\s+/).filter(Boolean);

    if (!words.length) return "U";

    if (words.length === 1) {
      return words[0][0].toUpperCase();
    }

    return (
      words[0][0] +
      words[words.length - 1][0]
    ).toUpperCase();
  };


  const formatDate = (date) => {
    if (!date) return "N/A";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return date;
    }

    return parsed.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };


  const getStatus = (status) => {
    const styles = {
      completed: ["#ecfdf5", "#047857", "#a7f3d0", "#10b981"],
      pending: ["#fffbeb", "#b45309", "#fde68a", "#f59e0b"],
      cancelled: ["#fef2f2", "#b91c1c", "#fecaca", "#ef4444"],
      canceled: ["#fef2f2", "#b91c1c", "#fecaca", "#ef4444"],
      confirmed: ["#eff6ff", "#1d4ed8", "#bfdbfe", "#3b82f6"],
    };

    const value = status?.toLowerCase();

    const [background, color, border, dot] =
      styles[value] || [
        "#f3f4f6",
        "#4b5563",
        "#d1d5db",
        "#6b7280",
      ];

    return {
      background,
      color,
      border,
      dot,
    };
  };


  /* ================= LOADING ================= */

  if (loadingProfile) {
    return (
      <>
        <style>{styles}</style>

        <div className="loading-page">
          <div className="text-center">
            <div className="spinner mb-3"></div>

            <strong>
              Loading your profile...
            </strong>

            <div className="text-secondary small">
              Please wait
            </div>
          </div>
        </div>
      </>
    );
  }


  /* ================= PROFILE ERROR ================= */

  if (!user) {
    return (
      <>
        <style>{styles}</style>

        <div className="error-page">
          <div className="error-card">
            <div className="error-icon">
              🔒
            </div>

            <h5 className="fw-bold">
              Unable to load profile
            </h5>

            <p className="text-secondary small">
              {profileError ||
                "Please login again and try again."}
            </p>

            <button
              className="primary-button"
              onClick={() =>
                (window.location.href = APP_URL)
              }
            >
              Go to Home
            </button>
          </div>
        </div>
      </>
    );
  }


  return (
    <>
      <style>{styles}</style>

      <div className="profile-page">
        <div className="profile-container">

          {/* NAVBAR */}

          <div className="homigo-nav">

            <div
              className="homigo-logo d-flex align-items-center"
              onClick={() => {
                window.location.href = APP_URL;
              }}
              style={{ cursor: "pointer" }}
            >
              <div className="logo-box" onClick={() => {
                window.location.href = APP_URL;
              }}
              style={{ cursor: "pointer" }}>
                <img
                  src="/media/images/HomiGoLogo.png"
                  alt="Homigo Logo"
                  className="img-fluid"
              />
              </div>
            </div>

            <button
              className="home-button"
              onClick={() =>
                (window.location.href = APP_URL)
              }
            >
              <span>⌂</span>
              <span className="home-text">
                Home
              </span>
            </button>

          </div>


          {/* HEADER */}

          <div className="page-header">
            <h2>My Profile</h2>

            <p>
              Manage your account, security and bookings.
            </p>
          </div>


          <div className="row g-4">

            {/* ================= PROFILE CARD ================= */}

            <div className="col-12 col-lg-4">

              <div className="profile-card">

                <div className="profile-cover">
                  <div className="avatar">
                    {getInitials(user.fullname)}
                  </div>
                </div>

                <div className="profile-content">

                  <h4>{user.fullname}</h4>

                  <p className="profile-email">
                    {user.email}
                  </p>

                  <div>

                    <InfoItem
                      icon="👤"
                      label="Full Name"
                      value={user.fullname}
                    />

                    <InfoItem
                      icon="✉"
                      label="Email Address"
                      value={user.email}
                    />

                    <InfoItem
                      icon="☎"
                      label="Phone Number"
                      value={`+91 ${user.phoneNo}`}
                    />

                  </div>


                  <button
                    className="primary-button w-100 mt-4"
                    onClick={openEditProfile}
                  >
                    ✎ Edit Profile
                  </button>


                  <button
                    className="secondary-button w-100 mt-2"
                    onClick={() => {
                      setShowPasswordForm((prev) => !prev);
                      setPasswordError("");
                      setPasswordSuccess("");
                      setPasswordValidated(false);
                    }}
                  >
                    🔒 Change Password
                  </button>

                </div>
              </div>

            </div>


            {/* ================= RIGHT SIDE ================= */}

            <div className="col-12 col-lg-8">


              {/* ================= EDIT PROFILE ================= */}

              {isEditing && (
                <div className="section-card mb-4">

                  <SectionHeader
                    title="Edit Profile"
                    subtitle="Update your personal information."
                    onClose={() => {
                      setIsEditing(false);
                      setProfileError("");
                      setProfileSuccess("");
                    }}
                  />


                  {profileError && (
                    <div className="alert alert-danger py-2">
                      {profileError}
                    </div>
                  )}


                  {profileSuccess && (
                    <div className="alert alert-success py-2">
                      ✓ {profileSuccess}
                    </div>
                  )}


                  <form
                    noValidate
                    className={
                      profileValidated
                        ? "needs-validation was-validated"
                        : "needs-validation"
                    }
                    onSubmit={handleSaveProfile}
                  >

                    <div className="row g-3">

                      {/* NAME */}

                      <div className="col-12">

                        <label className="form-label fw-semibold small">
                          Full Name
                        </label>

                        <input
                          type="text"
                          name="fullname"
                          value={formData.fullname}
                          onChange={handleInputChange}
                          className="form-control"
                          placeholder="Enter your full name"
                          required
                          minLength={2}
                        />

                        <div className="invalid-feedback">
                          Please enter your full name.
                        </div>

                      </div>


                      {/* EMAIL */}

                      <div className="col-12 col-md-6">

                        <label className="form-label fw-semibold small">
                          Email Address
                        </label>

                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="form-control"
                          placeholder="Enter your email"
                          required
                        />

                        <div className="invalid-feedback">
                          Please enter a valid email address.
                        </div>

                      </div>


                      {/* PHONE */}

                      <div className="col-12 col-md-6">

                        <label className="form-label fw-semibold small">
                          Phone Number
                        </label>

                        <input
                          type="tel"
                          name="phoneNo"
                          value={formData.phoneNo}
                          onChange={handleInputChange}
                          className="form-control"
                          placeholder="Enter 10 digit phone number"
                          required
                          pattern="[0-9]{10}"
                        />

                        <div className="invalid-feedback">
                          Please enter a valid 10 digit phone number.
                        </div>

                      </div>

                    </div>


                    <div className="button-row mt-4">

                      <button
                        type="button"
                        className="secondary-button"
                        disabled={savingProfile}
                        onClick={() =>
                          setIsEditing(false)
                        }
                      >
                        Cancel
                      </button>


                      <button
                        type="submit"
                        className="primary-button"
                        disabled={savingProfile}
                      >
                        {savingProfile
                          ? "Saving..."
                          : "Save Changes"}
                      </button>

                    </div>

                  </form>

                </div>
              )}


              {/* ================= CHANGE PASSWORD ================= */}

              {showPasswordForm && (
                <div className="section-card mb-4">

                  <SectionHeader
                    title="Change Password"
                    subtitle="Keep your Homigo account secure."
                    onClose={() => {
                      setShowPasswordForm(false);
                      setPasswordError("");
                      setPasswordSuccess("");
                      setPasswordValidated(false);
                    }}
                  />


                  {passwordError && (
                    <div className="alert alert-danger py-2">
                      {passwordError}
                    </div>
                  )}


                  {passwordSuccess && (
                    <div className="alert alert-success py-2">
                      ✓ {passwordSuccess}
                    </div>
                  )}


                  <form
                    noValidate
                    className={
                      passwordValidated
                        ? "needs-validation was-validated"
                        : "needs-validation"
                    }
                    onSubmit={handleChangePassword}
                  >

                    <div className="password-container">

                      <PasswordField
                        label="Current Password"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        show={showPassword.current}
                        setShow={(value) =>
                          setShowPassword((prev) => ({
                            ...prev,
                            current:
                              typeof value === "function"
                                ? value(prev.current)
                                : value,
                          }))
                        }
                      />


                      <PasswordField
                        label="New Password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        show={showPassword.new}
                        setShow={(value) =>
                          setShowPassword((prev) => ({
                            ...prev,
                            new:
                              typeof value === "function"
                                ? value(prev.new)
                                : value,
                          }))
                        }
                        minLength={6}
                      />


                      <PasswordField
                        label="Confirm New Password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        show={showPassword.confirm}
                        setShow={(value) =>
                          setShowPassword((prev) => ({
                            ...prev,
                            confirm:
                              typeof value === "function"
                                ? value(prev.confirm)
                                : value,
                          }))
                        }
                      />

                      {/* CONFIRM PASSWORD ERROR */}

                      {passwordValidated &&
                        passwordData.confirmPassword &&
                        passwordData.newPassword !==
                          passwordData.confirmPassword && (
                          <div className="text-danger small mt-n2 mb-3">
                            ✕ Passwords do not match.
                          </div>
                        )}

                    </div>


                    <div className="button-row">

                      <button
                        type="button"
                        className="secondary-button"
                        disabled={changingPassword}
                        onClick={() => {
                          setShowPasswordForm(false);

                          setPasswordData({
                            currentPassword: "",
                            newPassword: "",
                            confirmPassword: "",
                          });

                          setPasswordError("");
                          setPasswordSuccess("");
                          setPasswordValidated(false);
                        }}
                      >
                        Cancel
                      </button>


                      <button
                        type="submit"
                        className="primary-button"
                        disabled={changingPassword}
                      >
                        {changingPassword
                          ? "Updating..."
                          : "Update Password"}
                      </button>

                    </div>

                  </form>

                </div>
              )}


              {/* ================= ORDER HISTORY ================= */}

              <div className="section-card order-history-section">

                <div className="section-header order-history-header">

                  <div>
                    <h5>Order History</h5>
                    <p>View your previous Homigo bookings.</p>
                  </div>

                  <span className="order-count">
                    {orders.length} Orders
                  </span>

                </div>

                {loadingOrders ? (

                  <div className="order-scroll-box order-loading-box">
                    <div className="empty-state">
                      <div className="small-spinner"></div>
                      <strong>Loading orders...</strong>
                    </div>
                  </div>

                ) : ordersError ? (

                  <div className="order-scroll-box">
                    <div className="empty-state">
                      <div className="empty-icon">⚠️</div>
                      <h6>Unable to load orders</h6>
                      <div className="alert alert-danger py-2">
                        {ordersError}
                      </div>
                      <button
                        className="secondary-button"
                        onClick={fetchOrders}
                      >
                        Try Again
                      </button>
                    </div>
                  </div>

                ) : orders.length === 0 ? (

                  <div className="order-scroll-box">
                    <div className="empty-state">
                      <div className="empty-icon">📦</div>
                      <h6>No orders yet</h6>
                      <p>Your Homigo bookings will appear here.</p>
                    </div>
                  </div>

                ) : (

                  <div className="order-scroll-box">
                    <div className="order-list">

                      {orders.map((order) => {

                        const status = getStatus(order.status);

                        return (
                          <div className="order-card" key={order._id}>

                            {/* ORDER HEADER */}
                            <div className="order-top">

                              <div className="service-info">

                                <div className="service-icon">
                                  🛠️
                                </div>

                                <div className="service-text">
                                  <strong>
                                    {order.serviceName || "Service"}
                                  </strong>

                                  <div className="order-id">
                                    Order ID: {order._id}
                                  </div>
                                </div>

                              </div>

                              <span
                                className="status-badge"
                                style={{
                                  background: status.background,
                                  color: status.color,
                                  borderColor: status.border,
                                }}
                              >
                                <span
                                  className="status-dot"
                                  style={{
                                    background: status.dot,
                                  }}
                                />
                                {order.status || "Pending"}
                              </span>

                            </div>

                            {/* ORDER DETAILS */}
                            <div className="row g-2 order-details">

                              <div className="col-6 col-md-4">
                                <div className="order-detail-box">
                                  <small>📅 Date</small>
                                  <strong>
                                    {formatDate(order.bookingDate)}
                                  </strong>
                                </div>
                              </div>

                              <div className="col-6 col-md-4">
                                <div className="order-detail-box">
                                  <small>🕐 Time</small>
                                  <strong>
                                    {order.bookingTime || "N/A"}
                                  </strong>
                                </div>
                              </div>

                              <div className="col-12 col-md-4">
                                <div className="order-detail-box amount">
                                  <small>💰 Total Amount</small>
                                  <strong>
                                    ₹
                                    {Number(
                                      order.totalAmount || 0
                                    ).toLocaleString("en-IN")}
                                  </strong>
                                </div>
                              </div>

                            </div>

                          </div>
                        );
                      })}

                    </div>
                  </div>

                )}

              </div>

            </div>

          </div>


          <footer>
            © {new Date().getFullYear()} Homigo · Your home, our care.
          </footer>

        </div>
      </div>
    </>
  );
};


/* ================= SMALL COMPONENTS ================= */

const InfoItem = ({ icon, label, value }) => (
  <div className="info-item">

    <div className="info-icon">
      {icon}
    </div>

    <div className="info-text">
      <small>{label}</small>
      <strong>{value}</strong>
    </div>

  </div>
);


const SectionHeader = ({
  title,
  subtitle,
  onClose,
}) => (
  <div className="section-header">

    <div>
      <h5>{title}</h5>
      <p>{subtitle}</p>
    </div>

    <button
      type="button"
      className="close-button"
      onClick={onClose}
    >
      ×
    </button>

  </div>
);


/* ================= CSS ================= */

const styles = `
  * {
    box-sizing: border-box;
  }

  .profile-page {
    min-height: 100vh;
    background: #f6f8fa;
    color: #1f2937;
  }

  .profile-container {
    width: 100%;
    max-width: 1400px;
    margin: auto;
    padding: 24px;
  }

  .homigo-nav {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 16px;
    padding: 12px 18px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 4px 20px rgba(0,0,0,.04);
    margin-bottom: 30px;
  }

  .homigo-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    color: #00a58f;
    font-size: 21px;
    font-weight: 800;
  }

  .logo-box {
    width: 42px;
    height: 42px;
    border-radius: 11px;
    display: grid;
    place-items: center;
    color: white;
    background: linear-gradient(135deg,#00BFA6,#00a58f);
  }

  .home-button {
    border: 1px solid #d1d5db;
    background: white;
    color: #374151;
    border-radius: 10px;
    padding: 9px 16px;
    font-weight: 600;
  }

  .home-button:hover {
    background: #ecfdf5;
    border-color: #00BFA6;
    color: #008f7d;
  }

  .page-header {
    margin-bottom: 25px;
  }

  .page-header h2 {
    font-size: 28px;
    font-weight: 750;
    margin-bottom: 4px;
  }

  .page-header p,
  .section-header p {
    color: #9ca3af;
    margin: 0;
    font-size: 13px;
  }

  .profile-card,
  .section-card {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 18px;
    box-shadow: 0 5px 25px rgba(0,0,0,.035);
  }

  .section-card {
    padding: 24px;
  }

  .profile-card {
    overflow: hidden;
  }

  .profile-cover {
    height: 120px;
    position: relative;
    background: linear-gradient(135deg,#00BFA6,#009f8b);
  }

  .avatar {
    position: absolute;
    width: 96px;
    height: 96px;
    bottom: -48px;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 50%;
    border: 5px solid white;
    background: white;
    color: #00a58f;
    display: grid;
    place-items: center;
    font-size: 30px;
    font-weight: 800;
    box-shadow: 0 8px 25px rgba(0,0,0,.12);
  }

  .profile-content {
    padding: 65px 25px 25px;
    text-align: center;
  }

  .profile-content h4 {
    margin-bottom: 3px;
    font-weight: 750;
  }

  .profile-email {
    color: #6b7280;
    font-size: 14px;
    margin-bottom: 22px;
    word-break: break-word;
  }

  .info-item {
    display: flex;
    align-items: center;
    gap: 13px;
    padding: 13px 0;
    text-align: left;
    border-bottom: 1px solid #f0f1f3;
  }

  .info-item:last-child {
    border-bottom: 0;
  }

  .info-icon {
    width: 38px;
    height: 38px;
    flex-shrink: 0;
    border-radius: 10px;
    display: grid;
    place-items: center;
    background: #ecfdf9;
    color: #00a58f;
  }

  .info-text {
    min-width: 0;
  }

  .info-text small {
    display: block;
    color: #9ca3af;
    font-size: 11px;
    margin-bottom: 2px;
  }

  .info-text strong {
    display: block;
    font-size: 14px;
    color: #374151;
    word-break: break-word;
  }

  .primary-button,
  .secondary-button {
    border-radius: 10px;
    padding: 11px 18px;
    font-weight: 650;
    transition: .2s;
  }

  .primary-button {
    border: 0;
    color: white;
    background: linear-gradient(135deg,#00BFA6,#00a58f);
  }

  .primary-button:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(0,191,166,.22);
  }

  .secondary-button {
    border: 1px solid #d1d5db;
    background: white;
    color: #4b5563;
  }

  .secondary-button:hover {
    background: #f9fafb;
  }

  .primary-button:disabled,
  .secondary-button:disabled {
    opacity: .6;
    cursor: not-allowed;
  }

  .button-row {
    display: flex;
    gap: 10px;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 15px;
    margin-bottom: 22px;
  }

  .section-header h5 {
    margin: 0 0 3px;
    font-weight: 750;
  }

  .close-button {
    border: 0;
    background: transparent;
    color: #6b7280;
    font-size: 25px;
    line-height: 1;
  }

  .form-control {
    height: 48px;
    border-radius: 10px;
  }

  .form-control:focus {
    border-color: #00BFA6;
    box-shadow: 0 0 0 3px rgba(0,191,166,.1);
  }

  .password-container {
    max-width: 650px;
  }

  .password-input {
    position: relative;
  }

  .password-input .form-control {
    padding-right: 50px;
  }

  .password-toggle {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    border: 0;
    background: transparent;
    cursor: pointer;
  }

  .order-count {
    background: #ecfdf9;
    color: #008f7d;
    padding: 7px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 700;
    white-space: nowrap;
  }

  /* ORDER HISTORY SCROLL AREA */
  .order-history-section {
    overflow: hidden;
  }

  .order-history-header {
    margin-bottom: 18px;
  }

  .order-scroll-box {
    height: 520px;
    max-height: 520px;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 4px 8px 4px 2px;
    border: 1px solid #eef0f2;
    border-radius: 14px;
    background: #fafbfb;
    scrollbar-width: thin;
    scrollbar-color: #b7ddd7 transparent;
  }

  .order-scroll-box::-webkit-scrollbar {
    width: 7px;
  }

  .order-scroll-box::-webkit-scrollbar-track {
    background: transparent;
  }

  .order-scroll-box::-webkit-scrollbar-thumb {
    background: #b7ddd7;
    border-radius: 10px;
  }

  .order-scroll-box::-webkit-scrollbar-thumb:hover {
    background: #8bcac0;
  }

  .order-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .order-card {
    border: 1px solid #e8eaed;
    border-radius: 14px;
    padding: 16px;
    margin: 0;
    background: #fff;
    width: 100%;
  }

  .order-card:last-child {
    margin-bottom: 0;
  }

  .order-card:hover {
    border-color: #b7e9e1;
    box-shadow: 0 5px 18px rgba(0,0,0,.04);
  }

  .order-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 15px;
  }

  .service-info {
    display: flex;
    gap: 12px;
    min-width: 0;
  }

  .service-icon {
    width: 44px;
    height: 44px;
    flex-shrink: 0;
    border-radius: 12px;
    display: grid;
    place-items: center;
    background: #ecfdf9;
  }

  .order-id {
    margin-top: 3px;
    font-size: 11px;
    color: #9ca3af;
    word-break: break-all;
  }

  .service-text {
    min-width: 0;
    flex: 1;
  }

  .service-text strong {
    display: block;
    word-break: break-word;
    overflow-wrap: anywhere;
  }

  .order-detail-box {
    min-width: 0;
    height: 100%;
    padding: 10px 12px;
    border: 1px solid #eef0f2;
    border-radius: 10px;
    background: #fafafa;
  }

  .order-detail-box small {
    display: block;
    color: #6b7280;
    font-size: 11px;
    margin-bottom: 3px;
  }

  .order-detail-box strong {
    display: block;
    font-size: 13px;
    word-break: break-word;
    overflow-wrap: anywhere;
  }

  .order-loading-box {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .status-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 10px;
    border-radius: 20px;
    border: 1px solid;
    font-size: 11px;
    font-weight: 700;
    white-space: nowrap;
  }

  .status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
  }

  .order-details {
    margin-top: 18px;
    padding-top: 15px;
    border-top: 1px solid #f0f1f3;
  }

  .order-details small {
    display: block;
    color: #6b7280;
    margin-bottom: 4px;
  }

  .order-details strong {
    font-size: 13px;
  }

  .amount {
    text-align: right;
  }

  .amount strong {
    font-size: 16px;
  }

  .empty-state {
    text-align: center;
    padding: 45px 10px;
  }

  .empty-state p {
    color: #6b7280;
    font-size: 13px;
  }

  .empty-icon {
    font-size: 35px;
    margin-bottom: 10px;
  }

  .spinner,
  .small-spinner {
    border-radius: 50%;
    border: 3px solid #d1fae5;
    border-top-color: #00BFA6;
    animation: spin .8s linear infinite;
    margin: auto;
  }

  .spinner {
    width: 42px;
    height: 42px;
  }

  .small-spinner {
    width: 30px;
    height: 30px;
    margin-bottom: 12px;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .loading-page,
  .error-page {
    min-height: 100vh;
    background: #f6f8fa;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }

  .error-card {
    width: 100%;
    max-width: 420px;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 18px;
    padding: 35px 25px;
    text-align: center;
  }

  .error-icon {
    font-size: 42px;
    margin-bottom: 10px;
  }

  footer {
    text-align: center;
    color: #9ca3af;
    font-size: 12px;
    margin-top: 20px;
    padding-bottom: 5px;
  }

  @media (max-width: 767px) {

    .profile-container {
      padding: 12px;
    }

    .homigo-nav {
      padding: 10px 12px;
    }

    .logo-box {
      width: 38px;
      height: 38px;
    }

    .home-button {
      padding: 8px 11px;
    }

    .page-header h2 {
      font-size: 23px;
    }

    .profile-cover {
      height: 105px;
    }

    .avatar {
      width: 88px;
      height: 88px;
      bottom: -44px;
    }

    .profile-content {
      padding: 58px 18px 20px;
    }

    .section-card {
      padding: 18px;
    }

    .button-row {
      flex-direction: column;
    }

    .button-row button {
      width: 100%;
    }

    .order-top {
      align-items: flex-start;
    }

    .amount {
      text-align: left;
      margin-top: 12px;
    }
  }

  @media (max-width: 480px) {

    .profile-container {
      padding: 8px;
    }

    .home-text {
      display: none;
    }

    .home-button {
      width: 40px;
      height: 40px;
      padding: 0;
    }

    .order-scroll-box {
      height: 460px;
      max-height: 460px;
      padding: 3px 5px 3px 2px;
    }

    .order-card {
      padding: 14px;
    }

    .order-top {
      flex-direction: column;
      gap: 10px;
    }

    .status-badge {
      align-self: flex-start;
    }
  }
`;

export default MyProfile;