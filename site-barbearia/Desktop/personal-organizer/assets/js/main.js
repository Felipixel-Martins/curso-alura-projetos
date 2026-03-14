// Main application script
document.addEventListener('DOMContentLoaded', function() {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }
    
    // Initialize modules
    initNavigation();
    initThemeToggle();
    initLanguageSelector();
    
    // Load the appropriate module based on URL
    loadModule();
});

function initNavigation() {
    // Handle navigation menu clicks
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const module = this.getAttribute('data-module');
            window.location.href = `${module}.html`;
        });
    });
}

function initThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
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
}

function initLanguageSelector() {
    const langSelector = document.getElementById('language-selector');
    if (langSelector) {
        langSelector.addEventListener('change', function() {
            const lang = this.value;
            localStorage.setItem('language', lang);
            // In a real app, we would reload translations here
            alert(`Language changed to ${lang}. In a real app, the interface would update.`);
        });
    }
}

function loadModule() {
    // This would load different modules based on the current page
    const path = window.location.pathname;
    const page = path.split('/').pop();
    
    if (page === 'calendar.html') {
        // Initialize calendar module
        console.log('Initializing calendar module');
    } else if (page === 'recipes.html') {
        // Initialize recipes module
        console.log('Initializing recipes module');
    } else if (page === 'tasks.html') {
        // Initialize tasks module
        console.log('Initializing tasks module');
    } else if (page === 'shopping.html') {
        // Initialize shopping list module
        console.log('Initializing shopping list module');
    }
}

// Utility function to show notifications
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Export functions for other modules to use
window.app = {
    showNotification,
    // Other utility functions can be added here
};