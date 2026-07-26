using Microsoft.EntityFrameworkCore;
using SmartOffice.Domain.Entities;

namespace SmartOffice.Persistence.Context;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Department> Departments => Set<Department>();
    public DbSet<Employee> Employees => Set<Employee>();
    public DbSet<Role> Roles => Set<Role>();
    public DbSet<User> Users => Set<User>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // ==========================
        // Department
        // ==========================
        modelBuilder.Entity<Department>(entity =>
        {
            entity.HasKey(x => x.Id);

            entity.Property(x => x.Name)
                  .HasMaxLength(100)
                  .IsRequired();

            entity.Property(x => x.Description)
                  .HasMaxLength(300);

            entity.Property(x => x.IsActive)
                  .HasDefaultValue(true);
        });

        // ==========================
        // Employee
        // ==========================
        modelBuilder.Entity<Employee>(entity =>
        {
            entity.HasKey(x => x.Id);

            entity.Property(x => x.EmployeeCode)
                  .HasMaxLength(20)
                  .IsRequired();

            entity.Property(x => x.FirstName)
                  .HasMaxLength(100)
                  .IsRequired();

            entity.Property(x => x.LastName)
                  .HasMaxLength(100)
                  .IsRequired();

            entity.Property(x => x.Email)
                  .HasMaxLength(150)
                  .IsRequired();

            entity.Property(x => x.Phone)
                  .HasMaxLength(20);

            entity.Property(x => x.Designation)
                  .HasMaxLength(100);

            entity.Property(x => x.Salary)
                  .HasPrecision(18, 2);

            entity.Property(x => x.JoiningDate)
                  .IsRequired();

            entity.Property(x => x.IsActive)
                  .HasDefaultValue(true);

            entity.HasOne(x => x.Department)
                  .WithMany(d => d.Employees)
                  .HasForeignKey(x => x.DepartmentId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // ==========================
        // Role
        // ==========================
        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(x => x.Id);

            entity.Property(x => x.Name)
                  .HasMaxLength(50)
                  .IsRequired();
        });

        // ==========================
        // User
        // ==========================
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(x => x.Id);

            entity.Property(x => x.Username)
                  .HasMaxLength(100)
                  .IsRequired();

            entity.Property(x => x.PasswordHash)
                  .IsRequired();

            entity.Property(x => x.Email)
                  .HasMaxLength(150)
                  .IsRequired();

            entity.HasOne(x => x.Role)
                  .WithMany(r => r.Users)
                  .HasForeignKey(x => x.RoleId)
                  .OnDelete(DeleteBehavior.Restrict);
        });
    }
}