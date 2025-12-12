<?php
/**
 * Galerie Fotografii - Primăria Pociumbăuți
 */

define('ADMIN_ACCESS', true);

session_start();

require_once 'includes/config.php';
require_once 'includes/auth.php';
require_once 'includes/csrf.php';
require_once 'includes/functions.php';

check_authenticated();

$page_title = 'Galerie Fotografii';
$current_page = 'view-photos';

$error = '';
$success = '';

// Categorii de fotografii
$categorii = [
    '' => 'Toate Categoriile',
    'generale' => 'Imagini Generale',
    'evenimente' => 'Evenimente',
    'infrastructura' => 'Infrastructură',
    'natura' => 'Natură și Peisaje',
    'cultura' => 'Cultură și Tradiții',
    'institutii' => 'Instituții Publice',
    'proiecte' => 'Proiecte în Derulare'
];

// Procesare ștergere
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    if (!validate_csrf_token($_POST['csrf_token'] ?? '')) {
        $error = 'Token de securitate invalid.';
    } else {
        $foto_id = (int)($_POST['foto_id'] ?? 0);

        if ($_POST['action'] === 'delete' && $foto_id > 0) {
            try {
                // Obținem informații despre fotografie
                $stmt = $pdo->prepare("SELECT fisier, thumbnail, titlu FROM fotografii WHERE id = ?");
                $stmt->execute([$foto_id]);
                $foto = $stmt->fetch();

                if ($foto) {
                    // Ștergem fișierele
                    $file_path = UPLOAD_DIR_PHOTOS . $foto['fisier'];
                    $thumb_path = UPLOAD_DIR_PHOTOS . 'thumbs/' . $foto['thumbnail'];

                    if (file_exists($file_path)) {
                        unlink($file_path);
                    }
                    if ($foto['thumbnail'] && file_exists($thumb_path)) {
                        unlink($thumb_path);
                    }

                    // Ștergem din baza de date
                    $stmt = $pdo->prepare("DELETE FROM fotografii WHERE id = ?");
                    $stmt->execute([$foto_id]);

                    log_action($pdo, $_SESSION['user_id'], 'delete_photo', 'fotografii', $foto_id, [
                        'titlu' => $foto['titlu']
                    ]);

                    $success = 'Fotografia a fost ștearsă cu succes.';
                }
            } catch (PDOException $e) {
                error_log('Eroare ștergere fotografie: ' . $e->getMessage());
                $error = 'Eroare la ștergere. Încercați din nou.';
            }
        } elseif ($_POST['action'] === 'toggle_visibility' && $foto_id > 0) {
            try {
                $stmt = $pdo->prepare("UPDATE fotografii SET vizibil = NOT vizibil WHERE id = ?");
                $stmt->execute([$foto_id]);

                $success = 'Vizibilitatea fotografiei a fost actualizată.';
            } catch (PDOException $e) {
                error_log('Eroare toggle vizibilitate: ' . $e->getMessage());
                $error = 'Eroare la actualizare. Încercați din nou.';
            }
        }
    }
}

// Filtrare și paginare
$categorie_filter = $_GET['categorie'] ?? '';
$search = trim($_GET['search'] ?? '');
$page = max(1, (int)($_GET['page'] ?? 1));
$per_page = 24;
$offset = ($page - 1) * $per_page;

// Construim query-ul
$where = [];
$params = [];

if ($categorie_filter) {
    $where[] = "categorie = ?";
    $params[] = $categorie_filter;
}

if ($search) {
    $where[] = "(titlu LIKE ? OR descriere LIKE ?)";
    $params[] = "%{$search}%";
    $params[] = "%{$search}%";
}

$where_clause = $where ? 'WHERE ' . implode(' AND ', $where) : '';

// Număr total
$stmt = $pdo->prepare("SELECT COUNT(*) FROM fotografii {$where_clause}");
$stmt->execute($params);
$total = $stmt->fetchColumn();
$total_pages = ceil($total / $per_page);

