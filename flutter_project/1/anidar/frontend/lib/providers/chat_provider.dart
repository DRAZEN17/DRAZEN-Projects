import 'dart:convert';
import 'package:flutter/material.dart';
import '../models/chat_message.dart';
import '../services/api_service.dart';
import '../services/socket_service.dart';
import 'auth_provider.dart';

class ChatProvider with ChangeNotifier {
  final ApiService api = ApiService();
  List<ChatMessage> _messages = [];
  SocketService? _socketService;
  bool _loadingHistory = false;

  List<ChatMessage> get messages => _messages;
  bool get loadingHistory => _loadingHistory;

  void updateAuth(AuthProvider auth) {
    api.accessToken = auth.accessToken;
  }

  void connectToChat(String nestId) {
    if (_socketService != null) _socketService!.dispose();
    _socketService = SocketService(api.accessToken!);
    _socketService!.connect();
    _socketService!.joinRoom(nestId);
    _socketService!.onNewMessage((data) {
      final msg = ChatMessage.fromJson(data);
      _messages.add(msg);
      notifyListeners();
    });
    fetchHistory(nestId);
  }

  Future<void> fetchHistory(String nestId, {int limit = 50}) async {
    _loadingHistory = true;
    notifyListeners();
    try {
      final res = await api.get('/chat/$nestId/messages', query: {'limit': limit.toString()});
      if (res.statusCode == 200) {
        final List list = jsonDecode(res.body);
        _messages = list.map((e) => ChatMessage.fromJson(e)).toList();
      }
    } catch (e) {}
    _loadingHistory = false;
    notifyListeners();
  }

  void sendMessage(String nestId, String body) {
    _socketService?.sendMessage(nestId, body);
  }

  void leaveChat(String nestId) {
    _socketService?.leaveRoom(nestId);
    _socketService?.dispose();
    _socketService = null;
    _messages.clear();
  }

  @override
  void dispose() {
    _socketService?.dispose();
    super.dispose();
  }
}