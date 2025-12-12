<?php
/**
 * Încărcare Fotografii - Primăria Pociumbăuți
 */

define('ADMIN_ACCESS', true);

session_start();

require_once 'includes/config.php';
require_once 'includes/auth.php';
require_once 'includes/csrf.php';
require_once 'includes/functions.php';
require_once 'includes/upload-handler.php';

check_authenticated();

$page_title = 'Încarcă Fotografii';
$current_page = 'upload-photos';

$error = '';
$success = '';

// Categorii de fotografii
$categorii = [
    'generale' => 'Imagini Generale',
    'evenimente' => 'Evenimente',
    'infrastructura' => 'Infrastructură',
    'natura' => 'Natură și Peisaje',
    'cultura' => 'Cultură și Tradiții',
    'institutii' => 'Instituții Publice',
    'proiecte' => 'Proiecte în Derulare'
];

// Procesare formular
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!validate_csrf_token($_POST['csrf_token'] ?? '')) {
        $error = 'Token de securitate invalid.';
    } else {
        $titlu = trim($_POST['titlu'] ?? '');
        $descriere = trim($_POST['descriere'] ?? '');
        $categorie = $_POST['categorie'] ?? 'generale';
        $data_fotografiere = $_POST['data_fotografiere'] ?? null;
        $autor = trim($_POST['autor'] ?? '');

        $errors = [];

        if (empty($titlu)) {
            $errors[] = 'Titlul este obligatoriu.';
        }

        // Verifică dacă există fișiere încărcate
        if (!isset($_FILES['fotografii']) || empty($_FILES['fotografii']['name'][0])) {
            $errors[] = 'Trebuie să selectați cel puțin o fotografie.';
        }

        if (empty($errors)) {
            $uploaded_count = 0;
            $upload_errors = [];

            // Procesăm fiecare fișier
            $files = $_FILES['fotografii'];
            $file_count = count($files['name']);

            for ($i = 0; $i < $file_count; $i++) {
                if ($files['error'][$i] === UPLOAD_ERR_OK) {
                    // Construim array-ul pentru un singur fișier
                    $single_file = [
                        'name' => $files['name'][$i],
                        'type' => $files['type'][$i],
                        'tmp_name' => $files['tmp_name'][$i],
                        'error' => $files['error'][$i],
                        'size' => $files['size'][$i]
                    ];

                    $upload_result = handle_file_upload(
                        $single_file,
                        ['jpg', 'jpeg', 'png', 'webp'],
                        MAX_UPLOAD_SIZE,
                        UPLOAD_DIR_PHOTOS
                    );

                    if ($upload_result['success']) {
                        try {
                            // Obținem dimensiunile imaginii
                            $image_path = UPLOAD_DIR_PHOTOS . $upload_result['filename'];
                            $image_info = @getimagesize($image_path);
                            $latime = $image_info[0] ?? null;
                            $inaltime = $image_info[1] ?? null;

                            // Generăm thumbnail
                            $thumbnail = generate_thumbnail($image_path, UPLOAD_DIR_PHOTOS . 'thumbs/');

                            $stmt = $pdo->prepare("
                                INSERT INTO fotografii
                                (titlu, descriere, fisier, thumbnail, categorie, data_fotografiere, autor, latime, inaltime, marime, uploaded_by)
                                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                            ");

                            $foto_titlu = $file_count > 1 ? $titlu . ' (' . ($i + 1) . ')' : $titlu;

                            $stmt->execute([
                                $foto_titlu,
                                $descriere,
                                $upload_result['filename'],
                                $thumbnail,
                                $categorie,
                                $data_fotografiere ?: null,
                                $autor ?: null,
                                $latime,
                                $inaltime,
                                $files['size'][$i],
                                $_SESSION['user_id']
                            ]);

                            $foto_id = $pdo->lastInsertId();

                            log_action($pdo, $_SESSION['user_id'], 'upload_photo', 'fotografii', $foto_id, [
                                'titlu' => $foto_titlu,
                                'fisier' => $upload_result['filename']
                            ]);

                            $uploaded_count++;

                        } catch (PDOException $e) {
                            error_log('Eroare salvare fotografie: ' . $e->getMessage());
                            $upload_errors[] = $files['name'][$i] . ': Eroare la salvare în baza de date.';
                        }
                    } else {
                        $upload_errors[] = $files['name'][$i] . ': ' . $upload_result['error'];
                    }
                } elseif ($files['error'][$i] !== UPLOAD_ERR_NO_FILE) {
                    $upload_errors[] = $files['name'][$i] . ': Eroare la încărcare (cod ' . $files['error'][$i] . ').';
                }
            }

            if ($uploaded_count > 0) {
                $success = $uploaded_count . ' fotografie/fotografii încărcate cu succes!';
                // Reset form
                $titlu = $descriere = $autor = '';
            }

            if (!empty($upload_errors)) {
                $error = implode('<br>', $upload_errors);
            }
        } else {
            $error = implode('<br>', $errors);
        }
    }
}

