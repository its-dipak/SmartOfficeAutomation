using Microsoft.EntityFrameworkCore;
using SmartOffice.Application.Interfaces;
using SmartOffice.Domain.Entities;
using SmartOffice.Persistence.Context;

namespace SmartOffice.Persistence.Repositories;

public class LeaveRepository : ILeaveRepository
{
    private readonly AppDbContext _context;

    public LeaveRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Leave>> GetAllAsync()
    {
        return await _context.Leaves
            .Include(l => l.Employee)
            .OrderByDescending(l => l.CreatedAt)
            .ToListAsync();
    }

    public async Task<Leave?> GetByIdAsync(int id)
    {
        return await _context.Leaves
            .Include(l => l.Employee)
            .FirstOrDefaultAsync(l => l.Id == id);
    }

    public async Task<Employee?> GetEmployeeAsync(int employeeId)
    {
        return await _context.Employees
            .FirstOrDefaultAsync(e => e.Id == employeeId);
    }

    public async Task AddAsync(Leave leave)
    {
        await _context.Leaves.AddAsync(leave);
    }

    public Task UpdateAsync(Leave leave)
    {
        _context.Leaves.Update(leave);
        return Task.CompletedTask;
    }

    public Task DeleteAsync(Leave leave)
    {
        _context.Leaves.Remove(leave);
        return Task.CompletedTask;
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}