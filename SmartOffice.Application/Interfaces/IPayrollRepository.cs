using SmartOffice.Domain.Entities;

namespace SmartOffice.Application.Interfaces;

public interface IPayrollRepository
{
    Task<IEnumerable<Payroll>> GetAllAsync();

    Task<Payroll?> GetByIdAsync(int id);

    Task<Employee?> GetEmployeeAsync(int employeeId);

    Task AddAsync(Payroll payroll);

    Task UpdateAsync(Payroll payroll);

    Task DeleteAsync(Payroll payroll);

    Task SaveChangesAsync();
}