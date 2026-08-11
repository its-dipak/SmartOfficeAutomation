using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartOffice.Application.DTOs.Payroll;
using SmartOffice.Application.Interfaces;

namespace SmartOffice.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PayrollController : ControllerBase
{
    private readonly IPayrollService _service;

    public PayrollController(IPayrollService service)
    {
        _service = service;
    }

    // GET: api/Payroll
    // Admin / HR only
    [Authorize(Roles = "Admin,HR")]
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _service.GetAllAsync());
    }

    // GET: api/Payroll/my
    // Employee can see only their own payroll
    [Authorize(Roles = "Employee")]
    [HttpGet("my")]
    public async Task<IActionResult> GetMyPayroll()
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
            var payroll =
                await _service.GetMyPayrollAsync(userId);

            return Ok(payroll);
        }
        catch (Exception ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
    }

    // GET: api/Payroll/1
    // Admin / HR only
    [Authorize(Roles = "Admin,HR")]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var payroll = await _service.GetByIdAsync(id);

        if (payroll == null)
            return NotFound();

        return Ok(payroll);
    }

    // POST: api/Payroll
    // Admin / HR only
    [Authorize(Roles = "Admin,HR")]
    [HttpPost]
    public async Task<IActionResult> Create(CreatePayrollDto dto)
    {
        var payroll = await _service.CreateAsync(dto);

        return Ok(payroll);
    }

    // PUT: api/Payroll/1
    // Admin / HR only
    [Authorize(Roles = "Admin,HR")]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(
        int id,
        UpdatePayrollDto dto)
    {
        var payroll =
            await _service.UpdateAsync(id, dto);

        if (payroll == null)
            return NotFound();

        return Ok(payroll);
    }

    // DELETE: api/Payroll/1
    // Only Admin can delete payroll
    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted =
            await _service.DeleteAsync(id);

        if (!deleted)
            return NotFound();

        return NoContent();
    }
}