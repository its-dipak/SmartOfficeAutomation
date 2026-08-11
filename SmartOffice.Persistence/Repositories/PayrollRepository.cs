using Microsoft.EntityFrameworkCore;
using SmartOffice.Application.Interfaces;
using SmartOffice.Domain.Entities;
using SmartOffice.Persistence.Context;

namespace SmartOffice.Persistence.Repositories;

public class PayrollRepository : IPayrollRepository
{
    private readonly AppDbContext _context;

    public PayrollRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Payroll>> GetAllAsync()
    {
        return await _context.Payrolls
            .Include(p => p.Employee)
            .OrderByDescending(p => p.Year)
            .ThenByDescending(p => p.Month)
            .ToListAsync();
    }

    public async Task<Payroll?> GetByIdAsync(int id)
    {
        return await _context.Payrolls
            .Include(p => p.Employee)
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<Employee?> GetEmployeeAsync(int employeeId)
    {
        return await _context.Employees
            .FirstOrDefaultAsync(e => e.Id == employeeId);
    }

    public async Task AddAsync(Payroll payroll)
    {
        await _context.Payrolls.AddAsync(payroll);
    }

    public Task UpdateAsync(Payroll payroll)
    {
        _context.Payrolls.Update(payroll);
        return Task.CompletedTask;
    }

    public Task DeleteAsync(Payroll payroll)
    {
        _context.Payrolls.Remove(payroll);
        return Task.CompletedTask;
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}