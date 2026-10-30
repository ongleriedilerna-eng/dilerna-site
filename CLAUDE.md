# Site Dilerna — fiche projet

Site vitrine mobile-first de **Dilerna**, l'onglerie de **Marie** (nail artist) à Porto-Vecchio (Corse-du-Sud).
Site statique : `index.html`, `css/style.css`, `js/*.js`, `assets/`. Hébergé sur GitHub Pages
(dépôt `ongleriedilerna-eng/dilerna-site`, branche `main`, dossier racine). Pas de build : on modifie, on commit, on push.

## Règles de Marie (à respecter à chaque modification)
- Tout en **français**, on **tutoie** la cliente.
- **Ne rien inventer** : infos, prix, avis, chiffres. Si une info manque, demander.
- **Pas de visages** sur les photos de créations (mains uniquement). Pas de dates sous les photos.
- **Pas de flèches** dans les boutons. Pas de barre de défilement blanche.
- Elle déteste : les grands espaces vides entre sections, les titres sur deux lignes (chaque titre `data-fit` tient sur une ligne, voir `js/titles.js`), les polices type Caprasimo ("Burger King"), les néons, les arches, les effets "cheap / vibe codé".
- Elle aime : les formes arrondies, la typo **« pâte à modeler »** (Fraunces, axe SOFT 100, classe `.t-soft`), Louise la mascotte, les animations soignées.
- Mode clair uniquement.

## Version ordinateur (« version web ») — NE JAMAIS TOUCHER LA VERSION MOBILE
Marie a validé la version téléphone : elle ne doit plus bouger quand on travaille la version ordinateur (dit le 20/10/2026, « très important »).
- Tout ce qui est pour l'ordinateur va dans `css/ordinateur.css`, chargé avec `media="(min-width: 1024px)"` : un téléphone ne le lit jamais.
  Ne pas modifier les règles existantes de `css/style.css` pour l'ordinateur.
- Un changement JS pour l'ordinateur passe par `matchMedia("(min-width: 1024px)")` ; le comportement sur téléphone reste identique.
- Pas de changement de texte, de photo ou de HTML visible sur téléphone : un élément ajouté pour l'ordinateur est caché sur téléphone.
- Avant chaque mise en ligne : captures du téléphone (390 px) avant/après, comparées pixel à pixel ; si une seule différence apparaît, on ne publie pas.
- Ce qui est fait (21/10/2026, 1re version) : longue bande en haut (logo, Accueil, Prestations, Inspo, Club Dilerna, Infos, À propos, Contact,
  Prendre rendez-vous) à la place de la barre du bas ; prestations en 4 carrés (Nail art inclus) ; Carte blanche en grand, fond chocolat plus clair,
  les vraies Cartes blanches à droite à faire glisser (plus de carte qui se retourne) ; publications Insta plus grandes, « Voir tout mon univers »
  à côté de Suivre ; Pet friendly en bloc (texte à gauche, image à droite) ; Couleur du mois centrée ; photo de Marie un peu plus petite ;
  Mon salon (photos plus petites) avec à côté les gratuités en bulles qui « poppent » puis flottent ; plan plus petit ; On papote ? réparé ;
  Bon à savoir sur toute la ligne ; « Tu as aimé ta pose ? » avec les avis Google, tout en bas de la page.
