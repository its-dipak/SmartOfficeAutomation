import api from "../api/axios";

export interface Attendance {
  id: number;
  employeeId: number;
  employeeName: string;
  attendanceDate: string;
  checkInTime?: string;
  checkOutTime?: string;
  workingHours: number;
  status: string;
  remarks?: string;
}

export interface CreateAttendanceRequest {
  employeeId: number;
  remarks?: string;
}

export interface CheckOutRequest {
  employeeId: number;
  remarks?: string;
}

export const getAttendance = async (): Promise<Attendance[]> => {
  const response = await api.get<Attendance[]>("/Attendance");
  return response.data;
};

export const getEmployeeAttendance = async (
  employeeId: number
): Promise<Attendance[]> => {
  const response = await api.get<Attendance[]>(
    `/Attendance/employee/${employeeId}`
  );

  return response.data;
};

export const checkIn = async (
  data: CreateAttendanceRequest
) => {
  const response = await api.post(
    "/Attendance/checkin",
    data
  );

  return response.data;
};

export const checkOut = async (
  data: CheckOutRequest
) => {
  const response = await api.post(
    "/Attendance/checkout",
    data
  );

  return response.data;
};