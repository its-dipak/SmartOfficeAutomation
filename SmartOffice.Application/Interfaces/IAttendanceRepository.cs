using SmartOffice.Domain.Entities;

namespace SmartOffice.Application.Interfaces;

public interface IAttendanceRepository
{
    Task<Attendance?> GetTodayAttendanceAsync(int employeeId);

    Task<IEnumerable<Attendance>> GetAllAsync();

    Task<IEnumerable<Attendance>> GetEmployeeAttendanceAsync(int employeeId);

    Task<Attendance?> GetByIdAsync(int id);

    Task<Employee?> GetEmployeeAsync(int employeeId);

    Task AddAsync(Attendance attendance);

    Task UpdateAsync(Attendance attendance);

    Task SaveChangesAsync();
}