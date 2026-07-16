import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class AuthService {
  // ====================== IMPORTANT: CHANGE THIS FOR REAL DEVICE ======================
  // For teaching, we will use a variable that you can easily change

  static const String emulatorUrl = "http://10.0.2.2:8000/";
  static const String realDeviceUrl =
      "http://192.168.1.100:8000/"; // ← CHANGE THIS!
  static const String webUrl = "http://127.0.0.1:8000/";

  // to Find Your PC’s IP Address (For Real Device)
  // Method 1: Using Command Prompt (Easiest & Recommended)

  // Press the Windows key on your keyboard.
  // Type cmd and press Enter to open Command Prompt.
  // In the black window, type this command and press Enter:ipconfig

  // This function automatically chooses the correct URL
  static String get baseUrl {
    if (kIsWeb) {
      return webUrl; // For Chrome / Edge
    } else {
      // For Mobile (Emulator or Real Device)
      // Change this line when using Real Device:
      return realDeviceUrl; // ← Change to emulatorUrl when using Emulator
      // return emulatorUrl;            // Uncomment this when using Emulator
    }
  }

  // ====================== LOGIN FUNCTION ======================
  Future<Map<String, dynamic>> login({
    required String username,
    required String password,
  }) async {
    final url = Uri.parse("${baseUrl}api/login/");

    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'username': username, 'password': password}),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);

      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('token', data['token']);
      await prefs.setString('username', data['username'] ?? '');
      await prefs.setString('email', data['email'] ?? '');

      return data;
    } else {
      final error = jsonDecode(response.body);
      throw Exception(error['error'] ?? 'Login failed');
    }
  }

  // ====================== SIGNUP FUNCTION ======================
  Future<Map<String, dynamic>> signup({
    required String username,
    required String email,
    required String password,
  }) async {
    final url = Uri.parse("${baseUrl}api/signup/");

    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'username': username,
        'email': email,
        'password': password,
      }),
    );

    if (response.statusCode == 200 || response.statusCode == 201) {
      final data = jsonDecode(response.body);

      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('token', data['token']);

      return data;
    } else {
      final error = jsonDecode(response.body);
      throw Exception(error.toString());
    }
  }

  // ====================== HELPER FUNCTIONS ======================
  Future<bool> isLoggedIn() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('token') != null;
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();
  }
}
