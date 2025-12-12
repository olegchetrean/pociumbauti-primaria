<?php
/**
 * Lista Anunțuri - Primăria Pociumbăuți
 */

define('ADMIN_ACCESS', true);

session_start();

require_once 'includes/config.php';
require_once 'includes/auth.php';
require_once 'includes/csrf.php';
require_once 'includes/functions.php';

check_authenticated();

$page_title = 'Lista Anunțuri';
$current_page = 'view-anunturi';

$error = '';
$success = '';

// Procesare ștergere
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'delete') {
    if (!validate_csrf_token($_POST['csrf_token'] ?? '')) {
        $error = 'Token de securitate invalid.';
    } else {
        $id = (int)($_POST['id'] ?? 0);

        if ($id > 0) {
            try {
                // Obține info pentru log
                $stmt = $pdo->prepare("SELECT titlu, document_url, imagine_url FROM anunturi WHERE id = ?");
                $stmt->execute([$id]);
                $anunt = $stmt->fetch();

                if ($anunt) {
                    // Șterge din baza de date
                    $stmt = $pdo->prepare("DELETE FROM anunturi WHERE id = ?");
                    $stmt->execute([$id]);

                    log_action($pdo, $_SESSION['user_id'], 'delete_anunt', 'anunturi', $id, [
                        'titlu' => $anunt['titlu']
                    ]);

                    $success = 'Anunțul a fost șters cu succes.';
                }
            } catch (PDOException $e) {
                error_log('Eroare ștergere anunț: ' . $e->getMessage());
                $error = 'Eroare la ștergere.';
            }
        }
    }
}

// Paginare
$page = max(1, (int)($_GET['page'] ?? 1));
$per_page = 15;
$offset = ($page - 1) * $per_page;

// Filtre
$filter_categorie = $_GET['categorie'] ?? '';
$filter_status = $_GET['status'] ?? '';
$search = trim($_GET['search'] ?? '');

// Construiește query
$where = [];
$params = [];

if ($filter_categorie) {
    $where[] = "categorie = ?";
    $params[] = $filter_categorie;
}

if ($filter_status === 'publicat') {
    $where[] = "vizibil = 1";
} elseif ($filter_status === 'ciorna') {
    $where[] = "vizibil = 0";
}

if ($search) {
    $where[] = "(titlu LIKE ? OR continut LIKE ?)";
    $params[] = "%{$search}%";
    $params[] = "%{$search}%";
}

$where_clause = $where ? 'WHERE ' . implode(' AND ', $where) : '';

// Total pentru paginare
$stmt = $pdo->prepare("SELECT COUNT(*) FROM anunturi {$where_clause}");
$stmt->execute($params);
$total = $stmt->fetchColumn();
$total_pages = ceil($total / $per_page);

