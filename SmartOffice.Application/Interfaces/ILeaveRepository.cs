using SmartOffice.Domain.Entities;

namespace SmartOffice.Application.Interfaces;

public interface ILeaveRepository
{
    Task<IEnumerable<Leave>> GetAllAsync();

    Task<Leave?> GetByIdAsync(int id);

    Task<Employee?> GetEmployeeAsync(int employeeId);

    Task AddAsync(Leave leave);

    Task UpdateAsync(Leave leave);

    Task DeleteAsync(Leave leave);

    Task SaveChangesAsync();
}