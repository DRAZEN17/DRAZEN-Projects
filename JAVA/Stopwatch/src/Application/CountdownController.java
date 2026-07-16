package Application;

import javafx.animation.KeyFrame;
import javafx.animation.Timeline;
import javafx.fxml.FXML;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.TextField;
import javafx.util.Duration;
import java.awt.Toolkit;


public class CountdownController {

    @FXML private Label timeLabel;
    @FXML private TextField minutesField;
    @FXML private TextField secondsField;
    @FXML private Button startButton;
    @FXML private Button pauseButton;
    @FXML private Button resetButton;

    private Timeline timeline;
    private long endNanos = 0;
    private long remainingNanos = 0;
    private boolean running = false;

    @FXML
    public void initialize() {
        timeLabel.setText(formatTime(0));
        pauseButton.setDisable(true);

        timeline = new Timeline(new KeyFrame(Duration.millis(100), e -> updateDisplay()));
        timeline.setCycleCount(Timeline.INDEFINITE);
    }

    @FXML
    private void onStart() {
        if (!running) {
            if (remainingNanos == 0) {
                long mins = parseLongOrZero(minutesField.getText());
                long secs = parseLongOrZero(secondsField.getText());
                long totalSeconds = Math.max(0, mins * 60 + secs);
                remainingNanos = totalSeconds * 1_000_000_000L;
            }
            if (remainingNanos > 0) {
                endNanos = System.nanoTime() + remainingNanos;
                timeline.play();
                running = true;
                startButton.setDisable(true);
                pauseButton.setDisable(false);
                minutesField.setDisable(true);
                secondsField.setDisable(true);
            }
        }
    }

    @FXML
    private void onPause() {
        if (running) {
            timeline.pause();
            remainingNanos = Math.max(0, endNanos - System.nanoTime());
            running = false;
            startButton.setDisable(false);
            pauseButton.setDisable(true);
        }
    }

    @FXML
    private void onReset() {
        timeline.stop();
        running = false;
        remainingNanos = 0;
        endNanos = 0;
        timeLabel.setText(formatTime(0));
        startButton.setDisable(false);
        pauseButton.setDisable(true);
        minutesField.setDisable(false);
        secondsField.setDisable(false);
    }


    private void updateDisplay() {
        long nanos = running ? Math.max(0, endNanos - System.nanoTime()) : remainingNanos;
        if (nanos <= 0) {
            timeline.stop();
            running = false;
            remainingNanos = 0;
            startButton.setDisable(false);
            pauseButton.setDisable(true);
            minutesField.setDisable(false);
            secondsField.setDisable(false);
            playEndSound();
        }
        timeLabel.setText(formatTime(nanos));
    }

    private void playEndSound() {
        try {
            Toolkit.getDefaultToolkit().beep();
        } catch (Exception ex) {
        }
    }

    private long parseLongOrZero(String s) {
        try {
            return Long.parseLong(s.trim());
        } catch (Exception ex) {
            return 0;
        }
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