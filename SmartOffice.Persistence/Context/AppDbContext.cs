using Microsoft.EntityFrameworkCore;
using SmartOffice.Domain.Entities;

namespace SmartOffice.Persistence.Context;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    // =========================
    // DbSets
    // =========================

    public DbSet<Role> Roles => Set<Role>();

    public DbSet<User> Users => Set<User>();

    public DbSet<Department> Departments => Set<Department>();

    public DbSet<Employee> Employees => Set<Employee>();

    public DbSet<Attendance> Attendances => Set<Attendance>();

    public DbSet<Leave> Leaves => Set<Leave>();

    public DbSet<Payroll> Payrolls => Set<Payroll>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // =========================
        // Role
        // =========================

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(r => r.Id);

            entity.Property(r => r.Name)
                .IsRequired()
                .HasMaxLength(50);
        });

        // =========================
        // User
        // =========================

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(u => u.Id);

            entity.Property(u => u.Username)
                .IsRequired()
                .HasMaxLength(100);

            entity.HasIndex(u => u.Username)
                .IsUnique();

            entity.Property(u => u.Email)
                .IsRequired()
                .HasMaxLength(150);

            entity.HasIndex(u => u.Email)
                .IsUnique();

            entity.Property(u => u.PasswordHash)
                .IsRequired();

            entity.HasOne(u => u.Role)
                .WithMany(r => r.Users)
                .HasForeignKey(u => u.RoleId)
                .OnDelete(DeleteBehavior.Restrict);

            // User ↔ Employee
            entity.HasOne(u => u.Employee)
                .WithOne(e => e.User)
                .HasForeignKey<Employee>(e => e.UserId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        // =========================
        // Department
        // =========================

        modelBuilder.Entity<Department>(entity =>
        {
            entity.HasKey(d => d.Id);

            entity.Property(d => d.Name)
                .IsRequired()
                .HasMaxLength(100);

            entity.Property(d => d.Description)
                .HasMaxLength(500);
        });

        // =========================
        // Employee
        // =========================

        modelBuilder.Entity<Employee>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.EmployeeCode)
                .IsRequired()
                .HasMaxLength(20);

            entity.HasIndex(e => e.EmployeeCode)
                .IsUnique();

            entity.Property(e => e.FirstName)
                .IsRequired()
                .HasMaxLength(100);

            entity.Property(e => e.LastName)
                .IsRequired()
                .HasMaxLength(100);

            entity.Property(e => e.Email)
                .IsRequired()
                .HasMaxLength(150);

            entity.HasIndex(e => e.Email)
                .IsUnique();

            entity.Property(e => e.Phone)
                .HasMaxLength(20);

            entity.Property(e => e.Designation)
                .IsRequired()
                .HasMaxLength(100);

            entity.Property(e => e.Salary)
                .HasPrecision(18, 2);

            entity.Property(e => e.JoiningDate)
                .IsRequired();

            entity.Property(e => e.IsActive)
                .HasDefaultValue(true);

            entity.HasOne(e => e.Department)
             .WithMany(d => d.Employees)
             .HasForeignKey(e => e.DepartmentId)
             .OnDelete(DeleteBehavior.Restrict);

            // User ↔ Employee
            entity.HasOne(e => e.User)
                .WithOne(u => u.Employee)
                .HasForeignKey<Employee>(e => e.UserId)
                .OnDelete(DeleteBehavior.SetNull);

            entity.HasIndex(e => e.UserId)
                .IsUnique()
                .HasFilter("[UserId] IS NOT NULL");
        });

        // =========================
        // Attendance
        // =========================

        modelBuilder.Entity<Attendance>(entity =>
        {
            entity.HasKey(a => a.Id);

            entity.Property(a => a.Status)
                .IsRequired()
                .HasMaxLength(50);

            entity.Property(a => a.WorkingHours)
                .HasPrecision(5, 2);

            entity.Property(a => a.Remarks)
                .HasMaxLength(500);

            entity.HasIndex(a => new
            {
                a.EmployeeId,
                a.AttendanceDate
            }).IsUnique();

            entity.HasOne(a => a.Employee)
                .WithMany()
                .HasForeignKey(a => a.EmployeeId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // =========================
        // Leave
        // =========================

        modelBuilder.Entity<Leave>(entity =>
        {
            entity.HasKey(l => l.Id);

            entity.Property(l => l.LeaveType)
                .IsRequired()
                .HasMaxLength(100);

            entity.Property(l => l.Status)
                .IsRequired()
                .HasMaxLength(50);

            entity.Property(l => l.Reason)
                .HasMaxLength(500);

            entity.HasOne(l => l.Employee)
                .WithMany()
                .HasForeignKey(l => l.EmployeeId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // =========================
        // Payroll
        // =========================

        modelBuilder.Entity<Payroll>(entity =>
        {
            entity.HasKey(p => p.Id);

            entity.Property(p => p.BasicSalary)
                .HasPrecision(18, 2);

            entity.Property(p => p.Allowance)
                .HasPrecision(18, 2);

            entity.Property(p => p.Deduction)
                .HasPrecision(18, 2);

            entity.Property(p => p.NetSalary)
                .HasPrecision(18, 2);

            entity.HasOne(p => p.Employee)
                .WithMany()
                .HasForeignKey(p => p.EmployeeId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }
}