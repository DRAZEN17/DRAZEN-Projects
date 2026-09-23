import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import '../providers/conversations_provider.dart';
import '../models/conversation.dart';
import '../theme.dart';
import 'direct_chat.dart';

class ConversationsPage extends StatefulWidget {
  const ConversationsPage({super.key});
  @override
  State<ConversationsPage> createState() => _ConversationsPageState();
}

class _ConversationsPageState extends State<ConversationsPage> {
  final _searchCtrl = TextEditingController();
  bool _showSearch = false;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<ConversationsProvider>().fetchConversations();
    });
  }

  @override
  void dispose() {
    _searchCtrl.dispose();
    super.dispose();
  }

  Future<void> _openChat(int userId, String username) async {
    final convProv = context.read<ConversationsProvider>();
    convProv.clearSearch();
    _searchCtrl.clear();
    if (!mounted) return;
    setState(() => _showSearch = false);
    await Navigator.push(context, MaterialPageRoute(
      builder: (_) => DirectChatPage(otherUserId: userId, otherUsername: username),
    ));
    if (!mounted) return;
    convProv.fetchConversations();
  }

  @override
  Widget build(BuildContext context) {
    final prov = context.watch<ConversationsProvider>();

    return Scaffold(
      backgroundColor: AppColors.bgDeep,
      appBar: AppBar(
        backgroundColor: AppColors.bgDeep,
        automaticallyImplyLeading: false,
        title: _showSearch
            ? _buildSearchField(prov)
            : Row(children: [
                const Icon(Icons.chat_bubble_outline_rounded, color: AppColors.neonCyan, size: 20),
                const SizedBox(width: 10),
                Text('MESSAGES', style: Theme.of(context).appBarTheme.titleTextStyle),
              ]),
        actions: [
          IconButton(
            icon: Icon(
              _showSearch ? Icons.close : Icons.search_rounded,
              color: _showSearch ? AppColors.neonPink : AppColors.neonCyan,
              size: 22,
            ),
            onPressed: () {
              setState(() => _showSearch = !_showSearch);
              if (!_showSearch) {
                _searchCtrl.clear();
                prov.clearSearch();
              }
            },
          ),
          if (!_showSearch)
            IconButton(
              icon: const Icon(Icons.edit_outlined, color: AppColors.neonCyan, size: 20),
              onPressed: () => setState(() => _showSearch = true),
            ),
        ],
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(1),
          child: Container(height: 1, color: AppColors.borderMuted),
        ),
      ),
      body: _showSearch && _searchCtrl.text.isNotEmpty
          ? _buildSearchResults(prov)
          : _buildConversationsList(prov),
    );
  }

  Widget _buildSearchField(ConversationsProvider prov) {
    return TextField(
      controller: _searchCtrl,
      autofocus: true,
      style: GoogleFonts.rajdhani(color: AppColors.textPrimary, fontSize: 16),
      decoration: InputDecoration(
        hintText: 'Search users...',
        hintStyle: GoogleFonts.rajdhani(color: AppColors.textDim, fontSize: 16),
        border: InputBorder.none,
        enabledBorder: InputBorder.none,
        focusedBorder: InputBorder.none,
        contentPadding: EdgeInsets.zero,
        prefixIcon: const Icon(Icons.search, color: AppColors.textDim, size: 18),
      ),
      onChanged: (q) {
        setState(() {});
        prov.searchUsers(q);
      },
    );
  }

  Widget _buildSearchResults(ConversationsProvider prov) {
    if (prov.searching) {
      return const Center(child: CircularProgressIndicator(color: AppColors.neonCyan));
    }
    if (prov.searchResults.isEmpty) {
      return Center(child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
        const Icon(Icons.person_search_rounded, color: AppColors.textDim, size: 48),
        const SizedBox(height: 16),
        Text('NO USERS FOUND', style: GoogleFonts.orbitron(color: AppColors.textDim, fontSize: 12, letterSpacing: 2)),
        const SizedBox(height: 8),
        Text('Try a different username', style: GoogleFonts.rajdhani(color: AppColors.textDim, fontSize: 14)),
      ]));
    }
    return ListView.builder(
      padding: const EdgeInsets.symmetric(vertical: 8),
      itemCount: prov.searchResults.length,
      itemBuilder: (ctx, i) {
        final user = prov.searchResults[i];
        final username = user['username'] as String;
        final userId = user['id'] as int;
        return _UserSearchTile(
          username: username,
          userId: userId,
          avatarUrl: user['avatar_url'] as String?,
          onTap: () => _openChat(userId, username),
        );
      },
    );
  }

  Widget _buildConversationsList(ConversationsProvider prov) {
    if (prov.loading) {
      return const Center(child: CircularProgressIndicator(color: AppColors.neonCyan));
    }
    if (prov.conversations.isEmpty) {
      return Center(
        child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
          Container(
            width: 80, height: 80,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              border: Border.all(color: AppColors.neonCyan.withValues(alpha: 0.3), width: 1),
            ),
            child: const Icon(Icons.chat_bubble_outline_rounded, color: AppColors.neonCyan, size: 36),
          ),
          const SizedBox(height: 24),
          Text('NO MESSAGES YET', style: GoogleFonts.orbitron(color: AppColors.textDim, fontSize: 13, letterSpacing: 2)),
          const SizedBox(height: 8),
          Text('Search for a user to start chatting', style: GoogleFonts.rajdhani(color: AppColors.textDim, fontSize: 14)),
          const SizedBox(height: 24),
          GestureDetector(
            onTap: () => setState(() => _showSearch = true),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 10),
              decoration: BoxDecoration(
                border: Border.all(color: AppColors.neonCyan, width: 1),
                borderRadius: BorderRadius.circular(4),
              ),
              child: Text('NEW CHAT', style: GoogleFonts.orbitron(color: AppColors.neonCyan, fontSize: 11, letterSpacing: 2, fontWeight: FontWeight.w700)),
            ),
          ),
        ]),
      );
    }
    return RefreshIndicator(
      color: AppColors.neonCyan,
      backgroundColor: AppColors.bgCard,
      onRefresh: prov.fetchConversations,
      child: ListView.builder(
        padding: const EdgeInsets.only(top: 4),
        itemCount: prov.conversations.length,
        itemBuilder: (ctx, i) => _ConversationTile(
          conv: prov.conversations[i],
          onTap: () => _openChat(prov.conversations[i].otherUserId, prov.conversations[i].otherUsername),
        ),
      ),
    );
  }
}

