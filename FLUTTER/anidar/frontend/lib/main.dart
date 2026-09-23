import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'app.dart';
import 'providers/auth_provider.dart';
import 'providers/nest_provider.dart';
import 'providers/post_provider.dart';
import 'providers/chat_provider.dart';
import 'providers/direct_chat_provider.dart';
import 'providers/conversations_provider.dart';

void main() {
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProxyProvider<AuthProvider, NestProvider>(
          create: (_) => NestProvider(),
          update: (_, auth, nest) => nest!..updateAuth(auth),
        ),
        ChangeNotifierProxyProvider<AuthProvider, PostProvider>(
          create: (_) => PostProvider(),
          update: (_, auth, post) => post!..updateAuth(auth),
        ),
        ChangeNotifierProxyProvider<AuthProvider, ChatProvider>(
          create: (_) => ChatProvider(),
          update: (_, auth, chat) => chat!..updateAuth(auth),
        ),
        ChangeNotifierProxyProvider<AuthProvider, DirectChatProvider>(
          create: (_) => DirectChatProvider(),
          update: (_, auth, chat) => chat!..updateAuth(auth),
        ),
        ChangeNotifierProxyProvider<AuthProvider, ConversationsProvider>(
          create: (_) => ConversationsProvider(),
          update: (_, auth, convs) => convs!..updateAuth(auth),
        ),
      ],
      child: const AnidarApp(),
    ),
  );
}
