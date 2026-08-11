using SmartOffice.Application.DTOs.Reports;
using SmartOffice.Application.Interfaces;

namespace SmartOffice.Application.Services;

public class ReportService : IReportService
{
    private readonly IReportRepository _repository;

    public ReportService(IReportRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<EmployeeReportDto>> GetEmployeeReportAsync()
    {
        return await _repository.GetEmployeeReportAsync();
    }

    public async Task<List<AttendanceReportDto>> GetAttendanceReportAsync(
        DateOnly? fromDate,
        DateOnly? toDate)
    {
        return await _repository.GetAttendanceReportAsync(
            fromDate,
            toDate);
    }

    public async Task<List<LeaveReportDto>> GetLeaveReportAsync(
        DateOnly? fromDate,
        DateOnly? toDate)
    {
        return await _repository.GetLeaveReportAsync(
            fromDate,
            toDate);
    }

    public async Task<List<PayrollReportDto>> GetPayrollReportAsync(
        int? month,
        int? year)
    {
        return await _repository.GetPayrollReportAsync(
            month,
            year);
    }
}