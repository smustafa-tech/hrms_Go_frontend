import React, { useState, useEffect } from "react";
import { toast } from "@/hooks/use-Toast";
import { useEmployeeStore } from "../../store/employeeStore";
import { useAuth } from "@/components/Context/AuthContext";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import styles from "./EmployeeForm.module.css";

/* 🔴 Required star (UI safe) */
const RequiredStar = () => (
  <span style={{ color: "red", marginLeft: 4 }}>*</span>
);

const EmployeeForm = ({ initialData, onClose }) => {
  const { addEmployee, updateEmployeeInStore } = useEmployeeStore();
  const { employeeRegister, updateEmployee } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [aadhaarError, setAadhaarError] = useState("");

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toISOString().split("T")[0];
  };

  const [form, setForm] = useState({
    firstName: initialData?.firstName || "",
    middleName: initialData?.middleName || "",
    lastName: initialData?.lastName || "",
    email: initialData?.email || "",
    adharCard: initialData?.adharCard || "",
    designation: initialData?.designation || "",
    role: initialData?.role || "",
    phone: initialData?.phone || "+91 ",
    department: initialData?.department || "",
    dateOfJoining: formatDate(initialData?.dateOfJoining) || "",
    status: initialData?.status || "active",
    salary: initialData?.salary || "",
    workMode: initialData?.workMode || "WFO",
    emp_id: initialData?.emp_id || "",
    mgrId: initialData?.mgrId || "",
    hrId: initialData?.hrId || "",
    temporaryPassword: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        firstName: initialData.firstName || "",
        middleName: initialData.middleName || "",
        lastName: initialData.lastName || "",
        email: initialData.email || "",
        adharCard: initialData.adharCard || "",
        designation: initialData.designation || "",
        role: initialData.role || "",
        phone: initialData.phone || "+91 ",
        department: initialData.department || "",
        dateOfJoining: formatDate(initialData.dateOfJoining) || "",
        status: initialData.status || "active",
        salary: initialData.salary || "",
        workMode: initialData.workMode || "WFO",
        emp_id: initialData.emp_id || "",
        mgrId: initialData.mgrId || "",
        hrId: initialData.hrId || "",
        temporaryPassword: "",
      });
    }
  }, [initialData]);

  /* 📞 Phone + 🆔 Aadhaar Validation */
  const handleChange = (e) => {
    const { name, value } = e.target;

    /* 📞 PHONE: +91 ␣ 10 digits */
    if (name === "phone") {
      if (!value.startsWith("+91 ")) return;

      let digits = value.replace("+91 ", "");

      if (/[^0-9]/.test(digits)) {
        setPhoneError("Only numbers allowed after +91");
        return;
      }

      if (digits.length > 10) {
        setPhoneError("Phone number must be exactly 10 digits");
        return;
      }

      setPhoneError("");
      setForm({ ...form, phone: value });
      return;
    }

    /* 🆔 AADHAAR: XXXX XXXX XXXX */
    if (name === "adharCard") {
      let digits = value.replace(/\D/g, "").slice(0, 12);

      let formatted = digits
        .replace(/(\d{4})(?=\d)/g, "$1 ")
        .trim();

      if (digits.length < 12) {
        setAadhaarError("Aadhaar number must be 12 digits");
      } else {
        setAadhaarError("");
      }

      setForm({ ...form, adharCard: formatted });
      return;
    }

    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (phoneError || aadhaarError) {
      setError(phoneError || aadhaarError);
      return;
    }

    try {
      setLoading(true);
      let result;

      if (initialData?.emp_id) {
        result = await updateEmployee(initialData.emp_id, form);
        updateEmployeeInStore(initialData.emp_id, result.data);

        toast({
          title: "Success",
          description: "Employee updated successfully",
          variant: "success",
        });
      } else {
        result = await employeeRegister(form);
        const createdEmployee = result?.data || result;
        const temporaryPassword = result?.temporaryPassword;

        addEmployee(createdEmployee);

        toast({
          title: "Success",
          description: temporaryPassword
            ? `Employee ID: ${createdEmployee?.emp_id || form.emp_id}. Temporary password: ${temporaryPassword}`
            : `Employee ID: ${createdEmployee?.emp_id || form.emp_id}. Employee created successfully`,
          variant: "success",
        });
      }

      onClose();
    } catch (err) {
      const backendMessage =
        err.response?.data?.message || err.response?.data?.error;
      setError(backendMessage || "Employee operation failed");

      toast({
        title: "Error",
        description: backendMessage || "Employee operation failed",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.row}>
        <div className={styles.field}>
          <Label>First Name <RequiredStar /></Label>
          <Input name="firstName" value={form.firstName} placeholder="First Name" onChange={handleChange} required />
        </div>

        <div className={styles.field}>
          <Label>Middle Name <RequiredStar /></Label>
          <Input name="middleName" value={form.middleName} placeholder="Middle Name" onChange={handleChange} />
        </div>

        <div className={styles.field}>
          <Label>Last Name <RequiredStar /></Label>
          <Input name="lastName" value={form.lastName} placeholder="Last Name" onChange={handleChange} required />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <Label>Email <RequiredStar /></Label>
          <Input type="email" name="email" value={form.email} placeholder="Email" onChange={handleChange} required />
        </div>

        <div className={styles.field}>
          <Label>Temporary Password <RequiredStar /></Label>
          <Input type="password" name="temporaryPassword" value={form.temporaryPassword} placeholder="Enter temporary password" onChange={handleChange} required />
        </div>

        <div className={styles.field}>
          <Label>Phone <RequiredStar /></Label>
          <Input name="phone" value={form.phone} onChange={handleChange} />
          {phoneError && <small style={{ color: "red" }}>{phoneError}</small>}
        </div>

        <div className={styles.field}>
          <Label>Adhaar Card <RequiredStar /></Label>
          <Input name="adharCard" value={form.adharCard} placeholder="XXXX XXXX XXXX" onChange={handleChange} />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <Label>Designation <RequiredStar /></Label>
          <Input name="designation" value={form.designation} placeholder="Software Engineer" onChange={handleChange} required />
        </div>

        <div className={styles.field}>
          <Label>Department <RequiredStar /></Label>
          <Input name="department" value={form.department} placeholder="IT, HR" onChange={handleChange} required />
        </div>

        <div className={styles.field}>
          <Label>Role <RequiredStar /></Label>
          <Input name="role" value={form.role} placeholder="Role" onChange={handleChange} required />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <Label>Status <RequiredStar /></Label>
          <Input name="status" value={form.status} onChange={handleChange} required />
        </div>

        <div className={styles.field}>
          <Label>Work Mode <RequiredStar /></Label>
          <Input name="workMode" value={form.workMode} onChange={handleChange} required />
        </div>

        <div className={styles.field}>
          <Label>Joining Date <RequiredStar /></Label>
          <Input type="date" name="dateOfJoining" value={form.dateOfJoining} onChange={handleChange} required />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <Label>Salary <RequiredStar /></Label>
          <Input type="number" name="salary" value={form.salary} onChange={handleChange} required />
        </div>

        <div className={styles.field}>
          <Label>Employee ID <RequiredStar /></Label>
          <Input name="emp_id" value={form.emp_id} onChange={handleChange} required />
        </div>

        <div className={styles.field}>
          <Label>Manager ID <RequiredStar /></Label>
          <Input name="mgrId" value={form.mgrId} onChange={handleChange} />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <Label>HR ID <RequiredStar /></Label>
          <Input name="hrId" value={form.hrId} onChange={handleChange} />
        </div>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.actions}>
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button disabled={loading} type="submit" variant="primary">
          {loading ? "Saving..." : initialData ? "Update Employee" : "Add Employee"}
        </Button>
      </div>
    </form>
  );
};

export default EmployeeForm;
