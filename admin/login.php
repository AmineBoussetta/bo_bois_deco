<?php
require_once __DIR__ . '/auth.php';

if (isLoggedIn()) {
    header('Location: index.php');
    exit;
}

$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $password = $_POST['password'] ?? '';
    if (login($username, $password)) {
        header('Location: index.php');
        exit;
    }
    $error = 'Identifiants incorrects.';
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bo Bois Deco — Connexion Admin</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/admin.css">
</head>
<body class="login-page">
  <div class="login-card">
    <div class="login-card__header">
      <h1 class="login-card__logo">Bo Bois Deco</h1>
      <p class="login-card__subtitle">Panneau d'administration</p>
    </div>

    <?php if ($error): ?>
      <div class="alert alert--error"><?= htmlspecialchars($error) ?></div>
    <?php endif; ?>

    <form method="POST" class="login-card__form">
      <div class="form-group">
        <label for="username" class="form-label">Identifiant</label>
        <input type="text" id="username" name="username" class="form-input" required autofocus
               value="<?= htmlspecialchars($_POST['username'] ?? '') ?>">
      </div>
      <div class="form-group">
        <label for="password" class="form-label">Mot de passe</label>
        <input type="password" id="password" name="password" class="form-input" required>
      </div>
      <button type="submit" class="btn btn--primary btn--full">Se connecter</button>
    </form>
  </div>
</body>
</html>
