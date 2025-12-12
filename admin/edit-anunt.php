<?php
/**
 * Editare Anunț - Primăria Pociumbăuți
 */

define('ADMIN_ACCESS', true);

session_start();

require_once 'includes/config.php';
require_once 'includes/auth.php';
require_once 'includes/csrf.php';
require_once 'includes/functions.php';
require_once 'includes/upload-handler.php';

check_authenticated();

$page_title = 'Editare Anunț';
$current_page = 'view-anunturi';
$use_editor = true;

$error = '';
$success = '';

// Verificăm ID-ul anunțului
$anunt_id = (int)($_GET['id'] ?? 0);

if (!$anunt_id) {
    header('Location: view-anunturi.php');
    exit;
}

// Obținem datele anunțului
$stmt = $pdo->prepare("SELECT * FROM anunturi WHERE id = ?");
$stmt->execute([$anunt_id]);
$anunt = $stmt->fetch();

if (!$anunt) {
    header('Location: view-anunturi.php');
    exit;
}

// Tipuri de anunțuri
$tipuri = [
    'general' => 'Anunț General',
    'licitatie' => 'Licitație Publică',
    'consultare' => 'Consultare Publică',
    'angajare' => 'Angajare Personal',
    'urgenta' => 'Urgență / Important'
];

