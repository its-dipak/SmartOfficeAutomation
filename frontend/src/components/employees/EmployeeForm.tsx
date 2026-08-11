import { useEffect } from "react";
import { useForm } from "react-hook-form";

import type { Department } from "../../services/DepartmentService";
import type { CreateEmployeeRequest } from "../../services/EmployeeService";

interface EmployeeFormProps {
  departments: Department[];
  defaultValues?: Partial<CreateEmployeeRequest>;
  onSubmit: (data: CreateEmployeeRequest) => void;
  loading?: boolean;
}

function EmployeeForm({
  departments,
  defaultValues,
  onSubmit,
  loading = false,
}: EmployeeFormProps) {
  const {
    register,
    handleSubmit,
    reset,
  } = useForm<CreateEmployeeRequest>({
    defaultValues,
  });
useEffect(() => {
  if (defaultValues) {
    reset(defaultValues);
  }
}, [defaultValues, reset]);
 
  return (
    <form onSubmit={handleSubmit(onSubmit)}>

      <div style={{ marginBottom: 15 }}>
        <label>Employee Code</label>
        <br />
        <input {...register("employeeCode", { required: true })} />
      </div>

      <div style={{ marginBottom: 15 }}>
        <label>First Name</label>
        <br />
        <input {...register("firstName", { required: true })} />
      </div>

      <div style={{ marginBottom: 15 }}>
        <label>Last Name</label>
        <br />
        <input {...register("lastName", { required: true })} />
      </div>

      <div style={{ marginBottom: 15 }}>
        <label>Email</label>
        <br />
        <input
          type="email"
          {...register("email", { required: true })}
        />
      </div>

      <div style={{ marginBottom: 15 }}>
        <label>Phone</label>
        <br />
        <input {...register("phone", { required: true })} />
      </div>

      <div style={{ marginBottom: 15 }}>
        <label>Designation</label>
        <br />
        <input {...register("designation", { required: true })} />
      </div>

      <div style={{ marginBottom: 15 }}>
        <label>Salary</label>
        <br />
        <input
          type="number"
          step="0.01"
          {...register("salary", {
            required: true,
            valueAsNumber: true,
          })}
        />
      </div>

      <div style={{ marginBottom: 15 }}>
        <label>Joining Date</label>
        <br />
        <input
          type="date"
          {...register("joiningDate", { required: true })}
        />
      </div>

      <div style={{ marginBottom: 15 }}>
        <label>Department</label>
        <br />

        <select
          {...register("departmentId", {
            required: true,
            valueAsNumber: true,
          })}
        >
          <option value="">Select Department</option>

          {departments.map((department) => (
            <option
              key={department.id}
              value={department.id}
            >
              {department.name}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
      >
        {loading ? "Saving..." : "Save Employee"}
      </button>

    </form>
  );
}

export default EmployeeForm;