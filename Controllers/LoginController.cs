using System.Text;
using Microsoft.AspNetCore.Mvc;
using StarterKit.Services;

namespace StarterKit.Controllers;


[Route("api/v1/Login")]
public class LoginController : Controller
{
    private readonly ILoginService _loginService;


    public LoginController(ILoginService loginService)
    {
        _loginService = loginService;
    }

    [HttpPost("Login")]
    public IActionResult Login([FromBody] LoginBody loginBody)
    {
        // TODO: Impelement login method
        if (loginBody.Username is null)
        {
            return BadRequest("Username was left empty");
        }
        else if (loginBody.Password is null)
        {
            return BadRequest("Password was left empty");
        }
        var loginStatus = _loginService.CheckPassword(loginBody.Username, loginBody.Password);

        // Handle login result
        switch (loginStatus)
        {
            case LoginStatus.Success:
                return Ok("Login successful");
            case LoginStatus.IncorrectUsername:
                return Unauthorized("Username not found");
            case LoginStatus.IncorrectPassword:
                return Unauthorized("Incorrect password");
            default:
                return BadRequest("Unknown error");
        }
    }

    [HttpGet("IsAdminLoggedIn")]
    public IActionResult IsAdminLoggedIn()
    {
        // TODO: This method should return a status 200 OK when logged in, else 403, unauthorized 
        if (_loginService.CheckAdminLoggedIn())
        {
            var adminUsername = _loginService.GetLoggedInAdminUsername();
            return Ok(adminUsername);
        }
        return Unauthorized("Admin not logged in");
    }

    [HttpGet("Logout")]
    public IActionResult Logout()
    {
        if (_loginService.CheckAdminLoggedIn())
        {
            _loginService.Logout();
            return Ok("Logged out");
        }
        return Unauthorized("No admin is logged in to log out");
    }

}

public class LoginBody
{
    public string? Username { get; set; }
    public string? Password { get; set; }
}
