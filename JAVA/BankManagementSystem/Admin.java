// Admin - simple admin user class
public class Admin {
    private String username;
    private String password;

    // constructor
    public Admin(String username, String password) {
        this.username = username;
        this.password = password;
    }

    // check login credentials
    public boolean login(String inputUsername, String inputPassword) {
        if (inputUsername == null || inputPassword == null) return false;
        return this.username.equals(inputUsername.trim()) && this.password.equals(inputPassword.trim());
    }

    // get username
    public String getUsername() { return username; }
}