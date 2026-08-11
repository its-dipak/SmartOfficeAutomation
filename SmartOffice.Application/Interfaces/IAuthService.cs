using SmartOffice.Application.DTOs.Auth;

namespace SmartOffice.Application.Interfaces;

public interface IAuthService
{
    Task<bool> RegisterAsync(RegisterDto dto);

    Task<string?> LoginAsync(LoginDto dto);
}