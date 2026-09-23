import 'package:book/screens/add.dart';
import 'package:book/screens/edit.dart';
import 'package:book/screens/settings.dart';
import 'package:flutter/material.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int currentIndex = 0;

  @override
  Widget build(BuildContext context) {
    final pages = [
      ListView(
        padding: const EdgeInsets.all(10),
        children: [
          Card(
            child: ListTile(
              leading: Icon(Icons.book),
              title: Text("Flutter basics"),
              subtitle: Text("John Doe"),
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => EditBookScreen()),
                );
              },
            ),
          ),
          Card(
            child: ListTile(
              leading: Icon(Icons.book),
              title: Text("Dart basics"),
              subtitle: Text("Mary Doe"),
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => EditBookScreen()),
                );
              },
            ),
          ),
          Card(
            child: ListTile(
              leading: Icon(Icons.book),
              title: Text("ikechukwu basics"),
              subtitle: Text("king Doe"),
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => EditBookScreen()),
                );
              },
            ),
          ),
        ],
      ),
      SettingsScreen(),
    ];
    return Scaffold(
      appBar: AppBar(title: const Text("Book App")),

      body: pages[currentIndex],

      floatingActionButton: FloatingActionButton(
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => AddBookScreen()),
          );
        },
        backgroundColor: Colors.blue,
        child: Icon(Icons.add, color: Colors.white),
      ),

      bottomNavigationBar: BottomNavigationBar(
        currentIndex: currentIndex,
        onTap: (i) {
          setState(() => currentIndex = i);
        },
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.book), label: "Books"),
          BottomNavigationBarItem(
            icon: Icon(Icons.settings),
            label: "Settings",
          ),
        ],
      ),
    );
  }
}
