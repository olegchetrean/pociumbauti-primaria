<?php
/**
 * Editare Dispoziție - Primăria Pociumbăuți
 */

define('ADMIN_ACCESS', true);

session_start();

require_once 'includes/config.php';
require_once 'includes/auth.php';
require_once 'includes/csrf.php';
require_once 'includes/functions.php';
require_once 'includes/upload-handler.php';

check_authenticated();

$page_title = 'Editare Dispoziție';
$current_page = 'view-dispozitii';

$error = '';
$success = '';

// Verificăm ID-ul
$dispozitie_id = (int)($_GET['id'] ?? 0);

if (!$dispozitie_id) {
    header('Location: view-dispozitii.php');
    exit;
}

// Obținem datele
$stmt = $pdo->prepare("SELECT * FROM dispozitii WHERE id = ?");
$stmt->execute([$dispozitie_id]);
$dispozitie = $stmt->fetch();

if (!$dispozitie) {
    header('Location: view-dispozitii.php');
    exit;
}

// Categorii
$categorii = [
    'administrativ' => 'Administrativ',
    'resurse_umane' => 'Resurse Umane',
    'financiar' => 'Financiar',
    'urbanism' => 'Urbanism',
    'social' => 'Asistență Socială',
    'altele' => 'Altele'
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
        $categorie = $_POST['categorie'] ?? 'administrativ';
        $vizibil = isset($_POST['vizibil']) ? 1 : 0;

        $errors = [];

        if (empty($numar)) {
            $errors[] = 'Numărul dispoziției este obligatoriu.';
        }

        if (empty($data_emitere)) {
            $errors[] = 'Data emiterii este obligatorie.';
        }

        if (empty($titlu)) {
            $errors[] = 'Titlul este obligatoriu.';
        }

        // Verifică duplicat
        $stmt = $pdo->prepare("SELECT id FROM dispozitii WHERE numar = ? AND id != ?");
        $stmt->execute([$numar, $dispozitie_id]);
        if ($stmt->fetch()) {
            $errors[] = 'Există deja o dispoziție cu acest număr.';
        }

        // Upload PDF nou
        $document_pdf = $dispozitie['document_pdf'];
        if (isset($_FILES['document_pdf']) && $_FILES['document_pdf']['error'] !== UPLOAD_ERR_NO_FILE) {
            $upload_result = handle_file_upload(
                $_FILES['document_pdf'],
                ['pdf'],
                MAX_UPLOAD_SIZE,
                UPLOAD_DIR_DISPOZITII
            );

            if ($upload_result['success']) {
                if ($dispozitie['document_pdf']) {
                    $old_path = UPLOAD_DIR_DISPOZITII . $dispozitie['document_pdf'];
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
                    UPDATE dispozitii SET
                        numar = ?,
                        data_emitere = ?,
                        titlu = ?,
                        descriere = ?,
                        categorie = ?,
                        document_pdf = ?,
                        vizibil = ?,
                        updated_at = CURRENT_TIMESTAMP
                    WHERE id = ?
                ");

                $stmt->execute([
                    $numar,
                    $data_emitere,
                    $titlu,
                    $descriere,
                    $categorie,
                    $document_pdf,
                    $vizibil,
                    $dispozitie_id
                ]);

                log_action($pdo, $_SESSION['user_id'], 'update_dispozitie', 'dispozitii', $dispozitie_id, [
                    'numar' => $numar,
                    'titlu' => $titlu
                ]);

                $success = 'Dispoziția a fost actualizată cu succes!';

                // Reîncărcăm
                $stmt = $pdo->prepare("SELECT * FROM dispozitii WHERE id = ?");
                $stmt->execute([$dispozitie_id]);
                $dispozitie = $stmt->fetch();

            } catch (PDOException $e) {
                error_log('Eroare actualizare dispoziție: ' . $e->getMessage());
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
        <h2>Editare Dispoziție</h2>
        <p>Modificați datele dispoziției Nr. <?php echo e($dispozitie['numar']); ?></p>
    </div>
    <div class="page-header-actions">
        <a href="view-dispozitii.php" class="btn btn-outline">
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
                <label for="numar">Număr Dispoziție <span class="required">*</span></label>
                <input
                    type="text"
                    id="numar"
                    name="numar"
                    required
                    value="<?php echo e($dispozitie['numar']); ?>"
                >
            </div>

            <div class="form-group">
                <label for="data_emitere">Data Emiterii <span class="required">*</span></label>
                <input
                    type="date"
                    id="data_emitere"
                    name="data_emitere"
                    required
                    value="<?php echo e($dispozitie['data_emitere']); ?>"
                >
            </div>

            <div class="form-group">
                <label for="categorie">Categorie <span class="required">*</span></label>
                <select id="categorie" name="categorie" required>
                    <?php foreach ($categorii as $value => $label): ?>
                    <option value="<?php echo $value; ?>" <?php echo $dispozitie['categorie'] === $value ? 'selected' : ''; ?>>
                        <?php echo e($label); ?>
                    </option>
                    <?php endforeach; ?>
                </select>
            </div>
        </div>

        <div class="form-group">
            <label for="titlu">Titlu Dispoziție <span class="required">*</span></label>
            <input
                type="text"
                id="titlu"
                name="titlu"
                required
                maxlength="255"
                value="<?php echo e($dispozitie['titlu']); ?>"
            >
        </div>

        <div class="form-group">
            <label for="descriere">Descriere / Rezumat</label>
            <textarea
                id="descriere"
                name="descriere"
                rows="4"
            ><?php echo e($dispozitie['descriere']); ?></textarea>
        </div>

        <div class="form-group">
            <label for="document_pdf">Document PDF</label>
            <?php if ($dispozitie['document_pdf']): ?>
            <div class="current-file">
                <a href="../uploads/dispozitii/<?php echo e($dispozitie['document_pdf']); ?>" target="_blank" class="current-doc-link">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                    <?php echo e($dispozitie['document_pdf']); ?>
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
                    <span><?php echo $dispozitie['document_pdf'] ? 'Înlocuiește PDF-ul' : 'Alegeți fișier PDF'; ?></span>
                </label>
                <span class="file-name"></span>
            </div>
            <span class="form-hint">Format: PDF. Mărime maximă: 10 MB</span>
        </div>

        <div class="form-group">
            <label class="checkbox-wrapper">
                <input type="checkbox" name="vizibil" value="1" <?php echo $dispozitie['vizibil'] ? 'checked' : ''; ?>>
                <span class="checkmark"></span>
                <span class="checkbox-label">
                    <strong>Dispoziție vizibilă pe site</strong>
                    <small>Debifați pentru a ascunde temporar</small>
                </span>
            </label>
        </div>

        <div class="form-meta">
            <p><strong>Creată:</strong> <?php echo format_date($dispozitie['created_at'], true); ?></p>
            <?php if ($dispozitie['updated_at']): ?>
            <p><strong>Ultima modificare:</strong> <?php echo format_date($dispozitie['updated_at'], true); ?></p>
            <?php endif; ?>
        </div>

        <div class="form-actions">
            <a href="view-dispozitii.php" class="btn btn-outline">Anulează</a>
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
