document.addEventListener('DOMContentLoaded', function() {
    // Tab switching
    const tabButtons = document.querySelectorAll('.tab-btn');
    const authForms = document.querySelectorAll('.auth-form');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            
            // Update active tab button
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding form
            authForms.forEach(form => form.classList.remove('active'));
            document.getElementById(`${tabName}-form`).classList.add('active');
        });
    });
    
    // Form submissions
    document.getElementById('login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        // Simple validation
        if (!email || !password) {
            alert('Por favor, preencha todos os campos.');
            return;
        }
        
        // In a real app, this would be an API call
        console.log('Login attempt:', email, password);
        
        // Simulate successful login
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userName', email.split('@')[0]);
        
        // Redirect to home page
        window.location.href = 'home.html';
    });
    
    document.getElementById('register-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm').value;
        
        // Simple validation
        if (!name || !email || !password || !confirmPassword) {
            alert('Por favor, preencha todos os campos.');
            return;
        }
        
        if (password !== confirmPassword) {
            alert('As senhas não coincidem.');
            return;
        }
        
        // In a real app, this would be an API call
        console.log('Registration attempt:', name, email, password);
        
        // Simulate successful registration
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userName', name);
        
        // Redirect to home page
        window.location.href = 'home.html';
    });
    
    document.getElementById('recover-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('recover-email').value;
        
        if (!email) {
            alert('Por favor, insira seu e-mail.');
            return;
        }
        
        // In a real app, this would send a recovery email
        console.log('Password recovery requested for:', email);
        alert(`Um link de recuperação foi enviado para ${email} (simulado).`);
    });
    
    // Google OAuth button
    document.querySelector('.btn-google').addEventListener('click', function() {
        // In a real app, this would initiate Google OAuth flow
        console.log('Google OAuth initiated');
        
        // Simulate successful login
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', 'googleuser@example.com');
        localStorage.setItem('userName', 'Google User');
        
        // Redirect to home page
        window.location.href = 'home.html';
    });
    
    // Check if user is already logged in
    if (localStorage.getItem('isLoggedIn') && window.location.pathname.endsWith('index.html')) {
        window.location.href = 'home.html';
    }
});