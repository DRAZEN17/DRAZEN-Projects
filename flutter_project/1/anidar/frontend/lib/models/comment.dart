class Comment {
  final int id;
  final int postId;
  final int authorId;
  final String authorUsername;
  final String? authorAvatarUrl;
  final int? parentId;
  final String body;
  final int score;
  final DateTime createdAt;
  List<Comment>? replies;

  Comment({
    required this.id,
    required this.postId,
    required this.authorId,
    required this.authorUsername,
    this.authorAvatarUrl,
    this.parentId,
    required this.body,
    required this.score,
    required this.createdAt,
    this.replies,
  });

  factory Comment.fromJson(Map<String, dynamic> json) => Comment(
        id: json['id'],
        postId: json['post_id'],
        authorId: json['author_id'],
        authorUsername: json['username'] ?? 'unknown',
        authorAvatarUrl: json['avatar_url'],
        parentId: json['parent_id'],
        body: json['body'],
        score: json['score'] ?? 0,
        createdAt: DateTime.parse(json['created_at']),
      );
}