<?php
/**
 * Pagina de Autentificare - Primăria Pociumbăuți
 *
 * Securitate: CSRF, Rate Limiting, bcrypt, Session Regeneration
 */

define('ADMIN_ACCESS', true);

session_start();

require_once 'includes/config.php';
require_once 'includes/csrf.php';
require_once 'includes/auth.php';
require_once 'includes/functions.php';

// Redirecționează dacă deja autentificat
if (isset($_SESSION['user_id']) && isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true) {
    header('Location: dashboard.php');
    exit;
}

$error = '';
$info = '';

// Mesaje speciale
if (isset($_GET['timeout'])) {
    $info = 'Sesiunea a expirat din cauza inactivității. Vă rugăm autentificați-vă din nou.';
}
if (isset($_GET['logout'])) {
    $info = 'V-ați deconectat cu succes.';
}
if (isset($_GET['security'])) {
    $error = 'Sesiune invalidă detectată. Vă rugăm autentificați-vă din nou.';
}

// Procesare formular login
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Validare CSRF
    if (!validate_csrf_token($_POST['csrf_token'] ?? '')) {
        $error = 'Token de securitate invalid. Reîncărcați pagina și încercați din nou.';
    } else {
        $username = trim($_POST['username'] ?? '');
        $password = $_POST['password'] ?? '';
        $remember = isset($_POST['remember']);

        // Validare input
        if (empty($username) || empty($password)) {
            $error = 'Completați ambele câmpuri.';
        } else {
            // Caută utilizatorul
            try {
                $stmt = $pdo->prepare("
                    SELECT id, username, password_hash, full_name, role,
                           failed_login_attempts, lockout_until, is_active
                    FROM users
                    WHERE username = ?
                    LIMIT 1
                ");
                $stmt->execute([$username]);
                $user = $stmt->fetch();

                if ($user) {
                    // Verifică dacă contul e activ
                    if (!$user['is_active']) {
                        $error = 'Acest cont a fost dezactivat. Contactați administratorul.';
                        log_action($pdo, null, 'login_blocked_inactive', 'users', $user['id'], ['username' => $username]);
                    }
                    // Verifică lockout
                    elseif ($user['lockout_until'] && strtotime($user['lockout_until']) > time()) {
                        $minutes_left = ceil((strtotime($user['lockout_until']) - time()) / 60);
                        $error = "Cont blocat temporar. Încercați din nou în {$minutes_left} minute.";
                        log_action($pdo, null, 'login_blocked_lockout', 'users', $user['id'], ['username' => $username]);
                    }
                    // Verifică parola
                    elseif (verify_password($password, $user['password_hash'])) {
                        // SUCCES! Resetează încercările eșuate
                        reset_failed_attempts($pdo, $user['id']);

                        // Creează sesiunea
                        create_login_session($user, $remember);

                        // Log succes
                        log_action($pdo, $user['id'], 'login_success', 'users', $user['id']);

                        // Redirect la dashboard sau pagina salvată
                        $redirect = $_SESSION['redirect_after_login'] ?? 'dashboard.php';
                        unset($_SESSION['redirect_after_login']);
                        header('Location: ' . $redirect);
                        exit;
                    } else {
                        // Parolă greșită - incrementează încercările
                        $attempts = increment_failed_attempts($pdo, $user['id']);

                        if ($attempts >= MAX_LOGIN_ATTEMPTS) {
                            $error = 'Prea multe încercări eșuate. Contul a fost blocat pentru 15 minute.';
                        } else {
                            $remaining = MAX_LOGIN_ATTEMPTS - $attempts;
                            $error = "Nume utilizator sau parolă incorectă. Mai aveți {$remaining} încercări.";
                        }

                        log_action($pdo, null, 'login_failed', 'users', $user['id'], [
                            'username' => $username,
                            'attempts' => $attempts
                        ]);
                    }
                } else {
                    // Utilizator inexistent (afișăm același mesaj generic pentru securitate)
                    $error = 'Nume utilizator sau parolă incorectă.';
                    log_action($pdo, null, 'login_failed_unknown', 'users', null, ['username' => $username]);
                }
            } catch (PDOException $e) {
                error_log('Eroare login: ' . $e->getMessage());
                $error = 'Eroare de server. Încercați din nou mai târziu.';
            }
        }
    }
}

