-- ═══════════════════════════════════════════════════════════════════════════════
--                 PRIMĂRIA POCIUMBĂUȚI - SCHEMA BAZĂ DE DATE
--                         Versiune: 1.0 | Data: 2024-12-12
-- ═══════════════════════════════════════════════════════════════════════════════
--
-- INSTRUCȚIUNI INSTALARE:
-- 1. Creați baza de date: CREATE DATABASE primaria_pociumbauti CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- 2. Creați utilizatorul: CREATE USER 'primaria_admin'@'localhost' IDENTIFIED BY 'PAROLA_SIGURA_AICI';
-- 3. Acordați permisiuni: GRANT ALL PRIVILEGES ON primaria_pociumbauti.* TO 'primaria_admin'@'localhost';
-- 4. Rulați acest script: mysql -u primaria_admin -p primaria_pociumbauti < schema.sql
--
-- ═══════════════════════════════════════════════════════════════════════════════

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ═══════════════════════════════════════════════════════════════════════════════
--                              TABELUL USERS (Utilizatori Admin)
-- ═══════════════════════════════════════════════════════════════════════════════
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(50) NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL COMMENT 'bcrypt hash',
    `full_name` VARCHAR(100) NOT NULL,
    `role` ENUM('admin', 'editor') NOT NULL DEFAULT 'editor',
    `email` VARCHAR(100) DEFAULT NULL,
    `phone` VARCHAR(20) DEFAULT NULL,
    `last_login` DATETIME DEFAULT NULL,
    `failed_login_attempts` TINYINT UNSIGNED NOT NULL DEFAULT 0,
    `lockout_until` DATETIME DEFAULT NULL,
    `is_active` TINYINT(1) NOT NULL DEFAULT 1,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE KEY `idx_username` (`username`),
    KEY `idx_role` (`role`),
    KEY `idx_is_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Utilizatori panel administrare';

-- ═══════════════════════════════════════════════════════════════════════════════
--                              TABELUL SESSIONS (Sesiuni Active)
-- ═══════════════════════════════════════════════════════════════════════════════
DROP TABLE IF EXISTS `sessions`;
CREATE TABLE `sessions` (
    `id` VARCHAR(128) PRIMARY KEY,
    `user_id` INT UNSIGNED NOT NULL,
    `ip_address` VARCHAR(45) NOT NULL,
    `user_agent` VARCHAR(255) DEFAULT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `expires_at` DATETIME NOT NULL,

    KEY `idx_user_id` (`user_id`),
    KEY `idx_expires` (`expires_at`),
    CONSTRAINT `fk_sessions_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Sesiuni de autentificare active';

-- ═══════════════════════════════════════════════════════════════════════════════
--                              TABELUL ANUNTURI (Anunțuri)
-- ═══════════════════════════════════════════════════════════════════════════════
DROP TABLE IF EXISTS `anunturi`;
CREATE TABLE `anunturi` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `titlu` VARCHAR(255) NOT NULL,
    `tip` ENUM('general', 'licitatie', 'consultare', 'angajare', 'urgenta') NOT NULL DEFAULT 'general',
    `categorie` ENUM('general', 'sedinta', 'eveniment', 'info', 'achizitie', 'concurs', 'urgenta') NOT NULL DEFAULT 'general',
    `data_publicare` DATE NOT NULL,
    `data_expirare` DATE DEFAULT NULL COMMENT 'Data când expiră anunțul',
    `continut` TEXT NOT NULL,
    `continut_scurt` VARCHAR(500) DEFAULT NULL COMMENT 'Rezumat pentru lista',
    `document` VARCHAR(255) DEFAULT NULL COMMENT 'Fișier PDF/DOCX atașat',
    `imagine` VARCHAR(255) DEFAULT NULL COMMENT 'Imagine reprezentativă',
    `prioritate` TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Afișat pe prima pagină',
    `important` TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Marcat ca important',
    `vizibil` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '0=ciornă, 1=publicat',
    `vizualizari` INT UNSIGNED NOT NULL DEFAULT 0,
    `created_by` INT UNSIGNED DEFAULT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    KEY `idx_data` (`data_publicare`),
    KEY `idx_categorie` (`categorie`),
    KEY `idx_tip` (`tip`),
    KEY `idx_prioritate` (`prioritate`),
    KEY `idx_vizibil` (`vizibil`),
    KEY `idx_data_expirare` (`data_expirare`),
    FULLTEXT KEY `idx_search` (`titlu`, `continut`),
    CONSTRAINT `fk_anunturi_user` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Anunțuri publice pe site';

