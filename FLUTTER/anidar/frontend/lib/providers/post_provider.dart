import 'dart:convert';
import 'package:flutter/material.dart';
import '../models/post.dart';
import '../services/api_service.dart';
import 'auth_provider.dart';

class PostProvider with ChangeNotifier {
  final ApiService api = ApiService();
  List<Post> _posts = [];
  Post? _currentPost;
  bool _loading = false;

  List<Post> get posts => _posts;
  Post? get currentPost => _currentPost;
  bool get loading => _loading;

  void updateAuth(AuthProvider auth) {
    api.accessToken = auth.accessToken;
  }

  Future<void> fetchFeed({String sort = 'hot'}) async {
    _loading = true;
    notifyListeners();
    try {
      final res = await api.get('/feed', query: {'sort': sort});
      if (res.statusCode == 200) {
        final List list = jsonDecode(res.body);
        _posts = list.map((e) => Post.fromJson(e)).toList();
      } else {
        debugPrint('Feed error ${res.statusCode}: ${res.body}');
      }
    } catch (e) {
      debugPrint('fetchFeed error: $e');
    }
    _loading = false;
    notifyListeners();
  }

  Future<void> fetchNestPosts(String slug, {String sort = 'hot'}) async {
    _loading = true;
    notifyListeners();
    try {
      final res = await api.get('/nests/$slug/posts', query: {'sort': sort});
      if (res.statusCode == 200) {
        final List list = jsonDecode(res.body);
        _posts = list.map((e) => Post.fromJson(e)).toList();
      } else {
        debugPrint('NestPosts error ${res.statusCode}: ${res.body}');
      }
    } catch (e) {
      debugPrint('fetchNestPosts error: $e');
    }
    _loading = false;
    notifyListeners();
  }

  Future<void> fetchPost(int id) async {
    _loading = true;
    notifyListeners();
    try {
      final res = await api.get('/posts/$id');
      if (res.statusCode == 200) {
        _currentPost = Post.fromJson(jsonDecode(res.body));
      }
    } catch (e) {
      debugPrint('fetchPost error: $e');
    }
    _loading = false;
    notifyListeners();
  }
}
