namespace SmartOffice.Application.DTOs.Attendance;

public class CreateAttendanceDto
{
    public int EmployeeId { get; set; }

    public string? Remarks { get; set; }
}