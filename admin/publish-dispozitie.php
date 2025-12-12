<?php
/**
 * Publicare Dispoziție Primar - Primăria Pociumbăuți
 */

define('ADMIN_ACCESS', true);

session_start();

require_once 'includes/config.php';
require_once 'includes/auth.php';
require_once 'includes/csrf.php';
require_once 'includes/functions.php';
require_once 'includes/upload-handler.php';

check_authenticated();

$page_title = 'Publică Dispoziție';
$current_page = 'publish-dispozitie';

$error = '';
$success = '';

$tipuri = [
    'normativ' => 'Normativ (interes public)',
    'personal' => 'Personal (angajări, concedii, etc.)'
];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!validate_csrf_token($_POST['csrf_token'] ?? '')) {
        $error = 'Token de securitate invalid.';
    } else {
        $numar = trim($_POST['numar'] ?? '');
        $data_emitere = $_POST['data_emitere'] ?? '';
        $titlu = trim($_POST['titlu'] ?? '');
        $descriere = trim($_POST['descriere'] ?? '');
        $tip = $_POST['tip'] ?? 'normativ';
        $depersonalizat = isset($_POST['depersonalizat']) ? 1 : 0;
        $publicat_rsal = isset($_POST['publicat_rsal']) ? 1 : 0;
        $link_rsal = trim($_POST['link_rsal'] ?? '');

        $errors = [];

        if (empty($numar)) $errors[] = 'Numărul dispoziției este obligatoriu.';
        if (empty($data_emitere)) $errors[] = 'Data emiterii este obligatorie.';
        if (empty($titlu)) $errors[] = 'Titlul este obligatoriu.';

        // Verifică unicitate
        $stmt = $pdo->prepare("SELECT id FROM dispozitii WHERE numar = ?");
        $stmt->execute([$numar]);
        if ($stmt->fetch()) {
            $errors[] = 'Există deja o dispoziție cu acest număr.';
        }

        // Upload PDF
        $document_pdf = null;
        if (!isset($_FILES['document_pdf']) || $_FILES['document_pdf']['error'] === UPLOAD_ERR_NO_FILE) {
            $errors[] = 'Documentul PDF este obligatoriu.';
        } else {
            $upload_result = handle_file_upload(
                $_FILES['document_pdf'],
                ['pdf'],
                MAX_UPLOAD_SIZE,
                UPLOAD_DIR_DISPOZITII
            );

            if ($upload_result['success']) {
                $document_pdf = $upload_result['filename'];
            } else {
                $errors[] = 'PDF: ' . $upload_result['error'];
            }
        }

        if (empty($errors)) {
            try {
                $stmt = $pdo->prepare("
                    INSERT INTO dispozitii
                    (numar, data_emitere, titlu, descriere, tip, document_pdf, depersonalizat, publicat_rsal, link_rsal, vizibil, created_by)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
                ");

                $stmt->execute([
                    $numar,
                    $data_emitere,
                    $titlu,
                    $descriere,
                    $tip,
                    $document_pdf,
                    $depersonalizat,
                    $publicat_rsal,
                    $link_rsal ?: null,
                    $_SESSION['user_id']
                ]);

                $dispozitie_id = $pdo->lastInsertId();

                log_action($pdo, $_SESSION['user_id'], 'create_dispozitie', 'dispozitii', $dispozitie_id, [
                    'numar' => $numar,
                    'titlu' => $titlu
                ]);

                $success = 'Dispoziția a fost publicată cu succes!';
                $numar = $titlu = $descriere = $link_rsal = '';

            } catch (PDOException $e) {
                error_log('Eroare creare dispoziție: ' . $e->getMessage());
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
        <h2>Publică Dispoziție a Primarului</h2>
        <p>Dispozițiile cu caracter normativ trebuie publicate conform HG 728/2023.</p>
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
                    placeholder="Ex: 45/2024"
                    value="<?php echo e($numar ?? ''); ?>"
                >
            </div>

            <div class="form-group">
                <label for="data_emitere">Data Emiterii <span class="required">*</span></label>
                <input
                    type="date"
                    id="data_emitere"
                    name="data_emitere"
                    required
                    value="<?php echo e($data_emitere ?? date('Y-m-d')); ?>"
                >
            </div>

            <div class="form-group">
                <label for="tip">Tipul Dispoziției <span class="required">*</span></label>
                <select id="tip" name="tip" required>
                    <?php foreach ($tipuri as $value => $label): ?>
                    <option value="<?php echo $value; ?>" <?php echo ($tip ?? 'normativ') === $value ? 'selected' : ''; ?>>
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
                placeholder="Ex: Cu privire la aprobarea graficului de lucru pentru sărbătorile de iarnă"
                value="<?php echo e($titlu ?? ''); ?>"
            >
        </div>

        <div class="form-group">
            <label for="descriere">Descriere / Rezumat</label>
            <textarea
                id="descriere"
                name="descriere"
                rows="4"
                placeholder="Rezumat scurt..."
            ><?php echo e($descriere ?? ''); ?></textarea>
        </div>

        <div class="form-group">
            <label for="document_pdf">Document PDF <span class="required">*</span></label>
            <div class="file-upload-wrapper">
                <input type="file" id="document_pdf" name="document_pdf" accept=".pdf" required class="file-input">
                <label for="document_pdf" class="file-label">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                    <span>Alegeți fișier PDF</span>
                </label>
                <span class="file-name"></span>
            </div>
        </div>

        <div class="form-section">
            <h4>Opțiuni GDPR și RSAL</h4>

            <div class="form-group">
                <label class="checkbox-wrapper">
                    <input type="checkbox" name="depersonalizat" value="1" <?php echo ($depersonalizat ?? 0) ? 'checked' : ''; ?>>
                    <span class="checkmark"></span>
                    <span class="checkbox-label">
                        <strong>Document depersonalizat</strong>
                        <small>Datele personale au fost eliminate conform GDPR</small>
                    </span>
                </label>
            </div>

            <div class="form-group">
                <label class="checkbox-wrapper">
                    <input type="checkbox" name="publicat_rsal" value="1" <?php echo ($publicat_rsal ?? 0) ? 'checked' : ''; ?>>
                    <span class="checkmark"></span>
                    <span class="checkbox-label">
                        <strong>Publicat în RSAL</strong>
                        <small>Dispoziția a fost publicată în Registrul de Stat</small>
                    </span>
                </label>
            </div>

            <div class="form-group">
                <label for="link_rsal">Link RSAL (opțional)</label>
                <input type="url" id="link_rsal" name="link_rsal" placeholder="https://actelocale.gov.md/..." value="<?php echo e($link_rsal ?? ''); ?>">
            </div>
        </div>

        <div class="form-actions">
            <a href="view-dispozitii.php" class="btn btn-outline">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                Înapoi
            </a>

            <button type="submit" class="btn btn-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Publică Dispoziția
            </button>
        </div>
    </form>
</div>

<div class="info-card info-card-warning">
    <div class="info-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
    </div>
    <div class="info-content">
        <h4>Important: Protecția Datelor Personale</h4>
        <p>Dispozițiile cu <strong>caracter personal</strong> (angajări, concedii, sancțiuni) trebuie <strong>depersonalizate</strong> înainte de publicare. Eliminați numele, CNP-ul și alte date care identifică persoanele.</p>
    </div>
</div>

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
