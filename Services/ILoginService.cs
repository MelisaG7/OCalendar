namespace StarterKit.Services;

public interface ILoginService {
    public LoginStatus CheckPassword(string username, string inputPassword);
    public bool CheckAdminLoggedIn();
    public string GetLoggedInAdminUsername();
    public void Logout();
}