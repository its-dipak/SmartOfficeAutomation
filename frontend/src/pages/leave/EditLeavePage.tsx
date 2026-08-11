import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

import MainLayout from "../../layouts/MainLayout";
import LeaveForm, {
  type LeaveFormData,
} from "../../components/leave/LeaveForm";

import {
  getLeave,
  updateLeave,
} from "../../services/LeaveService";

function EditLeavePage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const leaveId = Number(id);

  const {
    data: leave,
    isLoading,
  } = useQuery({
    queryKey: ["leave", leaveId],
    queryFn: () => getLeave(leaveId),
    enabled: !!leaveId,
  });

  const handleSubmit = async (
    data: LeaveFormData
  ) => {
    try {
      await updateLeave(leaveId, {
        leaveType: data.leaveType,
        fromDate: data.fromDate,
        toDate: data.toDate,
        reason: data.reason,
        status: leave?.status ?? "Pending",
      });

      toast.success("Leave updated successfully.");

      navigate("/leave");
    } catch (error) {
      console.error(error);
      toast.error("Unable to update leave.");
    }
  };

  if (isLoading || !leave) {
    return (
      <MainLayout>
        <h2>Loading...</h2>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <h1 style={{ marginBottom: 30 }}>
        ✏ Edit Leave
      </h1>

      <LeaveForm
        defaultValues={{
          employeeId: leave.employeeId,
          leaveType: leave.leaveType,
          fromDate: leave.fromDate,
          toDate: leave.toDate,
          reason: leave.reason ?? "",
        }}
        onSubmit={handleSubmit}
      />
    </MainLayout>
  );
}

export default EditLeavePage;