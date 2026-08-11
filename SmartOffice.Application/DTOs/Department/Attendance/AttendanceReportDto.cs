namespace SmartOffice.Application.DTOs.Attendance;

public class AttendanceReportDto
{
    public int EmployeeId { get; set; }

    public string EmployeeName { get; set; } = string.Empty;

    public int PresentDays { get; set; }

    public int AbsentDays { get; set; }

    public decimal TotalWorkingHours { get; set; }
}