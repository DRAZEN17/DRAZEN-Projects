import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import '../providers/auth_provider.dart';
import '../theme.dart';

class SettingsPage extends StatelessWidget {
  const SettingsPage({super.key});

  @override
  Widget build(BuildContext context) {
    final auth = context.read<AuthProvider>();
    return Scaffold(
      backgroundColor: AppColors.bgDeep,
      appBar: AppBar(
        backgroundColor: AppColors.bgDeep,
        title: const Text('SETTINGS'),
        bottom: PreferredSize(preferredSize: const Size.fromHeight(1),
          child: Container(height: 1, color: AppColors.borderMuted)),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _sectionHeader('ACCOUNT'),
          _settingsTile(icon: Icons.person_outline_rounded, label: 'Edit Profile', color: AppColors.neonCyan, onTap: () {}),
          _settingsTile(icon: Icons.lock_outline_rounded, label: 'Change Password', color: AppColors.neonCyan, onTap: () {}),
          const SizedBox(height: 20),
          _sectionHeader('APPEARANCE'),
          _settingsTile(icon: Icons.palette_outlined, label: 'Theme', color: AppColors.neonPurple, trailing: Text('NEON DARK', style: GoogleFonts.orbitron(color: AppColors.neonPurple, fontSize: 10, letterSpacing: 1.5)), onTap: () {}),
          const SizedBox(height: 20),
          _sectionHeader('NOTIFICATIONS'),
          _settingsTile(icon: Icons.notifications_outlined, label: 'Push Notifications', color: AppColors.neonAmber, trailing: _neonSwitch(), onTap: () {}),
          const SizedBox(height: 20),
          _sectionHeader('DANGER ZONE'),
          _settingsTile(icon: Icons.logout_rounded, label: 'Sign Out', color: AppColors.neonPink, onTap: () async {
            await auth.logout();
            if (!context.mounted) return;
            Navigator.pushReplacementNamed(context, '/login');
          }),
          const SizedBox(height: 40),
          Center(child: Column(children: [
            Text('ANIDAR', style: GoogleFonts.orbitron(color: AppColors.textDim, fontSize: 12, letterSpacing: 4)),
            const SizedBox(height: 4),
            Text('v1.0.0 · BETA', style: GoogleFonts.rajdhani(color: AppColors.textDim, fontSize: 12, letterSpacing: 2)),
          ])),
        ],
      ),
    );
  }

  Widget _sectionHeader(String label) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10, left: 2),
      child: Text(label, style: GoogleFonts.orbitron(color: AppColors.textDim, fontSize: 10, letterSpacing: 3)),
    );
  }

  Widget _settingsTile({required IconData icon, required String label, required Color color, Widget? trailing, required VoidCallback onTap}) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      decoration: BoxDecoration(
        color: AppColors.bgCard,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: AppColors.borderMuted, width: 1),
      ),
      child: ListTile(
        leading: Container(
          width: 36, height: 36,
          decoration: BoxDecoration(
            color: color.withValues(alpha: 0.1),
            borderRadius: BorderRadius.circular(6),
          ),
          child: Icon(icon, color: color, size: 18),
        ),
        title: Text(label, style: GoogleFonts.rajdhani(color: AppColors.textPrimary, fontSize: 15, fontWeight: FontWeight.w600)),
        trailing: trailing ?? const Icon(Icons.chevron_right, color: AppColors.textDim, size: 18),
        onTap: onTap,
      ),
    );
  }

  Widget _neonSwitch() {
    return Switch(
      value: true,
      onChanged: (_) {},
    );
  }
}