-- ═══════════════════════════════════════════════════════════════════════════════
--                              TABELUL DECIZII (Decizii Consiliu Local)
-- ═══════════════════════════════════════════════════════════════════════════════
DROP TABLE IF EXISTS `decizii`;
CREATE TABLE `decizii` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `numar` VARCHAR(50) NOT NULL COMMENT 'Nr. decizie ex: 24/2024',
    `data_emitere` DATE NOT NULL,
    `titlu` VARCHAR(255) NOT NULL,
    `descriere` TEXT DEFAULT NULL,
    `tip` ENUM('normativ', 'individual') NOT NULL DEFAULT 'normativ',
    `document_pdf` VARCHAR(255) NOT NULL COMMENT 'PDF obligatoriu',
    `publicat_rsal` TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Publicat în RSAL',
    `link_rsal` VARCHAR(255) DEFAULT NULL COMMENT 'Link către RSAL',
    `vizibil` TINYINT(1) NOT NULL DEFAULT 1,
    `status` ENUM('adoptat', 'proiect', 'abrogat') NOT NULL DEFAULT 'adoptat',
    `created_by` INT UNSIGNED DEFAULT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE KEY `idx_numar_unique` (`numar`),
    KEY `idx_data` (`data_emitere`),
    KEY `idx_tip` (`tip`),
    KEY `idx_vizibil` (`vizibil`),
    FULLTEXT KEY `idx_search` (`numar`, `titlu`, `descriere`),
    CONSTRAINT `fk_decizii_user` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Decizii Consiliul Local conform HG 728/2023';

-- ═══════════════════════════════════════════════════════════════════════════════
--                              TABELUL DISPOZITII (Dispoziții Primar)
-- ═══════════════════════════════════════════════════════════════════════════════
DROP TABLE IF EXISTS `dispozitii`;
CREATE TABLE `dispozitii` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `numar` VARCHAR(50) NOT NULL COMMENT 'Nr. dispoziție ex: 45/2024',
    `data_emitere` DATE NOT NULL,
    `titlu` VARCHAR(255) NOT NULL,
    `descriere` TEXT DEFAULT NULL,
    `tip` ENUM('normativ', 'personal') NOT NULL DEFAULT 'normativ',
    `categorie` ENUM('administrativ', 'resurse_umane', 'financiar', 'urbanism', 'social', 'altele') NOT NULL DEFAULT 'administrativ',
    `document_pdf` VARCHAR(255) NOT NULL COMMENT 'PDF obligatoriu',
    `depersonalizat` TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Date personale eliminate',
    `publicat_rsal` TINYINT(1) NOT NULL DEFAULT 0,
    `link_rsal` VARCHAR(255) DEFAULT NULL,
    `vizibil` TINYINT(1) NOT NULL DEFAULT 1,
    `created_by` INT UNSIGNED DEFAULT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE KEY `idx_numar_unique` (`numar`),
    KEY `idx_data` (`data_emitere`),
    KEY `idx_tip` (`tip`),
    KEY `idx_categorie` (`categorie`),
    KEY `idx_vizibil` (`vizibil`),
    FULLTEXT KEY `idx_search` (`numar`, `titlu`, `descriere`),
    CONSTRAINT `fk_dispozitii_user` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Dispoziții Primar conform HG 728/2023';

-- ═══════════════════════════════════════════════════════════════════════════════
--                              TABELUL FOTOGRAFII (Galerie Foto)
-- ═══════════════════════════════════════════════════════════════════════════════
DROP TABLE IF EXISTS `fotografii`;
CREATE TABLE `fotografii` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `titlu` VARCHAR(255) NOT NULL COMMENT 'Titlu fotografie',
    `descriere` TEXT DEFAULT NULL,
    `fisier` VARCHAR(255) NOT NULL COMMENT 'Nume fișier',
    `thumbnail` VARCHAR(255) DEFAULT NULL COMMENT 'Thumbnail mic',
    `categorie` VARCHAR(100) NOT NULL DEFAULT 'generale' COMMENT 'Categoria',
    `data_fotografiere` DATE DEFAULT NULL COMMENT 'Data când a fost făcută',
    `autor` VARCHAR(100) DEFAULT NULL COMMENT 'Autorul/fotograful',
    `latime` INT UNSIGNED DEFAULT NULL COMMENT 'Lățime în pixeli',
    `inaltime` INT UNSIGNED DEFAULT NULL COMMENT 'Înălțime în pixeli',
    `marime` INT UNSIGNED DEFAULT NULL COMMENT 'Mărime în bytes',
    `vizibil` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '1=vizibil, 0=ascuns',
    `homepage` TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Afișat pe prima pagină',
    `ordine` INT NOT NULL DEFAULT 0 COMMENT 'Ordinea de afișare',
    `uploaded_by` INT UNSIGNED DEFAULT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    KEY `idx_categorie` (`categorie`),
    KEY `idx_homepage` (`homepage`),
    KEY `idx_vizibil` (`vizibil`),
    KEY `idx_ordine` (`ordine`),
    CONSTRAINT `fk_fotografii_user` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Galerie fotografii evenimente';

