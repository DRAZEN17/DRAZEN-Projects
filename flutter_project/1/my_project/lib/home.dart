import 'package:flutter/material.dart';
import 'package:my_project/coffee_prefs.dart';

class Home extends StatelessWidget {
  const Home({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: const Text(
            'my fav artist',
            style: TextStyle(color: Colors.lightBlue, fontWeight: FontWeight.bold),
          ),
          backgroundColor: const Color.fromARGB(255, 4, 255, 0),
          centerTitle: true,
        ),
        body:Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Container(
              color: const Color.fromARGB(255, 16, 187, 13),
              padding: const EdgeInsets.all(20),
              child: const Text("6ix 9ine"),
            ),
            Container(
              color: const Color.fromARGB(255, 16, 187, 13),
              padding: const EdgeInsets.all(20),
              child: const Text("eminem"),
            ),
            Container(
              color: const Color.fromARGB(255, 16, 187, 13),
              padding: const EdgeInsets.all(20),
              child: const CoffeePrefs(),
            ),
            Expanded(
              child: Image.asset( 
              'assets/image/Drazen_Cyberpunk_Logo.jpg',
              fit: BoxFit.fitHeight,
              alignment: Alignment.bottomCenter,
              ),
              ),
          ],
        ),
      );
  }
}