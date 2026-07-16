import 'dart:convert';
import 'package:anidar/screens/direct_chat.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import '../providers/auth_provider.dart';
import '../services/api_service.dart';
import '../models/user.dart' as models;
import '../theme.dart';

class ProfilePage extends StatefulWidget {
  final String username;
  const ProfilePage({super.key, required this.username});
  @override
  State<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  models.User? _user;
  bool _loading = true;

  @override
  void initState() { super.initState(); _fetchUser(); }

  Future<void> _fetchUser() async {
    final api = ApiService();
    api.accessToken = context.read<AuthProvider>().accessToken;
    final res = await api.get('/users/${widget.username}');
    if (res.statusCode == 200) {
      setState(() { _user = models.User.fromJson(jsonDecode(res.body)); _loading = false; });
    } else {
      setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return const Scaffold(
        backgroundColor: AppColors.bgDeep,
        body: Center(child: CircularProgressIndicator(color: AppColors.neonCyan)),
      );
    }
    if (_user == null) {
      return Scaffold(
        backgroundColor: AppColors.bgDeep,
        appBar: AppBar(title: Text(widget.username)),
        body: Center(child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
          const Icon(Icons.person_off_outlined, color: AppColors.textDim, size: 48),
          const SizedBox(height: 16),
          Text('USER NOT FOUND', style: GoogleFonts.orbitron(color: AppColors.textDim, fontSize: 13, letterSpacing: 2)),
        ])),
      );
    }

    final auth = context.read<AuthProvider>();
    final isOwn = auth.user?.id == _user!.id;

    return Scaffold(
      backgroundColor: AppColors.bgDeep,
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 180,
            backgroundColor: AppColors.bgDeep,
            pinned: true,
            leading: IconButton(
              icon: const Icon(Icons.arrow_back_ios, color: AppColors.neonCyan, size: 18),
              onPressed: () => Navigator.pop(context),
            ),
            flexibleSpace: FlexibleSpaceBar(
              background: Stack(
                children: [
                  // Grid bg
                  CustomPaint(painter: _ProfileBgPainter(), size: Size.infinite),
                  // Centered avatar
                  Align(
                    alignment: Alignment.bottomCenter,
                    child: Padding(
                      padding: const EdgeInsets.only(bottom: 16),
                      child: Column(mainAxisSize: MainAxisSize.min, children: [
                        Container(
                          width: 72, height: 72,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            border: Border.all(color: AppColors.neonCyan, width: 2),
                            boxShadow: [BoxShadow(color: AppColors.neonCyan.withValues(alpha: 0.4), blurRadius: 20)],
                            color: AppColors.bgCard,
                          ),
                          child: _user!.avatarUrl != null
                              ? ClipOval(child: Image.network(_user!.avatarUrl!, fit: BoxFit.cover))
                              : Center(child: Text(
                                  _user!.username[0].toUpperCase(),
                                  style: GoogleFonts.orbitron(color: AppColors.neonCyan, fontSize: 28, fontWeight: FontWeight.w900),
                                )),
                        ),
                      ]),
                    ),
                  ),
                ],
              ),
            ),
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Column(children: [
                const SizedBox(height: 12),
                Text(_user!.username.toUpperCase(), style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                  color: AppColors.textPrimary,
                  shadows: [Shadow(color: AppColors.neonCyan.withValues(alpha: 0.3), blurRadius: 10)],
                )),
                const SizedBox(height: 6),
                if (_user!.bio != null)
                  Text(_user!.bio!, style: GoogleFonts.rajdhani(color: AppColors.textSecondary, fontSize: 14, height: 1.5)),
                const SizedBox(height: 24),
                const NeonDivider(),
                const SizedBox(height: 24),
                // Stats row
                Row(children: [
                  _statBox('POSTS', '42'),
                  const SizedBox(width: 12),
                  _statBox('NESTS', '7'),
                  const SizedBox(width: 12),
                  _statBox('KARMA', '1.2K'),
                ]),
                const SizedBox(height: 24),
                if (!isOwn)
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton.icon(
                      icon: const Icon(Icons.send_rounded, size: 16),
                      label: const Text('SEND MESSAGE'),
                      onPressed: () => Navigator.push(context, MaterialPageRoute(
                        builder: (_) => DirectChatPage(otherUserId: _user!.id, otherUsername: _user!.username),
                      )),
                    ),
                  ),
                const SizedBox(height: 40),
              ]),
            ),
          ),
        ],
      ),
    );
  }

  Widget _statBox(String label, String value) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 14),
        decoration: BoxDecoration(
          color: AppColors.bgCard,
          borderRadius: BorderRadius.circular(6),
          border: Border.all(color: AppColors.borderMuted, width: 1),
        ),
        child: Column(children: [
          Text(value, style: GoogleFonts.orbitron(color: AppColors.neonCyan, fontSize: 16, fontWeight: FontWeight.w800)),
          const SizedBox(height: 4),
          Text(label, style: GoogleFonts.orbitron(color: AppColors.textDim, fontSize: 9, letterSpacing: 2)),
        ]),
      ),
    );
  }
}

class _ProfileBgPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()..color = AppColors.neonCyan.withValues(alpha: 0.04)..strokeWidth = 1;
    const step = 40.0;
    for (double x = 0; x < size.width; x += step) { canvas.drawLine(Offset(x, 0), Offset(x, size.height), paint); }
    for (double y = 0; y < size.height; y += step) { canvas.drawLine(Offset(0, y), Offset(size.width, y), paint); }
    final glow = Paint()
      ..shader = RadialGradient(
        colors: [AppColors.neonCyan.withValues(alpha: 0.1), Colors.transparent],
      ).createShader(Rect.fromCircle(center: Offset(size.width / 2, size.height), radius: size.width * 0.6));
    canvas.drawRect(Rect.fromLTWH(0, 0, size.width, size.height), glow);
  }
  @override
  bool shouldRepaint(_) => false;
}
