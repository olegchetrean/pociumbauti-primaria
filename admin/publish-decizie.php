<?php
/**
 * Publicare Decizie Consiliu Local - Primăria Pociumbăuți
 */

define('ADMIN_ACCESS', true);

session_start();

require_once 'includes/config.php';
require_once 'includes/auth.php';
require_once 'includes/csrf.php';
require_once 'includes/functions.php';
require_once 'includes/upload-handler.php';

check_authenticated();

$page_title = 'Publică Decizie';
$current_page = 'publish-decizie';

$error = '';
$success = '';

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

        // Verifică dacă numărul există deja
        $stmt = $pdo->prepare("SELECT id FROM decizii WHERE numar = ?");
        $stmt->execute([$numar]);
        if ($stmt->fetch()) {
            $errors[] = 'Există deja o decizie cu acest număr.';
        }

        // Upload PDF obligatoriu
        $document_pdf = null;
        if (!isset($_FILES['document_pdf']) || $_FILES['document_pdf']['error'] === UPLOAD_ERR_NO_FILE) {
            $errors[] = 'Documentul PDF este obligatoriu.';
        } else {
            $upload_result = handle_file_upload(
                $_FILES['document_pdf'],
                ['pdf'],
                MAX_UPLOAD_SIZE,
                UPLOAD_DIR_DECIZII
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
                    INSERT INTO decizii
                    (numar, data_emitere, titlu, descriere, tip, document_pdf, publicat_rsal, link_rsal, vizibil, created_by)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
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
                    $_SESSION['user_id']
                ]);

                $decizie_id = $pdo->lastInsertId();

                log_action($pdo, $_SESSION['user_id'], 'create_decizie', 'decizii', $decizie_id, [
                    'numar' => $numar,
                    'titlu' => $titlu
                ]);

                $success = 'Decizia a fost publicată cu succes!';

                // Reset form
                $numar = $titlu = $descriere = $link_rsal = '';

            } catch (PDOException $e) {
                error_log('Eroare creare decizie: ' . $e->getMessage());
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
        <h2>Publică Decizie a Consiliului Local</h2>
        <p>Conform HG 728/2023, toate deciziile trebuie publicate în termen de 10 zile.</p>
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
                    placeholder="Ex: 24/2024"
                    value="<?php echo e($numar ?? ''); ?>"
                >
                <span class="form-hint">Format: număr/an</span>
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
                <label for="tip">Tipul Deciziei <span class="required">*</span></label>
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
            <label for="titlu">Titlu Decizie <span class="required">*</span></label>
            <input
                type="text"
                id="titlu"
                name="titlu"
                required
                maxlength="255"
                placeholder="Ex: Cu privire la aprobarea bugetului local pentru anul 2025"
                value="<?php echo e($titlu ?? ''); ?>"
            >
        </div>

        <div class="form-group">
            <label for="descriere">Descriere / Rezumat</label>
            <textarea
                id="descriere"
                name="descriere"
                rows="4"
                placeholder="Rezumat scurt al conținutului deciziei..."
            ><?php echo e($descriere ?? ''); ?></textarea>
        </div>

        <div class="form-group">
            <label for="document_pdf">Document PDF <span class="required">*</span></label>
            <div class="file-upload-wrapper">
                <input
                    type="file"
                    id="document_pdf"
                    name="document_pdf"
                    accept=".pdf"
                    required
                    class="file-input"
                >
                <label for="document_pdf" class="file-label">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                    <span>Alegeți fișier PDF</span>
                </label>
                <span class="file-name"></span>
            </div>
            <span class="form-hint">Obligatoriu. Format: PDF. Mărime maximă: 10 MB</span>
        </div>

        <div class="form-section">
            <h4>Publicare RSAL (Registrul de Stat al Actelor Locale)</h4>

            <div class="form-group">
                <label class="checkbox-wrapper">
                    <input type="checkbox" name="publicat_rsal" value="1" <?php echo ($publicat_rsal ?? 0) ? 'checked' : ''; ?>>
                    <span class="checkmark"></span>
                    <span class="checkbox-label">
                        <strong>Decizia a fost publicată în RSAL</strong>
                        <small>Conform legii, deciziile normative trebuie publicate în RSAL</small>
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
                    value="<?php echo e($link_rsal ?? ''); ?>"
                >
                <span class="form-hint">Link-ul către decizie pe portalul actelocale.gov.md</span>
            </div>
        </div>

        <div class="form-actions">
            <a href="view-decizii.php" class="btn btn-outline">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                Înapoi la Listă
            </a>

            <button type="submit" class="btn btn-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Publică Decizia
            </button>
        </div>
    </form>
</div>

<div class="info-card">
    <div class="info-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
    </div>
    <div class="info-content">
        <h4>Despre publicarea deciziilor</h4>
        <p>Conform <strong>HG 728/2023</strong>, toate deciziile Consiliului Local trebuie publicate pe site-ul oficial în termen de <strong>10 zile</strong> de la adoptare.</p>
        <p>Deciziile de tip <strong>normativ</strong> trebuie de asemenea publicate în Registrul de Stat al Actelor Locale (RSAL) pe <a href="https://actelocale.gov.md" target="_blank">actelocale.gov.md</a>.</p>
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
