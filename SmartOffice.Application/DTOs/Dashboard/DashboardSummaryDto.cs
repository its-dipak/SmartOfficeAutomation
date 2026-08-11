namespace SmartOffice.Application.DTOs.Dashboard;

public class DashboardSummaryDto
{
    public int TotalEmployees { get; set; }

    public int TotalDepartments { get; set; }

    public int PresentToday { get; set; }

    public int AbsentToday { get; set; }

    public int PendingLeaves { get; set; }

    public decimal TotalPayroll { get; set; }
}