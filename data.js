/* Données du comparateur — Module 6 du cours IA 6P.
   Un seul endroit à modifier pour la réactualisation annuelle des chiffres.
   `wh` est toujours exprimé en wattheures, quelle que soit l'échelle affichée.
   `statut` : "mesure" (relu par des pairs) | "declare" (par l'entreprise concernée) | "estime" (par un tiers). */

const PALIERS = [
  {
    id: 'wh',
    nom: 'Wattheure',
    symbole: 'Wh',
    intitule: 'Le geste',
    min: 0.1,
    max: 1000,
    reperes: ['Une ampoule LED de 8 W pendant 1 heure = 8 Wh', 'Charger un smartphone à fond = 15 Wh'],
  },
  {
    id: 'kwh',
    nom: 'Kilowattheure',
    symbole: 'kWh',
    intitule: 'La maison',
    min: 1000,
    max: 1e6,
    reperes: ['Une machine à laver = 0,8 kWh', 'Un four électrique pendant 30 min = 1 kWh'],
  },
  {
    id: 'mwh',
    nom: 'Mégawattheure',
    symbole: 'MWh',
    intitule: "L'immeuble",
    min: 1e6,
    max: 1e9,
    reperes: ['Un ménage belge pendant un an = 3,5 MWh', '100 ménages pendant un an = 350 MWh'],
  },
  {
    id: 'gwh',
    nom: 'Gigawattheure',
    symbole: 'GWh',
    intitule: 'La ville',
    min: 1e9,
    max: 1e12,
    reperes: ['285 ménages belges pendant un an = 1 GWh', 'Une ville de 30 000 habitants ≈ 45 GWh'],
  },
  {
    id: 'twh',
    nom: 'Térawattheure',
    symbole: 'TWh',
    intitule: 'Le pays',
    min: 1e12,
    max: 1e16,
    reperes: ['Toute la Belgique en 2024 = 80,5 TWh'],
  },
];

