using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartOffice.Application.DTOs.Attendance;
using SmartOffice.Application.Interfaces;

namespace SmartOffice.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AttendanceController : ControllerBase
{
    private readonly IAttendanceService _attendanceService;

    public AttendanceController(
        IAttendanceService attendanceService)
    {
        _attendanceService = attendanceService;
    }

    // GET: api/Attendance
    // Admin / HR only
    [Authorize(Roles = "Admin,HR")]
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var attendance =
            await _attendanceService.GetAllAsync();

        return Ok(attendance);
    }

    // GET: api/Attendance/my
    // Employee: view only their own attendance
    [Authorize(Roles = "Employee")]
    [HttpGet("my")]
    public async Task<IActionResult> GetMyAttendance()
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
            var attendance =
                await _attendanceService
                    .GetMyAttendanceAsync(userId);

            return Ok(attendance);
        }
        catch (Exception ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
    }

    // GET: api/Attendance/employee/1
    // Admin / HR only
    [Authorize(Roles = "Admin,HR")]
    [HttpGet("employee/{employeeId}")]
    public async Task<IActionResult> GetEmployeeAttendance(
        int employeeId)
    {
        var attendance =
            await _attendanceService
                .GetEmployeeAttendanceAsync(employeeId);

        return Ok(attendance);
    }

    // POST: api/Attendance/checkin
    // Admin / HR: check in any employee
    [Authorize(Roles = "Admin,HR")]
    [HttpPost("checkin")]
    public async Task<IActionResult> CheckIn(
        CreateAttendanceDto dto)
    {
        try
        {
            var result =
                await _attendanceService.CheckInAsync(dto);

            return Ok(result);
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

    // POST: api/Attendance/checkout
    // Admin / HR: check out any employee
    [Authorize(Roles = "Admin,HR")]
    [HttpPost("checkout")]
    public async Task<IActionResult> CheckOut(
        CheckOutDto dto)
    {
        try
        {
            var result =
                await _attendanceService.CheckOutAsync(dto);

            return Ok(result);
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

    // POST: api/Attendance/my/checkin
    // Employee: check in themselves
    [Authorize(Roles = "Employee")]
    [HttpPost("my/checkin")]
    public async Task<IActionResult> MyCheckIn(
        [FromBody] MyAttendanceActionDto dto)
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
            var result =
                await _attendanceService
                    .MyCheckInAsync(userId, dto.Remarks);

            return Ok(result);
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

    // POST: api/Attendance/my/checkout
    // Employee: check out themselves
    [Authorize(Roles = "Employee")]
    [HttpPost("my/checkout")]
    public async Task<IActionResult> MyCheckOut(
        [FromBody] MyAttendanceActionDto dto)
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
            var result =
                await _attendanceService
                    .MyCheckOutAsync(userId, dto.Remarks);

            return Ok(result);
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
}