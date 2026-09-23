import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppColors {
  static const bgDeep = Color(0xFF030712);
  static const bgCard = Color(0xFF0D1117);
  static const bgSurface = Color(0xFF161B22);
  static const bgGlass = Color(0xFF1C2333);

  static const neonCyan = Color(0xFF00F5FF);
  static const neonPink = Color(0xFFFF2D78);
  static const neonPurple = Color(0xFFBF00FF);
  static const neonGreen = Color(0xFF39FF14);
  static const neonAmber = Color(0xFFFFB700);

  static const textPrimary = Color(0xFFF0F6FC);
  static const textSecondary = Color(0xFF8B949E);
  static const textDim = Color(0xFF484F58);

  static const borderMuted = Color(0xFF21262D);
}

// Helper
extension NeonColor on Color {
  Color o(double opacity) => withValues(alpha: opacity);
}

class AppTheme {
  static ThemeData darkTheme = ThemeData(
    useMaterial3: true,
    brightness: Brightness.dark,
    scaffoldBackgroundColor: AppColors.bgDeep,
    colorScheme: const ColorScheme.dark(
      primary: AppColors.neonCyan,
      secondary: AppColors.neonPink,
      tertiary: AppColors.neonPurple,
      surface: AppColors.bgCard,
      onPrimary: AppColors.bgDeep,
      onSecondary: AppColors.textPrimary,
      onSurface: AppColors.textPrimary,
    ),
    textTheme: GoogleFonts.rajdhaniTextTheme(ThemeData.dark().textTheme).copyWith(
      displayLarge: GoogleFonts.orbitron(color: AppColors.textPrimary, fontSize: 36, fontWeight: FontWeight.w900, letterSpacing: 4),
      displayMedium: GoogleFonts.orbitron(color: AppColors.textPrimary, fontSize: 28, fontWeight: FontWeight.w800, letterSpacing: 3),
      headlineLarge: GoogleFonts.orbitron(color: AppColors.textPrimary, fontSize: 24, fontWeight: FontWeight.w700, letterSpacing: 2),
      headlineMedium: GoogleFonts.orbitron(color: AppColors.textPrimary, fontSize: 20, fontWeight: FontWeight.w600, letterSpacing: 1.5),
      titleLarge: GoogleFonts.rajdhani(color: AppColors.textPrimary, fontSize: 18, fontWeight: FontWeight.w600, letterSpacing: 1),
      bodyLarge: GoogleFonts.rajdhani(color: AppColors.textPrimary, fontSize: 16, letterSpacing: 0.3),
      bodyMedium: GoogleFonts.rajdhani(color: AppColors.textSecondary, fontSize: 14, letterSpacing: 0.2),
      labelLarge: GoogleFonts.rajdhani(color: AppColors.neonCyan, fontSize: 14, fontWeight: FontWeight.w700, letterSpacing: 1.5),
    ),
    appBarTheme: AppBarTheme(
      backgroundColor: AppColors.bgDeep,
      elevation: 0,
      centerTitle: false,
      titleTextStyle: GoogleFonts.orbitron(color: AppColors.neonCyan, fontSize: 16, fontWeight: FontWeight.w700, letterSpacing: 2),
      iconTheme: const IconThemeData(color: AppColors.neonCyan),
    ),
    // FIX: CardTheme → CardThemeData
    cardTheme: CardThemeData(
      color: AppColors.bgCard,
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(8),
        side: const BorderSide(color: AppColors.borderMuted, width: 1),
      ),
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: AppColors.bgSurface,
      hintStyle: GoogleFonts.rajdhani(color: AppColors.textDim, letterSpacing: 0.5),
      labelStyle: GoogleFonts.rajdhani(color: AppColors.neonCyan, letterSpacing: 0.5),
      enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(6), borderSide: const BorderSide(color: AppColors.borderMuted, width: 1)),
      focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(6), borderSide: const BorderSide(color: AppColors.neonCyan, width: 1.5)),
      errorBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(6), borderSide: const BorderSide(color: AppColors.neonPink, width: 1)),
      focusedErrorBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(6), borderSide: const BorderSide(color: AppColors.neonPink, width: 1.5)),
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: AppColors.neonCyan,
        foregroundColor: AppColors.bgDeep,
        elevation: 0,
        padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 14),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(4)),
        textStyle: GoogleFonts.orbitron(fontSize: 12, fontWeight: FontWeight.w700, letterSpacing: 2),
      ),
    ),
    textButtonTheme: TextButtonThemeData(
      style: TextButton.styleFrom(
        foregroundColor: AppColors.neonCyan,
        textStyle: GoogleFonts.rajdhani(fontSize: 14, fontWeight: FontWeight.w600, letterSpacing: 1),
      ),
    ),
    iconTheme: const IconThemeData(color: AppColors.neonCyan),
    bottomNavigationBarTheme: const BottomNavigationBarThemeData(
      backgroundColor: AppColors.bgCard,
      selectedItemColor: AppColors.neonCyan,
      unselectedItemColor: AppColors.textDim,
      elevation: 0,
      type: BottomNavigationBarType.fixed,
    ),
    drawerTheme: const DrawerThemeData(backgroundColor: AppColors.bgCard),
    dividerTheme: const DividerThemeData(color: AppColors.borderMuted, thickness: 1),
    snackBarTheme: SnackBarThemeData(
      backgroundColor: AppColors.bgGlass,
      contentTextStyle: GoogleFonts.rajdhani(color: AppColors.textPrimary),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(6), side: const BorderSide(color: AppColors.neonCyan, width: 1)),
      behavior: SnackBarBehavior.floating,
    ),
    progressIndicatorTheme: const ProgressIndicatorThemeData(color: AppColors.neonCyan),
    floatingActionButtonTheme: const FloatingActionButtonThemeData(
      backgroundColor: AppColors.neonPink,
      foregroundColor: AppColors.textPrimary,
      elevation: 0,
    ),
    // FIX: Switch deprecated activeColor → switchTheme
    switchTheme: SwitchThemeData(
      thumbColor: WidgetStateProperty.resolveWith((s) =>
          s.contains(WidgetState.selected) ? AppColors.neonAmber : AppColors.textDim),
      trackColor: WidgetStateProperty.resolveWith((s) =>
          s.contains(WidgetState.selected) ? AppColors.neonAmber.withValues(alpha: 0.35) : AppColors.borderMuted),
    ),
  );

  static ThemeData lightTheme = darkTheme;
}

