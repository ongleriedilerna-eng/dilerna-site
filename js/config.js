/* =========================================================================
   DILERNA · Configuration du contenu
   -------------------------------------------------------------------------
   C'est le seul fichier à modifier pour ajouter des photos, des vidéos,
   changer le pourcentage de réduction ou les couleurs du mois.
   Tant qu'une liste est vide, le site affiche des visuels « nail art »
   provisoires à la place.
   ========================================================================= */

window.DILERNA = {

  /* Réduction du deal « Mes envies » (Pinterest). Exemple : "15" */
  discount: "[xx]",

  /* Club Dilerna : nombre de places encore libres (21 au départ).
     À chaque nouvelle inscrite, baisser ce nombre de 1 : 20, 19… À 0, la fiche affiche « Complet ». */
  clubPlaces: 21,

  /* Affiche les petites étiquettes « Photo à venir » sur les emplacements
     provisoires. Passer à false une fois toutes les photos fournies. */
  showPlaceholderLabels: true,

  /* Photo du hero : le salon avec le néon (WebP, format portrait ~ 4:5).
     Si renseignée, elle remplace le néon recréé en CSS. */
  heroPhoto: "",   // l'accueil affiche désormais le portrait détouré de Marie (index.html)

  /* Photo « À propos » : Marie (format portrait ~ 4:5). */
  aboutPhoto: "assets/img/marie/marie-salon.webp",

  /* Polaroid « À propos » : Louise, le teckel du salon (carré).
     Tant qu'elle est vide, c'est l'illustration de Louise aux ongles vernis. */
  louisePhoto: "",          // ex. "assets/img/salon/louise.webp"

  /* Vidéos courtes (MP4 H.264, muettes, en boucle, < 5 Mo idéalement).
     poster = image affichée pendant le chargement. */
  videos: {
    creations: { src: "", poster: "" }    // ex. "assets/video/creation-1.mp4"
  },

  /* Créations récentes = derniers posts Instagram.
     MAINS UNIQUEMENT : tout post où l'on voit un visage est exclu.
     Les plus récents en premier. alt = description pour le SEO. */
  creations: [
    { src: "assets/img/creations/creation-26.webp", alt: "Ongles nude pastel, rose et jaune, avec feuilles argentées" },
    { src: "assets/img/creations/creation-36.webp", alt: "French ambre transparente" },
    { src: "assets/img/creations/creation-31.webp", alt: "Ongles effet écaille et bleu canard avec étoiles dorées" },
    { src: "assets/img/creations/creation-29.webp", alt: "Nail art citrons et myrtilles en relief, bleu et jaune" },
    { src: "assets/img/creations/creation-27.webp", alt: "French corail et jaune avec fleurs en relief" },
    { src: "assets/img/creations/creation-28.webp", alt: "Nail art multicolore : fleurs en relief, perles et coquillage doré" },
    { src: "assets/img/creations/creation-25.webp", alt: "Nail art tropical : fleurs en relief, boules de billard, zèbre et étoile de mer" },
    { src: "assets/img/creations/creation-38.webp", alt: "Nail art fruits exotiques : papaye, pitaya, fleurs et étoiles de mer" },
    { src: "assets/img/creations/creation-32.webp", alt: "Nail art bord de mer rose et orange : étoiles de mer dorées, perles et coquillages" },
    { src: "assets/img/creations/creation-33.webp", alt: "Ongles rose fluo avec strass et papillons en relief" },
    { src: "assets/img/creations/creation-34.webp", alt: "Ongles rose pâle : fleurs fuchsia en relief, zèbre, léopard et strass dorés" },
    { src: "assets/img/creations/creation-30.webp", alt: "Nail art lilas et argent : bijoux, strass et arabesques" },
    { src: "assets/img/creations/creation-40.webp", alt: "Ongles bordeaux : coquillages, perles et fils dorés" },
    { src: "assets/img/creations/creation-37.webp", alt: "French blanche et bordeaux, vagues et pois" },
    { src: "assets/img/creations/creation-41.webp", alt: "Rayures et pois bordeaux, rose, bleu et jaune avec soleil doré" },
    { src: "assets/img/creations/creation-43.webp", alt: "Nail art clown : ballons, spirale et strass" },
    { src: "assets/img/creations/creation-35.webp", alt: "Nail art Martini : olives et verre à cocktail" },
    { src: "assets/img/creations/creation-39.webp", alt: "Nail art jardin fleuri : fleurs, champignon, papillons et perles" },
    { src: "assets/img/creations/creation-42.webp", alt: "Fleurs des champs aquarelle en relief" },
  ],

  /* Dernières publications Instagram (Créations récentes), à faire glisser.
     url = lien de la publication (sinon, lien vers le profil). */
  /* Carte blanche : la carte se retourne et montre, au dos, la demande (en haut) et le résultat (en bas). Une ligne par Carte blanche (la 1re est affichée) :
     demande = la photo d'inspiration envoyée par la cliente, resultat = la photo du nail art fini (mains uniquement),
     theme = le thème demandé ; label = le mot affiché sur la photo du haut (« La demande » par défaut, « Le thème » pour une illustration).
     Tant que la liste est vide, la carte ne se retourne pas. */
  carteBlanche: [
    { titre: "Tim Burton", demande: "assets/img/carte-blanche/theme-jack.webp?v=2", label: "Le thème", resultat: "assets/img/creations/creation-04.webp", theme: "L'Étrange Noël de Monsieur Jack" },
    { titre: "Beetlejuice", demande: "assets/img/carte-blanche/theme-beetlejuice.webp?v=4", label: "Le thème", resultat: "assets/img/carte-blanche/resultat-beetlejuice.webp", theme: "Beetlejuice" },
    { titre: "Chucky", demande: "assets/img/carte-blanche/theme-chucky.webp?v=3", label: "Le thème", resultat: "assets/img/carte-blanche/resultat-chucky.webp", theme: "Chucky" },
    { titre: "Willy Wonka", demande: "assets/img/carte-blanche/theme-wonka.webp?v=8", label: "Le thème", resultat: "assets/img/carte-blanche/resultat-wonka.webp", theme: "Charlie et la chocolaterie" },
    { titre: "Harry Potter", demande: "assets/img/carte-blanche/theme-harry-potter.webp", label: "Le thème", resultat: "assets/img/carte-blanche/resultat-harry-potter.webp", theme: "Harry Potter" },
    { titre: "Toy Story", demande: "assets/img/carte-blanche/theme-toy-story.webp", label: "Le thème", resultat: "assets/img/carte-blanche/resultat-toy-story.webp", theme: "Toy Story" },
  ],

  instaPosts: [
    { src: "assets/img/insta/post-01.webp?v=hd", alt: "Pretty very scary : nail art Scream rose et noir" },
    { src: "assets/img/insta/post-02.webp?v=hd", alt: "Nail crush : rayures, pois et bijoux dorés" },
    { src: "assets/img/insta/post-03.webp", alt: "Pretty very spooky : nail art L'Étrange Noël de Monsieur Jack" },
    { src: "assets/img/insta/post-04.webp", alt: "Ongles transparents avec strass et nail art 3D" }
  ],

  /* Accueil : photos (et vidéos .mp4 courtes, muettes) qui défilent en colonnes.
     Pour ajouter une vidéo : { video: "assets/video/pose-01.mp4" } */
  heroWall: [
    "assets/img/hero/hero-01.webp",
    "assets/img/hero/hero-02.webp",
    "assets/img/hero/hero-04.webp",
    "assets/img/hero/hero-05.webp",
    "assets/img/hero/hero-07.webp",
    "assets/img/hero/hero-08.webp",
    "assets/img/hero/hero-09.webp",
    "assets/img/hero/hero-10.webp",
    "assets/img/hero/hero-11.webp",
    "assets/img/hero/hero-12.webp",
    "assets/img/hero/hero-13.webp",
    "assets/img/hero/hero-14.webp",
    "assets/img/hero/hero-15.webp",
    "assets/img/hero/hero-16.webp",
  ],

  /* Phrases qui tournent sous le logo de l'accueil. */
  heroLines: ["Nail art sur mesure", "Fleurs en 3D", "Strass & bijoux", "Carte blanche", "Pet friendly"],

  /* Photos du salon qui défilent dans « À propos ». */
  salonPhotos: [
    { src: "assets/img/salon/salon-neon.webp", alt: "Le néon All I need is Dilerna and some tequila, le miroir doré et le coin café" },
    { src: "assets/img/salon/salon-poste.webp", alt: "Le poste de pose du salon Dilerna à Porto-Vecchio" },
    { src: "assets/img/salon/salon-coin-cafe.webp", alt: "Le coin café : sirops, thé et figurines de teckel" },
    { src: "assets/img/salon/neon.webp", alt: "Le néon du salon en gros plan" },
    { src: "assets/img/salon/salon-poste-2.webp", alt: "Les lampes et les étagères du salon" },
    { src: "assets/img/salon/salon-coin-affiches.webp", alt: "Le coin affiches Lana Del Rey et plantes du salon" }
  ],

  /* Bandeau Pinterest : inspirations de poses que Marie rêve de faire.
     Chaque photo ouvre SON épingle (url), pas le tableau entier : très important pour Marie.
     (tableau https://fr.pinterest.com/mariefleandri/nail-art-inspi/). */
  pinterest: [
    { src: "assets/img/pinterest/inspi-01.webp", url: "https://fr.pinterest.com/pin/e1_AfqPShwJJ5Sj7rZe9IA9AdMrR_Bev6BNWetguR8TsR5h05EjQP6F/" },
    { src: "assets/img/pinterest/inspi-02.webp", url: "https://fr.pinterest.com/pin/e1_AfqPShwd5IStwwOt5W7-XuUSo1CwQGnvUS9FluWUQoFcKUjhISfA/" },
    { src: "assets/img/pinterest/inspi-03.webp", url: "https://fr.pinterest.com/pin/e1_AfqPShyQPHbk3rtUkH-j_Kx1fDPE9wjkfi9q54WbKVlYMRvm3LWP/" },
    { src: "assets/img/pinterest/inspi-04.webp", url: "https://fr.pinterest.com/pin/e1_AfqPShztsvcbasoB1iOGYp0T2sRvUE74ZSmTdnqGSuem072rYlCV/" },
    { src: "assets/img/pinterest/inspi-05.webp", url: "https://fr.pinterest.com/pin/e1_AfqPShyBMOJDKrybmCBzghxEBhVJRDInTZWdUKQaLHa9bXHVU--n/" },
    { src: "assets/img/pinterest/inspi-06.webp", url: "https://fr.pinterest.com/pin/e1_AfqPShxTixNbBroe08Ykyw3Zg1xzMEpsCH-wqtHLZ1JOmM_Vmow-/" },
    { src: "assets/img/pinterest/inspi-07.webp", url: "https://fr.pinterest.com/pin/e1_AfqPShzgxgGEcZ6r9EzInv7Mxfz0ngqM7fISsg8_uKCm3oUtPKuN/" },
    { src: "assets/img/pinterest/inspi-08.webp", url: "https://fr.pinterest.com/pin/e1_AfqPShyiz6Vf1Es9EU7cHel8VdXA-GhxDvb4zpMT_SdVOilyoVH7/" },
    { src: "assets/img/pinterest/inspi-09.webp", url: "https://fr.pinterest.com/pin/e1_AfqPShzQR8-qUTuYEffxgLHpIq4WdSYeP0vzbTEYe4TYmKZnOVRu/" },
    { src: "assets/img/pinterest/inspi-10.webp", url: "https://fr.pinterest.com/pin/e1_AfqPShwSmmO7Sgasbu6hZ8jwkLuTozJXVRJYtpUn1JZeq4cWjxZB/" },
    { src: "assets/img/pinterest/inspi-11.webp", url: "https://fr.pinterest.com/pin/e1_AfqPShxK_YPZSCNg2YsMhb4Saextm-kLpHxQBQSoY_Az71_78qVC/" },
    { src: "assets/img/pinterest/inspi-12.webp", url: "https://fr.pinterest.com/pin/e1_AfqPShxQ6cqa_OFd3fAsu8mdhkYWU-RqpoN4wH66Qz2d05PSeOiN/" },
    { src: "assets/img/pinterest/inspi-13.webp", url: "https://fr.pinterest.com/pin/e1_AfqPShz3JYSmmvPrlBOD3stN6LIWI55bbviRXPvEtKv_j78zDsDQ/" },
    { src: "assets/img/pinterest/inspi-14.webp", url: "https://fr.pinterest.com/pin/e1_AfqPShycqYd9IzU3XApmpLyHkXpQM27_C-CE2DS4pgxudtT9bSIp/" },
    { src: "assets/img/pinterest/inspi-15.webp", url: "https://fr.pinterest.com/pin/e1_AfqPShyBZpvjjhgyh08inUMDtFAD2phUDf_vcuj1C8QnTiJY6C3u/" },
    { src: "assets/img/pinterest/inspi-16.webp", url: "https://fr.pinterest.com/pin/e1_AfqPShy1PUz7pnfgrSB8fPXB41kmD2L5_YIPE25hwdMyVZi6exQi/" },
  ],

  /* Ongles qui gravitent autour du néon : vide = dessins inspirés des
     créations de Marie (papaye, Jack, Scream, fleurs…). Mettre des images
     ici pour les remplacer par des photos. */
  orbitNails: [],

  /* Gros plans de vrais ongles (recadrés depuis les créations) qui flottent
     autour du macaron « Fait main » dans Créations récentes. 6 à 8. */
  floatNails: [
    "assets/img/ongles-orbite/ongle-01.webp", "assets/img/ongles-orbite/ongle-02.webp",
    "assets/img/ongles-orbite/ongle-05.webp", "assets/img/ongles-orbite/ongle-09.webp",
    "assets/img/ongles-orbite/ongle-08.webp", "assets/img/ongles-orbite/ongle-03.webp",
    "assets/img/ongles-orbite/ongle-07.webp",
  ],

  /* Couleur du mois : une par mois (janvier → décembre), choisies par Marie le 20/10/2026.
     Le site prend tout seul la couleur du mois en cours (heure du téléphone de la cliente). */
  colors: [
    { name: "Milky",           hex: "#EEE6DA" },   // janvier : blanc laiteux
    { name: "Bleu porcelaine", hex: "#8FA9C4" },   // février
    { name: "Vert sauge",      hex: "#9DAE8F" },   // mars
    { name: "Nude rosé",       hex: "#D7AE9F" },   // avril
    { name: "Pêche",           hex: "#E8B293" },   // mai
    { name: "Terracotta",      hex: "#B5694A" },   // juin
    { name: "Jaune pastel",    hex: "#F3DC8C" },   // juillet
    { name: "Rose",            hex: "#E07A9A" },   // août : un vrai rose
    { name: "Figue",           hex: "#7A4E5E" },   // septembre
    { name: "Chocolat chaud",  hex: "#6E4A32" },   // octobre
    { name: "Bordeaux",        hex: "#6D1F2E" },   // novembre
    { name: "Rouge myrte",     hex: "#A3192B" }    // décembre : le vrai rouge de Noël
  ]
};