/**
 * Generează thumbnail pentru o imagine
 */
function generate_thumbnail(string $source_path, string $thumb_dir, int $max_width = 300, int $max_height = 300): ?string
{
    if (!file_exists($thumb_dir)) {
        mkdir($thumb_dir, 0755, true);
    }

    $image_info = @getimagesize($source_path);
    if (!$image_info) {
        return null;
    }

    $mime = $image_info['mime'];
    $width = $image_info[0];
    $height = $image_info[1];

    // Calculăm dimensiunile thumbnail-ului
    $ratio = min($max_width / $width, $max_height / $height);
    $new_width = (int)($width * $ratio);
    $new_height = (int)($height * $ratio);

    // Creăm imaginea sursă
    switch ($mime) {
        case 'image/jpeg':
            $source = @imagecreatefromjpeg($source_path);
            break;
        case 'image/png':
            $source = @imagecreatefrompng($source_path);
            break;
        case 'image/webp':
            $source = @imagecreatefromwebp($source_path);
            break;
        default:
            return null;
    }

    if (!$source) {
        return null;
    }

    // Creăm thumbnail-ul
    $thumb = imagecreatetruecolor($new_width, $new_height);

    // Păstrăm transparența pentru PNG
    if ($mime === 'image/png') {
        imagealphablending($thumb, false);
        imagesavealpha($thumb, true);
    }

    imagecopyresampled($thumb, $source, 0, 0, 0, 0, $new_width, $new_height, $width, $height);

    // Salvăm thumbnail-ul
    $thumb_filename = 'thumb_' . basename($source_path);
    $thumb_path = $thumb_dir . $thumb_filename;

    switch ($mime) {
        case 'image/jpeg':
            imagejpeg($thumb, $thumb_path, 85);
            break;
        case 'image/png':
            imagepng($thumb, $thumb_path, 8);
            break;
        case 'image/webp':
            imagewebp($thumb, $thumb_path, 85);
            break;
    }

    imagedestroy($source);
    imagedestroy($thumb);

    return $thumb_filename;
}

$csrf_token = generate_csrf_token();
include 'includes/header.php';
?>

<div class="page-header">
    <div class="page-header-content">
        <h2>Încarcă Fotografii</h2>
        <p>Adaugă imagini în galeria foto a site-ului primăriei</p>
    </div>
</div>

<?php if ($error): echo error_message($error); endif; ?>
<?php if ($success): echo success_message($success); endif; ?>

