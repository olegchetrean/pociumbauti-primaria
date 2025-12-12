<?php
/**
 * Dashboard Principal - Primăria Pociumbăuți
 */

define('ADMIN_ACCESS', true);

session_start();

require_once 'includes/config.php';
require_once 'includes/auth.php';
require_once 'includes/functions.php';

// Verifică autentificarea
check_authenticated();

// Variabile pentru template
$page_title = 'Panou Principal';
$current_page = 'dashboard';

// Obține statistici
$stats = get_dashboard_stats($pdo);
$recent_activity = get_recent_activity($pdo, 10);

// Header
include 'includes/header.php';
?>

<!-- Welcome Section -->
<div class="welcome-banner">
    <div class="welcome-content">
        <h2>Bună ziua, <?php echo e($_SESSION['full_name']); ?>!</h2>
        <p>Bine ați revenit în panoul de administrare. Ce doriți să faceți astăzi?</p>
    </div>
    <div class="welcome-date">
        <span class="date-day"><?php echo date('d'); ?></span>
        <span class="date-month"><?php echo format_date(date('Y-m-d')); ?></span>
    </div>
</div>

<!-- Quick Actions Grid -->
<div class="quick-actions-grid">
    <a href="publish-anunt.php" class="action-card action-card-blue">
        <div class="action-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
            </svg>
        </div>
        <div class="action-content">
            <h3>Publică Anunț</h3>
            <p>Adaugă un anunț nou pe site</p>
        </div>
        <div class="action-arrow">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
        </div>
    </a>

    <a href="publish-decizie.php" class="action-card action-card-gold">
        <div class="action-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
            </svg>
        </div>
        <div class="action-content">
            <h3>Publică Decizie</h3>
            <p>Decizie a Consiliului Local</p>
        </div>
        <div class="action-arrow">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
        </div>
    </a>

    <a href="publish-dispozitie.php" class="action-card action-card-green">
        <div class="action-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
            </svg>
        </div>
        <div class="action-content">
            <h3>Publică Dispoziție</h3>
            <p>Dispoziție a Primarului</p>
        </div>
        <div class="action-arrow">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
        </div>
    </a>

    <a href="upload-photos.php" class="action-card action-card-purple">
        <div class="action-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
        </div>
        <div class="action-content">
            <h3>Încarcă Fotografii</h3>
            <p>Fotografii de la evenimente</p>
        </div>
        <div class="action-arrow">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
        </div>
    </a>
</div>

<!-- Statistics Cards -->
<div class="stats-grid">
    <div class="stat-card">
        <div class="stat-icon stat-icon-blue">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
        </div>
        <div class="stat-content">
            <span class="stat-value"><?php echo number_format($stats['vizite_azi']); ?></span>
            <span class="stat-label">Vizite astăzi</span>
        </div>
    </div>

    <div class="stat-card">
        <div class="stat-icon stat-icon-green">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
            </svg>
        </div>
        <div class="stat-content">
            <span class="stat-value"><?php echo $stats['anunturi_active']; ?></span>
            <span class="stat-label">Anunțuri active</span>
        </div>
    </div>

    <div class="stat-card">
        <div class="stat-icon stat-icon-gold">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
        </div>
        <div class="stat-content">
            <span class="stat-value"><?php echo $stats['decizii_total'] + $stats['dispozitii_total']; ?></span>
            <span class="stat-label">Documente publicate</span>
        </div>
    </div>

    <div class="stat-card">
        <div class="stat-icon stat-icon-purple">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
        </div>
        <div class="stat-content">
            <span class="stat-value"><?php echo $stats['fotografii_total']; ?></span>
            <span class="stat-label">Fotografii în galerie</span>
        </div>
    </div>
</div>

<!-- Recent Activity -->
<div class="content-card">
    <div class="card-header">
        <h3>Activitate Recentă</h3>
        <?php if (is_admin()): ?>
        <a href="audit-log.php" class="btn btn-outline btn-sm">Vezi tot</a>
        <?php endif; ?>
    </div>
    <div class="card-body">
        <?php if (empty($recent_activity)): ?>
        <div class="empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <p>Nicio activitate înregistrată încă.</p>
        </div>
        <?php else: ?>
        <table class="data-table">
            <thead>
                <tr>
                    <th>Data și Ora</th>
                    <th>Utilizator</th>
                    <th>Acțiune</th>
                    <th>Detalii</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($recent_activity as $activity): ?>
                <tr>
                    <td class="text-muted"><?php echo format_date($activity['created_at'], true); ?></td>
                    <td><?php echo e($activity['user_name'] ?? 'Necunoscut'); ?></td>
                    <td>
                        <span class="badge badge-info"><?php echo e(translate_action($activity['actiune'])); ?></span>
                    </td>
                    <td class="text-muted">
                        <?php
                        if ($activity['detalii']) {
                            $detalii = json_decode($activity['detalii'], true);
                            echo e($detalii['titlu'] ?? $detalii['username'] ?? '-');
                        } else {
                            echo '-';
                        }
                        ?>
                    </td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
        <?php endif; ?>
    </div>
</div>

<!-- Quick Links -->
<div class="quick-links-section">
    <h3>Acces Rapid</h3>
    <div class="quick-links-grid">
        <a href="view-anunturi.php" class="quick-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="8" y1="6" x2="21" y2="6"></line>
                <line x1="8" y1="12" x2="21" y2="12"></line>
                <line x1="8" y1="18" x2="21" y2="18"></line>
            </svg>
            Lista Anunțuri
        </a>
        <a href="view-decizii.php" class="quick-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            </svg>
            Lista Decizii
        </a>
        <a href="view-dispozitii.php" class="quick-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
            </svg>
            Lista Dispoziții
        </a>
        <a href="statistics.php" class="quick-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="20" x2="18" y2="10"></line>
                <line x1="12" y1="20" x2="12" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="14"></line>
            </svg>
            Statistici
        </a>
    </div>
</div>

<?php include 'includes/footer.php'; ?>
