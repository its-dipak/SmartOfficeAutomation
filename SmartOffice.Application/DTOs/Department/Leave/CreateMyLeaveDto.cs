namespace SmartOffice.Application.DTOs.Leave;

public class CreateMyLeaveDto
{
    public string LeaveType { get; set; } = string.Empty;

    public DateOnly FromDate { get; set; }

    public DateOnly ToDate { get; set; }

    public string? Reason { get; set; }
}