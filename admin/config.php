<?php
define('ADMIN_USERNAME', 'admin');
// Default password: "boboisdeco2026" — change after first login
define('ADMIN_PASSWORD_HASH', password_hash('boboisdeco2026', PASSWORD_BCRYPT));

define('BASE_PATH', dirname(__DIR__));
define('CONTENT_PATH', BASE_PATH . '/content');
define('UPLOADS_PATH', BASE_PATH . '/assets/images/uploads');
define('UPLOADS_URL', '/assets/images/uploads');
define('MAX_UPLOAD_SIZE', 5 * 1024 * 1024); // 5 MB
define('ALLOWED_EXTENSIONS', ['jpg', 'jpeg', 'png', 'webp', 'gif']);
