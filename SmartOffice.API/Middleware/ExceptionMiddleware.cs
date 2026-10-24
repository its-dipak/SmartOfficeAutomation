using System.Net;
using System.Text.Json;
using SmartOffice.Application.Exceptions;

namespace SmartOffice.API.Middleware;

public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;

    public ExceptionMiddleware(
        RequestDelegate next,
        ILogger<ExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            var (statusCode, message) = Map(ex);

            if (statusCode == HttpStatusCode.InternalServerError)
            {
                _logger.LogError(ex, "Unhandled exception");
            }
            else
            {
                _logger.LogWarning(
                    "Request rejected ({Status}): {Message}",
                    (int)statusCode,
                    ex.Message);
            }

            if (context.Response.HasStarted)
            {
                throw;
            }

            context.Response.StatusCode = (int)statusCode;
            context.Response.ContentType = "application/json";

            var response = new
            {
                success = false,
                message
            };

            await context.Response.WriteAsync(
                JsonSerializer.Serialize(response));
        }
    }

    // Known application errors keep their message; anything unexpected
    // returns a generic message so internal details are never leaked.
    internal static (HttpStatusCode Status, string Message) Map(Exception ex)
    {
        return ex switch
        {
            NotFoundException => (HttpStatusCode.NotFound, ex.Message),
            ConflictException => (HttpStatusCode.Conflict, ex.Message),
            BusinessRuleException => (HttpStatusCode.BadRequest, ex.Message),
            _ => (HttpStatusCode.InternalServerError,
                "An unexpected error occurred.")
        };
    }
}
