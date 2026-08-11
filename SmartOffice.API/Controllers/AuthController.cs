using Microsoft.AspNetCore.Mvc;
using SmartOffice.Application.DTOs.Auth;
using SmartOffice.Application.Interfaces;

namespace SmartOffice.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        var result = await _authService.RegisterAsync(dto);

        if (!result)
        {
            return BadRequest(new
            {
                Success = false,
                Message = "Registration failed. Username may already exist or the selected role is invalid."
            });
        }

        return Ok(new
        {
            Success = true,
            Message = "User registered successfully."
        });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        var token = await _authService.LoginAsync(dto);

        if (string.IsNullOrWhiteSpace(token))
        {
            return Unauthorized(new
            {
                Success = false,
                Message = "Invalid username or password."
            });
        }

        return Ok(new
        {
            Success = true,
            Token = token
        });
    }
}