// Procesare formular
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!validate_csrf_token($_POST['csrf_token'] ?? '')) {
        $error = 'Token de securitate invalid.';
    } else {
        $titlu = trim($_POST['titlu'] ?? '');
        $continut = $_POST['continut'] ?? '';
        $tip = $_POST['tip'] ?? 'general';
        $data_expirare = $_POST['data_expirare'] ?? null;
        $vizibil = isset($_POST['vizibil']) ? 1 : 0;
        $important = isset($_POST['important']) ? 1 : 0;

        $errors = [];

        if (empty($titlu)) {
            $errors[] = 'Titlul este obligatoriu.';
        }

        if (empty($continut)) {
            $errors[] = 'Conținutul anunțului este obligatoriu.';
        }

        // Upload imagine nouă (opțional)
        $imagine = $anunt['imagine']; // Păstrăm imaginea existentă
        if (isset($_FILES['imagine']) && $_FILES['imagine']['error'] !== UPLOAD_ERR_NO_FILE) {
            $upload_result = handle_file_upload(
                $_FILES['imagine'],
                ['jpg', 'jpeg', 'png', 'webp'],
                MAX_UPLOAD_SIZE,
                UPLOAD_DIR_ANUNTURI
            );

            if ($upload_result['success']) {
                // Ștergem imaginea veche
                if ($anunt['imagine']) {
                    $old_path = UPLOAD_DIR_ANUNTURI . $anunt['imagine'];
                    if (file_exists($old_path)) {
                        unlink($old_path);
                    }
                }
                $imagine = $upload_result['filename'];
            } else {
                $errors[] = 'Imagine: ' . $upload_result['error'];
            }
        }

        // Ștergere imagine la cerere
        if (isset($_POST['sterge_imagine']) && $_POST['sterge_imagine'] === '1') {
            if ($anunt['imagine']) {
                $old_path = UPLOAD_DIR_ANUNTURI . $anunt['imagine'];
                if (file_exists($old_path)) {
                    unlink($old_path);
                }
            }
            $imagine = null;
        }

        // Upload document nou (opțional)
        $document = $anunt['document'];
        if (isset($_FILES['document']) && $_FILES['document']['error'] !== UPLOAD_ERR_NO_FILE) {
            $upload_result = handle_file_upload(
                $_FILES['document'],
                ['pdf', 'doc', 'docx'],
                MAX_UPLOAD_SIZE,
                UPLOAD_DIR_ANUNTURI
            );

            if ($upload_result['success']) {
                // Ștergem documentul vechi
                if ($anunt['document']) {
                    $old_path = UPLOAD_DIR_ANUNTURI . $anunt['document'];
                    if (file_exists($old_path)) {
                        unlink($old_path);
                    }
                }
                $document = $upload_result['filename'];
            } else {
                $errors[] = 'Document: ' . $upload_result['error'];
            }
        }

        // Ștergere document la cerere
        if (isset($_POST['sterge_document']) && $_POST['sterge_document'] === '1') {
            if ($anunt['document']) {
                $old_path = UPLOAD_DIR_ANUNTURI . $anunt['document'];
                if (file_exists($old_path)) {
                    unlink($old_path);
                }
            }
            $document = null;
        }

        if (empty($errors)) {
            try {
                $stmt = $pdo->prepare("
                    UPDATE anunturi SET
                        titlu = ?,
                        continut = ?,
                        tip = ?,
                        imagine = ?,
                        document = ?,
                        data_expirare = ?,
                        vizibil = ?,
                        important = ?,
                        updated_at = CURRENT_TIMESTAMP
                    WHERE id = ?
                ");

                $stmt->execute([
                    $titlu,
                    $continut,
                    $tip,
                    $imagine,
                    $document,
                    $data_expirare ?: null,
                    $vizibil,
                    $important,
                    $anunt_id
                ]);

                log_action($pdo, $_SESSION['user_id'], 'update_anunt', 'anunturi', $anunt_id, [
                    'titlu' => $titlu
                ]);

                $success = 'Anunțul a fost actualizat cu succes!';

                // Reîncărcăm datele
                $stmt = $pdo->prepare("SELECT * FROM anunturi WHERE id = ?");
                $stmt->execute([$anunt_id]);
                $anunt = $stmt->fetch();

            } catch (PDOException $e) {
                error_log('Eroare actualizare anunț: ' . $e->getMessage());
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
        <h2>Editare Anunț</h2>
        <p>Modificați datele anunțului #<?php echo $anunt_id; ?></p>
    </div>
    <div class="page-header-actions">
        <a href="view-anunturi.php" class="btn btn-outline">
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

        <div class="form-row form-row-2">
            <div class="form-group">
                <label for="titlu">Titlu Anunț <span class="required">*</span></label>
                <input
                    type="text"
                    id="titlu"
                    name="titlu"
                    required
                    maxlength="255"
                    value="<?php echo e($anunt['titlu']); ?>"
                >
            </div>

            <div class="form-group">
                <label for="tip">Tipul Anunțului <span class="required">*</span></label>
                <select id="tip" name="tip" required>
                    <?php foreach ($tipuri as $value => $label): ?>
                    <option value="<?php echo $value; ?>" <?php echo $anunt['tip'] === $value ? 'selected' : ''; ?>>
                        <?php echo e($label); ?>
                    </option>
                    <?php endforeach; ?>
                </select>
            </div>
        </div>

        <div class="form-group">
            <label for="continut">Conținut Anunț <span class="required">*</span></label>
            <textarea
                id="continut"
                name="continut"
                rows="12"
                class="tinymce-editor"
            ><?php echo e($anunt['continut']); ?></textarea>
        </div>

        <div class="form-row form-row-2">
            <div class="form-group">
                <label for="imagine">Imagine Reprezentativă</label>
                <?php if ($anunt['imagine']): ?>
                <div class="current-file">
                    <img src="../uploads/anunturi/<?php echo e($anunt['imagine']); ?>" alt="Imagine curentă" style="max-width: 200px; border-radius: 8px; margin-bottom: 12px;">
                    <div>
                        <label class="checkbox-inline">
                            <input type="checkbox" name="sterge_imagine" value="1">
                            Șterge imaginea curentă
                        </label>
                    </div>
                </div>
                <?php endif; ?>
                <div class="file-upload-wrapper">
                    <input
                        type="file"
                        id="imagine"
                        name="imagine"
                        accept="image/jpeg,image/png,image/webp"
                        class="file-input"
                    >
                    <label for="imagine" class="file-label">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <circle cx="8.5" cy="8.5" r="1.5"></circle>
                            <polyline points="21 15 16 10 5 21"></polyline>
                        </svg>
                        <span><?php echo $anunt['imagine'] ? 'Înlocuiește imaginea' : 'Alegeți o imagine'; ?></span>
                    </label>
                    <span class="file-name"></span>
                </div>
                <span class="form-hint">Formate: JPG, PNG, WebP. Max 10 MB.</span>
            </div>

            <div class="form-group">
                <label for="document">Document Atașat</label>
                <?php if ($anunt['document']): ?>
                <div class="current-file">
                    <a href="../uploads/anunturi/<?php echo e($anunt['document']); ?>" target="_blank" class="current-doc-link">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                        </svg>
                        <?php echo e($anunt['document']); ?>
                    </a>
                    <div style="margin-top: 8px;">
                        <label class="checkbox-inline">
                            <input type="checkbox" name="sterge_document" value="1">
                            Șterge documentul curent
                        </label>
                    </div>
                </div>
                <?php endif; ?>
                <div class="file-upload-wrapper">
                    <input
                        type="file"
                        id="document"
                        name="document"
                        accept=".pdf,.doc,.docx"
                        class="file-input"
                    >
                    <label for="document" class="file-label">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                        </svg>
                        <span><?php echo $anunt['document'] ? 'Înlocuiește documentul' : 'Alegeți un document'; ?></span>
                    </label>
                    <span class="file-name"></span>
                </div>
                <span class="form-hint">Formate: PDF, DOC, DOCX. Max 10 MB.</span>
            </div>
        </div>

        <div class="form-group">
            <label for="data_expirare">Data Expirării (opțional)</label>
            <input
                type="date"
                id="data_expirare"
                name="data_expirare"
                value="<?php echo e($anunt['data_expirare'] ?? ''); ?>"
            >
            <span class="form-hint">După această dată, anunțul va fi ascuns automat.</span>
        </div>

        <div class="form-group">
            <div class="checkbox-group">
                <label class="checkbox-wrapper">
                    <input type="checkbox" name="vizibil" value="1" <?php echo $anunt['vizibil'] ? 'checked' : ''; ?>>
                    <span class="checkmark"></span>
                    <span class="checkbox-label">
                        <strong>Anunț vizibil pe site</strong>
                        <small>Debifați pentru a ascunde temporar anunțul</small>
                    </span>
                </label>

                <label class="checkbox-wrapper">
                    <input type="checkbox" name="important" value="1" <?php echo $anunt['important'] ? 'checked' : ''; ?>>
                    <span class="checkmark"></span>
                    <span class="checkbox-label">
                        <strong>Marchează ca IMPORTANT</strong>
                        <small>Va fi afișat cu evidențiere specială</small>
                    </span>
                </label>
            </div>
        </div>

        <div class="form-meta">
            <p><strong>Creat:</strong> <?php echo format_date($anunt['created_at'], true); ?></p>
            <p><strong>Ultima modificare:</strong> <?php echo format_date($anunt['updated_at'] ?? $anunt['created_at'], true); ?></p>
            <p><strong>Vizualizări:</strong> <?php echo number_format($anunt['vizualizari']); ?></p>
        </div>

        <div class="form-actions">
            <a href="view-anunturi.php" class="btn btn-outline">Anulează</a>
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

.checkbox-inline {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    cursor: pointer;
}

.checkbox-group {
    display: flex;
    flex-direction: column;
    gap: 12px;
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
// TinyMCE initialization
if (typeof tinymce !== 'undefined') {
    tinymce.init({
        selector: '.tinymce-editor',
        height: 400,
        language: 'ro',
        plugins: 'lists link image table code help wordcount',
        toolbar: 'undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist | link | removeformat',
        menubar: false,
        branding: false,
        content_style: 'body { font-family: Inter, sans-serif; font-size: 14px; }'
    });
}

// File input preview
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
