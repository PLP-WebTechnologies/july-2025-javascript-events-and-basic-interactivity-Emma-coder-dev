// Interactive Web Page JavaScript
// This file contains all the interactive functionality including:
// - Theme toggle (light/dark mode)
// - Interactive counter game
// - Collapsible FAQ section
// - Tabbed interface
// - Comprehensive form validation

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Utility function to get DOM elements safely
 * @param {string} selector - CSS selector
 * @returns {Element|null} - DOM element or null
 */
function getElement(selector) {
    return document.querySelector(selector);
}

/**
 * Utility function to get all DOM elements matching selector
 * @param {string} selector - CSS selector
 * @returns {NodeList} - NodeList of elements
 */
function getElements(selector) {
    return document.querySelectorAll(selector);
}

/**
 * Utility function to add event listener with error handling
 * @param {Element} element - DOM element
 * @param {string} event - Event type
 * @param {Function} handler - Event handler function
 */
function addEvent(element, event, handler) {
    if (element) {
        element.addEventListener(event, handler);
    }
}

// ============================================================================
// THEME TOGGLE FUNCTIONALITY
// ============================================================================

/**
 * Theme toggle functionality for light/dark mode
 * Stores theme preference in localStorage and applies it to the document
 */
class ThemeToggle {
    constructor() {
        this.themeToggle = getElement('#themeToggle');
        this.themeIcon = getElement('.theme-icon');
        this.currentTheme = localStorage.getItem('theme') || 'light';
        
        this.init();
    }
    
    init() {
        // Apply saved theme on page load
        this.applyTheme(this.currentTheme);
        
        // Add click event listener
        addEvent(this.themeToggle, 'click', () => this.toggleTheme());
    }
    
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
    }
    
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        
        // Update theme icon
        if (this.themeIcon) {
            this.themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
        }
        
        // Update button aria-label for accessibility
        if (this.themeToggle) {
            this.themeToggle.setAttribute('aria-label', 
                `Switch to ${theme === 'light' ? 'dark' : 'light'} mode`);
        }
    }
}

// ============================================================================
// INTERACTIVE COUNTER GAME
// ============================================================================

/**
 * Interactive counter game with increment, decrement, and reset functionality
 * Includes special messages for certain counter values
 */
class CounterGame {
    constructor() {
        this.counterValue = getElement('#counterValue');
        this.counterMessage = getElement('#counterMessage');
        this.incrementBtn = getElement('#incrementBtn');
        this.decrementBtn = getElement('#decrementBtn');
        this.resetBtn = getElement('#resetBtn');
        
        this.count = 0;
        this.init();
    }
    
    init() {
        // Add event listeners for all counter buttons
        addEvent(this.incrementBtn, 'click', () => this.increment());
        addEvent(this.decrementBtn, 'click', () => this.decrement());
        addEvent(this.resetBtn, 'click', () => this.reset());
        
        // Add keyboard support
        addEvent(document, 'keydown', (e) => this.handleKeyboard(e));
        
        this.updateDisplay();
    }
    
    increment() {
        this.count++;
        this.updateDisplay();
        this.showMessage();
        this.animateCounter();
    }
    
    decrement() {
        this.count--;
        this.updateDisplay();
        this.showMessage();
        this.animateCounter();
    }
    
    reset() {
        this.count = 0;
        this.updateDisplay();
        this.counterMessage.textContent = 'Counter reset!';
        this.animateCounter();
        
        // Clear message after 2 seconds
        setTimeout(() => {
            this.counterMessage.textContent = '';
        }, 2000);
    }
    
    updateDisplay() {
        if (this.counterValue) {
            this.counterValue.textContent = this.count;
        }
    }
    
