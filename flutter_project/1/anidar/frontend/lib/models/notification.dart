class AppNotification {
  final int id;
  final int userId;
  final String type;
  final int? refId;
  final bool seen;
  final DateTime createdAt;

  AppNotification({
    required this.id,
    required this.userId,
    required this.type,
    this.refId,
    required this.seen,
    required this.createdAt,
  });

  factory AppNotification.fromJson(Map<String, dynamic> json) => AppNotification(
        id: json['id'],
        userId: json['user_id'],
        type: json['type'],
        refId: json['ref_id'],
        seen: json['seen'] ?? false,
        createdAt: DateTime.parse(json['created_at']),
      );
}