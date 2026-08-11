import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

import MainLayout from "../../layouts/MainLayout";
import LeaveTable from "../../components/leave/LeaveTable";

import {
  getLeaves,
  deleteLeave,
  updateLeaveStatus,
} from "../../services/LeaveService";

function LeaveListPage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const {
    data: leaves = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["leaves"],
    queryFn: getLeaves,
  });

  const filteredLeaves = leaves.filter((leave) => {
    const matchesSearch = leave.employeeName
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      leave.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const pendingCount = leaves.filter(
    (x) => x.status === "Pending"
  ).length;

  const approvedCount = leaves.filter(
    (x) => x.status === "Approved"
  ).length;

  const rejectedCount = leaves.filter(
    (x) => x.status === "Rejected"
  ).length;

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this leave request?"))
      return;

    try {
      await deleteLeave(id);
      await refetch();
      toast.success("Leave deleted successfully.");
    } catch (error) {
      console.error(error);
      toast.error("Unable to delete leave.");
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await updateLeaveStatus(id, {
        status: "Approved",
      });

      await refetch();

      toast.success("Leave approved successfully.");
    } catch (error) {
      console.error(error);
      toast.error("Unable to approve leave.");
    }
  };

  const handleReject = async (id: number) => {
    try {
      await updateLeaveStatus(id, {
        status: "Rejected",
      });

      await refetch();

      toast.success("Leave rejected successfully.");
    } catch (error) {
      console.error(error);
      toast.error("Unable to reject leave.");
    }
  };

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
        <h1>🏖 Leave Management</h1>

        <button
          onClick={() => navigate("/leave/add")}
          style={{
            padding: "10px 20px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          + Apply Leave
        </button>
      </div>

      {/* Dashboard Cards */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 20,
          marginBottom: 25,
        }}
      >
        <Card
          title="Total"
          value={leaves.length}
          color="#2563eb"
        />

        <Card
          title="Pending"
          value={pendingCount}
          color="#f59e0b"
        />

        <Card
          title="Approved"
          value={approvedCount}
          color="#16a34a"
        />

        <Card
          title="Rejected"
          value={rejectedCount}
          color="#dc2626"
        />
      </div>

      {/* Search + Filter */}

      <div
        style={{
          display: "flex",
          gap: 20,
          marginBottom: 25,
        }}
      >
        <input
          type="text"
          placeholder="🔍 Search Employee..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 8,
            border: "1px solid #ccc",
          }}
        />

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
          style={{
            padding: 10,
            borderRadius: 8,
          }}
        >
          <option>All</option>
          <option>Pending</option>
          <option>Approved</option>
          <option>Rejected</option>
        </select>
      </div>

      {isLoading ? (
        <h3>Loading...</h3>
      ) : (
        <LeaveTable
          leaves={filteredLeaves}
          onEdit={(id) =>
            navigate(`/leave/edit/${id}`)
          }
          onDelete={handleDelete}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </MainLayout>
  );
}

interface CardProps {
  title: string;
  value: number;
  color: string;
}

function Card({
  title,
  value,
  color,
}: CardProps) {
  return (
    <div
      style={{
        background: "white",
        borderLeft: `6px solid ${color}`,
        padding: 20,
        borderRadius: 10,
        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
      }}
    >
      <h4
        style={{
          margin: 0,
          color: "#666",
        }}
      >
        {title}
      </h4>

      <h2
        style={{
          marginTop: 10,
          color,
        }}
      >
        {value}
      </h2>
    </div>
  );
}

export default LeaveListPage;