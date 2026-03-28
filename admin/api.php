<?php
require_once __DIR__ . '/auth.php';
requireLogin();

header('Content-Type: application/json; charset=utf-8');

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

try {
    switch ($action) {

        // ─── Portfolio ───
        case 'get_portfolio':
            echo readJsonFile('portfolio.json');
            break;

        case 'save_portfolio':
            if ($method !== 'POST') throw new Exception('Méthode non autorisée');
            $data = json_decode(file_get_contents('php://input'), true);
            if (!$data || !isset($data['items'])) throw new Exception('Données invalides');
            writeJsonFile('portfolio.json', $data);
            echo json_encode(['success' => true]);
            break;

        // ─── Settings ───
        case 'get_settings':
            echo readJsonFile('settings.json');
            break;

        case 'save_settings':
            if ($method !== 'POST') throw new Exception('Méthode non autorisée');
            $data = json_decode(file_get_contents('php://input'), true);
            if (!$data) throw new Exception('Données invalides');
            writeJsonFile('settings.json', $data);
            echo json_encode(['success' => true]);
            break;

        // ─── About ───
        case 'get_about':
            echo readJsonFile('about.json');
            break;

        case 'save_about':
            if ($method !== 'POST') throw new Exception('Méthode non autorisée');
            $data = json_decode(file_get_contents('php://input'), true);
            if (!$data) throw new Exception('Données invalides');
            writeJsonFile('about.json', $data);
            echo json_encode(['success' => true]);
            break;

        // ─── Image upload ───
        case 'upload_image':
            if ($method !== 'POST') throw new Exception('Méthode non autorisée');
            echo json_encode(handleImageUpload());
            break;

        case 'delete_image':
            if ($method !== 'POST') throw new Exception('Méthode non autorisée');
            $data = json_decode(file_get_contents('php://input'), true);
            $filename = basename($data['filename'] ?? '');
            if (!$filename) throw new Exception('Nom de fichier manquant');
            $filepath = UPLOADS_PATH . '/' . $filename;
            if (file_exists($filepath)) {
                unlink($filepath);
            }
            echo json_encode(['success' => true]);
            break;

        case 'list_images':
            $images = [];
            if (is_dir(UPLOADS_PATH)) {
                foreach (glob(UPLOADS_PATH . '/*.{jpg,jpeg,png,webp,gif}', GLOB_BRACE) as $file) {
                    $images[] = [
                        'filename' => basename($file),
                        'url' => UPLOADS_URL . '/' . basename($file),
                        'size' => filesize($file),
                    ];
                }
            }
            echo json_encode($images);
            break;

        default:
            throw new Exception('Action inconnue: ' . $action);
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['error' => $e->getMessage()]);
}

// ─── Helpers ───

function readJsonFile(string $filename): string {
    $path = CONTENT_PATH . '/' . $filename;
    if (!file_exists($path)) throw new Exception("Fichier introuvable: $filename");
    return file_get_contents($path);
}

function writeJsonFile(string $filename, array $data): void {
    $path = CONTENT_PATH . '/' . $filename;
    $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if ($json === false) throw new Exception('Erreur d\'encodage JSON');
    $dir = dirname($path);
    if (!is_dir($dir)) mkdir($dir, 0755, true);
    if (file_put_contents($path, $json . "\n") === false) {
        throw new Exception("Impossible d'écrire le fichier: $filename");
    }
}

function handleImageUpload(): array {
    if (!isset($_FILES['image'])) throw new Exception('Aucun fichier envoyé');

    $file = $_FILES['image'];
    if ($file['error'] !== UPLOAD_ERR_OK) throw new Exception('Erreur lors de l\'upload');
    if ($file['size'] > MAX_UPLOAD_SIZE) throw new Exception('Fichier trop volumineux (max 5 Mo)');

    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    if (!in_array($ext, ALLOWED_EXTENSIONS)) {
        throw new Exception('Format non autorisé. Formats acceptés : ' . implode(', ', ALLOWED_EXTENSIONS));
    }

    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mime = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);
    $allowed_mimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!in_array($mime, $allowed_mimes)) throw new Exception('Type MIME non autorisé');

    if (!is_dir(UPLOADS_PATH)) mkdir(UPLOADS_PATH, 0755, true);

    $safeName = preg_replace('/[^a-zA-Z0-9_-]/', '_', pathinfo($file['name'], PATHINFO_FILENAME));
    $filename = $safeName . '_' . time() . '.' . $ext;
    $destination = UPLOADS_PATH . '/' . $filename;

    if (!move_uploaded_file($file['tmp_name'], $destination)) {
        throw new Exception('Impossible de sauvegarder le fichier');
    }

    return [
        'success' => true,
        'url' => UPLOADS_URL . '/' . $filename,
        'filename' => $filename,
    ];
}
