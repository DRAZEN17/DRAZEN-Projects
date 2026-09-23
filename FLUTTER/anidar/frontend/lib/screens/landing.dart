import 'package:flutter/material.dart';
import '../theme.dart';
import 'package:google_fonts/google_fonts.dart';

class LandingPage extends StatelessWidget {
  const LandingPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgDeep,
      body: Stack(
        children: [
          // Grid background
          CustomPaint(painter: _GridPainter(), size: Size.infinite),
          SafeArea(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 28),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Spacer(flex: 2),
                  // Tag
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                    decoration: BoxDecoration(
                      border: Border.all(color: AppColors.neonPink, width: 1),
                      borderRadius: BorderRadius.circular(2),
                    ),
                    child: Text('BETA ACCESS', style: GoogleFonts.orbitron(color: AppColors.neonPink, fontSize: 10, letterSpacing: 3)),
                  ),
                  const SizedBox(height: 24),
                  // Title
                  Text('ANIDAR', style: Theme.of(context).textTheme.displayLarge?.copyWith(
                    color: AppColors.neonCyan,
                    shadows: [Shadow(color: AppColors.neonCyan.withValues(alpha: 0.9), blurRadius: 20), Shadow(color: AppColors.neonCyan.withValues(alpha: 0.4), blurRadius: 50)],
                  )),
                  const SizedBox(height: 8),
                  Text('YOUR DIGITAL NEST', style: GoogleFonts.rajdhani(color: AppColors.textSecondary, fontSize: 15, letterSpacing: 6)),
                  const SizedBox(height: 24),
                  const NeonDivider(color: AppColors.neonCyan),
                  const SizedBox(height: 24),
                  Text(
                    'Connect. Chat. Create.\nJoin nests and forge your community.',
                    style: Theme.of(context).textTheme.bodyLarge?.copyWith(color: AppColors.textSecondary, height: 1.7),
                  ),
                  const Spacer(flex: 3),
                  // CTA Buttons
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: () => Navigator.pushNamed(context, '/login'),
                      child: const Text('LOGIN'),
                    ),
                  ),
                  const SizedBox(height: 12),
                  SizedBox(
                    width: double.infinity,
                    child: OutlinedButton(
                      onPressed: () => Navigator.pushNamed(context, '/register'),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: AppColors.neonPink,
                        side: const BorderSide(color: AppColors.neonPink, width: 1.5),
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(4)),
                        textStyle: GoogleFonts.orbitron(fontSize: 12, fontWeight: FontWeight.w700, letterSpacing: 2),
                      ),
                      child: const Text('CREATE ACCOUNT'),
                    ),
                  ),
                  const SizedBox(height: 32),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _GridPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = AppColors.neonCyan.withValues(alpha: 0.04)
      ..strokeWidth = 1;
    const step = 40.0;
    for (double x = 0; x < size.width; x += step) {
      canvas.drawLine(Offset(x, 0), Offset(x, size.height), paint);
    }
    for (double y = 0; y < size.height; y += step) {
      canvas.drawLine(Offset(0, y), Offset(size.width, y), paint);
    }
    // Glow center
    final glow = Paint()
      ..shader = RadialGradient(
        colors: [AppColors.neonCyan.withValues(alpha: 0.08), Colors.transparent],
        radius: 0.7,
      ).createShader(Rect.fromCircle(center: Offset(size.width * 0.5, size.height * 0.3), radius: size.width * 0.7));
    canvas.drawRect(Rect.fromLTWH(0, 0, size.width, size.height), glow);
  }

  @override
  bool shouldRepaint(_) => false;
}
