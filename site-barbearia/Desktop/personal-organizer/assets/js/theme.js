document.addEventListener('DOMContentLoaded', function() {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    const themeToggle = document.querySelector('.theme-toggle');
    
    // Apply saved theme
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            if (icon) icon.className = 'fas fa-sun';
        }
    }
    
    // Initialize theme toggle
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            const isDarkMode = document.body.classList.contains('dark-mode');
            localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
            
            // Update icon
            const icon = this.querySelector('i');
            if (icon) {
                icon.className = isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
            }
        });
    }
});