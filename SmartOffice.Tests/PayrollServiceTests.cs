using SmartOffice.Application.DTOs.Payroll;
using SmartOffice.Application.Exceptions;
using SmartOffice.Application.Services;
using SmartOffice.Domain.Entities;
using SmartOffice.Tests.Fakes;
using Xunit;

namespace SmartOffice.Tests;

public class PayrollServiceTests
{
    private readonly FakePayrollRepository _repo = new();
    private readonly FakeUserRepository _users = new();
    private readonly PayrollService _service;

    public PayrollServiceTests()
    {
        _repo.Employees.Add(new Employee
        {
            Id = 1,
            FirstName = "Asha",
            LastName = "Rai"
        });

        _service = new PayrollService(_repo, _users);
    }

    private static CreatePayrollDto Valid() => new()
    {
        EmployeeId = 1,
        Month = 10,
        Year = 2026,
        BasicSalary = 50000m,
        Allowance = 5000m,
        Deduction = 2500m,
        PaymentDate = new DateTime(2026, 10, 31)
    };

    [Fact]
    public async Task Create_ComputesNetSalary()
    {
        var result = await _service.CreateAsync(Valid());

        Assert.Equal(52500m, result.NetSalary);
        Assert.Equal("Asha Rai", result.EmployeeName);
    }

    [Fact]
    public async Task Create_UnknownEmployee_ThrowsNotFound()
    {
        var dto = Valid();
        dto.EmployeeId = 99;

        await Assert.ThrowsAsync<NotFoundException>(() => _service.CreateAsync(dto));
    }

    [Theory]
    [InlineData(0)]
    [InlineData(13)]
    [InlineData(-1)]
    public async Task Create_InvalidMonth_ThrowsBusinessRule(int month)
    {
        var dto = Valid();
        dto.Month = month;

        await Assert.ThrowsAsync<BusinessRuleException>(() => _service.CreateAsync(dto));
        Assert.Empty(_repo.Records);
    }

    [Fact]
    public async Task Create_NegativeAmount_ThrowsBusinessRule()
    {
        var dto = Valid();
        dto.Allowance = -1m;

        await Assert.ThrowsAsync<BusinessRuleException>(() => _service.CreateAsync(dto));
    }

    [Fact]
    public async Task Create_DeductionAboveGross_ThrowsBusinessRule()
    {
        var dto = Valid();
        dto.Deduction = 60000m;

        await Assert.ThrowsAsync<BusinessRuleException>(() => _service.CreateAsync(dto));
    }

    [Fact]
    public async Task Create_DeductionEqualToGross_GivesZeroNet()
    {
        var dto = Valid();
        dto.Deduction = 55000m;

        var result = await _service.CreateAsync(dto);

        Assert.Equal(0m, result.NetSalary);
    }

    [Fact]
    public async Task Update_RecalculatesNetSalary()
    {
        var created = await _service.CreateAsync(Valid());

        var updated = await _service.UpdateAsync(created.Id, new UpdatePayrollDto
        {
            Month = 10,
            Year = 2026,
            BasicSalary = 60000m,
            Allowance = 0m,
            Deduction = 1000m,
            PaymentDate = new DateTime(2026, 10, 31)
        });

        Assert.NotNull(updated);
        Assert.Equal(59000m, updated!.NetSalary);
    }

    [Fact]
    public async Task Update_MissingRecord_ReturnsNull()
    {
        var result = await _service.UpdateAsync(5, new UpdatePayrollDto
        {
            Month = 1,
            Year = 2026,
            BasicSalary = 1m
        });

        Assert.Null(result);
    }

    [Fact]
    public async Task GetMyPayroll_ReturnsOnlyOwnRecords()
    {
        _repo.Employees.Add(new Employee { Id = 2, FirstName = "Bikash", LastName = "T" });
        _users.EmployeeIdByUserId[10] = 1;

        await _service.CreateAsync(Valid());
        var other = Valid();
        other.EmployeeId = 2;
        await _service.CreateAsync(other);

        var mine = (await _service.GetMyPayrollAsync(10)).ToList();

        Assert.Single(mine);
        Assert.Equal(1, mine[0].EmployeeId);
    }

    [Fact]
    public async Task GetMyPayroll_UserWithoutProfile_ThrowsNotFound()
    {
        await Assert.ThrowsAsync<NotFoundException>(() => _service.GetMyPayrollAsync(7));
    }
}
