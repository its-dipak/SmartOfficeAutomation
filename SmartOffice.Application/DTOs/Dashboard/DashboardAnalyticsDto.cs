namespace SmartOffice.Application.DTOs.Dashboard;

public class DashboardAnalyticsDto
{
    public List<DepartmentChartDto> EmployeesByDepartment { get; set; } = [];

    public int PresentEmployees { get; set; }

    public int AbsentEmployees { get; set; }

    public List<PayrollChartDto> MonthlyPayroll { get; set; } = [];
}

public class DepartmentChartDto
{
    public string Department { get; set; } = string.Empty;

    public int Count { get; set; }
}

public class PayrollChartDto
{
    public string Month { get; set; } = string.Empty;

    public decimal Total { get; set; }
}