- 2e version (21/10/2026) : flèches rondes pour passer d'une Carte blanche à l'autre (on ne peut pas glisser à la souris) ; Louise (avis Google et
  couleur du mois) sort vraiment de l'écran ; photos de Mon salon qui défilent toutes seules, vite, comme les avis ; à la place de « Tu as aimé ta pose ? »,
  un simple bouton « Laisser un avis Google » sous les avis ; Infos = 2 carrés pareils (horaires jour par jour, Lundi → Dimanche, et l'adresse) ;
  en bas, 3 carrés sur une ligne : On papote ? (la conversation), Bon à savoir, Mes réseaux + Prendre rendez-vous.
- 3e version (21/10/2026) : Carte blanche plus petite (960 px), rond 120 € descendu dans la carte ; publications Insta qui défilent en boucle ;
  Louise passe la tête un peu partout (côtés et bas de l'écran, toutes les 7 à 14 s) ; A propos : photo 300 px à gauche, à droite le titre,
  le sticker « Mais qui est donc cette baddie… » puis le texte en rectangle ; Infos pratiques **tout en bas** et compactes (tiennent sur un écran) ;
  On papote ? / Bon à savoir / Mes réseaux plus compacts (tiennent sur un écran). Chaque bloc doit tenir sur un écran (Marie ne veut pas défiler).
- 4e version (21/10/2026) : Carte blanche beaucoup plus petite (760 px, « obèse » avant) ; sur ordinateur, les publications Insta viennent de
  `config.js` → `instaPostsOrdinateur` : 8 dernières publications en HD (originaux retrouvés dans les photos iCloud de Marie ; les miniatures
  d'Instagram sans connexion ne font que 640 px, trop floues pour Marie). Les publications avec un visage sont exclues. Le téléphone garde `instaPosts`.
- 5e version (21/10/2026) : gratuités un peu plus bas (au niveau des photos du salon) ; en bas : Bon à savoir à gauche, Mes réseaux au milieu
  (Instagram, TikTok, Pinterest, Facebook avec une icône, **sans** bouton Prendre rendez-vous), la conversation « M'écrire » tout à droite, en grand.
- 6e version (21/10/2026) : accueil sur ordinateur = nouvelle animation 3D en largeur, 2048×1152, **vernis marron chocolat** (#6B3418),
  dans `assets/hero3d-ordi/` (`pour.js` la prend à partir de 1024 px ; le téléphone garde `assets/hero3d/`). Rendu : `DESK=1 DESK_LENS=50
  DESK_LOOKZ=2.25 DESK_CAMZ=2.45 GPU=1 SAMPLES=48 python anim.py -- 2048 0..99` (voir `3d/README.md`).
- 7e version (20/10/2026) : Mon salon sur une colonne (titre, photos qui défilent, puis les gratuités sur **une seule ligne** qui défile,
  plus de bulles qui flottent et descendent) ; Infos pratiques : titre au milieu ; publications Insta qui défilent **sans aucune
  interaction** (pas d'arrêt au survol, pas de clic, pas de cœur) ; Louise **se promène** (en bas de l'écran ou sur le haut des blocs,
  pattes qui trottinent) en plus de passer la tête ; curseur (flacon et main) en **vernis marron** #6B3418, plus de rose.
  Les 3 publications Insta sans photo HD : on ne les met pas (choix de Marie).
- 8e version (22/10/2026) : accueil 3D en **qualité maximale** (demande de Marie) : rendu en 3840×2160, 192 échantillons, `DESK_HQ=1`
  (bruit et débruitage au plus fin). `assets/hero3d-ordi/` = 2560×1440 (réduit depuis la 4K), `assets/hero3d-ordi-4k/` = 3840×2160 pour les
  écrans de plus de 2700 pixels réels (grands écrans, Retina) ; choix dans `pour.js`. Environ 3 min par image sur le PC de Marie (≈ 5 h en tout).
- Vérification du téléphone : `cdpsig.py` (empreinte de la position/taille de chaque élément à 390 px), à comparer avant/après.

## Obligations légales (21/10/2026)
- Page `mentions-legales.html` (lien en bas du site, téléphone et ordinateur) : éditrice, hébergeur GitHub, domaine OVH, prix TTC,
  médiateur, avis clients, données personnelles, cookies, droits sur les contenus. **Champs « à compléter »** en attendant les infos de Marie :
  complétés le 21/10/2026 : Marie Leandri, micro-entreprise, ongleriedilerna@gmail.com, SIRET 954 000 253 00029, TVA non applicable (art. 293 B du CGI).
  Médiateur de la consommation : obligatoire (art. L.612-1, amende jusqu'à 3 000 €), mais Marie a décidé le 20/10/2026 de ne pas
  s'inscrire. La section s'appelle « En cas de désaccord » (« écris-moi d'abord… »), sans médiateur. Si elle change d'avis : CM2C
  (48 € / 3 ans, www.cm2c.net, 49 rue de Ponthieu 75008 Paris) — c'est elle qui s'inscrit et paye, puis on ajoute ses coordonnées.
- Aucun service tiers chargé par le site (donc pas de bandeau cookies) : polices servies par le site (`css/fonts.css`, `assets/fonts/`),
  scripts Pinterest et Instagram retirés (ils ne servaient plus). Ne pas remettre Google Fonts ni de widget tiers sans bandeau de consentement.
- Sous les avis Google : « Une sélection d'avis publiés par des clientes sur Google, non vérifiés par Dilerna. » ; « prix TTC » à côté des tarifs.
- À faire : conditions du Club Dilerna (abonnement : durée, résiliation, paiement) avant toute inscription (Marie les prépare, 20/10/2026).
- Droits des images d'inspiration (Pinterest) et des personnages de films dans les ronds des Cartes blanches : Marie accepte le risque
  (20/10/2026), ne plus lui en reparler ; la page des mentions légales dit qu'on les retire sur demande.

## Infos réelles
- Adresse : Rte de Pezza Carda Cardo, 20137 Porto-Vecchio (41.6176338, 9.300044)
- Horaires : du lundi au vendredi, 9h–17h
- Téléphone : 07 45 07 32 35
- Google : 5,0 sur 65 avis, plus de 7 400 vues. Les 3 avis (Catherine L., Paola G., Sky B.) ne doivent pas être modifiés.
- Instagram https://www.instagram.com/ongleriedilerna/ · TikTok https://www.tiktok.com/@ongleriedilerna ·
  Pinterest https://fr.pinterest.com/ongleriedilerna/ · Facebook https://www.facebook.com/p/Onglerie-Dilerna-100092076736430/
- CAP Esthétique, diplômée de l'école **Gontard** (avec un G, pas « Bontard »).

## Tarifs (à partir du 1er janvier 2027)
- Pose américaine : première pose 60 €, dépose sans repose 20 €
- Gainage : première pose 60 €, remplissage 50 €, dépose sans repose 20 €
- Semi renforcé : première pose 40 €, dépose sans repose 15 €
- « Dépose incluse lors d'une repose ». French +10 €. Nail art sur devis uniquement. Carte blanche : 120 € tout compris.

## Couleurs
Fond crème #F8F4EC / #F2E8E1 · marrons #4E2E22, #6E4A32, #210202 · beiges #D5C6AF, #D8C6B6, #AB9680.
Louise (teckel, mascotte) : #6E4A32 avec collier rose pastel. Le collier fait le tour du cou (de la nuque à la gorge),
avec la médaille dorée qui pend dessous ; Louise a un petit cou et une oreille un peu plus courte pour qu'il se voie (validé par Marie).

## Structure de la page (ordre actuel)
**Pas de logo ni de barre en haut de la page** (header caché, Marie le trouvait inutile) · Menu (Club Dilerna retiré du menu le 22/10/2026 à la demande de Marie : il reste le bouton rond de la barre du bas ; Accueil, Tarifs (ajouté le 22/10/2026 à la demande de Marie, mène aux prestations), Infos, Inspi, À propos, Contact + Louise et « Prendre rendez-vous », et dessous un **petit** bouton « Appeler · 07 45 07 32 35 », volontairement discret : Marie préfère les messages)
· **Accueil** : animation 3D jouée automatiquement (`js/pour.js`, images `assets/hero3d/`), infos CAP / Porto-Vecchio / avis en haut (`.pour__sticky` padding-top 46px ; pas plus bas : en se dévissant, le bouchon monte jusqu'à ~16 px sous les infos) (variante `#…bas` = en bas)
· **Prestations** : bloc Louise + « Prendre rendez-vous » tout en haut (**sticker crème penché** tenu par 2 washi à pois, « Je réponds vite ! » dessous, classe `.rdv-sticker`, validé par Marie le 20/10/2026 ; avant : gros bouton chocolat), titre, cartes empilées, devis nail art, Carte blanche
· Les dernières du salon : titre, puis **la ligne de nail art** qui glisse toute seule (config → `creations`, 19 photos fond marron, rangées par couleur) + bouton « Voir tous mes nail arts » (fenêtre en 2 colonnes, dernière case chocolat « Tu en veux encore ? » qui mène à Instagram) ; ensuite la partie Instagram : carte Suivre avec dessous « Suis-moi sur Insta pour ne rien rater ! » (Marie a fait retirer la phrase « Mes dernières publications… »), posts à faire glisser (**non cliquables**, présentés comme de vraies publications Insta : photo de profil, puis barre cœur / commentaire / partage / enregistrer et légende ; le cœur se remplit en marron au toucher ; aucun faux nombre de likes), bouton « Voir tout mon univers sur Instagram » ; puis carte « Tu as aimé ta pose ? »
· Pet friendly · Couleur du mois (change toute seule chaque mois, `config.js` → `colors` : Milky, Bleu porcelaine, Vert sauge, Nude rosé, Pêche, Terracotta, Jaune pastel, Rose, Figue, Chocolat chaud, Bordeaux, Rouge myrte) · Besoin d'inspiration (Pinterest : **chaque photo ouvre sa propre épingle**, `config.js` → `pinterest[].url`, retrouvées dans le tableau mariefleandri/nail-art-inspi) · A propos (sans accent) + Mon salon
· Infos pratiques (horaires, adresse, plan, « Tu es devant et tu ne trouves pas ? Appelle-moi »)
· Avis Google (bande plus foncée ; Louise mange le mot « Google » puis le rapporte **2 fois seulement**, puis s'en va ; le mot revient toujours en entier ; les avis défilent tout seuls) · On papote ? · Bon à savoir · Réseaux · Footer
· Barre du bas façon appli : Accueil, Inspo, bouton rond **CLUB DILERNA** (ouvre la fiche du club), Infos, Menu.

## Horaires
Carte des horaires : jours L→D en ronds, puis un sticker crème penché (washi à pois) avec le rond « Ouvert » et « 9h – 17h »
(choix de Marie parmi 10 écritures). Jour d'aujourd'hui entouré en beige.
Le rond dit « Ouvert » du lundi au vendredi de 9h à 17h (heure de Corse) et « Fermé » le reste du temps (`data-open-badge`, main.js).
« On papote ? » : pas de bulle « Appeler » (Marie la trouvait nulle), mais un petit téléphone rond chocolat à droite de « Marie · En ligne » (`.chat__call`, tel:).

## Prise de rendez-vous (`js/main.js`, fenêtre « On se fait les ongles ? »)
**Instagram ne permet pas d'écrire le message à l'avance** dans la conversation (aucun site ne peut le faire ; testé par Marie,
le `?text=` non officiel est ignoré par l'appli). Le message est copié et une consigne dit de le coller.
Avant d'ouvrir Instagram, une fenêtre « Ton message » (choix n°1 de Marie) montre le message et un seul bouton
« Copier et ouvrir Instagram » (+ « Dans Instagram : appuie dans la barre puis « Coller ». »).
**WhatsApp le permet** (`wa.me/33745073235?text=…`) : bouton « Écrire sur WhatsApp » dans la fenêtre et dans « On papote ? ».
Message par défaut : « Bonjour Marie, j'aimerais prendre rendez-vous. Quelles sont tes disponibilités ? » (général : Marie
propose plusieurs prestations).
Chaque bouton a un message déjà écrit (`data-rdv-msg`, sinon message par défaut : pose + disponibilités) : il s'écrit tout seul
dans le SMS, et il est copié pour Instagram (Instagram ne permet pas de pré-remplir un message ; un petit message dit de le coller).
Messages dédiés : chaque prestation, devis nail art, Carte blanche, Club. **La fenêtre a 2 pages (choix n°2 de Marie, tout en gros et en MAJUSCULES)** : 1) « On se fait les ongles ? » + « CHOISIS TA PRESTATION » avec les prestations **en deux colonnes égales, la dernière (Dépose) sur toute la largeur, sans prix** (choix n°1 de Marie parmi 4 placements : Pose américaine, Gainage, Remplissage, Semi renforcé, Nail art, Carte blanche, Dépose ; pas de « Je ne sais pas encore ») ; 2) le nom de la prestation en grand, « OÙ TU PRÉFÈRES M'ÉCRIRE ? », les boutons dans cet ordre : Instagram, SMS, WhatsApp (**pas de bouton Appeler**, Marie n'en veut pas) et « Changer de prestation ». Un bouton qui connaît déjà la prestation (`data-rdv-msg`) ouvre directement la 2e page. Pas d'aperçu du message. Bouton Instagram marron, sans mouvement, rose pastel
au toucher (Marie n'aime pas le rose vif). Titre de la fenêtre dans l'écriture du titre « Club Dilerna » (`t-soft`).
Avis Google : la carte « Tu as aimé ta pose ? » mène au lien direct « Rédiger un avis »
(https://search.google.com/local/writereview?placeid=ChIJtRocvpiB2RIRG8ZMvOE_BQE) et a un bouton « Laisser mon avis ».
Le bouton « Suivre » ouvre le profil Instagram (impossible de s'abonner automatiquement depuis un site).

## Club Dilerna (abonnement, `js/club.js`)
Prix décidé par Marie : **15 € par mois** (passé à 9 € puis remis à 15 € le 20/10/2026) (seulement dans la pastille ronde qui bouge, comme celle de la Carte blanche ;
phrase d'intro : « Des petits plus rien que pour toi, toute l'année. »). **Places restantes** sous « Abonnement mensuel » :
nombre réglé dans `js/config.js` → `clubPlaces` (21 au départ ; baisser de 1 à chaque inscrite ; 0 = « Complet »).
Plus de phrase « Le club ouvre bientôt ». Tailles d'origine (Marie trouvait la version resserrée trop tassée) ; la fiche fait
au moins 90 % de la hauteur de l'écran, avantages répartis dans la hauteur ; croix de fermeture en haut à gauche.
Aucun contour rose : le contour de sélection du site est beige pastel, et à l'ouverture d'une fiche c'est la fiche qui est
sélectionnée (pas un bouton).
Avantages dans cet ordre : **la French offerte, à chaque fois** (toutes les French, pas une par an), **toutes les déposes
offertes** (même sans repose : hôpital, imprévu…), nuancier privé, **3 jokers par an** pour annuler, **un petit massage des mains
à la crème à chaque prestation**, puis priorité fêtes, −10 % anniversaire, huile offerte, parrainage. Chaque avantage a un emoji teinté en marron (pas de ronds marrons).
La fiche dit toujours « Le club ouvre bientôt » et le bouton prépare un message à Marie.

## Animation 3D de l'accueil
Rendue sous Blender (Cycles) image par image, sources dans `3d/` (voir `3d/README.md`). Le flacon se dévisse, verse dans le logo
en verre, le moule disparaît, décor studio (colonnes travertin, capsules d'ongles, perles).
Le pinceau est assez court pour ne pas dépasser sous le flacon, et le filet de vernis s'arrête avant que le flacon se redresse
(aucun trait ne doit rester en l'air). Le bas de l'accueil se fond dans le crème des prestations (dégradé CSS).
Pet friendly : Marie est dessinée bras le long du corps, mains posées sur le bureau, 5 doigts.

## En cours / à faire
- Nom de domaine : **dilerna.fr** acheté chez OVH le 19/10/2026 pour 5 ans (commande 261349820, compte particulier de Marie,
  renouvellement en octobre 2031). Fichier `CNAME` = `dilerna.fr`, « Custom domain » réglé dans Settings → Pages.
  Zone DNS OVH : A → 185.199.108.153, .109.153, .110.153, .111.153 ; AAAA → 2606:50c0:8000::153 à 8003::153 ;
  CNAME `www` → `ongleriedilerna-eng.github.io.` ; MX/SPF OVH conservés (compte e-mail Zimbra Starter inclus).
  HTTPS actif et forcé (certificat GitHub pour dilerna.fr + www, renouvelé automatiquement). Site en ligne sur https://dilerna.fr.
- Phrase sous « A propos » : Marie a choisi le **sticker scotché** (carte crème penchée) tenu par deux bouts de **washi à pois
  chocolat**, bords déchirés. Le bout du scotch de droite **se soulève quand on fait défiler la page** et se recolle quand le sticker
  est au milieu de l'écran (`[data-tease]`, `--p` réglé dans main.js). Elle n'a aimé ni le décollement en boucle, ni le scotch
  qui lâche et se balance. Ne pas changer le texte.
- Carte blanche : **toute la carte se retourne** (bouton « Touche pour voir une Carte blanche » sous la carte, ou on la fait
  glisser) ; au dos (choix **A « plein cadre »** de Marie, 20/10/2026) : la photo du résultat prend **toute la carte**, sans titre
  « Le résultat » ; en bas, dégradé sombre, le **rond blanc du thème** à gauche et « LE THÈME » + son nom (Fraunces SOFT) ;
  petits points en bas. On fait glisser les Cartes blanches une par une. Ne pas toucher au contenu de la carte elle-même.
  Photos dans `js/config.js` → `carteBlanche` (une ligne par Carte blanche : titre, demande = thème, resultat). 1re Carte blanche : thème L'Étrange Noël de Monsieur Jack
  (rond : tête de Jack envoyée par Marie, `assets/img/carte-blanche/theme-jack.webp` ;
  2e Carte blanche : Beetlejuice (`theme-beetlejuice.webp` = tête de Beetlejuice envoyée par Marie, `resultat-beetlejuice.webp`).
  3e Carte blanche : Chucky (`theme-chucky.webp` recadré sur le visage, `resultat-chucky.webp`).
  4e Carte blanche : Willy Wonka (thème = Wonka de face, rond centré sur le visage (pas sur le chapeau), fond passé en blanc pur, envoyé par Marie (Marie : dans le rond, on doit voir la tête du personnage), `theme-wonka.webp`, `resultat-wonka.webp`).
  5e Carte blanche : Harry Potter (`theme-harry-potter.webp` = tête de Harry, `resultat-harry-potter.webp`). 6e : Toy Story (`theme-toy-story.webp` = tête de Woody, `resultat-toy-story.webp`).
    Marie n'aimait pas les couleurs de l'image d'inspi, et on n'utilise pas d'images Pinterest (droits) ; résultat = `creations/creation-04.webp`).
- Agenda / réservation en ligne : plus tard.

## Mise en ligne
Après chaque modification de `css/` ou `js/`, changer le numéro `?v=…` des liens dans `index.html` (ex. `?v=20261020b`)
pour que les téléphones rechargent la nouvelle version au lieu d'une ancienne gardée en mémoire.

## Bouton rond du téléphone (20/10/2026)
- Le bouton rond au milieu de la barre du bas affiche **« Prendre rendez-vous »** et ouvre la fiche de rendez-vous (`data-rdv`),
  à la place de « Club Dilerna » (demande de Marie, « pour l'instant »). Le club reste accessible par le Menu et, sur ordinateur,
  par la bande du haut (`ordinateur.js` ouvre maintenant le club via `.menu__club`).
- Club Dilerna en mode « bientôt » (20/10/2026, demande de Marie) : la fiche n'affiche que « Club Dilerna » et
  « Une surprise arrive bientôt… ». Prix, places, avantages et bouton sont gardés dans le HTML (`data-later`) ;
  pour les remettre, retirer la classe `club--soon` du `<dialog>` (Marie les remettra plus tard, avec les nouvelles conditions).
- 21/10/2026 : le bouton rond du téléphone est **revenu à « Club Dilerna »** (`data-club-open`, demande de Marie). Au clic, la fiche
  club affiche seulement « Club Dilerna » + « Une nouveauté arrive très bientôt… » (21/10 : plus le mot « surprise », le club sera payant). La prise de rendez-vous reste dans le reste du site.

## Instagram automatique (26/10/2026) — en pause
Tout est prêt mais **désactivé** (Marie a laissé tomber pour l'instant) : `scripts/insta_sync.py` + `.github/workflows/insta.yml`
(toutes les 6 h, API officielle d'Instagram, photos copiées dans `assets/img/insta/auto/`, liste écrite dans `js/insta-auto.js`,
vidéos et posts avec `#perso` exclus, 4 sur téléphone / 8 sur ordinateur). Tant que `js/insta-auto.js` est vide, le site garde config.js.
Pour l'activer : Marie crée une appli sur developers.facebook.com (elle se connecte elle-même), « Instagram API with Instagram login »,
génère le code d'accès et le colle dans GitHub → Settings → Secrets → Actions → `IG_TOKEN` ; puis `gh workflow enable Instagram`.

## Club Dilerna en ligne (club.dilerna.fr, dépôt `ongleriedilerna-eng/club`)
- Depuis le 29/10/2026, le bouton Club du site mène à https://club.dilerna.fr/ (page `bouton-club-mobile-v5.html`).
- 29/10/2026, choix de Marie : la fiche s'ouvre **en plein écran** (bloc `<style id="fiche-plein-ecran">` + script à la fin de la page) :
  en haut « Déjà membre ? Je me connecte » à gauche, « Club Dilerna » au milieu, la croix à droite ; cette barre s'efface quand on
  descend (la croix reste) ; en bas, seulement « Je rejoins le Club Dilerna · 16,99 €/mois », qui grossit quand on descend.
  Carte n°5 « deux couleurs » (haut chocolat, bas crème), « Tes avantages » en liste avec un trait entre chaque, Offrir le club et
  les liens à la fin de la liste. Marie n'a aimé aucune des 5 premières façons d'ouvrir la fiche : c'est la version « refaite au propre ».
- 29/10/2026 : **plus de page entre deux** sur club.dilerna.fr (l'ancien fond « Le Club Dilerna · Ouvrir le club · Revenir sur dilerna.fr »
  et la fausse barre du bas sont cachés). Fermer la fiche (croix ou glisser vers le bas) ramène **directement sur dilerna.fr** ;
  fermer l'écran de connexion ramène sur la fiche ; fermer son espace membre ramène sur dilerna.fr.
- 29/10/2026 (suite) : Louise plus petite sur la carte ; « Dilerna » ne sort plus du sac quand elle se retourne (2 textes, un déjà retourné) ;
  « Je rejoins » plus petit (13 px, 14,5 px quand il grossit) ; carte plus petite ; « Sans engagement… » sur une seule ligne (taille ajustée
  toute seule) ; 🎁 teinté marron ; écrans pour payer compacts (« Payer par carte » visible sans défiler sur iPhone).
  Après chaque changement du club : changer `&v=…` dans `index.html` du club **et** `?v=…` du lien dans `js/club.js` du site.
- 29/10/2026 : barre du bas du téléphone un peu moins haute (72 → 60 px, bouton rond 90 → 80 px), demande de Marie.
- 30/10/2026 : espace membre, « Ton club » dans cet ordre : conseil de la semaine, roue du mois + quiz, Les jeux, horoscope, puis les autres.
  Dans « Les jeux », Louise (petite, sans le mot sur le sac) trottine d'un bord à l'autre en faisant rebondir une balle sur son nez (`.jx-lou`).
- 30/10/2026 : **accès gratuit de Marie au club** (avec l'essai photo). Côté appli c'est en ligne (`club-reel.js` : le compte admin
  est traité comme membre). **Reste à faire (Marie a dit « demain »)** : exécuter `DILERNA SITE/club/supabase/migrations/20261030000000_acces_marie.sql`
  dans Supabase (projet club-dilerna → SQL Editor → Run) ; c'est Marie qui se connecte à Supabase. Pas de lien public gratuit pour les clientes
  (l'essai photo coûte à chaque image) : Marie montre le club depuis son téléphone, connectée.
- 30/10/2026 : sur la fiche plein écran, petit bouton **« OFFERT »** collé à droite de « Club Dilerna » (`.fp-offert`) : il fait un petit
  saut toutes les 2,6 s, deux étoiles dorées scintillent sur le T, et il ouvre l'écran « 1 essai offert » (essai photo, débloqué avec
  l'e-mail, une fois par personne ; `window.dilernaEssai`). Marie ne voulait pas d'un gros bouton « Essayage magique » en dessous.
- 30/10/2026 : **bouton rond Club plus visible** (`js/club-appel.js`, téléphone seulement) : choix C de Marie, Louise arrive vite sur la barre
  du bas (≈ 1 s après l'accueil) et s'arrête à côté du bouton rond avec une bulle « Psst… viens voir le Club ! » qui ouvre le club.
  Autres essais gardés pour comparer : `?clubv=A` (bulle « Nouveau · Le Club Dilerna »), `B` (ondes dorées), `D` (A + B).
- 30/10/2026 (club) : « La French et les tout petits nail arts TOUJOURS offerts » (avantage, règles, conditions, Espace Marie) ;
  « OFFERT » (essai photo offert) plus visible : plus grand, doré, halo qui pulse et reflet.
- 31/10/2026 : Louise et sa bulle « Psst… » s'effacent quand on descend jusqu'à la Carte blanche, et reviennent quand on remonte.
- 31/10/2026 : « CLUB DILERNA » en **blanc** sur le bouton rond. « Artiste ongulaire » à l'accueil : en cours de choix, `js/artiste.js`
  (rien ne s'affiche sans `?ao=1…5` ; 1re série refusée, 2e série : ligne du haut, sticker penché, ruban qui défile, tampon rond, pastille chocolat).
  `pour.js` envoie maintenant l'évènement `pour:fin` quand l'animation est finie.
- 31/10/2026 (choix de Marie) : sous le logo « dilerna » de l'accueil, **« ARTISTE ONGULAIRE · PORTO-VECCHIO »** dans la même écriture
  que la ligne du haut (`js/artiste.js`, idée 1, posé sur le socle du logo, visible dès l'arrivée). Les autres idées restent avec `?ao=2…5`.
- 31/10/2026 : quand Louise et sa bulle sont parties (page descendue), le bouton rond Club fait **coucou toutes les 9 s** (petit saut + onde dorée).
- 31/10/2026 : « Artiste ongulaire » apparaît **en fondu, petit à petit** (4,5 s) pendant que le logo se remplit, à partir de l'arrivée.
- 31/10/2026 : **bouton des Cartes blanches** (téléphone, `js/cb-voir.js`, choix de Marie : version 1 des « ronds des thèmes », sans la petite main) :
  une carte chocolat bordée d'or sous la Carte blanche, avec les 6 ronds des thèmes qui sautillent, « Touche pour voir mes Cartes blanches »
  et « 6 vraies créations, du thème au résultat » ; elle retourne la carte. Au dos, le bouton « Revoir la carte » reste. Autres essais : `?cbv=2…5`.
