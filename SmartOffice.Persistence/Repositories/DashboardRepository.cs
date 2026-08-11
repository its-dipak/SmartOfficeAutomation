using Microsoft.EntityFrameworkCore;
using SmartOffice.Application.DTOs.Dashboard;
using SmartOffice.Application.Interfaces;
using SmartOffice.Persistence.Context;

namespace SmartOffice.Persistence.Repositories;

public class DashboardRepository : IDashboardRepository
{
    private readonly AppDbContext _context;

    public DashboardRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<DashboardSummaryDto> GetSummaryAsync()
    {
        return new DashboardSummaryDto
        {
            TotalEmployees =
                await _context.Employees.CountAsync(),

            TotalDepartments =
                await _context.Departments
                    .CountAsync(d => d.IsActive),

            PresentToday =
                await _context.Attendances
                    .CountAsync(a =>
                        a.AttendanceDate ==
                        DateOnly.FromDateTime(DateTime.Today) &&
                        a.Status == "Present"),

            AbsentToday =
                await _context.Attendances
                    .CountAsync(a =>
                        a.AttendanceDate ==
                        DateOnly.FromDateTime(DateTime.Today) &&
                        a.Status == "Absent"),

            PendingLeaves =
                await _context.Leaves
                    .CountAsync(l => l.Status == "Pending"),

            TotalPayroll =
                await _context.Payrolls
                    .SumAsync(p => p.NetSalary)
        };
    }

    public async Task<DashboardAnalyticsDto> GetAnalyticsAsync()
    {
        var analytics = new DashboardAnalyticsDto();

        analytics.EmployeesByDepartment =
            await _context.Employees
                .Include(e => e.Department)
                .GroupBy(e => e.Department!.Name)
                .Select(g => new DepartmentChartDto
                {
                    Department = g.Key,
                    Count = g.Count()
                })
                .ToListAsync();

        analytics.PresentEmployees =
            await _context.Attendances
                .CountAsync(a =>
                    a.AttendanceDate ==
                    DateOnly.FromDateTime(DateTime.Today) &&
                    a.Status == "Present");

        analytics.AbsentEmployees =
            await _context.Attendances
                .CountAsync(a =>
                    a.AttendanceDate ==
                    DateOnly.FromDateTime(DateTime.Today) &&
                    a.Status == "Absent");

        analytics.MonthlyPayroll =
            await _context.Payrolls
                .GroupBy(p => p.Month)
                .Select(g => new PayrollChartDto
                {
                    Month = System.Globalization.CultureInfo
                        .CurrentCulture
                        .DateTimeFormat
                        .GetMonthName(g.Key),

                    Total = g.Sum(x => x.NetSalary)
                })
                .ToListAsync();

        return analytics;
    }

    public async Task<EmployeeDashboardDto> GetMyDashboardAsync(
        int employeeId)
    {
        var employee = await _context.Employees
            .Include(e => e.Department)
            .FirstOrDefaultAsync(e => e.Id == employeeId);

        if (employee == null)
        {
            throw new Exception("Employee not found.");
        }

        var today =
            DateOnly.FromDateTime(DateTime.Today);

        var attendance =
            await _context.Attendances
                .FirstOrDefaultAsync(a =>
                    a.EmployeeId == employeeId &&
                    a.AttendanceDate == today);

        var leaves =
            await _context.Leaves
                .Where(l => l.EmployeeId == employeeId)
                .ToListAsync();

        var latestPayroll =
            await _context.Payrolls
                .Where(p => p.EmployeeId == employeeId)
                .OrderByDescending(p => p.Year)
                .ThenByDescending(p => p.Month)
                .FirstOrDefaultAsync();

        return new EmployeeDashboardDto
        {
            Profile = new EmployeeDashboardProfileDto
            {
                EmployeeId = employee.Id,
                EmployeeCode = employee.EmployeeCode,
                FullName =
                    $"{employee.FirstName} {employee.LastName}",
                Email = employee.Email,
                Phone = employee.Phone,
                Designation = employee.Designation,
                DepartmentName =
                    employee.Department?.Name ?? string.Empty,
                JoiningDate = employee.JoiningDate,
                IsActive = employee.IsActive
            },

            Attendance = new EmployeeAttendanceSummaryDto
            {
                HasCheckedInToday =
                    attendance?.CheckInTime != null,

                HasCheckedOutToday =
                    attendance?.CheckOutTime != null,

                CheckInTime =
                    attendance?.CheckInTime?.ToString(),

                CheckOutTime =
                    attendance?.CheckOutTime?.ToString(),

                WorkingHours =
                    attendance?.WorkingHours ?? 0,

                Status =
                    attendance?.Status ?? "Not Marked"
            },

            Leave = new EmployeeLeaveSummaryDto
            {
                Total = leaves.Count,

                Pending =
                    leaves.Count(l =>
                        l.Status == "Pending"),

                Approved =
                    leaves.Count(l =>
                        l.Status == "Approved"),

                Rejected =
                    leaves.Count(l =>
                        l.Status == "Rejected")
            },

            LatestPayroll =
                latestPayroll == null
                    ? null
                    : new EmployeePayrollSummaryDto
                    {
                        Month = latestPayroll.Month,
                        Year = latestPayroll.Year,
                        BasicSalary =
                            latestPayroll.BasicSalary,
                        Allowance =
                            latestPayroll.Allowance,
                        Deduction =
                            latestPayroll.Deduction,
                        NetSalary =
                            latestPayroll.NetSalary,
                        PaymentDate =
                            latestPayroll.PaymentDate
                    }
        };
    }
}