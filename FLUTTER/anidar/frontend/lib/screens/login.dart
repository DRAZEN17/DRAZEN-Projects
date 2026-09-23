import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import '../providers/auth_provider.dart';
import '../theme.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});
  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final _formKey = GlobalKey<FormState>();
  final _emailCtrl = TextEditingController();
  final _passCtrl = TextEditingController();
  bool _remember = false;
  bool _obscure = true;
  bool _loading = false;
  String? _error;

  @override
  void dispose() {
    _emailCtrl.dispose();
    _passCtrl.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() { _loading = true; _error = null; });
    try {
      await context.read<AuthProvider>().login(
        _emailCtrl.text.trim(),
        _passCtrl.text,
      );
      if (!mounted) return;
      Navigator.pushReplacementNamed(context, '/feed');
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _error = e.toString().replaceAll('Exception: ', '');
        _loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgDeep,
      body: Stack(
        children: [
          CustomPaint(painter: _GridPainter(), size: Size.infinite),
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
                    Text('WELCOME\nBACK',
                      style: Theme.of(context).textTheme.displayMedium?.copyWith(height: 1.1)),
                    const SizedBox(height: 8),
                    Text('Sign in to your nest',
                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: AppColors.textDim, letterSpacing: 1)),
                    const SizedBox(height: 48),

                    _label('EMAIL ADDRESS'),
                    const SizedBox(height: 8),
                    TextFormField(
                      controller: _emailCtrl,
                      keyboardType: TextInputType.emailAddress,
                      autocorrect: false,
                      style: GoogleFonts.rajdhani(color: AppColors.textPrimary, fontSize: 16),
                      decoration: const InputDecoration(
                        hintText: 'user@domain.com',
                        prefixIcon: Icon(Icons.alternate_email, color: AppColors.textDim, size: 18),
                      ),
                      validator: (v) => (v == null || v.isEmpty) ? 'Required' : null,
                      onFieldSubmitted: (_) => _submit(),
                    ),
                    const SizedBox(height: 20),

                    _label('PASSWORD'),
                    const SizedBox(height: 8),
                    TextFormField(
                      controller: _passCtrl,
                      obscureText: _obscure,
                      style: GoogleFonts.rajdhani(color: AppColors.textPrimary, fontSize: 16),
                      decoration: InputDecoration(
                        hintText: '••••••••',
                        prefixIcon: const Icon(Icons.lock_outline, color: AppColors.textDim, size: 18),
                        suffixIcon: IconButton(
                          icon: Icon(_obscure ? Icons.visibility_off_outlined : Icons.visibility_outlined,
                            color: AppColors.textDim, size: 18),
                          onPressed: () => setState(() => _obscure = !_obscure),
                        ),
                      ),
                      validator: (v) => (v == null || v.isEmpty) ? 'Required' : null,
                      onFieldSubmitted: (_) => _submit(),
                    ),
                    const SizedBox(height: 16),

                    Row(children: [
                      SizedBox(
                        width: 20, height: 20,
                        child: Checkbox(
                          value: _remember,
                          onChanged: (v) => setState(() => _remember = v ?? false),
                          activeColor: AppColors.neonCyan,
                          side: const BorderSide(color: AppColors.textDim, width: 1),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(3)),
                        ),
                      ),
                      const SizedBox(width: 10),
                      Text('Remember me',
                        style: GoogleFonts.rajdhani(color: AppColors.textSecondary, fontSize: 14)),
                    ]),

                    // Error message
                    if (_error != null) ...[
                      const SizedBox(height: 16),
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: AppColors.neonPink.withValues(alpha: 0.1),
                          borderRadius: BorderRadius.circular(6),
                          border: Border.all(color: AppColors.neonPink.withValues(alpha: 0.4), width: 1),
                        ),
                        child: Row(children: [
                          const Icon(Icons.error_outline, color: AppColors.neonPink, size: 16),
                          const SizedBox(width: 8),
                          Expanded(child: Text(_error!,
                            style: GoogleFonts.rajdhani(color: AppColors.neonPink, fontSize: 13))),
                        ]),
                      ),
                    ],

                    const SizedBox(height: 40),

                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: _loading ? null : _submit,
                        child: _loading
                            ? const SizedBox(
                                height: 20, width: 20,
                                child: CircularProgressIndicator(
                                  color: AppColors.bgDeep, strokeWidth: 2))
                            : const Text('LOGIN'),
                      ),
                    ),
                    const SizedBox(height: 24),
                    Center(
                      child: TextButton(
                        onPressed: () => Navigator.pushReplacementNamed(context, '/register'),
                        child: RichText(
                          text: TextSpan(
                            style: GoogleFonts.rajdhani(fontSize: 14, color: AppColors.textSecondary),
                            children: [
                              const TextSpan(text: 'No account? '),
                              TextSpan(text: 'Register here',
                                style: GoogleFonts.rajdhani(
                                  color: AppColors.neonCyan, fontWeight: FontWeight.w700)),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _label(String text) => Text(text,
    style: GoogleFonts.orbitron(color: AppColors.textDim, fontSize: 10, letterSpacing: 2));
}

class _GridPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final p = Paint()
      ..color = AppColors.neonCyan.withValues(alpha: 0.03)
      ..strokeWidth = 1;
    const step = 40.0;
    for (double x = 0; x < size.width; x += step) {
      canvas.drawLine(Offset(x, 0), Offset(x, size.height), p);
    }
    for (double y = 0; y < size.height; y += step) {
      canvas.drawLine(Offset(0, y), Offset(size.width, y), p);
    }
  }
  @override
  bool shouldRepaint(_) => false;
}
