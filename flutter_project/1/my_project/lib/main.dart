import 'package:flutter/material.dart';
import 'package:my_project/second.dart';
void main() {
  runApp(
    MaterialApp(
      home: Second()));
}

class Box extends StatelessWidget {
  const Box({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('sandy'),
        backgroundColor: Colors.red,
      ),
      body:Row(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          Container(
          height: 300,
            color: Colors.amber,
            child: const Text('one'),
          ),
          Container(
          height: 200,
            color: const Color.fromARGB(255, 7, 90, 255),
            child: const Text('two'),
          ),
          Container(
          height: 100,
            color: const Color.fromARGB(255, 7, 255, 81),
            child: const Text('three'),
          ),
        ],
      ),
    );
  }
}

