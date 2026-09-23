import 'dart:convert';
import 'api_service.dart';

class AuthService {
  final ApiService api;

  AuthService(this.api);

  Future<Map<String, dynamic>> register(String username, String email, String password) async {
    final res = await api.post('/auth/register', body: {'username': username, 'email': email, 'password': password});
    if (res.statusCode == 201) return jsonDecode(res.body);
    throw Exception(jsonDecode(res.body)['error'] ?? 'Registration failed');
  }

  Future<Map<String, dynamic>> login(String email, String password) async {
    final res = await api.post('/auth/login', body: {'email': email, 'password': password});
    if (res.statusCode == 200) return jsonDecode(res.body);
    throw Exception(jsonDecode(res.body)['error'] ?? 'Login failed');
  }

  Future<String> refreshToken() async {
    final res = await api.post('/auth/refresh');
    if (res.statusCode == 200) return jsonDecode(res.body)['accessToken'];
    throw Exception('Refresh failed');
  }

  Future<void> logout() async {
    await api.post('/auth/logout');
  }
}