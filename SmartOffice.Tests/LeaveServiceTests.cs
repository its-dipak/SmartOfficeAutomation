using SmartOffice.Application.DTOs.Leave;
using SmartOffice.Application.Exceptions;
using SmartOffice.Application.Services;
using SmartOffice.Domain.Entities;
using SmartOffice.Tests.Fakes;
using Xunit;

namespace SmartOffice.Tests;

public class LeaveServiceTests
{
    private readonly FakeLeaveRepository _repo = new();
    private readonly FakeUserRepository _users = new();
    private readonly LeaveService _service;

    public LeaveServiceTests()
    {
        _repo.Employees.Add(new Employee
        {
            Id = 1,
            FirstName = "Asha",
            LastName = "Rai"
        });

        _service = new LeaveService(_repo, _users);
    }

    private static CreateLeaveDto ValidLeave(int employeeId = 1) => new()
    {
        EmployeeId = employeeId,
        LeaveType = "Annual",
        FromDate = new DateOnly(2026, 11, 1),
        ToDate = new DateOnly(2026, 11, 3),
        Reason = "Family event"
    };

    [Fact]
    public async Task Create_StartsAsPending()
    {
        var result = await _service.CreateAsync(ValidLeave());

        Assert.Equal("Pending", result.Status);
        Assert.Equal("Asha Rai", result.EmployeeName);
        Assert.Single(_repo.Records);
    }

    [Fact]
    public async Task Create_UnknownEmployee_ThrowsNotFound()
    {
        await Assert.ThrowsAsync<NotFoundException>(() =>
            _service.CreateAsync(ValidLeave(employeeId: 99)));

        Assert.Empty(_repo.Records);
    }

    [Fact]
    public async Task Create_FromDateAfterToDate_ThrowsBusinessRule()
    {
        var dto = ValidLeave();
        dto.FromDate = new DateOnly(2026, 11, 5);

        await Assert.ThrowsAsync<BusinessRuleException>(() =>
            _service.CreateAsync(dto));

        Assert.Empty(_repo.Records);
    }

    [Fact]
    public async Task Create_SingleDayLeave_IsAllowed()
    {
        var dto = ValidLeave();
        dto.ToDate = dto.FromDate;

        var result = await _service.CreateAsync(dto);

        Assert.Equal(result.FromDate, result.ToDate);
    }

    [Fact]
    public async Task CreateMyLeave_UsesLinkedEmployee()
    {
        _users.EmployeeIdByUserId[10] = 1;

        var result = await _service.CreateMyLeaveAsync(10, new CreateMyLeaveDto
        {
            LeaveType = "Sick",
            FromDate = new DateOnly(2026, 11, 1),
            ToDate = new DateOnly(2026, 11, 1)
        });

        Assert.Equal(1, result.EmployeeId);
        Assert.Equal("Pending", result.Status);
    }

    [Fact]
    public async Task CreateMyLeave_UserWithoutProfile_ThrowsNotFound()
    {
        await Assert.ThrowsAsync<NotFoundException>(() =>
            _service.CreateMyLeaveAsync(10, new CreateMyLeaveDto()));
    }

    [Fact]
    public async Task GetMyLeaves_ReturnsOnlyOwnRecords()
    {
        _repo.Employees.Add(new Employee { Id = 2, FirstName = "Bikash", LastName = "T" });
        _users.EmployeeIdByUserId[10] = 1;

        await _service.CreateAsync(ValidLeave(1));
        await _service.CreateAsync(ValidLeave(2));

        var mine = (await _service.GetMyLeavesAsync(10)).ToList();

        Assert.Single(mine);
        Assert.Equal(1, mine[0].EmployeeId);
    }

    [Theory]
    [InlineData("Approved")]
    [InlineData("Rejected")]
    [InlineData("approved")]
    public async Task UpdateStatus_AcceptsKnownStatuses(string status)
    {
        var created = await _service.CreateAsync(ValidLeave());

        var result = await _service.UpdateStatusAsync(
            created.Id, new LeaveStatusDto { Status = status });

        Assert.NotNull(result);
        Assert.Equal(status, result!.Status);
    }

    [Fact]
    public async Task UpdateStatus_UnknownStatus_ThrowsBusinessRule()
    {
        var created = await _service.CreateAsync(ValidLeave());

        await Assert.ThrowsAsync<BusinessRuleException>(() =>
            _service.UpdateStatusAsync(
                created.Id, new LeaveStatusDto { Status = "Maybe" }));
    }

    [Fact]
    public async Task UpdateStatus_MissingLeave_ReturnsNull()
    {
        var result = await _service.UpdateStatusAsync(
            123, new LeaveStatusDto { Status = "Approved" });

        Assert.Null(result);
    }

    [Fact]
    public async Task Update_InvalidDateRange_ThrowsBusinessRule()
    {
        var created = await _service.CreateAsync(ValidLeave());

        await Assert.ThrowsAsync<BusinessRuleException>(() =>
            _service.UpdateAsync(created.Id, new UpdateLeaveDto
            {
                LeaveType = "Annual",
                FromDate = new DateOnly(2026, 12, 10),
                ToDate = new DateOnly(2026, 12, 1),
                Status = "Pending"
            }));
    }

    [Fact]
    public async Task Delete_RemovesRecord_AndReportsMissing()
    {
        var created = await _service.CreateAsync(ValidLeave());

        Assert.True(await _service.DeleteAsync(created.Id));
        Assert.False(await _service.DeleteAsync(created.Id));
        Assert.Empty(_repo.Records);
    }
}