<div class="content-card">
    <form method="POST" action="" enctype="multipart/form-data" class="admin-form" id="uploadForm">
        <input type="hidden" name="csrf_token" value="<?php echo e($csrf_token); ?>">

        <div class="form-row form-row-2">
            <div class="form-group">
                <label for="titlu">Titlu / Denumire <span class="required">*</span></label>
                <input
                    type="text"
                    id="titlu"
                    name="titlu"
                    required
                    maxlength="255"
                    placeholder="Ex: Sărbătoarea Hramului 2024"
                    value="<?php echo e($titlu ?? ''); ?>"
                >
                <span class="form-hint">Dacă încărcați mai multe fotografii, vor fi numerotate automat</span>
            </div>

            <div class="form-group">
                <label for="categorie">Categorie <span class="required">*</span></label>
                <select id="categorie" name="categorie" required>
                    <?php foreach ($categorii as $value => $label): ?>
                    <option value="<?php echo $value; ?>" <?php echo ($categorie ?? 'generale') === $value ? 'selected' : ''; ?>>
                        <?php echo e($label); ?>
                    </option>
                    <?php endforeach; ?>
                </select>
            </div>
        </div>

        <div class="form-group">
            <label for="descriere">Descriere</label>
            <textarea
                id="descriere"
                name="descriere"
                rows="3"
                placeholder="Descriere scurtă a fotografiei sau evenimentului..."
            ><?php echo e($descriere ?? ''); ?></textarea>
        </div>

        <div class="form-row form-row-2">
            <div class="form-group">
                <label for="data_fotografiere">Data Fotografierii</label>
                <input
                    type="date"
                    id="data_fotografiere"
                    name="data_fotografiere"
                    value="<?php echo e($data_fotografiere ?? ''); ?>"
                >
            </div>

            <div class="form-group">
                <label for="autor">Autor / Fotograf</label>
                <input
                    type="text"
                    id="autor"
                    name="autor"
                    maxlength="100"
                    placeholder="Numele fotografului (opțional)"
                    value="<?php echo e($autor ?? ''); ?>"
                >
            </div>
        </div>

        <div class="form-group">
            <label for="fotografii">Fotografii <span class="required">*</span></label>
            <div class="file-upload-zone" id="dropZone">
                <input
                    type="file"
                    id="fotografii"
                    name="fotografii[]"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    required
                    class="file-input-hidden"
                >
                <div class="upload-zone-content">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                    <p class="upload-zone-text">Trageți fotografiile aici sau <span class="upload-zone-link">click pentru selectare</span></p>
                    <p class="upload-zone-hint">Formate acceptate: JPG, PNG, WebP. Maxim 10 MB per fișier.</p>
                </div>
            </div>
            <div id="filePreview" class="file-preview-grid"></div>
        </div>

        <div class="form-actions">
            <a href="view-photos.php" class="btn btn-outline">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                Înapoi la Galerie
            </a>

            <button type="submit" class="btn btn-primary" id="submitBtn">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                Încarcă Fotografiile
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
        <h4>Sfaturi pentru fotografii</h4>
        <ul style="margin: 0; padding-left: 20px;">
            <li>Folosiți imagini de înaltă calitate (minim 1200px lățime)</li>
            <li>Evitați fotografiile cu persoane identificabile fără acordul lor</li>
            <li>Adăugați descrieri relevante pentru accesibilitate</li>
            <li>Organizați fotografiile pe categorii pentru o navigare mai ușoară</li>
        </ul>
    </div>
</div>

<style>
.file-upload-zone {
    border: 2px dashed #d1d5db;
    border-radius: 12px;
    padding: 40px 20px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s ease;
    background: #f9fafb;
}

.file-upload-zone:hover,
.file-upload-zone.drag-over {
    border-color: #3b82f6;
    background: #eff6ff;
}

.file-upload-zone svg {
    color: #9ca3af;
    margin-bottom: 16px;
}

.file-upload-zone:hover svg,
.file-upload-zone.drag-over svg {
    color: #3b82f6;
}

.file-input-hidden {
    position: absolute;
    opacity: 0;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    cursor: pointer;
}

.upload-zone-content {
    pointer-events: none;
}

.upload-zone-text {
    font-size: 16px;
    color: #374151;
    margin-bottom: 8px;
}

.upload-zone-link {
    color: #3b82f6;
    font-weight: 500;
}

.upload-zone-hint {
    font-size: 13px;
    color: #6b7280;
}

.file-preview-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 16px;
    margin-top: 16px;
}

.file-preview-item {
    position: relative;
    border-radius: 8px;
    overflow: hidden;
    background: #f3f4f6;
    aspect-ratio: 1;
}

.file-preview-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.file-preview-item .remove-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: rgba(239, 68, 68, 0.9);
    color: white;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    line-height: 1;
}

.file-preview-item .file-name {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 8px;
    background: linear-gradient(transparent, rgba(0,0,0,0.7));
    color: white;
    font-size: 11px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fotografii');
    const preview = document.getElementById('filePreview');
    const form = document.getElementById('uploadForm');

    // Drag and drop
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => dropZone.classList.add('drag-over'), false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => dropZone.classList.remove('drag-over'), false);
    });

    dropZone.addEventListener('drop', function(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        fileInput.files = files;
        updatePreview(files);
    });

    fileInput.addEventListener('change', function() {
        updatePreview(this.files);
    });

    function updatePreview(files) {
        preview.innerHTML = '';

        Array.from(files).forEach((file, index) => {
            if (!file.type.startsWith('image/')) return;

            const reader = new FileReader();
            reader.onload = function(e) {
                const item = document.createElement('div');
                item.className = 'file-preview-item';
                item.innerHTML = `
                    <img src="${e.target.result}" alt="${file.name}">
                    <span class="file-name">${file.name}</span>
                `;
                preview.appendChild(item);
            };
            reader.readAsDataURL(file);
        });
    }

    // Form submission loading state
    form.addEventListener('submit', function() {
        const btn = document.getElementById('submitBtn');
        btn.disabled = true;
        btn.innerHTML = `
            <svg class="animate-spin" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="32"></circle>
            </svg>
            Se încarcă...
        `;
    });
});
</script>

<?php include 'includes/footer.php'; ?>
