using SmartOffice.Application.DTOs.Dashboard;
using SmartOffice.Application.Interfaces;

namespace SmartOffice.Application.Services;

public class DashboardService : IDashboardService
{
    private readonly IDashboardRepository _repository;
    private readonly IUserRepository _userRepository;

    public DashboardService(
        IDashboardRepository repository,
        IUserRepository userRepository)
    {
        _repository = repository;
        _userRepository = userRepository;
    }

    public async Task<DashboardSummaryDto> GetSummaryAsync()
    {
        return await _repository.GetSummaryAsync();
    }

    public async Task<DashboardAnalyticsDto> GetAnalyticsAsync()
    {
        return await _repository.GetAnalyticsAsync();
    }

    public async Task<EmployeeDashboardDto> GetMyDashboardAsync(
        int userId)
    {
        var employeeId =
            await _userRepository.GetEmployeeIdByUserIdAsync(userId);

        if (employeeId == null)
        {
            throw new Exception(
                "Employee profile is not linked to this user.");
        }

        return await _repository.GetMyDashboardAsync(
            employeeId.Value);
    }
}