import 'package:flutter/material.dart';

class CoffeePrefs extends StatefulWidget {
  const CoffeePrefs({super.key});

  @override
  State<CoffeePrefs> createState() => _CoffeePrefsState();
}

class _CoffeePrefsState extends State<CoffeePrefs> {
  int strength = 1;
  int sugar = 0;
  void incrementStrength(){
    setState(() {
    strength = strength < 5 ? strength + 1 : 1;
    });
  }

  void incrementSugar(){
    setState(() {
    sugar = sugar < 5 ? sugar + 1 : 0;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Row(
          children: [
            Text("logo: "),
            // Text("$strength"),
            SizedBox(width: 30,),
            for (int i = 0; i < strength; i++)
              Image.asset(
                'assets/image/C&D.png',
                width: 30,
                color: const Color.fromARGB(255, 16, 187, 13),
                colorBlendMode: BlendMode.multiply,
                ),

              Expanded(child: SizedBox()),
              FilledButton(
                style: FilledButton.styleFrom(
                  backgroundColor: Colors.yellow,
                  foregroundColor: const Color.fromARGB(255, 255, 0, 0),
                ),
                onPressed: incrementStrength,
                child: const Text('+'),
              ),
          ],
        ),
        Row(
          children: [
            Text("Sugar: "),
            // Text("$sugar"),
            SizedBox(width: 30,),
            if (sugar == 0)
              const Text('none left'),
            for (int i = 0; i < sugar; i++)
              Image.asset(
                'assets/image/coffee.jpeg',
                width: 30,
                color: const Color.fromARGB(255, 16, 187, 13),
                colorBlendMode: BlendMode.multiply,
                ),

              Expanded(child: SizedBox()),
              TextButton(
                style: FilledButton.styleFrom(
                  backgroundColor: Colors.yellow,
                  foregroundColor: const Color.fromARGB(255, 255, 0, 0),
                ),
                onPressed: incrementSugar,
                child: const Text('+'),
              )
          ],
        ),
      ],
    );
  }
}