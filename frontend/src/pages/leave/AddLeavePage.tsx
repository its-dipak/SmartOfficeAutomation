import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import MainLayout from "../../layouts/MainLayout";
import LeaveForm from "../../components/leave/LeaveForm";
import type { LeaveFormData } from "../../components/leave/LeaveForm";

import { createLeave } from "../../services/LeaveService";

function AddLeavePage() {
  const navigate = useNavigate();

  const handleSubmit = async (data: LeaveFormData) => {
    console.log("Submitting:", data);

    try {
      await createLeave(data);

      toast.success("Leave applied successfully.");

      navigate("/leave");
    } catch (error: any) {
  console.error("Full error:", error);

  if (error.response) {
    console.log("Status:", error.response.status);
    console.log("Data:", error.response.data);
  }

  toast.error("Unable to apply leave.");
}
  };

  return (
    <MainLayout>
      <h1 style={{ marginBottom: 30 }}>
        📝 Apply Leave
      </h1>

      <LeaveForm onSubmit={handleSubmit} />
    </MainLayout>
  );
}

export default AddLeavePage;