import {
  LayoutDashboard,
  Users,
  Building2,
  Clock3,
  CalendarDays,
  Wallet,
  FileBarChart,
  LogOut,
  BriefcaseBusiness,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

interface MenuItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  roles?: string[];
}

function Sidebar() {
  const { role, logout } = useAuth();
  const navigate = useNavigate();

  const menuItems: MenuItem[] = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Employees",
      path: "/employees",
      icon: Users,
      roles: ["Admin", "HR"],
    },
    {
      label: "Departments",
      path: "/departments",
      icon: Building2,
      roles: ["Admin", "HR"],
    },
    {
      label: "Attendance",
      path: "/attendance",
      icon: Clock3,
    },
    {
      label: "Leave",
      path: "/leave",
      icon: CalendarDays,
    },
    {
      label: "Payroll",
      path: "/payroll",
      icon: Wallet,
      roles: ["Admin", "HR"],
    },
    {
      label: "Reports",
      path: "/reports",
      icon: FileBarChart,
      roles: ["Admin", "HR"],
    },
  ];

  const visibleItems = menuItems.filter(
    (item) => !item.roles || (role && item.roles.includes(role))
  );

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">
          <BriefcaseBusiness size={22} strokeWidth={2.2} />
        </div>

        <div>
          <div className="brand-name">SmartOffice</div>
          <div className="brand-subtitle">Management System</div>
        </div>
      </div>

      <div className="sidebar-section-label">
        WORKSPACE
      </div>

      <nav className="sidebar-nav">
        {visibleItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              <Icon size={19} strokeWidth={2} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-role-card">
          <div className="role-avatar">
            {role?.charAt(0).toUpperCase() || "U"}
          </div>

          <div className="role-info">
            <span className="role-label">Signed in as</span>
            <span className="role-name">{role || "User"}</span>
          </div>
        </div>

        <button
          type="button"
          className="logout-button"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;

