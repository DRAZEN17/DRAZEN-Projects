import 'package:book/screens/login.dart';
import 'package:flutter/material.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.all(20),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Card(
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(20),
            ),
            elevation: 3,
            child: Padding(
              padding: EdgeInsets.all(20),
              child: Row(
                children: [
                  CircleAvatar(
                    radius: 30,
                    backgroundColor: Colors.black,
                    child: Icon(
                      Icons.person,
                      color: const Color.fromARGB(255, 231, 210, 210),
                      size: 35,
                    ),
                  ),
                  SizedBox(width: 30),

                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        "Miracle Ebube",
                        style: TextStyle(
                          fontSize: 18,
                          color: const Color.fromARGB(255, 46, 31, 31),
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      SizedBox(height: 4),
                      Text(
                        "Ebubemiracle@gmail.com",
                        style: TextStyle(
                          color: const Color.fromARGB(255, 46, 31, 31),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),

          SizedBox(height: 40),

          ElevatedButton(
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => LoginScreen()),
              );
            },
            child: Text('Logout'),
          ),
        ],
      ),
    );
  }
}
