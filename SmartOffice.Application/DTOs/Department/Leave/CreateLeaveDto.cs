namespace SmartOffice.Application.DTOs.Leave;

public class CreateLeaveDto
{
    public int EmployeeId { get; set; }

    public string LeaveType { get; set; } = string.Empty;

    public DateOnly FromDate { get; set; }

    public DateOnly ToDate { get; set; }

    public string? Reason { get; set; }
}