import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../models/post.dart';
import '../theme.dart';

class PostCard extends StatefulWidget {
  final Post post;
  const PostCard({super.key, required this.post});
  @override
  State<PostCard> createState() => _PostCardState();
}

class _PostCardState extends State<PostCard> {
  int? _vote;

  @override
  Widget build(BuildContext context) {
    final post = widget.post;
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 5),
      decoration: BoxDecoration(
        color: AppColors.bgCard,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: AppColors.borderMuted, width: 1),
      ),
      child: InkWell(
        onTap: () => Navigator.pushNamed(context, '/n/${post.nestSlug ?? ''}/post/${post.id}'),
        borderRadius: BorderRadius.circular(8),
        splashColor: AppColors.neonCyan.withValues(alpha: 0.05),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Vote column
              Column(children: [
                _voteBtn(Icons.keyboard_arrow_up_rounded, 1),
                Padding(
                  padding: const EdgeInsets.symmetric(vertical: 2),
                  child: Text(
                    '${post.score + (_vote ?? 0)}',
                    style: GoogleFonts.orbitron(
                      color: _vote == 1 ? AppColors.neonCyan : _vote == -1 ? AppColors.neonPink : AppColors.textSecondary,
                      fontSize: 12, fontWeight: FontWeight.w700,
                    ),
                  ),
                ),
                _voteBtn(Icons.keyboard_arrow_down_rounded, -1),
              ]),
              const SizedBox(width: 12),
              // Content
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Nest tag (shows in general feed)
                    if (post.nestSlug != null && post.nestSlug!.isNotEmpty)
                      Padding(
                        padding: const EdgeInsets.only(bottom: 5),
                        child: GestureDetector(
                          onTap: () => Navigator.pushNamed(context, '/n/${post.nestSlug}'),
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                            decoration: BoxDecoration(
                              color: AppColors.neonPurple.withValues(alpha: 0.08),
                              borderRadius: BorderRadius.circular(3),
                              border: Border.all(color: AppColors.neonPurple.withValues(alpha: 0.3), width: 1),
                            ),
                            child: Text(
                              'n/${post.nestSlug}',
                              style: GoogleFonts.orbitron(color: AppColors.neonPurple, fontSize: 9, letterSpacing: 1),
                            ),
                          ),
                        ),
                      ),
                    Text(post.title,
                      style: Theme.of(context).textTheme.bodyLarge?.copyWith(fontWeight: FontWeight.w600, height: 1.3)),
                    const SizedBox(height: 8),
                    Row(children: [
                      // Author
                      GestureDetector(
                        onTap: () => Navigator.pushNamed(context, '/profile/${post.authorUsername}'),
                        child: Row(children: [
                          Container(
                            width: 18, height: 18,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              border: Border.all(color: AppColors.neonCyan, width: 1),
                            ),
                            child: Center(child: Text(
                              post.authorUsername[0].toUpperCase(),
                              style: GoogleFonts.orbitron(color: AppColors.neonCyan, fontSize: 8, fontWeight: FontWeight.w700),
                            )),
                          ),
                          const SizedBox(width: 5),
                          Text(post.authorUsername,
                            style: GoogleFonts.rajdhani(color: AppColors.neonCyan, fontSize: 12, fontWeight: FontWeight.w600)),
                        ]),
                      ),
                      const SizedBox(width: 12),
                      const Icon(Icons.chat_bubble_outline, color: AppColors.textDim, size: 12),
                      const SizedBox(width: 3),
                      Text('${post.commentCount}',
                        style: GoogleFonts.rajdhani(color: AppColors.textDim, fontSize: 12)),
                    ]),
                  ],
                ),
              ),
              const Icon(Icons.chevron_right, color: AppColors.textDim, size: 18),
            ],
          ),
        ),
      ),
    );
  }

  Widget _voteBtn(IconData icon, int dir) {
    final active = _vote == dir;
    final color = dir == 1 ? AppColors.neonCyan : AppColors.neonPink;
    return GestureDetector(
      onTap: () => setState(() => _vote = _vote == dir ? null : dir),
      child: Icon(icon, color: active ? color : AppColors.textDim, size: 22),
    );
  }
}
