import api from "../api/axios";

export interface Payroll {
  id: number;
  employeeId: number;
  employeeName: string;
  month: number;
  year: number;
  basicSalary: number;
  allowance: number;
  deduction: number;
  netSalary: number;
  paymentDate: string;
}

export interface CreatePayrollRequest {
  employeeId: number;
  month: number;
  year: number;
  basicSalary: number;
  allowance: number;
  deduction: number;
  paymentDate: string;
}

export interface UpdatePayrollRequest {
  month: number;
  year: number;
  basicSalary: number;
  allowance: number;
  deduction: number;
  paymentDate: string;
}

export const getPayrolls = async (): Promise<Payroll[]> => {
  const response = await api.get("/Payroll");
  return response.data;
};

export const getPayroll = async (
  id: number
): Promise<Payroll> => {
  const response = await api.get(`/Payroll/${id}`);
  return response.data;
};

export const createPayroll = async (
  data: CreatePayrollRequest
) => {
  const response = await api.post("/Payroll", data);
  return response.data;
};

export const updatePayroll = async (
  id: number,
  data: UpdatePayrollRequest
) => {
  const response = await api.put(`/Payroll/${id}`, data);
  return response.data;
};

export const deletePayroll = async (id: number) => {
  await api.delete(`/Payroll/${id}`);
};