import {
  Bell,
  ChevronDown,
  Menu,
} from "lucide-react";
import { useLocation } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

function getPageTitle(pathname: string): string {
  if (pathname.startsWith("/employees")) return "Employees";
  if (pathname.startsWith("/departments")) return "Departments";
  if (pathname.startsWith("/attendance")) return "Attendance";
  if (pathname.startsWith("/leave")) return "Leave Management";
  if (pathname.startsWith("/payroll")) return "Payroll";
  if (pathname.startsWith("/reports")) return "Reports";

  return "Dashboard";
}

function Header() {
  const location = useLocation();
  const { role } = useAuth();

  const pageTitle = getPageTitle(location.pathname);
  const initial = role?.charAt(0).toUpperCase() || "U";

  return (
    <header className="top-header">
      <div className="header-left">
        <button
          type="button"
          className="mobile-menu-button"
          aria-label="Open navigation"
        >
          <Menu size={21} />
        </button>

        <div>
          <h1 className="page-title">{pageTitle}</h1>
          <p className="page-subtitle">
            SmartOffice workplace management
          </p>
        </div>
      </div>

      <div className="header-right">
        <button
          type="button"
          className="notification-button"
          aria-label="Notifications"
        >
          <Bell size={19} />
          <span className="notification-dot" />
        </button>

        <div className="header-divider" />

        <div className="header-user">
          <div className="header-avatar">
            {initial}
          </div>

          <div className="header-user-info">
            <span className="header-user-name">
              {role || "User"}
            </span>
            <span className="header-user-role">
              {role === "Admin"
                ? "Administrator"
                : role === "HR"
                  ? "Human Resources"
                  : "Employee"}
            </span>
          </div>

          <ChevronDown size={16} className="header-chevron" />
        </div>
      </div>
    </header>
  );
}

export default Header;
