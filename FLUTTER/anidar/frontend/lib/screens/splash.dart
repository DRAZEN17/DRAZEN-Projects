import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import '../providers/auth_provider.dart';
import '../theme.dart';

class SplashPage extends StatefulWidget {
  const SplashPage({super.key});
  @override
  State<SplashPage> createState() => _SplashPageState();
}

class _SplashPageState extends State<SplashPage> with SingleTickerProviderStateMixin {
  late AnimationController _ctrl;
  late Animation<double> _pulse;
  late Animation<double> _fadeIn;
  late Animation<double> _progress;

  @override
  void initState() {
    super.initState();

    // Fade+pulse runs over 2.5s total, then we navigate
    _ctrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2500),
    );

    // Fade in over first 600ms, stay visible
    _fadeIn = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _ctrl, curve: const Interval(0.0, 0.24, curve: Curves.easeOut)),
    );

    // Progress bar fills over the full 2.5s
    _progress = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _ctrl, curve: const Interval(0.0, 1.0, curve: Curves.easeInOut)),
    );

    // Pulse rings — separate repeating controller
    _pulse = Tween<double>(begin: 0.5, end: 1.0).animate(
      CurvedAnimation(parent: _ctrl, curve: Curves.easeInOut),
    );

    _ctrl.forward();
    _checkAuth();
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  Future<void> _checkAuth() async {
    final auth = context.read<AuthProvider>();

    // Wait for the auth provider to finish its async tryAutoLogin
    // It notifies listeners when done — we poll briefly
    const maxWait = Duration(milliseconds: 3000);
    const interval = Duration(milliseconds: 100);
    var waited = Duration.zero;

    while (!auth.isInitialized && waited < maxWait) {
      await Future.delayed(interval);
      waited += interval;
    }

    // Ensure splash shows for at least 2.5s (feels polished)
    final remaining = const Duration(milliseconds: 2500) - waited;
    if (remaining > Duration.zero) await Future.delayed(remaining);

    if (!mounted) return;

    if (auth.isAuthenticated) {
      Navigator.pushReplacementNamed(context, '/feed');
    } else {
      Navigator.pushReplacementNamed(context, '/');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgDeep,
      body: Stack(
        children: [
          // Subtle grid background
          CustomPaint(painter: _SplashGridPainter(), size: Size.infinite),
          Center(
            child: FadeTransition(
              opacity: _fadeIn,
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  // Pulsing neon ring logo
                  AnimatedBuilder(
                    animation: _ctrl,
                    builder: (_, __) {
                      final p = _pulse.value;
                      return Stack(
                        alignment: Alignment.center,
                        children: [
                          // Outer glow ring
                          Container(
                            width: 110,
                            height: 110,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              border: Border.all(
                                color: AppColors.neonCyan.withValues(alpha: p * 0.3),
                                width: 1,
                              ),
                              boxShadow: [
                                BoxShadow(
                                  color: AppColors.neonCyan.withValues(alpha: p * 0.15),
                                  blurRadius: 32,
                                  spreadRadius: 8,
                                ),
                              ],
                            ),
                          ),
                          // Inner ring
                          Container(
                            width: 86,
                            height: 86,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              border: Border.all(
                                color: AppColors.neonCyan.withValues(alpha: p),
                                width: 2,
                              ),
                              boxShadow: [
                                BoxShadow(
                                  color: AppColors.neonCyan.withValues(alpha: p * 0.5),
                                  blurRadius: 16,
                                  spreadRadius: 2,
                                ),
                              ],
                              color: AppColors.neonCyan.withValues(alpha: 0.05),
                            ),
                            child: Icon(
                              Icons.hub_rounded,
                              size: 40,
                              color: AppColors.neonCyan.withValues(alpha: p),
                            ),
                          ),
                        ],
                      );
                    },
                  ),
                  const SizedBox(height: 40),
                  // App name
                  Text(
                    'ANIDAR',
                    style: GoogleFonts.orbitron(
                      color: AppColors.neonCyan,
                      fontSize: 34,
                      fontWeight: FontWeight.w900,
                      letterSpacing: 10,
                      shadows: [
                        Shadow(color: AppColors.neonCyan.withValues(alpha: 0.9), blurRadius: 16),
                        Shadow(color: AppColors.neonCyan.withValues(alpha: 0.4), blurRadius: 40),
                      ],
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'NESTING IN THE VOID',
                    style: GoogleFonts.orbitron(
                      color: AppColors.textDim,
                      fontSize: 10,
                      letterSpacing: 5,
                      fontWeight: FontWeight.w400,
                    ),
                  ),
                  const SizedBox(height: 64),
                  // Animated progress bar
                  AnimatedBuilder(
                    animation: _progress,
                    builder: (_, __) => SizedBox(
                      width: 160,
                      child: Column(children: [
                        ClipRRect(
                          borderRadius: BorderRadius.circular(2),
                          child: LinearProgressIndicator(
                            value: _progress.value,
                            backgroundColor: AppColors.borderMuted,
                            valueColor: const AlwaysStoppedAnimation<Color>(AppColors.neonCyan),
                            minHeight: 2,
                          ),
                        ),
                        const SizedBox(height: 12),
                        Text(
                          'INITIALIZING...',
                          style: GoogleFonts.orbitron(
                            color: AppColors.textDim,
                            fontSize: 8,
                            letterSpacing: 3,
                          ),
                        ),
                      ]),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _SplashGridPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = AppColors.neonCyan.withValues(alpha: 0.03)
      ..strokeWidth = 1;
    const step = 40.0;
    for (double x = 0; x < size.width; x += step) {
      canvas.drawLine(Offset(x, 0), Offset(x, size.height), paint);
    }
    for (double y = 0; y < size.height; y += step) {
      canvas.drawLine(Offset(0, y), Offset(size.width, y), paint);
    }
    // Central glow
    final glow = Paint()
      ..shader = RadialGradient(
        colors: [AppColors.neonCyan.withValues(alpha: 0.08), Colors.transparent],
      ).createShader(Rect.fromCircle(
        center: Offset(size.width / 2, size.height / 2),
        radius: size.width * 0.5,
      ));
    canvas.drawRect(Rect.fromLTWH(0, 0, size.width, size.height), glow);
  }

  @override
  bool shouldRepaint(_) => false;
}
