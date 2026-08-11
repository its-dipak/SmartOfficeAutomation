using SmartOffice.Application.DTOs.Payroll;

namespace SmartOffice.Application.Interfaces;

public interface IPayrollService
{
    Task<IEnumerable<PayrollDto>> GetAllAsync();

    Task<PayrollDto?> GetByIdAsync(int id);

    Task<PayrollDto> CreateAsync(CreatePayrollDto dto);

    Task<PayrollDto?> UpdateAsync(
        int id,
        UpdatePayrollDto dto);

    Task<bool> DeleteAsync(int id);

    Task<IEnumerable<PayrollDto>> GetMyPayrollAsync(int userId);
}