import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { ScrollArea } from "@/components/ui/ScrollArea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

const LeaveBalance = ({ balances }) => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  console.log("📊 Leave balances data:", balances);

  // Handle row click
  const handleRowClick = (row) => {
    setSelectedRow(row.id === selectedRow?.id ? null : row);
  };

  return (
    <Card style={{ borderRadius: 12 }}>
      <CardHeader>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <CardTitle>Leave Balances</CardTitle>
          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            style={{
              background: "#2563eb",
              color: "#fff",
              border: "none",
              padding: "6px 12px",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Sort by Remaining ({sortOrder === "asc" ? "↑" : "↓"})
          </button>
        </div>
      </CardHeader>

      <CardContent>
        <ScrollArea style={{ maxHeight: "auto" }}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee Name</TableHead>
                <TableHead>Casual/Used</TableHead>
                <TableHead>Sick/Used</TableHead>
                <TableHead>Earned/Used</TableHead>
                <TableHead>Optional/Used</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {balances?.length > 0 ? (
                balances.map((r) => {
                  const casualTotal = r.casual;

                  const sickTotal = r.sick;
                  const earnedTotal = r.earned;
                  const optionalTotal = r.optional;

                  const casualUsed = r.usedCasual;
                  const sickUsed = r.usedSick;
                  const earnedUsed = r.usedEarned;
                  const optionalUsed = r.usedOptional;

                  return (
                    <TableRow
                      key={r.id}
                      onClick={() => handleRowClick(r)}
                      style={{
                        backgroundColor:
                          selectedRow?.id === r.id ? "#eff6ff" : "transparent",
                        cursor: "pointer",
                        transition: "background 0.2s",
                      }}
                    >
                      <TableCell>
                        {r.Employee?.firstName.toUpperCase() ||
                          r.applicant?.Employee?.firstName.toUpperCase() ||
                          "--"}{" "}
                        {r.Employee?.lastName.toUpperCase() ||
                          r.applicant?.Employee?.lastName.toUpperCase() ||
                          "--"}
                      </TableCell>
                      <TableCell>
                        {casualTotal}
                        {"/"}
                        {casualUsed}
                      </TableCell>
                      <TableCell>
                        {sickTotal}
                        {"/"}
                        {sickUsed}
                      </TableCell>
                      <TableCell>
                        {earnedTotal}
                        {"/"}
                        {earnedUsed}
                      </TableCell>
                      <TableCell>
                        {optionalTotal}
                        {"/"}
                        {optionalUsed}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : Object.keys(balances).length > 0 ? (
                <TableRow
                  key={balances.id}
                  onClick={() => handleRowClick(balances)}
                  style={{
                    backgroundColor:
                      selectedRow?.id === balances.id
                        ? "#eff6ff"
                        : "transparent",
                    cursor: "pointer",
                    transition: "background 0.2s",
                  }}
                >
                  <TableCell>
                    {balances.Employee?.firstName.toUpperCase() ||
                      balances.applicant?.Employee?.firstName.toUpperCase() ||
                      "--"}{" "}
                    {balances.Employee?.lastName.toUpperCase() ||
                      balances.applicant?.Employee?.lastName.toUpperCase() ||
                      "--"}
                  </TableCell>
                  <TableCell>
                    {balances.casual}
                    {"/"}
                    {balances.usedCasual}
                  </TableCell>
                  <TableCell>
                    {balances.sick}
                    {"/"}
                    {balances.usedSick}
                  </TableCell>
                  <TableCell>
                    {balances.earned}
                    {"/"}
                    {balances.usedEarned}
                  </TableCell>
                  <TableCell>
                    {balances.optional}
                    {"/"}
                    {balances.usedOptional}
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    style={{ textAlign: "center", color: "#6b7280" }}
                  >
                    No leave data found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default LeaveBalance;
