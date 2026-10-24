namespace SmartOffice.Application.Exceptions;

/// <summary>
/// Base class for expected, business-level errors. The API maps each subclass
/// to a specific HTTP status code (see ExceptionMiddleware); anything that is
/// not an <see cref="AppException"/> is treated as an unexpected 500 error.
/// </summary>
public abstract class AppException : Exception
{
    protected AppException(string message) : base(message)
    {
    }
}

/// <summary>The requested record does not exist (HTTP 404).</summary>
public class NotFoundException : AppException
{
    public NotFoundException(string message) : base(message)
    {
    }
}

/// <summary>The request conflicts with the current state, e.g. a duplicate check-in (HTTP 409).</summary>
public class ConflictException : AppException
{
    public ConflictException(string message) : base(message)
    {
    }
}

/// <summary>The request breaks a business rule or contains invalid data (HTTP 400).</summary>
public class BusinessRuleException : AppException
{
    public BusinessRuleException(string message) : base(message)
    {
    }
}
