using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartOffice.Application.DTOs.Leave;
using SmartOffice.Application.Interfaces;

namespace SmartOffice.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class LeaveController : ControllerBase
{
    private readonly ILeaveService _service;

    public LeaveController(ILeaveService service)
    {
        _service = service;
    }

    // GET: api/Leave
    // Admin / HR only
    [Authorize(Roles = "Admin,HR")]
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var leaves = await _service.GetAllAsync();

        return Ok(leaves);
    }

    // GET: api/Leave/my
    // Employee: view only their own leave records
    [Authorize(Roles = "Employee")]
    [HttpGet("my")]
    public async Task<IActionResult> GetMyLeaves()
    {
        var userIdClaim =
            User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new
            {
                message = "Invalid user identity."
            });
        }

        try
        {
            var leaves =
                await _service.GetMyLeavesAsync(userId);

            return Ok(leaves);
        }
        catch (Exception ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
    }

    // GET: api/Leave/{id}
    // Admin / HR only
    [Authorize(Roles = "Admin,HR")]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var leave =
            await _service.GetByIdAsync(id);

        if (leave == null)
        {
            return NotFound();
        }

        return Ok(leave);
    }

    // POST: api/Leave
    // Admin / HR: create leave for any employee
    [Authorize(Roles = "Admin,HR")]
    [HttpPost]
    public async Task<IActionResult> Create(
        CreateLeaveDto dto)
    {
        try
        {
            var leave =
                await _service.CreateAsync(dto);

            return Ok(leave);
        }
        catch (Exception ex)
        {
            return BadRequest(new
            {
                success = false,
                message = ex.Message
            });
        }
    }

    // POST: api/Leave/my
    // Employee: create leave for themselves
    [Authorize(Roles = "Employee")]
    [HttpPost("my")]
    public async Task<IActionResult> CreateMyLeave(
        CreateMyLeaveDto dto)
    {
        var userIdClaim =
            User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new
            {
                message = "Invalid user identity."
            });
        }

        try
        {
            var leave =
                await _service.CreateMyLeaveAsync(
                    userId,
                    dto);

            return Ok(leave);
        }
        catch (Exception ex)
        {
            return BadRequest(new
            {
                success = false,
                message = ex.Message
            });
        }
    }

    // PUT: api/Leave/{id}
    // Admin / HR only
    [Authorize(Roles = "Admin,HR")]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(
        int id,
        UpdateLeaveDto dto)
    {
        var leave =
            await _service.UpdateAsync(id, dto);

        if (leave == null)
        {
            return NotFound();
        }

        return Ok(leave);
    }

    // PATCH: api/Leave/{id}/status
    // Admin / HR only
    [Authorize(Roles = "Admin,HR")]
    [HttpPatch("{id}/status")]
    public async Task<IActionResult> UpdateStatus(
        int id,
        LeaveStatusDto dto)
    {
        var leave =
            await _service.UpdateStatusAsync(id, dto);

        if (leave == null)
        {
            return NotFound();
        }

        return Ok(leave);
    }

    // DELETE: api/Leave/{id}
    // Admin / HR only
    [Authorize(Roles = "Admin,HR")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted =
            await _service.DeleteAsync(id);

        if (!deleted)
        {
            return NotFound();
        }

        return NoContent();
    }
}