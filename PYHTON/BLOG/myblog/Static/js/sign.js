        // Toggle password visibility
        function togglePassword(inputId) {
            const passwordInput = document.getElementById(inputId);
            const toggleButton = passwordInput.nextElementSibling;
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                toggleButton.textContent = '🔒';
            } else {
                passwordInput.type = 'password';
                toggleButton.textContent = '👁️';
            }
        }
        
        // Form validation and submission
        // document.querySelector('form').addEventListener('submit', function(e) {
        //     e.preventDefault();
            
        //     const name = document.getElementById('signup-name').value;
        //     const email = document.getElementById('signup-email').value;
        //     const password = document.getElementById('signup-password').value;
        //     const confirmPassword = document.getElementById('signup-confirm').value;
        //     const terms = document.getElementById('terms').checked;
            
        //     if (!name || !email || !password || !confirmPassword) {
        //         alert('Please fill in all fields');
        //         return;
        //     }
            
        //     if (password !== confirmPassword) {
        //         alert('Passwords do not match');
        //         return;
        //     }
            
        //     if (!terms) {
        //         alert('You must agree to the Terms of Service and Privacy Policy');
        //         return;
        //     }
            
        //     // Simulate successful signup
            // alert('Account created successfully! You can now login.');
        //     // In a real application, you would redirect to the login page
        //     window.location.href = 'login.html';
        // });