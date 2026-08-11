import { useState } from "react";
import type { CSSProperties } from "react";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "../../layouts/MainLayout";
import api from "../../api/axios";
import { exportToExcel } from "../../utils/ExportExcel";

type ReportType =
  | "employees"
  | "attendance"
  | "leave"
  | "payroll";

interface EmployeeReport {
  id: number;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  designation: string;
  salary: number;
  joiningDate: string;
  isActive: boolean;
}

interface AttendanceReport {
  id: number;
  employeeId: number;
  employeeName: string;
  attendanceDate: string;
  status: string;
  workingHours: number;
  remarks: string;
}

interface LeaveReport {
  id: number;
  employeeId: number;
  employeeName: string;
  leaveType: string;
  fromDate: string;
  toDate: string;
  reason: string;
  status: string;
  createdAt: string;
}

interface PayrollReport {
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

function ReportsPage() {
  const [reportType, setReportType] =
    useState<ReportType>("employees");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: [
      "reports",
      reportType,
      fromDate,
      toDate,
      month,
      year,
    ],

    queryFn: async () => {
      if (reportType === "employees") {
        const response =
          await api.get<EmployeeReport[]>(
            "/Reports/employees"
          );

        return response.data;
      }

      if (reportType === "attendance") {
        const params: Record<string, string> = {};

        if (fromDate) {
          params.fromDate = fromDate;
        }

        if (toDate) {
          params.toDate = toDate;
        }

        const response =
          await api.get<AttendanceReport[]>(
            "/Reports/attendance",
            { params }
          );

        return response.data;
      }

      if (reportType === "leave") {
        const params: Record<string, string> = {};

        if (fromDate) {
          params.fromDate = fromDate;
        }

        if (toDate) {
          params.toDate = toDate;
        }

        const response =
          await api.get<LeaveReport[]>(
            "/Reports/leave",
            { params }
          );

        return response.data;
      }

      const params: Record<string, string> = {};

      if (month) {
        params.month = month;
      }

      if (year) {
        params.year = year;
      }

      const response =
        await api.get<PayrollReport[]>(
          "/Reports/payroll",
          { params }
        );

      return response.data;
    },
  });

  const formatDate = (date: string) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString();
  };

  const formatCurrency = (value: number) => {
    return `₹ ${value.toLocaleString()}`;
  };

  const clearFilters = () => {
    setFromDate("");
    setToDate("");
    setMonth("");
    setYear("");
  };

  const employees =
    reportType === "employees"
      ? (data as EmployeeReport[]) || []
      : [];

  const attendance =
    reportType === "attendance"
      ? (data as AttendanceReport[]) || []
      : [];

  const leaves =
    reportType === "leave"
      ? (data as LeaveReport[]) || []
      : [];

  const payroll =
    reportType === "payroll"
      ? (data as PayrollReport[]) || []
      : [];

  return (
    <MainLayout>
      <div
        style={{
          width: "100%",
          maxWidth: 1400,
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            color: "#2563eb",
            marginBottom: 8,
          }}
        >
          Reports
        </h1>

        <p
          style={{
            color: "#64748b",
            marginBottom: 30,
          }}
        >
          View employee, attendance, leave and payroll
          reports.
        </p>

        {/* Report Tabs */}

        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            marginBottom: 25,
          }}
        >
          <button
            onClick={() => {
              setReportType("employees");
              clearFilters();
            }}
            style={tabStyle(
              reportType === "employees"
            )}
          >
            Employees
          </button>

          <button
            onClick={() => {
              setReportType("attendance");
              clearFilters();
            }}
            style={tabStyle(
              reportType === "attendance"
            )}
          >
            Attendance
          </button>

          <button
            onClick={() => {
              setReportType("leave");
              clearFilters();
            }}
            style={tabStyle(
              reportType === "leave"
            )}
          >
            Leave
          </button>

          <button
            onClick={() => {
              setReportType("payroll");
              clearFilters();
            }}
            style={tabStyle(
              reportType === "payroll"
            )}
          >
            Payroll
          </button>
        </div>

        {/* Attendance / Leave Filters */}

        {(reportType === "attendance" ||
          reportType === "leave") && (
          <div style={filterContainerStyle}>
            <div>
              <label style={labelStyle}>
                From Date
              </label>

              <input
                type="date"
                value={fromDate}
                onChange={(e) =>
                  setFromDate(e.target.value)
                }
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>
                To Date
              </label>

              <input
                type="date"
                value={toDate}
                onChange={(e) =>
                  setToDate(e.target.value)
                }
                style={inputStyle}
              />
            </div>

            <button
              onClick={clearFilters}
              style={clearButtonStyle}
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Payroll Filters */}

        {reportType === "payroll" && (
          <div style={filterContainerStyle}>
            <div>
              <label style={labelStyle}>
                Month
              </label>

              <select
                value={month}
                onChange={(e) =>
                  setMonth(e.target.value)
                }
                style={inputStyle}
              >
                <option value="">
                  All Months
                </option>

                {Array.from(
                  { length: 12 },
                  (_, index) => (
                    <option
                      key={index + 1}
                      value={index + 1}
                    >
                      {new Date(
                        2000,
                        index,
                        1
                      ).toLocaleString(
                        "default",
                        {
                          month: "long",
                        }
                      )}
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <label style={labelStyle}>
                Year
              </label>

              <input
                type="number"
                placeholder="2026"
                value={year}
                onChange={(e) =>
                  setYear(e.target.value)
                }
                style={{
                  ...inputStyle,
                  width: 120,
                }}
              />
            </div>

            <button
              onClick={clearFilters}
              style={clearButtonStyle}
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Loading */}

        {isLoading && (
          <div style={messageStyle}>
            Loading report...
          </div>
        )}

        {/* Error */}

        {error && (
          <div
            style={{
              ...messageStyle,
              background: "#fee2e2",
              color: "#b91c1c",
            }}
          >
            Failed to load report.
          </div>
        )}

        {/* Employee Report */}

        {!isLoading &&
          !error &&
          reportType === "employees" && (
            <>
              <div
                style={exportContainerStyle}
              >
                <button
                  onClick={() => {
                    if (employees.length === 0) {
                      alert(
                        "No data available to export."
                      );
                      return;
                    }

                    exportToExcel(
                      employees.map((employee) => ({
                        "Employee Code":
                          employee.employeeCode,
                        Name: `${employee.firstName} ${employee.lastName}`,
                        Email: employee.email,
                        Department:
                          employee.department,
                        Designation:
                          employee.designation,
                        Salary: employee.salary,
                        Status:
                          employee.isActive
                            ? "Active"
                            : "Inactive",
                      })),
                      "Employee_Report",
                      "Employees"
                    );
                  }}
                  style={exportButtonStyle}
                >
                  Export Excel
                </button>
              </div>

              <div style={tableContainerStyle}>
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Department</th>
                      <th>Designation</th>
                      <th>Salary</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {employees.map((employee) => (
                      <tr key={employee.id}>
                        <td>
                          {employee.employeeCode}
                        </td>

                        <td>
                          {employee.firstName}{" "}
                          {employee.lastName}
                        </td>

                        <td>
                          {employee.email}
                        </td>

                        <td>
                          {employee.department}
                        </td>

                        <td>
                          {employee.designation}
                        </td>

                        <td>
                          {formatCurrency(
                            employee.salary
                          )}
                        </td>

                        <td>
                          {employee.isActive
                            ? "Active"
                            : "Inactive"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

        {/* Attendance Report */}

        {!isLoading &&
          !error &&
          reportType === "attendance" && (
            <>
              <div
                style={exportContainerStyle}
              >
                <button
                  onClick={() => {
                    if (attendance.length === 0) {
                      alert(
                        "No data available to export."
                      );
                      return;
                    }

                    exportToExcel(
                      attendance.map((item) => ({
                        Employee:
                          item.employeeName,
                        Date: formatDate(
                          item.attendanceDate
                        ),
                        Status: item.status,
                        "Working Hours":
                          item.workingHours,
                        Remarks:
                          item.remarks || "-",
                      })),
                      "Attendance_Report",
                      "Attendance"
                    );
                  }}
                  style={exportButtonStyle}
                >
                  Export Excel
                </button>
              </div>

              <div style={tableContainerStyle}>
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Working Hours</th>
                      <th>Remarks</th>
                    </tr>
                  </thead>

                  <tbody>
                    {attendance.map((item) => (
                      <tr key={item.id}>
                        <td>
                          {item.employeeName}
                        </td>

                        <td>
                          {formatDate(
                            item.attendanceDate
                          )}
                        </td>

                        <td>{item.status}</td>

                        <td>
                          {item.workingHours}
                        </td>

                        <td>
                          {item.remarks || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

        {/* Leave Report */}

        {!isLoading &&
          !error &&
          reportType === "leave" && (
            <>
              <div
                style={exportContainerStyle}
              >
                <button
                  onClick={() => {
                    if (leaves.length === 0) {
                      alert(
                        "No data available to export."
                      );
                      return;
                    }

                    exportToExcel(
                      leaves.map((item) => ({
                        Employee:
                          item.employeeName,
                        "Leave Type":
                          item.leaveType,
                        From: formatDate(
                          item.fromDate
                        ),
                        To: formatDate(
                          item.toDate
                        ),
                        Reason:
                          item.reason || "-",
                        Status: item.status,
                      })),
                      "Leave_Report",
                      "Leave"
                    );
                  }}
                  style={exportButtonStyle}
                >
                  Export Excel
                </button>
              </div>

              <div style={tableContainerStyle}>
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Leave Type</th>
                      <th>From</th>
                      <th>To</th>
                      <th>Reason</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {leaves.map((item) => (
                      <tr key={item.id}>
                        <td>
                          {item.employeeName}
                        </td>

                        <td>
                          {item.leaveType}
                        </td>

                        <td>
                          {formatDate(
                            item.fromDate
                          )}
                        </td>

                        <td>
                          {formatDate(
                            item.toDate
                          )}
                        </td>

                        <td>
                          {item.reason || "-"}
                        </td>

                        <td>{item.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

        {/* Payroll Report */}

        {!isLoading &&
          !error &&
          reportType === "payroll" && (
            <>
              <div
                style={exportContainerStyle}
              >
                <button
                  onClick={() => {
                    if (payroll.length === 0) {
                      alert(
                        "No data available to export."
                      );
                      return;
                    }

                    exportToExcel(
                      payroll.map((item) => ({
                        Employee:
                          item.employeeName,
                        Month: item.month,
                        Year: item.year,
                        "Basic Salary":
                          item.basicSalary,
                        Allowance:
                          item.allowance,
                        Deduction:
                          item.deduction,
                        "Net Salary":
                          item.netSalary,
                        "Payment Date":
                          formatDate(
                            item.paymentDate
                          ),
                      })),
                      "Payroll_Report",
                      "Payroll"
                    );
                  }}
                  style={exportButtonStyle}
                >
                  Export Excel
                </button>
              </div>

              <div style={tableContainerStyle}>
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Month</th>
                      <th>Year</th>
                      <th>Basic Salary</th>
                      <th>Allowance</th>
                      <th>Deduction</th>
                      <th>Net Salary</th>
                      <th>Payment Date</th>
                    </tr>
                  </thead>

                  <tbody>
                    {payroll.map((item) => (
                      <tr key={item.id}>
                        <td>
                          {item.employeeName}
                        </td>

                        <td>{item.month}</td>

                        <td>{item.year}</td>

                        <td>
                          {formatCurrency(
                            item.basicSalary
                          )}
                        </td>

                        <td>
                          {formatCurrency(
                            item.allowance
                          )}
                        </td>

                        <td>
                          {formatCurrency(
                            item.deduction
                          )}
                        </td>

                        <td>
                          {formatCurrency(
                            item.netSalary
                          )}
                        </td>

                        <td>
                          {formatDate(
                            item.paymentDate
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
      </div>
    </MainLayout>
  );
}

function tabStyle(
  active: boolean
): CSSProperties {
  return {
    padding: "12px 20px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    background: active
      ? "#2563eb"
      : "#e2e8f0",
    color: active
      ? "#ffffff"
      : "#1e293b",
    fontWeight: 600,
  };
}

const filterContainerStyle: CSSProperties = {
  display: "flex",
  alignItems: "flex-end",
  gap: 20,
  flexWrap: "wrap",
  background: "#ffffff",
  padding: 20,
  borderRadius: 12,
  marginBottom: 25,
  boxShadow:
    "0 4px 12px rgba(0,0,0,.06)",
};

const labelStyle: CSSProperties = {
  display: "block",
  marginBottom: 6,
  fontWeight: 600,
};

const inputStyle: CSSProperties = {
  padding: "10px 12px",
  borderRadius: 6,
  border: "1px solid #cbd5e1",
  background: "#ffffff",
};

const clearButtonStyle: CSSProperties = {
  padding: "10px 16px",
  borderRadius: 6,
  border: "none",
  background: "#64748b",
  color: "#ffffff",
  cursor: "pointer",
};

const exportContainerStyle: CSSProperties = {
  display: "flex",
  justifyContent: "flex-end",
  marginBottom: 15,
};

const exportButtonStyle: CSSProperties = {
  padding: "11px 18px",
  border: "none",
  borderRadius: 8,
  background: "#16a34a",
  color: "#ffffff",
  fontWeight: 600,
  cursor: "pointer",
};

const messageStyle: CSSProperties = {
  padding: 25,
  background: "#ffffff",
  borderRadius: 12,
  color: "#334155",
};

const tableContainerStyle: CSSProperties = {
  background: "#ffffff",
  borderRadius: 12,
  boxShadow:
    "0 4px 12px rgba(0,0,0,.08)",
  overflowX: "auto",
};

const tableStyle: CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  minWidth: 900,
};

export default ReportsPage;