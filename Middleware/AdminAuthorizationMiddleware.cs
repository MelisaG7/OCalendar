using StarterKit.Services;


public class AdminAuthorizationMiddleware
{
    private readonly RequestDelegate _next;

    public AdminAuthorizationMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        // The admin may only create, delete or update events which this middleware will be checking on
        var endpoint = context.GetEndpoint();
        if (endpoint?.Metadata.GetMetadata<AdminOnlyAttribute>() != null &&
                (context.Request.Method == HttpMethods.Delete ||
                 context.Request.Method == HttpMethods.Post ||
                 context.Request.Method == HttpMethods.Put))
        {
            // Check if the user is logged in as admin
            var isAdmin = context.Session.GetString(SESSION_KEY.adminLoggedIn.ToString());
            if (string.IsNullOrEmpty(isAdmin))
            {
                // Not an admin; handle unauthorized access
                context.Response.StatusCode = StatusCodes.Status403Forbidden; // Forbidden
                await context.Response.WriteAsync("Access Denied. Admins only.");
                return;
            }
        }

        // Continue to the next middleware

        await _next(context);
    }
}

[AttributeUsage(AttributeTargets.Method)]
public class AdminOnlyAttribute : Attribute
{
}