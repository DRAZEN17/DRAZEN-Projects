import 'package:flutter/material.dart';

class NotificationBell extends StatefulWidget {
  const NotificationBell({super.key});

  @override
  State<NotificationBell> createState() => _NotificationBellState();
}

class _NotificationBellState extends State<NotificationBell> {
  final int _unseen = 0;

  @override
  void initState() {
    super.initState();
    // In real app, fetch unseen count from API
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        IconButton(
          icon: const Icon(Icons.notifications),
          onPressed: () {
            showDialog(
              context: context,
              builder: (_) => const AlertDialog(title: Text('Notifications'), content: Text('Coming soon')),
            );
          },
        ),
        if (_unseen > 0)
          Positioned(
            right: 6,
            top: 6,
            child: Container(
              padding: const EdgeInsets.all(2),
              decoration: BoxDecoration(color: Colors.red, borderRadius: BorderRadius.circular(8)),
              constraints: const BoxConstraints(minWidth: 16, minHeight: 16),
              child: Text('$_unseen', style: const TextStyle(color: Colors.white, fontSize: 10), textAlign: TextAlign.center),
            ),
          ),
      ],
    );
  }
}