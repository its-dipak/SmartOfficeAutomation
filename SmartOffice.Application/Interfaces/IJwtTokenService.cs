using SmartOffice.Domain.Entities;

namespace SmartOffice.Application.Interfaces;

public interface IJwtTokenService
{
    string GenerateToken(User user);
}