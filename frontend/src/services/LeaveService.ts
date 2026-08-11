import api from "../api/axios";

export interface Leave {
  id: number;
  employeeId: number;
  employeeName: string;
  leaveType: string;
  fromDate: string;
  toDate: string;
  reason?: string;
  status: string;
}

export interface CreateLeaveRequest {
  employeeId: number;
  leaveType: string;
  fromDate: string;
  toDate: string;
  reason?: string;
}

export interface UpdateLeaveRequest {
  leaveType: string;
  fromDate: string;
  toDate: string;
  reason?: string;
  status: string;
}

export interface LeaveStatusRequest {
  status: string;
}

export const getLeaves = async (): Promise<Leave[]> => {
  const response = await api.get("/Leave");
  return response.data;
};

export const getLeave = async (id: number): Promise<Leave> => {
  const response = await api.get(`/Leave/${id}`);
  return response.data;
};

export const createLeave = async (
  data: CreateLeaveRequest
) => {
  const response = await api.post("/Leave", data);
  return response.data;
};

export const updateLeave = async (
  id: number,
  data: UpdateLeaveRequest
) => {
  const response = await api.put(`/Leave/${id}`, data);
  return response.data;
};

export const updateLeaveStatus = async (
  id: number,
  data: LeaveStatusRequest
) => {
  const response = await api.patch(
    `/Leave/${id}/status`,
    data
  );

  return response.data;
};

export const deleteLeave = async (id: number) => {
  await api.delete(`/Leave/${id}`);
};