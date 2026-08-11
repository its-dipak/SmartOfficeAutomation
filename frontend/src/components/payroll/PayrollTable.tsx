import type { Payroll } from "../../services/PayrollService";

interface PayrollTableProps {
  payrolls: Payroll[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

function PayrollTable({
  payrolls,
  onEdit,
  onDelete,
}: PayrollTableProps) {
  if (payrolls.length === 0) {
    return (
      <h3
        style={{
          textAlign: "center",
          marginTop: 40,
        }}
      >
        No payroll records found.
      </h3>
    );
  }

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
          <th style={{ padding: 12 }}>Month</th>
          <th style={{ padding: 12 }}>Year</th>
          <th style={{ padding: 12 }}>Basic</th>
          <th style={{ padding: 12 }}>Allowance</th>
          <th style={{ padding: 12 }}>Deduction</th>
          <th style={{ padding: 12 }}>Net Salary</th>
          <th style={{ padding: 12 }}>Payment Date</th>
          <th style={{ padding: 12 }}>Actions</th>
        </tr>
      </thead>

      <tbody>
        {payrolls.map((payroll) => (
          <tr
            key={payroll.id}
            style={{
              borderBottom: "1px solid #ddd",
            }}
          >
            <td style={{ padding: 12 }}>
              {payroll.employeeName}
            </td>

            <td style={{ padding: 12 }}>
              {new Date(0, payroll.month - 1).toLocaleString("default", {
                month: "long",
              })}
            </td>

            <td style={{ padding: 12 }}>
              {payroll.year}
            </td>

            <td style={{ padding: 12 }}>
              ₹ {payroll.basicSalary.toFixed(2)}
            </td>

            <td style={{ padding: 12 }}>
              ₹ {payroll.allowance.toFixed(2)}
            </td>

            <td style={{ padding: 12 }}>
              ₹ {payroll.deduction.toFixed(2)}
            </td>

            <td
              style={{
                padding: 12,
                fontWeight: "bold",
                color: "#16a34a",
              }}
            >
              ₹ {payroll.netSalary.toFixed(2)}
            </td>

            <td style={{ padding: 12 }}>
              {new Date(payroll.paymentDate).toLocaleDateString()}
            </td>

            <td style={{ padding: 12 }}>
              <div
                style={{
                  display: "flex",
                  gap: 10,
                }}
              >
                <button
                  onClick={() => onEdit(payroll.id)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 5,
                    cursor: "pointer",
                  }}
                >
                  Edit
                </button>

                <button
                  onClick={() => onDelete(payroll.id)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 5,
                    cursor: "pointer",
                    color: "white",
                    background: "#dc2626",
                    border: "none",
                  }}
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default PayrollTable;