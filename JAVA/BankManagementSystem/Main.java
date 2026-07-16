// Bank Management System
import java.util.Scanner;


public class Main {
    // Scanner for reading user input
    static Scanner scanner = new Scanner(System.in);

    // main method - program starts here
    public static void main(String[] args) {
        Bank bank = new Bank("Java Bank");
        Admin admin = new Admin("admin", "1234");
        
        showWelcome(bank.getBankName());
        
        boolean running = true;
        while (running) {
            showMainMenu();
            String choice = scanner.nextLine();
            
            if (choice.equals("1")) {
                handleAdminLogin(bank, admin);
            } else if (choice.equals("2")) {
                handleCustomerLogin(bank);
            } else if (choice.equals("0")) {
                System.out.println("\n  Goodbye! Thank's  for using " + bank.getBankName());
                running = false;
            } else {
                System.out.println("  Invalid choice. Type 1, 2, or 0.");
            }
        }
        scanner.close();
    }

    // show welcome screen
    static void showWelcome(String bankName) {
        System.out.println();
        System.out.println("  ===============================");
        System.out.println("        Welcome to " + bankName);
        System.out.println("  ====================================");
        System.out.println("       Your Trusted Banking Choice");
        System.out.println("  =====================================");
        System.out.println();
    }

    // main menu - choose admin or customer
    static void showMainMenu() {
        System.out.println("  ------------------------------------");
        System.out.println("              CHOOSE YOUR TO LOGIN");
        System.out.println("  ------------------------------------");
        System.out.println("  1. Admin Login");
        System.out.println("  2. Customer Login");
        System.out.println("  0. Exit");
        System.out.println("  ------------------------------------");
        System.out.print("  Enter choice: ");
    }

    // admin login and menu handling
    static void handleAdminLogin(Bank bank, Admin admin) {
        System.out.println("\n  - Admin Login -");

        System.out.print("  Username: ");
        String username = scanner.nextLine().trim();

        System.out.print("  Password: ");
        String password = scanner.nextLine().trim();

        // Check if the credentials match
        if (!admin.login(username, password)) {
            System.out.println(" Wrong username or password.");
            return; // Go back to main menu
        }

        System.out.println(" Admin login successful!");

        // If login OK, show Admin menu
        showAdminMenu(bank);
    }

    // ========================
    // ADMIN MENU
    // ========================
    static void showAdminMenu(Bank bank) {
        boolean adminRunning = true;

        while (adminRunning) {
            System.out.println("\n  ------------------------------");
            System.out.println("              ADMIN MENU");
            System.out.println("  --------------------------------");
            System.out.println("  1. Create Customer Account");
            System.out.println("  2. Freeze Account");
            System.out.println("  3. Unfreeze Account");
            System.out.println("  4. Close Account");
            System.out.println("  5. View All Customers");
            System.out.println("  0. Logout");
            System.out.println("  --------------------------------");
            System.out.print("  Enter choice: ");

            String choice = scanner.nextLine();

            if (choice.equals("1")) {
                handleCreateAccount(bank);

            } else if (choice.equals("2")) {
                System.out.print("  Enter account number to freeze: ");
                String acc = scanner.nextLine().trim().toUpperCase();
                bank.freezeAccount(acc);

            } else if (choice.equals("3")) {
                System.out.print("  Enter account number to unfreeze: ");
                String acc = scanner.nextLine().trim().toUpperCase();
                bank.unfreezeAccount(acc);

            } else if (choice.equals("4")) {
                handleCloseAccount(bank);

            } else if (choice.equals("5")) {
                bank.viewAllCustomers();

            } else if (choice.equals("0")) {
                System.out.println("  Admin logged out.");
                adminRunning = false; // Exit admin menu

            } else {
                System.out.println("  Invalid choice.");
            }
        }
    }

    // ====================================
    // HANDLE: Create Customer Account
    // ====================================
    static void handleCreateAccount(Bank bank) {
        System.out.println("\n  - Create New Customer Account -");

        System.out.print("  Full Name     : ");
        String name = scanner.nextLine().trim();

        System.out.print("  Phone Number  : ");
        String phone = scanner.nextLine().trim();

        System.out.print("  Address       : ");
        String address = scanner.nextLine().trim();

        System.out.print("  Set 4-digit PIN : ");
        String pin = scanner.nextLine().trim();

        // Try to convert the deposit input to a number
        // If user types letters instead of numbers, catch the error
        double deposit = 0;
        try {
            System.out.print("  Initial Deposit (min $500): $");
            deposit = Double.parseDouble(scanner.nextLine().trim());
        } catch (NumberFormatException e) {
            System.out.println("  Invalid amount. Please enter a number.");
            return;
        }

        bank.createAccount(name, phone, address, pin, deposit);
    }

