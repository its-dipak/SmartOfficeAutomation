namespace SmartOffice.Application.DTOs.Attendance;

public class AttendanceDto
{
    public int Id { get; set; }

    public int EmployeeId { get; set; }

    public string EmployeeName { get; set; } = string.Empty;

    public DateOnly AttendanceDate { get; set; }

    public TimeOnly? CheckInTime { get; set; }

    public TimeOnly? CheckOutTime { get; set; }

    public decimal WorkingHours { get; set; }

    public string Status { get; set; } = string.Empty;

    public string? Remarks { get; set; }
}