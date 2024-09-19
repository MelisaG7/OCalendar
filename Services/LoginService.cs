using StarterKit.Models;
using StarterKit.Utils;
using System.Linq;

namespace StarterKit.Services;

public enum LoginStatus { IncorrectPassword, IncorrectUsername, Success }

public enum ADMIN_SESSION_KEY { adminLoggedIn }

public class LoginService : ILoginService
{

    private readonly DatabaseContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;
    public LoginService(DatabaseContext context, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
    }

    public LoginStatus CheckPassword(string username, string inputPassword)
    {
        // TODO: Make this method check the password with what is in the database
        // check if username exists
        
        var admin =  _context.Admin.FirstOrDefault(p => p.UserName == username);

        if (admin is null)
            return LoginStatus.IncorrectUsername;

        // check password
        var encryptedPassword = EncryptionHelper.EncryptPassword(inputPassword);

        if (admin.Password == encryptedPassword)
        {
            _httpContextAccessor.HttpContext.Session.SetString(ADMIN_SESSION_KEY.adminLoggedIn.ToString(), admin.UserName);
            return LoginStatus.Success;
        }
        return LoginStatus.IncorrectPassword;
    }
    public bool CheckAdminLoggedIn()
    {
        var adminUsername = _httpContextAccessor.HttpContext.Session.GetString(ADMIN_SESSION_KEY.adminLoggedIn.ToString());
        return !string.IsNullOrEmpty(adminUsername);
    }

    public string GetLoggedInAdminUsername()
    {
        var username = _httpContextAccessor.HttpContext.Session.GetString(ADMIN_SESSION_KEY.adminLoggedIn.ToString());
        if (username is not null)
            return username;
        return null;
    }
     public void Logout()
    {
        _httpContextAccessor.HttpContext.Session.Remove(ADMIN_SESSION_KEY.adminLoggedIn.ToString());
    }
}