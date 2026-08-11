import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

import MainLayout from "../../layouts/MainLayout";
import EmployeeForm from "../../components/employees/EmployeeForm";

import { getDepartments } from "../../services/DepartmentService";
import {
  getEmployee,
  updateEmployee,
  type UpdateEmployeeRequest,
} from "../../services/EmployeeService";

function EditEmployeePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: departments = [] } = useQuery({
    queryKey: ["departments"],
    queryFn: getDepartments,
  });

  const {
    data: employee,
    isLoading,
  } = useQuery({
    queryKey: ["employee", id],
    queryFn: () => getEmployee(Number(id)),
    enabled: !!id,
  });

  if (isLoading || !employee) {
    return (
      <MainLayout>
        <h2>Loading employee...</h2>
      </MainLayout>
    );
  }

  const handleSubmit = async (data: any) => {
    const payload: UpdateEmployeeRequest = {
      ...data,
      id: employee.id,
      isActive: employee.isActive,
    };

    try {
      await updateEmployee(payload);

      toast.success("Employee updated successfully");

      navigate("/employees");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update employee");
    }
  };

  return (
    <MainLayout>
      <h1>✏ Edit Employee</h1>

      <EmployeeForm
        departments={departments}
        defaultValues={{
          employeeCode: employee.employeeCode,
          firstName: employee.firstName,
          lastName: employee.lastName,
          email: employee.email,
          phone: employee.phone,
          designation: employee.designation,
          salary: employee.salary,
          joiningDate: employee.joiningDate.substring(0, 10),
          departmentId: employee.departmentId,
        }}
        onSubmit={handleSubmit}
      />
    </MainLayout>
  );
}

export default EditEmployeePage;