    showMessage() {
        let message = '';
        
        if (this.count === 10) {
            message = '🎉 You reached 10! Great job!';
        } else if (this.count === 25) {
            message = '🏆 Amazing! You hit 25!';
        } else if (this.count === 50) {
            message = '🌟 Fantastic! Half century!';
        } else if (this.count === 100) {
            message = '🎊 Centurion! You made it to 100!';
        } else if (this.count < 0) {
            message = '⚠️ Going negative!';
        } else if (this.count === 0) {
            message = '📍 Back to zero!';
        }
        
        this.counterMessage.textContent = message;
        
        // Clear message after 3 seconds (except for special messages)
        if (message && !message.includes('negative')) {
            setTimeout(() => {
                this.counterMessage.textContent = '';
            }, 3000);
        }
    }
    
    animateCounter() {
        if (this.counterValue) {
            this.counterValue.style.transform = 'scale(1.2)';
            setTimeout(() => {
                this.counterValue.style.transform = 'scale(1)';
            }, 200);
        }
    }
    
    handleKeyboard(e) {
        switch(e.key) {
            case '+':
            case '=':
                e.preventDefault();
                this.increment();
                break;
            case '-':
                e.preventDefault();
                this.decrement();
                break;
            case '0':
                if (e.ctrlKey) {
                    e.preventDefault();
                    this.reset();
                }
                break;
        }
    }
}

// ============================================================================
// COLLAPSIBLE FAQ SECTION
// ============================================================================

/**
 * Collapsible FAQ section with smooth animations
 * Allows only one FAQ to be open at a time (accordion style)
 */
class FAQSection {
    constructor() {
        this.faqQuestions = getElements('.faq-question');
        this.init();
    }
    
    init() {
        // Add click event listeners to all FAQ questions
        this.faqQuestions.forEach(question => {
            addEvent(question, 'click', () => this.toggleFAQ(question));
        });
    }
    
    toggleFAQ(clickedQuestion) {
        const targetId = clickedQuestion.getAttribute('data-target');
        const targetAnswer = getElement(`#${targetId}`);
        
        // Close all other FAQs
        this.faqQuestions.forEach(question => {
            if (question !== clickedQuestion) {
                question.classList.remove('active');
                const otherTargetId = question.getAttribute('data-target');
                const otherAnswer = getElement(`#${otherTargetId}`);
                if (otherAnswer) {
                    otherAnswer.classList.remove('active');
                }
            }
        });
        
        // Toggle the clicked FAQ
        clickedQuestion.classList.toggle('active');
        if (targetAnswer) {
            targetAnswer.classList.toggle('active');
        }
    }
}

// ============================================================================
// TABBED INTERFACE
// ============================================================================

/**
 * Tabbed interface functionality
 * Allows switching between different content panels
 */
class TabbedInterface {
    constructor() {
        this.tabButtons = getElements('.tab-btn');
        this.tabPanels = getElements('.tab-panel');
        this.init();
    }
    
    init() {
        // Add click event listeners to all tab buttons
        this.tabButtons.forEach(button => {
            addEvent(button, 'click', () => this.switchTab(button));
        });
    }
    
    switchTab(clickedButton) {
        const targetTab = clickedButton.getAttribute('data-tab');
        
        // Remove active class from all buttons and panels
        this.tabButtons.forEach(btn => btn.classList.remove('active'));
        this.tabPanels.forEach(panel => panel.classList.remove('active'));
        
        // Add active class to clicked button and corresponding panel
        clickedButton.classList.add('active');
        const targetPanel = getElement(`#${targetTab}`);
        if (targetPanel) {
            targetPanel.classList.add('active');
        }
    }
}

// ============================================================================
// FORM VALIDATION
// ============================================================================

/**
 * Comprehensive form validation with custom logic
 * Validates all form fields and provides real-time feedback
 */
class FormValidator {
    constructor() {
        this.form = getElement('#registrationForm');
        this.formSuccess = getElement('#formSuccess');
        this.fields = {
            fullName: getElement('#fullName'),
            email: getElement('#email'),
            password: getElement('#password'),
            confirmPassword: getElement('#confirmPassword'),
            age: getElement('#age'),
            phone: getElement('#phone'),
            terms: getElement('#terms')
        };
        
        this.errorElements = {
            fullName: getElement('#fullNameError'),
            email: getElement('#emailError'),
            password: getElement('#passwordError'),
            confirmPassword: getElement('#confirmPasswordError'),
            age: getElement('#ageError'),
            phone: getElement('#phoneError'),
            terms: getElement('#termsError')
        };
        
        this.init();
    }
    
