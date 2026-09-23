import 'dart:convert';
import 'package:flutter/material.dart';
import '../models/nest.dart';
import '../services/api_service.dart';
import 'auth_provider.dart';

class NestProvider with ChangeNotifier {
  final ApiService api = ApiService();
  List<Nest> _popularNests = [];
  Nest? _currentNest;
  bool _loading = false;

  List<Nest> get popularNests => _popularNests;
  Nest? get currentNest => _currentNest;
  bool get loading => _loading;

  void updateAuth(AuthProvider auth) {
    api.accessToken = auth.accessToken;
  }

  Future<void> fetchPopularNests() async {
    _loading = true;
    notifyListeners();
    try {
      final res = await api.get('/nests');
      if (res.statusCode == 200) {
        final List list = jsonDecode(res.body);
        _popularNests = list.map((e) => Nest.fromJson(e)).toList();
      }
    } catch (e) {
      debugPrint('Error fetching nests: $e');
    }
    _loading = false;
    notifyListeners();
  }

  Future<void> fetchNestBySlug(String slug) async {
    _loading = true;
    notifyListeners();
    try {
      final res = await api.get('/nests/$slug');
      if (res.statusCode == 200) {
        _currentNest = Nest.fromJson(jsonDecode(res.body));
      }
    } catch (e) {
      debugPrint('Error fetching nest: $e');
    }
    _loading = false;
    notifyListeners();
  }

  Future<void> joinNest(String slug) async {
    try {
      await api.post('/nests/$slug/join');
      await fetchNestBySlug(slug);
    } catch (e) {
      debugPrint('Join error: $e');
    }
  }

  Future<void> leaveNest(String slug) async {
    try {
      await api.delete('/nests/$slug/join');
      await fetchNestBySlug(slug);
    } catch (e) {
      debugPrint('Leave error: $e');
    }
  }
}