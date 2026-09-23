import 'dart:async';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:socket_io_client/socket_io_client.dart';
import '../models/direct_message.dart';
import '../services/api_service.dart';
import '../services/socket_service.dart';
import 'auth_provider.dart';

class DirectChatProvider with ChangeNotifier {
  final ApiService api = ApiService();

  // Cache messages per userId so going back and reopening is instant
  final Map<int, List<DirectMessage>> _cache = {};

  SocketService? _socketService;
  bool _loadingHistory = false;
  bool _connected = false;
  int? _currentOtherUserId;
  Timer? _pollTimer;

  List<DirectMessage> get messages =>
      _currentOtherUserId != null ? (_cache[_currentOtherUserId!] ?? []) : [];
  bool get loadingHistory => _loadingHistory;

  void updateAuth(AuthProvider auth) {
    api.accessToken = auth.accessToken;
  }

  void connectToChat(int otherUserId) {
    // Already connected to same user — just refresh, don't reset
    if (_connected && _currentOtherUserId == otherUserId) {
      _pollMessages(otherUserId); // gentle refresh
      return;
    }

    // Switching to a different user — stop old poll but keep cache
    _stopPolling();
    _socketService?.dispose();
    _socketService = null;
    _connected = false;

    _currentOtherUserId = otherUserId;
    _connected = true;

    // Show cached messages instantly if we have them
    if (_cache.containsKey(otherUserId)) {
      notifyListeners();
    }

    // Fetch fresh history from server
    fetchHistory(otherUserId);

    // Connect socket for real-time
    _connectSocket(otherUserId);

    // HTTP polling every 3s as reliable fallback
    _startPolling(otherUserId);
  }

  void _connectSocket(int otherUserId) {
    if (api.accessToken == null) return;
    try {
      _socketService = SocketService(api.accessToken!);
      _socketService!.connect();

      _socketService!.socket?.onConnect((_) {
        _socketService!.socket!.emit('join_dm', otherUserId);
      });

      _socketService!.socket?.on('new_dm', (data) {
        try {
          final msg = DirectMessage.fromJson(
            data is String
                ? jsonDecode(data)
                : Map<String, dynamic>.from(data),
          );
          _addMessage(msg);
        } catch (e) {
          debugPrint('DM socket parse error: $e');
        }
      });
    } catch (e) {
      debugPrint('Socket init failed: $e — polling will handle it');
    }
  }

  void _addMessage(DirectMessage msg) {
    final userId = _currentOtherUserId;
    if (userId == null) return;
    _cache.putIfAbsent(userId, () => []);
    final list = _cache[userId]!;
    // Deduplicate by id — also replace any optimistic temp message
    final existingIdx = list.indexWhere((m) => m.id == msg.id);
    if (existingIdx >= 0) {
      list[existingIdx] = msg;
    } else {
      // Remove temp optimistic message with same body if present
      list.removeWhere((m) => m.id > 1_000_000_000_000 && m.body == msg.body);
      list.add(msg);
      list.sort((a, b) => a.createdAt.compareTo(b.createdAt));
    }
    notifyListeners();
  }

  void _startPolling(int otherUserId) {
    _pollTimer = Timer.periodic(const Duration(seconds: 3), (_) {
      if (_connected && _currentOtherUserId == otherUserId) {
        _pollMessages(otherUserId);
      }
    });
  }

  void _stopPolling() {
    _pollTimer?.cancel();
    _pollTimer = null;
  }

  Future<void> _pollMessages(int otherUserId) async {
    try {
      final res = await api.get('/direct/$otherUserId/messages',
          query: {'limit': '50'});
      if (res.statusCode == 200) {
        final List list = jsonDecode(res.body);
        final fetched = list.map((e) => DirectMessage.fromJson(e)).toList();
        final current = _cache[otherUserId] ?? [];
        // Only update if something actually changed
        if (fetched.length != current.length ||
            (fetched.isNotEmpty &&
                (current.isEmpty || fetched.last.id != current.last.id))) {
          _cache[otherUserId] = fetched;
          if (_currentOtherUserId == otherUserId) notifyListeners();
        }
      }
    } catch (e) {
      debugPrint('Poll error: $e');
    }
  }

  Future<void> fetchHistory(int otherUserId) async {
    _loadingHistory = true;
    notifyListeners();
    try {
      final res = await api.get('/direct/$otherUserId/messages',
          query: {'limit': '50'});
      if (res.statusCode == 200) {
        final List list = jsonDecode(res.body);
        _cache[otherUserId] =
            list.map((e) => DirectMessage.fromJson(e)).toList();
      }
    } catch (e) {
      debugPrint('fetchHistory error: $e');
    }
    _loadingHistory = false;
    notifyListeners();
  }

  Future<void> sendMessage(int toUserId, String body) async {
    if (body.trim().isEmpty) return;

    // Optimistic bubble — appears instantly
    final tempId = DateTime.now().millisecondsSinceEpoch;
    final temp = DirectMessage(
      id: tempId,
      senderId: 0, // 0 = "me" flag, detected in UI
      receiverId: toUserId,
      username: 'me',
      body: body.trim(),
      createdAt: DateTime.now(),
    );
    _addMessage(temp);

    // Try socket (fast path)
    _socketService?.socket?.emit('send_dm', {'to': toUserId, 'body': body.trim()});

    // HTTP fallback (reliable path) — replaces temp with real message
    try {
      final res = await api.post('/direct/$toUserId/send',
          body: {'body': body.trim()});
      if (res.statusCode == 201) {
        final real = DirectMessage.fromJson(jsonDecode(res.body));
        // Remove temp and add real
        _cache[toUserId]?.removeWhere((m) => m.id == tempId);
        _addMessage(real);
      }
    } catch (e) {
      debugPrint('HTTP send error: $e');
    }
  }

  /// Called when navigating AWAY from chat — keep messages, stop polling
  void pauseChat() {
    _stopPolling();
    _socketService?.dispose();
    _socketService = null;
    _connected = false;
    // Do NOT clear _cache or _currentOtherUserId
  }

  /// Called when screen is fully done (e.g. app restart) — full cleanup
  void leaveChat() {
    _stopPolling();
    _socketService?.dispose();
    _socketService = null;
    _connected = false;
    _currentOtherUserId = null;
    // Keep _cache so messages survive navigation
  }

  void clearCache() {
    _cache.clear();
    notifyListeners();
  }

  @override
  void dispose() {
    _stopPolling();
    _socketService?.dispose();
    super.dispose();
  }
}
