using SmartOffice.Application.DTOs.Leave;

namespace SmartOffice.Application.Interfaces;

public interface ILeaveService
{
    Task<IEnumerable<LeaveDto>> GetAllAsync();

    Task<LeaveDto?> GetByIdAsync(int id);

    Task<LeaveDto> CreateAsync(
        CreateLeaveDto dto);

    Task<LeaveDto> CreateMyLeaveAsync(
        int userId,
        CreateMyLeaveDto dto);

    Task<LeaveDto?> UpdateAsync(
        int id,
        UpdateLeaveDto dto);

    Task<bool> DeleteAsync(int id);

    Task<LeaveDto?> UpdateStatusAsync(
        int id,
        LeaveStatusDto dto);

    Task<IEnumerable<LeaveDto>> GetMyLeavesAsync(
        int userId);
}