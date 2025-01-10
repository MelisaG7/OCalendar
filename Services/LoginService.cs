using StarterKit.Models;
using StarterKit.Utils;
using System.Linq;

namespace StarterKit.Services;

public enum LoginStatus { IncorrectPassword, IncorrectUsername, Success }

public enum SESSION_KEY { adminLoggedIn, userLoggedIn }

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
        bool userlogin = false;
        var admin = _context.Admin.FirstOrDefault(p => p.UserName == username);
        var user = _context.User.FirstOrDefault(p => p.Email == username);

        if (admin is null && user is null)
            return LoginStatus.IncorrectUsername;
        else if (admin is null)
        {
            userlogin = true;
        }
        // check wether the user is trying to login or the admin
        // check password
        var encryptedPassword = EncryptionHelper.EncryptPassword(inputPassword);

        if (!userlogin && admin.Password == encryptedPassword)
        {
            _httpContextAccessor.HttpContext.Session.SetString(SESSION_KEY.adminLoggedIn.ToString(), admin.UserName);
            return LoginStatus.Success;
        }
        else if (user.Password == encryptedPassword)
        {
            _httpContextAccessor.HttpContext.Session.SetString(SESSION_KEY.userLoggedIn.ToString(), user.Email);
            return LoginStatus.Success;
        }
        return LoginStatus.IncorrectPassword;
    }
    public bool CheckAdminLoggedIn()
    {
        // Wanneer ik via Frontend doe, krijg ik opeens dat ie leeg is, geen username
        var username = _httpContextAccessor.HttpContext.Session.GetString(SESSION_KEY.adminLoggedIn.ToString());
        Console.WriteLine(!string.IsNullOrEmpty(username));
        return !string.IsNullOrEmpty(username);
    }

    public bool CheckUserLoggedIn()
    {
        var email = _httpContextAccessor.HttpContext.Session.GetString(SESSION_KEY.userLoggedIn.ToString());
        Console.WriteLine(!string.IsNullOrEmpty(email));
        return !string.IsNullOrEmpty(email);
    }

    public string GetLoggedInAdminUsername()
    {
        var username = _httpContextAccessor.HttpContext.Session.GetString(SESSION_KEY.adminLoggedIn.ToString());
        if (username is not null)
            return username;
        return null;
    }
    public string GetLoggedInUserEmail()
    {
        var email = _httpContextAccessor.HttpContext.Session.GetString(SESSION_KEY.userLoggedIn.ToString());
        if (email is not null)
            return email;
        return null;
    }
    public User GetUserByEmail(string email)
    {
        // Fetch user by email
        var user =  _context.User.FirstOrDefault(u => u.Email == email);
        return user;
    }
    public void Logout()
    {
        _httpContextAccessor.HttpContext.Session.Remove(SESSION_KEY.adminLoggedIn.ToString());
    }
    public void LogoutUser()
    {
        _httpContextAccessor.HttpContext.Session.Remove(SESSION_KEY.userLoggedIn.ToString());
    }

    public async Task AddUserToDb(User user)
    {
        await _context.User.AddAsync(user);
        await _context.SaveChangesAsync();
    }

    public int? GetLastUserId()
    {
        int? lastUserId =  _context.User
                            .OrderByDescending(u => u.UserId)
                            .Select(u => u.UserId)
                            .FirstOrDefault();
        if (lastUserId == null)
        {
            return -1;
        }
        return lastUserId;
    }

    // public async Task DeleteUserFromDb(int userId)
    // {
    //     var user = await _context.User.FindAsync(userId);
    //     _context.User.Remove(user);
    //     await _context.SaveChangesAsync();
    // }
}