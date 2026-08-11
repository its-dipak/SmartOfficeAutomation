import { useQuery } from "@tanstack/react-query";
import MainLayout from "../../layouts/MainLayout";

import DashboardCards from "../../components/dashboard/DashboardCards";
import EmployeeChart from "../../components/dashboard/EmployeeChart";
import AttendanceChart from "../../components/dashboard/AttendanceChart";
import PayrollChart from "../../components/dashboard/PayrollChart";

import {
  getDashboardSummary,
  getDashboardAnalytics,
} from "../../services/DashboardService";

function DashboardPage() {
  const {
    data: summary,
    isLoading: loadingSummary,
    error: summaryError,
  } = useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: getDashboardSummary,
  });

  const {
    data: analytics,
    isLoading: loadingAnalytics,
    error: analyticsError,
  } = useQuery({
    queryKey: ["dashboard-analytics"],
    queryFn: getDashboardAnalytics,
  });

  if (loadingSummary || loadingAnalytics) {
    return (
      <MainLayout>
        <h2>Loading Dashboard...</h2>
      </MainLayout>
    );
  }

  if (summaryError || analyticsError) {
    return (
      <MainLayout>
        <h2 style={{ color: "red" }}>
          Failed to load dashboard
        </h2>

        <pre>{String(summaryError || analyticsError)}</pre>
      </MainLayout>
    );
  }

  if (!summary || !analytics) {
    return (
      <MainLayout>
        <h2>No dashboard data found.</h2>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <h1
        style={{
          marginBottom: 30,
          color: "#2563eb",
        }}
      >
        📊 Smart Office Dashboard
      </h1>

      <DashboardCards
        totalEmployees={summary.totalEmployees}
        totalDepartments={summary.totalDepartments}
        presentToday={summary.presentToday}
        absentToday={summary.absentToday}
        pendingLeaves={summary.pendingLeaves}
        totalPayroll={summary.totalPayroll}
      />

     <div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))",
    gap: 30,
    marginTop: 30,
    marginBottom: 30,
  }}
>
        <EmployeeChart
          data={analytics.employeesByDepartment}
        />

        <AttendanceChart
          present={analytics.presentEmployees}
          absent={analytics.absentEmployees}
        />
      </div>

      <PayrollChart
        data={analytics.monthlyPayroll}
      />
    </MainLayout>
  );
}

export default DashboardPage;