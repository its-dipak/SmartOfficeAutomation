using SmartOffice.Application.DTOs.Attendance;
using SmartOffice.Application.Interfaces;
using SmartOffice.Domain.Entities;

namespace SmartOffice.Application.Services;

public class AttendanceService : IAttendanceService
{
    private readonly IAttendanceRepository _repository;
    private readonly IUserRepository _userRepository;

    public AttendanceService(
        IAttendanceRepository repository,
        IUserRepository userRepository)
    {
        _repository = repository;
        _userRepository = userRepository;
    }

    private static AttendanceDto MapToDto(Attendance attendance)
    {
        return new AttendanceDto
        {
            Id = attendance.Id,
            EmployeeId = attendance.EmployeeId,
            EmployeeName = attendance.Employee == null
                ? string.Empty
                : $"{attendance.Employee.FirstName} {attendance.Employee.LastName}",
            AttendanceDate = attendance.AttendanceDate,
            CheckInTime = attendance.CheckInTime,
            CheckOutTime = attendance.CheckOutTime,
            WorkingHours = attendance.WorkingHours,
            Status = attendance.Status,
            Remarks = attendance.Remarks
        };
    }

    // Admin / HR: Get all attendance
    public async Task<IEnumerable<AttendanceDto>> GetAllAsync()
    {
        var attendances = await _repository.GetAllAsync();

        return attendances.Select(MapToDto);
    }

    // Admin / HR: Get attendance for a specific employee
    public async Task<IEnumerable<AttendanceDto>> GetEmployeeAttendanceAsync(
        int employeeId)
    {
        var attendances =
            await _repository.GetEmployeeAttendanceAsync(employeeId);

        return attendances.Select(MapToDto);
    }

    // Employee: Get only their own attendance
    public async Task<IEnumerable<AttendanceDto>> GetMyAttendanceAsync(
        int userId)
    {
        var employeeId =
            await _userRepository.GetEmployeeIdByUserIdAsync(userId);

        if (employeeId == null)
        {
            throw new Exception(
                "Employee profile is not linked to this user.");
        }

        var attendances =
            await _repository.GetEmployeeAttendanceAsync(employeeId.Value);

        return attendances.Select(MapToDto);
    }

    // Employee: Check in using logged-in user's identity
    public async Task<AttendanceDto> MyCheckInAsync(
        int userId,
        string? remarks)
    {
        var employeeId =
            await _userRepository.GetEmployeeIdByUserIdAsync(userId);

        if (employeeId == null)
        {
            throw new Exception(
                "Employee profile is not linked to this user.");
        }

        var dto = new CreateAttendanceDto
        {
            EmployeeId = employeeId.Value,
            Remarks = remarks
        };

        return await CheckInAsync(dto);
    }

    // Employee: Check out using logged-in user's identity
    public async Task<AttendanceDto> MyCheckOutAsync(
        int userId,
        string? remarks)
    {
        var employeeId =
            await _userRepository.GetEmployeeIdByUserIdAsync(userId);

        if (employeeId == null)
        {
            throw new Exception(
                "Employee profile is not linked to this user.");
        }

        var dto = new CheckOutDto
        {
            EmployeeId = employeeId.Value,
            Remarks = remarks
        };

        return await CheckOutAsync(dto);
    }

    // Admin / HR: Check in an employee
    public async Task<AttendanceDto> CheckInAsync(
        CreateAttendanceDto dto)
    {
        var employee =
            await _repository.GetEmployeeAsync(dto.EmployeeId);

        if (employee == null)
        {
            throw new Exception("Employee not found.");
        }

        var attendance =
            await _repository.GetTodayAttendanceAsync(dto.EmployeeId);

        if (attendance != null)
        {
            throw new Exception(
                "Employee has already checked in today.");
        }

        attendance = new Attendance
        {
            EmployeeId = dto.EmployeeId,
            Employee = employee,
            AttendanceDate =
                DateOnly.FromDateTime(DateTime.Today),
            CheckInTime =
                TimeOnly.FromDateTime(DateTime.Now),
            Status = "Present",
            Remarks = dto.Remarks,
            WorkingHours = 0
        };

        await _repository.AddAsync(attendance);
        await _repository.SaveChangesAsync();

        return MapToDto(attendance);
    }

    // Admin / HR: Check out an employee
    public async Task<AttendanceDto> CheckOutAsync(
        CheckOutDto dto)
    {
        var attendance =
            await _repository.GetTodayAttendanceAsync(dto.EmployeeId);

        if (attendance == null)
        {
            throw new Exception(
                "Employee has not checked in today.");
        }

        if (attendance.CheckOutTime != null)
        {
            throw new Exception(
                "Employee has already checked out today.");
        }

        attendance.CheckOutTime =
            TimeOnly.FromDateTime(DateTime.Now);

        attendance.Remarks = dto.Remarks;

        var workingHours =
            attendance.CheckOutTime.Value.ToTimeSpan() -
            attendance.CheckInTime!.Value.ToTimeSpan();

        attendance.WorkingHours = Math.Round(
            (decimal)workingHours.TotalHours,
            2);

        await _repository.UpdateAsync(attendance);
        await _repository.SaveChangesAsync();

        attendance =
            await _repository.GetByIdAsync(attendance.Id)
            ?? throw new Exception("Attendance not found.");

        return MapToDto(attendance);
    }
}