class DirectMessage {
  final int id;
  final int senderId;
  final int receiverId;
  final String username;
  final String? avatarUrl;
  final String body;
  final DateTime createdAt;

  DirectMessage({
    required this.id,
    required this.senderId,
    required this.receiverId,
    required this.username,
    this.avatarUrl,
    required this.body,
    required this.createdAt,
  });

  factory DirectMessage.fromJson(Map<String, dynamic> json) => DirectMessage(
        id: json['id'],
        senderId: json['sender_id'],
        receiverId: json['receiver_id'],
        username: json['username'] ?? 'unknown',
        avatarUrl: json['avatar_url'],
        body: json['body'],
        createdAt: DateTime.parse(json['created_at']),
      );
}