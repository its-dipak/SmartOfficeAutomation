import { Navigate, Route, Routes } from "react-router-dom";

import LoginPage from "./pages/auth/LoginPage";
import DashboardPage from "./pages/dashboard/DashboardPage";

import EmployeeListPage from "./pages/employees/EmployeeListPage";
import AddEmployeePage from "./pages/employees/AddEmployeePage";
import EditEmployeePage from "./pages/employees/EditEmployeePage";
import ViewEmployeePage from "./pages/employees/ViewEmployeePage";

import DepartmentListPage from "./pages/departments/DepartmentListPage";
import AddDepartmentPage from "./pages/departments/AddDepartmentPage";
import EditDepartmentPage from "./pages/departments/EditDepartmentPage";

import AttendanceListPage from "./pages/attendance/AttendanceListPage";
import CheckInPage from "./pages/attendance/CheckInPage";
import CheckOutPage from "./pages/attendance/CheckOutPage";

import LeaveListPage from "./pages/leave/LeaveListPage";
import AddLeavePage from "./pages/leave/AddLeavePage";
import EditLeavePage from "./pages/leave/EditLeavePage";

import PayrollListPage from "./pages/payroll/PayrollListPage";
import AddPayrollPage from "./pages/payroll/AddPayrollPage";
import EditPayrollPage from "./pages/payroll/EditPayrollPage";

import ReportsPage from "./pages/reports/ReportsPage";

import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./routes/ProtectedRoute";

function ProtectedLayout() {
  return (
    <ProtectedRoute>
      <MainLayout>
        <Routes>
          <Route path="/dashboard" element={<DashboardPage />} />

          <Route path="/employees" element={<EmployeeListPage />} />
          <Route path="/employees/add" element={<AddEmployeePage />} />
          <Route path="/employees/edit/:id" element={<EditEmployeePage />} />
          <Route path="/employees/:id" element={<ViewEmployeePage />} />

          <Route path="/departments" element={<DepartmentListPage />} />
          <Route path="/departments/add" element={<AddDepartmentPage />} />
          <Route
            path="/departments/edit/:id"
            element={<EditDepartmentPage />}
          />

          <Route path="/attendance" element={<AttendanceListPage />} />
          <Route path="/attendance/checkin" element={<CheckInPage />} />
          <Route path="/attendance/checkout" element={<CheckOutPage />} />

          <Route path="/leave" element={<LeaveListPage />} />
          <Route path="/leave/add" element={<AddLeavePage />} />
          <Route path="/leave/edit/:id" element={<EditLeavePage />} />

          <Route path="/payroll" element={<PayrollListPage />} />
          <Route path="/payroll/add" element={<AddPayrollPage />} />
          <Route path="/payroll/edit/:id" element={<EditPayrollPage />} />

          <Route path="/reports" element={<ReportsPage />} />

          <Route
            path="*"
            element={<Navigate to="/dashboard" replace />}
          />
        </Routes>
      </MainLayout>
    </ProtectedRoute>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/*"
        element={<ProtectedLayout />}
      />
    </Routes>
  );
}

export default App;
