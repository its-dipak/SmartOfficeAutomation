import type { Department } from "../../services/DepartmentService";

interface DepartmentTableProps {
  departments: Department[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

function DepartmentTable({
  departments,
  onEdit,
  onDelete,
}: DepartmentTableProps) {
  if (departments.length === 0) {
    return (
      <h3
        style={{
          textAlign: "center",
          marginTop: 40,
        }}
      >
        No departments found.
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
          <th style={{ padding: 12 }}>Name</th>
          <th style={{ padding: 12 }}>Description</th>
          <th style={{ padding: 12 }}>Actions</th>
        </tr>
      </thead>

      <tbody>
        {departments.map((department) => (
          <tr
            key={department.id}
            style={{
              borderBottom: "1px solid #ddd",
            }}
          >
            <td style={{ padding: 12 }}>
              {department.name}
            </td>

            <td style={{ padding: 12 }}>
              {department.description}
            </td>

            <td style={{ padding: 12 }}>
              <button
                onClick={() => onEdit(department.id)}
                style={{
                  marginRight: 10,
                }}
              >
                Edit
              </button>

              <button
                onClick={() => onDelete(department.id)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default DepartmentTable;