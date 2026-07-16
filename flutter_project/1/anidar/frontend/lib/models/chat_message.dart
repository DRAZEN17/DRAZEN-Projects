class ChatMessage {
  final int id;
  final int nestId;
  final int senderId;
  final String username;
  final String? avatarUrl;
  final String body;
  final DateTime createdAt;

  ChatMessage({
    required this.id,
    required this.nestId,
    required this.senderId,
    required this.username,
    this.avatarUrl,
    required this.body,
    required this.createdAt,
  });

  factory ChatMessage.fromJson(Map<String, dynamic> json) => ChatMessage(
        id: json['id'],
        nestId: json['nest_id'],
        senderId: json['sender_id'],
        username: json['username'],
        avatarUrl: json['avatar_url'],
        body: json['body'],
        createdAt: DateTime.parse(json['created_at']),
      );
}