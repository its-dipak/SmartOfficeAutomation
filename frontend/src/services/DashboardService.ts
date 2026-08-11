import api from "../api/axios";

export interface DashboardSummary {
  totalEmployees: number;
  totalDepartments: number;
  presentToday: number;
  absentToday: number;
  pendingLeaves: number;
  totalPayroll: number;
}

export interface DepartmentChart {
  department: string;
  count: number;
}

export interface PayrollChart {
  month: string;
  total: number;
}

export interface DashboardAnalytics {
  employeesByDepartment: DepartmentChart[];
  presentEmployees: number;
  absentEmployees: number;
  monthlyPayroll: PayrollChart[];
}

export const getDashboardSummary = async (): Promise<DashboardSummary> => {
  try {
    console.log("🚀 Calling Dashboard Summary API...");

    const response = await api.get<DashboardSummary>("/Dashboard/summary");

    console.log("✅ Dashboard Summary:", response.data);

    return response.data;
  } catch (error) {
    console.error("❌ Dashboard Summary Error:", error);
    throw error;
  }
};

export const getDashboardAnalytics = async (): Promise<DashboardAnalytics> => {
  try {
    console.log("🚀 Calling Dashboard Analytics API...");

    const response = await api.get<DashboardAnalytics>("/Dashboard/analytics");

    console.log("✅ Dashboard Analytics:", response.data);

    return response.data;
  } catch (error) {
    console.error("❌ Dashboard Analytics Error:", error);
    throw error;
  }
};