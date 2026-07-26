using SmartOffice.Application.DTOs.Employee;

namespace SmartOffice.Application.Interfaces;

public interface IEmployeeService
{
    Task<IEnumerable<EmployeeDto>> GetAllAsync();

    Task<EmployeeDto?> GetByIdAsync(int id);

    Task<EmployeeDto> CreateAsync(CreateEmployeeDto dto);

    Task<bool> UpdateAsync(UpdateEmployeeDto dto);

    Task<bool> DeleteAsync(int id);
}