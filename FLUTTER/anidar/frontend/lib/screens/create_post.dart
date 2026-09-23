import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import '../providers/auth_provider.dart';
import '../providers/post_provider.dart';
import '../services/api_service.dart';
import '../theme.dart';

class CreatePostPage extends StatefulWidget {
  final String? preselectedNest;
  const CreatePostPage({super.key, this.preselectedNest});
  @override
  State<CreatePostPage> createState() => _CreatePostPageState();
}

class _CreatePostPageState extends State<CreatePostPage> {
  final _formKey = GlobalKey<FormState>();
  final _titleCtrl = TextEditingController();
  final _bodyCtrl = TextEditingController();
  String? _selectedNest;
  List<Map<String, dynamic>> _nests = [];
  bool _loading = false;
  bool _loadingNests = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _selectedNest = widget.preselectedNest;
    _loadNests();
  }

  @override
  void dispose() {
    _titleCtrl.dispose();
    _bodyCtrl.dispose();
    super.dispose();
  }

  Future<void> _loadNests() async {
    final api = context.read<AuthProvider>().accessToken;
    try {
      final res = await ApiService().get('/nests');
      if (res.statusCode == 200) {
        final List list = jsonDecode(res.body);
        setState(() {
          _nests = list.cast<Map<String, dynamic>>();
          if (_selectedNest == null && _nests.isNotEmpty) {
            _selectedNest = _nests.first['slug'];
          }
          _loadingNests = false;
        });
      }
    } catch (e) {
      setState(() => _loadingNests = false);
    }
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    if (_selectedNest == null) {
      setState(() => _error = 'Please select a nest');
      return;
    }
    setState(() { _loading = true; _error = null; });
    try {
      final api = ApiService();
      api.accessToken = context.read<AuthProvider>().accessToken;
      final res = await api.post('/nests/$_selectedNest/posts', body: {
        'title': _titleCtrl.text.trim(),
        'body': _bodyCtrl.text.trim(),
        'type': 'text',
      });
      if (res.statusCode == 201) {
        if (!mounted) return;
        // Refresh the feed
        await context.read<PostProvider>().fetchFeed(sort: 'new');
        Navigator.pop(context, true); // true = post created
      } else {
        final err = jsonDecode(res.body);
        setState(() => _error = err['error'] ?? 'Failed to create post');
      }
    } catch (e) {
      setState(() => _error = e.toString());
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgDeep,
      appBar: AppBar(
        backgroundColor: AppColors.bgCard,
        leading: IconButton(
          icon: const Icon(Icons.close, color: AppColors.textSecondary),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text('NEW POST', style: Theme.of(context).appBarTheme.titleTextStyle),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 12),
            child: _loading
                ? const SizedBox(
                    width: 20, height: 20,
                    child: CircularProgressIndicator(color: AppColors.neonCyan, strokeWidth: 2))
                : GestureDetector(
                    onTap: _submit,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
                      decoration: BoxDecoration(
                        color: AppColors.neonCyan,
                        borderRadius: BorderRadius.circular(4),
                        boxShadow: [BoxShadow(color: AppColors.neonCyan.withValues(alpha: 0.4), blurRadius: 8)],
                      ),
                      child: Text('POST',
                        style: GoogleFonts.orbitron(
                          color: AppColors.bgDeep, fontSize: 11,
                          fontWeight: FontWeight.w800, letterSpacing: 1.5)),
                    ),
                  ),
          ),
        ],
        bottom: PreferredSize(preferredSize: const Size.fromHeight(1),
          child: Container(height: 1, color: AppColors.borderMuted)),
      ),
      body: _loadingNests
          ? const Center(child: CircularProgressIndicator(color: AppColors.neonCyan))
          : SingleChildScrollView(
              padding: const EdgeInsets.all(20),
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Nest selector
                    _label('POST TO'),
                    const SizedBox(height: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14),
                      decoration: BoxDecoration(
                        color: AppColors.bgSurface,
                        borderRadius: BorderRadius.circular(6),
                        border: Border.all(color: AppColors.borderMuted, width: 1),
                      ),
                      child: DropdownButtonHideUnderline(
                        child: DropdownButton<String>(
                          value: _selectedNest,
                          dropdownColor: AppColors.bgCard,
                          isExpanded: true,
                          style: GoogleFonts.rajdhani(color: AppColors.textPrimary, fontSize: 15),
                          icon: const Icon(Icons.keyboard_arrow_down, color: AppColors.neonCyan),
                          items: _nests.map((n) => DropdownMenuItem<String>(
                            value: n['slug'] as String,
                            child: Row(children: [
                              Text('n/', style: GoogleFonts.orbitron(color: AppColors.neonPurple, fontSize: 11)),
                              Text(n['slug'] as String,
                                style: GoogleFonts.rajdhani(color: AppColors.textPrimary, fontSize: 15)),
                            ]),
                          )).toList(),
                          onChanged: (v) => setState(() => _selectedNest = v),
                        ),
                      ),
                    ),
                    const SizedBox(height: 20),

                    // Title
                    _label('TITLE'),
                    const SizedBox(height: 8),
                    TextFormField(
                      controller: _titleCtrl,
                      maxLength: 300,
                      style: GoogleFonts.rajdhani(color: AppColors.textPrimary, fontSize: 16),
                      decoration: InputDecoration(
                        hintText: 'What\'s on your mind?',
                        hintStyle: GoogleFonts.rajdhani(color: AppColors.textDim),
                        counterStyle: GoogleFonts.rajdhani(color: AppColors.textDim, fontSize: 11),
                      ),
                      validator: (v) => (v == null || v.trim().isEmpty) ? 'Title is required' : null,
                      maxLines: 2,
                    ),
                    const SizedBox(height: 20),

                    // Body
                    _label('BODY (OPTIONAL)'),
                    const SizedBox(height: 8),
                    TextFormField(
                      controller: _bodyCtrl,
                      style: GoogleFonts.rajdhani(color: AppColors.textPrimary, fontSize: 15, height: 1.5),
                      decoration: InputDecoration(
                        hintText: 'Add more details...',
                        hintStyle: GoogleFonts.rajdhani(color: AppColors.textDim),
                        alignLabelWithHint: true,
                      ),
                      maxLines: 8,
                      minLines: 4,
                    ),

                    // Error
                    if (_error != null) ...[
                      const SizedBox(height: 16),
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: AppColors.neonPink.withValues(alpha: 0.1),
                          borderRadius: BorderRadius.circular(6),
                          border: Border.all(color: AppColors.neonPink.withValues(alpha: 0.4)),
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
                  ],
                ),
              ),
            ),
    );
  }

  Widget _label(String text) => Text(text,
    style: GoogleFonts.orbitron(color: AppColors.textDim, fontSize: 10, letterSpacing: 2));
}
