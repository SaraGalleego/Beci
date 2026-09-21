$content = Get-Content 'C:\Users\casa\Downloads\Beci2ver\Perfilbeci.html' -Raw -Encoding UTF8
$old = '<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;900&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">'
$new = '<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Poppins:wght@600&display=swap" rel="stylesheet">
<!-- Phosphor Icons for UI elements -->
<script src="https://unpkg.com/@phosphor-icons/web"></script>
<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.2/src/regular/style.css">
<link rel="stylesheet" type="text.css" href="https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.2/src/thin/style.css">
<link rel="stylesheet" type="text.css" href="https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.2/src/light/style.css">
<link rel="stylesheet" type="text.css" href="https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.2/src/bold/style.css">
<link rel="stylesheet" type="text.css" href="https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.2/src/fill/style.css">
<link rel="stylesheet" type="text.css" href="https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.2/src/duotone/style.css">'
$content = $content -replace [regex]::Escape($old), $new
Set-Content 'C:\Users\casa\Downloads\Beci2ver\Perfilbeci.html' -Value $content -Encoding UTF8