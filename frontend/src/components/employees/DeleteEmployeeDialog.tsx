interface DeleteEmployeeDialogProps {
  open: boolean;
  employeeName: string;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

function DeleteEmployeeDialog({
  open,
  employeeName,
  loading = false,
  onCancel,
  onConfirm,
}: DeleteEmployeeDialogProps) {
  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.45)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          width: 420,
          background: "white",
          borderRadius: 12,
          padding: 25,
          boxShadow: "0 15px 40px rgba(0,0,0,.25)",
        }}
      >
        <h2 style={{ color: "#dc2626" }}>
          🗑 Delete Employee
        </h2>

        <p style={{ marginTop: 20 }}>
          Are you sure you want to delete
        </p>

        <h3>{employeeName}</h3>

        <p
          style={{
            color: "#777",
            marginTop: 10,
          }}
        >
          This action cannot be undone.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 12,
            marginTop: 25,
          }}
        >
          <button onClick={onCancel}>
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            style={{
              background: "#dc2626",
              color: "white",
              border: "none",
              padding: "10px 18px",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteEmployeeDialog;