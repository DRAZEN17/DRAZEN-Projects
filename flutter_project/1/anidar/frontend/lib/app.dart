import 'package:anidar/screens/splash.dart';
import 'package:flutter/material.dart';
import 'theme.dart';
import 'screens/landing.dart';
import 'screens/login.dart';
import 'screens/register.dart';
import 'screens/feed.dart';
import 'screens/nest_detail.dart';
import 'screens/nest_chat.dart';
import 'screens/post_detail.dart';
import 'screens/profile.dart';
import 'screens/settings.dart';
import 'widgets/protected_route.dart';
import 'package:anidar/screens/direct_chat.dart';

class AnidarApp extends StatelessWidget {
  const AnidarApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Anidar',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.darkTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: ThemeMode.dark,
      initialRoute: '/splash',
      routes: {
        '/splash': (context) => const SplashPage(),
        '/': (context) => const LandingPage(),
        '/login': (context) => const LoginPage(),
        '/register': (context) => const RegisterPage(),
        '/feed': (context) => const ProtectedRoute(child: FeedPage()),
        '/settings': (context) => const ProtectedRoute(child: SettingsPage()),
      },
      onGenerateRoute: (settings) {
        final uri = Uri.parse(settings.name ?? '');

        if (uri.pathSegments.length >= 2 && uri.pathSegments[0] == 'n') {
          final nestSlug = uri.pathSegments[1];
          if (uri.pathSegments.length >= 4 && uri.pathSegments[2] == 'post') {
            final postId = uri.pathSegments[3];
            return MaterialPageRoute(builder: (_) => ProtectedRoute(child: PostDetailPage(nestSlug: nestSlug, postId: postId)));
          }
          if (uri.pathSegments.length >= 3 && uri.pathSegments[2] == 'chat') {
            return MaterialPageRoute(builder: (_) => ProtectedRoute(child: NestChatPage(nestSlug: nestSlug)));
          }
          return MaterialPageRoute(builder: (_) => ProtectedRoute(child: NestDetailPage(nestSlug: nestSlug)));
        }

        if (uri.pathSegments.length >= 2 && uri.pathSegments[0] == 'profile') {
          final username = uri.pathSegments[1];
          return MaterialPageRoute(builder: (_) => ProtectedRoute(child: ProfilePage(username: username)));
        }

        if (uri.pathSegments.length >= 2 && uri.pathSegments[0] == 'messages') {
          final otherUserId = int.tryParse(uri.pathSegments[1]) ?? 0;
          final otherUsername = uri.queryParameters['username'] ?? '...';
          return MaterialPageRoute(
            builder: (_) => ProtectedRoute(
              child: DirectChatPage(otherUserId: otherUserId, otherUsername: otherUsername),
            ),
          );
        }

        return null;
      },
    );
  }
}
