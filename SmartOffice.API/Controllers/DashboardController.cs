using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartOffice.Application.Interfaces;

namespace SmartOffice.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _dashboardService;

    public DashboardController(
        IDashboardService dashboardService)
    {
        _dashboardService = dashboardService;
    }

    // GET: api/Dashboard/summary
    // Admin / HR only
    [Authorize(Roles = "Admin,HR")]
    [HttpGet("summary")]
    public async Task<IActionResult> GetSummary()
    {
        var summary =
            await _dashboardService.GetSummaryAsync();

        return Ok(summary);
    }

    // GET: api/Dashboard/analytics
    // Admin / HR only
    [Authorize(Roles = "Admin,HR")]
    [HttpGet("analytics")]
    public async Task<IActionResult> GetAnalytics()
    {
        var analytics =
            await _dashboardService.GetAnalyticsAsync();

        return Ok(analytics);
    }

    // GET: api/Dashboard/my
    // Employee only
    [Authorize(Roles = "Employee")]
    [HttpGet("my")]
    public async Task<IActionResult> GetMyDashboard()
    {
        var userIdClaim =
            User.FindFirstValue(
                ClaimTypes.NameIdentifier);

        if (!int.TryParse(
                userIdClaim,
                out var userId))
        {
            return Unauthorized(new
            {
                message = "Invalid user identity."
            });
        }

        try
        {
            var dashboard =
                await _dashboardService
                    .GetMyDashboardAsync(userId);

            return Ok(dashboard);
        }
        catch (Exception ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
    }
}