    // ==============================================
    // HANDLE: Close Account (with confirmation)
    // ==============================================
    static void handleCloseAccount(Bank bank) {
        System.out.print("  Enter account number to close: ");
        String acc = scanner.nextLine().trim().toUpperCase();

        System.out.print("  Are you sure? YES to confirm: ");
        String confirm = scanner.nextLine();

        if (confirm.equals("YES")) {
            bank.closeAccount(acc);
        } else {
            System.out.println("  Cancelled. Account not closed.");
        }
    }

    // ================================================================
    // CUSTOMER LOGIN
    // ================================================================
    static void handleCustomerLogin(Bank bank) {
        System.out.println("\n  - Customer Login -");

        System.out.print("  Account Number: ");
        String accNumber = scanner.nextLine().trim().toUpperCase();

        System.out.print("  PIN           : ");
        String pin = scanner.nextLine().trim();

        // bank.login() returns the Customer object if success, null if failed
        Customer customer = bank.login(accNumber, pin);

        if (customer == null) {
            return; // Login failed — go back to main menu
        }

        // If login worked, show the customer menu
        showCustomerMenu(bank, customer);
    }

    // ==============================
    // CUSTOMER MENU
    // ==============================
    static void showCustomerMenu(Bank bank, Customer customer) {
        // "customer" is the logged-in Customer object passed from login

        boolean customerRunning = true;

        while (customerRunning) {
            System.out.println("\n  ----------------------------------------");
            System.out.println("    WELCOME, " + customer.getFullName().toUpperCase());
            System.out.println("  ------------------------------------------");
            System.out.println("  1. Deposit Money");
            System.out.println("  2. Withdraw Money");
            System.out.println("  3. Transfer Money");
            System.out.println("  4. Check Balance");
            System.out.println("  5. View Transaction History");
            System.out.println("  0. Logout");
            System.out.println("  ------------------------------------------");
            System.out.print("  Enter choice: ");

            String choice = scanner.nextLine();

            if (choice.equals("1")) {
                handleDeposit(customer);

            } else if (choice.equals("2")) {
                handleWithdraw(customer);

            } else if (choice.equals("3")) {
                handleTransfer(bank, customer);

            } else if (choice.equals("4")) {
                // Show balance directly
                System.out.printf("%n  Account : %s%n", customer.getAccountNumber());
                System.out.printf("  Name    : %s%n", customer.getFullName());
                System.out.printf("  Balance : $%.2f%n", customer.getBalance());

            } else if (choice.equals("5")) {
                customer.showTransactionHistory();

            } else if (choice.equals("0")) {
                System.out.println("  You have been logged out. Stay safe!");
                customerRunning = false;

            } else {
                System.out.println(" Invalid choice.");
            }
        }
    }

    // ============================
    // HANDLE: Deposit
    // ============================
    static void handleDeposit(Customer customer) {
        System.out.println("\n  - Deposit Money -");
        try {
            System.out.print("  Enter amount to deposit: $");
            double amount = Double.parseDouble(scanner.nextLine().trim());
            customer.deposit(amount);
        } catch (NumberFormatException e) {
            System.out.println("  Invalid amount. Enter a number.");
        }
    }

    // ============================
    // HANDLE: Withdraw
    // ============================
    static void handleWithdraw(Customer customer) {
        System.out.println("\n  - Withdraw Money -");
        try {
            System.out.print("  Enter amount to withdraw: $");
            double amount = Double.parseDouble(scanner.nextLine().trim());
            customer.withdraw(amount);
        } catch (NumberFormatException e) {
            System.out.println("  Invalid amount. Enter a number.");
        }
    }

    // ============================
    // HANDLE: Transfer
    // ============================
    static void handleTransfer(Bank bank, Customer customer) {
        System.out.println("\n  - Transfer Money -");

        System.out.print("  Enter receiver's account number: ");
        String receiverAcc = scanner.nextLine().trim().toUpperCase();

        // You cannot transfer to yourself
        if (receiverAcc.equals(customer.getAccountNumber())) {
            System.out.println("  You cannot transfer to your own account.");
            return;
        }

        // Look up the receiver in the bank
        Customer receiver = bank.getCustomer(receiverAcc);
        if (receiver == null) {
            System.out.println("  Receiver account not found.");
            return;
        }
        if (receiver.isFrozen()) {
            System.out.println("  Receiver's account is frozen. Cannot transfer.");
            return;
        }

        try {
            System.out.print("  Enter amount to transfer: $");
            double amount = Double.parseDouble(scanner.nextLine().trim());
            customer.transfer(amount, receiver);
        } catch (NumberFormatException e) {
            System.out.println("  Invalid amount. Enter a number.");
        }
    }
}