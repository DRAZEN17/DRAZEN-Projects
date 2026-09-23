import 'package:flutter/material.dart';

class NestSidebar extends StatelessWidget {
  final String? description;
  final int memberCount;
  const NestSidebar({super.key, this.description, required this.memberCount});

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero,
        children: [
          DrawerHeader(
            decoration: BoxDecoration(color: Theme.of(context).primaryColor),
            child: const Text('Nest Info', style: TextStyle(color: Colors.white, fontSize: 24)),
          ),
          ListTile(title: Text('$memberCount members')),
          if (description != null) ListTile(title: Text(description!)),
        ],
      ),
    );
  }
}