// Fotografii
$stmt = $pdo->prepare("
    SELECT f.*, u.full_name as uploaded_by_name
    FROM fotografii f
    LEFT JOIN users u ON f.uploaded_by = u.id
    {$where_clause}
    ORDER BY f.created_at DESC
    LIMIT {$per_page} OFFSET {$offset}
");
$stmt->execute($params);
$fotografii = $stmt->fetchAll();

$csrf_token = generate_csrf_token();
include 'includes/header.php';
?>

<div class="page-header">
    <div class="page-header-content">
        <h2>Galerie Fotografii</h2>
        <p>Gestionați imaginile din galeria site-ului</p>
    </div>
    <div class="page-header-actions">
        <a href="upload-photos.php" class="btn btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Încarcă Fotografii
        </a>
    </div>
</div>

<?php if ($error): echo error_message($error); endif; ?>
<?php if ($success): echo success_message($success); endif; ?>

<!-- Filtre -->
<div class="content-card" style="margin-bottom: 24px;">
    <form method="GET" action="" class="filter-form">
        <div class="filter-row">
            <div class="filter-group">
                <label for="search">Căutare</label>
                <input
                    type="text"
                    id="search"
                    name="search"
                    value="<?php echo e($search); ?>"
                    placeholder="Titlu sau descriere..."
                >
            </div>

            <div class="filter-group">
                <label for="categorie">Categorie</label>
                <select id="categorie" name="categorie">
                    <?php foreach ($categorii as $value => $label): ?>
                    <option value="<?php echo $value; ?>" <?php echo $categorie_filter === $value ? 'selected' : ''; ?>>
                        <?php echo e($label); ?>
                    </option>
                    <?php endforeach; ?>
                </select>
            </div>

            <div class="filter-actions">
                <button type="submit" class="btn btn-secondary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    Filtrează
                </button>
                <?php if ($search || $categorie_filter): ?>
                <a href="view-photos.php" class="btn btn-outline">Resetează</a>
                <?php endif; ?>
            </div>
        </div>
    </form>
</div>

<!-- Statistici -->
<div class="stats-mini-grid" style="margin-bottom: 24px;">
    <div class="stat-mini">
        <span class="stat-mini-value"><?php echo $total; ?></span>
        <span class="stat-mini-label">Total Fotografii</span>
    </div>
    <?php
    $stmt = $pdo->query("SELECT SUM(marime) FROM fotografii");
    $total_size = $stmt->fetchColumn() ?: 0;
    ?>
    <div class="stat-mini">
        <span class="stat-mini-value"><?php echo format_file_size($total_size); ?></span>
        <span class="stat-mini-label">Spațiu Utilizat</span>
    </div>
</div>

<!-- Galerie -->
<?php if (empty($fotografii)): ?>
<div class="empty-state">
    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <circle cx="8.5" cy="8.5" r="1.5"></circle>
        <polyline points="21 15 16 10 5 21"></polyline>
    </svg>
    <h3>Nu există fotografii</h3>
    <p>Nu au fost găsite fotografii<?php echo $search || $categorie_filter ? ' cu filtrele aplicate' : ''; ?>.</p>
    <a href="upload-photos.php" class="btn btn-primary">Încarcă Prima Fotografie</a>
</div>
<?php else: ?>
<div class="photo-gallery">
    <?php foreach ($fotografii as $foto): ?>
    <div class="photo-card <?php echo !$foto['vizibil'] ? 'photo-hidden' : ''; ?>">
        <div class="photo-image">
            <?php
            $thumb_url = '../uploads/photos/thumbs/' . ($foto['thumbnail'] ?: $foto['fisier']);
            $full_url = '../uploads/photos/' . $foto['fisier'];
            ?>
            <img
                src="<?php echo e($thumb_url); ?>"
                alt="<?php echo e($foto['titlu']); ?>"
                loading="lazy"
                onclick="openLightbox('<?php echo e($full_url); ?>', '<?php echo e($foto['titlu']); ?>')"
            >
            <?php if (!$foto['vizibil']): ?>
            <div class="photo-overlay-hidden">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
                <span>Ascuns</span>
            </div>
            <?php endif; ?>
        </div>

        <div class="photo-info">
            <h4 class="photo-title"><?php echo e(truncate($foto['titlu'], 40)); ?></h4>
            <div class="photo-meta">
                <span class="photo-category"><?php echo e($categorii[$foto['categorie']] ?? $foto['categorie']); ?></span>
                <span class="photo-date"><?php echo format_date($foto['created_at']); ?></span>
            </div>
            <?php if ($foto['latime'] && $foto['inaltime']): ?>
            <div class="photo-dimensions">
                <?php echo $foto['latime']; ?> × <?php echo $foto['inaltime']; ?> px
                • <?php echo format_file_size($foto['marime']); ?>
            </div>
            <?php endif; ?>
        </div>

        <div class="photo-actions">
            <form method="POST" style="display: inline;">
                <input type="hidden" name="csrf_token" value="<?php echo e($csrf_token); ?>">
                <input type="hidden" name="foto_id" value="<?php echo $foto['id']; ?>">
                <input type="hidden" name="action" value="toggle_visibility">
                <button type="submit" class="btn-icon" title="<?php echo $foto['vizibil'] ? 'Ascunde' : 'Afișează'; ?>">
                    <?php if ($foto['vizibil']): ?>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    <?php else: ?>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                    <?php endif; ?>
                </button>
            </form>

            <a href="<?php echo e($full_url); ?>" download class="btn-icon" title="Descarcă">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
            </a>

            <form method="POST" style="display: inline;" onsubmit="return confirm('Sigur doriți să ștergeți această fotografie?');">
                <input type="hidden" name="csrf_token" value="<?php echo e($csrf_token); ?>">
                <input type="hidden" name="foto_id" value="<?php echo $foto['id']; ?>">
                <input type="hidden" name="action" value="delete">
                <button type="submit" class="btn-icon btn-icon-danger" title="Șterge">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            </form>
        </div>
    </div>
    <?php endforeach; ?>
</div>

<!-- Paginare -->
<?php if ($total_pages > 1): ?>
<div class="pagination">
    <?php if ($page > 1): ?>
    <a href="?page=<?php echo $page - 1; ?>&categorie=<?php echo e($categorie_filter); ?>&search=<?php echo e($search); ?>" class="pagination-btn">
        &laquo; Înapoi
    </a>
    <?php endif; ?>

    <span class="pagination-info">
        Pagina <?php echo $page; ?> din <?php echo $total_pages; ?>
    </span>

    <?php if ($page < $total_pages): ?>
    <a href="?page=<?php echo $page + 1; ?>&categorie=<?php echo e($categorie_filter); ?>&search=<?php echo e($search); ?>" class="pagination-btn">
        Înainte &raquo;
    </a>
    <?php endif; ?>
</div>
<?php endif; ?>
<?php endif; ?>

<!-- Lightbox -->
<div id="lightbox" class="lightbox" onclick="closeLightbox()">
    <button class="lightbox-close" onclick="closeLightbox()">&times;</button>
    <img id="lightbox-img" src="" alt="">
    <div id="lightbox-caption" class="lightbox-caption"></div>
</div>

<style>
.stats-mini-grid {
    display: flex;
    gap: 16px;
}

.stat-mini {
    background: white;
    padding: 16px 24px;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.stat-mini-value {
    display: block;
    font-size: 24px;
    font-weight: 700;
    color: #1e40af;
}

.stat-mini-label {
    font-size: 13px;
    color: #6b7280;
}

.photo-gallery {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
}

.photo-card {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    transition: transform 0.2s, box-shadow 0.2s;
}

.photo-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.photo-card.photo-hidden {
    opacity: 0.6;
}

.photo-image {
    position: relative;
    aspect-ratio: 4/3;
    overflow: hidden;
    background: #f3f4f6;
    cursor: pointer;
}

.photo-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s;
}

.photo-card:hover .photo-image img {
    transform: scale(1.05);
}

.photo-overlay-hidden {
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: white;
    gap: 8px;
}

.photo-info {
    padding: 16px;
}

.photo-title {
    font-size: 15px;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 8px 0;
}

.photo-meta {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: #6b7280;
    margin-bottom: 4px;
}

.photo-category {
    background: #e5e7eb;
    padding: 2px 8px;
    border-radius: 4px;
}

.photo-dimensions {
    font-size: 11px;
    color: #9ca3af;
}

.photo-actions {
    display: flex;
    gap: 8px;
    padding: 12px 16px;
    border-top: 1px solid #f3f4f6;
    background: #fafafa;
}

.btn-icon {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    color: #6b7280;
}

.btn-icon:hover {
    background: #f3f4f6;
    color: #1f2937;
}

.btn-icon-danger:hover {
    background: #fef2f2;
    border-color: #fecaca;
    color: #dc2626;
}

/* Lightbox */
.lightbox {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.95);
    display: none;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    padding: 20px;
}

