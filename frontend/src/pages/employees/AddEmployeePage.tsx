import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

import MainLayout from "../../layouts/MainLayout";
import EmployeeForm from "../../components/employees/EmployeeForm";

import { createEmployee } from "../../services/EmployeeService";
import type { CreateEmployeeRequest } from "../../services/EmployeeService";
import { getDepartments } from "../../services/DepartmentService";

function AddEmployeePage() {
  const navigate = useNavigate();

  const { data: departments = [], isLoading } = useQuery({
    queryKey: ["departments"],
    queryFn: getDepartments,
  });

  const handleSubmit = async (data: CreateEmployeeRequest) => {
    try {
      await createEmployee(data);

      toast.success("Employee added successfully!");

      navigate("/employees");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add employee");
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <h2>Loading departments...</h2>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <h1 style={{ marginBottom: 25 }}>
        ➕ Add Employee
      </h1>

      <EmployeeForm
        departments={departments}
        onSubmit={handleSubmit}
      />
    </MainLayout>
  );
}

export default AddEmployeePage;