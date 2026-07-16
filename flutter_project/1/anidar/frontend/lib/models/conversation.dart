class Conversation {
  final int otherUserId;
  final String otherUsername;
  final String? otherAvatarUrl;
  final String lastMessage;
  final DateTime lastMessageAt;
  final int unreadCount;
  final bool isOnline;

  Conversation({
    required this.otherUserId,
    required this.otherUsername,
    this.otherAvatarUrl,
    required this.lastMessage,
    required this.lastMessageAt,
    this.unreadCount = 0,
    this.isOnline = false,
  });

  factory Conversation.fromJson(Map<String, dynamic> json) => Conversation(
    otherUserId: json['other_user_id'],
    otherUsername: json['other_username'] ?? 'Unknown',
    otherAvatarUrl: json['other_avatar_url'],
    lastMessage: json['last_message'] ?? '',
    lastMessageAt: DateTime.parse(json['last_message_at']),
    unreadCount: json['unread_count'] ?? 0,
    isOnline: json['is_online'] ?? false,
  );
}