class NeonText extends StatelessWidget {
  final String text;
  final TextStyle? style;
  final Color glowColor;
  final double glowRadius;
  const NeonText(this.text, {super.key, this.style, this.glowColor = AppColors.neonCyan, this.glowRadius = 8});

  @override
  Widget build(BuildContext context) {
    return Text(text, style: (style ?? Theme.of(context).textTheme.bodyLarge)?.copyWith(
      color: glowColor,
      shadows: [
        Shadow(color: glowColor.withValues(alpha: 0.8), blurRadius: glowRadius),
        Shadow(color: glowColor.withValues(alpha: 0.4), blurRadius: glowRadius * 2),
      ],
    ));
  }
}

class GlassCard extends StatelessWidget {
  final Widget child;
  final EdgeInsets? padding;
  final Color? borderColor;
  final double borderRadius;
  final VoidCallback? onTap;
  const GlassCard({super.key, required this.child, this.padding, this.borderColor, this.borderRadius = 8, this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: padding ?? const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppColors.bgCard,
          borderRadius: BorderRadius.circular(borderRadius),
          border: Border.all(color: borderColor ?? AppColors.borderMuted, width: 1),
          boxShadow: borderColor != null
              ? [BoxShadow(color: borderColor!.withValues(alpha: 0.15), blurRadius: 12)]
              : null,
        ),
        child: child,
      ),
    );
  }
}

class NeonDivider extends StatelessWidget {
  final Color color;
  const NeonDivider({super.key, this.color = AppColors.neonCyan});

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 1,
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [Colors.transparent, color.withValues(alpha: 0.6), Colors.transparent],
        ),
      ),
    );
  }
}
