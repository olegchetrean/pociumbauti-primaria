<?php
/**
 * Funcții Helper - Primăria Pociumbăuți Admin
 *
 * Funcții reutilizabile pentru întreaga aplicație
 */

// Previne accesul direct
if (!defined('ADMIN_ACCESS')) {
    die('Acces interzis.');
}

/**
 * Înregistrează o acțiune în log-ul de audit
 *
 * @param PDO $pdo Conexiune bază de date
 * @param int|null $user_id ID utilizator (null pentru acțiuni anonime)
 * @param string $actiune Tipul acțiunii (ex: login_success, create_anunt)
 * @param string|null $tabel Tabela afectată
 * @param int|null $record_id ID-ul înregistrării afectate
 * @param array|null $detalii Detalii suplimentare
 * @return bool Succes/Eșec
 */
function log_action(
    PDO $pdo,
    ?int $user_id,
    string $actiune,
    ?string $tabel = null,
    ?int $record_id = null,
    ?array $detalii = null
): bool {
    try {
        $stmt = $pdo->prepare("
            INSERT INTO logs (user_id, actiune, tabel, record_id, detalii, ip_address, user_agent)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ");

        $stmt->execute([
            $user_id,
            $actiune,
            $tabel,
            $record_id,
            $detalii ? json_encode($detalii, JSON_UNESCAPED_UNICODE) : null,
            $_SERVER['REMOTE_ADDR'] ?? 'unknown',
            substr($_SERVER['HTTP_USER_AGENT'] ?? 'unknown', 0, 255)
        ]);

        return true;
    } catch (PDOException $e) {
        error_log('Eroare log_action: ' . $e->getMessage());
        return false;
    }
}

/**
 * Sanitizează și escape text pentru output HTML
 *
 * @param string|null $text Textul de sanitizat
 * @return string Text sanitizat
 */
function e(?string $text): string
{
    if ($text === null) {
        return '';
    }
    return htmlspecialchars($text, ENT_QUOTES | ENT_HTML5, 'UTF-8');
}

/**
 * Formatează data în format românesc
 *
 * @param string|null $date Data de formatat
 * @param bool $with_time Include ora
 * @return string Data formatată
 */
function format_date(?string $date, bool $with_time = false): string
{
    if (empty($date)) {
        return '-';
    }

    $timestamp = strtotime($date);
    if ($timestamp === false) {
        return '-';
    }

    $months = [
        1 => 'ianuarie', 2 => 'februarie', 3 => 'martie', 4 => 'aprilie',
        5 => 'mai', 6 => 'iunie', 7 => 'iulie', 8 => 'august',
        9 => 'septembrie', 10 => 'octombrie', 11 => 'noiembrie', 12 => 'decembrie'
    ];

    $day = date('j', $timestamp);
    $month = $months[(int)date('n', $timestamp)];
    $year = date('Y', $timestamp);

    $formatted = "$day $month $year";

    if ($with_time) {
        $formatted .= ', ' . date('H:i', $timestamp);
    }

    return $formatted;
}

/**
 * Generează un slug URL-friendly din text
 *
 * @param string $text Textul de convertit
 * @return string Slug generat
 */
function generate_slug(string $text): string
{
    // Transliterare caractere românești
    $trans = [
        'ă' => 'a', 'â' => 'a', 'î' => 'i', 'ș' => 's', 'ț' => 't',
        'Ă' => 'A', 'Â' => 'A', 'Î' => 'I', 'Ș' => 'S', 'Ț' => 'T'
    ];
    $text = strtr($text, $trans);

    // Lowercase și înlocuire caractere speciale
    $text = strtolower($text);
    $text = preg_replace('/[^a-z0-9\s-]/', '', $text);
    $text = preg_replace('/[\s-]+/', '-', $text);
    $text = trim($text, '-');

    return $text;
}

/**
 * Obține statistici pentru dashboard
 *
 * @param PDO $pdo Conexiune bază de date
 * @return array Statistici
 */
function get_dashboard_stats(PDO $pdo): array
{
    $stats = [
        'anunturi_active' => 0,
        'decizii_total' => 0,
        'dispozitii_total' => 0,
        'fotografii_total' => 0,
        'vizite_azi' => 0
    ];

    try {
        // Anunțuri active
        $stmt = $pdo->query("SELECT COUNT(*) FROM anunturi WHERE vizibil = 1");
        $stats['anunturi_active'] = (int)$stmt->fetchColumn();

        // Decizii total
        $stmt = $pdo->query("SELECT COUNT(*) FROM decizii WHERE vizibil = 1");
        $stats['decizii_total'] = (int)$stmt->fetchColumn();

        // Dispoziții total
        $stmt = $pdo->query("SELECT COUNT(*) FROM dispozitii WHERE vizibil = 1");
        $stats['dispozitii_total'] = (int)$stmt->fetchColumn();

        // Fotografii total
        $stmt = $pdo->query("SELECT COUNT(*) FROM fotografii");
        $stats['fotografii_total'] = (int)$stmt->fetchColumn();

        // Vizite azi
        $stmt = $pdo->prepare("SELECT SUM(vizite) FROM statistici WHERE data = CURDATE()");
        $stmt->execute();
        $stats['vizite_azi'] = (int)$stmt->fetchColumn();

    } catch (PDOException $e) {
        error_log('Eroare get_dashboard_stats: ' . $e->getMessage());
    }

    return $stats;
}

/**
 * Obține activitatea recentă din log
 *
 * @param PDO $pdo Conexiune bază de date
 * @param int $limit Număr de înregistrări
 * @return array Lista activităților
 */
function get_recent_activity(PDO $pdo, int $limit = 10): array
{
    try {
        $stmt = $pdo->prepare("
            SELECT
                l.created_at,
                u.full_name as user_name,
                l.actiune,
                l.detalii
            FROM logs l
            LEFT JOIN users u ON l.user_id = u.id
            WHERE l.actiune NOT LIKE 'view_%'
            ORDER BY l.created_at DESC
            LIMIT ?
        ");
        $stmt->execute([$limit]);

        return $stmt->fetchAll();
    } catch (PDOException $e) {
        error_log('Eroare get_recent_activity: ' . $e->getMessage());
        return [];
    }
}

/**
 * Traduce acțiunile din log în română
 *
 * @param string $action Acțiunea în engleză
 * @return string Acțiunea tradusă
 */
function translate_action(string $action): string
{
    $translations = [
        'login_success' => 'Autentificare reușită',
        'login_failed' => 'Autentificare eșuată',
        'logout' => 'Deconectare',
        'create_anunt' => 'Anunț creat',
        'create_anunt_publish' => 'Anunț publicat',
        'create_anunt_draft' => 'Anunț salvat ca ciornă',
        'update_anunt' => 'Anunț actualizat',
        'delete_anunt' => 'Anunț șters',
        'create_decizie' => 'Decizie adăugată',
        'update_decizie' => 'Decizie actualizată',
        'delete_decizie' => 'Decizie ștearsă',
        'create_dispozitie' => 'Dispoziție adăugată',
        'update_dispozitie' => 'Dispoziție actualizată',
        'delete_dispozitie' => 'Dispoziție ștearsă',
        'upload_photo' => 'Fotografii încărcate',
        'delete_photo' => 'Fotografie ștearsă',
        'change_password' => 'Parolă schimbată',
        'update_settings' => 'Setări actualizate'
    ];

    return $translations[$action] ?? $action;
}

/**
 * Verifică dacă utilizatorul are rol de admin
 *
 * @return bool
 */
function is_admin(): bool
{
    return isset($_SESSION['role']) && $_SESSION['role'] === 'admin';
}

/**
 * Generează mesaj de succes pentru afișare
 *
 * @param string $message Mesajul
 * @return string HTML alert
 */
function success_message(string $message): string
{
    return '<div class="alert alert-success">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <span>' . e($message) . '</span>
    </div>';
}

/**
 * Generează mesaj de eroare pentru afișare
 *
 * @param string $message Mesajul
 * @return string HTML alert
 */
function error_message(string $message): string
{
    return '<div class="alert alert-error">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
        </svg>
        <span>' . e($message) . '</span>
    </div>';
}

/**
 * Trunchiază text la o anumită lungime
 *
 * @param string $text Textul
 * @param int $length Lungimea maximă
 * @return string Text trunchiat
 */
function truncate(string $text, int $length = 100): string
{
    if (mb_strlen($text) <= $length) {
        return $text;
    }

    return mb_substr($text, 0, $length) . '...';
}

/**
 * Formatează dimensiunea fișierului în format citibil
 *
 * @param int $bytes Dimensiunea în bytes
 * @return string Dimensiunea formatată
 */
function format_filesize(int $bytes): string
{
    $units = ['B', 'KB', 'MB', 'GB'];
    $i = 0;

    while ($bytes >= 1024 && $i < count($units) - 1) {
        $bytes /= 1024;
        $i++;
    }

    return round($bytes, 2) . ' ' . $units[$i];
}
