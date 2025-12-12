<?php
/**
 * Statistici - Primăria Pociumbăuți
 */

define('ADMIN_ACCESS', true);
session_start();

require_once 'includes/config.php';
require_once 'includes/auth.php';
require_once 'includes/functions.php';

check_authenticated();

$page_title = 'Statistici';
$current_page = 'statistics';

// Statistici generale
$stats = get_dashboard_stats($pdo);

// Vizite pe ultimele 7 zile
$stmt = $pdo->query("
    SELECT data, SUM(vizite) as total
    FROM statistici
    WHERE data >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
    GROUP BY data
    ORDER BY data ASC
");
$vizite_7_zile = $stmt->fetchAll();

// Top pagini
$stmt = $pdo->query("
    SELECT pagina, SUM(vizite) as total
    FROM statistici
    WHERE data >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
    GROUP BY pagina
    ORDER BY total DESC
    LIMIT 10
");
$top_pagini = $stmt->fetchAll();

// Anunțuri populare
$stmt = $pdo->query("
    SELECT titlu, vizualizari
    FROM anunturi
    WHERE vizibil = 1
    ORDER BY vizualizari DESC
    LIMIT 5
");
$top_anunturi = $stmt->fetchAll();

include 'includes/header.php';
?>

<div class="page-header">
    <h2>Statistici Site</h2>
    <p>Monitorizați activitatea și popularitatea conținutului</p>
</div>

<!-- Overview Stats -->
<div class="stats-grid">
    <div class="stat-card">
        <div class="stat-icon stat-icon-blue">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
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
            </svg>
        </div>
        <div class="stat-content">
            <span class="stat-value"><?php echo $stats['decizii_total']; ?></span>
            <span class="stat-label">Decizii publicate</span>
        </div>
    </div>

    <div class="stat-card">
        <div class="stat-icon stat-icon-purple">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
            </svg>
        </div>
        <div class="stat-content">
            <span class="stat-value"><?php echo $stats['dispozitii_total']; ?></span>
            <span class="stat-label">Dispoziții publicate</span>
        </div>
    </div>
</div>

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 24px;">

    <!-- Vizite Ultimele 7 Zile -->
    <div class="content-card">
        <div class="card-header">
            <h3>Vizite - Ultimele 7 Zile</h3>
        </div>
        <div class="card-body">
            <?php if (empty($vizite_7_zile)): ?>
            <p class="text-muted">Nu există date de vizite încă.</p>
            <?php else: ?>
            <div style="display: flex; flex-direction: column; gap: 12px;">
                <?php
                $max_vizite = max(array_column($vizite_7_zile, 'total')) ?: 1;
                foreach ($vizite_7_zile as $row):
                    $percent = ($row['total'] / $max_vizite) * 100;
                ?>
                <div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                        <span class="text-muted"><?php echo format_date($row['data']); ?></span>
                        <strong><?php echo number_format($row['total']); ?></strong>
                    </div>
                    <div style="background: #e5e7eb; border-radius: 4px; height: 8px; overflow: hidden;">
                        <div style="background: #3b82f6; height: 100%; width: <?php echo $percent; ?>%;"></div>
                    </div>
                </div>
                <?php endforeach; ?>
            </div>
            <?php endif; ?>
        </div>
    </div>

    <!-- Top Anunțuri -->
    <div class="content-card">
        <div class="card-header">
            <h3>Anunțuri Populare</h3>
        </div>
        <div class="card-body">
            <?php if (empty($top_anunturi)): ?>
            <p class="text-muted">Nu există anunțuri cu vizualizări.</p>
            <?php else: ?>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Titlu</th>
                        <th style="text-align: right;">Vizualizări</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($top_anunturi as $anunt): ?>
                    <tr>
                        <td><?php echo e(truncate($anunt['titlu'], 40)); ?></td>
                        <td style="text-align: right;"><strong><?php echo number_format($anunt['vizualizari']); ?></strong></td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
            <?php endif; ?>
        </div>
    </div>

</div>

<!-- Top Pagini -->
<div class="content-card" style="margin-top: 24px;">
    <div class="card-header">
        <h3>Pagini Populare (Ultimele 30 zile)</h3>
    </div>
    <div class="card-body">
        <?php if (empty($top_pagini)): ?>
        <p class="text-muted">Nu există date de trafic.</p>
        <?php else: ?>
        <table class="data-table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Pagină</th>
                    <th style="text-align: right;">Vizite</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($top_pagini as $idx => $pagina): ?>
                <tr>
                    <td class="text-muted"><?php echo $idx + 1; ?></td>
                    <td><?php echo e($pagina['pagina']); ?></td>
                    <td style="text-align: right;"><strong><?php echo number_format($pagina['total']); ?></strong></td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
        <?php endif; ?>
    </div>
</div>

<div class="info-card" style="margin-top: 24px;">
    <div class="info-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
    </div>
    <div class="info-content">
        <h4>Despre Statistici</h4>
        <p>Statisticile sunt colectate automat pentru toate paginile publice ale site-ului. Datele sunt agregate zilnic și păstrate timp de 90 de zile.</p>
    </div>
</div>

<?php include 'includes/footer.php'; ?>
