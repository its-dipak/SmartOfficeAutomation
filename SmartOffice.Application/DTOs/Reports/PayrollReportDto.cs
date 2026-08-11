namespace SmartOffice.Application.DTOs.Reports;

public class PayrollReportDto
{
    public int Id { get; set; }

    public int EmployeeId { get; set; }

    public string EmployeeName { get; set; } = string.Empty;

    public int Month { get; set; }

    public int Year { get; set; }

    public decimal BasicSalary { get; set; }

    public decimal Allowance { get; set; }

    public decimal Deduction { get; set; }

    public decimal NetSalary { get; set; }

    public DateTime PaymentDate { get; set; }
}