// Generează token CSRF
$csrf_token = generate_csrf_token();
?>
<!DOCTYPE html>
<html lang="ro">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="noindex, nofollow">
    <title>Autentificare - Primăria Pociumbăuți</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

    <style>
        *, *::before, *::after {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        :root {
            --color-primary: #1e40af;
            --color-primary-dark: #1e3a8a;
            --color-success: #059669;
            --color-error: #dc2626;
            --color-warning: #d97706;
            --color-gray-50: #f9fafb;
            --color-gray-100: #f3f4f6;
            --color-gray-200: #e5e7eb;
            --color-gray-300: #d1d5db;
            --color-gray-400: #9ca3af;
            --color-gray-500: #6b7280;
            --color-gray-600: #4b5563;
            --color-gray-700: #374151;
            --color-gray-800: #1f2937;
            --color-gray-900: #111827;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #3b82f6 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .login-container {
            display: flex;
            max-width: 1000px;
            width: 100%;
            background: white;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
        }

        .login-form-side {
            flex: 1;
            padding: 48px;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }

        .login-brand-side {
            flex: 1;
            background: linear-gradient(135deg, rgba(30, 64, 175, 0.9), rgba(59, 130, 246, 0.8)),
                        url('https://picsum.photos/800/1000?random=wheat') center/cover;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 48px;
            color: white;
            text-align: center;
        }

        @media (max-width: 768px) {
            .login-container {
                flex-direction: column;
            }
            .login-brand-side {
                display: none;
            }
            .login-form-side {
                padding: 32px 24px;
            }
        }

        .logo-section {
            text-align: center;
            margin-bottom: 32px;
        }

        .logo-icon {
            width: 72px;
            height: 72px;
            background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 16px;
            color: white;
            font-size: 32px;
            font-weight: 700;
            box-shadow: 0 4px 14px rgba(30, 64, 175, 0.4);
        }

        .logo-section h1 {
            font-size: 24px;
            font-weight: 700;
            color: var(--color-gray-900);
            margin-bottom: 4px;
        }

        .logo-section p {
            color: var(--color-gray-500);
            font-size: 14px;
        }

        .alert {
            padding: 12px 16px;
            border-radius: 10px;
            margin-bottom: 24px;
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 14px;
        }

        .alert-error {
            background: #fef2f2;
            color: var(--color-error);
            border: 1px solid #fecaca;
        }

        .alert-info {
            background: #eff6ff;
            color: var(--color-primary);
            border: 1px solid #bfdbfe;
        }

        .alert svg {
            flex-shrink: 0;
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-group label {
            display: block;
            font-size: 14px;
            font-weight: 500;
            color: var(--color-gray-700);
            margin-bottom: 8px;
        }

        .input-wrapper {
            position: relative;
        }

        .input-wrapper svg {
            position: absolute;
            left: 14px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--color-gray-400);
            pointer-events: none;
        }

        .form-group input[type="text"],
        .form-group input[type="password"] {
            width: 100%;
            padding: 14px 14px 14px 44px;
            font-size: 16px;
            border: 2px solid var(--color-gray-200);
            border-radius: 10px;
            transition: all 0.2s;
            font-family: inherit;
        }

        .form-group input:focus {
            outline: none;
            border-color: var(--color-primary);
            box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.1);
        }

        .toggle-password {
            position: absolute;
            right: 14px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: var(--color-gray-400);
            cursor: pointer;
            padding: 4px;
        }

        .toggle-password:hover {
            color: var(--color-gray-600);
        }

        .form-group-checkbox {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 24px;
        }

        .form-group-checkbox input[type="checkbox"] {
            width: 18px;
            height: 18px;
            accent-color: var(--color-primary);
        }

        .form-group-checkbox label {
            font-size: 14px;
            color: var(--color-gray-600);
            cursor: pointer;
        }

        .btn-submit {
            width: 100%;
            padding: 14px 24px;
            background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }

        .btn-submit:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(30, 64, 175, 0.4);
        }

        .btn-submit:active {
            transform: translateY(0);
        }

        .btn-submit:disabled {
            opacity: 0.7;
            cursor: not-allowed;
            transform: none;
        }

        .spinner {
            width: 20px;
            height: 20px;
            border: 2px solid rgba(255,255,255,0.3);
            border-top-color: white;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        .login-footer {
            text-align: center;
            margin-top: 24px;
            padding-top: 24px;
            border-top: 1px solid var(--color-gray-200);
        }

        .login-footer p {
            font-size: 13px;
            color: var(--color-gray-500);
        }

        .brand-content h2 {
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 16px;
            text-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .brand-content p {
            font-size: 18px;
            opacity: 0.9;
            max-width: 300px;
            margin: 0 auto;
            line-height: 1.6;
        }
    </style>
</head>
<body>
    <div class="login-container">
        <div class="login-form-side">
            <div class="logo-section">
                <div class="logo-icon">P</div>
                <h1>Primăria Pociumbăuți</h1>
                <p>Panou de Administrare</p>
            </div>

            <?php if ($error): ?>
            <div class="alert alert-error">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
                <span><?php echo e($error); ?></span>
            </div>
            <?php endif; ?>

            <?php if ($info): ?>
            <div class="alert alert-info">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <span><?php echo e($info); ?></span>
            </div>
            <?php endif; ?>

            <form method="POST" action="" id="loginForm">
                <input type="hidden" name="csrf_token" value="<?php echo e($csrf_token); ?>">

                <div class="form-group">
                    <label for="username">Nume utilizator</label>
                    <div class="input-wrapper">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            required
                            autocomplete="username"
                            autofocus
                            value="<?php echo e($_POST['username'] ?? ''); ?>"
                        >
                    </div>
                </div>

                <div class="form-group">
                    <label for="password">Parolă</label>
                    <div class="input-wrapper">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            required
                            autocomplete="current-password"
                        >
                        <button type="button" class="toggle-password" id="togglePassword" aria-label="Arată parola">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" id="eyeIcon">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                        </button>
                    </div>
                </div>

                <div class="form-group-checkbox">
                    <input type="checkbox" id="remember" name="remember">
                    <label for="remember">Ține-mă minte (30 zile)</label>
                </div>

                <button type="submit" class="btn-submit" id="submitBtn">
                    <span id="btnText">Autentificare</span>
                    <div class="spinner" id="btnSpinner" style="display: none;"></div>
                </button>
            </form>

            <div class="login-footer">
                <p>Probleme cu autentificarea? Contactați administratorul de sistem.</p>
            </div>
        </div>

        <div class="login-brand-side">
            <div class="brand-content">
                <h2>Bine ați revenit!</h2>
                <p>Gestionați cu încredere informațiile satul Pociumbăuți</p>
            </div>
        </div>
    </div>

    <script>
        // Toggle vizibilitate parolă
        document.getElementById('togglePassword').addEventListener('click', function() {
            const passwordInput = document.getElementById('password');
            const eyeIcon = document.getElementById('eyeIcon');

            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                eyeIcon.innerHTML = '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>';
            } else {
                passwordInput.type = 'password';
                eyeIcon.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>';
            }
        });

        // Loading state la submit
        document.getElementById('loginForm').addEventListener('submit', function() {
            const btn = document.getElementById('submitBtn');
            const btnText = document.getElementById('btnText');
            const btnSpinner = document.getElementById('btnSpinner');

            btn.disabled = true;
            btnText.textContent = 'Se autentifică...';
            btnSpinner.style.display = 'block';
        });
    </script>
</body>
</html>
