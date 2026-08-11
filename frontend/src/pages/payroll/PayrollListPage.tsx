import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

import MainLayout from "../../layouts/MainLayout";
import PayrollTable from "../../components/payroll/PayrollTable";

import {
  getPayrolls,
  deletePayroll,
} from "../../services/PayrollService";

function PayrollListPage() {
  const navigate = useNavigate();

  const {
    data: payrolls = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["payrolls"],
    queryFn: getPayrolls,
  });

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(
      "Delete this payroll record?"
    );

    if (!confirmDelete) return;

    try {
      await deletePayroll(id);

      await refetch();

      toast.success("Payroll deleted successfully.");
    } catch (error) {
      console.error(error);
      toast.error("Unable to delete payroll.");
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
        <h1>💰 Payroll Management</h1>

        <button
          onClick={() => navigate("/payroll/add")}
          style={{
            padding: "10px 20px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          + Add Payroll
        </button>
      </div>

      {isLoading ? (
        <h3>Loading...</h3>
      ) : (
        <PayrollTable
          payrolls={payrolls}
          onEdit={(id) => navigate(`/payroll/edit/${id}`)}
          onDelete={handleDelete}
        />
      )}
    </MainLayout>
  );
}

export default PayrollListPage;