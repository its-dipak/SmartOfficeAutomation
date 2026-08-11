import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import MainLayout from "../../layouts/MainLayout";
import PayrollForm from "../../components/payroll/PayrollForm";
import type { PayrollFormData } from "../../components/payroll/PayrollForm";

import { createPayroll } from "../../services/PayrollService";

function AddPayrollPage() {
  const navigate = useNavigate();

  const handleSubmit = async (
    data: PayrollFormData
  ) => {
    try {
      await createPayroll(data);

      toast.success("Payroll created successfully.");

      navigate("/payroll");
    } catch (error) {
      console.error(error);
      toast.error("Unable to create payroll.");
    }
  };

  return (
    <MainLayout>
      <h1
        style={{
          marginBottom: 30,
        }}
      >
        💰 Add Payroll
      </h1>

      <PayrollForm
        onSubmit={handleSubmit}
      />
    </MainLayout>
  );
}

export default AddPayrollPage;