const CARTES = [
  {
    id: 'gemini',
    titre: 'Un prompt texte à Gemini',
    valeur: '0,24 Wh',
    wh: 0.24,
    palier: 'wh',
    traduction: "Une ampoule LED allumée moins de 2 minutes. Google traduit lui-même par « 9 secondes de télévision ».",
    source: 'Google, août 2025',
    statut: 'declare',
    reserve: "Périmètre déclaré : l'usage seul. L'entraînement du modèle, ton téléphone et le réseau sont exclus du calcul.",
  },
  {
    id: 'google',
    titre: 'Une recherche Google',
    valeur: '0,3 Wh',
    wh: 0.3,
    palier: 'wh',
    traduction: "Une ampoule LED allumée 2 minutes. Google ajoutait à l'époque : 0,2 g de CO₂.",
    source: 'Google, billet officiel du 11 janvier 2009',
    statut: 'declare',
    reserve: "Ce chiffre a dix-sept ans et n'a jamais été réactualisé. Il sert pourtant encore de référence à presque toutes les comparaisons.",
  },
  {
    id: 'chatgpt',
    titre: 'Un prompt texte à ChatGPT',
    valeur: '0,34 Wh',
    wh: 0.34,
    palier: 'wh',
    traduction: "Une ampoule LED allumée 2 minutes et demie.",
    source: 'Sam Altman, patron d\'OpenAI, sur son blog, juin 2025',
    statut: 'declare',
    reserve: "Aucun périmètre précisé, et rien ne dit ce qu'est une « requête moyenne ». Jamais relu par des scientifiques.",
  },
  {
    id: 'requete_epri',
    titre: 'Une requête à une IA générative',
    valeur: '2,9 Wh',
    wh: 2.9,
    palier: 'wh',
    traduction: "20 minutes d'ampoule LED, soit un cinquième de charge de smartphone.",
    source: 'EPRI, rapport Powering Intelligence, 2024',
    statut: 'estime',
    reserve: "Chiffre d'un institut de recherche indépendant, dix fois plus élevé que celui des entreprises. C'est celui que reprend l'Agence internationale de l'énergie.",
  },
  {
    id: 'image',
    titre: 'Une image générée par IA',
    valeur: '2,9 Wh en moyenne, jusqu\'à 11,5 Wh',
    wh: 2.9,
    palier: 'wh',
    traduction: "Pour le modèle le plus lourd : les trois quarts d'une charge de smartphone, pour une seule image.",
    source: 'Luccioni et al., Power Hungry Processing, ACM 2024',
    statut: 'mesure',
    reserve: "88 modèles mesurés un par un. Une image coûte cher parce que le modèle repasse des dizaines de fois sur la même image pour la nettoyer.",
  },
  {
    id: 'video',
    titre: 'Une vidéo IA de 5 secondes',
    valeur: '944 Wh',
    wh: 944,
    palier: 'wh',
    traduction: "Une machine à laver complète, ou 60 charges de smartphone. Pour cinq secondes de vidéo.",
    source: 'Mesure Luccioni sur CogVideoX, MIT Technology Review, mai 2025',
    statut: 'mesure',
    reserve: "700 fois une image. Il s'en est fallu de 56 Wh pour que cette carte bascule dans la colonne suivante.",
  },
  {
    id: 'seconde',
    titre: 'Une seconde de ChatGPT dans le monde',
    valeur: 'entre 7 et 84 kWh',
    wh: 8.4e4,
    palier: 'kwh',
    traduction: "Le temps de lire ces trois mots, l'équivalent de 100 machines à laver.",
    source: 'Calcul : 2,5 milliards de prompts par jour (OpenAI) au chiffre de Google puis à celui de l\'EPRI',
    statut: 'estime',
    reserve: "Les deux bornes restent dans la même colonne. Peu importe qui a raison sur le petit chiffre : l'ordre de grandeur, lui, ne bouge pas.",
  },
  {
    id: 'heure',
    titre: 'Une heure de ChatGPT dans le monde',
    valeur: 'entre 25 et 302 MWh',
    wh: 1.6e8,
    palier: 'mwh',
    traduction: "Le temps d'un cours, l'électricité annuelle de 7 à 86 ménages belges.",
    source: 'Calcul : 2,5 milliards de prompts par jour (OpenAI) au chiffre de Google puis à celui de l\'EPRI',
    statut: 'estime',
    reserve: "Là encore, les deux bornes restent dans la même colonne. Le désaccord sur le petit chiffre ne change pas l'ordre de grandeur.",
  },
  {
    id: 'gpt3',
    titre: 'Entraîner GPT-3, une seule fois',
    valeur: '1 287 MWh, soit 1,3 GWh, et 552 tonnes de CO₂',
    wh: 1.287e9,
    palier: 'gwh',
    traduction: "L'électricité de 370 ménages belges pendant un an. Le CO₂ d'environ 550 allers-retours Paris-New York en avion.",
    source: 'Patterson et al., 2021, publication scientifique',
    statut: 'mesure',
    reserve: "Le seul chiffre d'entraînement publié avec sa méthode. Depuis, plus aucun laboratoire n'en publie. Écrit en MWh dans toutes les sources, il vaut pourtant plus d'un gigawattheure : l'unité choisie fait paraître le chiffre plus petit.",
  },
  {
    id: 'gpt4',
    titre: 'Entraîner GPT-4',
    valeur: '50 000 MWh, soit 50 GWh',
    wh: 5e10,
    palier: 'gwh',
    traduction: "L'électricité de 14 000 ménages belges pendant un an, plus que tous les ménages de Saint-Ghislain.",
    source: 'Estimations de tiers, 40 à 48 fois GPT-3',
    statut: 'estime',
    reserve: "OpenAI n'a jamais rien publié. Ce chiffre est une reconstitution, à traiter comme telle.",
  },
  {
    id: 'google_groupe',
    titre: 'Google, toute l\'entreprise, en un an',
    valeur: '43,6 TWh',
    wh: 4.36e13,
    palier: 'twh',
    traduction: "Plus de la moitié de toute l'électricité consommée en Belgique. Et 37 % de plus que l'année précédente.",
    source: 'Rapport environnemental de Google, 2025',
    statut: 'declare',
    reserve: "97 % de cette électricité part dans les data centers. La consommation de Google a plus que triplé depuis 2019.",
  },
  {
    id: 'dc_2024',
    titre: 'Tous les data centers du monde, en 2024',
    valeur: '415 TWh',
    wh: 4.15e14,
    palier: 'twh',
    traduction: "Cinq fois la Belgique. C'est 1,5 % de toute l'électricité de la planète.",
    source: 'Agence internationale de l\'énergie, rapport Energy and AI, avril 2025',
    statut: 'mesure',
    reserve: "Tous les data centers, pas seulement ceux de l'IA : le streaming, le cloud et les mails en font partie.",
  },
  {
    id: 'dc_2030',
    titre: 'Tous les data centers du monde, prévu pour 2030',
    valeur: '945 TWh',
    wh: 9.45e14,
    palier: 'twh',
    traduction: "Douze fois la Belgique. L'AIE compare ce total à la consommation actuelle du Japon tout entier.",
    source: 'Agence internationale de l\'énergie, rapport Energy and AI, avril 2025',
    statut: 'estime',
    reserve: "Une projection, donc un chiffre sur l'avenir. Personne ne peut le vérifier aujourd'hui.",
  },
];

