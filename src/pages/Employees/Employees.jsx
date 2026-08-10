import { useState, useEffect } from "react";
import { useEmployeeStore } from "@/store/employeeStore";
import EmployeeHeader from "@/features/Employees/EmployeeHeader";
import EmployeeList from "@/features/Employees/EmployeeList";
import EmployeeStats from "@/features/Employees/EmployeeStats";
import EmployeeForm from "@/features/Employees/EmployeeForm";
import EmployeeProfile from "@/features/Employees/EmployeeProfile";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/Dialog";
import { useAuth } from "@/components/Context/AuthContext";
import styles from "./Employees.module.css";
import { toast } from "@/hooks/use-Toast";

export default function Employees() {
  const {
    employeesData,
    fetchEmployees,
    deleteEmployeeById,
    loading,
    error,
    updateEmployeeInStore,
  } = useEmployeeStore();
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [editEmployee, setEditEmployee] = useState(null);
  const [viewEmployee, setViewEmployee] = useState(null);
  const { deleteEmployee } = useAuth();

  // 🔹 Fetch employees on initial load
  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleAddClick = () => {
    setEditEmployee(null);
    setFormModalOpen(true);
  };

  const handleEditClick = (employee) => {
    console.log("formModalOpen", formModalOpen);
    setFormModalOpen(true);
    setEditEmployee(employee);
  };

  const handleEditFromProfile = (employee) => {
    setProfileModalOpen(false); // close profile modal
    setEditEmployee(employee); // set employee to edit
    setFormModalOpen(true); // open form modal
  };

  const handleViewClick = (employee) => {
    setViewEmployee(employee);
    setProfileModalOpen(true);
  };

  const handleDelete = async (emp_id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        const result = await deleteEmployee(emp_id);

        if (result) {
          const res = await deleteEmployeeById(emp_id);
          toast({
            title: "Success",
            description: res.message || "Employee deleted successfully",
            variant: "success",
          });

          // Update store to remove employee from list
          updateEmployeeInStore({ id: emp_id, status: "inactive" });

          // Close profile modal if open
          if (profileModalOpen) setProfileModalOpen(false); // close modal
        }
      } catch (err) {
        toast({
          title: "Error",
          description:
            err.response?.data?.message ||
            err.message ||
            "Failed to delete employee",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className={styles.container}>
      {loading && <div>Loading employees...</div>}
      {error && <div style={{ color: "red" }}>Error: {error}</div>}

      <EmployeeHeader onAdd={handleAddClick} />
      <EmployeeStats employeesData={employeesData} />
      <EmployeeList
        employeesData={employeesData}
        onEdit={handleEditClick}
        onDelete={handleDelete}
        onView={handleViewClick}
      />

      {/* Add/Edit Employee Form */}
      <Dialog open={formModalOpen} onOpenChange={setFormModalOpen}>
        <DialogContent className={styles.modalContent} aria-describedby={undefined}>
          <DialogTitle className="sr-only">{editEmployee ? "Edit Employee" : "Add Employee"}</DialogTitle>
          <EmployeeForm
            initialData={editEmployee}
            onClose={() => setFormModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* View Employee Profile */}
      <Dialog open={profileModalOpen} onOpenChange={setProfileModalOpen}>
        <DialogContent className={styles.modalContent} aria-describedby={undefined}>
          <DialogTitle className="sr-only">Employee Profile</DialogTitle>
          <EmployeeProfile
            employee={viewEmployee}
            onClose={() => setProfileModalOpen(false)}
            onEdit={handleEditFromProfile} // <-- pass edit callback
            onDelete={handleDelete}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
