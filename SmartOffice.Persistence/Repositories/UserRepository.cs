using Microsoft.EntityFrameworkCore;
using SmartOffice.Application.Interfaces;
using SmartOffice.Domain.Entities;
using SmartOffice.Persistence.Context;

namespace SmartOffice.Persistence.Repositories;

public class UserRepository : IUserRepository
{
    private readonly AppDbContext _context;

    public UserRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<User?> GetByUsernameAsync(string username)
    {
        return await _context.Users
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.Username == username);
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        return await _context.Users
            .FirstOrDefaultAsync(u => u.Email == email);
    }

    public async Task<Role?> GetRoleByIdAsync(int roleId)
    {
        return await _context.Roles
            .FirstOrDefaultAsync(r => r.Id == roleId);
    }

    public async Task AddAsync(User user)
    {
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
    }

    public async Task<int?> GetEmployeeIdByUserIdAsync(int userId)
    {
        return await _context.Employees
            .Where(e => e.UserId == userId)
            .Select(e => (int?)e.Id)
            .FirstOrDefaultAsync();
    }
}