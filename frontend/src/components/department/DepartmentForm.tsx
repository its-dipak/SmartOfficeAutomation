import { useForm } from "react-hook-form";

export interface DepartmentFormData {
  name: string;
  description: string;
}

interface DepartmentFormProps {
  defaultValues?: DepartmentFormData;
  onSubmit: (data: DepartmentFormData) => void;
  loading?: boolean;
}

function DepartmentForm({
  defaultValues,
  onSubmit,
  loading = false,
}: DepartmentFormProps) {
  const {
    register,
    handleSubmit,
  } = useForm<DepartmentFormData>({
    defaultValues,
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{
        maxWidth: 600,
      }}
    >
      <div style={{ marginBottom: 20 }}>
        <label>Department Name</label>

        <input
          type="text"
          {...register("name", {
            required: true,
          })}
          style={{
            width: "100%",
            padding: 10,
            marginTop: 5,
          }}
        />
      </div>

      <div style={{ marginBottom: 20 }}>
        <label>Description</label>

        <textarea
          rows={4}
          {...register("description")}
          style={{
            width: "100%",
            padding: 10,
            marginTop: 5,
          }}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        style={{
          padding: "10px 20px",
          background: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
        }}
      >
        {loading ? "Saving..." : "Save Department"}
      </button>
    </form>
  );
}

export default DepartmentForm;