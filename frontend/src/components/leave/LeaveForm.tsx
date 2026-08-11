import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";

import {
  getEmployees,
  type Employee,
} from "../../services/EmployeeService";

export interface LeaveFormData {
  employeeId: number;
  leaveType: string;
  fromDate: string;
  toDate: string;
  reason: string;
}

interface LeaveFormProps {
  defaultValues?: LeaveFormData;
  onSubmit: (data: LeaveFormData) => void;
  loading?: boolean;
}

function LeaveForm({
  defaultValues,
  onSubmit,
  loading = false,
}: LeaveFormProps) {
  const { data: employees = [] } = useQuery({
    queryKey: ["employees"],
    queryFn: getEmployees,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeaveFormData>({
    defaultValues,
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{
        maxWidth: 600,
      }}
    >
      {/* Employee */}

      <div style={{ marginBottom: 20 }}>
        <label>Employee</label>

        <select
          {...register("employeeId", {
            required: "Employee is required",
            valueAsNumber: true,
          })}
          style={{
            width: "100%",
            padding: 10,
            marginTop: 5,
            borderRadius: 6,
            border: "1px solid #ccc",
          }}
        >
          <option value="">Select Employee</option>

          {employees.map((employee: Employee) => (
            <option
              key={employee.id}
              value={employee.id}
            >
              {employee.employeeCode} - {employee.firstName}{" "}
              {employee.lastName}
            </option>
          ))}
        </select>

        {errors.employeeId && (
          <p
            style={{
              color: "red",
              marginTop: 5,
            }}
          >
            {errors.employeeId.message}
          </p>
        )}
      </div>

      {/* Leave Type */}

      <div style={{ marginBottom: 20 }}>
        <label>Leave Type</label>

        <select
          {...register("leaveType", {
            required: "Leave Type is required",
          })}
          style={{
            width: "100%",
            padding: 10,
            marginTop: 5,
            borderRadius: 6,
            border: "1px solid #ccc",
          }}
        >
          <option value="">Select Leave Type</option>
          <option value="Casual Leave">
            Casual Leave
          </option>
          <option value="Medical Leave">
            Medical Leave
          </option>
          <option value="Annual Leave">
            Annual Leave
          </option>
          <option value="Work From Home">
            Work From Home
          </option>
        </select>

        {errors.leaveType && (
          <p
            style={{
              color: "red",
              marginTop: 5,
            }}
          >
            {errors.leaveType.message}
          </p>
        )}
      </div>

      {/* From Date */}

      <div style={{ marginBottom: 20 }}>
        <label>From Date</label>

        <input
          type="date"
          {...register("fromDate", {
            required: "From Date is required",
          })}
          style={{
            width: "100%",
            padding: 10,
            marginTop: 5,
            borderRadius: 6,
            border: "1px solid #ccc",
          }}
        />

        {errors.fromDate && (
          <p
            style={{
              color: "red",
              marginTop: 5,
            }}
          >
            {errors.fromDate.message}
          </p>
        )}
      </div>

      {/* To Date */}

      <div style={{ marginBottom: 20 }}>
        <label>To Date</label>

        <input
          type="date"
          {...register("toDate", {
            required: "To Date is required",
          })}
          style={{
            width: "100%",
            padding: 10,
            marginTop: 5,
            borderRadius: 6,
            border: "1px solid #ccc",
          }}
        />

        {errors.toDate && (
          <p
            style={{
              color: "red",
              marginTop: 5,
            }}
          >
            {errors.toDate.message}
          </p>
        )}
      </div>

      {/* Reason */}

      <div style={{ marginBottom: 20 }}>
        <label>Reason</label>

        <textarea
          rows={4}
          {...register("reason")}
          style={{
            width: "100%",
            padding: 10,
            marginTop: 5,
            borderRadius: 6,
            border: "1px solid #ccc",
          }}
        />
      </div>

      {/* Submit Button */}

      <button
        type="submit"
        disabled={loading}
        style={{
          padding: "12px 24px",
          background: "#2563eb",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        {loading ? "Saving..." : "Apply Leave"}
      </button>
    </form>
  );
}

export default LeaveForm;