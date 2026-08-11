import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";

import {
  getEmployees,
  type Employee,
} from "../../services/EmployeeService";

export interface PayrollFormData {
  employeeId: number;
  month: number;
  year: number;
  basicSalary: number;
  allowance: number;
  deduction: number;
  paymentDate: string;
}

interface PayrollFormProps {
  defaultValues?: PayrollFormData;
  onSubmit: (data: PayrollFormData) => void;
  loading?: boolean;
}

function PayrollForm({
  defaultValues,
  onSubmit,
  loading = false,
}: PayrollFormProps) {
  const { data: employees = [] } = useQuery({
    queryKey: ["employees"],
    queryFn: getEmployees,
  });

  const {
    register,
    handleSubmit,
  } = useForm<PayrollFormData>({
    defaultValues,
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{
        maxWidth: 700,
      }}
    >
      {/* Employee */}
      <div style={{ marginBottom: 20 }}>
        <label>Employee</label>

        <select
          {...register("employeeId", {
            required: true,
            valueAsNumber: true,
          })}
          style={{
            width: "100%",
            padding: 10,
            marginTop: 5,
          }}
        >
          <option value="">
            Select Employee
          </option>

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
      </div>

      {/* Month */}
      <div style={{ marginBottom: 20 }}>
        <label>Month</label>

        <select
          {...register("month", {
            required: true,
            valueAsNumber: true,
          })}
          style={{
            width: "100%",
            padding: 10,
            marginTop: 5,
          }}
        >
          <option value="">Select Month</option>
          <option value={1}>January</option>
          <option value={2}>February</option>
          <option value={3}>March</option>
          <option value={4}>April</option>
          <option value={5}>May</option>
          <option value={6}>June</option>
          <option value={7}>July</option>
          <option value={8}>August</option>
          <option value={9}>September</option>
          <option value={10}>October</option>
          <option value={11}>November</option>
          <option value={12}>December</option>
        </select>
      </div>

      {/* Year */}
      <div style={{ marginBottom: 20 }}>
        <label>Year</label>

        <input
          type="number"
          {...register("year", {
            required: true,
            valueAsNumber: true,
          })}
          style={{
            width: "100%",
            padding: 10,
            marginTop: 5,
          }}
        />
      </div>

      {/* Basic Salary */}
      <div style={{ marginBottom: 20 }}>
        <label>Basic Salary</label>

        <input
          type="number"
          step="0.01"
          {...register("basicSalary", {
            required: true,
            valueAsNumber: true,
          })}
          style={{
            width: "100%",
            padding: 10,
            marginTop: 5,
          }}
        />
      </div>

      {/* Allowance */}
      <div style={{ marginBottom: 20 }}>
        <label>Allowance</label>

        <input
          type="number"
          step="0.01"
          {...register("allowance", {
            valueAsNumber: true,
          })}
          style={{
            width: "100%",
            padding: 10,
            marginTop: 5,
          }}
        />
      </div>

      {/* Deduction */}
      <div style={{ marginBottom: 20 }}>
        <label>Deduction</label>

        <input
          type="number"
          step="0.01"
          {...register("deduction", {
            valueAsNumber: true,
          })}
          style={{
            width: "100%",
            padding: 10,
            marginTop: 5,
          }}
        />
      </div>

      {/* Payment Date */}
      <div style={{ marginBottom: 20 }}>
        <label>Payment Date</label>

        <input
          type="date"
          {...register("paymentDate", {
            required: true,
          })}
          style={{
            width: "100%",
            padding: 10,
            marginTop: 5,
          }}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        style={{
          padding: "10px 24px",
          background: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
        }}
      >
        {loading ? "Saving..." : "Save Payroll"}
      </button>
    </form>
  );
}

export default PayrollForm;