import 'dart:convert';
import 'package:flutter/material.dart';
import '../models/conversation.dart';
import '../services/api_service.dart';
import 'auth_provider.dart';

class ConversationsProvider with ChangeNotifier {
  final ApiService api = ApiService();
  List<Conversation> _conversations = [];
  List<Map<String, dynamic>> _searchResults = [];
  bool _loading = false;
  bool _searching = false;
  String _searchQuery = '';

  List<Conversation> get conversations => _conversations;
  List<Map<String, dynamic>> get searchResults => _searchResults;
  bool get loading => _loading;
  bool get searching => _searching;
  String get searchQuery => _searchQuery;

  void updateAuth(AuthProvider auth) {
    api.accessToken = auth.accessToken;
  }

  Future<void> fetchConversations() async {
    _loading = true;
    notifyListeners();
    try {
      final res = await api.get('/direct/conversations');
      if (res.statusCode == 200) {
        final List list = jsonDecode(res.body);
        _conversations = list.map((e) => Conversation.fromJson(e)).toList();
      }
    } catch (e) {
      debugPrint('Error fetching conversations: $e');
    }
    _loading = false;
    notifyListeners();
  }

  Future<void> searchUsers(String query) async {
    _searchQuery = query;
    if (query.trim().isEmpty) {
      _searchResults = [];
      _searching = false;
      notifyListeners();
      return;
    }
    _searching = true;
    notifyListeners();
    try {
      final res = await api.get('/users/search', query: {'q': query.trim()});
      if (res.statusCode == 200) {
        final List list = jsonDecode(res.body);
        _searchResults = list.cast<Map<String, dynamic>>();
      }
    } catch (e) {
      debugPrint('Error searching users: $e');
    }
    _searching = false;
    notifyListeners();
  }

  void clearSearch() {
    _searchQuery = '';
    _searchResults = [];
    notifyListeners();
  }

  /// Called after sending/receiving a message to update the conversations list
  void updateLastMessage(int otherUserId, String otherUsername, String body, DateTime at) {
    final idx = _conversations.indexWhere((c) => c.otherUserId == otherUserId);
    final updated = Conversation(
      otherUserId: otherUserId,
      otherUsername: otherUsername,
      lastMessage: body,
      lastMessageAt: at,
      unreadCount: 0,
    );
    if (idx >= 0) {
      _conversations[idx] = updated;
    } else {
      _conversations.insert(0, updated);
    }
    _conversations.sort((a, b) => b.lastMessageAt.compareTo(a.lastMessageAt));
    notifyListeners();
  }
}
