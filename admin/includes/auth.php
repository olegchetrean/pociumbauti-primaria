<?php
/**
 * Sistem de Autentificare - Primăria Pociumbăuți
 *
 * Verificări de securitate și gestionare sesiuni
 */

// Previne accesul direct
if (!defined('ADMIN_ACCESS')) {
    die('Acces interzis.');
}

/**
 * Verifică dacă utilizatorul este autentificat
 * Redirectează la login dacă nu este
 *
 * @return void
 */
function check_authenticated(): void
{
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }

    // Verifică dacă utilizatorul este autentificat
    if (!isset($_SESSION['user_id']) || !isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
        // Salvează URL-ul curent pentru redirect după login
        $_SESSION['redirect_after_login'] = $_SERVER['REQUEST_URI'];
        header('Location: login.php');
        exit;
    }

    // Verifică timeout sesiune (30 minute inactivitate)
    if (isset($_SESSION['last_activity'])) {
        $inactive_time = time() - $_SESSION['last_activity'];

        if ($inactive_time > SESSION_TIMEOUT) {
            // Sesiune expirată
            session_unset();
            session_destroy();
            session_start();
            $_SESSION['timeout_message'] = 'Sesiunea a expirat din cauza inactivității. Autentificați-vă din nou.';
            header('Location: login.php?timeout=1');
            exit;
        }
    }

    // Actualizează timpul ultimei activități
    $_SESSION['last_activity'] = time();

    // Verifică dacă IP-ul s-a schimbat (posibil session hijacking)
    if (isset($_SESSION['ip_address']) && $_SESSION['ip_address'] !== $_SERVER['REMOTE_ADDR']) {
        // IP diferit - posibil atac
        session_unset();
        session_destroy();
        header('Location: login.php?security=1');
        exit;
    }

    // Regenerare periodică a ID-ului sesiunii (la fiecare 15 minute)
    if (!isset($_SESSION['regenerate_time'])) {
        $_SESSION['regenerate_time'] = time();
    } elseif (time() - $_SESSION['regenerate_time'] > 900) {
        session_regenerate_id(true);
        $_SESSION['regenerate_time'] = time();
    }
}

/**
 * Verifică dacă utilizatorul este admin
 * Redirectează dacă nu are permisiuni
 *
 * @return void
 */
function require_admin(): void
{
    check_authenticated();

    if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
        header('Location: dashboard.php?error=access_denied');
        exit;
    }
}

/**
 * Obține informațiile utilizatorului curent
 *
 * @param PDO $pdo Conexiune bază de date
 * @return array|null Datele utilizatorului sau null
 */
