document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            // 1. Prevent default form submission (prevents page reload)
            event.preventDefault();

            // 2. Get data from the input fields
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                // 3. Make the AJAX request to your Back-end API
                const response = await fetch('http://127.0.0.1:5000/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                // 4. Handle the API Response
                if (response.ok) {
                    const data = await response.json();
                    
                    // Store the JWT token in a cookie
                    // "path=/" ensures the token is available on all pages
                    document.cookie = `token=${data.access_token}; path=/; SameSite=Lax`;

                    // Redirect to the main page (index.html)
                    window.location.href = 'index.html';
                } else {
                    // Show error if login fails (e.g., 401 Unauthorized)
                    const errorData = await response.json();
                    errorMessage.textContent = errorData.msg || 'Login failed. Please check your credentials.';
                }
            } catch (error) {
                // Handle network errors (if API is down)
                console.error('Connection Error:', error);
                errorMessage.textContent = 'Could not connect to the server.';
            }
        });
    }
});
