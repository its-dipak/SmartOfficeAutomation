using SmartOffice.Application.DTOs.Payroll;
using SmartOffice.Application.Exceptions;
using SmartOffice.Application.Interfaces;
using SmartOffice.Domain.Entities;

namespace SmartOffice.Application.Services;

public class PayrollService : IPayrollService
{
    private readonly IPayrollRepository _repository;
    private readonly IUserRepository _userRepository;

    public PayrollService(
        IPayrollRepository repository,
        IUserRepository userRepository)
    {
        _repository = repository;
        _userRepository = userRepository;
    }

    private static PayrollDto Map(Payroll payroll)
    {
        return new PayrollDto
        {
            Id = payroll.Id,
            EmployeeId = payroll.EmployeeId,
            EmployeeName = payroll.Employee == null
                ? string.Empty
                : $"{payroll.Employee.FirstName} {payroll.Employee.LastName}",
            Month = payroll.Month,
            Year = payroll.Year,
            BasicSalary = payroll.BasicSalary,
            Allowance = payroll.Allowance,
            Deduction = payroll.Deduction,
            NetSalary = payroll.NetSalary,
            PaymentDate = payroll.PaymentDate
        };
    }

    // Admin / HR: Get all payroll records
    public async Task<IEnumerable<PayrollDto>> GetAllAsync()
    {
        var payrolls = await _repository.GetAllAsync();

        return payrolls.Select(Map);
    }

    // Admin / HR: Get a specific payroll record
    public async Task<PayrollDto?> GetByIdAsync(int id)
    {
        var payroll = await _repository.GetByIdAsync(id);

        return payroll == null
            ? null
            : Map(payroll);
    }

    // Employee: Get only their own payroll records
    public async Task<IEnumerable<PayrollDto>> GetMyPayrollAsync(
        int userId)
    {
        var employeeId =
            await _userRepository.GetEmployeeIdByUserIdAsync(userId);

        if (employeeId == null)
        {
            throw new NotFoundException(
                "Employee profile is not linked to this user.");
        }

        var payrolls =
            await _repository.GetAllAsync();

        return payrolls
            .Where(p => p.EmployeeId == employeeId.Value)
            .Select(Map);
    }

    // Admin / HR: Create payroll
    public async Task<PayrollDto> CreateAsync(
        CreatePayrollDto dto)
    {
        var employee =
            await _repository.GetEmployeeAsync(dto.EmployeeId);

        if (employee == null)
        {
            throw new NotFoundException("Employee not found.");
        }

        ValidateAmounts(
            dto.Month, dto.BasicSalary, dto.Allowance, dto.Deduction);

        var payroll = new Payroll
        {
            EmployeeId = dto.EmployeeId,
            Employee = employee,
            Month = dto.Month,
            Year = dto.Year,
            BasicSalary = dto.BasicSalary,
            Allowance = dto.Allowance,
            Deduction = dto.Deduction,
            NetSalary =
                dto.BasicSalary +
                dto.Allowance -
                dto.Deduction,
            PaymentDate = dto.PaymentDate
        };

        await _repository.AddAsync(payroll);
        await _repository.SaveChangesAsync();

        return Map(payroll);
    }

    // Admin / HR: Update payroll
    public async Task<PayrollDto?> UpdateAsync(
        int id,
        UpdatePayrollDto dto)
    {
        var payroll =
            await _repository.GetByIdAsync(id);

        if (payroll == null)
        {
            return null;
        }

        ValidateAmounts(
            dto.Month, dto.BasicSalary, dto.Allowance, dto.Deduction);

        payroll.Month = dto.Month;
        payroll.Year = dto.Year;
        payroll.BasicSalary = dto.BasicSalary;
        payroll.Allowance = dto.Allowance;
        payroll.Deduction = dto.Deduction;

        payroll.NetSalary =
            dto.BasicSalary +
            dto.Allowance -
            dto.Deduction;

        payroll.PaymentDate = dto.PaymentDate;

        await _repository.UpdateAsync(payroll);
        await _repository.SaveChangesAsync();

        return Map(payroll);
    }

    // Admin: Delete payroll
    public async Task<bool> DeleteAsync(int id)
    {
        var payroll =
            await _repository.GetByIdAsync(id);

        if (payroll == null)
        {
            return false;
        }

        await _repository.DeleteAsync(payroll);
        await _repository.SaveChangesAsync();

        return true;
    }

    private static void ValidateAmounts(
        int month,
        decimal basicSalary,
        decimal allowance,
        decimal deduction)
    {
        if (month < 1 || month > 12)
        {
            throw new BusinessRuleException(
                "Month must be between 1 and 12.");
        }

        if (basicSalary < 0 || allowance < 0 || deduction < 0)
        {
            throw new BusinessRuleException(
                "Salary, allowance and deduction cannot be negative.");
        }

        if (deduction > basicSalary + allowance)
        {
            throw new BusinessRuleException(
                "Deduction cannot exceed basic salary plus allowance.");
        }
    }
}