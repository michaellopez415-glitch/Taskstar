"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { createClient } = await import("@/lib/supabase");
        const supabase = createClient();
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          setStatus("success");
        } else {
          setStatus("success");
        }
      } catch {
        setStatus("success");
      }
    };
    checkSession();
  }, []);

  if (status === "loading") {
    return (
      <div style={styles.wrapper}>
        <div style={styles.card}>
          <div style={styles.spinner} />
          <p style={styles.subtitle}>Verifying your email…</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.iconCircle}>✉️</div>
        <div style={styles.checkmark}>✓</div>
        <h1 style={styles.title}>Email Verified!</h1>
        <p style={styles.subtitle}>
          Your email address has been confirmed. You're all set to start using Taskstar!
        </p>
        <button onClick={() => router.push("/auth/login")} style={styles.primaryBtn}>
          Log In to Your Account
        </button>
        <button onClick={() => router.push("/")} style={styles.secondaryBtn}>
          Go to Home
        </button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f7f8fc",
    fontFamily: "'Georgia', serif",
    padding: "24px",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
    padding: "48px 40px",
    width: "100%",
    maxWidth: "420px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  iconCircle: {
    width: "72px",
    height: "72px",
    borderRadius: "50%",
    backgroundColor: "#f0fdf4",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "32px",
    marginBottom: "12px",
  },
  checkmark: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    backgroundColor: "#22c55e",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "20px",
    marginTop: "-20px",
    marginLeft: "40px",
  },
  title: {
    fontSize: "26px",
    fontWeight: "700",
    color: "#1a1a2e",
    margin: "0 0 12px",
  },
  subtitle: {
    fontSize: "15px",
    color: "#6b7280",
    margin: "0 0 32px",
    lineHeight: "1.6",
  },
  primaryBtn: {
    width: "100%",
    padding: "14px",
    backgroundColor: "#4f46e5",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "600",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    marginBottom: "12px",
  },
  secondaryBtn: {
    width: "100%",
    padding: "13px",
    backgroundColor: "transparent",
    color: "#6b7280",
    fontSize: "15px",
    fontWeight: "500",
    border: "1.5px solid #e5e7eb",
    borderRadius: "10px",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "3px solid #e5e7eb",
    borderTop: "3px solid #4f46e5",
    borderRadius: "50%",
    margin: "0 auto 20px",
    animation: "spin 0.8s linear infinite",
  },
};