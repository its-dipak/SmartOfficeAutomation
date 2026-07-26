using SmartOffice.Application.DTOs.Employee;
using SmartOffice.Application.Interfaces;
using SmartOffice.Domain.Entities;

namespace SmartOffice.Application.Services;

public class EmployeeService : IEmployeeService
{
    private readonly IEmployeeRepository _repository;

    public EmployeeService(IEmployeeRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<EmployeeDto>> GetAllAsync()
    {
        var employees = await _repository.GetAllAsync();

        return employees.Select(e => new EmployeeDto
        {
            Id = e.Id,
            EmployeeCode = e.EmployeeCode,
            FirstName = e.FirstName,
            LastName = e.LastName,
            Email = e.Email,
            Phone = e.Phone,
            Designation = e.Designation,
            Salary = e.Salary,
            JoiningDate = e.JoiningDate,
            IsActive = e.IsActive,
            DepartmentId = e.DepartmentId,
            DepartmentName = e.Department?.Name ?? string.Empty
        });
    }

    public async Task<EmployeeDto?> GetByIdAsync(int id)
    {
        var e = await _repository.GetByIdAsync(id);

        if (e == null)
            return null;

        return new EmployeeDto
        {
            Id = e.Id,
            EmployeeCode = e.EmployeeCode,
            FirstName = e.FirstName,
            LastName = e.LastName,
            Email = e.Email,
            Phone = e.Phone,
            Designation = e.Designation,
            Salary = e.Salary,
            JoiningDate = e.JoiningDate,
            IsActive = e.IsActive,
            DepartmentId = e.DepartmentId,
            DepartmentName = e.Department?.Name ?? string.Empty
        };
    }

    public async Task<EmployeeDto> CreateAsync(CreateEmployeeDto dto)
    {
        var employee = new Employee
        {
            EmployeeCode = dto.EmployeeCode,
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Email = dto.Email,
            Phone = dto.Phone,
            Designation = dto.Designation,
            Salary = dto.Salary,
            JoiningDate = dto.JoiningDate,
            DepartmentId = dto.DepartmentId,
            IsActive = true
        };

        await _repository.AddAsync(employee);

        return await GetByIdAsync(employee.Id)
               ?? throw new Exception("Employee creation failed.");
    }

    public async Task<bool> UpdateAsync(UpdateEmployeeDto dto)
    {
        var employee = await _repository.GetByIdAsync(dto.Id);

        if (employee == null)
            return false;

        employee.EmployeeCode = dto.EmployeeCode;
        employee.FirstName = dto.FirstName;
        employee.LastName = dto.LastName;
        employee.Email = dto.Email;
        employee.Phone = dto.Phone;
        employee.Designation = dto.Designation;
        employee.Salary = dto.Salary;
        employee.JoiningDate = dto.JoiningDate;
        employee.DepartmentId = dto.DepartmentId;
        employee.IsActive = dto.IsActive;

        await _repository.UpdateAsync(employee);

        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var employee = await _repository.GetByIdAsync(id);

        if (employee == null)
            return false;

        await _repository.DeleteAsync(employee);

        return true;
    }
}