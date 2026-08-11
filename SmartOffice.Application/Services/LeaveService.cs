using SmartOffice.Application.DTOs.Leave;
using SmartOffice.Application.Interfaces;
using SmartOffice.Domain.Entities;

namespace SmartOffice.Application.Services;

public class LeaveService : ILeaveService
{
    private readonly ILeaveRepository _repository;
    private readonly IUserRepository _userRepository;

    public LeaveService(
        ILeaveRepository repository,
        IUserRepository userRepository)
    {
        _repository = repository;
        _userRepository = userRepository;
    }

    private static LeaveDto Map(Leave leave)
    {
        return new LeaveDto
        {
            Id = leave.Id,
            EmployeeId = leave.EmployeeId,
            EmployeeName = leave.Employee == null
                ? string.Empty
                : $"{leave.Employee.FirstName} {leave.Employee.LastName}",
            LeaveType = leave.LeaveType,
            FromDate = leave.FromDate,
            ToDate = leave.ToDate,
            Reason = leave.Reason,
            Status = leave.Status
        };
    }

    // Admin / HR: Get all leave records
    public async Task<IEnumerable<LeaveDto>> GetAllAsync()
    {
        var leaves = await _repository.GetAllAsync();

        return leaves.Select(Map);
    }

    // Admin / HR: Get a specific leave record
    public async Task<LeaveDto?> GetByIdAsync(int id)
    {
        var leave = await _repository.GetByIdAsync(id);

        return leave == null
            ? null
            : Map(leave);
    }

    // Employee: Get only their own leave records
    public async Task<IEnumerable<LeaveDto>> GetMyLeavesAsync(
        int userId)
    {
        var employeeId =
            await _userRepository.GetEmployeeIdByUserIdAsync(userId);

        if (employeeId == null)
        {
            throw new Exception(
                "Employee profile is not linked to this user.");
        }

        var leaves =
            await _repository.GetAllAsync();

        return leaves
            .Where(l => l.EmployeeId == employeeId.Value)
            .Select(Map);
    }

    // Admin / HR: Create leave for any employee
    public async Task<LeaveDto> CreateAsync(
        CreateLeaveDto dto)
    {
        var employee =
            await _repository.GetEmployeeAsync(dto.EmployeeId);

        if (employee == null)
        {
            throw new Exception("Employee not found.");
        }

        var leave = new Leave
        {
            EmployeeId = dto.EmployeeId,
            Employee = employee,
            LeaveType = dto.LeaveType,
            FromDate = dto.FromDate,
            ToDate = dto.ToDate,
            Reason = dto.Reason,
            Status = "Pending"
        };

        await _repository.AddAsync(leave);
        await _repository.SaveChangesAsync();

        return Map(leave);
    }

    // Employee: Create leave for themselves
    public async Task<LeaveDto> CreateMyLeaveAsync(
        int userId,
        CreateMyLeaveDto dto)
    {
        var employeeId =
            await _userRepository.GetEmployeeIdByUserIdAsync(userId);

        if (employeeId == null)
        {
            throw new Exception(
                "Employee profile is not linked to this user.");
        }

        var employee =
            await _repository.GetEmployeeAsync(employeeId.Value);

        if (employee == null)
        {
            throw new Exception("Employee profile not found.");
        }

        if (dto.FromDate > dto.ToDate)
        {
            throw new Exception(
                "From date cannot be later than to date.");
        }

        var leave = new Leave
        {
            EmployeeId = employeeId.Value,
            Employee = employee,
            LeaveType = dto.LeaveType,
            FromDate = dto.FromDate,
            ToDate = dto.ToDate,
            Reason = dto.Reason,
            Status = "Pending"
        };

        await _repository.AddAsync(leave);
        await _repository.SaveChangesAsync();

        return Map(leave);
    }

    // Admin / HR: Update leave
    public async Task<LeaveDto?> UpdateAsync(
        int id,
        UpdateLeaveDto dto)
    {
        var leave =
            await _repository.GetByIdAsync(id);

        if (leave == null)
        {
            return null;
        }

        leave.LeaveType = dto.LeaveType;
        leave.FromDate = dto.FromDate;
        leave.ToDate = dto.ToDate;
        leave.Reason = dto.Reason;
        leave.Status = dto.Status;

        await _repository.UpdateAsync(leave);
        await _repository.SaveChangesAsync();

        return Map(leave);
    }

    // Admin / HR: Delete leave
    public async Task<bool> DeleteAsync(int id)
    {
        var leave =
            await _repository.GetByIdAsync(id);

        if (leave == null)
        {
            return false;
        }

        await _repository.DeleteAsync(leave);
        await _repository.SaveChangesAsync();

        return true;
    }

    // Admin / HR: Approve / Reject leave
    public async Task<LeaveDto?> UpdateStatusAsync(
        int id,
        LeaveStatusDto dto)
    {
        var leave =
            await _repository.GetByIdAsync(id);

        if (leave == null)
        {
            return null;
        }

        leave.Status = dto.Status;

        await _repository.UpdateAsync(leave);
        await _repository.SaveChangesAsync();

        return Map(leave);
    }
}