import 'package:flutter/material.dart';

class First extends StatelessWidget {
  const First ({super.key});

  @override
  Widget build(BuildContext context) {
        return Scaffold(
        appBar: AppBar(
          title: const Text(
            'my fav artist',
            style: TextStyle(color: Color.fromARGB(255, 0, 0, 0), fontWeight: FontWeight.bold),
          ),
          backgroundColor: const Color.fromARGB(255, 255, 255, 255),
          centerTitle: true,
        ),
        body:Column(
              mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                  Text('Hello World',
                  style: TextStyle(
                    fontSize: 50,
                    fontWeight: FontWeight.bold,
                    
                  ),
                  ),
                  SizedBox(height: 10,),
              ],
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                  Text('my first app project',
                  style: TextStyle(
                    fontSize: 20,
                    color: Colors.grey,
                    fontWeight: FontWeight.w100,
                    
                  ),
                  ),
                  SizedBox(height: 30,),
              ],
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Container(
                  padding: EdgeInsets.all(5),
                  decoration: BoxDecoration(
                    color: const Color.fromARGB(255, 13, 115, 199),
                    borderRadius:BorderRadius.circular(150),
                  ),
                  child: Text('click me',
                  style: TextStyle(
                    fontSize: 25,
                    color: const Color.fromARGB(255, 255, 255, 255),
                    fontWeight: FontWeight.w200,
                  ),
                  ),
                  ),
                  // SizedBox(height: 50,),
              ],
            ),
          ],
        ) ,
        );
  }
}