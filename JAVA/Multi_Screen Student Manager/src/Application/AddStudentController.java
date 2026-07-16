package Application;

import Application.model.Student;
import javafx.collections.ObservableList;
import javafx.fxml.FXML;
import javafx.scene.control.Label;
import javafx.scene.control.TextField;

public class AddStudentController {

    @FXML
    private TextField nameField;

    @FXML
    private TextField ageField;

    @FXML
    private Label confirmationLabel;

    private ObservableList<Student> students;
    private MainController mainController;

    public void setStudentList(ObservableList<Student> students) {
        this.students = students;
    }

    public void setMainController(MainController mc) {
        this.mainController = mc;
    }

    @FXML
    private void onSubmit() {
        String name = nameField.getText();
        String ageText = ageField.getText();
        if (name == null || name.trim().isEmpty()) {
            confirmationLabel.setText("Please enter a name.");
            return;
        }
        int age = 0;
        try {
            age = Integer.parseInt(ageText.trim());
        } catch (Exception e) {
            confirmationLabel.setText("Please enter a valid age.");
            return;
        }
        if (students != null) {
            students.add(new Student(name.trim(), age));
            confirmationLabel.setText("Student added: " + name.trim());
            nameField.clear();
            ageField.clear();
        } else {
            confirmationLabel.setText("Internal error: student list not available.");
        }
    }

    @FXML
    private void onBack() {
        if (mainController != null) mainController.showHome();
    }
}
