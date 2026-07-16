package Application;

import Application.model.Student;
import javafx.collections.ObservableList;
import javafx.fxml.FXML;
import javafx.scene.control.ListCell;
import javafx.scene.control.ListView;

public class ViewStudentsController {

    @FXML
    private ListView<Student> studentsListView;

    private ObservableList<Student> students;
    private MainController mainController;

    public void setStudentList(ObservableList<Student> students) {
        this.students = students;
        if (studentsListView != null) studentsListView.setItems(students);
    }

    public void setMainController(MainController mc) {
        this.mainController = mc;
    }

    @FXML
    private void initialize() {
        if (studentsListView != null) {
            studentsListView.setCellFactory(lv -> new ListCell<Student>() {
                @Override
                protected void updateItem(Student item, boolean empty) {
                    super.updateItem(item, empty);
                    if (empty || item == null) setText(null);
                    else setText(item.getName() + " - Age: " + item.getAge());
                }
            });
        }
    }

    @FXML
    private void onBack() {
        if (mainController != null) mainController.showHome();
    }
}
