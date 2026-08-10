import React, { useEffect, useState } from "react";
import { Trash, Edit, Search, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import styles from "./EmployeeList.module.css";

const EmployeeList = ({ onView, employeesData }) => {
  const [filter, setFilter] = useState("");
  // const [activeActionsMenu, setActiveActionsMenu] = useState(null);
  // const actionMenuRef = useRef({}); // refs for each row

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // Close dropdown if clicked outside
  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     Object.values(actionMenuRef.current).forEach((ref) => {
  //       if (ref && !ref.contains(event.target)) {
  //         setActiveActionsMenu(null);
  //       }
  //     });
  //   };
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => document.removeEventListener("mousedown", handleClickOutside);
  // }, []);

  // 1️⃣ Filter all employees
  const filteredEmployees = (employeesData?.totalEmployees ?? []).filter(
    (emp) => {
      const searchTerm = filter.toLowerCase().trim();
      return (
        (emp.firstName || "").toLowerCase().includes(searchTerm) ||
        (emp.lastName || "").toLowerCase().includes(searchTerm) ||
        (emp.email || "").toLowerCase().includes(searchTerm) ||
        (emp.designation || "").toLowerCase().includes(searchTerm) ||
        (emp.department || "").toLowerCase().includes(searchTerm) ||
        (emp.workMode || "").toLowerCase().includes(searchTerm) ||
        (emp.status || "").toLowerCase().includes(searchTerm)
      );
    }
  );

  // 2️⃣ Reset page to 1 whenever filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  // 3️⃣ Paginate the filtered results
  const totalPages = Math.ceil(filteredEmployees.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentEmployees = filteredEmployees.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  const employees = currentEmployees;

  console.log("employees", employees);
  return (
    <div className={styles.employeeDirectoryCard}>
      <h2 className={styles.directoryTitle}>Employee Directory</h2>
      <p className={styles.directorySubtitle}>
        A complete list of all employees in your organization
      </p>

      {/* Search */}
      <div className={styles.searchContainer}>
        <Search className={styles.searchIcon} />
        <Input
          placeholder="Search employees..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {/* Employee Table */}
      <table className={styles.employeeTable}>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Department</th>
            <th>Designation</th>
            <th>Status</th>
            <th>Work Mode</th>
            <th>Salary</th>
          </tr>
        </thead>
        <tbody>
          {employees.length > 0 ? (
            employees.map((emp) => (
              <tr
                key={emp.id}
                // onClick={() => onView(emp)}
                className={styles.tableRow}
              >
                <td className={styles.employeeInfo} onClick={() => onView(emp)}>
                  <div className={styles.avatar}>
                    {emp.firstName?.[0].toUpperCase()}
                    {emp.lastName?.[0].toUpperCase()}
                  </div>
                  <div className={styles.nameAndEmail}>
                    <span className={styles.employeeName}>
                      {emp.firstName.toUpperCase()} {emp.lastName.toUpperCase()}
                    </span>
                    <span className={styles.employeeEmail}>{emp.email}</span>
                  </div>
                </td>
                <td onClick={() => onView(emp)}>
                  {emp.department.toUpperCase() || "N/A"}
                </td>
                <td onClick={() => onView(emp)}>
                  {emp.designation.toUpperCase() || "N/A"}
                </td>
                <td onClick={() => onView(emp)}>
                  <Badge
                    variant={
                      emp.status?.toLowerCase() === "active"
                        ? "positive"
                        : "destructive"
                    }
                  >
                    {emp.status.toUpperCase() || "N/A"}
                  </Badge>
                </td>
                <td onClick={() => onView(emp)}>
                  {emp.workMode.toUpperCase() || "N/A"}
                </td>
                <td onClick={() => onView(emp)}>
                  &#8377;
                  {emp.salary ? ` ${emp.salary.toLocaleString()}` : "N/A"}
                </td>

                {/* actions cell WITHOUT onClick */}
                {/* <td
                  className={styles.actionsCell}
                  ref={(el) => (actionMenuRef.current[emp.id] = el)}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation(); // prevent row click
                      setActiveActionsMenu(
                        activeActionsMenu === emp.id ? null : emp.id
                      );
                    }}
                  >
                    <MoreHorizontal size={20} />
                  </Button>

                  {activeActionsMenu === emp.id && (
                    <div className={styles.dropdownContent}>
                      <Button
                        variant="ghost"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log("edit button clicked");
                          setActiveActionsMenu(null);
                          onEdit(emp); // call parent to open form
                        }}
                      >
                        <Edit size={16} /> Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log("Edit clicked", emp);
                          onDelete(emp.id);
                          setActiveActionsMenu(null);
                        }}
                      >
                        <Trash size={16} /> Delete
                      </Button>
                    </div>
                  )}
                </td> */}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className={styles.noData}>
                No employees found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "1rem",
          gap: "0.5rem",
        }}
      >
        {/* Previous Button */}
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          variant="primary"
        >
          Previous
        </Button>

        {/* Page Numbers */}
        <span style={{ fontSize: "14px" }}>
          Page {currentPage} of {totalPages || 1}
        </span>

        {/* Next Button */}
        <Button
          onClick={() =>
            setCurrentPage((prev) =>
              Math.min(prev + 1, totalPages === 0 ? 1 : totalPages)
            )
          }
          disabled={currentPage === totalPages || totalPages === 0}
          variant="primary"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default EmployeeList;
