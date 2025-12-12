<?php
/**
 * Logout - Primăria Pociumbăuți
 */

define('ADMIN_ACCESS', true);

session_start();

require_once 'includes/config.php';
require_once 'includes/functions.php';
require_once 'includes/auth.php';

// Log deconectarea
if (isset($_SESSION['user_id'])) {
    log_action($pdo, $_SESSION['user_id'], 'logout', 'users', $_SESSION['user_id']);
}

// Distruge sesiunea
destroy_session();

// Redirecționează la login
header('Location: login.php?logout=1');
exit;
