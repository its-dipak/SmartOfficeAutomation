import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import MainLayout from "../../layouts/MainLayout";
import AttendanceTable from "../../components/attendance/AttendanceTable";

import { getAttendance } from "../../services/AttendanceService";

function AttendanceListPage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const {
    data: attendance = [],
    isLoading,
  } = useQuery({
    queryKey: ["attendance"],
    queryFn: getAttendance,
  });

  const filteredAttendance = useMemo(() => {
    return attendance.filter((item) =>
      item.employeeName
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [attendance, search]);

  return (
    <MainLayout>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h1>📅 Attendance</h1>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={() => navigate("/attendance/checkin")}
            style={{
              padding: "10px 20px",
              background: "#16a34a",
              color: "white",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            Check In
          </button>

          <button
            onClick={() => navigate("/attendance/checkout")}
            style={{
              padding: "10px 20px",
              background: "#dc2626",
              color: "white",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            Check Out
          </button>
        </div>
      </div>

      <input
        placeholder="Search employee..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: 12,
          marginBottom: 20,
          borderRadius: 8,
          border: "1px solid #ccc",
        }}
      />

      {isLoading ? (
        <h3>Loading attendance...</h3>
      ) : (
        <AttendanceTable attendance={filteredAttendance} />
      )}
    </MainLayout>
  );
}

export default AttendanceListPage;