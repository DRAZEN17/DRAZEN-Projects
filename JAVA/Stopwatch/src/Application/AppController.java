package Application;

import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Node;
import javafx.scene.layout.AnchorPane;

public class AppController {

    @FXML private AnchorPane contentPane;

    @FXML
    public void initialize() {
        showStopwatch();
    }

    @FXML
    private void showStopwatch() {
        loadIntoContent("Stopwatch.fxml");
    }

    @FXML
    private void showCountdown() {
        loadIntoContent("Countdown.fxml");
    }
    private void loadIntoContent(String fxml) {
        try {
            Node root = FXMLLoader.load(getClass().getResource(fxml));
            contentPane.getChildren().clear();
            AnchorPane.setTopAnchor(root, 0.0);
            AnchorPane.setBottomAnchor(root, 0.0);
            AnchorPane.setLeftAnchor(root, 0.0);
            AnchorPane.setRightAnchor(root, 0.0);
            contentPane.getChildren().add(root);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }
}