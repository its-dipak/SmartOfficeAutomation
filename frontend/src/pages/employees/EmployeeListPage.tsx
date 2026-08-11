import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import toast from "react-hot-toast";

import MainLayout from "../../layouts/MainLayout";
import EmployeeTable from "../../components/employees/EmployeeTable";
import DeleteEmployeeDialog from "../../components/employees/DeleteEmployeeDialog";

import {
  getEmployees,
  deleteEmployee,
} from "../../services/EmployeeService";

function EmployeeListPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");

  const [deleteOpen, setDeleteOpen] = useState(false);

  const [selectedEmployee, setSelectedEmployee] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const {
    data: employees = [],
    isLoading,
  } = useQuery({
    queryKey: ["employees"],
    queryFn: getEmployees,
  });

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const keyword = search.toLowerCase();

      return (
        employee.employeeCode.toLowerCase().includes(keyword) ||
        employee.firstName.toLowerCase().includes(keyword) ||
        employee.lastName.toLowerCase().includes(keyword) ||
        employee.email.toLowerCase().includes(keyword)
      );
    });
  }, [employees, search]);

  const deleteMutation = useMutation({
    mutationFn: deleteEmployee,

    onSuccess: () => {
      toast.success("Employee deleted successfully!");

      queryClient.invalidateQueries({
        queryKey: ["employees"],
      });

      setDeleteOpen(false);
      setSelectedEmployee(null);
    },

    onError: () => {
      toast.error("Failed to delete employee.");
    },
  });

  return (
    <MainLayout>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h1>👨‍💼 Employees</h1>

        <button
          onClick={() => navigate("/employees/add")}
          style={{
            padding: "10px 20px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          + Add Employee
        </button>
      </div>

      <input
        placeholder="Search employee..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: 12,
          marginBottom: 20,
          borderRadius: 8,
          border: "1px solid #ccc",
        }}
      />

      {isLoading ? (
        <h3>Loading employees...</h3>
      ) : (
        <EmployeeTable
          employees={filteredEmployees}
          onView={(id) => navigate(`/employees/${id}`)}
          onEdit={(id) => navigate(`/employees/edit/${id}`)}
          onDelete={(id) => {
            const employee = employees.find((e) => e.id === id);

            if (!employee) return;

            setSelectedEmployee({
              id: employee.id,
              name: `${employee.firstName} ${employee.lastName}`,
            });

            setDeleteOpen(true);
          }}
        />
      )}

      <DeleteEmployeeDialog
        open={deleteOpen}
        employeeName={selectedEmployee?.name ?? ""}
        loading={deleteMutation.isPending}
        onCancel={() => {
          setDeleteOpen(false);
          setSelectedEmployee(null);
        }}
        onConfirm={() => {
          if (selectedEmployee) {
            deleteMutation.mutate(selectedEmployee.id);
          }
        }}
      />
    </MainLayout>
  );
}

export default EmployeeListPage;