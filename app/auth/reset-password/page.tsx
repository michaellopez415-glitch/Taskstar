"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords don't match. Please try again.");
      return;
    }

    setLoading(true);

    try {
      const { createClient } = await import("@/lib/supabase");
      const supabase = createClient();

      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        setError(updateError.message || "Something went wrong. Please try again.");
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push("/auth/login");
        }, 3000);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={styles.wrapper}>
        <div style={styles.card}>
          <div style={styles.iconCircle}>✓</div>
          <h1 style={styles.title}>Password Updated!</h1>
          <p style={styles.subtitle}>
            Your password has been reset successfully. Redirecting you to login…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.iconCircle}>🔒</div>
        <h1 style={styles.title}>Reset Your Password</h1>
        <p style={styles.subtitle}>Enter a new password for your account.</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>New Password</label>
            <div style={styles.inputWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                required
                style={styles.input}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.eyeBtn}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Confirm New Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat your password"
              required
              style={styles.input}
            />
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.submitBtn,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Updating…" : "Set New Password"}
          </button>
        </form>

        <button
          onClick={() => router.push("/auth/login")}
          style={styles.backLink}
        >
          ← Back to Login
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
  },
  iconCircle: {
    width: "64px",
    height: "64px",
    borderRadius: "50%",
    backgroundColor: "#eef2ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
    margin: "0 auto 24px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#1a1a2e",
    margin: "0 0 8px",
  },
  subtitle: {
    fontSize: "15px",
    color: "#6b7280",
    margin: "0 0 32px",
    lineHeight: "1.5",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    textAlign: "left",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#374151",
    letterSpacing: "0.02em",
  },
  inputWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    fontSize: "15px",
    border: "1.5px solid #e5e7eb",
    borderRadius: "10px",
    outline: "none",
    color: "#1a1a2e",
    backgroundColor: "#fafafa",
    boxSizing: "border-box",
  },
  eyeBtn: {
    position: "absolute",
    right: "12px",
    background: "none",
    border: "none",
    fontSize: "12px",
    color: "#6b7280",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  error: {
    fontSize: "13px",
    color: "#ef4444",
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "8px",
    padding: "10px 14px",
    margin: "0",
  },
  submitBtn: {
    padding: "14px",
    backgroundColor: "#4f46e5",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "600",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    marginTop: "4px",
  },
  backLink: {
    marginTop: "24px",
    background: "none",
    border: "none",
    color: "#6b7280",
    fontSize: "14px",
    cursor: "pointer",
    fontFamily: "inherit",
    display: "block",
    width: "100%",
    textAlign: "center",
  },
};