// Obține anunțurile
$stmt = $pdo->prepare("
    SELECT a.*, u.full_name as autor
    FROM anunturi a
    LEFT JOIN users u ON a.created_by = u.id
    {$where_clause}
    ORDER BY a.created_at DESC
    LIMIT {$per_page} OFFSET {$offset}
");
$stmt->execute($params);
$anunturi = $stmt->fetchAll();

$categorii = [
    'general' => 'General',
    'sedinta' => 'Ședință',
    'eveniment' => 'Eveniment',
    'info' => 'Informare',
    'achizitie' => 'Achiziție',
    'concurs' => 'Concurs',
    'urgenta' => 'Urgent'
];

$csrf_token = generate_csrf_token();
include 'includes/header.php';
?>

<div class="page-header" style="display: flex; justify-content: space-between; align-items: center;">
    <div>
        <h2>Lista Anunțuri</h2>
        <p>Gestionați anunțurile publicate pe site</p>
    </div>
    <a href="publish-anunt.php" class="btn btn-primary">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Adaugă Anunț
    </a>
</div>

<?php if ($error): echo error_message($error); endif; ?>
<?php if ($success): echo success_message($success); endif; ?>

<!-- Filters -->
<div class="content-card" style="margin-bottom: 16px;">
    <form method="GET" class="admin-form" style="padding: 16px;">
        <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: end;">
            <div class="form-group" style="margin: 0; flex: 1; min-width: 200px;">
                <label for="search">Caută</label>
                <input type="text" id="search" name="search" placeholder="Titlu sau conținut..." value="<?php echo e($search); ?>">
            </div>

            <div class="form-group" style="margin: 0;">
                <label for="categorie">Categorie</label>
                <select id="categorie" name="categorie">
                    <option value="">Toate</option>
                    <?php foreach ($categorii as $val => $label): ?>
                    <option value="<?php echo $val; ?>" <?php echo $filter_categorie === $val ? 'selected' : ''; ?>><?php echo $label; ?></option>
                    <?php endforeach; ?>
                </select>
            </div>

            <div class="form-group" style="margin: 0;">
                <label for="status">Status</label>
                <select id="status" name="status">
                    <option value="">Toate</option>
                    <option value="publicat" <?php echo $filter_status === 'publicat' ? 'selected' : ''; ?>>Publicate</option>
                    <option value="ciorna" <?php echo $filter_status === 'ciorna' ? 'selected' : ''; ?>>Ciorne</option>
                </select>
            </div>

            <button type="submit" class="btn btn-outline">Filtrează</button>
            <?php if ($search || $filter_categorie || $filter_status): ?>
            <a href="view-anunturi.php" class="btn btn-outline">Resetează</a>
            <?php endif; ?>
        </div>
    </form>
</div>

<!-- Table -->
<div class="content-card">
    <div class="card-body" style="padding: 0;">
        <?php if (empty($anunturi)): ?>
        <div class="empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
            </svg>
            <p>Nu există anunțuri<?php echo ($search || $filter_categorie || $filter_status) ? ' pentru criteriile selectate' : ''; ?>.</p>
            <a href="publish-anunt.php" class="btn btn-primary" style="margin-top: 16px;">Adaugă primul anunț</a>
        </div>
        <?php else: ?>
        <table class="data-table">
            <thead>
                <tr>
                    <th>Titlu</th>
                    <th>Categorie</th>
                    <th>Data</th>
                    <th>Status</th>
                    <th>Vizualizări</th>
                    <th style="width: 120px;">Acțiuni</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($anunturi as $anunt): ?>
                <tr>
                    <td>
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <?php if ($anunt['prioritate']): ?>
                            <span title="Prioritar" style="color: #f59e0b;">★</span>
                            <?php endif; ?>
                            <div>
                                <strong style="display: block;"><?php echo e(truncate($anunt['titlu'], 50)); ?></strong>
                                <small class="text-muted">de <?php echo e($anunt['autor'] ?? 'Necunoscut'); ?></small>
                            </div>
                        </div>
                    </td>
                    <td>
                        <span class="badge badge-info"><?php echo e($categorii[$anunt['categorie']] ?? $anunt['categorie']); ?></span>
                    </td>
                    <td class="text-muted"><?php echo format_date($anunt['data_publicare']); ?></td>
                    <td>
                        <?php if ($anunt['vizibil']): ?>
                        <span class="badge badge-success">Publicat</span>
                        <?php else: ?>
                        <span class="badge badge-warning">Ciornă</span>
                        <?php endif; ?>
                    </td>
                    <td class="text-muted"><?php echo number_format($anunt['vizualizari']); ?></td>
                    <td>
                        <div style="display: flex; gap: 8px;">
                            <a href="edit-anunt.php?id=<?php echo $anunt['id']; ?>" class="btn btn-outline btn-sm" title="Editează">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                            </a>
                            <form method="POST" style="margin: 0;" onsubmit="return confirm('Sigur doriți să ștergeți acest anunț?');">
                                <input type="hidden" name="csrf_token" value="<?php echo e($csrf_token); ?>">
                                <input type="hidden" name="action" value="delete">
                                <input type="hidden" name="id" value="<?php echo $anunt['id']; ?>">
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
        <div style="padding: 16px; border-top: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center;">
            <span class="text-muted">Afișate <?php echo count($anunturi); ?> din <?php echo $total; ?> anunțuri</span>
            <div style="display: flex; gap: 8px;">
                <?php if ($page > 1): ?>
                <a href="?page=<?php echo $page - 1; ?>&search=<?php echo urlencode($search); ?>&categorie=<?php echo urlencode($filter_categorie); ?>&status=<?php echo urlencode($filter_status); ?>" class="btn btn-outline btn-sm">← Anterior</a>
                <?php endif; ?>
                <?php if ($page < $total_pages): ?>
                <a href="?page=<?php echo $page + 1; ?>&search=<?php echo urlencode($search); ?>&categorie=<?php echo urlencode($filter_categorie); ?>&status=<?php echo urlencode($filter_status); ?>" class="btn btn-outline btn-sm">Următor →</a>
                <?php endif; ?>
            </div>
        </div>
        <?php endif; ?>
        <?php endif; ?>
    </div>
</div>

<?php include 'includes/footer.php'; ?>
