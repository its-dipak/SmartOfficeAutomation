namespace SmartOffice.Domain.Entities;

public class Payroll
{
    public int Id { get; set; }

    public int EmployeeId { get; set; }

    public Employee Employee { get; set; } = null!;

    public int Month { get; set; }

    public int Year { get; set; }

    public decimal BasicSalary { get; set; }

    public decimal Allowance { get; set; }

    public decimal Deduction { get; set; }

    public decimal NetSalary { get; set; }

    public DateTime PaymentDate { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}