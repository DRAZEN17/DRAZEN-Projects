import 'package:flutter_test/flutter_test.dart';
import 'package:anidar/main.dart' as app;

void main() {
  testWidgets('App smoke test', (WidgetTester tester) async {
    app.main();
    await tester.pumpAndSettle();
  });
}
