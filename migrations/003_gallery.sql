-- ═══════════════════════════════════════════════════════════════════════════════
--                         GALERIE FOTO - ALBUME ȘI FOTOGRAFII
-- ═══════════════════════════════════════════════════════════════════════════════

-- Tabela pentru albume foto
CREATE TABLE IF NOT EXISTS photo_albums (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titlu VARCHAR(255) NOT NULL,
    descriere TEXT,
    categorie ENUM('evenimente', 'sarbatori', 'proiecte', 'sat', 'cultura', 'sport', 'altele') DEFAULT 'altele',
    cover_photo VARCHAR(255),
    vizibil TINYINT(1) DEFAULT 1,
    data_creare DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by INT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela pentru fotografii în albume
CREATE TABLE IF NOT EXISTS photos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    album_id INT NOT NULL,
    filename VARCHAR(255) NOT NULL,
    titlu VARCHAR(255),
    descriere TEXT,
    ordine INT DEFAULT 0,
    data_upload DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (album_id) REFERENCES photo_albums(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Index pentru căutări rapide
CREATE INDEX idx_photos_album ON photos(album_id);
CREATE INDEX idx_albums_category ON photo_albums(categorie);
CREATE INDEX idx_albums_visible ON photo_albums(vizibil);

