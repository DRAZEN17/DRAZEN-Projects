
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
            
        //     const email = document.getElementById('login-email').value;
        //     const password = document.getElementById('login-password').value;
            
        //     if (!email || !password) {
        //         alert('Please fill in all fields');
        //         return;
        //     }
            
        //     // Simulate successful login
        //     alert('Login successful! Redirecting to homepage...');
        //     // In a real application, you would redirect to the homepage
        //     // window.location.href = 'blog.html';
        // });