using SmartOffice.Domain.Entities;

namespace SmartOffice.Application.Interfaces;

public interface IUserRepository
{
    Task<User?> GetByUsernameAsync(string username);

    Task<User?> GetByEmailAsync(string email);

    Task AddAsync(User user);

    Task<Role?> GetRoleByIdAsync(int roleId);

    Task<int?> GetEmployeeIdByUserIdAsync(int userId);
}