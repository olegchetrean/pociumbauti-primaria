<?php
/**
 * Handler Upload Securizat - Primăria Pociumbăuți
 *
 * Validare și procesare sigură a fișierelor încărcate
 * Protecție împotriva: file inclusion, malware upload, path traversal
 */

// Previne accesul direct
if (!defined('ADMIN_ACCESS')) {
    die('Acces interzis.');
}

/**
 * Procesează un fișier încărcat în mod securizat
 *
 * @param array $file Array-ul $_FILES pentru fișier
 * @param array $allowed_extensions Extensii permise
 * @param int $max_size Dimensiune maximă în bytes
 * @param string $upload_dir Directorul destinație
 * @return array ['success' => bool, 'filename' => string|null, 'error' => string|null, 'path' => string|null]
 */
function handle_file_upload(
    array $file,
    array $allowed_extensions,
    int $max_size,
    string $upload_dir
): array {
    // Verificări de bază
    if (!isset($file['error']) || is_array($file['error'])) {
        return ['success' => false, 'error' => 'Parametri de upload invalizi.', 'filename' => null, 'path' => null];
    }

    // Verifică codul de eroare upload
    switch ($file['error']) {
        case UPLOAD_ERR_OK:
            break;
        case UPLOAD_ERR_INI_SIZE:
        case UPLOAD_ERR_FORM_SIZE:
            return ['success' => false, 'error' => 'Fișierul depășește dimensiunea maximă permisă.', 'filename' => null, 'path' => null];
        case UPLOAD_ERR_PARTIAL:
            return ['success' => false, 'error' => 'Fișierul a fost încărcat parțial. Încercați din nou.', 'filename' => null, 'path' => null];
        case UPLOAD_ERR_NO_FILE:
            return ['success' => false, 'error' => 'Niciun fișier selectat.', 'filename' => null, 'path' => null];
        case UPLOAD_ERR_NO_TMP_DIR:
        case UPLOAD_ERR_CANT_WRITE:
        case UPLOAD_ERR_EXTENSION:
            return ['success' => false, 'error' => 'Eroare server la încărcarea fișierului.', 'filename' => null, 'path' => null];
        default:
            return ['success' => false, 'error' => 'Eroare necunoscută la încărcare.', 'filename' => null, 'path' => null];
    }

    // Verifică dimensiunea fișierului
    if ($file['size'] > $max_size) {
        $max_mb = round($max_size / 1024 / 1024, 1);
        return ['success' => false, 'error' => "Fișierul este prea mare. Dimensiunea maximă: {$max_mb} MB.", 'filename' => null, 'path' => null];
    }

    // Verifică că fișierul există și este valid
    if (!is_uploaded_file($file['tmp_name'])) {
        return ['success' => false, 'error' => 'Fișier invalid sau suspect.', 'filename' => null, 'path' => null];
    }

    // Extrage și validează extensia
    $original_name = $file['name'];
    $file_ext = strtolower(pathinfo($original_name, PATHINFO_EXTENSION));

    if (!in_array($file_ext, $allowed_extensions)) {
        $allowed_str = implode(', ', array_map('strtoupper', $allowed_extensions));
        return ['success' => false, 'error' => "Tip fișier nepermis. Extensii acceptate: {$allowed_str}.", 'filename' => null, 'path' => null];
    }

    // Validează MIME type (securitate suplimentară)
    $mime_type = get_mime_type($file['tmp_name']);
    $allowed_mimes = get_allowed_mimes($file_ext);

    if (!in_array($mime_type, $allowed_mimes)) {
        return ['success' => false, 'error' => 'Tipul fișierului nu corespunde extensiei. Fișier posibil corupt sau suspect.', 'filename' => null, 'path' => null];
    }

    // Pentru imagini: verifică că este o imagine validă
    if (in_array($file_ext, ['jpg', 'jpeg', 'png', 'gif'])) {
        $image_info = @getimagesize($file['tmp_name']);
        if ($image_info === false) {
            return ['success' => false, 'error' => 'Fișierul imagine este corupt sau invalid.', 'filename' => null, 'path' => null];
        }
    }

    // Generează nume unic pentru fișier (previne suprascrierea)
    $unique_name = sprintf(
        '%s_%s.%s',
        date('Y-m-d_H-i-s'),
        bin2hex(random_bytes(8)),
        $file_ext
    );

    // Asigură-te că directorul există
    if (!is_dir($upload_dir)) {
        if (!mkdir($upload_dir, 0755, true)) {
            return ['success' => false, 'error' => 'Nu s-a putut crea directorul de upload.', 'filename' => null, 'path' => null];
        }
    }

    // Construiește calea destinație (previne path traversal)
    $upload_dir = rtrim(realpath($upload_dir) ?: $upload_dir, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR;
    $destination = $upload_dir . $unique_name;

    // Mută fișierul
    if (!move_uploaded_file($file['tmp_name'], $destination)) {
        return ['success' => false, 'error' => 'Eroare la salvarea fișierului. Încercați din nou.', 'filename' => null, 'path' => null];
    }

    // Setează permisiuni restrictive (read-only)
    chmod($destination, 0644);

    return [
        'success' => true,
        'filename' => $unique_name,
        'path' => $destination,
        'original_name' => $original_name,
        'size' => $file['size'],
        'mime_type' => $mime_type,
        'error' => null
    ];
}

/**
 * Obține MIME type-ul real al fișierului
 *
 * @param string $filepath Calea către fișier
 * @return string MIME type
 */
function get_mime_type(string $filepath): string
{
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    return $finfo->file($filepath) ?: 'application/octet-stream';
}

/**
 * Returnează MIME type-uri permise pentru o extensie
 *
 * @param string $extension Extensia fișierului
 * @return array Lista MIME type-uri valide
 */
function get_allowed_mimes(string $extension): array
{
    $mime_map = [
        'pdf' => ['application/pdf'],
        'docx' => [
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/zip' // DOCX e un ZIP intern
        ],
        'doc' => ['application/msword'],
        'jpg' => ['image/jpeg'],
        'jpeg' => ['image/jpeg'],
        'png' => ['image/png'],
        'gif' => ['image/gif'],
        'webp' => ['image/webp']
    ];

    return $mime_map[$extension] ?? [];
}

/**
 * Șterge un fișier încărcat
 *
 * @param string $filepath Calea către fișier
 * @return bool Succes/Eșec
 */
function delete_uploaded_file(string $filepath): bool
{
    if (empty($filepath)) {
        return true;
    }

    // Previne ștergerea fișierelor din afara directoarelor de upload
    $allowed_dirs = [
        realpath(UPLOAD_DIR_DOCS),
        realpath(UPLOAD_DIR_DECIZII),
        realpath(UPLOAD_DIR_DISPOZITII),
        realpath(UPLOAD_DIR_IMAGES)
    ];

    $file_dir = realpath(dirname($filepath));

    $is_allowed = false;
    foreach ($allowed_dirs as $dir) {
        if ($dir && strpos($file_dir, $dir) === 0) {
            $is_allowed = true;
            break;
        }
    }

    if (!$is_allowed) {
        error_log("Încercare de ștergere fișier din director nepermis: {$filepath}");
        return false;
    }

    if (file_exists($filepath)) {
        return unlink($filepath);
    }

    return true;
}

/**
 * Optimizează o imagine (redimensionare și compresie)
 *
 * @param string $source_path Calea fișierului sursă
 * @param string $dest_path Calea fișierului destinație
 * @param int $max_width Lățime maximă
 * @param int $max_height Înălțime maximă
 * @param int $quality Calitate JPEG (0-100)
 * @return bool Succes/Eșec
 */
function optimize_image(
    string $source_path,
    string $dest_path,
    int $max_width = 1920,
    int $max_height = 1080,
    int $quality = 85
): bool {
    $image_info = @getimagesize($source_path);
    if ($image_info === false) {
        return false;
    }

    list($width, $height, $type) = $image_info;

    // Creează imaginea sursă
    switch ($type) {
        case IMAGETYPE_JPEG:
            $source = @imagecreatefromjpeg($source_path);
            break;
        case IMAGETYPE_PNG:
            $source = @imagecreatefrompng($source_path);
            break;
        case IMAGETYPE_GIF:
            $source = @imagecreatefromgif($source_path);
            break;
        default:
            return false;
    }

    if (!$source) {
        return false;
    }

    // Calculează noile dimensiuni
    $ratio = min($max_width / $width, $max_height / $height);

    if ($ratio < 1) {
        $new_width = (int)($width * $ratio);
        $new_height = (int)($height * $ratio);
    } else {
        $new_width = $width;
        $new_height = $height;
    }

    // Creează imaginea redimensionată
    $dest = imagecreatetruecolor($new_width, $new_height);

    // Păstrează transparența pentru PNG
    if ($type === IMAGETYPE_PNG) {
        imagealphablending($dest, false);
        imagesavealpha($dest, true);
    }

    // Redimensionează
    imagecopyresampled($dest, $source, 0, 0, 0, 0, $new_width, $new_height, $width, $height);

    // Salvează
    $result = false;
    switch ($type) {
        case IMAGETYPE_JPEG:
            $result = imagejpeg($dest, $dest_path, $quality);
            break;
        case IMAGETYPE_PNG:
            $result = imagepng($dest, $dest_path, 9);
            break;
        case IMAGETYPE_GIF:
            $result = imagegif($dest, $dest_path);
            break;
    }

    // Eliberează memoria
    imagedestroy($source);
    imagedestroy($dest);

    return $result;
}

/**
 * Creează thumbnail pentru imagine
 *
 * @param string $source_path Calea fișierului sursă
 * @param string $thumb_path Calea thumbnail-ului
 * @param int $thumb_width Lățime thumbnail
 * @param int $thumb_height Înălțime thumbnail
 * @return bool Succes/Eșec
 */
function create_thumbnail(
    string $source_path,
    string $thumb_path,
    int $thumb_width = 300,
    int $thumb_height = 200
): bool {
    return optimize_image($source_path, $thumb_path, $thumb_width, $thumb_height, 80);
}
