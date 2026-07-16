package Application;

import java.io.IOException;
import java.lang.reflect.Method;
import java.net.URL;
import java.util.ResourceBundle;

import Application.model.Student;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.fxml.Initializable;
import javafx.scene.Node;
import javafx.scene.Parent;
import javafx.scene.layout.AnchorPane;

public class MainController implements Initializable {

    @FXML
    private AnchorPane contentPane;

    private final ObservableList<Student> students = FXCollections.observableArrayList();

    @Override
    public void initialize(URL location, ResourceBundle resources) {
        try {
            loadView("Home.fxml");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public void loadView(String fxmlFile) throws IOException {
        FXMLLoader loader = new FXMLLoader(getClass().getResource(fxmlFile));
        Parent view = loader.load();

        Object controller = loader.getController();
        if (controller != null) {
            try {
                Method m = controller.getClass().getMethod("setMainController", MainController.class);
                m.invoke(controller, this);
            } catch (Exception ex) {
                // ignore if not present
            }
            try {
                Method m2 = controller.getClass().getMethod("setStudentList", ObservableList.class);
                m2.invoke(controller, students);
            } catch (Exception ex) {
            }
        }

        contentPane.getChildren().setAll(view);
        AnchorPane.setTopAnchor(view, 0.0);
        AnchorPane.setBottomAnchor(view, 0.0);
        AnchorPane.setLeftAnchor(view, 0.0);
        AnchorPane.setRightAnchor(view, 0.0);
    }

    public void showHome() {
        try { loadView("Home.fxml"); } catch (IOException e) { e.printStackTrace(); }
    }

    public void showAddStudent() {
        try { loadView("AddStudent.fxml"); } catch (IOException e) { e.printStackTrace(); }
    }

    public void showViewStudents() {
        try { loadView("ViewStudents.fxml"); } catch (IOException e) { e.printStackTrace(); }
    }
}