// ── Conversation tile ────────────────────────────────────────────────────────
class _ConversationTile extends StatelessWidget {
  final Conversation conv;
  final VoidCallback onTap;
  const _ConversationTile({required this.conv, required this.onTap});

  String _formatTime(DateTime dt) {
    final now = DateTime.now();
    final diff = now.difference(dt);
    if (diff.inDays == 0) return DateFormat('HH:mm').format(dt.toLocal());
    if (diff.inDays == 1) return 'Yesterday';
    if (diff.inDays < 7) return DateFormat('EEE').format(dt.toLocal());
    return DateFormat('dd/MM').format(dt.toLocal());
  }

  @override
  Widget build(BuildContext context) {
    final hasUnread = conv.unreadCount > 0;
    return InkWell(
      onTap: onTap,
      splashColor: AppColors.neonCyan.withValues(alpha: 0.04),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: const BoxDecoration(
          border: Border(bottom: BorderSide(color: AppColors.borderMuted, width: 1)),
        ),
        child: Row(children: [
          // Avatar + online dot
          Stack(children: [
            Container(
              width: 50, height: 50,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(
                  color: hasUnread ? AppColors.neonCyan : AppColors.borderMuted,
                  width: hasUnread ? 2 : 1,
                ),
                boxShadow: hasUnread
                    ? [BoxShadow(color: AppColors.neonCyan.withValues(alpha: 0.2), blurRadius: 8)]
                    : null,
                color: AppColors.bgSurface,
              ),
              child: conv.otherAvatarUrl != null
                  ? ClipOval(child: Image.network(conv.otherAvatarUrl!, fit: BoxFit.cover))
                  : Center(child: Text(
                      conv.otherUsername[0].toUpperCase(),
                      style: GoogleFonts.orbitron(
                        color: hasUnread ? AppColors.neonCyan : AppColors.textSecondary,
                        fontSize: 18, fontWeight: FontWeight.w800,
                      ),
                    )),
            ),
            if (conv.isOnline)
              Positioned(
                right: 2, bottom: 2,
                child: Container(
                  width: 12, height: 12,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: AppColors.neonGreen,
                    border: Border.all(color: AppColors.bgDeep, width: 2),
                    boxShadow: [BoxShadow(color: AppColors.neonGreen.withValues(alpha: 0.6), blurRadius: 4)],
                  ),
                ),
              ),
          ]),
          const SizedBox(width: 14),
          // Text content
          Expanded(
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Row(children: [
                Expanded(
                  child: Text(
                    conv.otherUsername,
                    style: GoogleFonts.rajdhani(
                      color: hasUnread ? AppColors.textPrimary : AppColors.textSecondary,
                      fontSize: 16,
                      fontWeight: hasUnread ? FontWeight.w700 : FontWeight.w500,
                    ),
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
                Text(
                  _formatTime(conv.lastMessageAt),
                  style: GoogleFonts.rajdhani(
                    color: hasUnread ? AppColors.neonCyan : AppColors.textDim,
                    fontSize: 12,
                  ),
                ),
              ]),
              const SizedBox(height: 4),
              Row(children: [
                Expanded(
                  child: Text(
                    conv.lastMessage,
                    style: GoogleFonts.rajdhani(
                      color: hasUnread ? AppColors.textSecondary : AppColors.textDim,
                      fontSize: 13,
                      fontWeight: hasUnread ? FontWeight.w600 : FontWeight.w400,
                    ),
                    overflow: TextOverflow.ellipsis,
                    maxLines: 1,
                  ),
                ),
                if (hasUnread)
                  Container(
                    margin: const EdgeInsets.only(left: 8),
                    padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
                    decoration: BoxDecoration(
                      color: AppColors.neonCyan,
                      borderRadius: BorderRadius.circular(10),
                      boxShadow: [BoxShadow(color: AppColors.neonCyan.withValues(alpha: 0.4), blurRadius: 6)],
                    ),
                    child: Text(
                      conv.unreadCount > 99 ? '99+' : '${conv.unreadCount}',
                      style: GoogleFonts.orbitron(color: AppColors.bgDeep, fontSize: 9, fontWeight: FontWeight.w800),
                    ),
                  ),
              ]),
            ]),
          ),
        ]),
      ),
    );
  }
}

