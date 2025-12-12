<?php
/**
 * Protecție CSRF - Primăria Pociumbăuți
 *
 * Generare și validare token-uri CSRF pentru toate formularele
 */

// Previne accesul direct
if (!defined('ADMIN_ACCESS')) {
    die('Acces interzis.');
}

/**
 * Generează un token CSRF securizat
 *
 * @return string Token CSRF
 */
function generate_csrf_token(): string
{
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }

    // Generează token nou dacă nu există sau a expirat
    if (empty($_SESSION['csrf_token']) || empty($_SESSION['csrf_token_time']) ||
        (time() - $_SESSION['csrf_token_time']) > 3600) { // Expiră după 1 oră

        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        $_SESSION['csrf_token_time'] = time();
    }

    return $_SESSION['csrf_token'];
}

/**
 * Validează un token CSRF
 *
 * @param string $token Token de validat
 * @return bool True dacă valid, false altfel
 */
function validate_csrf_token(?string $token): bool
{
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }

    // Token invalid sau inexistent
    if (empty($token) || empty($_SESSION['csrf_token'])) {
        return false;
    }

    // Comparare time-safe pentru prevenirea timing attacks
    if (!hash_equals($_SESSION['csrf_token'], $token)) {
        return false;
    }

    // Verifică expirare (1 oră)
    if (empty($_SESSION['csrf_token_time']) ||
        (time() - $_SESSION['csrf_token_time']) > 3600) {
        return false;
    }

    return true;
}

/**
 * Generează un input hidden cu token CSRF
 *
 * @return string HTML input hidden
 */
function csrf_input(): string
{
    $token = generate_csrf_token();
    return '<input type="hidden" name="csrf_token" value="' . htmlspecialchars($token, ENT_QUOTES, 'UTF-8') . '">';
}

/**
 * Verifică CSRF și oprește execuția dacă invalid
 *
 * @param string|null $token Token de verificat (din POST)
 * @return void
 */
function require_csrf(?string $token): void
{
    if (!validate_csrf_token($token)) {
        http_response_code(403);
        die('Token de securitate invalid. Reîncărcați pagina și încercați din nou.');
    }
}
