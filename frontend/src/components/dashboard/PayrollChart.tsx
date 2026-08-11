import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface PayrollChartData {
  month: string;
  total: number;
}

interface PayrollChartProps {
  data: PayrollChartData[];
}

function PayrollChart({ data }: PayrollChartProps) {
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
        💰 Monthly Payroll
      </h2>

      <ResponsiveContainer
        width="100%"
        height={320}
      >
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="month" />

          <YAxis allowDecimals={false} />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="total"
            stroke="#7c3aed"
            strokeWidth={3}
            dot={{ r: 5 }}
            activeDot={{ r: 7 }}
            isAnimationActive
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PayrollChart;