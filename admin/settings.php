<?php
/**
 * Setări Cont - Primăria Pociumbăuți
 */

define('ADMIN_ACCESS', true);
session_start();

require_once 'includes/config.php';
require_once 'includes/auth.php';
require_once 'includes/csrf.php';
require_once 'includes/functions.php';

check_authenticated();

$page_title = 'Setări Cont';
$current_page = 'settings';

$error = '';
$success = '';

// Obține datele utilizatorului
$user = get_current_user($pdo);

// Schimbare parolă
if ($_SERVER['REQUEST_METHOD'] === 'POST' && ($_POST['action'] ?? '') === 'change_password') {
    if (!validate_csrf_token($_POST['csrf_token'] ?? '')) {
        $error = 'Token de securitate invalid.';
    } else {
        $current_password = $_POST['current_password'] ?? '';
        $new_password = $_POST['new_password'] ?? '';
        $confirm_password = $_POST['confirm_password'] ?? '';

        if (empty($current_password) || empty($new_password) || empty($confirm_password)) {
            $error = 'Completați toate câmpurile.';
        } elseif (strlen($new_password) < 8) {
            $error = 'Parola nouă trebuie să aibă minim 8 caractere.';
        } elseif ($new_password !== $confirm_password) {
            $error = 'Parolele noi nu coincid.';
        } else {
            // Verifică parola curentă
            $stmt = $pdo->prepare("SELECT password_hash FROM users WHERE id = ?");
            $stmt->execute([$_SESSION['user_id']]);
            $hash = $stmt->fetchColumn();

            if (!verify_password($current_password, $hash)) {
                $error = 'Parola curentă este incorectă.';
            } else {
                // Actualizează parola
                $new_hash = hash_password($new_password);
                $stmt = $pdo->prepare("UPDATE users SET password_hash = ? WHERE id = ?");
                $stmt->execute([$new_hash, $_SESSION['user_id']]);

                log_action($pdo, $_SESSION['user_id'], 'change_password', 'users', $_SESSION['user_id']);

                $success = 'Parola a fost schimbată cu succes!';
            }
        }
    }
}

$csrf_token = generate_csrf_token();
include 'includes/header.php';
?>

<div class="page-header">
    <h2>Setări Cont</h2>
    <p>Gestionați informațiile contului și securitatea</p>
</div>

<?php if ($error): echo error_message($error); endif; ?>
<?php if ($success): echo success_message($success); endif; ?>

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 24px;">

    <!-- Info Cont -->
    <div class="content-card">
        <div class="card-header">
            <h3>Informații Cont</h3>
        </div>
        <div class="card-body">
            <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 24px;">
                <div class="user-avatar" style="width: 64px; height: 64px; font-size: 24px;">
                    <?php echo substr($user['full_name'], 0, 1); ?>
                </div>
                <div>
                    <h4 style="margin: 0;"><?php echo e($user['full_name']); ?></h4>
                    <span class="badge badge-info"><?php echo $user['role'] === 'admin' ? 'Administrator' : 'Editor'; ?></span>
                </div>
            </div>

            <div style="space-y: 12px;">
                <p><strong>Nume utilizator:</strong> <?php echo e($user['username']); ?></p>
                <p><strong>Email:</strong> <?php echo e($user['email'] ?? '-'); ?></p>
                <p><strong>Ultima autentificare:</strong> <?php echo $user['last_login'] ? format_date($user['last_login'], true) : 'Niciodată'; ?></p>
            </div>
        </div>
    </div>

    <!-- Schimbare Parolă -->
    <div class="content-card">
        <div class="card-header">
            <h3>Schimbă Parola</h3>
        </div>
        <form method="POST" class="admin-form">
            <input type="hidden" name="csrf_token" value="<?php echo e($csrf_token); ?>">
            <input type="hidden" name="action" value="change_password">

            <div class="form-group">
                <label for="current_password">Parola Curentă <span class="required">*</span></label>
                <input type="password" id="current_password" name="current_password" required autocomplete="current-password">
            </div>

            <div class="form-group">
                <label for="new_password">Parola Nouă <span class="required">*</span></label>
                <input type="password" id="new_password" name="new_password" required autocomplete="new-password" minlength="8">
                <span class="form-hint">Minim 8 caractere</span>
            </div>

            <div class="form-group">
                <label for="confirm_password">Confirmă Parola Nouă <span class="required">*</span></label>
                <input type="password" id="confirm_password" name="confirm_password" required autocomplete="new-password">
            </div>

            <button type="submit" class="btn btn-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                Schimbă Parola
            </button>
        </form>
    </div>

</div>

<div class="info-card" style="margin-top: 24px;">
    <div class="info-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
    </div>
    <div class="info-content">
        <h4>Recomandări de Securitate</h4>
        <ul style="margin: 8px 0 0 20px; color: var(--gray-600);">
            <li>Folosiți o parolă unică, diferită de alte conturi</li>
            <li>Nu partajați parola cu nimeni</li>
            <li>Schimbați parola periodic (la 3-6 luni)</li>
            <li>Deconectați-vă când terminați lucrul</li>
        </ul>
    </div>
</div>

<?php include 'includes/footer.php'; ?>
