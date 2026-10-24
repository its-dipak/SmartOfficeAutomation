using SmartOffice.Application.DTOs.Attendance;
using SmartOffice.Application.Exceptions;
using SmartOffice.Application.Services;
using SmartOffice.Domain.Entities;
using SmartOffice.Tests.Fakes;
using Xunit;

namespace SmartOffice.Tests;

public class AttendanceServiceTests
{
    private static readonly DateTimeOffset NineAm =
        new(2026, 10, 5, 9, 0, 0, TimeSpan.Zero);

    private readonly FakeAttendanceRepository _repo = new();
    private readonly FakeUserRepository _users = new();
    private readonly FakeTimeProvider _clock = new(NineAm);
    private readonly AttendanceService _service;

    public AttendanceServiceTests()
    {
        _repo.Today = DateOnly.FromDateTime(NineAm.DateTime);
        _repo.Employees.Add(new Employee
        {
            Id = 1,
            FirstName = "Asha",
            LastName = "Rai"
        });

        _service = new AttendanceService(_repo, _users, _clock);
    }

    [Fact]
    public async Task CheckIn_CreatesPresentRecordWithCurrentTime()
    {
        var result = await _service.CheckInAsync(
            new CreateAttendanceDto { EmployeeId = 1, Remarks = "On time" });

        Assert.Equal("Present", result.Status);
        Assert.Equal(new TimeOnly(9, 0), result.CheckInTime);
        Assert.Equal(_repo.Today, result.AttendanceDate);
        Assert.Equal("Asha Rai", result.EmployeeName);
        Assert.Single(_repo.Records);
        Assert.Equal(1, _repo.SaveCount);
    }

    [Fact]
    public async Task CheckIn_UnknownEmployee_ThrowsNotFound()
    {
        await Assert.ThrowsAsync<NotFoundException>(() =>
            _service.CheckInAsync(new CreateAttendanceDto { EmployeeId = 99 }));
    }

    [Fact]
    public async Task CheckIn_Twice_ThrowsConflict()
    {
        await _service.CheckInAsync(new CreateAttendanceDto { EmployeeId = 1 });

        var ex = await Assert.ThrowsAsync<ConflictException>(() =>
            _service.CheckInAsync(new CreateAttendanceDto { EmployeeId = 1 }));

        Assert.Equal("Employee has already checked in today.", ex.Message);
        Assert.Single(_repo.Records);
    }

    [Fact]
    public async Task CheckOut_CalculatesWorkingHours()
    {
        await _service.CheckInAsync(new CreateAttendanceDto { EmployeeId = 1 });

        _clock.Set(NineAm.AddHours(8).AddMinutes(30));

        var result = await _service.CheckOutAsync(
            new CheckOutDto { EmployeeId = 1, Remarks = "Done" });

        Assert.Equal(new TimeOnly(17, 30), result.CheckOutTime);
        Assert.Equal(8.5m, result.WorkingHours);
        Assert.Equal("Done", result.Remarks);
    }

    [Fact]
    public async Task CheckOut_RoundsWorkingHoursToTwoDecimals()
    {
        await _service.CheckInAsync(new CreateAttendanceDto { EmployeeId = 1 });

        _clock.Set(NineAm.AddMinutes(100)); // 1.6666... hours

        var result = await _service.CheckOutAsync(new CheckOutDto { EmployeeId = 1 });

        Assert.Equal(1.67m, result.WorkingHours);
    }

    [Fact]
    public async Task CheckOut_WithoutCheckIn_ThrowsBusinessRule()
    {
        var ex = await Assert.ThrowsAsync<BusinessRuleException>(() =>
            _service.CheckOutAsync(new CheckOutDto { EmployeeId = 1 }));

        Assert.Equal("Employee has not checked in today.", ex.Message);
    }

    [Fact]
    public async Task CheckOut_Twice_ThrowsConflict()
    {
        await _service.CheckInAsync(new CreateAttendanceDto { EmployeeId = 1 });
        _clock.Set(NineAm.AddHours(1));
        await _service.CheckOutAsync(new CheckOutDto { EmployeeId = 1 });

        await Assert.ThrowsAsync<ConflictException>(() =>
            _service.CheckOutAsync(new CheckOutDto { EmployeeId = 1 }));
    }

    [Fact]
    public async Task CheckOut_BeforeCheckInTime_ThrowsBusinessRule()
    {
        await _service.CheckInAsync(new CreateAttendanceDto { EmployeeId = 1 });

        _clock.Set(NineAm.AddHours(-1));

        await Assert.ThrowsAsync<BusinessRuleException>(() =>
            _service.CheckOutAsync(new CheckOutDto { EmployeeId = 1 }));
    }

    [Fact]
    public async Task MyCheckIn_UsesEmployeeLinkedToUser()
    {
        _users.EmployeeIdByUserId[42] = 1;

        var result = await _service.MyCheckInAsync(42, null);

        Assert.Equal(1, result.EmployeeId);
    }

    [Fact]
    public async Task MyCheckIn_UserWithoutEmployeeProfile_ThrowsNotFound()
    {
        var ex = await Assert.ThrowsAsync<NotFoundException>(() =>
            _service.MyCheckInAsync(7, null));

        Assert.Equal("Employee profile is not linked to this user.", ex.Message);
    }

    [Fact]
    public async Task MyCheckOut_UserWithoutEmployeeProfile_ThrowsNotFound()
    {
        await Assert.ThrowsAsync<NotFoundException>(() =>
            _service.MyCheckOutAsync(7, null));
    }
}
