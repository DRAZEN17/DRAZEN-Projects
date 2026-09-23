import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import '../providers/auth_provider.dart';
import '../theme.dart';

class RegisterPage extends StatefulWidget {
  const RegisterPage({super.key});
  @override
  State<RegisterPage> createState() => _RegisterPageState();
}

class _RegisterPageState extends State<RegisterPage> {
  final _formKey = GlobalKey<FormState>();
  final _usernameCtrl = TextEditingController();
  final _emailCtrl = TextEditingController();
  final _passCtrl = TextEditingController();
  final _confirmCtrl = TextEditingController();
  bool _obscure = true;
  bool _obscureConfirm = true;

  @override
  void dispose() {
    _usernameCtrl.dispose(); _emailCtrl.dispose();
    _passCtrl.dispose(); _confirmCtrl.dispose();
    super.dispose();
  }

  Widget _fieldLabel(String label) => Text(
    label,
    style: GoogleFonts.orbitron(color: AppColors.textDim, fontSize: 10, letterSpacing: 2),
  );

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    return Scaffold(
      backgroundColor: AppColors.bgDeep,
      body: Stack(
        children: [
          CustomPaint(painter: _BgPainter(), size: Size.infinite),
          SafeArea(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 24),
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SizedBox(height: 24),
                    GestureDetector(
                      onTap: () => Navigator.pop(context),
                      child: Row(children: [
                        const Icon(Icons.arrow_back_ios, color: AppColors.neonCyan, size: 16),
                        const SizedBox(width: 4),
                        Text('BACK', style: GoogleFonts.orbitron(color: AppColors.neonCyan, fontSize: 11, letterSpacing: 2)),
                      ]),
                    ),
                    const SizedBox(height: 48),
                    Text('CREATE\nACCOUNT', style: Theme.of(context).textTheme.displayMedium?.copyWith(height: 1.1)),
                    const SizedBox(height: 8),
                    Text('Join the nest network', style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: AppColors.textDim, letterSpacing: 1)),
                    const SizedBox(height: 40),

                    _fieldLabel('USERNAME'),
                    const SizedBox(height: 8),
                    TextFormField(
                      controller: _usernameCtrl,
                      style: GoogleFonts.rajdhani(color: AppColors.textPrimary, fontSize: 16),
                      decoration: const InputDecoration(
                        hintText: 'your_handle',
                        prefixIcon: Icon(Icons.person_outline, color: AppColors.textDim, size: 18),
                      ),
                      validator: (v) => v!.length < 3 ? 'Min 3 characters' : null,
                    ),
                    const SizedBox(height: 20),

                    _fieldLabel('EMAIL ADDRESS'),
                    const SizedBox(height: 8),
                    TextFormField(
                      controller: _emailCtrl,
                      keyboardType: TextInputType.emailAddress,
                      style: GoogleFonts.rajdhani(color: AppColors.textPrimary, fontSize: 16),
                      decoration: const InputDecoration(
                        hintText: 'user@domain.com',
                        prefixIcon: Icon(Icons.alternate_email, color: AppColors.textDim, size: 18),
                      ),
                      validator: (v) => v!.isEmpty ? 'Required' : null,
                    ),
                    const SizedBox(height: 20),

                    _fieldLabel('PASSWORD'),
                    const SizedBox(height: 8),
                    TextFormField(
                      controller: _passCtrl,
                      obscureText: _obscure,
                      style: GoogleFonts.rajdhani(color: AppColors.textPrimary, fontSize: 16),
                      decoration: InputDecoration(
                        hintText: '••••••••',
                        prefixIcon: const Icon(Icons.lock_outline, color: AppColors.textDim, size: 18),
                        suffixIcon: IconButton(
                          icon: Icon(_obscure ? Icons.visibility_off_outlined : Icons.visibility_outlined, color: AppColors.textDim, size: 18),
                          onPressed: () => setState(() => _obscure = !_obscure),
                        ),
                      ),
                      validator: (v) => v!.length < 6 ? 'Min 6 characters' : null,
                    ),
                    const SizedBox(height: 20),

                    _fieldLabel('CONFIRM PASSWORD'),
                    const SizedBox(height: 8),
                    TextFormField(
                      controller: _confirmCtrl,
                      obscureText: _obscureConfirm,
                      style: GoogleFonts.rajdhani(color: AppColors.textPrimary, fontSize: 16),
                      decoration: InputDecoration(
                        hintText: '••••••••',
                        prefixIcon: const Icon(Icons.lock_outline, color: AppColors.textDim, size: 18),
                        suffixIcon: IconButton(
                          icon: Icon(_obscureConfirm ? Icons.visibility_off_outlined : Icons.visibility_outlined, color: AppColors.textDim, size: 18),
                          onPressed: () => setState(() => _obscureConfirm = !_obscureConfirm),
                        ),
                      ),
                      validator: (v) => v != _passCtrl.text ? 'Passwords do not match' : null,
                    ),
                    const SizedBox(height: 40),

                    if (auth.isLoading)
                      const Center(child: CircularProgressIndicator(color: AppColors.neonCyan))
                    else
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton(
                          onPressed: () async {
                            if (_formKey.currentState!.validate()) {
                              try {
                                final nav = Navigator.of(context);
                              await auth.register(_usernameCtrl.text.trim(), _emailCtrl.text.trim(), _passCtrl.text);
                                if (!mounted) return;
                                nav.pushReplacementNamed('/feed');
                              } catch (e) {
                                if (!mounted) return;
                                if (context.mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(e.toString())));
                              }
                            }
                          },
                          child: const Text('CREATE ACCOUNT'),
                        ),
                      ),
                    const SizedBox(height: 24),
                    Center(
                      child: TextButton(
                        onPressed: () => Navigator.pushReplacementNamed(context, '/login'),
                        child: RichText(
                          text: TextSpan(
                            style: GoogleFonts.rajdhani(fontSize: 14, color: AppColors.textSecondary),
                            children: [
                              const TextSpan(text: 'Already have an account? '),
                              TextSpan(text: 'Login', style: GoogleFonts.rajdhani(color: AppColors.neonCyan, fontWeight: FontWeight.w700)),
                            ],
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 32),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _BgPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()..color = AppColors.neonPurple.withValues(alpha: 0.03)..strokeWidth = 1;
    const step = 40.0;
    for (double x = 0; x < size.width; x += step) { canvas.drawLine(Offset(x, 0), Offset(x, size.height), paint); }
    for (double y = 0; y < size.height; y += step) { canvas.drawLine(Offset(0, y), Offset(size.width, y), paint); }
    final glow = Paint()
      ..shader = RadialGradient(
        colors: [AppColors.neonPurple.withValues(alpha: 0.07), Colors.transparent],
      ).createShader(Rect.fromCircle(center: Offset(size.width, 0), radius: size.width * 0.8));
    canvas.drawRect(Rect.fromLTWH(0, 0, size.width, size.height), glow);
  }
  @override
  bool shouldRepaint(_) => false;
}
