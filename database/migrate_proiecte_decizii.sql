-- ═══════════════════════════════════════════════════════════════════════════════
--                   МИГРАЦИЯ: Добавление таблицы proiecte_decizii
-- ═══════════════════════════════════════════════════════════════════════════════
-- Выполнить: mysql -u patric -ppatric spt_db < database/migrate_proiecte_decizii.sql
-- ═══════════════════════════════════════════════════════════════════════════════

SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS `proiecte_decizii` (
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

-- Готово!
SELECT 'Таблица proiecte_decizii создана успешно!' as status;
