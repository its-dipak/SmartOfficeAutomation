namespace SmartOffice.Application.DTOs.Payroll;

public class CreatePayrollDto
{
    public int EmployeeId { get; set; }

    public int Month { get; set; }

    public int Year { get; set; }

    public decimal BasicSalary { get; set; }

    public decimal Allowance { get; set; }

    public decimal Deduction { get; set; }

    public DateTime PaymentDate { get; set; }
}