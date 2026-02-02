-- ═══════════════════════════════════════════════════════════════════════════════
--                 PRIMĂRIA POCIUMBĂUȚI - SCHEMA BAZĂ DE DATE
--                         Versiune: 2.0 | Data: 2026-01-19
-- ═══════════════════════════════════════════════════════════════════════════════
--
-- INSTRUCȚIUNI INSTALARE:
-- 1. Creați baza de date: CREATE DATABASE spt_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- 2. Rulați acest script: mysql -u patric -ppatric spt_db < schema.sql
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
    `phone` VARCHAR(20) DEFAULT NULL,
    `last_login` DATETIME DEFAULT NULL,
    `failed_login_attempts` TINYINT UNSIGNED NOT NULL DEFAULT 0,
    `lockout_until` DATETIME DEFAULT NULL,
    `is_active` TINYINT(1) NOT NULL DEFAULT 1,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE KEY `idx_username` (`username`),
    KEY `idx_is_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Utilizatori panel administrare';

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
--                              TABELUL LOGS (Jurnal Audit)
-- ═══════════════════════════════════════════════════════════════════════════════
DROP TABLE IF EXISTS `logs`;
CREATE TABLE `logs` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT UNSIGNED DEFAULT NULL,
    `actiune` VARCHAR(100) NOT NULL COMMENT 'Tipul acțiunii: login, create, update, delete',
    `tabel` VARCHAR(50) DEFAULT NULL COMMENT 'Tabela afectată',
    `record_id` INT UNSIGNED DEFAULT NULL COMMENT 'ID înregistrare afectată',
    `detalii` JSON DEFAULT NULL COMMENT 'Detalii JSON suplimentare',
    `ip_address` VARCHAR(45) NOT NULL,
    `user_agent` VARCHAR(255) DEFAULT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    KEY `idx_user_id` (`user_id`),
    KEY `idx_actiune` (`actiune`),
    KEY `idx_created_at` (`created_at`),
    KEY `idx_entity` (`tabel`, `record_id`),
    CONSTRAINT `fk_logs_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Jurnal audit pentru toate acțiunile';

-- ═══════════════════════════════════════════════════════════════════════════════
--                              DATE INIȚIALE
-- ═══════════════════════════════════════════════════════════════════════════════

-- Utilizatori inițiali
-- Parola: "primaria_pociumbauti2026" (hash bcrypt cost 12)
INSERT INTO `users` (`username`, `password_hash`, `full_name`) VALUES
('admin', '$2y$12$ugoFuKxpWQcbpdCa9kbh..kZcYtQUyo/rDVJ4iDtCK3eu5zGLtUaa', 'Administrator');

-- Anunț de test
INSERT INTO `anunturi` (`titlu`, `categorie`, `data_publicare`, `continut`, `continut_scurt`, `prioritate`, `vizibil`, `created_by`) VALUES
('Bine ați venit pe noul site!', 'general', CURDATE(),
'<p>Primăria satul Pociumbăuți vă urează bun venit pe noul site oficial, dezvoltat conform cerințelor <strong>HG 728/2023</strong>.</p><p>Aici veți găsi toate informațiile despre activitatea administrației locale, deciziile consiliului, dispozițiile primarului și anunțurile importante.</p>',
'Bine ați venit pe noul site oficial al Primăriei Pociumbăuți, dezvoltat conform HG 728/2023.',
1, 1, 1);

-- ═══════════════════════════════════════════════════════════════════════════════
--                              TABELUL PROIECTE_DECIZII
-- ═══════════════════════════════════════════════════════════════════════════════
DROP TABLE IF EXISTS `proiecte_decizii`;
CREATE TABLE `proiecte_decizii` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `titlu` VARCHAR(255) NOT NULL,
    `descriere` TEXT DEFAULT NULL,
    `document` VARCHAR(255) NOT NULL COMMENT 'Fișier Word/PDF atașat',
    `data_publicare` DATE NOT NULL,
    `vizibil` TINYINT(1) NOT NULL DEFAULT 1,
    `created_by` INT UNSIGNED DEFAULT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    KEY `idx_data_publicare` (`data_publicare`),
    KEY `idx_vizibil` (`vizibil`),
    CONSTRAINT `fk_proiecte_user` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Proiecte de decizii pentru consultare publică';

SET FOREIGN_KEY_CHECKS = 1;

-- ═══════════════════════════════════════════════════════════════════════════════
--                              SFÂRȘIT SCHEMA
-- ═══════════════════════════════════════════════════════════════════════════════
