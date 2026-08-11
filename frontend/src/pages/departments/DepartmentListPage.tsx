import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

import MainLayout from "../../layouts/MainLayout";
import DepartmentTable from "../../components/department/DepartmentTable";

import {
  getDepartments,
  deleteDepartment,
} from "../../services/DepartmentService";

function DepartmentListPage() {
  const navigate = useNavigate();

  const {
    data: departments = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["departments"],
    queryFn: getDepartments,
  });

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this department?")) return;

    try {
      await deleteDepartment(id);
      await refetch();

      toast.success("Department deleted successfully.");
    } catch (error) {
      console.error(error);
      toast.error("Unable to delete department.");
    }
  };

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
        <h1>🏢 Departments</h1>

        <button
          onClick={() => navigate("/departments/add")}
          style={{
            padding: "10px 20px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          + Add Department
        </button>
      </div>

      {isLoading ? (
        <h3>Loading...</h3>
      ) : (
        <DepartmentTable
          departments={departments}
          onEdit={(id) => navigate(`/departments/edit/${id}`)}
          onDelete={handleDelete}
        />
      )}
    </MainLayout>
  );
}

export default DepartmentListPage;