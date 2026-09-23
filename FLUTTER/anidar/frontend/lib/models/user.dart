class User {
  final int id;
  final String username;
  final String email;
  final String? avatarUrl;
  final String? bio;
  final DateTime createdAt;

  User({
    required this.id,
    required this.username,
    required this.email,
    this.avatarUrl,
    this.bio,
    required this.createdAt,
  });

  factory User.fromJson(Map<String, dynamic> json) => User(
    id: json['id'] ?? 0,
    username: json['username'] ?? 'unknown',
    email: json['email'] ?? '',
    avatarUrl: json['avatar_url'],
    bio: json['bio'],
    createdAt: DateTime.tryParse(json['created_at'] ?? '') ?? DateTime.now(),
  );

  Map<String, dynamic> toJson() => {
        'id': id,
        'username': username,
        'email': email,
        'avatar_url': avatarUrl,
        'bio': bio,
        'created_at': createdAt.toIso8601String(),
      };
}