interface DashboardCardsProps {
  totalEmployees: number;
  totalDepartments: number;
  presentToday: number;
  absentToday: number;
  pendingLeaves: number;
  totalPayroll: number;
}

function Card({
  title,
  value,
  color,
}: {
  title: string;
  value: string | number;
  color: string;
}) {
  return (
    <div
      style={{
        background: color,
        color: "white",
        borderRadius: 14,
        padding: 25,
        boxShadow: "0 6px 15px rgba(0,0,0,.15)",
      }}
    >
      <h3
        style={{
          margin: 0,
          fontSize: 18,
        }}
      >
        {title}
      </h3>

      <h1
        style={{
          marginTop: 15,
          fontSize: 36,
        }}
      >
        {value}
      </h1>
    </div>
  );
}

function DashboardCards({
  totalEmployees,
  totalDepartments,
  presentToday,
  absentToday,
  pendingLeaves,
  totalPayroll,
}: DashboardCardsProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
        gap: 20,
        marginBottom: 30,
      }}
    >
      <Card
        title="👨 Employees"
        value={totalEmployees}
        color="#2563eb"
      />

      <Card
        title="🏢 Departments"
        value={totalDepartments}
        color="#16a34a"
      />

      <Card
        title="🟢 Present"
        value={presentToday}
        color="#0ea5e9"
      />

      <Card
        title="🔴 Absent"
        value={absentToday}
        color="#dc2626"
      />

      <Card
        title="🌴 Pending Leaves"
        value={pendingLeaves}
        color="#f59e0b"
      />

      <Card
        title="💰 Payroll"
        value={`₹ ${totalPayroll.toLocaleString()}`}
        color="#7c3aed"
      />
    </div>
  );
}

export default DashboardCards;