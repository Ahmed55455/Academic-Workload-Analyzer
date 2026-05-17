// frontend/js/login.js
// Logic management for User Registration and Authentication UI Flow

let isLoginMode = true;

// Safeguard: Redirect immediately if a valid session token is already in memory
if (localStorage.getItem('token')) {
    window.location.href = 'index.html';
}

/**
 * Toggles the interface layouts seamlessly between login state and sign-up state
 */
function toggleMode() {
    isLoginMode = !isLoginMode;
    const subtitle = document.getElementById('auth-subtitle');
    const submitBtn = document.getElementById('submit-btn');
    const switchText = document.getElementById('switch-text');
    const switchLink = document.getElementById('switch-link');
    const alertBox = document.getElementById('auth-alert');
    
    const confirmWrapper = document.getElementById('confirm-password-wrapper');
    const confirmInput = document.getElementById('confirm-password');

    // Clear out residual notifications and field entries
    alertBox.classList.add('d-none');
    confirmInput.value = '';

    if (isLoginMode) {
        subtitle.textContent = "Log in to manage your academic workload";
        submitBtn.innerHTML = '<i class="bi bi-box-arrow-in-right me-1"></i> Log In';
        switchText.textContent = "Don't have an account?";
        switchLink.textContent = "Register here";
        
        // Hide and remove restrictions from confirm field
        confirmWrapper.classList.add('d-none');
        confirmInput.removeAttribute('required');
    } else {
        subtitle.textContent = "Create a new student account";
        submitBtn.innerHTML = '<i class="bi bi-person-plus me-1"></i> Register Account';
        switchText.textContent = "Already have an account?";
        switchLink.textContent = "Log in here";
        
        // Expose and enforce validation constraints on confirm field
        confirmWrapper.classList.remove('d-none');
        confirmInput.setAttribute('required', 'true');
    }
}

/**
 * Orchestrates payload packing and dispatches submission authentication to api.js handlers
 */
async function handleAuth(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const alertBox = document.getElementById('auth-alert');

    alertBox.classList.add('d-none');

    try {
        if (isLoginMode) {
            const data = await loginUser({ username, password });
            
            if (data && data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('username', data.user.username);
                window.location.href = 'index.html';
            } else {
                throw new Error(data?.error || "Invalid credentials execution error.");
            }
        } else {
            const confirmPassword = document.getElementById('confirm-password').value;

            // Enforce Double-Check constraint strategy prior to outbound API networking calls
            if (password !== confirmPassword) {
                throw new Error("Passwords do not match. Please verify your choices.");
            }

            const data = await registerUser({ username, password });
            
            if (data && !data.error) {
                alertBox.className = "alert alert-success";
                alertBox.textContent = "Registration successful! You can log in now.";
                alertBox.classList.remove('d-none');
                
                // Pivot UI back to login mode automatically
                isLoginMode = false;
                toggleMode();
            } else {
                throw new Error(data?.error || "Registration system structural failure.");
            }
        }
    } catch (error) {
        alertBox.className = "alert alert-danger";
        alertBox.textContent = error.message;
        alertBox.classList.remove('d-none');
    }
}