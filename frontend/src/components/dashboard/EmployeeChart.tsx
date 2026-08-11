import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface DepartmentChart {
  department: string;
  count: number;
}

interface EmployeeChartProps {
  data: DepartmentChart[];
}

function EmployeeChart({ data }: EmployeeChartProps) {
  return (
    <div
  style={{
    background: "#fff",
    borderRadius: 16,
    padding: 24,
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
    width: "100%",
    minHeight: 430,
    boxSizing: "border-box",
  }}
>
      <h2
        style={{
          marginBottom: 20,
          color: "#2563eb",
        }}
      >
        👨 Employees by Department
      </h2>

      <ResponsiveContainer
        width="100%"
        height={320}
      >
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="department" />

          <YAxis allowDecimals={false} />

          <Tooltip />

          <Bar
            dataKey="count"
            fill="#2563eb"
            barSize={60}
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default EmployeeChart;