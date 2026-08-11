namespace SmartOffice.Application.DTOs.Dashboard;

public class EmployeeDashboardDto
{
    public EmployeeDashboardProfileDto Profile { get; set; } = new();

    public EmployeeAttendanceSummaryDto Attendance { get; set; } = new();

    public EmployeeLeaveSummaryDto Leave { get; set; } = new();

    public EmployeePayrollSummaryDto? LatestPayroll { get; set; }
}

public class EmployeeDashboardProfileDto
{
    public int EmployeeId { get; set; }

    public string EmployeeCode { get; set; } = string.Empty;

    public string FullName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string Phone { get; set; } = string.Empty;

    public string Designation { get; set; } = string.Empty;

    public string DepartmentName { get; set; } = string.Empty;

    public DateTime JoiningDate { get; set; }

    public bool IsActive { get; set; }
}

public class EmployeeAttendanceSummaryDto
{
    public bool HasCheckedInToday { get; set; }

    public bool HasCheckedOutToday { get; set; }

    public string? CheckInTime { get; set; }

    public string? CheckOutTime { get; set; }

    public decimal WorkingHours { get; set; }

    public string Status { get; set; } = string.Empty;
}

public class EmployeeLeaveSummaryDto
{
    public int Total { get; set; }

    public int Pending { get; set; }

    public int Approved { get; set; }

    public int Rejected { get; set; }
}

public class EmployeePayrollSummaryDto
{
    public int Month { get; set; }

    public int Year { get; set; }

    public decimal BasicSalary { get; set; }

    public decimal Allowance { get; set; }

    public decimal Deduction { get; set; }

    public decimal NetSalary { get; set; }

    public DateTime PaymentDate { get; set; }
}