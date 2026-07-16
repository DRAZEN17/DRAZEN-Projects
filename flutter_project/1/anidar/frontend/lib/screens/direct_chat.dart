import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import 'package:google_fonts/google_fonts.dart';
import '../providers/auth_provider.dart';
import '../providers/direct_chat_provider.dart';
import '../providers/conversations_provider.dart';
import '../models/direct_message.dart';
import '../theme.dart';

class DirectChatPage extends StatefulWidget {
  final int otherUserId;
  final String otherUsername;
  final String? otherAvatarUrl;
  const DirectChatPage({
    super.key,
    required this.otherUserId,
    required this.otherUsername,
    this.otherAvatarUrl,
  });
  @override
  State<DirectChatPage> createState() => _DirectChatPageState();
}

class _DirectChatPageState extends State<DirectChatPage> {
  final _msgCtrl = TextEditingController();
  final _scrollController = ScrollController();
  final _focusNode = FocusNode();
  late DirectChatProvider _chatProv;
  int? _currentUserId;
  bool _isTyping = false;

  @override
  void initState() {
    super.initState();
    _chatProv = context.read<DirectChatProvider>();
    _currentUserId = context.read<AuthProvider>().user?.id;
    _msgCtrl.addListener(() {
      final typing = _msgCtrl.text.trim().isNotEmpty;
      if (typing != _isTyping) setState(() => _isTyping = typing);
    });
    // Connect after frame so provider is ready
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _chatProv.connectToChat(widget.otherUserId);
    });
  }

  @override
  void dispose() {
    _msgCtrl.dispose();
    _scrollController.dispose();
    _focusNode.dispose();
    _chatProv.pauseChat();
    super.dispose();
  }

  void _scrollToBottom() {
    if (!_scrollController.hasClients) return;
    _scrollController.animateTo(
      _scrollController.position.maxScrollExtent,
      duration: const Duration(milliseconds: 250),
      curve: Curves.easeOut,
    );
  }

  void _sendMessage() {
    final text = _msgCtrl.text.trim();
    if (text.isEmpty) return;
    _chatProv.sendMessage(widget.otherUserId, text);
    context.read<ConversationsProvider>().updateLastMessage(
      widget.otherUserId, widget.otherUsername, text, DateTime.now());
    _msgCtrl.clear();
    setState(() => _isTyping = false);
    Future.delayed(const Duration(milliseconds: 150), _scrollToBottom);
  }

  List<dynamic> _buildItems(List<DirectMessage> msgs) {
    final result = <dynamic>[];
    DateTime? lastDate;
    for (final msg in msgs) {
      final d = msg.createdAt.toLocal();
      final msgDate = DateTime(d.year, d.month, d.day);
      if (lastDate == null || msgDate != lastDate) {
        result.add(msgDate);
        lastDate = msgDate;
      }
      result.add(msg);
    }
    return result;
  }

  String _dateSep(DateTime date) {
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    if (date == today) return 'TODAY';
    if (date == today.subtract(const Duration(days: 1))) return 'YESTERDAY';
    return DateFormat('MMMM d, yyyy').format(date).toUpperCase();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgDeep,
      appBar: _buildAppBar(),
      body: Column(
        children: [
          Expanded(child: _buildMessages()),
          _buildInput(),
        ],
      ),
    );
  }

  AppBar _buildAppBar() => AppBar(
    backgroundColor: AppColors.bgCard,
    leading: IconButton(
      icon: const Icon(Icons.arrow_back_ios_rounded, color: AppColors.neonCyan, size: 18),
      onPressed: () => Navigator.pop(context),
    ),
    titleSpacing: 0,
    title: Row(children: [
      Stack(children: [
        Container(
          width: 40, height: 40,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            border: Border.all(color: AppColors.neonCyan, width: 1.5),
            boxShadow: [BoxShadow(color: AppColors.neonCyan.withValues(alpha: 0.25), blurRadius: 8)],
            color: AppColors.bgSurface,
          ),
          child: widget.otherAvatarUrl != null
              ? ClipOval(child: Image.network(widget.otherAvatarUrl!, fit: BoxFit.cover))
              : Center(child: Text(
                  widget.otherUsername[0].toUpperCase(),
                  style: GoogleFonts.orbitron(color: AppColors.neonCyan, fontSize: 15, fontWeight: FontWeight.w700),
                )),
        ),
        Positioned(right: 0, bottom: 0, child: Container(
          width: 11, height: 11,
          decoration: BoxDecoration(
            shape: BoxShape.circle, color: AppColors.neonGreen,
            border: Border.all(color: AppColors.bgCard, width: 2),
            boxShadow: [BoxShadow(color: AppColors.neonGreen.withValues(alpha: 0.7), blurRadius: 4)],
          ),
        )),
      ]),
      const SizedBox(width: 12),
      Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text(widget.otherUsername, style: GoogleFonts.rajdhani(color: AppColors.textPrimary, fontSize: 16, fontWeight: FontWeight.w700)),
        Text('Online', style: GoogleFonts.rajdhani(color: AppColors.neonGreen, fontSize: 12)),
      ]),
    ]),
    actions: [
      IconButton(icon: const Icon(Icons.videocam_outlined, color: AppColors.neonCyan, size: 22), onPressed: () {}),
      IconButton(icon: const Icon(Icons.call_outlined, color: AppColors.neonCyan, size: 20), onPressed: () {}),
      IconButton(icon: const Icon(Icons.more_vert, color: AppColors.textSecondary, size: 22), onPressed: () {}),
    ],
    bottom: PreferredSize(preferredSize: const Size.fromHeight(1), child: Container(height: 1, color: AppColors.borderMuted)),
  );

  Widget _buildMessages() {
    return Consumer<DirectChatProvider>(
      builder: (_, chatProv, __) {
        if (chatProv.loadingHistory && chatProv.messages.isEmpty) {
          return const Center(child: CircularProgressIndicator(color: AppColors.neonCyan));
        }
        if (chatProv.messages.isEmpty) {
          return Center(child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
            Icon(Icons.chat_bubble_outline_rounded, color: AppColors.neonCyan.withValues(alpha: 0.3), size: 56),
            const SizedBox(height: 16),
            Text('START THE CONVERSATION', style: GoogleFonts.orbitron(color: AppColors.textDim, fontSize: 11, letterSpacing: 2)),
          ]));
        }
        final items = _buildItems(chatProv.messages);
        WidgetsBinding.instance.addPostFrameCallback((_) => _scrollToBottom());
        return GestureDetector(
          onTap: () => FocusScope.of(context).unfocus(),
          child: ListView.builder(
            controller: _scrollController,
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 12),
            itemCount: items.length,
            itemBuilder: (ctx, i) {
              final item = items[i];
              if (item is DateTime) return _buildDateSep(item);
              return _buildBubble(item as DirectMessage);
            },
          ),
        );
      },
    );
  }

  Widget _buildDateSep(DateTime date) => Padding(
    padding: const EdgeInsets.symmetric(vertical: 16),
    child: Row(children: [
      Expanded(child: Container(height: 1, color: AppColors.borderMuted)),
      Container(
        margin: const EdgeInsets.symmetric(horizontal: 12),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
        decoration: BoxDecoration(
          color: AppColors.bgGlass, borderRadius: BorderRadius.circular(12),
          border: Border.all(color: AppColors.borderMuted, width: 1),
        ),
        child: Text(_dateSep(date), style: GoogleFonts.orbitron(color: AppColors.textDim, fontSize: 9, letterSpacing: 2)),
      ),
      Expanded(child: Container(height: 1, color: AppColors.borderMuted)),
    ]),
  );

  Widget _buildBubble(DirectMessage msg) {
    // isMe: sender_id matches current user, or it's an optimistic message (id is large timestamp)
    final isMe = msg.senderId == _currentUserId ||
        (msg.id > 1_000_000_000_000 && msg.senderId == 0);
    final time = DateFormat('HH:mm').format(msg.createdAt.toLocal());

    return Padding(
      padding: EdgeInsets.only(top: 2, bottom: 2, left: isMe ? 48 : 0, right: isMe ? 0 : 48),
      child: Align(
        alignment: isMe ? Alignment.centerRight : Alignment.centerLeft,
        child: Row(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.end,
          children: [
            if (!isMe) ...[
              Container(
                width: 30, height: 30,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  border: Border.all(color: AppColors.neonCyan.withValues(alpha: 0.4), width: 1),
                  color: AppColors.bgSurface,
                ),
                child: Center(child: Text(
                  msg.username[0].toUpperCase(),
                  style: GoogleFonts.orbitron(color: AppColors.neonCyan, fontSize: 11, fontWeight: FontWeight.w700),
                )),
              ),
              const SizedBox(width: 6),
            ],
            Flexible(
              child: Container(
                padding: const EdgeInsets.only(left: 12, right: 12, top: 8, bottom: 6),
                decoration: BoxDecoration(
                  color: isMe ? AppColors.neonCyan.withValues(alpha: 0.14) : AppColors.bgSurface,
                  borderRadius: BorderRadius.only(
                    topLeft: const Radius.circular(16),
                    topRight: const Radius.circular(16),
                    bottomLeft: Radius.circular(isMe ? 16 : 4),
                    bottomRight: Radius.circular(isMe ? 4 : 16),
                  ),
                  border: Border.all(
                    color: isMe ? AppColors.neonCyan.withValues(alpha: 0.25) : AppColors.borderMuted,
                    width: 1,
                  ),
                  boxShadow: isMe ? [BoxShadow(color: AppColors.neonCyan.withValues(alpha: 0.06), blurRadius: 8)] : null,
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Text(msg.body, style: GoogleFonts.rajdhani(color: AppColors.textPrimary, fontSize: 15, height: 1.4)),
                    const SizedBox(height: 4),
                    Row(mainAxisSize: MainAxisSize.min, children: [
                      Text(time, style: GoogleFonts.rajdhani(color: AppColors.textDim, fontSize: 11)),
                      if (isMe) ...[
                        const SizedBox(width: 4),
                        Icon(Icons.done_all_rounded, color: AppColors.neonCyan.withValues(alpha: 0.7), size: 14),
                      ],
                    ]),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInput() => Container(
    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
    decoration: const BoxDecoration(
      color: AppColors.bgCard,
      border: Border(top: BorderSide(color: AppColors.borderMuted, width: 1)),
    ),
    child: SafeArea(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          IconButton(
            icon: const Icon(Icons.add_circle_outline_rounded, color: AppColors.textDim, size: 24),
            onPressed: () {},
            padding: EdgeInsets.zero,
            constraints: const BoxConstraints(minWidth: 36, minHeight: 36),
          ),
          const SizedBox(width: 6),
          Expanded(
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxHeight: 120),
              child: Container(
                decoration: BoxDecoration(
                  color: AppColors.bgSurface,
                  borderRadius: BorderRadius.circular(22),
                  border: Border.all(color: AppColors.borderMuted, width: 1),
                ),
                child: Row(children: [
                  Expanded(
                    child: TextField(
                      controller: _msgCtrl,
                      focusNode: _focusNode,
                      style: GoogleFonts.rajdhani(color: AppColors.textPrimary, fontSize: 15),
                      decoration: InputDecoration(
                        hintText: 'Message',
                        hintStyle: GoogleFonts.rajdhani(color: AppColors.textDim, fontSize: 15),
                        border: InputBorder.none, enabledBorder: InputBorder.none, focusedBorder: InputBorder.none,
                        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                      ),
                      maxLines: null,
                      textInputAction: TextInputAction.newline,
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.emoji_emotions_outlined, color: AppColors.textDim, size: 20),
                    onPressed: () {},
                    padding: const EdgeInsets.only(right: 8),
                    constraints: const BoxConstraints(),
                  ),
                ]),
              ),
            ),
          ),
          const SizedBox(width: 8),
          GestureDetector(
            onTap: _isTyping ? _sendMessage : null,
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              width: 44, height: 44,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: _isTyping ? AppColors.neonCyan : AppColors.bgSurface,
                border: Border.all(color: _isTyping ? AppColors.neonCyan : AppColors.borderMuted, width: 1),
                boxShadow: _isTyping ? [BoxShadow(color: AppColors.neonCyan.withValues(alpha: 0.4), blurRadius: 12)] : null,
              ),
              child: Icon(
                _isTyping ? Icons.send_rounded : Icons.mic_none_rounded,
                color: _isTyping ? AppColors.bgDeep : AppColors.textDim,
                size: 18,
              ),
            ),
          ),
        ],
      ),
    ),
  );
}
