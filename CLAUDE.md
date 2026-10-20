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
**Pas de logo ni de barre en haut de la page** (header caché, Marie le trouvait inutile) · Menu (Club Dilerna qui brille en premier, puis Accueil, Infos, Inspi, À propos, Contact + Louise et « Prendre rendez-vous »)
· **Accueil** : animation 3D jouée automatiquement (`js/pour.js`, images `assets/hero3d/`), infos CAP / Porto-Vecchio / avis en haut (variante `#…bas` = en bas)
· **Prestations** : bloc Louise + « Prendre rendez-vous » tout en haut, titre, cartes empilées, devis nail art, Carte blanche
· Les dernières du salon (Instagram, photos **non cliquables**, on les fait glisser), lien Instagram, **une ligne de nail art** qui glisse toute seule (config → `creations`, sans titre ni bouton : Marie ne veut rien de plus), puis carte « Tu as aimé ta pose ? »
· Pet friendly · Couleur du mois · Besoin d'inspiration (Pinterest) · A propos (sans accent) + Mon salon
· Infos pratiques (horaires, adresse, plan, « Tu es devant et tu ne trouves pas ? Appelle-moi »)
· Avis Google (bande plus foncée ; Louise mange le mot « Google » puis le rapporte **2 fois seulement**, puis s'en va ; le mot revient toujours en entier ; les avis défilent tout seuls) · On papote ? · Bon à savoir · Réseaux · Footer
· Barre du bas façon appli : Accueil, Inspo, bouton rond **CLUB DILERNA** (ouvre la fiche du club), Infos, Menu.

## Horaires
Carte des horaires : jours L→D en ronds, puis un sticker crème penché (washi à pois) avec le rond « Ouvert » et « 9h – 17h »
(choix de Marie parmi 10 écritures). Jour d'aujourd'hui entouré en beige.

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
Messages dédiés : chaque prestation, devis nail art, Carte blanche, Club. La fenêtre n'affiche plus ni phrase ni aperçu du message : juste le titre et les boutons. Bouton Instagram marron, sans mouvement, rose pastel
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
  glisser) ; au dos (choix D1 de Marie) : **le résultat en grand**, le thème dans un **petit rond** en bas à gauche
  (« Le thème · ce qu'on m'a demandé »), titre « Le résultat » + « Carte blanche · {titre} ». S'il y en a plusieurs, on les fait
  glisser une par une (petits points + « 1 / 3 »). Ne pas toucher au contenu de la carte elle-même.
  Photos dans `js/config.js` → `carteBlanche` (une ligne par Carte blanche : titre, demande = thème, resultat). 1re Carte blanche : thème L'Étrange Noël de Monsieur Jack
  (rond : tête de Jack envoyée par Marie, `assets/img/carte-blanche/theme-jack.webp` ;
  2e Carte blanche : Beetlejuice (`theme-beetlejuice.webp` = tête de Beetlejuice envoyée par Marie, `resultat-beetlejuice.webp`).
  3e Carte blanche : Chucky (`theme-chucky.webp` recadré sur le visage, `resultat-chucky.webp`).
  4e Carte blanche : Willy Wonka (thème = Wonka de face au chapeau haut-de-forme, fond passé en blanc pur, envoyé par Marie (Marie : dans le rond, on doit voir la tête du personnage), `theme-wonka.webp`, `resultat-wonka.webp`).
  5e Carte blanche : Harry Potter (`theme-harry-potter.webp` = tête de Harry, `resultat-harry-potter.webp`). 6e : Toy Story (`theme-toy-story.webp` = tête de Woody, `resultat-toy-story.webp`).
    Marie n'aimait pas les couleurs de l'image d'inspi, et on n'utilise pas d'images Pinterest (droits) ; résultat = `creations/creation-04.webp`).
- Agenda / réservation en ligne : plus tard.

## Mise en ligne
Après chaque modification de `css/` ou `js/`, changer le numéro `?v=…` des liens dans `index.html` (ex. `?v=20261020b`)
pour que les téléphones rechargent la nouvelle version au lieu d'une ancienne gardée en mémoire.
