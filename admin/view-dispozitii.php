<?php
/**
 * Lista Dispoziții - Primăria Pociumbăuți
 */

define('ADMIN_ACCESS', true);
session_start();

require_once 'includes/config.php';
require_once 'includes/auth.php';
require_once 'includes/csrf.php';
require_once 'includes/functions.php';

check_authenticated();

$page_title = 'Lista Dispoziții';
$current_page = 'view-dispozitii';

$error = '';
$success = '';

// Ștergere
if ($_SERVER['REQUEST_METHOD'] === 'POST' && ($_POST['action'] ?? '') === 'delete') {
    if (validate_csrf_token($_POST['csrf_token'] ?? '')) {
        $id = (int)($_POST['id'] ?? 0);
        if ($id > 0) {
            $stmt = $pdo->prepare("SELECT numar FROM dispozitii WHERE id = ?");
            $stmt->execute([$id]);
            $d = $stmt->fetch();

            if ($d) {
                $stmt = $pdo->prepare("DELETE FROM dispozitii WHERE id = ?");
                $stmt->execute([$id]);
                log_action($pdo, $_SESSION['user_id'], 'delete_dispozitie', 'dispozitii', $id, ['numar' => $d['numar']]);
                $success = 'Dispoziția a fost ștearsă.';
            }
        }
    }
}

$page = max(1, (int)($_GET['page'] ?? 1));
$per_page = 20;
$offset = ($page - 1) * $per_page;

$stmt = $pdo->query("SELECT COUNT(*) FROM dispozitii");
$total = $stmt->fetchColumn();
$total_pages = ceil($total / $per_page);

$stmt = $pdo->prepare("
    SELECT d.*, u.full_name as autor
    FROM dispozitii d
    LEFT JOIN users u ON d.created_by = u.id
    ORDER BY d.data_emitere DESC
    LIMIT {$per_page} OFFSET {$offset}
");
$stmt->execute();
$dispozitii = $stmt->fetchAll();

$csrf_token = generate_csrf_token();
include 'includes/header.php';
?>

<div class="page-header" style="display: flex; justify-content: space-between; align-items: center;">
    <div>
        <h2>Lista Dispoziții Primar</h2>
        <p>Dispoziții emise de Primarul satul</p>
    </div>
    <a href="publish-dispozitie.php" class="btn btn-primary">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Adaugă Dispoziție
    </a>
</div>

<?php if ($error): echo error_message($error); endif; ?>
<?php if ($success): echo success_message($success); endif; ?>

<div class="content-card">
    <div class="card-body" style="padding: 0;">
        <?php if (empty($dispozitii)): ?>
        <div class="empty-state">
            <p>Nu există dispoziții.</p>
            <a href="publish-dispozitie.php" class="btn btn-primary" style="margin-top: 16px;">Adaugă prima dispoziție</a>
        </div>
        <?php else: ?>
        <table class="data-table">
            <thead>
                <tr>
                    <th>Nr.</th>
                    <th>Titlu</th>
                    <th>Data</th>
                    <th>Tip</th>
                    <th>Depersonalizat</th>
                    <th>PDF</th>
                    <th style="width: 80px;">Acțiuni</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($dispozitii as $d): ?>
                <tr>
                    <td><strong><?php echo e($d['numar']); ?></strong></td>
                    <td><?php echo e(truncate($d['titlu'], 60)); ?></td>
                    <td class="text-muted"><?php echo format_date($d['data_emitere']); ?></td>
                    <td><span class="badge badge-info"><?php echo ucfirst($d['tip']); ?></span></td>
                    <td>
                        <?php if ($d['depersonalizat']): ?>
                        <span class="badge badge-success">Da</span>
                        <?php else: ?>
                        <span class="badge badge-warning">Nu</span>
                        <?php endif; ?>
                    </td>
                    <td>
                        <a href="../documents/dispozitii/<?php echo e($d['document_pdf']); ?>" target="_blank" class="btn btn-outline btn-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            </svg>
                        </a>
                    </td>
                    <td>
                        <div style="display: flex; gap: 8px;">
                            <a href="edit-dispozitie.php?id=<?php echo $d['id']; ?>" class="btn btn-outline btn-sm" title="Editează">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                            </a>
                            <form method="POST" style="margin: 0;" onsubmit="return confirm('Sigur doriți să ștergeți această dispoziție?');">
                                <input type="hidden" name="csrf_token" value="<?php echo e($csrf_token); ?>">
                                <input type="hidden" name="action" value="delete">
                                <input type="hidden" name="id" value="<?php echo $d['id']; ?>">
                                <button type="submit" class="btn btn-outline btn-sm" style="color: #dc2626; border-color: #dc2626;" title="Șterge">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <polyline points="3 6 5 6 21 6"></polyline>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                                    </svg>
                                </button>
                            </form>
                        </div>
                    </td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
        <?php endif; ?>
    </div>
</div>

<?php include 'includes/footer.php'; ?>