    init() {
        // Add form submit event listener
        addEvent(this.form, 'submit', (e) => this.handleSubmit(e));
        
        // Add real-time validation for each field
        this.addRealTimeValidation();
    }
    
    addRealTimeValidation() {
        // Full name validation
        addEvent(this.fields.fullName, 'blur', () => this.validateFullName());
        addEvent(this.fields.fullName, 'input', () => this.clearError('fullName'));
        
        // Email validation
        addEvent(this.fields.email, 'blur', () => this.validateEmail());
        addEvent(this.fields.email, 'input', () => this.clearError('email'));
        
        // Password validation
        addEvent(this.fields.password, 'blur', () => this.validatePassword());
        addEvent(this.fields.password, 'input', () => this.clearError('password'));
        
        // Confirm password validation
        addEvent(this.fields.confirmPassword, 'blur', () => this.validateConfirmPassword());
        addEvent(this.fields.confirmPassword, 'input', () => this.clearError('confirmPassword'));
        
        // Age validation
        addEvent(this.fields.age, 'blur', () => this.validateAge());
        addEvent(this.fields.age, 'input', () => this.clearError('age'));
        
        // Phone validation
        addEvent(this.fields.phone, 'blur', () => this.validatePhone());
        addEvent(this.fields.phone, 'input', () => this.clearError('phone'));
        
        // Terms validation
        addEvent(this.fields.terms, 'change', () => this.validateTerms());
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        // Validate all fields
        const isValid = this.validateAllFields();
        
        if (isValid) {
            this.showSuccess();
        } else {
            this.showFormErrors();
        }
    }
    
    validateAllFields() {
        const validations = [
            this.validateFullName(),
            this.validateEmail(),
            this.validatePassword(),
            this.validateConfirmPassword(),
            this.validateAge(),
            this.validatePhone(),
            this.validateTerms()
        ];
        
        return validations.every(validation => validation === true);
    }
    
    validateFullName() {
        const value = this.fields.fullName.value.trim();
        const errorElement = this.errorElements.fullName;
        
        if (!value) {
            this.showError('fullName', 'Full name is required');
            return false;
        }
        
        if (value.length < 2) {
            this.showError('fullName', 'Full name must be at least 2 characters');
            return false;
        }
        
        if (!/^[a-zA-Z\s]+$/.test(value)) {
            this.showError('fullName', 'Full name can only contain letters and spaces');
            return false;
        }
        
        this.showSuccess('fullName');
        return true;
    }
    
    validateEmail() {
        const value = this.fields.email.value.trim();
        const errorElement = this.errorElements.email;
        
        if (!value) {
            this.showError('email', 'Email address is required');
            return false;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            this.showError('email', 'Please enter a valid email address');
            return false;
        }
        
        this.showSuccess('email');
        return true;
    }
    
    validatePassword() {
        const value = this.fields.password.value;
        const errorElement = this.errorElements.password;
        
        if (!value) {
            this.showError('password', 'Password is required');
            return false;
        }
        
        if (value.length < 8) {
            this.showError('password', 'Password must be at least 8 characters long');
            return false;
        }
        
        const hasUpperCase = /[A-Z]/.test(value);
        const hasLowerCase = /[a-z]/.test(value);
        const hasNumbers = /\d/.test(value);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
        
        if (!hasUpperCase) {
            this.showError('password', 'Password must contain at least one uppercase letter');
            return false;
        }
        
        if (!hasLowerCase) {
            this.showError('password', 'Password must contain at least one lowercase letter');
            return false;
        }
        
        if (!hasNumbers) {
            this.showError('password', 'Password must contain at least one number');
            return false;
        }
        
        if (!hasSpecialChar) {
            this.showError('password', 'Password must contain at least one special character');
            return false;
        }
        
        this.showSuccess('password');
        return true;
    }
    
