import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import MainLayout from "../../layouts/MainLayout";
import DepartmentForm from "../../components/department/DepartmentForm";
import type { DepartmentFormData } from "../../components/department/DepartmentForm";

import { createDepartment } from "../../services/DepartmentService";

function AddDepartmentPage() {
  const navigate = useNavigate();

  const handleSubmit = async (
    data: DepartmentFormData
  ) => {
    try {
      await createDepartment(data);

      toast.success("Department created successfully.");

      navigate("/departments");
    } catch (error) {
      console.error(error);
      toast.error("Unable to create department.");
    }
  };

  return (
    <MainLayout>
      <h1 style={{ marginBottom: 30 }}>
        ➕ Add Department
      </h1>

      <DepartmentForm onSubmit={handleSubmit} />
    </MainLayout>
  );
}

export default AddDepartmentPage;