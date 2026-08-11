import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

interface AttendanceChartProps {
  present: number;
  absent: number;
}

function AttendanceChart({
  present,
  absent,
}: AttendanceChartProps) {
  const total = present + absent;

  const data =
    total === 0
      ? [{ name: "No Attendance", value: 1 }]
      : [
          { name: "Present", value: present },
          { name: "Absent", value: absent },
        ];

  const COLORS =
    total === 0
      ? ["#94a3b8"]
      : ["#16a34a", "#dc2626"];

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
        🟢 Attendance Overview
      </h2>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 320,
        }}
      >
       <ResponsiveContainer
  width="100%"
  height={320}
>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={90}
              isAnimationActive
              label
            >
              {data.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index]}
                />
              ))}
            </Pie>

            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default AttendanceChart;