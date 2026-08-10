import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { useLeaveStore } from "@/store/leaveStore";
import styles from "./LeaveForm.module.css";

const LeaveForm = ({ open, onClose }) => {
  const [form, setForm] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const { createLeave } = useLeaveStore();


  const handleSubmit = () => {
    if (!form.leaveType || !form.startDate || !form.endDate)
      return alert("Please fill all fields");
    createLeave(form);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Apply for Leave</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <Select onValueChange={(val) => setForm({ ...form, leaveType: val })}>
            <SelectTrigger>
              <SelectValue placeholder="Select Leave Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sick">Sick Leave</SelectItem>
              <SelectItem value="casual">Casual Leave</SelectItem>
              <SelectItem value="earned">Earned Leave</SelectItem>
              <SelectItem value="optional">Optional Leave</SelectItem>
            </SelectContent>
          </Select>

          <div className={styles.dateConatiner}>
            <div className={styles.field}>
              <Label>Start Date:</Label>
              <Input
                type="date"
                onChange={(e) =>
                  setForm({ ...form, startDate: e.target.value })
                }
              />
            </div>

            <div className={styles.field}>
              <Label>End Date:</Label>
              <Input
                type="date"
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              />
            </div>
          </div>
          <Textarea
            placeholder="Reason for leave"
            onChange={(e) => setForm({ ...form, reason: e.target.value })}
          />

          <Button onClick={handleSubmit} variant="primary">
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LeaveForm;
