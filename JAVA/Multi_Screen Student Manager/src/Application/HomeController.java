package Application;

import javafx.fxml.FXML;

public class HomeController {

    private MainController mainController;

    public void setMainController(MainController mainController) {
        this.mainController = mainController;
    }

    @FXML
    private void onAddStudent() {
        if (mainController != null) mainController.showAddStudent();
    }

    @FXML
    private void onViewStudents() {
        if (mainController != null) mainController.showViewStudents();
    }
}
