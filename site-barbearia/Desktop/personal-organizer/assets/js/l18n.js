document.addEventListener('DOMContentLoaded', function() {
    // Translations data
    const translations = {
        en: {
            welcome: "Welcome to Personal Organizer",
            login: "Login",
            register: "Register",
            recover: "Recover Password",
            // Add more translations as needed
        },
        pt: {
            welcome: "Bem-vindo ao Organizador Pessoal",
            login: "Entrar",
            register: "Cadastrar",
            recover: "Recuperar Senha",
            // Add more translations as needed
        },
        es: {
            welcome: "Bienvenido al Organizador Personal",
            login: "Iniciar sesión",
            register: "Registrarse",
            recover: "Recuperar contraseña",
            // Add more translations as needed
        }
    };
    
    // Set initial language
    let currentLanguage = localStorage.getItem('language') || 'pt';
    
    // Update language selector if exists
    const languageSelector = document.getElementById('language-selector');
    if (languageSelector) {
        languageSelector.value = currentLanguage;
        languageSelector.addEventListener('change', function() {
            currentLanguage = this.value;
            localStorage.setItem('language', currentLanguage);
            translatePage();
        });
    }
    
    // Translate the page
    function translatePage() {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[currentLanguage] && translations[currentLanguage][key]) {
                element.textContent = translations[currentLanguage][key];
            }
        });
    }
    
    // Initial translation
    translatePage();
    
    // Expose functions to other modules
    window.i18n = {
        translate: function(key) {
            return translations[currentLanguage] && translations[currentLanguage][key] 
                ? translations[currentLanguage][key] 
                : key;
        },
        getCurrentLanguage: function() {
            return currentLanguage;
        }
    };
});