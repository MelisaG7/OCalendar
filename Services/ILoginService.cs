using StarterKit.Models;

namespace StarterKit.Services;

public interface ILoginService
{
    public LoginStatus CheckPassword(string username, string inputPassword);
    public bool CheckAdminLoggedIn();
    public bool CheckUserLoggedIn();
    public string GetLoggedInAdminUsername();
    public void Logout();
    public void LogoutUser();
    public Task AddUserToDb(User user);
}