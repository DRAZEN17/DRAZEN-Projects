import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import '../providers/post_provider.dart';
import '../widgets/comment_thread.dart';
import '../theme.dart';

class PostDetailPage extends StatefulWidget {
  final String nestSlug;
  final String postId;
  const PostDetailPage({super.key, required this.nestSlug, required this.postId});
  @override
  State<PostDetailPage> createState() => _PostDetailPageState();
}

class _PostDetailPageState extends State<PostDetailPage> {
  @override
  void initState() {
    super.initState();
    context.read<PostProvider>().fetchPost(int.parse(widget.postId));
  }

  @override
  Widget build(BuildContext context) {
    final postProv = context.watch<PostProvider>();
    final post = postProv.currentPost;
    if (postProv.loading || post == null) {
      return const Scaffold(backgroundColor: AppColors.bgDeep, body: Center(child: CircularProgressIndicator(color: AppColors.neonCyan)));
    }
    return Scaffold(
      backgroundColor: AppColors.bgDeep,
      appBar: AppBar(
        backgroundColor: AppColors.bgDeep,
        leading: IconButton(icon: const Icon(Icons.arrow_back_ios, size: 18), onPressed: () => Navigator.pop(context)),
        title: Text('POST', style: Theme.of(context).appBarTheme.titleTextStyle),
        bottom: PreferredSize(preferredSize: const Size.fromHeight(1), child: Container(height: 1, color: AppColors.borderMuted)),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(post.title, style: Theme.of(context).textTheme.headlineMedium?.copyWith(height: 1.3)),
          const SizedBox(height: 12),
          Row(children: [
            Container(width: 22, height: 22,
              decoration: BoxDecoration(shape: BoxShape.circle, border: Border.all(color: AppColors.neonCyan, width: 1)),
              child: Center(child: Text(post.authorUsername[0].toUpperCase(),
                style: GoogleFonts.orbitron(color: AppColors.neonCyan, fontSize: 9, fontWeight: FontWeight.w700)))),
            const SizedBox(width: 8),
            Text(post.authorUsername, style: GoogleFonts.rajdhani(color: AppColors.neonCyan, fontSize: 13, fontWeight: FontWeight.w600)),
          ]),
          if (post.body != null && post.body!.isNotEmpty) ...[
            const SizedBox(height: 20),
            const NeonDivider(),
            const SizedBox(height: 16),
            Text(post.body!, style: GoogleFonts.rajdhani(color: AppColors.textSecondary, fontSize: 15, height: 1.7)),
          ],
          const SizedBox(height: 24),
          const NeonDivider(),
          const SizedBox(height: 16),
          Text('COMMENTS', style: GoogleFonts.orbitron(color: AppColors.textDim, fontSize: 10, letterSpacing: 3)),
          const SizedBox(height: 12),
          CommentThread(postId: post.id),
        ]),
      ),
    );
  }
}
