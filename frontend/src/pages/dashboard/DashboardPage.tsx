import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  BarChart3,
  RefreshCw,
  TrendingUp,
} from "lucide-react";

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
    refetch: refetchSummary,
  } = useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: getDashboardSummary,
  });

  const {
    data: analytics,
    isLoading: loadingAnalytics,
    error: analyticsError,
    refetch: refetchAnalytics,
  } = useQuery({
    queryKey: ["dashboard-analytics"],
    queryFn: getDashboardAnalytics,
  });

  const isLoading = loadingSummary || loadingAnalytics;
  const hasError = !!summaryError || !!analyticsError;

  const handleRetry = () => {
    void refetchSummary();
    void refetchAnalytics();
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="dashboard-page">
          <div className="dashboard-loading">
            <div className="dashboard-spinner">
              <RefreshCw size={24} />
            </div>

            <h2>Loading dashboard</h2>
            <p>Preparing your SmartOffice overview...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (hasError) {
    return (
      <MainLayout>
        <div className="dashboard-page">
          <div className="dashboard-error">
            <div className="dashboard-error-icon">
              <AlertCircle size={28} />
            </div>

            <div>
              <h2>Unable to load dashboard</h2>
              <p>
                We couldn't retrieve the latest dashboard information.
                Please try again.
              </p>
            </div>

            <button
              type="button"
              className="dashboard-retry-button"
              onClick={handleRetry}
            >
              <RefreshCw size={16} />
              Retry
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!summary || !analytics) {
    return (
      <MainLayout>
        <div className="dashboard-page">
          <div className="dashboard-empty">
            <BarChart3 size={32} />
            <h2>No dashboard data</h2>
            <p>
              There is currently no information available to display.
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="dashboard-page">
        <section className="dashboard-header">
          <div>
            <div className="dashboard-eyebrow">
              <BarChart3 size={16} />
              SmartOffice Management
            </div>

            <h1>Dashboard</h1>

            <p>
              Monitor your workforce, attendance, leave and payroll
              from one place.
            </p>
          </div>

          <div className="dashboard-header-status">
            <span className="status-dot" />
            System operational
          </div>
        </section>

        <section className="dashboard-summary">
          <DashboardCards
            totalEmployees={summary.totalEmployees}
            totalDepartments={summary.totalDepartments}
            presentToday={summary.presentToday}
            absentToday={summary.absentToday}
            pendingLeaves={summary.pendingLeaves}
            totalPayroll={summary.totalPayroll}
          />
        </section>

        <section className="dashboard-section-heading">
          <div>
            <h2>Workforce overview</h2>
            <p>Key workforce and attendance insights.</p>
          </div>

          <div className="section-heading-icon">
            <TrendingUp size={18} />
          </div>
        </section>

        <section className="dashboard-chart-grid">
          <div className="dashboard-chart-card">
            <EmployeeChart
              data={analytics.employeesByDepartment}
            />
          </div>

          <div className="dashboard-chart-card">
            <AttendanceChart
              present={analytics.presentEmployees}
              absent={analytics.absentEmployees}
            />
          </div>
        </section>

        <section className="dashboard-section-heading payroll-heading">
          <div>
            <h2>Payroll overview</h2>
            <p>Monthly payroll trends across the organization.</p>
          </div>
        </section>

        <section className="dashboard-chart-card dashboard-payroll-card">
          <PayrollChart
            data={analytics.monthlyPayroll}
          />
        </section>
      </div>
    </MainLayout>
  );
}

export default DashboardPage;
