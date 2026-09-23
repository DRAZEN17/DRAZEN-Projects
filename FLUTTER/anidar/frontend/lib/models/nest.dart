class Nest {
  final int id;
  final String slug;
  final String name;
  final String? description;
  final int creatorId;
  final int memberCount;
  final DateTime createdAt;

  Nest({
    required this.id,
    required this.slug,
    required this.name,
    this.description,
    required this.creatorId,
    required this.memberCount,
    required this.createdAt,
  });

  factory Nest.fromJson(Map<String, dynamic> json) => Nest(
        id: json['id'],
        slug: json['slug'],
        name: json['name'],
        description: json['description'],
        creatorId: json['creator_id'],
        memberCount: json['member_count'] ?? 0,
        createdAt: DateTime.parse(json['created_at']),
      );
}