import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import '../providers/nest_provider.dart';
import '../providers/post_provider.dart';
import '../widgets/post_card.dart';
import '../theme.dart';

class NestDetailPage extends StatefulWidget {
  final String nestSlug;
  const NestDetailPage({super.key, required this.nestSlug});
  @override
  State<NestDetailPage> createState() => _NestDetailPageState();
}

class _NestDetailPageState extends State<NestDetailPage> {
  String _sort = 'hot';

  @override
  void initState() {
    super.initState();
    context.read<NestProvider>().fetchNestBySlug(widget.nestSlug);
    context.read<PostProvider>().fetchNestPosts(widget.nestSlug, sort: _sort);
  }

  @override
  Widget build(BuildContext context) {
    final nest = context.watch<NestProvider>().currentNest;
    final postProv = context.watch<PostProvider>();
    return Scaffold(
      backgroundColor: AppColors.bgDeep,
      appBar: AppBar(
        backgroundColor: AppColors.bgDeep,
        leading: IconButton(icon: const Icon(Icons.arrow_back_ios, size: 18), onPressed: () => Navigator.pop(context)),
        title: Row(children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
            decoration: BoxDecoration(border: Border.all(color: AppColors.neonPurple.withValues(alpha: 0.5), width: 1), borderRadius: BorderRadius.circular(3)),
            child: Text('n/', style: GoogleFonts.orbitron(color: AppColors.neonPurple, fontSize: 11, fontWeight: FontWeight.w700)),
          ),
          const SizedBox(width: 8),
          Text(widget.nestSlug.toUpperCase(), style: GoogleFonts.orbitron(color: AppColors.textPrimary, fontSize: 14, letterSpacing: 1)),
        ]),
        bottom: PreferredSize(preferredSize: const Size.fromHeight(1), child: Container(height: 1, color: AppColors.borderMuted)),
      ),
      body: Column(
        children: [
          if (nest != null)
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              decoration: const BoxDecoration(border: Border(bottom: BorderSide(color: AppColors.borderMuted, width: 1))),
              child: Row(children: [
                Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text(nest.name, style: GoogleFonts.rajdhani(color: AppColors.textPrimary, fontSize: 16, fontWeight: FontWeight.w600)),
                  Text('${nest.memberCount} members', style: GoogleFonts.rajdhani(color: AppColors.textDim, fontSize: 12)),
                ]),
                const Spacer(),
                GestureDetector(
                  onTap: () => context.read<NestProvider>().joinNest(nest.slug),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 7),
                    decoration: BoxDecoration(
                      border: Border.all(color: AppColors.neonCyan, width: 1),
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: Text('JOIN', style: GoogleFonts.orbitron(color: AppColors.neonCyan, fontSize: 10, letterSpacing: 2, fontWeight: FontWeight.w700)),
                  ),
                ),
              ]),
            ),
          // Sort chips
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
            child: Row(
              children: ['hot', 'new', 'top'].map((s) {
                final selected = _sort == s;
                return Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: GestureDetector(
                    onTap: () { setState(() => _sort = s); postProv.fetchNestPosts(widget.nestSlug, sort: s); },
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                      decoration: BoxDecoration(
                        color: selected ? AppColors.neonCyan.withValues(alpha: 0.1) : Colors.transparent,
                        borderRadius: BorderRadius.circular(4),
                        border: Border.all(color: selected ? AppColors.neonCyan : AppColors.borderMuted, width: 1),
                      ),
                      child: Text(s.toUpperCase(), style: GoogleFonts.orbitron(
                        color: selected ? AppColors.neonCyan : AppColors.textDim, fontSize: 10, letterSpacing: 1.5,
                      )),
                    ),
                  ),
                );
              }).toList(),
            ),
          ),
          Expanded(
            child: postProv.loading
                ? const Center(child: CircularProgressIndicator(color: AppColors.neonCyan))
                : postProv.posts.isEmpty
                    ? Center(child: Text('NO POSTS YET', style: GoogleFonts.orbitron(color: AppColors.textDim, fontSize: 12, letterSpacing: 2)))
                    : ListView.builder(
                        padding: const EdgeInsets.only(top: 4, bottom: 80),
                        itemCount: postProv.posts.length,
                        itemBuilder: (ctx, i) => PostCard(post: postProv.posts[i]),
                      ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => Navigator.pushNamed(context, '/n/${widget.nestSlug}/chat'),
        backgroundColor: AppColors.neonPurple,
        child: const Icon(Icons.chat_bubble_outline_rounded, color: Colors.white),
      ),
    );
  }
}
