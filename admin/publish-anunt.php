<?php
/**
 * Publicare Anunț - Primăria Pociumbăuți
 */

define('ADMIN_ACCESS', true);

session_start();

require_once 'includes/config.php';
require_once 'includes/auth.php';
require_once 'includes/csrf.php';
require_once 'includes/functions.php';
require_once 'includes/upload-handler.php';

// Verifică autentificarea
check_authenticated();

// Variabile pentru template
$page_title = 'Publică Anunț';
$current_page = 'publish-anunt';
$use_editor = true;

$error = '';
$success = '';

// Categorii disponibile
$categorii = [
    'general' => 'General',
    'sedinta' => 'Ședință Consiliu',
    'eveniment' => 'Eveniment',
    'info' => 'Informare Publică',
    'achizitie' => 'Achiziție Publică',
    'concurs' => 'Concurs/Angajare',
    'urgenta' => 'Urgent'
];

// Procesare formular
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Validare CSRF
    if (!validate_csrf_token($_POST['csrf_token'] ?? '')) {
        $error = 'Token de securitate invalid. Reîncărcați pagina.';
    } else {
        // Sanitizare input
        $titlu = trim($_POST['titlu'] ?? '');
        $categorie = $_POST['categorie'] ?? 'general';
        $data_publicare = $_POST['data_publicare'] ?? date('Y-m-d');
        $continut = $_POST['continut'] ?? '';
        $prioritate = isset($_POST['prioritate']) ? 1 : 0;

        // Determină acțiunea (ciornă sau publicare)
        $vizibil = ($_POST['action'] ?? '') === 'publish' ? 1 : 0;

        // Validare
        $errors = [];

        if (empty($titlu)) {
            $errors[] = 'Titlul este obligatoriu.';
        } elseif (mb_strlen($titlu) > 255) {
            $errors[] = 'Titlul nu poate depăși 255 caractere.';
        }

        if (!array_key_exists($categorie, $categorii)) {
            $errors[] = 'Categorie invalidă.';
        }

        if (empty($continut)) {
            $errors[] = 'Conținutul este obligatoriu.';
        }

        // Validare dată
        $data_obj = DateTime::createFromFormat('Y-m-d', $data_publicare);
        if (!$data_obj) {
            $errors[] = 'Data publicării este invalidă.';
        }

        // Procesare upload document
        $document_url = null;
        if (isset($_FILES['document']) && $_FILES['document']['error'] !== UPLOAD_ERR_NO_FILE) {
            $upload_result = handle_file_upload(
                $_FILES['document'],
                ALLOWED_DOC_EXTENSIONS,
                MAX_UPLOAD_SIZE,
                UPLOAD_DIR_DOCS
            );

            if ($upload_result['success']) {
                $document_url = $upload_result['filename'];
            } else {
                $errors[] = 'Document: ' . $upload_result['error'];
            }
        }

        // Procesare upload imagine
        $imagine_url = null;
        if (isset($_FILES['imagine']) && $_FILES['imagine']['error'] !== UPLOAD_ERR_NO_FILE) {
            $upload_result = handle_file_upload(
                $_FILES['imagine'],
                ALLOWED_IMG_EXTENSIONS,
                MAX_IMAGE_SIZE,
                UPLOAD_DIR_IMAGES
            );

            if ($upload_result['success']) {
                $imagine_url = $upload_result['filename'];
            } else {
                $errors[] = 'Imagine: ' . $upload_result['error'];
            }
        }

        if (empty($errors)) {
            try {
                // Generează rezumat automat
                $continut_text = strip_tags($continut);
                $continut_scurt = mb_strlen($continut_text) > 200
                    ? mb_substr($continut_text, 0, 200) . '...'
                    : $continut_text;

                // Insert în baza de date
                $stmt = $pdo->prepare("
                    INSERT INTO anunturi
                    (titlu, categorie, data_publicare, continut, continut_scurt, document_url, imagine_url, prioritate, vizibil, created_by)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ");

                $stmt->execute([
                    $titlu,
                    $categorie,
                    $data_publicare,
                    $continut,
                    $continut_scurt,
                    $document_url,
                    $imagine_url,
                    $prioritate,
                    $vizibil,
                    $_SESSION['user_id']
                ]);

                $anunt_id = $pdo->lastInsertId();

                // Log acțiunea
                log_action(
                    $pdo,
                    $_SESSION['user_id'],
                    $vizibil ? 'create_anunt_publish' : 'create_anunt_draft',
                    'anunturi',
                    $anunt_id,
                    ['titlu' => $titlu]
                );

                $success = $vizibil
                    ? 'Anunțul a fost publicat cu succes!'
                    : 'Anunțul a fost salvat ca ciornă.';

                // Resetează formularul după succes
                $titlu = $continut = '';
                $prioritate = 0;

            } catch (PDOException $e) {
                error_log('Eroare creare anunț: ' . $e->getMessage());
                $error = 'Eroare la salvarea anunțului. Încercați din nou.';
            }
        } else {
            $error = implode('<br>', $errors);
        }
    }
}

// Generează token CSRF
$csrf_token = generate_csrf_token();

// Header
include 'includes/header.php';
?>