// ── User search result tile ──────────────────────────────────────────────────
class _UserSearchTile extends StatelessWidget {
  final String username;
  final int userId;
  final String? avatarUrl;
  final VoidCallback onTap;
  const _UserSearchTile({required this.username, required this.userId, this.avatarUrl, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      splashColor: AppColors.neonCyan.withValues(alpha: 0.05),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: const BoxDecoration(
          border: Border(bottom: BorderSide(color: AppColors.borderMuted, width: 1)),
        ),
        child: Row(children: [
          Container(
            width: 46, height: 46,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              border: Border.all(color: AppColors.neonPurple.withValues(alpha: 0.5), width: 1),
              color: AppColors.bgSurface,
            ),
            child: avatarUrl != null
                ? ClipOval(child: Image.network(avatarUrl!, fit: BoxFit.cover))
                : Center(child: Text(
                    username[0].toUpperCase(),
                    style: GoogleFonts.orbitron(color: AppColors.neonPurple, fontSize: 17, fontWeight: FontWeight.w800),
                  )),
          ),
          const SizedBox(width: 14),
          Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(username, style: GoogleFonts.rajdhani(color: AppColors.textPrimary, fontSize: 16, fontWeight: FontWeight.w600)),
            Text('Tap to start a chat', style: GoogleFonts.rajdhani(color: AppColors.textDim, fontSize: 12)),
          ])),
          const Icon(Icons.send_rounded, color: AppColors.neonCyan, size: 18),
        ]),
      ),
    );
  }
}
