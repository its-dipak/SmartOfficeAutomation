import type { Attendance } from "../../services/AttendanceService";

interface AttendanceTableProps {
  attendance: Attendance[];
}

function AttendanceTable({
  attendance,
}: AttendanceTableProps) {
  return (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
      }}
    >
      <thead>
        <tr
          style={{
            background: "#2563eb",
            color: "white",
          }}
        >
          <th style={{ padding: 12 }}>Employee</th>
          <th>Date</th>
          <th>Check In</th>
          <th>Check Out</th>
          <th>Hours</th>
          <th>Status</th>
        </tr>
      </thead>

      <tbody>
        {attendance.map((item) => (
          <tr
            key={item.id}
            style={{
              borderBottom: "1px solid #ddd",
            }}
          >
            <td style={{ padding: 12 }}>
              {item.employeeName}
            </td>

            <td>{item.attendanceDate}</td>

            <td>
              {item.checkInTime ?? "-"}
            </td>

            <td>
              {item.checkOutTime ?? "-"}
            </td>

            <td>{item.workingHours}</td>

            <td>
              {item.status}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default AttendanceTable;