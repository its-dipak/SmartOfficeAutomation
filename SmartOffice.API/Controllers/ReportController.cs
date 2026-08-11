using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartOffice.Application.Interfaces;

namespace SmartOffice.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class ReportsController : ControllerBase
{
    private readonly IReportService _reportService;

    public ReportsController(IReportService reportService)
    {
        _reportService = reportService;
    }

    [HttpGet("employees")]
    public async Task<IActionResult> GetEmployeeReport()
    {
        var report =
            await _reportService.GetEmployeeReportAsync();

        return Ok(report);
    }

    [HttpGet("attendance")]
    public async Task<IActionResult> GetAttendanceReport(
        [FromQuery] DateOnly? fromDate,
        [FromQuery] DateOnly? toDate)
    {
        var report =
            await _reportService.GetAttendanceReportAsync(
                fromDate,
                toDate);

        return Ok(report);
    }

    [HttpGet("leave")]
    public async Task<IActionResult> GetLeaveReport(
        [FromQuery] DateOnly? fromDate,
        [FromQuery] DateOnly? toDate)
    {
        var report =
            await _reportService.GetLeaveReportAsync(
                fromDate,
                toDate);

        return Ok(report);
    }

    [HttpGet("payroll")]
    public async Task<IActionResult> GetPayrollReport(
        [FromQuery] int? month,
        [FromQuery] int? year)
    {
        var report =
            await _reportService.GetPayrollReportAsync(
                month,
                year);

        return Ok(report);
    }
}