using Microsoft.EntityFrameworkCore;
using SmartOffice.Application.Interfaces;
using SmartOffice.Domain.Entities;
using SmartOffice.Persistence.Context;

namespace SmartOffice.Persistence.Repositories;

public class AttendanceRepository : IAttendanceRepository
{
    private readonly AppDbContext _context;

    public AttendanceRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Attendance>> GetAllAsync()
    {
        return await _context.Attendances
            .Include(a => a.Employee)
            .ToListAsync();
    }

    public async Task<Attendance?> GetByIdAsync(int id)
    {
        return await _context.Attendances
            .Include(a => a.Employee)
            .FirstOrDefaultAsync(a => a.Id == id);
    }

    public async Task<IEnumerable<Attendance>> GetEmployeeAttendanceAsync(int employeeId)
    {
        return await _context.Attendances
            .Where(a => a.EmployeeId == employeeId)
            .OrderByDescending(a => a.AttendanceDate)
            .ToListAsync();
    }

    public async Task<Attendance?> GetTodayAttendanceAsync(int employeeId)
    {
        var today = DateOnly.FromDateTime(DateTime.Today);

        return await _context.Attendances
            .FirstOrDefaultAsync(a =>
                a.EmployeeId == employeeId &&
                a.AttendanceDate == today);
    }

    public async Task<Employee?> GetEmployeeAsync(int employeeId)
    {
        return await _context.Employees
            .Include(e => e.Department)
            .FirstOrDefaultAsync(e => e.Id == employeeId);
    }

    public async Task AddAsync(Attendance attendance)
    {
        await _context.Attendances.AddAsync(attendance);
    }

    public Task UpdateAsync(Attendance attendance)
    {
        _context.Attendances.Update(attendance);
        return Task.CompletedTask;
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}