/* La carte gardée pour la fin : sa fourchette traverse deux colonnes,
   ce qui la rend intriable. C'est précisément la leçon. */
const CARTE_FINALE = {
  titre: 'Une journée de ChatGPT dans le monde entier',
  basse: '600 MWh',
  haute: '7 250 MWh, soit 7,25 GWh',
  texte: "Selon qu'on prend le chiffre de Google (0,24 Wh) ou celui de l'EPRI (2,9 Wh), cette carte se range dans la colonne MWh ou dans la colonne GWh. Elle est la seule de tout le jeu qu'on ne peut pas classer. Ce n'est pas une erreur du jeu : c'est ce que veut dire « les chiffres sont contestés ».",
};

const USAGES = [
  { id: 'recherches', label: 'Recherches Google', unite: 'par semaine', defaut: 50, max: 300, basse: 0.3, haute: 0.3 },
  { id: 'prompts', label: 'Questions à une IA (ChatGPT, Gemini, My AI…)', unite: 'par semaine', defaut: 20, max: 300, basse: 0.24, haute: 2.9 },
  { id: 'images', label: 'Images générées par IA', unite: 'par semaine', defaut: 5, max: 100, basse: 2.9, haute: 11.5 },
  { id: 'videos', label: 'Vidéos IA de 5 secondes', unite: 'par semaine', defaut: 0, max: 50, basse: 944, haute: 944 },
];

/* Les trois derniers groupes comptent les personnes de plus de 13 ans, c'est-à-dire
   celles en âge d'ouvrir un compte sur la plupart des services d'IA.
   Méthode : population totale × part des plus de 13 ans, cette part étant obtenue
   en retirant les 0-12 ans, eux-mêmes interpolés depuis la tranche 0-14 ans publiée
   (0-12 ≈ 0-14 × 13/15). C'est une estimation assumée, pas un recensement. */
const GROUPES = [
  { id: 'moi', label: 'Moi seul', court: '1', n: 1 },
  { id: 'classe', label: 'Ma classe', court: '20', n: 20 },
  { id: 'ecole', label: 'Mon école', court: '600', n: 600 },
  {
    id: 'pays',
    label: 'Mon pays',
    detail: 'la Belgique',
    court: '10,2 millions',
    n: 10170000,
    source: '11 825 551 habitants au 1er janvier 2025 (Statbel), dont 16,1 % de 0-14 ans (Eurostat)',
  },
  {
    id: 'continent',
    label: 'Mon continent',
    detail: "l'Union européenne",
    court: '387 millions',
    n: 387000000,
    source: '450,4 millions d\'habitants au 1er janvier 2025 (Eurostat)',
  },
  {
    id: 'planete',
    label: 'Ma planète',
    detail: 'le monde entier',
    court: '6,5 milliards',
    n: 6520000000,
    source: '8,3 milliards d\'habitants en 2026 (ONU), dont 24,7 % de 0-14 ans (Banque mondiale)',
  },
];

/* Repère d'échelle pour les grands totaux : toute l'électricité consommée en Belgique
   en 2024, soit 80,5 TWh (Elia, bilan du 2 janvier 2025). */
const BELGIQUE_AN_WH = 8.05e13;

const LABELS_STATUT = {
  mesure: { texte: 'Mesuré et relu', classe: 'st-mesure' },
  declare: { texte: 'Déclaré par l\'entreprise', classe: 'st-declare' },
  estime: { texte: 'Estimé par un tiers', classe: 'st-estime' },
};
