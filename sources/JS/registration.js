document.addEventListener("DOMContentLoaded", () => {
    // Check if user is registered and logged in
    if (window.location.pathname !== "/index.html" && !isUserLoggedIn()) {
      alert("Please register and login to access this page.");
      window.location.href = "index.html";
    }
  
    // Registration
    const registerForm = document.getElementById("register-form");
    if (registerForm) {
      registerForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const username = document.getElementById("username").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
  
        if (username && email && password) {
          // Save user data in local storage
          localStorage.setItem("username", username);
          localStorage.setItem("email", email);
          localStorage.setItem("password", password);
          alert("Registration successful! Please login.");
          window.location.href = "login.html";
        } else {
          alert("Please fill in all fields.");
        }
      });
    }
  
    // Login
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
      loginForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const usernameLogin = document.getElementById("usernameLogin").value;
        const passwordLogin = document.getElementById("passwordLogin").value;
        const storedUsername = localStorage.getItem("username");
        const storedPassword = localStorage.getItem("password");
  
        if (usernameLogin === storedUsername && passwordLogin === storedPassword) {
          localStorage.setItem("isLoggedIn", "true");
          alert("Login successful!");
          window.location.href = "../index";
        } else {
          alert("Invalid username or password. Please register first.");
        }
      });
    }
  
    // Profile Page
    const profileInfo = document.getElementById("profile-info");
    if (profileInfo && isUserLoggedIn()) {
      const username = localStorage.getItem("username");
      const email = localStorage.getItem("email");
  
      if (username && email) {
        profileInfo.innerHTML = `
          <h3 style="color:#e8b86d; text-align:center; font-family: 'Playwrite CU', cursive;">Welcome, ${username}!</h3>
    
        `;
      }
    }
  });
  
  // Check if user is logged in
  function isUserLoggedIn() {
    return localStorage.getItem("isLoggedIn") === "true";
  }
  