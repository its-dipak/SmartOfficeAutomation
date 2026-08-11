import type { Leave } from "../../services/LeaveService";

interface LeaveTableProps {
  leaves: Leave[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
}

function LeaveTable({
  leaves,
  onEdit,
  onDelete,
  onApprove,
  onReject,
}: LeaveTableProps) {
  if (leaves.length === 0) {
    return (
      <h3
        style={{
          textAlign: "center",
          marginTop: 40,
        }}
      >
        No leave records found.
      </h3>
    );
  }

  return (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        tableLayout: "fixed",
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
          <th style={{ padding: 12 }}>Leave Type</th>
          <th style={{ padding: 12 }}>From</th>
          <th style={{ padding: 12 }}>To</th>
          <th style={{ padding: 12 }}>Status</th>

          <th
            style={{
              padding: 12,
              width: "280px",
            }}
          >
            Actions
          </th>
        </tr>
      </thead>

      <tbody>
        {leaves.map((leave) => (
          <tr
            key={leave.id}
            style={{
              borderBottom: "1px solid #ddd",
            }}
          >
            <td style={{ padding: 12 }}>
              {leave.employeeName}
            </td>

            <td style={{ padding: 12 }}>
              {leave.leaveType}
            </td>

            <td style={{ padding: 12 }}>
              {leave.fromDate}
            </td>

            <td style={{ padding: 12 }}>
              {leave.toDate}
            </td>

            <td style={{ padding: 12 }}>
              <span
                style={{
                  padding: "6px 14px",
                  borderRadius: 20,
                  color: "white",
                  fontWeight: 600,
                  background:
                    leave.status === "Approved"
                      ? "#16a34a"
                      : leave.status === "Rejected"
                      ? "#dc2626"
                      : "#f59e0b",
                }}
              >
                {leave.status}
              </span>
            </td>

            <td style={{ padding: 12 }}>
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <button
                  onClick={() => onEdit(leave.id)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 5,
                    cursor: "pointer",
                  }}
                >
                  ✏ Edit
                </button>

                <button
                  onClick={() => onDelete(leave.id)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 5,
                    cursor: "pointer",
                  }}
                >
                  🗑 Delete
                </button>

                {leave.status === "Pending" && (
                  <>
                    <button
                      onClick={() => onApprove(leave.id)}
                      style={{
                        padding: "6px 12px",
                        background: "#16a34a",
                        color: "white",
                        border: "none",
                        borderRadius: 5,
                        cursor: "pointer",
                      }}
                    >
                      ✓
                    </button>

                    <button
                      onClick={() => onReject(leave.id)}
                      style={{
                        padding: "6px 12px",
                        background: "#dc2626",
                        color: "white",
                        border: "none",
                        borderRadius: 5,
                        cursor: "pointer",
                      }}
                    >
                      ✕
                    </button>
                  </>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default LeaveTable;