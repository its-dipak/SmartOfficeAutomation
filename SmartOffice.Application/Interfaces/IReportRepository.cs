using SmartOffice.Application.DTOs.Reports;

namespace SmartOffice.Application.Interfaces;

public interface IReportRepository
{
    Task<List<EmployeeReportDto>> GetEmployeeReportAsync();

    Task<List<AttendanceReportDto>> GetAttendanceReportAsync(
        DateOnly? fromDate,
        DateOnly? toDate);

    Task<List<LeaveReportDto>> GetLeaveReportAsync(
        DateOnly? fromDate,
        DateOnly? toDate);

    Task<List<PayrollReportDto>> GetPayrollReportAsync(
        int? month,
        int? year);
}