import type { Employee } from "../../services/EmployeeService";
import { Pencil, Trash2, Eye } from "lucide-react";

interface Props {
  employees: Employee[];
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

function EmployeeTable({
  employees,
  onView,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 10,
        overflow: "hidden",
        boxShadow: "0 2px 10px rgba(0,0,0,.08)",
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead
          style={{
            background: "#2563eb",
            color: "white",
          }}
        >
          <tr>
            <th style={th}>Code</th>
            <th style={th}>Name</th>
            <th style={th}>Department</th>
            <th style={th}>Designation</th>
            <th style={th}>Salary</th>
            <th style={th}>Status</th>
            <th style={th}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {employees.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                style={{
                  textAlign: "center",
                  padding: 40,
                }}
              >
                No employees found.
              </td>
            </tr>
          ) : (
            employees.map((employee) => (
              <tr
                key={employee.id}
                style={{
                  borderBottom: "1px solid #eee",
                }}
              >
                <td style={td}>{employee.employeeCode}</td>

                <td style={td}>
                  {employee.firstName} {employee.lastName}
                </td>

                <td style={td}>
                  {employee.departmentName}
                </td>

                <td style={td}>
                  {employee.designation}
                </td>

                <td style={td}>
                  NPR {employee.salary.toLocaleString()}
                </td>

                <td style={td}>
                  {employee.isActive ? (
                    <span
                      style={{
                        color: "green",
                        fontWeight: "bold",
                      }}
                    >
                      Active
                    </span>
                  ) : (
                    <span
                      style={{
                        color: "red",
                        fontWeight: "bold",
                      }}
                    >
                      Inactive
                    </span>
                  )}
                </td>

                <td style={td}>
                  <div
                    style={{
                      display: "flex",
                      gap: 12,
                    }}
                  >
                    <Eye
                      size={18}
                      style={{ cursor: "pointer" }}
                      onClick={() => onView(employee.id)}
                    />

                    <Pencil
                      size={18}
                      color="#2563eb"
                      style={{ cursor: "pointer" }}
                      onClick={() => onEdit(employee.id)}
                    />

                    <Trash2
                      size={18}
                      color="red"
                      style={{ cursor: "pointer" }}
                      onClick={() => onDelete(employee.id)}
                    />
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

const th: React.CSSProperties = {
  padding: 16,
  textAlign: "left",
};

const td: React.CSSProperties = {
  padding: 16,
};

export default EmployeeTable;