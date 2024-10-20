using System.Text;
using Microsoft.AspNetCore.Mvc;
using StarterKit.Models;
using StarterKit.Services;
using StarterKit.Utils;
namespace StarterKit.Controllers;



[Route("api/v1/Login")]
public class LoginController : Controller
{
    private readonly ILoginService _loginService;


    public LoginController(ILoginService loginService)
    {
        _loginService = loginService;
    }

    [HttpPost("Register")]

    public IActionResult Register([FromBody] User user)
    {
        // Check if the user object is null
        if (user == null)
        {
            return BadRequest("You are missing required fields");
        }

        // Check for required fields
        if (string.IsNullOrWhiteSpace(user.FirstName) ||
            string.IsNullOrWhiteSpace(user.LastName) ||
            string.IsNullOrWhiteSpace(user.Email) ||
            string.IsNullOrWhiteSpace(user.Password))
        {
            return BadRequest("You are missing required fields");
        }
        // Add the user with the password encrypted
        user.Password = EncryptionHelper.EncryptPassword(user.Password);
        _loginService.AddUserToDb(user);
        return Ok("User successfully registered");
    }

    [HttpPost("Login")]
    public IActionResult Login([FromBody] LoginBody loginBody)
    {
        if (_loginService.CheckUserLoggedIn() || _loginService.CheckAdminLoggedIn() )
        {
            return  BadRequest("You already are logged in. Log out before you try again.");
        }
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

    [HttpPost("LoginUser")]
    public IActionResult Login([FromBody] LoginBodyUser loginBody)
    {
        if (_loginService.CheckUserLoggedIn() || _loginService.CheckAdminLoggedIn() )
        {
            return  BadRequest("You already are logged in. Log out before you try again.");
        }
        // TODO: Impelement login method
        if (loginBody.Email is null)
        {
            return BadRequest("Email was left empty");
        }
        else if (loginBody.Password is null)
        {
            return BadRequest("Password was left empty");
        }
        var loginStatus = _loginService.CheckPassword(loginBody.Email, loginBody.Password);

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
        else if (_loginService.CheckUserLoggedIn())
        {
            _loginService.LogoutUser();
            return Ok("Logged out");
        }
        return Unauthorized("You are not logged in.");
    }

    // [HttpDelete("DeleteUser/{id}")]
    // public IActionResult Delete([FromRoute] int id)
    // {
    //     _loginService.DeleteUserFromDb(id);
    //     return Ok();
    // }


}

public class LoginBody
{
    public string? Username { get; set; }
    public string? Password { get; set; }
}

public class LoginBodyUser
{
    public string? Email { get; set; }
    public string? Password { get; set; }
}