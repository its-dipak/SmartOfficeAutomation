using SmartOffice.Application.DTOs.Dashboard;

namespace SmartOffice.Application.Interfaces;

public interface IDashboardRepository
{
    Task<DashboardSummaryDto> GetSummaryAsync();

    Task<DashboardAnalyticsDto> GetAnalyticsAsync();

    Task<EmployeeDashboardDto> GetMyDashboardAsync(int employeeId);
}