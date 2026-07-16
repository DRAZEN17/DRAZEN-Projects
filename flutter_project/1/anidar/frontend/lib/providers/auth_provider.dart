import 'dart:convert';
import 'package:flutter/material.dart';
import '../models/user.dart';
import '../services/api_service.dart';
import '../services/storage_service.dart';

class AuthProvider with ChangeNotifier {
  final ApiService api = ApiService();
  final StorageService storage = StorageService();

  User? _user;
  bool _isLoading = false;
  bool _isInitialized = false;
  String? _accessToken;

  User? get user => _user;
  bool get isAuthenticated => _user != null && _accessToken != null;
  String? get accessToken => _accessToken;
  bool get isLoading => _isLoading;
  bool get isInitialized => _isInitialized;

  AuthProvider() {
    storage.init().then((_) => tryAutoLogin());
  }

  Future<void> tryAutoLogin() async {
    try {
      final token = await storage.getAccessToken();
      if (token != null) {
        _accessToken = token;
        api.accessToken = token;
        final userJson = await storage.getUserJson();
        if (userJson != null) {
          _user = User.fromJson(jsonDecode(userJson));
        }
      }
    } catch (e) {
      await storage.removeAccessToken();
      await storage.removeUserJson();
      debugPrint('Auto-login failed: $e');
    } finally {
      _isInitialized = true;
      notifyListeners();
    }
  }

  Future<void> login(String email, String password) async {
    _isLoading = true;
    notifyListeners();
    try {
      final res = await api.post('/auth/login', body: {
        'email': email.trim().toLowerCase(),
        'password': password,
      });
      final body = _safeDecodeBody(res.body);
      if (res.statusCode != 200) {
        throw Exception(body['error'] ?? 'Login failed (${res.statusCode})');
      }
      _applyAuthData(body);
      await _persistAuth(body);
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> register(String username, String email, String password) async {
    _isLoading = true;
    notifyListeners();
    try {
      final res = await api.post('/auth/register', body: {
        'username': username.trim(),
        'email': email.trim().toLowerCase(),
        'password': password,
      });
      final body = _safeDecodeBody(res.body);
      if (res.statusCode != 201) {
        throw Exception(body['error'] ?? 'Registration failed (${res.statusCode})');
      }
      // Backend now returns accessToken + user on register
      if (body['accessToken'] != null) {
        _applyAuthData(body);
        await _persistAuth(body);
      } else {
        // Fallback: auto-login if backend didn't return token
        await login(email, password);
      }
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> logout() async {
    try { await api.post('/auth/logout'); } catch (_) {}
    _user = null;
    _accessToken = null;
    _isInitialized = false;
    api.accessToken = null;
    await storage.removeAccessToken();
    await storage.removeUserJson();
    notifyListeners();
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  void _applyAuthData(Map<String, dynamic> data) {
    _accessToken = data['accessToken'] as String?;
    api.accessToken = _accessToken;
    final userMap = data['user'] as Map<String, dynamic>?;
    if (userMap != null) _user = User.fromJson(userMap);
  }

  Future<void> _persistAuth(Map<String, dynamic> data) async {
    if (_accessToken != null) await storage.setAccessToken(_accessToken!);
    final userMap = data['user'];
    if (userMap != null) await storage.setUserJson(jsonEncode(userMap));
  }

  Map<String, dynamic> _safeDecodeBody(String body) {
    try {
      final decoded = jsonDecode(body);
      if (decoded is Map<String, dynamic>) return decoded;
      return {'error': 'Unexpected response format'};
    } catch (_) {
      return {'error': 'Invalid server response'};
    }
  }
}
