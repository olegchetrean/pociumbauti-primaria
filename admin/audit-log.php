<?php
/**
 * Jurnal de Audit - Primăria Pociumbăuți
 * Doar pentru administratori
 */

define('ADMIN_ACCESS', true);

session_start();

require_once 'includes/config.php';
require_once 'includes/auth.php';
require_once 'includes/functions.php';

check_authenticated();

// Doar administratorii pot vedea jurnalul de audit
if (!is_admin()) {
    header('Location: dashboard.php');
    exit;
}

$page_title = 'Jurnal de Audit';
$current_page = 'audit-log';

// Traduceri pentru acțiuni
$action_labels = [
    'login' => 'Autentificare',
    'logout' => 'Deconectare',
    'login_failed' => 'Autentificare eșuată',
    'create_anunt' => 'Creare anunț',
    'update_anunt' => 'Actualizare anunț',
    'delete_anunt' => 'Ștergere anunț',
    'create_decizie' => 'Publicare decizie',
    'update_decizie' => 'Actualizare decizie',
    'delete_decizie' => 'Ștergere decizie',
    'create_dispozitie' => 'Publicare dispoziție',
    'update_dispozitie' => 'Actualizare dispoziție',
    'delete_dispozitie' => 'Ștergere dispoziție',
    'upload_photo' => 'Încărcare fotografie',
    'delete_photo' => 'Ștergere fotografie',
    'change_password' => 'Schimbare parolă',
    'update_settings' => 'Actualizare setări'
];

// Clase CSS pentru tipuri de acțiuni
$action_classes = [
    'login' => 'badge-success',
    'logout' => 'badge-secondary',
    'login_failed' => 'badge-danger',
    'create_anunt' => 'badge-primary',
    'update_anunt' => 'badge-info',
    'delete_anunt' => 'badge-danger',
    'create_decizie' => 'badge-primary',
    'update_decizie' => 'badge-info',
    'delete_decizie' => 'badge-danger',
    'create_dispozitie' => 'badge-primary',
    'update_dispozitie' => 'badge-info',
    'delete_dispozitie' => 'badge-danger',
    'upload_photo' => 'badge-success',
    'delete_photo' => 'badge-danger',
    'change_password' => 'badge-warning',
    'update_settings' => 'badge-info'
];

// Filtrare
$user_filter = $_GET['user'] ?? '';
$action_filter = $_GET['action'] ?? '';
$date_from = $_GET['date_from'] ?? '';
$date_to = $_GET['date_to'] ?? '';
$page = max(1, (int)($_GET['page'] ?? 1));
$per_page = 50;
$offset = ($page - 1) * $per_page;

// Construim query-ul
$where = [];
$params = [];

if ($user_filter) {
    $where[] = "l.user_id = ?";
    $params[] = $user_filter;
}

if ($action_filter) {
    $where[] = "l.action = ?";
    $params[] = $action_filter;
}

if ($date_from) {
    $where[] = "DATE(l.created_at) >= ?";
    $params[] = $date_from;
}

if ($date_to) {
    $where[] = "DATE(l.created_at) <= ?";
    $params[] = $date_to;
}

$where_clause = $where ? 'WHERE ' . implode(' AND ', $where) : '';

// Număr total
$stmt = $pdo->prepare("SELECT COUNT(*) FROM logs l {$where_clause}");
$stmt->execute($params);
$total = $stmt->fetchColumn();
$total_pages = ceil($total / $per_page);

