# Samir Golden Hour — Guide du projet

## Structure du projet

```
samir-golden-hour/
├── index.html          ← Page principale (tout le site)
├── css/
│   └── style.css       ← Styles séparés (optionnel)
├── js/
│   └── main.js         ← Scripts séparés (optionnel)
├── images/             ← Tes photos / vidéos
├── fonts/              ← Polices locales si besoin
├── netlify.toml        ← Config sécurité Netlify
├── _headers            ← Headers HTTP (CSP, HSTS...)
└── README.md           ← Ce fichier
```

## Déploiement

### 1. GitHub
```bash
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/TON_USER/samir-golden-hour.git
git push -u origin main
```

### 2. Netlify (glisser-déposer ou lié à GitHub)
- Va sur https://netlify.com
- "Add new site" → "Import from Git" → GitHub → ton repo
- Domaine custom OVH : dans Netlify > Domain Settings > Add custom domain
  - Ajoute le CNAME chez OVH : `www` → `ton-site.netlify.app`

### 3. GitHub Pages (alternative)
- Dans ton repo GitHub : Settings → Pages → Branch: main → Save
- Ton site sera sur : `https://TON_USER.github.io/samir-golden-hour/`

## Modifier le site

Ouvre `index.html` dans VS Code.
Cherche les commentaires `<!-- SECTION: ... -->` pour trouver chaque partie.

Pour prévisualiser en live, installe l'extension **Live Server** dans VS Code :
- Clic droit sur `index.html` → "Open with Live Server"

## Ajouter tes photos

Mets tes images dans le dossier `/images/` puis remplace dans le HTML :
```html
<img src="images/ton-image.jpg" alt="Description">
```

## Lien WhatsApp (formulaires)

Remplace `TON_NUMERO` dans `index.html` par ton numéro au format international sans `+` ni espaces :
```
Ex: 33612345678 pour le 06 12 34 56 78
```
