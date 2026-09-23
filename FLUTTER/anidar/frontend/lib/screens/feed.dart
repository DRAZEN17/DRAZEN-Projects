import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import '../providers/auth_provider.dart';
import '../providers/post_provider.dart';
import '../widgets/post_card.dart';
import '../theme.dart';
import 'profile.dart';
import 'settings.dart';
import 'conversations.dart';
import 'create_post.dart';

class FeedPage extends StatefulWidget {
  const FeedPage({super.key});
  @override
  State<FeedPage> createState() => _FeedPageState();
}

class _FeedPageState extends State<FeedPage> {
  int _currentIndex = 0;
  String _sort = 'new';

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) context.read<PostProvider>().fetchFeed(sort: _sort);
    });
  }

  void _openCreatePost() async {
    final created = await Navigator.push(context,
      MaterialPageRoute(builder: (_) => const CreatePostPage()));
    if (created == true && mounted) {
      context.read<PostProvider>().fetchFeed(sort: _sort);
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.read<AuthProvider>();
    return Scaffold(
      backgroundColor: AppColors.bgDeep,
      appBar: _currentIndex == 0 ? _buildAppBar() : null,
      body: IndexedStack(
        index: _currentIndex,
        children: [
          _FeedContent(sort: _sort, onSortChanged: (s) {
            setState(() => _sort = s);
            context.read<PostProvider>().fetchFeed(sort: s);
          }),
          const ConversationsPage(),
          ProfilePage(username: auth.user!.username),
          const SettingsPage(),
        ],
      ),
      drawer: _currentIndex == 0 ? _buildDrawer() : null,
      floatingActionButton: _currentIndex == 0
          ? FloatingActionButton(
              onPressed: _openCreatePost,
              backgroundColor: AppColors.neonPink,
              child: const Icon(Icons.add_rounded, color: Colors.white, size: 28),
            )
          : null,
      bottomNavigationBar: _buildBottomNav(),
    );
  }

  AppBar _buildAppBar() => AppBar(
    backgroundColor: AppColors.bgDeep,
    title: Row(children: [
      Container(
        width: 28, height: 28,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          border: Border.all(color: AppColors.neonCyan, width: 1.5),
          boxShadow: [BoxShadow(color: AppColors.neonCyan.withValues(alpha: 0.3), blurRadius: 8)],
        ),
        child: const Icon(Icons.hub_rounded, color: AppColors.neonCyan, size: 14),
      ),
      const SizedBox(width: 10),
      Text('ANIDAR', style: Theme.of(context).appBarTheme.titleTextStyle),
    ]),
    actions: [
      IconButton(
        icon: const Icon(Icons.refresh_rounded, color: AppColors.textSecondary, size: 22),
        onPressed: () => context.read<PostProvider>().fetchFeed(sort: _sort),
      ),
    ],
    bottom: PreferredSize(preferredSize: const Size.fromHeight(1),
      child: Container(height: 1, color: AppColors.borderMuted)),
  );

  Widget _buildDrawer() => Drawer(
    backgroundColor: AppColors.bgCard,
    child: Column(children: [
      Container(
        width: double.infinity,
        padding: const EdgeInsets.fromLTRB(20, 56, 20, 24),
        decoration: BoxDecoration(
          border: Border(bottom: BorderSide(color: AppColors.neonCyan.withValues(alpha: 0.2), width: 1))),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text('YOUR NESTS', style: GoogleFonts.orbitron(
            color: AppColors.neonCyan, fontSize: 13, letterSpacing: 3,
            shadows: [Shadow(color: AppColors.neonCyan.withValues(alpha: 0.6), blurRadius: 8)])),
          const SizedBox(height: 4),
          Text('Active communities', style: GoogleFonts.rajdhani(color: AppColors.textDim, fontSize: 12, letterSpacing: 1)),
        ]),
      ),
      Expanded(
        child: ListView(padding: EdgeInsets.zero, children: [
          _drawerNest('general', Icons.public_rounded, AppColors.neonCyan),
          _drawerNest('flutter', Icons.code_rounded, AppColors.neonPurple),
          _drawerNest('anime', Icons.movie_filter_rounded, AppColors.neonPink),
          const Divider(color: AppColors.borderMuted, height: 1),
          ListTile(
            tileColor: Colors.transparent,
            leading: const Icon(Icons.add_circle_outline, color: AppColors.neonAmber, size: 22),
            title: Text('Create Post', style: GoogleFonts.rajdhani(
              color: AppColors.neonAmber, fontSize: 15, fontWeight: FontWeight.w600)),
            onTap: () { Navigator.pop(context); _openCreatePost(); },
          ),
        ]),
      ),
    ]),
  );

  Widget _drawerNest(String slug, IconData icon, Color color) => ListTile(
    tileColor: Colors.transparent,
    contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 4),
    leading: Container(
      width: 36, height: 36,
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(6),
        border: Border.all(color: color.withValues(alpha: 0.3), width: 1),
      ),
      child: Icon(icon, color: color, size: 18),
    ),
    title: Text('n/$slug', style: GoogleFonts.rajdhani(
      color: AppColors.textPrimary, fontSize: 15, fontWeight: FontWeight.w600)),
    trailing: const Icon(Icons.chevron_right, color: AppColors.textDim, size: 16),
    onTap: () { Navigator.pop(context); Navigator.pushNamed(context, '/n/$slug'); },
  );

  Widget _buildBottomNav() => Container(
    decoration: const BoxDecoration(
      color: AppColors.bgCard,
      border: Border(top: BorderSide(color: AppColors.borderMuted, width: 1)),
    ),
    child: BottomNavigationBar(
      currentIndex: _currentIndex,
      onTap: (i) => setState(() => _currentIndex = i),
      backgroundColor: Colors.transparent,
      elevation: 0,
      type: BottomNavigationBarType.fixed,
      selectedItemColor: AppColors.neonCyan,
      unselectedItemColor: AppColors.textDim,
      selectedLabelStyle: GoogleFonts.orbitron(fontSize: 9, letterSpacing: 1),
      unselectedLabelStyle: GoogleFonts.orbitron(fontSize: 9, letterSpacing: 1),
      items: const [
        BottomNavigationBarItem(icon: Icon(Icons.grid_view_rounded), label: 'FEED'),
        BottomNavigationBarItem(icon: Icon(Icons.chat_bubble_outline_rounded), label: 'CHATS'),
        BottomNavigationBarItem(icon: Icon(Icons.person_outline_rounded), label: 'PROFILE'),
        BottomNavigationBarItem(icon: Icon(Icons.settings_outlined), label: 'SETTINGS'),
      ],
    ),
  );
}

