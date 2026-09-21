with open(r'C:\Users\casa\Downloads\Beci2ver\Perfilbeci.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace font imports
old = '<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;900&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">'
new = '''<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Poppins:wght@600&display=swap" rel="stylesheet">
<!-- Phosphor Icons for UI elements -->
<script src="https://unpkg.com/@phosphor-icons/web"></script>
<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.2/src/regular/style.css">
<link rel="stylesheet" type="text.css" href="https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.2/src/thin/style.css">
<link rel="stylesheet" type="text.css" href="https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.2/src/light/style.css">
<link rel="stylesheet" type="text.css" href="https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.2/src/bold/style.css">
<link rel="stylesheet" type="text.css" href="https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.2/src/fill/style.css">
<link rel="stylesheet" type="text.css" href="https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.2/src/duotone/style.css">'''

content = content.replace(
    '<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;900&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">',
    new)

# Also change body class from font-body-md to use Montserrat
content = content.replace(
    'body class="antialiased min-h-screen relative font-body-md text-on-surface"',
    'body class="antialiased min-h-screen relative"')

with open(r'C:\Users\casa\Downloads\Beci2ver\Perfilbeci.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('Done')