function get_current_user(PDO $pdo): ?array
{
    if (!isset($_SESSION['user_id'])) {
        return null;
    }

    try {
        $stmt = $pdo->prepare("
            SELECT id, username, full_name, role, email, last_login
            FROM users
            WHERE id = ?
            LIMIT 1
        ");
        $stmt->execute([$_SESSION['user_id']]);

        return $stmt->fetch() ?: null;
    } catch (PDOException $e) {
        error_log('Eroare get_current_user: ' . $e->getMessage());
        return null;
    }
}

/**
 * Hash parola cu bcrypt
 *
 * @param string $password Parola în clar
 * @return string Parola hash-uită
 */
function hash_password(string $password): string
{
    return password_hash($password, PASSWORD_BCRYPT, ['cost' => BCRYPT_COST]);
}

/**
 * Verifică parola contra hash-ului
 *
 * @param string $password Parola în clar
 * @param string $hash Hash-ul din baza de date
 * @return bool True dacă parola e corectă
 */
function verify_password(string $password, string $hash): bool
{
    return password_verify($password, $hash);
}

/**
 * Verifică dacă contul este blocat din cauza încercărilor eșuate
 *
 * @param PDO $pdo Conexiune bază de date
 * @param string $username Numele de utilizator
 * @return bool True dacă contul e blocat
 */
function is_account_locked(PDO $pdo, string $username): bool
{
    try {
        $stmt = $pdo->prepare("
            SELECT lockout_until
            FROM users
            WHERE username = ? AND lockout_until IS NOT NULL
            LIMIT 1
        ");
        $stmt->execute([$username]);
        $result = $stmt->fetch();

        if ($result && $result['lockout_until']) {
            $lockout_time = strtotime($result['lockout_until']);
            if ($lockout_time > time()) {
                return true;
            }
        }

        return false;
    } catch (PDOException $e) {
        error_log('Eroare is_account_locked: ' . $e->getMessage());
        return false;
    }
}

/**
 * Incrementează contorul de încercări eșuate
 *
 * @param PDO $pdo Conexiune bază de date
 * @param int $user_id ID utilizator
 * @return int Numărul de încercări
 */
function increment_failed_attempts(PDO $pdo, int $user_id): int
{
    try {
        $stmt = $pdo->prepare("
            UPDATE users
            SET failed_login_attempts = failed_login_attempts + 1
            WHERE id = ?
        ");
        $stmt->execute([$user_id]);

        // Obține numărul curent de încercări
        $stmt = $pdo->prepare("SELECT failed_login_attempts FROM users WHERE id = ?");
        $stmt->execute([$user_id]);
        $attempts = (int)$stmt->fetchColumn();

        // Blochează contul dacă s-au depășit încercările
        if ($attempts >= MAX_LOGIN_ATTEMPTS) {
            $lockout_until = date('Y-m-d H:i:s', time() + LOCKOUT_DURATION);
            $stmt = $pdo->prepare("UPDATE users SET lockout_until = ? WHERE id = ?");
            $stmt->execute([$lockout_until, $user_id]);
        }

        return $attempts;
    } catch (PDOException $e) {
        error_log('Eroare increment_failed_attempts: ' . $e->getMessage());
        return 0;
    }
}

/**
 * Resetează contorul de încercări eșuate
 *
 * @param PDO $pdo Conexiune bază de date
 * @param int $user_id ID utilizator
 * @return void
 */
function reset_failed_attempts(PDO $pdo, int $user_id): void
{
    try {
        $stmt = $pdo->prepare("
            UPDATE users
            SET failed_login_attempts = 0, lockout_until = NULL, last_login = NOW()
            WHERE id = ?
        ");
        $stmt->execute([$user_id]);
    } catch (PDOException $e) {
        error_log('Eroare reset_failed_attempts: ' . $e->getMessage());
    }
}

/**
 * Creează sesiunea de login
 *
 * @param array $user Datele utilizatorului
 * @param bool $remember Ține minte sesiunea
 * @return void
 */
function create_login_session(array $user, bool $remember = false): void
{
    // Regenerare ID sesiune pentru prevenirea session fixation
    session_regenerate_id(true);

    $_SESSION['user_id'] = $user['id'];
    $_SESSION['username'] = $user['username'];
    $_SESSION['full_name'] = $user['full_name'];
    $_SESSION['role'] = $user['role'];
    $_SESSION['logged_in'] = true;
    $_SESSION['login_time'] = time();
    $_SESSION['last_activity'] = time();
    $_SESSION['ip_address'] = $_SERVER['REMOTE_ADDR'];
    $_SESSION['regenerate_time'] = time();

    // Setează durata cookie-ului sesiunii
    if ($remember) {
        $lifetime = 30 * 24 * 60 * 60; // 30 zile
    } else {
        $lifetime = 0; // Până la închiderea browser-ului
    }

    session_set_cookie_params([
        'lifetime' => $lifetime,
        'path' => '/',
        'domain' => '',
        'secure' => true,
        'httponly' => true,
        'samesite' => 'Strict'
    ]);
}

/**
 * Distruge sesiunea și face logout
 *
 * @return void
 */
function destroy_session(): void
{
    $_SESSION = [];

    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(
            session_name(),
            '',
            time() - 42000,
            $params['path'],
            $params['domain'],
            $params['secure'],
            $params['httponly']
        );
    }

    session_destroy();
}
