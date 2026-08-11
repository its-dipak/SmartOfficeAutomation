using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartOffice.Application.DTOs.Department;
using SmartOffice.Application.Interfaces;

namespace SmartOffice.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin,HR")]
public class DepartmentController : ControllerBase
{
    private readonly IDepartmentService _departmentService;

    public DepartmentController(IDepartmentService departmentService)
    {
        _departmentService = departmentService;
    }

    // GET: api/department
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var departments = await _departmentService.GetAllAsync();

        return Ok(departments);
    }

    // GET: api/department/5
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var department = await _departmentService.GetByIdAsync(id);

        if (department == null)
            return NotFound();

        return Ok(department);
    }

    // POST: api/department
    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] CreateDepartmentDto dto)
    {
        var department = await _departmentService.CreateAsync(dto);

        return CreatedAtAction(
            nameof(GetById),
            new { id = department.Id },
            department);
    }

    // PUT: api/department/5
    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(
        int id,
        [FromBody] UpdateDepartmentDto dto)
    {
        if (id != dto.Id)
            return BadRequest();

        var updated = await _departmentService.UpdateAsync(dto);

        if (!updated)
            return NotFound();

        return NoContent();
    }

    // DELETE: api/department/5
    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _departmentService.DeleteAsync(id);

        if (!deleted)
            return NotFound();

        return NoContent();
    }
}