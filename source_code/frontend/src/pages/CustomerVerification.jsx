import React, { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import verification from "../assets/verification.avif";

const OTPVerification = () => {
  const inputRefs = useRef([]);
  const [otp, setOtp] = useState(["", "", "", "", ""]); // Array for 5 digits
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // New state for success
  const [isSubmitting, setIsSubmitting] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { state } = location;
  const { userId, email } = state || {};

  const handleChange = (e, index) => {
    const { value } = e.target;
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1].focus();
    } else if (e.key === "ArrowRight" && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    } else if (e.key === "Backspace") {
      const newOtp = [...otp];
      if (otp[index]) {
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1].focus();
      }
      e.preventDefault();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length !== 5) {
      setError("Please enter a 5-digit OTP");
      return;
    }
    if (!userId) {
      setError("User ID is missing");
      return;
    }

    setIsSubmitting(true);
    try {
      console.log("Sending to verify:", { userId, otp: otpValue });
      const response = await axios.post("http://localhost:3000/verify-otp", { // Fixed URL
        userId,
        otp: otpValue,
      });
      console.log("Verification response:", response.data);
      if (response.data.success) {
        setSuccessMessage("OTP verified successfully! Redirecting to sign-in..."); // Show success
        setError(""); // Clear any previous errors
        // Delay navigation to show the success message
        setTimeout(() => {
          navigate("/signin", { state: { message: "Email verified successfully! Please log in." } });
        }, 2000); // 2-second delay
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    try {
      await axios.post("http://localhost:3000/send-otp", { email });
      setError("");
      alert("OTP resent successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP");
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "linear-gradient(to bottom right, #7e57c2, #000)" }}>
      <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
        {/* Illustration Section */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ width: "500px", height: "500px", backgroundImage: `url(${verification})`, backgroundSize: "cover", borderRadius: "10px", color: "white" }}></div>
        </div>

        {/* OTP Form Section */}
        <div style={{ backgroundColor: "#ffffff", padding: "7rem 10rem", borderRadius: "15px", boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "1rem", textAlign: "center" }}>OTP Verification</h2>
          <p style={{ color: "#6B7280", textAlign: "center", marginBottom: "2rem" }}>
            Enter OTP Code sent to {email || "your email"}
          </p>
          {error && <p style={{ color: "red", textAlign: "center", marginBottom: "1rem" }}>{error}</p>}
          {successMessage && <p style={{ color: "green", textAlign: "center", marginBottom: "1rem" }}>{successMessage}</p>} {/* Success message */}
          <form onSubmit={handleSubmit}>
            <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={digit}
                  ref={(el) => (inputRefs.current[index] = el)}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  style={{
                    width: "40px",
                    height: "50px",
                    fontSize: "1.5rem",
                    textAlign: "center",
                    border: "1px solid #D1D5DB",
                    borderRadius: "8px",
                    outline: "none",
                  }}
                  disabled={isSubmitting || successMessage} // Disable inputs after success
                />
              ))}
            </div>
            <div style={{ textAlign: "center", marginBottom: "1rem" }}>
              <button
                type="button"
                onClick={handleResend}
                style={{ fontSize: "0.9rem", color: "#6a3267", textDecoration: "none", background: "none", border: "none", cursor: "pointer" }}
                disabled={isSubmitting || successMessage} // Disable resend after success
              >
                Resend Code
              </button>
            </div>
            <button
              type="submit"
              disabled={isSubmitting || successMessage} // Disable submit after success
              style={{
                width: "100%",
                backgroundColor: "#ef4444",
                color: "white",
                padding: "0.5rem 1rem",
                borderRadius: "0.5rem",
                border: "none",
                cursor: (isSubmitting || successMessage) ? "not-allowed" : "pointer",
                opacity: (isSubmitting || successMessage) ? 0.7 : 1,
              }}
            >
              {isSubmitting ? "Verifying..." : "Verify & Proceed"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;