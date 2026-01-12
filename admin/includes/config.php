<?php
/**
 * Configurare Bază de Date - Primăria Pociumbăuți
 *
 * IMPORTANT: În producție, mutați acest fișier în afara directorului web
 * și actualizați credențialele din variabilele de mediu!
 */

// Previne accesul direct
if (!defined('ADMIN_ACCESS')) {
    die('Acces interzis.');
}

// Configurare erori (dezactivați în producție!)
error_reporting(E_ALL);
ini_set('display_errors', 0); // În producție: 0
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/../../logs/php-error.log');

// Configurare sesiune securizată
ini_set('session.cookie_httponly', 1);
ini_set('session.cookie_secure', 1);
ini_set('session.cookie_samesite', 'Strict');
ini_set('session.use_strict_mode', 1);
ini_set('session.gc_maxlifetime', 1800); // 30 minute

// Credențiale bază de date
// ÎN PRODUCȚIE: Folosiți variabile de mediu!
$db_config = [
    'host' => getenv('DB_HOST') ?: 'localhost',
    'dbname' => getenv('DB_NAME') ?: 'primaria_pociumbauti',
    'username' => getenv('DB_USER') ?: 'primaria_admin',
    'password' => getenv('DB_PASS') ?: '', // SETAȚI PAROLA!
    'charset' => 'utf8mb4',
    'port' => getenv('DB_PORT') ?: '3306'
];

// Conectare PDO cu securitate maximă
try {
    $dsn = sprintf(
        'mysql:host=%s;port=%s;dbname=%s;charset=%s',
        $db_config['host'],
        $db_config['port'],
        $db_config['dbname'],
        $db_config['charset']
    );

    $pdo = new PDO($dsn, $db_config['username'], $db_config['password'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false, // Prepared statements native
        PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
    ]);

} catch (PDOException $e) {
    // Log eroare, nu afișa detalii utilizatorului
    error_log('Eroare conectare bază de date: ' . $e->getMessage());
    die('Eroare temporară la server. Încercați din nou mai târziu.');
}

// Constante aplicație
define('SITE_NAME', 'Primăria Pociumbăuți');
define('SITE_EMAIL', 'primaria.pociumbauti@apl.gov.md');
define('SITE_URL', 'https://pociumbauti.md');
define('ADMIN_URL', SITE_URL . '/admin');

// Configurare upload fișiere
define('MAX_UPLOAD_SIZE', 10 * 1024 * 1024); // 10MB
define('MAX_IMAGE_SIZE', 5 * 1024 * 1024); // 5MB
define('ALLOWED_DOC_EXTENSIONS', ['pdf', 'docx']);
define('ALLOWED_IMG_EXTENSIONS', ['jpg', 'jpeg', 'png']);

// Directoare upload
define('UPLOAD_DIR_DOCS', __DIR__ . '/../../documents/uploads/');
define('UPLOAD_DIR_DECIZII', __DIR__ . '/../../documents/decizii/');
define('UPLOAD_DIR_DISPOZITII', __DIR__ . '/../../documents/dispozitii/');
define('UPLOAD_DIR_IMAGES', __DIR__ . '/../../assets/images/uploads/');

// Configurare securitate
define('BCRYPT_COST', 12);
define('SESSION_TIMEOUT', 1800); // 30 minute
define('MAX_LOGIN_ATTEMPTS', 5);
define('LOCKOUT_DURATION', 900); // 15 minute

// Timezone
date_default_timezone_set('Europe/Chisinau');
