package Application;

import javafx.animation.KeyFrame;
import javafx.animation.Timeline;
import javafx.fxml.FXML;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.util.Duration;


public class StopwatchController {

    @FXML private Label timeLabel;
    @FXML private Button startButton;
    @FXML private Button pauseButton;
    @FXML private Button resetButton;

    private Timeline timeline;
    private long startNanos = 0;
    private long elapsedNanos = 0;
    private boolean running = false;

    @FXML
    public void initialize() {
        timeLabel.setText(formatTime(0));
        pauseButton.setDisable(true);


        timeline = new Timeline(new KeyFrame(Duration.millis(10), e -> updateDisplay()));
        timeline.setCycleCount(Timeline.INDEFINITE);
    }

    @FXML
    private void onStart() {
        if (!running) {
            startNanos = System.nanoTime() - elapsedNanos;
            timeline.play();
            running = true;
            startButton.setDisable(true);
            pauseButton.setDisable(false);
        }
    }

    @FXML
    private void onPause() {
        if (running) {
            timeline.pause();
            elapsedNanos = System.nanoTime() - startNanos;
            running = false;
            startButton.setDisable(false);
            pauseButton.setDisable(true);
        }
    }

    @FXML
    private void onReset() {
        timeline.stop();
        running = false;
        elapsedNanos = 0;
        startNanos = 0;
        timeLabel.setText(formatTime(0));
        startButton.setDisable(false);
        pauseButton.setDisable(true);
    }

    private void updateDisplay() {
        long nanos = running ? System.nanoTime() - startNanos : elapsedNanos;
        timeLabel.setText(formatTime(nanos));
    }


    private String formatTime(long nanos) {
        long totalCentis = nanos / 10_000_000;
        long centis = totalCentis % 100;
        long totalSeconds = totalCentis / 100;
        long seconds = totalSeconds % 60;
        long minutes = totalSeconds / 60;
        return String.format("%02d:%02d.%02d", minutes, seconds, centis);
    }
}