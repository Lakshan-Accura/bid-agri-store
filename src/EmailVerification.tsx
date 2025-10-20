import React, { useEffect, useState } from "react";
import { Result, Button, Spin, Space } from "antd";
import { useLocation, useNavigate } from "react-router-dom";

const EmailVerification: React.FC = () => {
  
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState<string>("Verifying your email, please wait...");

  useEffect(() => {
    // 1️⃣ Extract token from the URL
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    console.log("✅ Verification token from URL:", token);

    if (!token) {
      setStatus("error");
      setMessage("No verification token found in the link.");
      return;
    }

    // 2️⃣ Save token in localStorage
    localStorage.setItem("emailVerificationToken", token);
    console.log("💾 Token saved to localStorage:", token);

    // 3️⃣ Send GET request to backend for verification
    const verifyEmail = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/v1/user/verifyRegistration?token=${encodeURIComponent(token)}`
        );

        if (!response.ok) {
          throw new Error("Verification failed. Invalid or expired token.");
        }

        const data = await response.json();
        console.log("📦 Verification API response:", data);

        if (data.resultStatus === "SUCCESSFUL" || data.success) {
          setStatus("success");
          setMessage("Your email has been successfully verified!");
        } else {
          setStatus("error");
          setMessage(data.message || "Verification failed. Please try again.");
        }
      } catch (error: any) {
        console.error("❌ Error verifying email:", error);
        setStatus("error");
        setMessage(error.message || "An unexpected error occurred.");
      }
    };

    verifyEmail();
  }, [location]);

  // 4️⃣ Render results
  if (status === "loading") {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Spin size="large" tip="Verifying your email..." />
      </div>
    );
  }

  return (
    <div style={{ padding: "40px", display: "flex", justifyContent: "center" }}>
      {status === "success" ? (
        <Result
          status="success"
          title="Email Verified Successfully!"
          subTitle={message}
          extra={[
            <Space key="buttons" direction="vertical" style={{ width: '100%' }} size="middle">
              <Button 
                type="primary" 
                key="farmer-login" 
                onClick={() => navigate('/farmerLogin')}
                style={{ 
                  background: '#52c41a',
                  borderColor: '#52c41a',
                  width: '200px'
                }}
              >
                Login as Farmer
              </Button>,
              <Button 
                type="primary" 
                key="store-login" 
                onClick={() => navigate('/storeLogin')}
                style={{ 
                  background: '#1890ff',
                  borderColor: '#1890ff',
                  width: '200px'
                }}
              >
                Login as Store
              </Button>
            </Space>
          ]}
        />
      ) : (
        <Result
          status="error"
          title="Email Verification Failed"
          subTitle={message}
          extra={[
            <Button type="primary" key="home" onClick={() => navigate("/")}>
              Go Home
            </Button>,
          ]}
        />
      )}
    </div>
  );
};

export default EmailVerification;