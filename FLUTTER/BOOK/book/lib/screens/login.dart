import 'package:book/screens/home.dart';
import 'package:book/screens/signup.dart';
import 'package:book/services/auth_service.dart';
import 'package:flutter/material.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  // === NEW: Controllers to get user input ===
  final _usernameController = TextEditingController();
  final _passwordController = TextEditingController();

  // === NEW: Loading state ===
  bool _isLoading = false;

  // === NEW: AuthService instance ===
  final AuthService _authService = AuthService();

  // === NEW: Function to handle login logic ===
  Future<void> _handleLogin() async {
    setState(() => _isLoading = true); // Show loading

    try {
      await _authService.login(
        username: _usernameController.text.trim(),
        password: _passwordController.text.trim(),
      );

      if (mounted) {
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (_) => const HomeScreen()),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString()), backgroundColor: Colors.red),
        );
      }
    } finally {
      if (mounted) setState(() => _isLoading = false); // Hide loading
    }
  }

  @override
  void dispose() {
    _usernameController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text(
              'Login',
              style: TextStyle(fontSize: 40, fontWeight: FontWeight.bold),
            ),

            const SizedBox(height: 30),

            TextField(
              controller: _usernameController, // ← Added
              decoration: InputDecoration(
                labelText: "Username", // ← Changed from Email
                prefixIcon: const Icon(Icons.person), // ← Changed icon
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(20),
                  borderSide: const BorderSide(color: Colors.green, width: 2),
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(20),
                  borderSide: const BorderSide(color: Colors.red, width: 1),
                ),
              ),
            ),

            const SizedBox(height: 30),

            TextField(
              controller: _passwordController, // ← Added
              obscureText: true, // ← Added (hide password)
              decoration: InputDecoration(
                labelText: "Password",
                prefixIcon: Icon(Icons.lock),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(20),
                ),
              ),
            ),

            const SizedBox(height: 20),

            ElevatedButton(
              onPressed: _isLoading ? null : _handleLogin, // ← Changed
              style: ElevatedButton.styleFrom(
                minimumSize: const Size(double.infinity, 50),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(20),
                ),
              ),
              child: _isLoading
                  ? const CircularProgressIndicator(color: Colors.white)
                  : const Text("Login", style: TextStyle(fontSize: 18)),
            ),

            // ElevatedButton(
            //   onPressed: () {
            //     Navigator.push(
            //       context,
            //       MaterialPageRoute(builder: (_) => const HomeScreen()),
            //     );
            //   },
            //   child: const Text("Login"),
            // ),
            const SizedBox(height: 8),
            TextButton(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const SignupScreen()),
                );
              },
              child: Text("Don't have an account"),
            ),
          ],
        ),
      ),
    );
  }
}
