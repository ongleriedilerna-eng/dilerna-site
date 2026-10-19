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
- CAP Esthétique, diplômée de l'école Bontard.

## Tarifs (à partir du 1er janvier 2027)
- Pose américaine : première pose 60 €, dépose sans repose 20 €
- Gainage : première pose 60 €, remplissage 50 €, dépose sans repose 20 €
- Semi renforcé : première pose 40 €, dépose sans repose 15 €
- « Dépose incluse lors d'une repose ». French +10 €. Nail art sur devis uniquement. Carte blanche : 120 € tout compris.

## Couleurs
Fond crème #F8F4EC / #F2E8E1 · marrons #4E2E22, #6E4A32, #210202 · beiges #D5C6AF, #D8C6B6, #AB9680.
Louise (teckel, mascotte) : #6E4A32 avec collier rose pastel.

## Structure de la page (ordre actuel)
Header (logo) · Menu (Club Dilerna qui brille en premier, puis Accueil, Infos, Inspi, À propos, Contact + Louise et « Prendre rendez-vous »)
· **Accueil** : animation 3D jouée automatiquement (`js/pour.js`, images `assets/hero3d/`), infos CAP / Porto-Vecchio / avis en haut (variante `#…bas` = en bas)
· **Prestations** : bloc Louise + « Prendre rendez-vous » tout en haut, titre, cartes empilées, devis nail art, Carte blanche
· Les dernières du salon (Instagram) + carte « Tu as aimé ta pose ? »
· Pet friendly · Couleur du mois · Besoin d'inspiration (Pinterest) · A propos (sans accent) + Mon salon
· Infos pratiques (horaires, adresse, plan, « Tu es devant et tu ne trouves pas ? Appelle-moi »)
· Avis Google (bande de couleur plus foncée, Louise mange le mot « Google » puis le rapporte, en boucle) · On papote ? · Bon à savoir · Réseaux · Footer
· Barre du bas façon appli : Accueil, Inspo, bouton rond **CLUB DILERNA** (ouvre la fiche du club), Infos, Menu.

## Club Dilerna (abonnement, `js/club.js`)
Fiche avec les idées de Marie uniquement (priorité fêtes, soin des mains, nail art offert/an, −10 % anniversaire, huile offerte,
nuancier privé, joker d'annulation, parrainage). **Aucun prix fixé** : la fiche dit « Le club ouvre bientôt » et le bouton prépare
un message à Marie. Ne pas ajouter de prix tant qu'elle ne l'a pas décidé.

## Animation 3D de l'accueil
Rendue sous Blender (Cycles) image par image, sources dans `3d/` (voir `3d/README.md`). Le flacon se dévisse, verse dans le logo
en verre, le moule disparaît, décor studio (colonnes travertin, capsules d'ongles, perles).

## En cours / à faire
- Nom de domaine : **dilerna.fr** acheté chez OVH le 19/10/2026 pour 5 ans (commande 261349820, compte particulier de Marie,
  renouvellement en octobre 2031). Fichier `CNAME` = `dilerna.fr`, « Custom domain » réglé dans Settings → Pages.
  Zone DNS OVH : A → 185.199.108.153, .109.153, .110.153, .111.153 ; AAAA → 2606:50c0:8000::153 à 8003::153 ;
  CNAME `www` → `ongleriedilerna-eng.github.io.` ; MX/SPF OVH conservés (compte e-mail Zimbra Starter inclus).
  HTTPS actif et forcé (certificat GitHub pour dilerna.fr + www, renouvelé automatiquement). Site en ligne sur https://dilerna.fr.
- Phrase sous « A propos » : Marie doit choisir parmi 5 styles (citation, petites capitales, surligné, sticker, machine à écrire).
- Agenda / réservation en ligne : plus tard.
