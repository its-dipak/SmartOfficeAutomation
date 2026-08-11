import api from "../api/axios";

export interface Department {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface CreateDepartmentRequest {
  name: string;
  description?: string;
}

export interface UpdateDepartmentRequest {
  name: string;
  description?: string;
}

export const getDepartments = async (): Promise<Department[]> => {
  const response = await api.get<Department[]>("/Department");

  return response.data.filter((d) => d.isActive);
};

export const getDepartment = async (
  id: number
): Promise<Department> => {
  const response = await api.get<Department>(`/Department/${id}`);

  return response.data;
};

export const createDepartment = async (
  data: CreateDepartmentRequest
) => {
  const response = await api.post("/Department", data);

  return response.data;
};

export const updateDepartment = async (
  id: number,
  data: UpdateDepartmentRequest
) => {
  const response = await api.put(`/Department/${id}`, {
    id: id,
    name: data.name,
    description: data.description,
  });

  return response.data;
};

export const deleteDepartment = async (
  id: number
) => {
  await api.delete(`/Department/${id}`);
};