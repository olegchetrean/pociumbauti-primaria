# Ghid de Instalare - Admin Panel Primăria Pociumbăuți

## Cerințe de Sistem

- **PHP** 8.0 sau mai nou
- **MySQL/MariaDB** 5.7+ sau 10.3+
- **Apache** cu mod_rewrite activat sau **Nginx**
- Extensii PHP: `pdo`, `pdo_mysql`, `gd`, `fileinfo`, `mbstring`

## Pași de Instalare

### 1. Configurare Bază de Date

1. Creați o bază de date MySQL:
```sql
CREATE DATABASE primaria_pociumbeni CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Importați schema din `database/schema.sql`:
```bash
mysql -u root -p primaria_pociumbeni < database/schema.sql
```

### 2. Configurare Conexiune

Editați fișierul `admin/includes/config.php` și actualizați datele de conexiune:

```php
$db_config = [
    'host' => 'localhost',
    'dbname' => 'primaria_pociumbeni',  // Numele bazei de date
    'username' => 'root',                // Utilizator MySQL
    'password' => '',                    // Parola MySQL
    'charset' => 'utf8mb4'
];
```

### 3. Permisiuni Directoare

Setați permisiunile corecte pentru directoarele de upload:

```bash
chmod -R 755 uploads/
chmod -R 775 uploads/anunturi/
chmod -R 775 uploads/decizii/
chmod -R 775 uploads/dispozitii/
chmod -R 775 uploads/photos/
chmod -R 775 uploads/photos/thumbs/
```

### 4. Utilizatori Predefiniti

După import, vor fi disponibili următorii utilizatori:

| Utilizator | Parolă | Rol |
|------------|--------|-----|
| admin | Admin123! | Administrator |
| irina | Secretar2024! | Secretar |

**IMPORTANT:** Schimbați parolele imediat după prima autentificare!

## Configurare Server Web

### Apache (.htaccess)

Fișierul `.htaccess` din directorul `uploads/` este deja configurat pentru securitate.

Pentru directorul principal, creați un fișier `.htaccess`:

```apache
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

### Nginx

```nginx
location /admin {
    try_files $uri $uri/ /admin/index.php?$query_string;
}

location /uploads {
    location ~ \.php$ {
        deny all;
    }
}
```

## Securitate

Acest admin panel implementează:

- ✅ Protecție CSRF pe toate formularele
- ✅ Rate limiting pentru autentificare (5 încercări → 15 min blocare)
- ✅ Parole hash-uite cu bcrypt (cost 12)
- ✅ Sesiuni securizate (httpOnly, SameSite)
- ✅ Timeout sesiune: 30 minute
- ✅ Validare MIME type pentru upload-uri
- ✅ Prepared statements PDO (fără SQL injection)
- ✅ Escape XSS pe toate output-urile

## Întreținere

### Curățare Automată

Schema include proceduri stocate pentru curățare:
- Sesiuni expirate: șterse automat
- Loguri vechi (365+ zile): șterse automat
- Statistici vechi (90+ zile): șterse automat

Rulați manual sau setați un cron job:
```sql
CALL cleanup_sessions();
CALL cleanup_old_logs();
CALL cleanup_old_statistics();
```

### Backup

Backup baza de date zilnic:
```bash
mysqldump -u root -p primaria_pociumbeni > backup_$(date +%Y%m%d).sql
```

## Contact

Pentru asistență tehnică, contactați dezvoltatorul.

---

**Versiune:** 1.0
**Data:** Decembrie 2024
**Conform:** HG 728/2023