class _FeedContent extends StatelessWidget {
  final String sort;
  final ValueChanged<String> onSortChanged;
  const _FeedContent({required this.sort, required this.onSortChanged});

  @override
  Widget build(BuildContext context) {
    return Column(children: [
      // Sort bar
      Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
        decoration: const BoxDecoration(
          border: Border(bottom: BorderSide(color: AppColors.borderMuted, width: 1))),
        child: Row(
          children: ['new', 'hot', 'top'].map((s) {
            final selected = sort == s;
            return Padding(
              padding: const EdgeInsets.only(right: 8),
              child: GestureDetector(
                onTap: () => onSortChanged(s),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                  decoration: BoxDecoration(
                    color: selected ? AppColors.neonCyan.withValues(alpha: 0.1) : Colors.transparent,
                    borderRadius: BorderRadius.circular(4),
                    border: Border.all(
                      color: selected ? AppColors.neonCyan : AppColors.borderMuted, width: 1),
                    boxShadow: selected
                        ? [BoxShadow(color: AppColors.neonCyan.withValues(alpha: 0.15), blurRadius: 8)]
                        : null,
                  ),
                  child: Text(s.toUpperCase(), style: GoogleFonts.orbitron(
                    color: selected ? AppColors.neonCyan : AppColors.textDim,
                    fontSize: 10, letterSpacing: 1.5,
                    fontWeight: selected ? FontWeight.w700 : FontWeight.w400)),
                ),
              ),
            );
          }).toList(),
        ),
      ),
      // Posts list
      Expanded(
        child: Consumer<PostProvider>(
          builder: (_, postProv, __) {
            if (postProv.loading) {
              return const Center(child: CircularProgressIndicator(color: AppColors.neonCyan));
            }
            if (postProv.posts.isEmpty) {
              return Center(child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
                Icon(Icons.hub_outlined, color: AppColors.neonCyan.withValues(alpha: 0.3), size: 56),
                const SizedBox(height: 16),
                Text('NO POSTS YET', style: GoogleFonts.orbitron(
                  color: AppColors.textDim, fontSize: 13, letterSpacing: 2)),
                const SizedBox(height: 8),
                Text('Tap + to create the first post',
                  style: GoogleFonts.rajdhani(color: AppColors.textDim, fontSize: 14)),
                const SizedBox(height: 24),
                GestureDetector(
                  onTap: () {
                    // Navigate to create post
                    final feedState = context.findAncestorStateOfType<_FeedPageState>();
                    feedState?._openCreatePost();
                  },
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 10),
                    decoration: BoxDecoration(
                      border: Border.all(color: AppColors.neonPink, width: 1),
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: Text('CREATE POST', style: GoogleFonts.orbitron(
                      color: AppColors.neonPink, fontSize: 11,
                      letterSpacing: 2, fontWeight: FontWeight.w700)),
                  ),
                ),
              ]));
            }
            return RefreshIndicator(
              color: AppColors.neonCyan,
              backgroundColor: AppColors.bgCard,
              onRefresh: () => postProv.fetchFeed(sort: sort),
              child: ListView.builder(
                padding: const EdgeInsets.only(top: 8, bottom: 80),
                itemCount: postProv.posts.length,
                itemBuilder: (ctx, i) => PostCard(post: postProv.posts[i]),
              ),
            );
          },
        ),
      ),
    ]);
  }
}
