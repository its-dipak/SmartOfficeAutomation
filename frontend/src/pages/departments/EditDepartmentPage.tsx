import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

import MainLayout from "../../layouts/MainLayout";
import DepartmentForm, {
  type DepartmentFormData,
} from "../../components/department/DepartmentForm";

import {
  getDepartment,
  updateDepartment,
} from "../../services/DepartmentService";

function EditDepartmentPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["department", id],
    queryFn: () => getDepartment(Number(id)),
    enabled: !!id,
  });

  const handleSubmit = async (
    formData: DepartmentFormData
  ) => {
    try {
      await updateDepartment(Number(id), formData);

      toast.success("Department updated successfully.");

      navigate("/departments");
    } catch (error) {
      console.error(error);
      toast.error("Unable to update department.");
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <h2>Loading...</h2>
      </MainLayout>
    );
  }

  if (!data) {
    return (
      <MainLayout>
        <h2>Department not found.</h2>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <h1 style={{ marginBottom: 30 }}>
        ✏ Edit Department
      </h1>

      <DepartmentForm
        defaultValues={{
          name: data.name,
          description: data.description ?? "",
        }}
        onSubmit={handleSubmit}
      />
    </MainLayout>
  );
}

export default EditDepartmentPage;