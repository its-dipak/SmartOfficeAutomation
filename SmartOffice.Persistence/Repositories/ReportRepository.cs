using Microsoft.EntityFrameworkCore;
using SmartOffice.Application.DTOs.Reports;
using SmartOffice.Application.Interfaces;
using SmartOffice.Persistence.Context;

namespace SmartOffice.Persistence.Repositories;

public class ReportRepository : IReportRepository
{
    private readonly AppDbContext _context;

    public ReportRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<EmployeeReportDto>> GetEmployeeReportAsync()
    {
        return await _context.Employees
            .Include(e => e.Department)
            .Select(e => new EmployeeReportDto
            {
                Id = e.Id,
                EmployeeCode = e.EmployeeCode,
                FirstName = e.FirstName,
                LastName = e.LastName,
                Email = e.Email,
                Department = e.Department != null
                    ? e.Department.Name
                    : "No Department",
                Designation = e.Designation,
                Salary = e.Salary,
                JoiningDate = e.JoiningDate,
                IsActive = e.IsActive
            })
            .ToListAsync();
    }

    public async Task<List<AttendanceReportDto>> GetAttendanceReportAsync(
        DateOnly? fromDate,
        DateOnly? toDate)
    {
        var query = _context.Attendances
            .Include(a => a.Employee)
            .AsQueryable();

        if (fromDate.HasValue)
        {
            query = query.Where(a =>
                a.AttendanceDate >= fromDate.Value);
        }

        if (toDate.HasValue)
        {
            query = query.Where(a =>
                a.AttendanceDate <= toDate.Value);
        }

        return await query
            .Select(a => new AttendanceReportDto
            {
                Id = a.Id,
                EmployeeId = a.EmployeeId,
                EmployeeName =
                    a.Employee.FirstName + " " + a.Employee.LastName,
                AttendanceDate = a.AttendanceDate,
                Status = a.Status,
                WorkingHours = a.WorkingHours,
                Remarks = a.Remarks ?? string.Empty
            })
            .OrderByDescending(a => a.AttendanceDate)
            .ToListAsync();
    }

    public async Task<List<LeaveReportDto>> GetLeaveReportAsync(
        DateOnly? fromDate,
        DateOnly? toDate)
    {
        var query = _context.Leaves
            .Include(l => l.Employee)
            .AsQueryable();

        if (fromDate.HasValue)
        {
            query = query.Where(l =>
                l.FromDate >= fromDate.Value);
        }

        if (toDate.HasValue)
        {
            query = query.Where(l =>
                l.ToDate <= toDate.Value);
        }

        return await query
            .Select(l => new LeaveReportDto
            {
                Id = l.Id,
                EmployeeId = l.EmployeeId,
                EmployeeName =
                    l.Employee.FirstName + " " + l.Employee.LastName,
                LeaveType = l.LeaveType,
                FromDate = l.FromDate,
                ToDate = l.ToDate,
                Reason = l.Reason ?? string.Empty,
                Status = l.Status,
                CreatedAt = l.CreatedAt
            })
            .OrderByDescending(l => l.CreatedAt)
            .ToListAsync();
    }

    public async Task<List<PayrollReportDto>> GetPayrollReportAsync(
        int? month,
        int? year)
    {
        var query = _context.Payrolls
            .Include(p => p.Employee)
            .AsQueryable();

        if (month.HasValue)
        {
            query = query.Where(p =>
                p.Month == month.Value);
        }

        if (year.HasValue)
        {
            query = query.Where(p =>
                p.Year == year.Value);
        }

        return await query
            .Select(p => new PayrollReportDto
            {
                Id = p.Id,
                EmployeeId = p.EmployeeId,
                EmployeeName =
                    p.Employee.FirstName + " " + p.Employee.LastName,
                Month = p.Month,
                Year = p.Year,
                BasicSalary = p.BasicSalary,
                Allowance = p.Allowance,
                Deduction = p.Deduction,
                NetSalary = p.NetSalary,
                PaymentDate = p.PaymentDate
            })
            .OrderByDescending(p => p.PaymentDate)
            .ToListAsync();
    }
}