<?php
/**
 * Editare Decizie - Primăria Pociumbăuți
 */

define('ADMIN_ACCESS', true);

session_start();

require_once 'includes/config.php';
require_once 'includes/auth.php';
require_once 'includes/csrf.php';
require_once 'includes/functions.php';
require_once 'includes/upload-handler.php';

check_authenticated();

$page_title = 'Editare Decizie';
$current_page = 'view-decizii';

$error = '';
$success = '';

// Verificăm ID-ul
$decizie_id = (int)($_GET['id'] ?? 0);

if (!$decizie_id) {
    header('Location: view-decizii.php');
    exit;
}

// Obținem datele
$stmt = $pdo->prepare("SELECT * FROM decizii WHERE id = ?");
$stmt->execute([$decizie_id]);
$decizie = $stmt->fetch();

if (!$decizie) {
    header('Location: view-decizii.php');
    exit;
}

// Tipuri de decizii
$tipuri = [
    'normativ' => 'Normativ (se aplică tuturor)',
    'individual' => 'Individual (persoană specifică)'
];

// Procesare formular
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!validate_csrf_token($_POST['csrf_token'] ?? '')) {
        $error = 'Token de securitate invalid.';
    } else {
        $numar = trim($_POST['numar'] ?? '');
        $data_emitere = $_POST['data_emitere'] ?? '';
        $titlu = trim($_POST['titlu'] ?? '');
        $descriere = trim($_POST['descriere'] ?? '');
        $tip = $_POST['tip'] ?? 'normativ';
        $publicat_rsal = isset($_POST['publicat_rsal']) ? 1 : 0;
        $link_rsal = trim($_POST['link_rsal'] ?? '');
        $vizibil = isset($_POST['vizibil']) ? 1 : 0;

        $errors = [];

        if (empty($numar)) {
            $errors[] = 'Numărul deciziei este obligatoriu.';
        }

        if (empty($data_emitere)) {
            $errors[] = 'Data emiterii este obligatorie.';
        }

        if (empty($titlu)) {
            $errors[] = 'Titlul este obligatoriu.';
        }

        // Verifică dacă numărul există deja (exceptând decizia curentă)
        $stmt = $pdo->prepare("SELECT id FROM decizii WHERE numar = ? AND id != ?");
        $stmt->execute([$numar, $decizie_id]);
        if ($stmt->fetch()) {
            $errors[] = 'Există deja o decizie cu acest număr.';
        }

        // Upload PDF nou (opțional)
        $document_pdf = $decizie['document_pdf'];
        if (isset($_FILES['document_pdf']) && $_FILES['document_pdf']['error'] !== UPLOAD_ERR_NO_FILE) {
            $upload_result = handle_file_upload(
                $_FILES['document_pdf'],
                ['pdf'],
                MAX_UPLOAD_SIZE,
                UPLOAD_DIR_DECIZII
            );

            if ($upload_result['success']) {
                // Ștergem documentul vechi
                if ($decizie['document_pdf']) {
                    $old_path = UPLOAD_DIR_DECIZII . $decizie['document_pdf'];
                    if (file_exists($old_path)) {
                        unlink($old_path);
                    }
                }
                $document_pdf = $upload_result['filename'];
            } else {
                $errors[] = 'PDF: ' . $upload_result['error'];
            }
        }

        if (empty($errors)) {
            try {
                $stmt = $pdo->prepare("
                    UPDATE decizii SET
                        numar = ?,
                        data_emitere = ?,
                        titlu = ?,
                        descriere = ?,
                        tip = ?,
                        document_pdf = ?,
                        publicat_rsal = ?,
                        link_rsal = ?,
                        vizibil = ?,
                        updated_at = CURRENT_TIMESTAMP
                    WHERE id = ?
                ");

                $stmt->execute([
                    $numar,
                    $data_emitere,
                    $titlu,
                    $descriere,
                    $tip,
                    $document_pdf,
                    $publicat_rsal,
                    $link_rsal ?: null,
                    $vizibil,
                    $decizie_id
                ]);

                log_action($pdo, $_SESSION['user_id'], 'update_decizie', 'decizii', $decizie_id, [
                    'numar' => $numar,
                    'titlu' => $titlu
                ]);

                $success = 'Decizia a fost actualizată cu succes!';

                // Reîncărcăm datele
                $stmt = $pdo->prepare("SELECT * FROM decizii WHERE id = ?");
                $stmt->execute([$decizie_id]);
                $decizie = $stmt->fetch();

            } catch (PDOException $e) {
                error_log('Eroare actualizare decizie: ' . $e->getMessage());
                $error = 'Eroare la salvare. Încercați din nou.';
            }
        } else {
            $error = implode('<br>', $errors);
        }
    }
}

$csrf_token = generate_csrf_token();
include 'includes/header.php';
?>

<div class="page-header">
    <div class="page-header-content">
        <h2>Editare Decizie</h2>
        <p>Modificați datele deciziei Nr. <?php echo e($decizie['numar']); ?></p>
    </div>
    <div class="page-header-actions">
        <a href="view-decizii.php" class="btn btn-outline">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Înapoi la Listă
        </a>
    </div>
</div>

<?php if ($error): echo error_message($error); endif; ?>
<?php if ($success): echo success_message($success); endif; ?>

