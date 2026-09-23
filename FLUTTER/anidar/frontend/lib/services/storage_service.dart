import 'package:shared_preferences/shared_preferences.dart';

class StorageService {
  static const _tokenKey = 'access_token';
  static const _userKey = 'user_json';

  SharedPreferences? _prefs;

  Future<void> init() async {
    _prefs = await SharedPreferences.getInstance();
  }

  Future<String?> getAccessToken() async => _prefs?.getString(_tokenKey);
  Future<void> setAccessToken(String token) async => _prefs?.setString(_tokenKey, token);
  Future<void> removeAccessToken() async => _prefs?.remove(_tokenKey);

  Future<String?> getUserJson() async => _prefs?.getString(_userKey);
  Future<void> setUserJson(String json) async => _prefs?.setString(_userKey, json);
  Future<void> removeUserJson() async => _prefs?.remove(_userKey);
}