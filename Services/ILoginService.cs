using StarterKit.Models;

namespace StarterKit.Services;

public interface ILoginService
{
    public LoginStatus CheckPassword(string username, string inputPassword);
    public bool CheckAdminLoggedIn();
    public bool CheckUserLoggedIn();
    public string GetLoggedInAdminUsername();
    public string GetLoggedInUserEmail();
    public void Logout();
    public void LogoutUser();
    public Task AddUserToDb(User user);
    public User GetUserByEmail(string email);
    public int? GetLastUserId();
    // public Task DeleteUserFromDb(int user);
}