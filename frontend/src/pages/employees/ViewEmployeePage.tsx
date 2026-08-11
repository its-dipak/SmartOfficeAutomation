import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import MainLayout from "../../layouts/MainLayout";
import { getEmployee } from "../../services/EmployeeService";

function ViewEmployeePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: employee,
    isLoading,
  } = useQuery({
    queryKey: ["employee", id],
    queryFn: () => getEmployee(Number(id)),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <MainLayout>
        <h2>Loading...</h2>
      </MainLayout>
    );
  }

  if (!employee) {
    return (
      <MainLayout>
        <h2>Employee not found.</h2>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h1 style={{ color: "#2563eb" }}>👤 Employee Details</h1>

        <hr style={{ margin: "20px 0" }} />

        <table style={{ width: "100%", lineHeight: "2.2" }}>
          <tbody>
            <tr>
              <td><strong>Employee Code</strong></td>
              <td>{employee.employeeCode}</td>
            </tr>

            <tr>
              <td><strong>Name</strong></td>
              <td>{employee.firstName} {employee.lastName}</td>
            </tr>

            <tr>
              <td><strong>Email</strong></td>
              <td>{employee.email}</td>
            </tr>

            <tr>
              <td><strong>Phone</strong></td>
              <td>{employee.phone}</td>
            </tr>

            <tr>
              <td><strong>Department</strong></td>
              <td>{employee.departmentName}</td>
            </tr>

            <tr>
              <td><strong>Designation</strong></td>
              <td>{employee.designation}</td>
            </tr>

            <tr>
              <td><strong>Salary</strong></td>
              <td>NPR {employee.salary.toLocaleString()}</td>
            </tr>

            <tr>
              <td><strong>Joining Date</strong></td>
              <td>
                {new Date(employee.joiningDate).toLocaleDateString()}
              </td>
            </tr>

            <tr>
              <td><strong>Status</strong></td>
              <td>
                {employee.isActive ? (
                  <span style={{ color: "green", fontWeight: "bold" }}>
                    Active
                  </span>
                ) : (
                  <span style={{ color: "red", fontWeight: "bold" }}>
                    Inactive
                  </span>
                )}
              </td>
            </tr>
          </tbody>
        </table>

        <div
          style={{
            marginTop: "30px",
            display: "flex",
            gap: "15px",
          }}
        >
          <button onClick={() => navigate("/employees")}>
            ← Back
          </button>

          <button
            onClick={() =>
              navigate(`/employees/edit/${employee.id}`)
            }
          >
            ✏ Edit Employee
          </button>
        </div>
      </div>
    </MainLayout>
  );
}

export default ViewEmployeePage;