<div class="page-header">
    <div class="page-header-content">
        <h2>Publică un Anunț Nou</h2>
        <p>Completați formularul pentru a adăuga un anunț pe site.</p>
    </div>
</div>

<?php if ($error): ?>
    <?php echo error_message($error); ?>
<?php endif; ?>

<?php if ($success): ?>
    <?php echo success_message($success); ?>
<?php endif; ?>

<div class="content-card">
    <form method="POST" action="" enctype="multipart/form-data" class="admin-form">
        <input type="hidden" name="csrf_token" value="<?php echo e($csrf_token); ?>">

        <div class="form-row">
            <div class="form-group form-group-lg">
                <label for="titlu">Titlu Anunț <span class="required">*</span></label>
                <input
                    type="text"
                    id="titlu"
                    name="titlu"
                    required
                    maxlength="255"
                    placeholder="Ex: Ședința Consiliului Local din 15 decembrie 2024"
                    value="<?php echo e($titlu ?? ''); ?>"
                >
                <span class="form-hint">Maximum 255 caractere</span>
            </div>
        </div>

        <div class="form-row form-row-2">
            <div class="form-group">
                <label for="categorie">Categorie <span class="required">*</span></label>
                <select id="categorie" name="categorie" required>
                    <?php foreach ($categorii as $value => $label): ?>
                    <option value="<?php echo $value; ?>" <?php echo ($categorie ?? '') === $value ? 'selected' : ''; ?>>
                        <?php echo e($label); ?>
                    </option>
                    <?php endforeach; ?>
                </select>
            </div>

            <div class="form-group">
                <label for="data_publicare">Data Publicării <span class="required">*</span></label>
                <input
                    type="date"
                    id="data_publicare"
                    name="data_publicare"
                    required
                    value="<?php echo e($data_publicare ?? date('Y-m-d')); ?>"
                >
            </div>
        </div>

        <div class="form-group">
            <label for="continut">Conținut Anunț <span class="required">*</span></label>
            <textarea
                id="continut"
                name="continut"
                rows="15"
                placeholder="Scrieți conținutul anunțului aici..."
            ><?php echo e($continut ?? ''); ?></textarea>
            <span class="form-hint">Folosiți editorul pentru formatare text</span>
        </div>

        <div class="form-row form-row-2">
            <div class="form-group">
                <label for="document">Atașează Document (opțional)</label>
                <div class="file-upload-wrapper">
                    <input
                        type="file"
                        id="document"
                        name="document"
                        accept=".pdf,.docx"
                        class="file-input"
                    >
                    <label for="document" class="file-label">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="17 8 12 3 7 8"></polyline>
                            <line x1="12" y1="3" x2="12" y2="15"></line>
                        </svg>
                        <span>Alegeți fișier PDF sau DOCX</span>
                    </label>
                    <span class="file-name"></span>
                </div>
                <span class="form-hint">Format: PDF sau DOCX. Mărime maximă: 10 MB</span>
            </div>

            <div class="form-group">
                <label for="imagine">Imagine Reprezentativă (opțional)</label>
                <div class="file-upload-wrapper">
                    <input
                        type="file"
                        id="imagine"
                        name="imagine"
                        accept=".jpg,.jpeg,.png"
                        class="file-input"
                    >
                    <label for="imagine" class="file-label">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <circle cx="8.5" cy="8.5" r="1.5"></circle>
                            <polyline points="21 15 16 10 5 21"></polyline>
                        </svg>
                        <span>Alegeți imagine JPG sau PNG</span>
                    </label>
                    <span class="file-name"></span>
                </div>
                <span class="form-hint">Format: JPG sau PNG. Mărime maximă: 5 MB</span>
            </div>
        </div>

        <div class="form-group">
            <label class="checkbox-wrapper">
                <input type="checkbox" name="prioritate" value="1" <?php echo ($prioritate ?? 0) ? 'checked' : ''; ?>>
                <span class="checkmark"></span>
                <span class="checkbox-label">
                    <strong>Afișează pe prima pagină</strong>
                    <small>Anunțul va apărea în secțiunea de anunțuri importante de pe pagina principală</small>
                </span>
            </label>
        </div>

        <div class="form-actions">
            <button type="submit" name="action" value="draft" class="btn btn-outline">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                    <polyline points="17 21 17 13 7 13 7 21"></polyline>
                    <polyline points="7 3 7 8 15 8"></polyline>
                </svg>
                Salvează ca Ciornă
            </button>

            <button type="submit" name="action" value="publish" class="btn btn-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Publică Acum
            </button>
        </div>
    </form>
</div>

<?php
$extra_js = <<<'JS'
<script>
// Afișează numele fișierului selectat
document.querySelectorAll('.file-input').forEach(input => {
    input.addEventListener('change', function() {
        const fileName = this.files[0]?.name || '';
        const wrapper = this.closest('.file-upload-wrapper');
        const nameSpan = wrapper.querySelector('.file-name');
        const label = wrapper.querySelector('.file-label span');

        if (fileName) {
            nameSpan.textContent = fileName;
            label.textContent = 'Fișier selectat:';
            wrapper.classList.add('has-file');
        } else {
            nameSpan.textContent = '';
            wrapper.classList.remove('has-file');
        }
    });
});
</script>
JS;

include 'includes/footer.php';
?>