// Logs
$stmt = $pdo->prepare("
    SELECT l.*, u.username, u.full_name
    FROM logs l
    LEFT JOIN users u ON l.user_id = u.id
    {$where_clause}
    ORDER BY l.created_at DESC
    LIMIT {$per_page} OFFSET {$offset}
");
$stmt->execute($params);
$logs = $stmt->fetchAll();

// Utilizatori pentru filtru
$users = $pdo->query("SELECT id, username, full_name FROM users ORDER BY full_name")->fetchAll();

// Acțiuni unice pentru filtru
$actions = $pdo->query("SELECT DISTINCT action FROM logs ORDER BY action")->fetchAll(PDO::FETCH_COLUMN);

include 'includes/header.php';
?>

<div class="page-header">
    <div class="page-header-content">
        <h2>Jurnal de Audit</h2>
        <p>Monitorizați toate acțiunile efectuate în sistem</p>
    </div>
    <div class="page-header-actions">
        <a href="?export=csv" class="btn btn-outline">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Exportă CSV
        </a>
    </div>
</div>

<!-- Statistici rapide -->
<div class="audit-stats">
    <?php
    // Statistici pentru ultimele 24h
    $stmt = $pdo->query("SELECT COUNT(*) FROM logs WHERE created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)");
    $last_24h = $stmt->fetchColumn();

    $stmt = $pdo->query("SELECT COUNT(*) FROM logs WHERE action = 'login_failed' AND created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)");
    $failed_logins_24h = $stmt->fetchColumn();

    $stmt = $pdo->query("SELECT COUNT(*) FROM logs WHERE action LIKE 'create_%' AND created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)");
    $created_24h = $stmt->fetchColumn();
    ?>
    <div class="audit-stat">
        <span class="audit-stat-value"><?php echo number_format($last_24h); ?></span>
        <span class="audit-stat-label">Acțiuni (24h)</span>
    </div>
    <div class="audit-stat">
        <span class="audit-stat-value <?php echo $failed_logins_24h > 5 ? 'text-danger' : ''; ?>"><?php echo number_format($failed_logins_24h); ?></span>
        <span class="audit-stat-label">Login-uri eșuate (24h)</span>
    </div>
    <div class="audit-stat">
        <span class="audit-stat-value"><?php echo number_format($created_24h); ?></span>
        <span class="audit-stat-label">Conținut nou (24h)</span>
    </div>
    <div class="audit-stat">
        <span class="audit-stat-value"><?php echo number_format($total); ?></span>
        <span class="audit-stat-label">Total înregistrări</span>
    </div>
</div>

<!-- Filtre -->
<div class="content-card" style="margin-bottom: 24px;">
    <form method="GET" action="" class="filter-form">
        <div class="filter-row">
            <div class="filter-group">
                <label for="user">Utilizator</label>
                <select id="user" name="user">
                    <option value="">Toți utilizatorii</option>
                    <?php foreach ($users as $user): ?>
                    <option value="<?php echo $user['id']; ?>" <?php echo $user_filter == $user['id'] ? 'selected' : ''; ?>>
                        <?php echo e($user['full_name']); ?> (<?php echo e($user['username']); ?>)
                    </option>
                    <?php endforeach; ?>
                </select>
            </div>

            <div class="filter-group">
                <label for="action">Tip Acțiune</label>
                <select id="action" name="action">
                    <option value="">Toate acțiunile</option>
                    <?php foreach ($actions as $action): ?>
                    <option value="<?php echo $action; ?>" <?php echo $action_filter === $action ? 'selected' : ''; ?>>
                        <?php echo e($action_labels[$action] ?? $action); ?>
                    </option>
                    <?php endforeach; ?>
                </select>
            </div>

            <div class="filter-group">
                <label for="date_from">De la</label>
                <input type="date" id="date_from" name="date_from" value="<?php echo e($date_from); ?>">
            </div>

            <div class="filter-group">
                <label for="date_to">Până la</label>
                <input type="date" id="date_to" name="date_to" value="<?php echo e($date_to); ?>">
            </div>

            <div class="filter-actions">
                <button type="submit" class="btn btn-secondary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                    </svg>
                    Filtrează
                </button>
                <?php if ($user_filter || $action_filter || $date_from || $date_to): ?>
                <a href="audit-log.php" class="btn btn-outline">Resetează</a>
                <?php endif; ?>
            </div>
        </div>
    </form>
</div>

<!-- Tabel Jurnal -->
<div class="content-card">
    <div class="card-body">
        <?php if (empty($logs)): ?>
        <div class="empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
            <h3>Nu există înregistrări</h3>
            <p>Nu au fost găsite înregistrări cu filtrele selectate.</p>
        </div>
        <?php else: ?>
        <div class="table-responsive">
            <table class="data-table audit-table">
                <thead>
                    <tr>
                        <th style="width: 160px;">Data și Ora</th>
                        <th style="width: 150px;">Utilizator</th>
                        <th style="width: 150px;">Acțiune</th>
                        <th>Detalii</th>
                        <th style="width: 130px;">Adresă IP</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($logs as $log): ?>
                    <tr class="<?php echo $log['action'] === 'login_failed' ? 'row-warning' : ''; ?>">
                        <td>
                            <div class="datetime-cell">
                                <span class="date"><?php echo date('d.m.Y', strtotime($log['created_at'])); ?></span>
                                <span class="time"><?php echo date('H:i:s', strtotime($log['created_at'])); ?></span>
                            </div>
                        </td>
                        <td>
                            <?php if ($log['full_name']): ?>
                            <div class="user-cell">
                                <span class="user-name"><?php echo e($log['full_name']); ?></span>
                                <span class="user-username">@<?php echo e($log['username']); ?></span>
                            </div>
                            <?php else: ?>
                            <span class="text-muted">Sistem</span>
                            <?php endif; ?>
                        </td>
                        <td>
                            <span class="badge <?php echo $action_classes[$log['action']] ?? 'badge-secondary'; ?>">
                                <?php echo e($action_labels[$log['action']] ?? $log['action']); ?>
                            </span>
                        </td>
                        <td>
                            <?php
                            $details = [];

                            if ($log['entity_type'] && $log['entity_id']) {
                                $details[] = ucfirst($log['entity_type']) . ' #' . $log['entity_id'];
                            }

                            if ($log['details']) {
                                $extra = json_decode($log['details'], true);
                                if (is_array($extra)) {
                                    if (isset($extra['titlu'])) {
                                        $details[] = '"' . truncate($extra['titlu'], 50) . '"';
                                    }
                                    if (isset($extra['numar'])) {
                                        $details[] = 'Nr. ' . $extra['numar'];
                                    }
                                    if (isset($extra['username'])) {
                                        $details[] = 'User: ' . $extra['username'];
                                    }
                                }
                            }

                            echo e(implode(' • ', $details)) ?: '<span class="text-muted">-</span>';
                            ?>
                        </td>
                        <td>
                            <code class="ip-address"><?php echo e($log['ip_address']); ?></code>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>

        <!-- Paginare -->
        <?php if ($total_pages > 1): ?>
        <div class="pagination">
            <?php if ($page > 1): ?>
            <a href="?page=<?php echo $page - 1; ?>&user=<?php echo e($user_filter); ?>&action=<?php echo e($action_filter); ?>&date_from=<?php echo e($date_from); ?>&date_to=<?php echo e($date_to); ?>" class="pagination-btn">
                &laquo; Înapoi
            </a>
            <?php endif; ?>

            <span class="pagination-info">
                Pagina <?php echo $page; ?> din <?php echo $total_pages; ?>
                (<?php echo number_format($total); ?> înregistrări)
            </span>

            <?php if ($page < $total_pages): ?>
            <a href="?page=<?php echo $page + 1; ?>&user=<?php echo e($user_filter); ?>&action=<?php echo e($action_filter); ?>&date_from=<?php echo e($date_from); ?>&date_to=<?php echo e($date_to); ?>" class="pagination-btn">
                Înainte &raquo;
            </a>
            <?php endif; ?>
        </div>
        <?php endif; ?>
        <?php endif; ?>
    </div>
</div>

<div class="info-card" style="margin-top: 24px;">
    <div class="info-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
    </div>
    <div class="info-content">
        <h4>Despre Jurnalul de Audit</h4>
        <p>Toate acțiunile utilizatorilor sunt înregistrate automat pentru conformitate și securitate. Înregistrările sunt păstrate timp de 365 de zile.</p>
        <p><strong>Atenție:</strong> Autentificările eșuate repetate de la aceeași adresă IP pot indica o tentativă de acces neautorizat.</p>
    </div>
</div>

<style>
.audit-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 16px;
    margin-bottom: 24px;
}

