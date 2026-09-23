import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import '../providers/chat_provider.dart';
import '../theme.dart';

class NestChatPage extends StatefulWidget {
  final String nestSlug;
  const NestChatPage({super.key, required this.nestSlug});
  @override
  State<NestChatPage> createState() => _NestChatPageState();
}

class _NestChatPageState extends State<NestChatPage> {
  final _msgCtrl = TextEditingController();
  final _scrollController = ScrollController();
  late ChatProvider chatProv;

  @override
  void initState() {
    super.initState();
    chatProv = context.read<ChatProvider>();
    chatProv.connectToChat(widget.nestSlug);
  }

  @override
  void dispose() {
    _msgCtrl.dispose();
    _scrollController.dispose();
    chatProv.leaveChat(widget.nestSlug);
    super.dispose();
  }

  void _sendMessage() {
    final text = _msgCtrl.text.trim();
    if (text.isNotEmpty) {
      chatProv.sendMessage(widget.nestSlug, text);
      _msgCtrl.clear();
      Future.delayed(const Duration(milliseconds: 100), () {
        if (_scrollController.hasClients) {
          _scrollController.animateTo(
            _scrollController.position.minScrollExtent,
            duration: const Duration(milliseconds: 300),
            curve: Curves.easeOut,
          );
        }
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final messages = context.watch<ChatProvider>().messages;
    return Scaffold(
      backgroundColor: AppColors.bgDeep,
      appBar: AppBar(
        backgroundColor: AppColors.bgDeep,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios, color: AppColors.neonCyan, size: 18),
          onPressed: () => Navigator.pop(context),
        ),
        title: Row(children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: AppColors.neonPurple.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(4),
              border: Border.all(color: AppColors.neonPurple.withValues(alpha: 0.4), width: 1),
            ),
            child: Text('n/', style: GoogleFonts.orbitron(color: AppColors.neonPurple, fontSize: 12, fontWeight: FontWeight.w700)),
          ),
          const SizedBox(width: 8),
          Text(widget.nestSlug.toUpperCase(),
            style: GoogleFonts.orbitron(color: AppColors.textPrimary, fontSize: 14, fontWeight: FontWeight.w600, letterSpacing: 1)),
        ]),
        actions: [
          Container(
            margin: const EdgeInsets.only(right: 14),
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: AppColors.neonGreen.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: AppColors.neonGreen.withValues(alpha: 0.4), width: 1),
            ),
            child: Row(children: [
              Container(width: 6, height: 6, decoration: BoxDecoration(
                shape: BoxShape.circle, color: AppColors.neonGreen,
                boxShadow: [BoxShadow(color: AppColors.neonGreen.withValues(alpha: 0.7), blurRadius: 4)],
              )),
              const SizedBox(width: 5),
              Text('LIVE', style: GoogleFonts.orbitron(color: AppColors.neonGreen, fontSize: 9, letterSpacing: 1.5)),
            ]),
          ),
        ],
        bottom: PreferredSize(preferredSize: const Size.fromHeight(1),
          child: Container(height: 1, color: AppColors.borderMuted)),
      ),
      body: Column(
        children: [
          Expanded(
            child: GestureDetector(
              onTap: () => FocusScope.of(context).unfocus(),
              child: messages.isEmpty
                  ? Center(child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
                      const Icon(Icons.chat_bubble_outline_rounded, color: AppColors.textDim, size: 48),
                      const SizedBox(height: 16),
                      Text('NO MESSAGES YET', style: GoogleFonts.orbitron(color: AppColors.textDim, fontSize: 12, letterSpacing: 2)),
                      const SizedBox(height: 8),
                      Text('Be the first to speak', style: GoogleFonts.rajdhani(color: AppColors.textDim, fontSize: 14)),
                    ]))
                  : ListView.builder(
                      controller: _scrollController,
                      reverse: true,
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                      itemCount: messages.length,
                      itemBuilder: (ctx, i) {
                        final msg = messages[i];
                        return Padding(
                          padding: const EdgeInsets.only(bottom: 10),
                          child: Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Container(
                                width: 32, height: 32,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  border: Border.all(color: AppColors.neonPurple.withValues(alpha: 0.5), width: 1),
                                  color: AppColors.neonPurple.withValues(alpha: 0.1),
                                ),
                                child: Center(child: Text(
                                  msg.username[0].toUpperCase(),
                                  style: GoogleFonts.orbitron(color: AppColors.neonPurple, fontSize: 12, fontWeight: FontWeight.w700),
                                )),
                              ),
                              const SizedBox(width: 10),
                              Expanded(
                                child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                                  Text(msg.username, style: GoogleFonts.orbitron(color: AppColors.neonPurple, fontSize: 10, letterSpacing: 1)),
                                  const SizedBox(height: 4),
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                                    decoration: BoxDecoration(
                                      color: AppColors.bgSurface,
                                      borderRadius: const BorderRadius.only(
                                        topRight: Radius.circular(12),
                                        bottomLeft: Radius.circular(12),
                                        bottomRight: Radius.circular(12),
                                      ),
                                      border: Border.all(color: AppColors.borderMuted, width: 1),
                                    ),
                                    child: Text(msg.body, style: GoogleFonts.rajdhani(color: AppColors.textPrimary, fontSize: 15, height: 1.4)),
                                  ),
                                ]),
                              ),
                            ],
                          ),
                        );
                      },
                    ),
            ),
          ),
          _buildInput(),
        ],
      ),
    );
  }

  Widget _buildInput() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
      decoration: const BoxDecoration(
        color: AppColors.bgCard,
        border: Border(top: BorderSide(color: AppColors.borderMuted, width: 1)),
      ),
      child: SafeArea(
        child: Row(
          children: [
            Expanded(
              child: Container(
                decoration: BoxDecoration(
                  color: AppColors.bgSurface,
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: AppColors.borderMuted, width: 1),
                ),
                child: TextField(
                  controller: _msgCtrl,
                  style: GoogleFonts.rajdhani(color: AppColors.textPrimary, fontSize: 15),
                  decoration: InputDecoration(
                    hintText: 'Type in the nest...',
                    hintStyle: GoogleFonts.rajdhani(color: AppColors.textDim, fontSize: 15),
                    border: InputBorder.none,
                    contentPadding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
                    enabledBorder: InputBorder.none,
                    focusedBorder: InputBorder.none,
                  ),
                  maxLines: null,
                  textInputAction: TextInputAction.newline,
                  onSubmitted: (_) => _sendMessage(),
                ),
              ),
            ),
            const SizedBox(width: 10),
            GestureDetector(
              onTap: _sendMessage,
              child: Container(
                width: 44, height: 44,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: AppColors.neonPurple,
                  boxShadow: [BoxShadow(color: AppColors.neonPurple.withValues(alpha: 0.4), blurRadius: 12)],
                ),
                child: const Icon(Icons.send_rounded, color: Colors.white, size: 18),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
