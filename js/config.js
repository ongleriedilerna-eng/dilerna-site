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
    { src: "assets/img/creations/creation-01.webp", alt: "Ongles amande nude avec fleurs roses en 3D, strass dorés, zèbre et léopard" },
    { src: "assets/img/creations/creation-02.webp", alt: "Nail art tropical multicolore : fleurs, nœud bleu en relief, boules de billard et étoile de mer" },
    { src: "assets/img/creations/creation-03.webp", alt: "Ongles papaye orange et vert pomme avec strass et coquillages" },
    { src: "assets/img/creations/creation-04.webp", alt: "Nail art L'Étrange Noël de Monsieur Jack peint à la main" },
    { src: "assets/img/creations/creation-05.webp", alt: "Nail art Halloween rose : masque Scream, gouttes et araignées en strass" },
    { src: "assets/img/creations/creation-06.webp", alt: "Ongles rayures et pois bordeaux, rose, bleu et jaune avec bijoux soleil" },
    { src: "assets/img/creations/creation-07.webp", alt: "Ongles stiletto coquillages et fleurs en relief, couleurs vives" },
    { src: "assets/img/creations/creation-08.webp", alt: "French amande orange et jaune avec fleurs tropicales en 3D" },
    { src: "assets/img/creations/creation-09.webp", alt: "Ongles amande léopard rose aquarelle" },
    { src: "assets/img/creations/creation-10.webp", alt: "Nail art pastel tropical avec fleurs violettes et hippocampe doré" },
  ],

  /* Dernières publications Instagram (Créations récentes), à faire glisser.
     url = lien de la publication (sinon, lien vers le profil). */
  /* Carte blanche : la carte se retourne et montre, au dos, la demande (en haut) et le résultat (en bas). Une ligne par Carte blanche (la 1re est affichée) :
     demande = la photo d'inspiration envoyée par la cliente, resultat = la photo du nail art fini (mains uniquement),
     theme = le thème demandé ; label = le mot affiché sur la photo du haut (« La demande » par défaut, « Le thème » pour une illustration).
     Tant que la liste est vide, la carte ne se retourne pas. */
  carteBlanche: [
    { titre: "Tim Burton", demande: "assets/img/carte-blanche/theme-tim-burton.webp", label: "Le thème", resultat: "assets/img/creations/creation-04.webp", theme: "L'Étrange Noël de Monsieur Jack" },
    { titre: "Beetlejuice", demande: "assets/img/carte-blanche/theme-beetlejuice.webp?v=2", label: "Le thème", resultat: "assets/img/carte-blanche/resultat-beetlejuice.webp", theme: "Beetlejuice" },
    { titre: "Chucky", demande: "assets/img/carte-blanche/theme-chucky.webp", label: "Le thème", resultat: "assets/img/carte-blanche/resultat-chucky.webp", theme: "Chucky" },
    { titre: "Willy Wonka", demande: "assets/img/carte-blanche/theme-wonka.webp?v=3", label: "Le thème", resultat: "assets/img/carte-blanche/resultat-wonka.webp", theme: "Charlie et la chocolaterie" },
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

  /* Bandeau Pinterest : inspirations de poses que Marie rêve de faire
     (tableau https://fr.pinterest.com/mariefleandri/nail-art-inspi/). */
  pinterest: [
    "assets/img/pinterest/inspi-01.webp",
    "assets/img/pinterest/inspi-02.webp",
    "assets/img/pinterest/inspi-03.webp",
    "assets/img/pinterest/inspi-04.webp",
    "assets/img/pinterest/inspi-05.webp",
    "assets/img/pinterest/inspi-06.webp",
    "assets/img/pinterest/inspi-07.webp",
    "assets/img/pinterest/inspi-08.webp",
    "assets/img/pinterest/inspi-09.webp",
    "assets/img/pinterest/inspi-10.webp",
    "assets/img/pinterest/inspi-11.webp",
    "assets/img/pinterest/inspi-12.webp",
    "assets/img/pinterest/inspi-13.webp",
    "assets/img/pinterest/inspi-14.webp",
    "assets/img/pinterest/inspi-15.webp",
    "assets/img/pinterest/inspi-16.webp",
    "assets/img/pinterest/inspi-17.webp",
    "assets/img/pinterest/inspi-18.webp",
    "assets/img/pinterest/inspi-19.webp",
    "assets/img/pinterest/inspi-20.webp",
    "assets/img/pinterest/inspi-21.webp",
    "assets/img/pinterest/inspi-22.webp",
    "assets/img/pinterest/inspi-23.webp",
    "assets/img/pinterest/inspi-24.webp",
    "assets/img/pinterest/inspi-25.webp",
    "assets/img/pinterest/inspi-26.webp",
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

  /* Couleur du mois : une par mois (janvier → décembre).
     Palette rouge, marron, rose, pâle, crème. */
  colors: [
    { name: "Bleu glacier",     hex: "#7FA7D3" },   // janvier
    { name: "Vert pistache",    hex: "#8DB580" },   // février
    { name: "Rose dragée",      hex: "#E39AAE" },   // mars
    { name: "Nude rosé",        hex: "#D7AE9F" },   // avril
    { name: "Fraise écrasée",   hex: "#C9445C" },   // mai
    { name: "Coquillage",       hex: "#E8C9B0" },   // juin
    { name: "Rouge tomate",     hex: "#C2302E" },   // juillet
    { name: "Jaune soleil",     hex: "#F2C14E" },   // août
    { name: "Praline",          hex: "#9A6A52" },   // septembre
    { name: "Chocolat chaud",   hex: "#6E4A32" },   // octobre
    { name: "Bordeaux velours", hex: "#6D1F2E" },   // novembre
    { name: "Cerise noire",     hex: "#8E1B2F" }    // décembre
  ]
};