-- ═══════════════════════════════════════════════════════════════════════════════
--                              TABELUL PAGINI (Pagini Statice)
-- ═══════════════════════════════════════════════════════════════════════════════
DROP TABLE IF EXISTS `pagini`;
CREATE TABLE `pagini` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `slug` VARCHAR(100) NOT NULL COMMENT 'URL friendly: despre-noi',
    `titlu` VARCHAR(255) NOT NULL,
    `continut` LONGTEXT NOT NULL,
    `meta_description` VARCHAR(255) DEFAULT NULL,
    `meta_keywords` VARCHAR(255) DEFAULT NULL,
    `updated_by` INT UNSIGNED DEFAULT NULL,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE KEY `idx_slug` (`slug`),
    CONSTRAINT `fk_pagini_user` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Conținut pagini statice editabil';

-- ═══════════════════════════════════════════════════════════════════════════════
--                              TABELUL SETARI (Setări Site)
-- ═══════════════════════════════════════════════════════════════════════════════
DROP TABLE IF EXISTS `setari`;
CREATE TABLE `setari` (
    `cheie` VARCHAR(50) PRIMARY KEY,
    `valoare` TEXT NOT NULL,
    `descriere` VARCHAR(255) DEFAULT NULL,
    `grup` VARCHAR(50) DEFAULT 'general',
    `tip` ENUM('text', 'number', 'email', 'url', 'textarea', 'boolean') DEFAULT 'text',
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    KEY `idx_grup` (`grup`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Setări configurabile ale site-ului';

-- ═══════════════════════════════════════════════════════════════════════════════
--                              TABELUL LOGS (Jurnal Audit)
-- ═══════════════════════════════════════════════════════════════════════════════
DROP TABLE IF EXISTS `logs`;
CREATE TABLE `logs` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT UNSIGNED DEFAULT NULL,
    `action` VARCHAR(100) NOT NULL COMMENT 'Tipul acțiunii: login, create, update, delete',
    `entity_type` VARCHAR(50) DEFAULT NULL COMMENT 'Tabela afectată',
    `entity_id` INT UNSIGNED DEFAULT NULL COMMENT 'ID înregistrare afectată',
    `details` JSON DEFAULT NULL COMMENT 'Detalii JSON suplimentare',
    `ip_address` VARCHAR(45) NOT NULL,
    `user_agent` VARCHAR(255) DEFAULT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    KEY `idx_user_id` (`user_id`),
    KEY `idx_action` (`action`),
    KEY `idx_created_at` (`created_at`),
    KEY `idx_entity` (`entity_type`, `entity_id`),
    CONSTRAINT `fk_logs_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Jurnal audit pentru toate acțiunile';

-- ═══════════════════════════════════════════════════════════════════════════════
--                              TABELUL STATISTICI (Analiză Vizitatori)
-- ═══════════════════════════════════════════════════════════════════════════════
DROP TABLE IF EXISTS `statistici`;
CREATE TABLE `statistici` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `data` DATE NOT NULL,
    `pagina` VARCHAR(255) NOT NULL,
    `vizite` INT UNSIGNED NOT NULL DEFAULT 1,
    `vizitatori_unici` INT UNSIGNED NOT NULL DEFAULT 1,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY `idx_data_pagina` (`data`, `pagina`),
    KEY `idx_data` (`data`),
    KEY `idx_pagina` (`pagina`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Statistici vizitatori per pagină';

-- ═══════════════════════════════════════════════════════════════════════════════
--                              DATE INIȚIALE
-- ═══════════════════════════════════════════════════════════════════════════════

-- Utilizatori inițiali (SCHIMBAȚI PAROLELE ÎN PRODUCȚIE!)
-- Parola pentru ambii: "Pociumbauti2024!" (hash bcrypt cost 12)
INSERT INTO `users` (`username`, `password_hash`, `full_name`, `role`, `email`) VALUES
('admin', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.12Cy4LnzHRt3S2', 'Administrator', 'admin', 'admin@pociumbauti.md'),
('irina', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.12Cy4LnzHRt3S2', 'Irina - Secretar', 'editor', 'irina@pociumbauti.md');

-- Setări implicite
INSERT INTO `setari` (`cheie`, `valoare`, `descriere`, `grup`, `tip`) VALUES
('site_name', 'Primăria Satul Pociumbăuți', 'Numele site-ului', 'general', 'text'),
('site_email', 'primaria.pociumbauti@apl.gov.md', 'Email principal contact', 'contact', 'email'),
('site_phone_mayor', '+373 256 73421', 'Telefon primar', 'contact', 'text'),
('site_phone_secretary', '+373 671 06938', 'Telefon secretar', 'contact', 'text'),
('site_address', 'Str. Pociumbăuțenilor 18', 'Adresa poștală', 'contact', 'textarea'),
('program_lv', 'Luni-Vineri: 08:00-17:00 (Pauză 12:00-13:00)', 'Program săptămânal', 'contact', 'text'),
('program_audiente', 'Marți, Joi: 14:00-16:00', 'Program audiențe', 'contact', 'text'),
('max_upload_size', '10485760', 'Mărime max fișier în bytes (10MB)', 'upload', 'number'),
('allowed_doc_extensions', 'pdf,docx', 'Extensii documente permise', 'upload', 'text'),
('allowed_img_extensions', 'jpg,jpeg,png', 'Extensii imagini permise', 'upload', 'text'),
('maintenance_mode', '0', 'Mod mentenanță activat', 'general', 'boolean'),
('google_analytics_id', '', 'ID Google Analytics', 'analytics', 'text');

-- Anunț de test
INSERT INTO `anunturi` (`titlu`, `categorie`, `data_publicare`, `continut`, `continut_scurt`, `prioritate`, `vizibil`, `created_by`) VALUES
('Bine ați venit pe noul site!', 'general', CURDATE(),
'<p>Primăria satul Pociumbăuți vă urează bun venit pe noul site oficial, dezvoltat conform cerințelor <strong>HG 728/2023</strong>.</p><p>Aici veți găsi toate informațiile despre activitatea administrației locale, deciziile consiliului, dispozițiile primarului și anunțurile importante.</p>',
'Bine ați venit pe noul site oficial al Primăriei Pociumbăuți, dezvoltat conform HG 728/2023.',
1, 1, 1);

SET FOREIGN_KEY_CHECKS = 1;

-- ═══════════════════════════════════════════════════════════════════════════════
--                              PROCEDURI STOCATE UTILE
-- ═══════════════════════════════════════════════════════════════════════════════

DELIMITER //

-- Procedură pentru curățarea sesiunilor expirate
CREATE PROCEDURE `cleanup_expired_sessions`()
BEGIN
    DELETE FROM sessions WHERE expires_at < NOW();
END//

-- Procedură pentru curățarea log-urilor vechi (păstrează 90 zile)
CREATE PROCEDURE `cleanup_old_logs`()
BEGIN
    DELETE FROM logs WHERE created_at < DATE_SUB(NOW(), INTERVAL 90 DAY);
END//

-- Procedură pentru statistici zilnice
CREATE PROCEDURE `update_daily_stats`(IN p_pagina VARCHAR(255))
BEGIN
    INSERT INTO statistici (data, pagina, vizite, vizitatori_unici)
    VALUES (CURDATE(), p_pagina, 1, 1)
    ON DUPLICATE KEY UPDATE
        vizite = vizite + 1;
END//

DELIMITER ;

-- ═══════════════════════════════════════════════════════════════════════════════
--                              EVENIMENTE PROGRAMATE
-- ═══════════════════════════════════════════════════════════════════════════════

-- Curăță sesiunile expirate zilnic la miezul nopții
CREATE EVENT IF NOT EXISTS `evt_cleanup_sessions`
ON SCHEDULE EVERY 1 DAY
STARTS CURRENT_DATE + INTERVAL 1 DAY
DO CALL cleanup_expired_sessions();

-- Curăță log-urile vechi săptămânal
CREATE EVENT IF NOT EXISTS `evt_cleanup_logs`
ON SCHEDULE EVERY 1 WEEK
STARTS CURRENT_DATE + INTERVAL 1 WEEK
DO CALL cleanup_old_logs();

-- ═══════════════════════════════════════════════════════════════════════════════
--                              SFÂRȘIT SCHEMA
-- ═══════════════════════════════════════════════════════════════════════════════
