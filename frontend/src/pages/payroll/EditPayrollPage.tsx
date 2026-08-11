import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

import MainLayout from "../../layouts/MainLayout";
import PayrollForm, {
  type PayrollFormData,
} from "../../components/payroll/PayrollForm";

import {
  getPayroll,
  updatePayroll,
} from "../../services/PayrollService";

function EditPayrollPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["payroll", id],
    queryFn: () => getPayroll(Number(id)),
    enabled: !!id,
  });

  const handleSubmit = async (
    formData: PayrollFormData
  ) => {
    try {
      await updatePayroll(Number(id), formData);

      toast.success("Payroll updated successfully.");

      navigate("/payroll");
    } catch (error) {
      console.error(error);
      toast.error("Unable to update payroll.");
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
        <h2>Payroll not found.</h2>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <h1
        style={{
          marginBottom: 30,
        }}
      >
        ✏ Edit Payroll
      </h1>

      <PayrollForm
        defaultValues={{
          employeeId: data.employeeId,
          month: data.month,
          year: data.year,
          basicSalary: data.basicSalary,
          allowance: data.allowance,
          deduction: data.deduction,
          paymentDate: data.paymentDate.substring(0, 10),
        }}
        onSubmit={handleSubmit}
      />
    </MainLayout>
  );
}

export default EditPayrollPage;