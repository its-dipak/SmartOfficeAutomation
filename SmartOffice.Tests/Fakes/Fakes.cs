using SmartOffice.Application.Interfaces;
using SmartOffice.Domain.Entities;

namespace SmartOffice.Tests.Fakes;

/// <summary>Clock that always reports the time it is told to (UTC == local).</summary>
public sealed class FakeTimeProvider : TimeProvider
{
    private DateTimeOffset _now;

    public FakeTimeProvider(DateTimeOffset now) => _now = now;

    public void Set(DateTimeOffset now) => _now = now;

    public override DateTimeOffset GetUtcNow() => _now;

    public override TimeZoneInfo LocalTimeZone => TimeZoneInfo.Utc;
}

public sealed class FakeUserRepository : IUserRepository
{
    public Dictionary<int, int> EmployeeIdByUserId { get; } = new();

    public Task<int?> GetEmployeeIdByUserIdAsync(int userId) =>
        Task.FromResult(
            EmployeeIdByUserId.TryGetValue(userId, out var id)
                ? (int?)id
                : null);

    public Task<User?> GetByUsernameAsync(string username) => Task.FromResult<User?>(null);
    public Task<User?> GetByEmailAsync(string email) => Task.FromResult<User?>(null);
    public Task AddAsync(User user) => Task.CompletedTask;
    public Task<Role?> GetRoleByIdAsync(int roleId) => Task.FromResult<Role?>(null);
}

public sealed class FakeAttendanceRepository : IAttendanceRepository
{
    private int _nextId = 1;

    public List<Employee> Employees { get; } = new();
    public List<Attendance> Records { get; } = new();
    public int SaveCount { get; private set; }

    public DateOnly Today { get; set; }

    public Task<Employee?> GetEmployeeAsync(int employeeId) =>
        Task.FromResult(Employees.FirstOrDefault(e => e.Id == employeeId));

    public Task<Attendance?> GetTodayAttendanceAsync(int employeeId) =>
        Task.FromResult(Records.FirstOrDefault(a =>
            a.EmployeeId == employeeId && a.AttendanceDate == Today));

    public Task<Attendance?> GetByIdAsync(int id) =>
        Task.FromResult(Records.FirstOrDefault(a => a.Id == id));

    public Task<IEnumerable<Attendance>> GetAllAsync() =>
        Task.FromResult<IEnumerable<Attendance>>(Records.ToList());

    public Task<IEnumerable<Attendance>> GetEmployeeAttendanceAsync(int employeeId) =>
        Task.FromResult<IEnumerable<Attendance>>(
            Records.Where(a => a.EmployeeId == employeeId).ToList());

    public Task AddAsync(Attendance attendance)
    {
        attendance.Id = _nextId++;
        Records.Add(attendance);
        return Task.CompletedTask;
    }

    public Task UpdateAsync(Attendance attendance) => Task.CompletedTask;

    public Task SaveChangesAsync()
    {
        SaveCount++;
        return Task.CompletedTask;
    }
}

public sealed class FakeLeaveRepository : ILeaveRepository
{
    private int _nextId = 1;

    public List<Employee> Employees { get; } = new();
    public List<Leave> Records { get; } = new();
    public int SaveCount { get; private set; }

    public Task<Employee?> GetEmployeeAsync(int employeeId) =>
        Task.FromResult(Employees.FirstOrDefault(e => e.Id == employeeId));

    public Task<IEnumerable<Leave>> GetAllAsync() =>
        Task.FromResult<IEnumerable<Leave>>(Records.ToList());

    public Task<Leave?> GetByIdAsync(int id) =>
        Task.FromResult(Records.FirstOrDefault(l => l.Id == id));

    public Task AddAsync(Leave leave)
    {
        leave.Id = _nextId++;
        Records.Add(leave);
        return Task.CompletedTask;
    }

    public Task UpdateAsync(Leave leave) => Task.CompletedTask;

    public Task DeleteAsync(Leave leave)
    {
        Records.Remove(leave);
        return Task.CompletedTask;
    }

    public Task SaveChangesAsync()
    {
        SaveCount++;
        return Task.CompletedTask;
    }
}

public sealed class FakePayrollRepository : IPayrollRepository
{
    private int _nextId = 1;

    public List<Employee> Employees { get; } = new();
    public List<Payroll> Records { get; } = new();
    public int SaveCount { get; private set; }

    public Task<Employee?> GetEmployeeAsync(int employeeId) =>
        Task.FromResult(Employees.FirstOrDefault(e => e.Id == employeeId));

    public Task<IEnumerable<Payroll>> GetAllAsync() =>
        Task.FromResult<IEnumerable<Payroll>>(Records.ToList());

    public Task<Payroll?> GetByIdAsync(int id) =>
        Task.FromResult(Records.FirstOrDefault(p => p.Id == id));

    public Task AddAsync(Payroll payroll)
    {
        payroll.Id = _nextId++;
        Records.Add(payroll);
        return Task.CompletedTask;
    }

    public Task UpdateAsync(Payroll payroll) => Task.CompletedTask;

    public Task DeleteAsync(Payroll payroll)
    {
        Records.Remove(payroll);
        return Task.CompletedTask;
    }

    public Task SaveChangesAsync()
    {
        SaveCount++;
        return Task.CompletedTask;
    }
}
