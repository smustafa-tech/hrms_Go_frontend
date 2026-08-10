import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useAuth } from "../../../components/Context/AuthContext";
import logo from "/logo.png";
import LeftImage from "../../../assets/istockphoto-2221624955-612x612.jpg";
import { Button } from "@/components/ui/Button";
import styles from "./Login.module.css";
import { checkPasswordStrength } from "../../../utils/passwordStrength";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);
      await login({ email, password });
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.background}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={styles.card}
      >
        {/* Left side */}
        <div className={styles.leftPane}>
          <div>
            <div className={styles.brand}>
              <Link to="/" className={styles.brandLink}>
                <img src={logo} alt="" />
                <span>Lean.HR</span>
              </Link>
            </div>
            <p>
              Enterprise-grade HR operations: people, payroll, attendance &
              leaves.
            </p>
          </div>

          <div className={styles.imageBox}>
            <img src={LeftImage} alt="office" />
          </div>

          <ul className={styles.features}>
            <li>HR control center</li>
            <li>Role-based access</li>
            <li>Realtime insights</li>
          </ul>
        </div>

        {/* Right side */}
        <div className={styles.rightPane}>
          <div className={styles.header}>
            <div className={styles.title}>
              <h3>Try Lean.HR system</h3>

              <div className={styles.rightBrand}>
                <Link to="/" className={styles.rightBrandLink}>
                  <img src={logo} alt="Lean.HR" />
                  <span>Lean.HR</span>
                </Link>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <label htmlFor="email">
              Email <span style={{ color: "red" }}>*</span>
            </label>
            <input
              id="email"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label htmlFor="password">
              Password <span style={{ color: "red" }}>*</span>
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordStrength(
                  checkPasswordStrength(e.target.value)
                );
              }}
              className={styles.passwordInput}
            />

            {/* Password strength indicator */}
            {passwordStrength && (
              <small
                className={styles.passwordStrength}
                style={{ color: passwordStrength.color }}
              >
                Password strength: {passwordStrength.label}
              </small>
            )}

            {error && <p className={styles.error}>{error}</p>}

            <Button disabled={loading} variant="primary">
              {loading ? "Logging in..." : "Login"}
            </Button>

            <p className={styles.signin}>
              Don't have an account? <Link to="/register">Sign Up</Link>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
