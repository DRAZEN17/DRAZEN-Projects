import 'package:flutter/material.dart';

class EditBookScreen extends StatelessWidget {
  const EditBookScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Edit Book")),

      body: Padding(
        padding: EdgeInsets.all(20),
        child: Column(
          children: [
            const SizedBox(height: 10),

            TextField(
              decoration: InputDecoration(
                hintText: "Book title",
                filled: true,
                fillColor: Colors.white,
                prefixIcon: Icon(Icons.book),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(30),
                  borderSide: BorderSide.none,
                ),
              ),
            ),

            const SizedBox(height: 15),

            TextField(
              decoration: InputDecoration(
                hintText: " Author name",
                filled: true,
                fillColor: Colors.white,
                prefixIcon: Icon(Icons.person),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(30),
                  borderSide: BorderSide.none,
                ),
              ),
            ),

            const SizedBox(height: 30),

            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.blue,
                  padding: EdgeInsets.symmetric(vertical: 15),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(30),
                  ),
                ),
                onPressed: () {
                  Navigator.pop(context);
                },
                child: const Text(
                  "save changes",

                  style: TextStyle(color: Colors.white),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