.audit-stat {
    background: white;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    text-align: center;
}

.audit-stat-value {
    display: block;
    font-size: 28px;
    font-weight: 700;
    color: #1e40af;
}

.audit-stat-value.text-danger {
    color: #dc2626;
}

.audit-stat-label {
    font-size: 13px;
    color: #6b7280;
}

.audit-table {
    font-size: 14px;
}

.datetime-cell {
    display: flex;
    flex-direction: column;
}

.datetime-cell .date {
    font-weight: 500;
    color: #1f2937;
}

.datetime-cell .time {
    font-size: 12px;
    color: #6b7280;
}

.user-cell {
    display: flex;
    flex-direction: column;
}

.user-cell .user-name {
    font-weight: 500;
    color: #1f2937;
}

.user-cell .user-username {
    font-size: 12px;
    color: #6b7280;
}

.badge {
    display: inline-block;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
}

.badge-primary {
    background: #dbeafe;
    color: #1e40af;
}

.badge-success {
    background: #dcfce7;
    color: #166534;
}

.badge-warning {
    background: #fef3c7;
    color: #92400e;
}

.badge-danger {
    background: #fee2e2;
    color: #991b1b;
}

.badge-info {
    background: #e0f2fe;
    color: #075985;
}

.badge-secondary {
    background: #f3f4f6;
    color: #4b5563;
}

.ip-address {
    font-family: 'SF Mono', Monaco, monospace;
    font-size: 12px;
    background: #f3f4f6;
    padding: 4px 8px;
    border-radius: 4px;
    color: #4b5563;
}

.row-warning {
    background: #fef3c7 !important;
}

.filter-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.filter-row {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    align-items: flex-end;
}

.filter-group {
    flex: 1;
    min-width: 150px;
}

.filter-group label {
    display: block;
    font-size: 13px;
    font-weight: 500;
    color: #374151;
    margin-bottom: 6px;
}

.filter-group input,
.filter-group select {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 14px;
}

.filter-actions {
    display: flex;
    gap: 8px;
}

.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
    margin-top: 24px;
    padding-top: 20px;
    border-top: 1px solid #e5e7eb;
}

.pagination-btn {
    padding: 10px 20px;
    background: #1e40af;
    color: white;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 500;
    transition: background 0.2s;
}

.pagination-btn:hover {
    background: #1e3a8a;
}

.pagination-info {
    color: #6b7280;
}

.empty-state {
    text-align: center;
    padding: 40px 20px;
}

.empty-state svg {
    color: #d1d5db;
    margin-bottom: 16px;
}

.empty-state h3 {
    font-size: 18px;
    color: #374151;
    margin: 0 0 8px 0;
}

.empty-state p {
    color: #6b7280;
}

.table-responsive {
    overflow-x: auto;
}

@media (max-width: 768px) {
    .filter-group {
        min-width: 100%;
    }

    .audit-table th,
    .audit-table td {
        padding: 12px 8px;
    }
}
</style>

<?php include 'includes/footer.php'; ?>