.lightbox.active {
    display: flex;
}

.lightbox-close {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 48px;
    height: 48px;
    border: none;
    background: rgba(255,255,255,0.1);
    color: white;
    font-size: 32px;
    cursor: pointer;
    border-radius: 50%;
    transition: background 0.2s;
}

.lightbox-close:hover {
    background: rgba(255,255,255,0.2);
}

#lightbox-img {
    max-width: 90vw;
    max-height: 85vh;
    object-fit: contain;
    border-radius: 4px;
}

.lightbox-caption {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    color: white;
    font-size: 16px;
    text-align: center;
    background: rgba(0,0,0,0.5);
    padding: 12px 24px;
    border-radius: 8px;
}

.empty-state {
    text-align: center;
    padding: 60px 20px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.empty-state svg {
    color: #d1d5db;
    margin-bottom: 16px;
}

.empty-state h3 {
    font-size: 20px;
    color: #374151;
    margin: 0 0 8px 0;
}

.empty-state p {
    color: #6b7280;
    margin-bottom: 24px;
}

.filter-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.filter-row {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    align-items: flex-end;
}

.filter-group {
    flex: 1;
    min-width: 200px;
}

.filter-group label {
    display: block;
    font-size: 13px;
    font-weight: 500;
    color: #374151;
    margin-bottom: 6px;
}

.filter-group input,
.filter-group select {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 14px;
}

.filter-actions {
    display: flex;
    gap: 8px;
}

.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
    margin-top: 32px;
    padding: 20px;
}

.pagination-btn {
    padding: 10px 20px;
    background: #1e40af;
    color: white;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 500;
    transition: background 0.2s;
}

.pagination-btn:hover {
    background: #1e3a8a;
}

.pagination-info {
    color: #6b7280;
}
</style>

<script>
function openLightbox(src, caption) {
    const lightbox = document.getElementById('lightbox');
    const img = document.getElementById('lightbox-img');
    const cap = document.getElementById('lightbox-caption');

    img.src = src;
    cap.textContent = caption;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

// Close on Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeLightbox();
    }
});
</script>

<?php include 'includes/footer.php'; ?>
