/**
 * Simple Authentication Guard for Client-Side Platform
 */

(function checkAuth() {
    // If we're on the login page, don't redirect away unless we are already logged in
    const isLoginPage = window.location.pathname.endsWith('login.html');
    const isIntroPage = window.location.pathname.endsWith('intro.html');
    const isLoggedIn = localStorage.getItem('builder_is_authenticated') === 'true';

    if (!isLoggedIn && !isLoginPage && !isIntroPage) {
        window.location.replace('intro.html');
    } else if (isLoggedIn && isLoginPage) {
        window.location.replace('index.html');
    }
})();

function logout() {
    localStorage.removeItem('builder_is_authenticated');
    window.location.replace('login.html');
}

window.BuilderAuth = { logout };
