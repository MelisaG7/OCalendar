using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using StarterKit.Models;

public class ValidateUserInputFilter : ActionFilterAttribute
{
    public override void OnActionExecuting(ActionExecutingContext context)
    {
        if (context.ActionArguments.TryGetValue("user", out var userObj) && userObj is User user)
        {
            // Check if any required fields are missing
            if (string.IsNullOrWhiteSpace(user.FirstName) ||
                string.IsNullOrWhiteSpace(user.LastName) ||
                string.IsNullOrWhiteSpace(user.Email) ||
                string.IsNullOrWhiteSpace(user.Password))
            {
                context.Result = new BadRequestObjectResult("User information is required and must have all required fields.");
            }
        }
        else
        {
            context.Result = new BadRequestObjectResult("User object is required.");
        }

        base.OnActionExecuting(context);
    }
}