using BCrypt.Net;
using SmartOffice.Application.DTOs.Auth;
using SmartOffice.Application.Interfaces;
using SmartOffice.Domain.Entities;

namespace SmartOffice.Application.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IJwtTokenService _jwtTokenService;

    public AuthService(
        IUserRepository userRepository,
        IJwtTokenService jwtTokenService)
    {
        _userRepository = userRepository;
        _jwtTokenService = jwtTokenService;
    }

    public async Task<bool> RegisterAsync(RegisterDto dto)
    {
        var existingUser =
            await _userRepository.GetByUsernameAsync(dto.Username);

        if (existingUser != null)
        {
            return false;
        }

        var role =
            await _userRepository.GetRoleByIdAsync(dto.RoleId);

        if (role == null)
        {
            return false;
        }

        var user = new User
        {
            Username = dto.Username,
            Email = dto.Email,
            PasswordHash =
                BCrypt.Net.BCrypt.HashPassword(dto.Password),
            RoleId = dto.RoleId
        };

        await _userRepository.AddAsync(user);

        return true;
    }

    public async Task<string?> LoginAsync(LoginDto dto)
    {
        var user =
            await _userRepository.GetByUsernameAsync(dto.Username);

        if (user == null)
        {
            return null;
        }

        var passwordValid =
            BCrypt.Net.BCrypt.Verify(
                dto.Password,
                user.PasswordHash);

        if (!passwordValid)
        {
            return null;
        }

        return _jwtTokenService.GenerateToken(user);
    }
}