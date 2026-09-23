class Post {
  final int id;
  final int nestId;
  final int authorId;
  final String authorUsername;
  final String? authorAvatarUrl;
  final String title;
  final String? body;
  final String type;
  final String? url;
  final int score;
  final int commentCount;
  final DateTime createdAt;
  final String? nestSlug;
  final String? nestName;

  Post({
    required this.id,
    required this.nestId,
    required this.authorId,
    required this.authorUsername,
    this.authorAvatarUrl,
    required this.title,
    this.body,
    required this.type,
    this.url,
    required this.score,
    required this.commentCount,
    required this.createdAt,
    this.nestSlug,
    this.nestName,
  });

  factory Post.fromJson(Map<String, dynamic> json) => Post(
    id: json['id'],
    nestId: json['nest_id'],
    authorId: json['author_id'],
    // backend returns author_username OR username — handle both
    authorUsername: json['author_username'] ?? json['username'] ?? 'unknown',
    authorAvatarUrl: json['avatar_url'],
    title: json['title'],
    body: json['body'],
    type: json['type'] ?? 'text',
    url: json['url'],
    score: json['score'] ?? 0,
    commentCount: int.tryParse('${json['comment_count'] ?? 0}') ?? 0,
    createdAt: DateTime.parse(json['created_at']),
    nestSlug: json['nest_slug'],
    nestName: json['nest_name'],
  );
}
