import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

import MainLayout from "../../layouts/MainLayout";

import { getEmployees } from "../../services/EmployeeService";
import { checkIn } from "../../services/AttendanceService";

function CheckInPage() {
  const navigate = useNavigate();

  const [employeeId, setEmployeeId] = useState(0);
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);

  const { data: employees = [] } = useQuery({
    queryKey: ["employees"],
    queryFn: getEmployees,
  });

  const handleSubmit = async () => {
    if (employeeId === 0) {
      toast.error("Please select an employee.");
      return;
    }

    try {
      setLoading(true);

      await checkIn({
        employeeId,
        remarks,
      });

      toast.success("Employee checked in successfully.");

      navigate("/attendance");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ??
          "Unable to check in."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <h1 style={{ marginBottom: 30 }}>
        ✅ Check In Employee
      </h1>

      <div
        style={{
          background: "white",
          padding: 30,
          borderRadius: 12,
          maxWidth: 600,
        }}
      >
        <div style={{ marginBottom: 20 }}>
          <label>Employee</label>

          <br />

          <select
            value={employeeId}
            onChange={(e) =>
              setEmployeeId(Number(e.target.value))
            }
            style={{
              width: "100%",
              padding: 12,
              marginTop: 8,
            }}
          >
            <option value={0}>
              Select Employee
            </option>

            {employees.map((employee) => (
              <option
                key={employee.id}
                value={employee.id}
              >
                {employee.employeeCode} -{" "}
                {employee.firstName}{" "}
                {employee.lastName}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label>Remarks</label>

          <br />

          <textarea
            value={remarks}
            onChange={(e) =>
              setRemarks(e.target.value)
            }
            rows={4}
            style={{
              width: "100%",
              marginTop: 8,
              padding: 12,
            }}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            background: "#16a34a",
            color: "white",
            border: "none",
            padding: "12px 30px",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          {loading
            ? "Checking In..."
            : "Check In"}
        </button>
      </div>
    </MainLayout>
  );
}

export default CheckInPage;