<div class="content-card">
    <form method="POST" action="" enctype="multipart/form-data" class="admin-form">
        <input type="hidden" name="csrf_token" value="<?php echo e($csrf_token); ?>">

        <div class="form-row form-row-3">
            <div class="form-group">
                <label for="numar">Număr Decizie <span class="required">*</span></label>
                <input
                    type="text"
                    id="numar"
                    name="numar"
                    required
                    value="<?php echo e($decizie['numar']); ?>"
                >
            </div>

            <div class="form-group">
                <label for="data_emitere">Data Emiterii <span class="required">*</span></label>
                <input
                    type="date"
                    id="data_emitere"
                    name="data_emitere"
                    required
                    value="<?php echo e($decizie['data_emitere']); ?>"
                >
            </div>

            <div class="form-group">
                <label for="tip">Tipul Deciziei <span class="required">*</span></label>
                <select id="tip" name="tip" required>
                    <?php foreach ($tipuri as $value => $label): ?>
                    <option value="<?php echo $value; ?>" <?php echo $decizie['tip'] === $value ? 'selected' : ''; ?>>
                        <?php echo e($label); ?>
                    </option>
                    <?php endforeach; ?>
                </select>
            </div>
        </div>

        <div class="form-group">
            <label for="titlu">Titlu Decizie <span class="required">*</span></label>
            <input
                type="text"
                id="titlu"
                name="titlu"
                required
                maxlength="255"
                value="<?php echo e($decizie['titlu']); ?>"
            >
        </div>

        <div class="form-group">
            <label for="descriere">Descriere / Rezumat</label>
            <textarea
                id="descriere"
                name="descriere"
                rows="4"
            ><?php echo e($decizie['descriere']); ?></textarea>
        </div>

        <div class="form-group">
            <label for="document_pdf">Document PDF</label>
            <?php if ($decizie['document_pdf']): ?>
            <div class="current-file">
                <a href="../uploads/decizii/<?php echo e($decizie['document_pdf']); ?>" target="_blank" class="current-doc-link">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                    <?php echo e($decizie['document_pdf']); ?>
                </a>
            </div>
            <?php endif; ?>
            <div class="file-upload-wrapper">
                <input
                    type="file"
                    id="document_pdf"
                    name="document_pdf"
                    accept=".pdf"
                    class="file-input"
                >
                <label for="document_pdf" class="file-label">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                    <span><?php echo $decizie['document_pdf'] ? 'Înlocuiește PDF-ul' : 'Alegeți fișier PDF'; ?></span>
                </label>
                <span class="file-name"></span>
            </div>
            <span class="form-hint">Format: PDF. Mărime maximă: 10 MB</span>
        </div>

        <div class="form-section">
            <h4>Publicare RSAL</h4>

            <div class="form-group">
                <label class="checkbox-wrapper">
                    <input type="checkbox" name="publicat_rsal" value="1" <?php echo $decizie['publicat_rsal'] ? 'checked' : ''; ?>>
                    <span class="checkmark"></span>
                    <span class="checkbox-label">
                        <strong>Decizia a fost publicată în RSAL</strong>
                    </span>
                </label>
            </div>

            <div class="form-group">
                <label for="link_rsal">Link RSAL (opțional)</label>
                <input
                    type="url"
                    id="link_rsal"
                    name="link_rsal"
                    placeholder="https://actelocale.gov.md/..."
                    value="<?php echo e($decizie['link_rsal'] ?? ''); ?>"
                >
            </div>
        </div>

        <div class="form-group">
            <label class="checkbox-wrapper">
                <input type="checkbox" name="vizibil" value="1" <?php echo $decizie['vizibil'] ? 'checked' : ''; ?>>
                <span class="checkmark"></span>
                <span class="checkbox-label">
                    <strong>Decizie vizibilă pe site</strong>
                    <small>Debifați pentru a ascunde temporar</small>
                </span>
            </label>
        </div>

        <div class="form-meta">
            <p><strong>Creată:</strong> <?php echo format_date($decizie['created_at'], true); ?></p>
            <?php if ($decizie['updated_at']): ?>
            <p><strong>Ultima modificare:</strong> <?php echo format_date($decizie['updated_at'], true); ?></p>
            <?php endif; ?>
        </div>

        <div class="form-actions">
            <a href="view-decizii.php" class="btn btn-outline">Anulează</a>
            <button type="submit" class="btn btn-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                    <polyline points="17 21 17 13 7 13 7 21"></polyline>
                    <polyline points="7 3 7 8 15 8"></polyline>
                </svg>
                Salvează Modificările
            </button>
        </div>
    </form>
</div>

<style>
.current-file {
    margin-bottom: 16px;
    padding: 12px;
    background: #f9fafb;
    border-radius: 8px;
}

.current-doc-link {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #1e40af;
    text-decoration: none;
    font-weight: 500;
}

.current-doc-link:hover {
    text-decoration: underline;
}

.form-meta {
    background: #f9fafb;
    padding: 16px;
    border-radius: 8px;
    margin-bottom: 24px;
}

.form-meta p {
    margin: 0 0 8px 0;
    font-size: 14px;
    color: #6b7280;
}

.form-meta p:last-child {
    margin-bottom: 0;
}

.form-section {
    background: #f9fafb;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 20px;
}

.form-section h4 {
    margin: 0 0 16px 0;
    color: #374151;
}
</style>

<?php
$extra_js = <<<'JS'
<script>
document.querySelectorAll('.file-input').forEach(input => {
    input.addEventListener('change', function() {
        const fileName = this.files[0]?.name || '';
        const wrapper = this.closest('.file-upload-wrapper');
        const nameSpan = wrapper.querySelector('.file-name');
        if (fileName) {
            nameSpan.textContent = fileName;
            wrapper.classList.add('has-file');
        }
    });
});
</script>
JS;

include 'includes/footer.php';
?>
