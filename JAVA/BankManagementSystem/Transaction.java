// Transaction - stores one transaction record
public class Transaction {
    private String transactionId;
    private String transactionType;
    private double amount;
    private String dateTime;

    // constructor
    public Transaction(String transactionId, String transactionType, double amount, String dateTime) {
        this.transactionId = transactionId;
        this.transactionType = transactionType;
        this.amount = amount;
        this.dateTime = dateTime;
    }

    // display transaction in simple format
    public void display() {
        System.out.printf("[%s] %s - $%.2f - %s%n", transactionId, transactionType, amount, dateTime);
    }

    // getters
    public String getTransactionId() { return transactionId; }
    public String getTransactionType() { return transactionType; }
    public double getAmount() { return amount; }
    public String getDateTime() { return dateTime; }
}