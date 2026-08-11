namespace SmartOffice.Application.DTOs.Reports;

public class AttendanceReportDto
{
    public int Id { get; set; }

    public int EmployeeId { get; set; }

    public string EmployeeName { get; set; } = string.Empty;

    public DateOnly AttendanceDate { get; set; }

    public string Status { get; set; } = string.Empty;

    public decimal WorkingHours { get; set; }

    public string Remarks { get; set; } = string.Empty;
}