    validateConfirmPassword() {
        const value = this.fields.confirmPassword.value;
        const passwordValue = this.fields.password.value;
        
        if (!value) {
            this.showError('confirmPassword', 'Please confirm your password');
            return false;
        }
        
        if (value !== passwordValue) {
            this.showError('confirmPassword', 'Passwords do not match');
            return false;
        }
        
        this.showSuccess('confirmPassword');
        return true;
    }
    
    validateAge() {
        const value = parseInt(this.fields.age.value);
        const errorElement = this.errorElements.age;
        
        if (!this.fields.age.value) {
            this.showError('age', 'Age is required');
            return false;
        }
        
        if (isNaN(value)) {
            this.showError('age', 'Please enter a valid age');
            return false;
        }
        
        if (value < 13) {
            this.showError('age', 'You must be at least 13 years old');
            return false;
        }
        
        if (value > 120) {
            this.showError('age', 'Please enter a valid age');
            return false;
        }
        
        this.showSuccess('age');
        return true;
    }
    
    validatePhone() {
        const value = this.fields.phone.value.trim();
        
        // Phone is optional, so if empty, it's valid
        if (!value) {
            this.clearError('phone');
            return true;
        }
        
        // Remove all non-digit characters for validation
        const digitsOnly = value.replace(/\D/g, '');
        
        if (digitsOnly.length < 10) {
            this.showError('phone', 'Phone number must have at least 10 digits');
            return false;
        }
        
        if (digitsOnly.length > 15) {
            this.showError('phone', 'Phone number is too long');
            return false;
        }
        
        this.showSuccess('phone');
        return true;
    }
    
    validateTerms() {
        const isChecked = this.fields.terms.checked;
        
        if (!isChecked) {
            this.showError('terms', 'You must agree to the Terms and Conditions');
            return false;
        }
        
        this.clearError('terms');
        return true;
    }
    
    showError(fieldName, message) {
        const field = this.fields[fieldName];
        const errorElement = this.errorElements[fieldName];
        
        if (field) {
            field.classList.add('error');
            field.classList.remove('success');
        }
        
        if (errorElement) {
            errorElement.textContent = message;
        }
    }
    
    showSuccess(fieldName) {
        const field = this.fields[fieldName];
        const errorElement = this.errorElements[fieldName];
        
        if (field) {
            field.classList.add('success');
            field.classList.remove('error');
        }
        
        if (errorElement) {
            errorElement.textContent = '';
        }
    }
    
    clearError(fieldName) {
        const field = this.fields[fieldName];
        const errorElement = this.errorElements[fieldName];
        
        if (field) {
            field.classList.remove('error', 'success');
        }
        
        if (errorElement) {
            errorElement.textContent = '';
        }
    }
    
    showFormErrors() {
        // Scroll to first error field
        const firstErrorField = document.querySelector('.error');
        if (firstErrorField) {
            firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstErrorField.focus();
        }
    }
    
    showSuccess() {
        // Hide form and show success message
        this.form.style.display = 'none';
        this.formSuccess.style.display = 'block';
        
        // Scroll to success message
        this.formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Reset form after 5 seconds
        setTimeout(() => {
            this.resetForm();
        }, 5000);
    }
    
    resetForm() {
        // Reset form fields
        this.form.reset();
        
        // Clear all error states
        Object.keys(this.fields).forEach(fieldName => {
            this.clearError(fieldName);
        });
        
        // Show form and hide success message
        this.form.style.display = 'block';
        this.formSuccess.style.display = 'none';
    }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialize all interactive features when the DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all interactive components
    new ThemeToggle();
    new CounterGame();
    new FAQSection();
    new TabbedInterface();
    new FormValidator();
    
    // Add smooth scrolling for better UX
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
    
    console.log('🚀 Interactive Web Page loaded successfully!');
    console.log('Features available:');
    console.log('- 🌙 Dark/Light theme toggle');
    console.log('- 🎮 Interactive counter game');
    console.log('- ❓ Collapsible FAQ section');
    console.log('- 📑 Tabbed interface');
    console.log('- 📋 Form validation');
    console.log('- ⌨️ Keyboard shortcuts (+, -, Ctrl+0 for counter)');
});
