<?php
/**
 * Lista Decizii - Primăria Pociumbăuți
 */

define('ADMIN_ACCESS', true);
session_start();

require_once 'includes/config.php';
require_once 'includes/auth.php';
require_once 'includes/csrf.php';
require_once 'includes/functions.php';

check_authenticated();

$page_title = 'Lista Decizii';
$current_page = 'view-decizii';

$error = '';
$success = '';

// Ștergere
if ($_SERVER['REQUEST_METHOD'] === 'POST' && ($_POST['action'] ?? '') === 'delete') {
    if (!validate_csrf_token($_POST['csrf_token'] ?? '')) {
        $error = 'Token de securitate invalid.';
    } else {
        $id = (int)($_POST['id'] ?? 0);
        if ($id > 0) {
            $stmt = $pdo->prepare("SELECT numar, titlu FROM decizii WHERE id = ?");
            $stmt->execute([$id]);
            $decizie = $stmt->fetch();

            if ($decizie) {
                $stmt = $pdo->prepare("DELETE FROM decizii WHERE id = ?");
                $stmt->execute([$id]);
                log_action($pdo, $_SESSION['user_id'], 'delete_decizie', 'decizii', $id, ['numar' => $decizie['numar']]);
                $success = 'Decizia a fost ștearsă.';
            }
        }
    }
}

// Paginare și filtre
$page = max(1, (int)($_GET['page'] ?? 1));
$per_page = 20;
$offset = ($page - 1) * $per_page;
$filter_tip = $_GET['tip'] ?? '';
$search = trim($_GET['search'] ?? '');

$where = [];
$params = [];

if ($filter_tip) {
    $where[] = "tip = ?";
    $params[] = $filter_tip;
}
if ($search) {
    $where[] = "(numar LIKE ? OR titlu LIKE ?)";
    $params[] = "%{$search}%";
    $params[] = "%{$search}%";
}

$where_clause = $where ? 'WHERE ' . implode(' AND ', $where) : '';

$stmt = $pdo->prepare("SELECT COUNT(*) FROM decizii {$where_clause}");
$stmt->execute($params);
$total = $stmt->fetchColumn();
$total_pages = ceil($total / $per_page);

$stmt = $pdo->prepare("
    SELECT d.*, u.full_name as autor
    FROM decizii d
    LEFT JOIN users u ON d.created_by = u.id
    {$where_clause}
    ORDER BY d.data_emitere DESC
    LIMIT {$per_page} OFFSET {$offset}
");
$stmt->execute($params);
$decizii = $stmt->fetchAll();

$csrf_token = generate_csrf_token();
include 'includes/header.php';
?>

<div class="page-header" style="display: flex; justify-content: space-between; align-items: center;">
    <div>
        <h2>Lista Decizii Consiliu Local</h2>
        <p>Conform HG 728/2023 - publicate în termen de 10 zile</p>
    </div>
    <a href="publish-decizie.php" class="btn btn-primary">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Adaugă Decizie
    </a>
</div>

<?php if ($error): echo error_message($error); endif; ?>
<?php if ($success): echo success_message($success); endif; ?>

<div class="content-card" style="margin-bottom: 16px;">
    <form method="GET" class="admin-form" style="padding: 16px;">
        <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: end;">
            <div class="form-group" style="margin: 0; flex: 1; min-width: 200px;">
                <label for="search">Caută</label>
                <input type="text" id="search" name="search" placeholder="Număr sau titlu..." value="<?php echo e($search); ?>">
            </div>
            <div class="form-group" style="margin: 0;">
                <label for="tip">Tip</label>
                <select id="tip" name="tip">
                    <option value="">Toate</option>
                    <option value="normativ" <?php echo $filter_tip === 'normativ' ? 'selected' : ''; ?>>Normativ</option>
                    <option value="individual" <?php echo $filter_tip === 'individual' ? 'selected' : ''; ?>>Individual</option>
                </select>
            </div>
            <button type="submit" class="btn btn-outline">Filtrează</button>
        </div>
    </form>
</div>

<div class="content-card">
    <div class="card-body" style="padding: 0;">
        <?php if (empty($decizii)): ?>
        <div class="empty-state">
            <p>Nu există decizii.</p>
            <a href="publish-decizie.php" class="btn btn-primary" style="margin-top: 16px;">Adaugă prima decizie</a>
        </div>
        <?php else: ?>
        <table class="data-table">
            <thead>
                <tr>
                    <th>Nr.</th>
                    <th>Titlu</th>
                    <th>Data</th>
                    <th>Tip</th>
                    <th>RSAL</th>
                    <th>PDF</th>
                    <th style="width: 120px;">Acțiuni</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($decizii as $d): ?>
                <tr>
                    <td><strong><?php echo e($d['numar']); ?></strong></td>
                    <td><?php echo e(truncate($d['titlu'], 60)); ?></td>
                    <td class="text-muted"><?php echo format_date($d['data_emitere']); ?></td>
                    <td><span class="badge badge-info"><?php echo ucfirst($d['tip']); ?></span></td>
                    <td>
                        <?php if ($d['publicat_rsal']): ?>
                        <span class="badge badge-success">Da</span>
                        <?php else: ?>
                        <span class="badge badge-warning">Nu</span>
                        <?php endif; ?>
                    </td>
                    <td>
                        <a href="../documents/decizii/<?php echo e($d['document_pdf']); ?>" target="_blank" class="btn btn-outline btn-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                            </svg>
                        </a>
                    </td>
                    <td>
                        <div style="display: flex; gap: 8px;">
                            <a href="edit-decizie.php?id=<?php echo $d['id']; ?>" class="btn btn-outline btn-sm" title="Editează">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                            </a>
                            <form method="POST" style="margin: 0;" onsubmit="return confirm('Sigur doriți să ștergeți?');">
                                <input type="hidden" name="csrf_token" value="<?php echo e($csrf_token); ?>">
                                <input type="hidden" name="action" value="delete">
                                <input type="hidden" name="id" value="<?php echo $d['id']; ?>">
                                <button type="submit" class="btn btn-outline btn-sm" style="color: #dc2626; border-color: #dc2626;" title="Șterge">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <polyline points="3 6 5 6 21 6"></polyline>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    </svg>
                                </button>
                            </form>
                        </div>
                    </td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>

        <?php if ($total_pages > 1): ?>
        <div style="padding: 16px; border-top: 1px solid #e5e7eb; display: flex; justify-content: center; gap: 8px;">
            <?php if ($page > 1): ?>
            <a href="?page=<?php echo $page - 1; ?>" class="btn btn-outline btn-sm">← Anterior</a>
            <?php endif; ?>
            <span style="padding: 8px;">Pagina <?php echo $page; ?> din <?php echo $total_pages; ?></span>
            <?php if ($page < $total_pages): ?>
            <a href="?page=<?php echo $page + 1; ?>" class="btn btn-outline btn-sm">Următor →</a>
            <?php endif; ?>
        </div>
        <?php endif; ?>
        <?php endif; ?>
    </div>
</div>

<?php include 'includes/footer.php'; ?>
