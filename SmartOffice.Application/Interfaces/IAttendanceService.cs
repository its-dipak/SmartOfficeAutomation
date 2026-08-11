using SmartOffice.Application.DTOs.Attendance;

namespace SmartOffice.Application.Interfaces;

public interface IAttendanceService
{
    Task<AttendanceDto> CheckInAsync(
        CreateAttendanceDto dto);

    Task<AttendanceDto> CheckOutAsync(
        CheckOutDto dto);

    Task<IEnumerable<AttendanceDto>> GetAllAsync();

    Task<IEnumerable<AttendanceDto>> GetEmployeeAttendanceAsync(
        int employeeId);

    Task<IEnumerable<AttendanceDto>> GetMyAttendanceAsync(
        int userId);

    Task<AttendanceDto> MyCheckInAsync(
        int userId,
        string? remarks);

    Task<AttendanceDto> MyCheckOutAsync(
        int userId,
        string? remarks);
}