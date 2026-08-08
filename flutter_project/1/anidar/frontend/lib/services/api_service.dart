import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import '../config.dart';

class ApiService {
  final http.Client client;
  String? accessToken;

  // Choose base URL by platform and build mode
  static String get baseUrl {
    // Local Flutter Web development
    if (kIsWeb && kDebugMode) {
      return 'http://localhost:3001';
    }

    // Android/iOS development (non-release)
    if (!kReleaseMode) {
      return Config.apiUrl;
    }

    // Production
    return Config.productionUrl;
  }

  ApiService({http.Client? client}) : client = client ?? http.Client();

  Future<http.Response> get(String path, {Map<String, String>? query}) async {
    final uri = Uri.parse('$baseUrl$path').replace(queryParameters: query);
    return client.get(uri, headers: _headers());
  }

  Future<http.Response> post(String path, {Map<String, dynamic>? body}) async {
    final uri = Uri.parse('$baseUrl$path');
    return client.post(uri, headers: _headers(), body: jsonEncode(body));
  }

  Future<http.Response> put(String path, {Map<String, dynamic>? body}) async {
    final uri = Uri.parse('$baseUrl$path');
    return client.put(uri, headers: _headers(), body: jsonEncode(body));
  }

  Future<http.Response> delete(String path) async {
    final uri = Uri.parse('$baseUrl$path');
    return client.delete(uri, headers: _headers());
  }

  Map<String, String> _headers() {
    final h = <String, String>{'Content-Type': 'application/json'};
    if (accessToken != null) h['Authorization'] = 'Bearer $accessToken';
    return h;
  }
}
