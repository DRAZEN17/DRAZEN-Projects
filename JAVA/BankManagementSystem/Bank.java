// Bank - core banking operations
import java.util.ArrayList;

public class Bank {
    // bank name
    private String bankName;
    // list of customers
    private ArrayList<Customer> customers;
    // counter for generating account numbers
    private int accountCounter;

    // constructor
    public Bank(String bankName) {
        this.bankName = bankName;
        this.customers = new ArrayList<>();
        this.accountCounter = 1;
    }

    // create a new customer account with simple validation
    public void createAccount(String fullName, String phone, String address,
                                String pin, double initialDeposit) {
        if (fullName == null || fullName.trim().isEmpty()) {
            System.out.println(" Full name cannot be empty.");
            return;
        }
        // normalize inputs
        String name = fullName.trim();
        String ph = (phone == null) ? "" : phone.trim();
        String addr = (address == null) ? "" : address.trim();
        String p = (pin == null) ? "" : pin.trim();

        if (ph.length() != 11) {
            System.out.println(" Phone number must be 11 digits.");
            return;
        }
        if (p.length() != 4) {
            System.out.println(" PIN must be exactly 4 digits.");
            return;
        }
        if (initialDeposit < 500) {
            System.out.println(" Minimum initial deposit is $500.");
            return;
        }

        // Auto-generate account number
        String accNumber = String.format("ACC%03d", accountCounter);
        accountCounter++;
        
        Customer newCustomer = new Customer(accNumber, name, ph, addr, p, initialDeposit);
        customers.add(newCustomer);

        System.out.println("  Account created successfully!");
        System.out.println("  Account Number: " + accNumber);
        System.out.println("  Please give the customer their account number to login.");
    }

    // find a customer by account number, or return null
    private Customer findCustomer(String accountNumber) {
        if (accountNumber == null) return null;
        String acct = accountNumber.trim();
        for (Customer c : customers) {
            if (c.getAccountNumber().equalsIgnoreCase(acct)) {
                return c;
            }
        }
        return null;
    }

    // login: check account number and pin
    public Customer login(String accountNumber, String pin) {
        Customer c = findCustomer(accountNumber);

        if (c == null) {
            System.out.println(" Account not found.");
            return null;
        }
        if (c.isFrozen()) {
            System.out.println(" This account is frozen. Contact Admin.");
            return null;
        }
        if (!c.checkPin(pin)) {
            System.out.println(" Wrong PIN. Please try again.");
            return null;
        }

        System.out.println("  Login successful! Welcome, " + c.getFullName());
        return c; // Return the logged-in customer
    }

    // ----------------------------------
    // FREEZE AN ACCOUNT (Admin only)
    // ----------------------------------
    public void freezeAccount(String accountNumber) {
        Customer c = findCustomer(accountNumber);
        if (c == null) {
            System.out.println("  Account not found.");
            return;
        }
        if (c.isFrozen()) {
            System.out.println("  Account is already frozen.");
            return;
        }
        c.freeze();
    }

    // ----------------------------------
    // UNFREEZE AN ACCOUNT (Admin only)
    // ----------------------------------
    public void unfreezeAccount(String accountNumber) {
        Customer c = findCustomer(accountNumber);
        if (c == null) {
            System.out.println("  Account not found.");
            return;
        }
        if (!c.isFrozen()) {
            System.out.println("  Account is not frozen.");
            return;
        }
        c.unfreeze();
    }

    // ----------------------------------------
    // CLOSE/DELETE AN ACCOUNT (Admin only)
    // ----------------------------------------
    public void closeAccount(String accountNumber) {
        Customer c = findCustomer(accountNumber);
        if (c == null) {
            System.out.println("  Account not found.");
            return;
        }
        customers.remove(c); // Remove from ArrayList
        System.out.println("  Account " + accountNumber + " has been closed.");
    }

    // ----------------------------------------
    // VIEW ALL CUSTOMERS (Admin only)
    // ----------------------------------------
    public void viewAllCustomers() {
        if (customers.isEmpty()) {
            System.out.println("  No customer accounts exist yet.");
            return;
        }
        System.out.println("\n  === All Customers (" + customers.size() + " total) ===\n");
        for (Customer c : customers) {
            c.displayAccount();
            System.out.println(); // blank line between customers
        }
    }

    // public getter for transfers
    public Customer getCustomer(String accountNumber) {
        return findCustomer(accountNumber);
    }

    // get bank name
    public String getBankName() { return bankName; }
}