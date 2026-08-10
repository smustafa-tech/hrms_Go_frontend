import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useAuth } from "../../../components/Context/AuthContext";
import logo from "/logo.png";
import LeftImage from "../../../assets/istockphoto-2221624955-612x612.jpg";
import { Button } from "@/components/ui/Button";
import styles from "./Register.module.css";
import { checkPasswordStrength } from "../../../utils/passwordStrength";
import { useToast } from "@/hooks/use-Toast";


export default function Register() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(null);
  const [phoneError, setPhoneError] = useState("");

  // Form state
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    organizationName: "",
    phone: "+91 ",
    slug: "",
  });

  // Define fields dynamically
  const fields = [
    { id: "firstName", label: "First Name", required: true, placeholder: "John" },
    { id: "lastName", label: "Last Name", required: true, placeholder: "Doe" },
    { id: "email", label: "Email", required: true, placeholder: "name@company.com", type: "email" },
    { id: "password", label: "Password", required: true, placeholder: "••••••••", type: "password" },
    { id: "organizationName", label: "Organization Name", placeholder: "Company or individual" },
    { id: "phone", label: "Phone Number", placeholder: "98765 43210", type: "tel" },
    { id: "slug", label: "Domain Name", required: true, placeholder: "company.com" }
  ];
 
 const handleChange = (e) => {
  const { id, value } = e.target;

  // 🔐 Password (unchanged)
  if (id === "password") {
    setForm((prev) => ({ ...prev, password: value }));
    setPasswordStrength(checkPasswordStrength(value));
    return;
  }

  // 📞 Phone validation (PREFIX + SPACES SAFE)
  if (id === "phone") {
    setForm((prev) => ({ ...prev, phone: value }));

    // Remove spaces and +
    let cleaned = value.replace(/[+\s]/g, "");

    // Remove country code if present
    if (cleaned.startsWith("91")) {
      cleaned = cleaned.slice(2);
    }

    // Validation
    if (/[^0-9]/.test(cleaned)) {
      setPhoneError("Only numbers are allowed");
    } else if (cleaned.length > 10) {
      setPhoneError("Phone number cannot be more than 10 digits");
    } else {
      setPhoneError("");
    }

    return;
  }

  // 🔹 Other fields
  setForm((prev) => ({ ...prev, [id]: value }));
};



  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Check required fields
    const missingField = fields.find((f) => f.required && !form[f.id].trim());
    if (missingField) {
      setError(`Please fill ${missingField.label}`);
      return;
    }

    // 2.Weak password block
    if (passwordStrength && passwordStrength.label === "Weak") {
      setError(
        "Password is too weak. Use minimum 8 characters, uppercase, number & symbol."
      );
      return;
    }

    try {
      setLoading(true);
      await signup(form); // this sets user in context and localStorage
      toast({
      title: "Account created successfully",
      description: "You can now login using your credentials.",
    });
      navigate("/login"); // Redirect to login after successful registration
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
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
                <span>LKQS-HR</span>
              </Link>
            </div>
            <p>Enterprise-grade HR operations: people, payroll, attendance & leaves.</p>
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
              <h3>Try LKQS-HR system</h3>
              <div className={styles.rightBrand}>
                <Link to="/" className={styles.rightBrandLink}>
                  <img src={logo} alt="Lean.HR" />
                  <span>Lean.HR</span>
                </Link>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {/* First + Last Name in one line */}
            <div className={styles.nameFields}>
              <div className={styles.formField}>
                <label htmlFor="firstName">
                  First Name <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                />
              </div>


              <div className={styles.formField}>
                <label htmlFor="lastName">
                  Last Name <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>


            {/* Other fields */}
            {fields
              .filter((f) => f.id !== "firstName" && f.id !== "lastName")
              .map(({ id, label, required, type = "text", placeholder }) => (
                <div key={id} className={styles.formField}>
                  <label htmlFor={id}>
                    {label} {required && <span style={{ color: "red" }}>*</span>}
                  </label>
                  <input
                    id={id}
                    type={type}
                    placeholder={placeholder}
                    value={form[id]}
                    onChange={handleChange}
                    required={required}
                    className={id === "password" ? styles.passwordInput : ""}
                  />
                  {/* Password strength indicator */}
                  {id === "password" && passwordStrength && (
                    <small style={{ color: passwordStrength.color }}>
                      Password strength: {passwordStrength.label}
                    </small>
                  )}

                  {id === "phone" && phoneError && (
                    <small style={{ color: "red" }}>{phoneError}</small>
                  )}
                </div>
              ))}
            {error && <p className={styles.error}>{error}</p>}

            <Button disabled={loading} variant="primary">
              {loading ? "Creating..." : "Create Account"}
            </Button>


            <p className={styles.signin}>
              Already have an account? <Link to="/login">Sign In</Link>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}