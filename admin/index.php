<?php
/**
 * Index Admin - Redirect la Login sau Dashboard
 */

define('ADMIN_ACCESS', true);

session_start();

// Redirecționează la dashboard dacă autentificat, altfel la login
if (isset($_SESSION['user_id']) && isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true) {
    header('Location: dashboard.php');
} else {
    header('Location: login.php');
}
exit;
