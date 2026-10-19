# Dilerna · Site vitrine

Site statique (HTML, CSS, JS, sans dépendance ni build). Mobile-first.

## Fichiers
| Fichier | Rôle |
|---|---|
| `index.html` | Le site (SEO, schema.org NailSalon, Open Graph) |
| `apercu-iphone.html` | Présentation dans un mockup iPhone 393×852 (redirige vers le site sur mobile) |
| `css/style.css` | Styles : palette, typo, animations, mode sombre |
| `js/config.js` | **Contenu modifiable** : photos, vidéos, réduction, couleurs du mois |
| `js/main.js` | Interactions (menu, RDV, orbite des ongles, galerie, horaires…) |
| `tools/optimiser-images.sh` | Conversion des photos en WebP |

## Ajouter le contenu
1. **Logo** : `assets/logo/dilerna-logo.png` (fond transparent) + `assets/logo/favicon.png` (carré 512 px).
2. **Photos** : convertir avec `./tools/optimiser-images.sh source assets/img/creations`, puis lister les fichiers dans `js/config.js`.
   - `assets/img/creations/` : nail arts récents, **mains uniquement**
   - `assets/img/instagram/` : republications pour le bandeau
   - `assets/img/salon/` : salon avec néon (hero) et salon avec le teckel (à propos)
   - `assets/img/ongles-orbite/` : ongles détourés (fond transparent) qui tournent autour du néon
3. **Vidéos** : `assets/video/*.mp4` (H.264, muettes, < 5 Mo), à renseigner dans `config.js`.
4. **Tarifs** : directement dans `index.html`, section `#tarifs` (les `class="ph"` sont les emplacements provisoires).
5. **Réduction** : `discount` dans `config.js`.
6. Quand tout est fourni : `showPlaceholderLabels: false`.
7. Image de partage : `assets/img/og-image.jpg` (1200×630), et compléter la balise `canonical` avec le domaine.

## Mise en ligne
Glisser-déposer le dossier sur Netlify, Vercel, OVH ou GitHub Pages. Aucun réglage nécessaire.
Pour changer la police des titres : variable `--font-display` dans `css/style.css` (Gloock en secours).
