import React, { useState, useEffect } from "react";
import { usePayrollStore } from "@/store/PayrollStore.js";
import styles from "./PayrollStructure.module.css";

export default function SalaryStructure() {
  const {
    payrollData,
    createSalaryStructure,
    updateSalaryStructure,
    deleteSalaryStructure,
  } = usePayrollStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    basic: "",
    home_allowance: "",
    executive_allowance: "",
    travel_allowance: "",
    special_allowance: "",
    pf: "",
    esic: "",
    other: "",
    professional_tax: "",
    mediclaim: "",
    bonus: "",
    gross_total: "",
    ctc: "",
    total: "",
  });

  /* Lock scroll when modal is open */
  useEffect(() => {
    document.body.style.overflow = modalOpen ? "hidden" : "auto";
  }, [modalOpen]);

  /* Auto calculations */
  useEffect(() => {
    const gross =
      Number(form.basic) +
      Number(form.home_allowance) +
      Number(form.executive_allowance) +
      Number(form.travel_allowance) +
      Number(form.special_allowance) +
      Number(form.bonus);

    const deductions =
      Number(form.pf) +
      Number(form.esic) +
      Number(form.other) +
      Number(form.professional_tax) +
      Number(form.mediclaim);

    const total = gross - deductions;
    const ctc = gross + Number(form.mediclaim);

    setForm((prev) => ({
      ...prev,
      gross_total: gross,
      total,
      ctc,
    }));
  }, [
    form.basic,
    form.home_allowance,
    form.executive_allowance,
    form.travel_allowance,
    form.special_allowance,
    form.bonus,
    form.pf,
    form.esic,
    form.other,
    form.professional_tax,
    form.mediclaim,
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      editingId
        ? await updateSalaryStructure(editingId, form)
        : await createSalaryStructure(form);
      closeModal();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to save salary structure"
      );
    }
  };

  const openModal = (structure = null) => {
    if (structure) {
      setForm({ ...structure });
      setEditingId(structure.id);
    } else {
      setForm({
        name: "",
        basic: "",
        home_allowance: "",
        executive_allowance: "",
        travel_allowance: "",
        special_allowance: "",
        pf: "",
        esic: "",
        other: "",
        professional_tax: "",
        mediclaim: "",
        bonus: "",
        gross_total: "",
        ctc: "",
        total: "",
      });
      setEditingId(null);
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this salary structure?")) {
      await deleteSalaryStructure(id);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.heading}>Salary Structures</h2>
        <button className={styles.primaryBtn} onClick={() => openModal()}>
          + Create Structure
        </button>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Gross</th>
            <th>CTC</th>
            <th>Total Salary</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {payrollData.salaryStructures.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.gross_total}</td>
              <td>{s.ctc}</td>
              <td>{s.total}</td>
              <td className={styles.actions}>
                <button onClick={() => openModal(s)}>Edit</button>
                <button onClick={() => handleDelete(s.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalOpen && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className={styles.modalTitle}>
              {editingId ? "Edit Salary Structure" : "New Salary Structure"}
            </h3>

            <form className={styles.form} onSubmit={handleSubmit}>
              <Section title="Structure Name">
                <Input label="Name" name="name" value={form.name} onChange={handleChange} type="text" />
              </Section>

              <Section title="Earnings">
                <Grid>
                  <Input label="Basic" name="basic" value={form.basic} onChange={handleChange} />
                  <Input label="HRA" name="home_allowance" value={form.home_allowance} onChange={handleChange} />
                  <Input label="Executive" name="executive_allowance" value={form.executive_allowance} onChange={handleChange} />
                  <Input label="Travel" name="travel_allowance" value={form.travel_allowance} onChange={handleChange} />
                  <Input label="Special" name="special_allowance" value={form.special_allowance} onChange={handleChange} />
                  <Input label="Bonus" name="bonus" value={form.bonus} onChange={handleChange} />
                </Grid>
              </Section>

              <Section title="Deductions">
                <Grid>
                  <Input label="PF" name="pf" value={form.pf} onChange={handleChange} />
                  <Input label="ESIC" name="esic" value={form.esic} onChange={handleChange} />
                  <Input label="Other" name="other" value={form.other} onChange={handleChange} />
                  <Input label="Professional Tax" name="professional_tax" value={form.professional_tax} onChange={handleChange} />
                  <Input label="Mediclaim" name="mediclaim" value={form.mediclaim} onChange={handleChange} />
                </Grid>
              </Section>

              <Section title="Summary">
                <Grid>
                  <Input label="Gross" name="gross_total" value={form.gross_total} readOnly />
                  <Input label="CTC" name="ctc" value={form.ctc} readOnly />
                  <Input label="Net Salary" name="total" value={form.total} readOnly />
                </Grid>
              </Section>

              <div className={styles.formActions}>
                <button type="submit" className={styles.primaryBtn}>
                  {editingId ? "Update" : "Save"}
                </button>
                <button type="button" className={styles.secondaryBtn} onClick={closeModal}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* Helper Components */

function Section({ title, children }) {
  return (
    <div>
      <h4 className={styles.sectionTitle}>{title}</h4>
      {children}
    </div>
  );
}

function Grid({ children }) {
  return <div className={styles.grid}>{children}</div>;
}

function Input({ label, ...props }) {
  return (
    <div className={styles.inputGroup}>
      <label>{label}</label>
      <input {...props} />
    </div>
  );
}
