import 'package:flutter/foundation.dart';
import 'package:socket_io_client/socket_io_client.dart' as IO;
import '../config.dart';

class SocketService {
  IO.Socket? socket;
  final String token;

  SocketService(this.token);

  // Use localhost in debug mode, production URL otherwise
  static String get socketUrl {
    if (kDebugMode && kIsWeb) {
      return 'http://localhost:3001';       // same as your REST baseUrl
    }
    return Config.socketUrl;                // production: https://anidar-api.railway.app
  }

  void connect() {
    socket = IO.io(socketUrl, <String, dynamic>{
      'transports': ['websocket'],
      'auth': {'token': token},
      'autoConnect': false,   // we'll call connect() manually
    });

    // Listen to connect event to know when it's ready
    socket!.onConnect((_) {

      print('Socket connected to $socketUrl');
    });
    socket!.onDisconnect((_) => print('Socket disconnected'));
    socket!.onConnectError((err) => print('Socket connect error: $err'));
    socket!.onConnectTimeout((_) => print('Socket connection timeout'));

    socket!.connect();
  }

  void joinRoom(String nestId) => socket?.emit('join_room', nestId);
  void leaveRoom(String nestId) => socket?.emit('leave_room', nestId);
  void sendMessage(String nestId, String body) =>
      socket?.emit('send_message', {'nestId': nestId, 'body': body});
  void onNewMessage(Function(dynamic) callback) =>
      socket?.on('new_message', callback);

  void dispose() {
    socket?.disconnect();
    socket?.dispose();
  }
}