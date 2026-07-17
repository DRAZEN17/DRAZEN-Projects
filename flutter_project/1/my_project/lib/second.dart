import 'package:flutter/material.dart';

class Second extends StatelessWidget {
  const Second({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: const Color.fromARGB(255, 44, 186, 252),
        title: const Text(
          'simple profile card',
          style: TextStyle(color: Colors.white),
        ),
        shadowColor: Colors.black,
        elevation: 3,
      ),
      body:Container(
        height: 400,
        width: 340,
        margin:EdgeInsets.fromLTRB(17, 90, 17, 20),
            decoration: BoxDecoration(
              border: Border.all(color:Colors.black, width: 2),
              color: Colors.white,
              borderRadius: BorderRadius.circular(10),
              boxShadow:[
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.2),
                  blurRadius: 7,
                  spreadRadius: 5,
                  offset: Offset(0, 3)
                )
              ]
            ),
            child:Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                  Container(
                    height: 120,
                    width: 120,
                    decoration: BoxDecoration(
                      border: Border.all(color: Colors.blueAccent),
                      borderRadius: BorderRadius.circular(70),
                      image: DecorationImage(image: AssetImage(
                        'assets/image/Drazen_Cyberpunk_Logo.jpg'
                        )
                      )
                    ),
                  )
              ],
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                  Text('DRAZEN',
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
                  Text('a simple person who loves coding',
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
                FilledButton(
                  style: FilledButton.styleFrom(
                    backgroundColor: Colors.blueAccent,
                    foregroundColor: Colors.white,
                  ),
                  onPressed:() {},
                  child: const Text('follow'),
                  ),
                  SizedBox(width: 10,),
                OutlinedButton(
                  style: OutlinedButton.styleFrom(
                    side: BorderSide(color: Colors.blueAccent),
                    foregroundColor: Colors.blueAccent,
                  ),
                  
                  onPressed:() {},
                  child: const Text('message'),
                  ),
                  // SizedBox(height: 50,),
              ],
            ),
          ],
          ),
        ) ,
    );
  }
}