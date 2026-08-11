import api from "../api/axios";

export interface Employee {
  id: number;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  designation: string;
  salary: number;
  joiningDate: string;
  isActive: boolean;
  departmentId: number;
  departmentName: string;
}

export interface CreateEmployeeRequest {
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  designation: string;
  salary: number;
  joiningDate: string;
  departmentId: number;
}

export interface UpdateEmployeeRequest extends CreateEmployeeRequest {
  id: number;
  isActive: boolean;
}

export const getEmployees = async (): Promise<Employee[]> => {
  const response = await api.get<Employee[]>("/Employee");
  return response.data;
};

export const getEmployee = async (id: number): Promise<Employee> => {
  const response = await api.get<Employee>(`/Employee/${id}`);
  return response.data;
};

export const createEmployee = async (
  data: CreateEmployeeRequest
) => {
  const response = await api.post("/Employee", data);
  return response.data;
};

export const updateEmployee = async (
  data: UpdateEmployeeRequest
) => {
  await api.put(`/Employee/${data.id}`, data);
};

export const deleteEmployee = async (id: number) => {
  await api.delete(`/Employee/${id}`);
};