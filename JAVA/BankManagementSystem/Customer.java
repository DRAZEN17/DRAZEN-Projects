// Customer - simple customer account class for beginners
import java.util.ArrayList;

public class Customer {
    private String accountNumber;
    private String fullName;
    private String phoneNumber;
    private String address;
    private String pin;
    private double balance;
    private String accountStatus;
    private ArrayList<Transaction> transactionHistory;
    private int transactionCount;

    // constructor
    public Customer(String accountNumber, String fullName, String phoneNumber,
                    String address, String pin, double initialDeposit) {
        this.accountNumber = accountNumber;
        this.fullName = fullName;
        this.phoneNumber = phoneNumber;
        this.address = address;
        this.pin = pin;
        this.balance = initialDeposit;
        this.accountStatus = "Active";
        this.transactionHistory = new ArrayList<>();
        this.transactionCount = 1;
        addTransaction("Deposit", initialDeposit);
    }

    // record a transaction in history
    private void addTransaction(String type, double amount) {
        String txnId = String.format("TXN%03d", transactionCount);
        transactionCount++;
        String now = new java.util.Date().toString();
        Transaction txn = new Transaction(txnId, type, amount, now);
        transactionHistory.add(txn);
    }

    // deposit money
    public void deposit(double amount) {
        if (amount <= 0) {
            System.out.println(" Deposit amount must be greater than zero.");
            return;
        }
        balance += amount;
        addTransaction("Deposit", amount);
        System.out.printf(" $%.2f deposited. New balance: $%.2f%n", amount, balance);
    }

    // withdraw money
    public void withdraw(double amount) {
        if (amount <= 0) {
            System.out.println(" Withdrawal amount must be greater than zero.");
            return;
        }
        if (amount > balance) {
            System.out.printf(" Not enough funds. Your balance is $%.2f%n", balance);
            return;
        }
        balance -= amount;
        addTransaction("Withdrawal", amount);
        System.out.printf(" $%.2f withdrawn. New balance: $%.2f%n", amount, balance);
    }

    // transfer money to another customer
    public void transfer(double amount, Customer receiver) {
        if (amount <= 0) {
            System.out.println(" Transfer amount must be greater than zero.");
            return;
        }
        if (amount > balance) {
            System.out.printf(" Not enough funds. Your balance is $%.2f%n", balance);
            return;
        }
        balance -= amount;
        addTransaction("Transfer Out to " + receiver.getAccountNumber(), amount);
        receiver.receiveTransfer(amount, this.accountNumber);
        System.out.printf("[OK] $%.2f transferred to %s (%s)%n",
            amount, receiver.getFullName(), receiver.getAccountNumber());
        System.out.printf("Your new balance: $%.2f%n", balance);
    }

    // receive a transfer
    public void receiveTransfer(double amount, String senderAccNumber) {
        balance += amount;
        addTransaction("Transfer In from " + senderAccNumber, amount);
    }

    // display a simple account summary
    public void displayAccount() {
        System.out.println("Account No : " + accountNumber);
        System.out.println("Name       : " + fullName);
        System.out.println("Phone      : " + phoneNumber);
        System.out.println("Address    : " + address);
        System.out.printf("Balance    : $%.2f%n", balance);
        System.out.println("Status     : " + accountStatus);
    }

    // show transaction history
    public void showTransactionHistory() {
        if (transactionHistory.isEmpty()) {
            System.out.println("No transactions yet.");
            return;
        }
        System.out.println("Transaction history for " + fullName + ":");
        for (Transaction txn : transactionHistory) {
            txn.display();
        }
    }

    // -----------------------------------------
    // PIN CHECK - used during customer login
    // -----------------------------------------
    public boolean checkPin(String inputPin) {
        if (inputPin == null) return false;
        return this.pin.equals(inputPin.trim());  // true if PIN matches, false if not
    }

    // -----------------------------------------
    // FREEZE / UNFREEZE by Admin
    // -----------------------------------------
    public void freeze() {
        accountStatus = "Frozen";
        System.out.println("  Account " + accountNumber + " has been frozen.");
    }

    public void unfreeze() {
        accountStatus = "Active";
        System.out.println("  Account " + accountNumber + " has been unfrozen.");
    }

    public boolean isFrozen() {
        return "Frozen".equalsIgnoreCase(accountStatus);  // returns true or false
    }

    // ------------------------------------------------
    // GETTERS - let other classes READ private data
    // ------------------------------------------------
    public String getAccountNumber() { return accountNumber; }
    public String getFullName()      { return fullName;      }
    public String getPhoneNumber()   { return phoneNumber;   }
    public String getAddress()       { return address;       }
    public double getBalance()       { return balance;       }
    public String getAccountStatus() { return accountStatus; }
}