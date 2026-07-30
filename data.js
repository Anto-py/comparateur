/* Données du comparateur — Module 6 du cours IA 6P.
   Un seul endroit à modifier pour la réactualisation annuelle des chiffres.
   `wh` est toujours exprimé en wattheures, quelle que soit l'échelle affichée.
   `statut` : "mesure" (relu par des pairs) | "declare" (par l'entreprise concernée) | "estime" (par un tiers).

   Les liens vers les sources, trois champs, tous facultatifs :
   `lien`      { url, quoi } — la source à ouvrir en premier, la plus lisible pour un élève.
   `plus`      { url, quoi } — la publication complète, pour qui veut creuser.
   `sans_lien` texte         — quand il n'y a rien à ouvrir, on dit pourquoi. L'absence de
                               source est elle-même un enseignement du module, on ne la masque pas.
   Toutes les adresses sont recensées et datées dans SOURCES.md. */

const PALIERS = [
  {
    id: 'wh',
    nom: 'Wattheure',
    symbole: 'Wh',
    intitule: 'Le geste',
    min: 0.1,
    max: 1000,
    reperes: [
      { texte: 'Une ampoule LED de 8 W pendant 1 heure = 8 Wh' },
      { texte: 'Charger un smartphone à fond = 15 Wh' },
    ],
  },
  {
    id: 'kwh',
    nom: 'Kilowattheure',
    symbole: 'kWh',
    intitule: 'La maison',
    min: 1000,
    max: 1e6,
    reperes: [
      { texte: 'Une machine à laver = 0,8 kWh' },
      { texte: 'Un four électrique pendant 30 min = 1 kWh' },
    ],
  },
  {
    id: 'mwh',
    nom: 'Mégawattheure',
    symbole: 'MWh',
    intitule: "L'immeuble",
    min: 1e6,
    max: 1e9,
    reperes: [
      {
        texte: 'Un ménage belge pendant un an = 3,5 MWh',
        lien: { url: 'https://www.creg.be/fr/creg-scan-questions-frequemment-posees', quoi: 'le ménage-type du régulateur belge de l\'énergie, la CREG' },
      },
      { texte: '100 ménages pendant un an = 350 MWh' },
    ],
  },
  {
    id: 'gwh',
    nom: 'Gigawattheure',
    symbole: 'GWh',
    intitule: 'La ville',
    min: 1e9,
    max: 1e12,
    reperes: [
      { texte: '285 ménages belges pendant un an = 1 GWh' },
      { texte: 'Une ville de 30 000 habitants ≈ 45 GWh' },
    ],
  },
  {
    id: 'twh',
    nom: 'Térawattheure',
    symbole: 'TWh',
    intitule: 'Le pays',
    min: 1e12,
    max: 1e16,
    reperes: [
      {
        texte: 'Toute la Belgique en 2024 = 80,5 TWh',
        lien: { url: 'https://www.rtbf.be/article/bilan-electricite-2024-en-belgique-plus-d-importations-et-plus-de-production-photovoltaique-11484197', quoi: 'le bilan de la RTBF, qui reprend les chiffres d\'Elia' },
      },
    ],
  },
];

const CARTES = [
  {
    id: 'gemini',
    titre: 'Un prompt texte à Gemini',
    nombre: '0,24',
    valeur: '0,24 Wh',
    wh: 0.24,
    palier: 'wh',
    traduction: "Une ampoule LED allumée moins de 2 minutes. Google traduit lui-même par « 9 secondes de télévision ».",
    source: 'Google, août 2025',
    statut: 'declare',
    reserve: "Périmètre déclaré : l'usage seul. L'entraînement du modèle, ton téléphone et le réseau sont exclus du calcul.",
    lien: { url: 'https://blog.google/intl/fr-fr/nouveautes-produits/dans-le-cloud/quelle-consommation-energetique-pour-lia-de-google-nous-avons-fait-le-calcul/', quoi: "l'annonce de Google, en français" },
    plus: { url: 'https://arxiv.org/abs/2508.15734', quoi: 'le rapport technique où Google explique son calcul (en anglais)' },
  },
  {
    id: 'google',
    titre: 'Une recherche Google',
    nombre: '0,3',
    valeur: '0,3 Wh',
    wh: 0.3,
    palier: 'wh',
    traduction: "Une ampoule LED allumée 2 minutes. Google ajoutait à l'époque : 0,2 g de CO₂.",
    source: 'Google, billet officiel du 11 janvier 2009',
    statut: 'declare',
    reserve: "Ce chiffre a dix-sept ans et n'a jamais été réactualisé. Il sert pourtant encore de référence à presque toutes les comparaisons. Google n'a d'ailleurs pas écrit 0,3 Wh, mais « 0,0003 kWh » : le même nombre, dans une unité qui le fait paraître plus petit.",
    lien: { url: 'https://googleblog.blogspot.com/2009/01/powering-google-search.html', quoi: 'le billet de Google de janvier 2009, tel quel (en anglais)' },
    plus: { url: 'https://fullfact.org/environment/google-search/', quoi: "la vérification de Full Fact : depuis, Google n'a plus rien publié (en anglais)" },
  },
  {
    id: 'chatgpt',
    titre: 'Un prompt texte à ChatGPT',
    nombre: '0,34',
    valeur: '0,34 Wh',
    wh: 0.34,
    palier: 'wh',
    traduction: "Une ampoule LED allumée 2 minutes et demie.",
    source: 'Sam Altman, patron d\'OpenAI, sur son blog, juin 2025',
    statut: 'declare',
    reserve: "Aucun périmètre précisé, et rien ne dit ce qu'est une « requête moyenne ». Jamais relu par des scientifiques.",
    lien: { url: 'https://blog.samaltman.com/the-gentle-singularity', quoi: 'le billet de blog de Sam Altman, où le chiffre tient en une phrase (en anglais)' },
  },
  {
    id: 'requete_epri',
    titre: 'Une requête à une IA générative',
    nombre: '2,9',
    valeur: '2,9 Wh',
    wh: 2.9,
    palier: 'wh',
    traduction: "20 minutes d'ampoule LED, soit un cinquième de charge de smartphone.",
    source: 'EPRI, rapport Powering Intelligence, 2024',
    statut: 'estime',
    reserve: "Dix fois plus que le chiffre des entreprises. Attention : l'EPRI ne l'a pas mesuré lui-même, il reprend une étude scientifique parue en 2023 dans la revue Joule. Et cet institut est financé par les compagnies d'électricité, qui ont intérêt à montrer que la demande grimpe.",
    lien: { url: 'https://www.wpr.org/wp-content/uploads/2024/06/3002028905_Powering-Intelligence_-Analyzing-Artificial-Intelligence-and-Data-Center-Energy-Consumption.pdf', quoi: "le rapport de l'EPRI, en PDF (en anglais)" },
    plus: { url: 'https://doi.org/10.1016/j.joule.2023.09.004', quoi: "l'étude d'Alex de Vries dans la revue Joule, d'où vient vraiment le chiffre (en anglais)" },
  },
  {
    id: 'image',
    titre: 'Une image générée par IA',
    nombre: '2,9 en moyenne, jusqu\'à 11,5',
    valeur: '2,9 Wh en moyenne, jusqu\'à 11,5 Wh',
    wh: 2.9,
    palier: 'wh',
    traduction: "Pour le modèle le plus lourd : les trois quarts d'une charge de smartphone, pour une seule image.",
    source: 'Luccioni et al., Power Hungry Processing, ACM 2024',
    statut: 'mesure',
    reserve: "88 modèles mesurés un par un. Une image coûte cher parce que le modèle repasse des dizaines de fois sur la même image pour la nettoyer.",
    lien: { url: 'https://arxiv.org/abs/2311.16863', quoi: 'la publication des chercheuses, résumé et PDF gratuits (en anglais)' },
  },
  {
    id: 'video',
    titre: 'Une vidéo IA de 5 secondes',
    nombre: '944',
    valeur: '944 Wh',
    wh: 944,
    palier: 'wh',
    traduction: "Une machine à laver complète, ou 60 charges de smartphone. Pour cinq secondes de vidéo.",
    source: 'Mesure Luccioni sur CogVideoX, MIT Technology Review, mai 2025',
    statut: 'mesure',
    reserve: "700 fois une image. Il s'en est fallu de 56 Wh pour que cette carte bascule dans la colonne suivante.",
    lien: { url: 'https://www.technologyreview.com/2025/05/20/1116327/ai-energy-usage-climate-footprint-big-tech/', quoi: "l'enquête du MIT Technology Review (en anglais)" },
    plus: { url: 'https://www.technologyreview.com/2025/05/20/1116331/ai-energy-demand-methodology/', quoi: 'le détail de la méthode de mesure (en anglais)' },
  },
  {
    id: 'seconde',
    titre: 'Une seconde de ChatGPT dans le monde',
    nombre: 'entre 7 et 84',
    valeur: 'entre 7 et 84 kWh',
    wh: 8.4e4,
    palier: 'kwh',
    traduction: "Le temps de lire ces trois mots, l'équivalent de 100 machines à laver.",
    source: 'Calcul du jeu, à partir des 2,5 milliards de questions par jour annoncés par OpenAI, au chiffre de Google puis à celui de l\'EPRI',
    statut: 'estime',
    reserve: "Les deux bornes restent dans la même colonne. Peu importe qui a raison sur le petit chiffre : l'ordre de grandeur, lui, ne bouge pas.",
    sans_lien: "Ce chiffre est un calcul du jeu, il n'existe nulle part ailleurs : il n'y a donc pas de source à ouvrir.",
    plus: { url: 'https://techcrunch.com/2025/07/21/chatgpt-users-send-2-5-billion-prompts-a-day/', quoi: 'la seule donnée réelle du calcul : 2,5 milliards de questions par jour, chiffre donné par OpenAI (en anglais)' },
  },
  {
    id: 'heure',
    titre: 'Une heure de ChatGPT dans le monde',
    nombre: 'entre 25 et 302',
    valeur: 'entre 25 et 302 MWh',
    wh: 1.6e8,
    palier: 'mwh',
    traduction: "Le temps d'un cours, l'électricité annuelle de 7 à 86 ménages belges.",
    source: 'Calcul du jeu, à partir des 2,5 milliards de questions par jour annoncés par OpenAI, au chiffre de Google puis à celui de l\'EPRI',
    statut: 'estime',
    reserve: "Là encore, les deux bornes restent dans la même colonne. Le désaccord sur le petit chiffre ne change pas l'ordre de grandeur.",
    sans_lien: "Ce chiffre est un calcul du jeu, il n'existe nulle part ailleurs : il n'y a donc pas de source à ouvrir.",
    plus: { url: 'https://techcrunch.com/2025/07/21/chatgpt-users-send-2-5-billion-prompts-a-day/', quoi: 'la seule donnée réelle du calcul : 2,5 milliards de questions par jour, chiffre donné par OpenAI (en anglais)' },
  },
  {
    id: 'gpt3',
    titre: 'Entraîner GPT-3, une seule fois',
    nombre: '1 287',
    valeur: '1 287 MWh, soit 1,3 GWh, et 552 tonnes de CO₂',
    wh: 1.287e9,
    palier: 'gwh',
    traduction: "L'électricité de 370 ménages belges pendant un an. Le CO₂ d'environ 550 allers-retours Paris-New York en avion.",
    source: 'Patterson et al., 2021, publication scientifique',
    statut: 'mesure',
    reserve: "Calculé par des chercheurs extérieurs à OpenAI, avec leur méthode publiée. D'autres laboratoires en publient depuis, comme Meta pour Llama 3 : c'est OpenAI qui s'est tu. Écrit en MWh dans toutes les sources, ce chiffre vaut pourtant plus d'un gigawattheure : l'unité choisie le fait paraître plus petit.",
    lien: { url: 'https://arxiv.org/abs/2104.10350', quoi: 'la publication de Patterson et ses collègues, gratuite (en anglais)' },
    plus: { url: 'https://github.com/meta-llama/llama3/blob/main/MODEL_CARD.md', quoi: "la fiche de Meta pour Llama 3, qui publie bien son coût d'entraînement (en anglais)" },
  },
  {
    id: 'gpt4',
    titre: 'Entraîner GPT-4',
    nombre: '50 000',
    valeur: '50 000 MWh, soit 50 GWh',
    wh: 5e10,
    palier: 'gwh',
    traduction: "L'électricité de 14 000 ménages belges pendant un an, plus que tous les ménages de Saint-Ghislain.",
    source: 'Estimations de tiers, 40 à 48 fois GPT-3',
    statut: 'estime',
    reserve: "OpenAI n'a jamais rien publié. Ce chiffre est une reconstitution, à traiter comme telle.",
    sans_lien: "Rien à ouvrir : OpenAI n'a jamais publié ce chiffre. Une carte sans source, c'est aussi une information.",
  },
  {
    id: 'google_groupe',
    titre: 'Google, toute l\'entreprise, en un an',
    nombre: '43,6',
    valeur: '43,6 TWh',
    wh: 4.36e13,
    palier: 'twh',
    traduction: "Plus de la moitié de toute l'électricité consommée en Belgique. Et 37 % de plus que l'année précédente.",
    source: 'Rapport environnemental de Google 2026, pour l\'année 2025',
    statut: 'declare',
    reserve: "97 % de cette électricité part dans les data centers. La consommation de Google a plus que triplé depuis 2019.",
    lien: { url: 'https://blog.google/company-news/outreach-and-initiatives/sustainability/2026-environmental-report/', quoi: "l'annonce de Google, qui donne la hausse de 37 % (en anglais)" },
    plus: { url: 'https://sustainability.google/reports/google-2026-environmental-report/', quoi: 'le rapport complet, où le tableau des consommations affiche 43 586 600 MWh (en anglais)' },
  },
  {
    id: 'dc_2024',
    titre: 'Tous les data centers du monde, en 2024',
    nombre: '415',
    valeur: '415 TWh',
    wh: 4.15e14,
    palier: 'twh',
    traduction: "Cinq fois la Belgique. C'est 1,5 % de toute l'électricité de la planète.",
    source: 'Agence internationale de l\'énergie, rapport Energy and AI, avril 2025',
    statut: 'mesure',
    reserve: "Tous les data centers, pas seulement ceux de l'IA : le streaming, le cloud et les mails en font partie.",
    lien: { url: 'https://www.iea.org/reports/energy-and-ai/executive-summary', quoi: "le résumé du rapport de l'Agence internationale de l'énergie (en anglais)" },
    plus: { url: 'https://www.iea.org/reports/energy-and-ai', quoi: 'le rapport entier, chapitre par chapitre (en anglais)' },
  },
  {
    id: 'dc_2030',
    titre: 'Tous les data centers du monde, prévu pour 2030',
    nombre: '945',
    valeur: '945 TWh',
    wh: 9.45e14,
    palier: 'twh',
    traduction: "Douze fois la Belgique. L'AIE compare ce total à la consommation actuelle du Japon tout entier.",
    source: 'Agence internationale de l\'énergie, rapport Energy and AI, avril 2025',
    statut: 'estime',
    reserve: "Une projection, donc un chiffre sur l'avenir. Personne ne peut le vérifier aujourd'hui.",
    lien: { url: 'https://www.iea.org/reports/energy-and-ai/executive-summary', quoi: "le résumé du rapport de l'Agence internationale de l'énergie (en anglais)" },
    plus: { url: 'https://www.iea.org/reports/energy-and-ai', quoi: 'le rapport entier, chapitre par chapitre (en anglais)' },
  },
];

/* La carte gardée pour la fin : sa fourchette traverse deux colonnes,
   ce qui la rend intriable. C'est précisément la leçon. */
const CARTE_FINALE = {
  titre: 'Une journée de ChatGPT dans le monde entier',
  basse: '600 MWh',
  haute: '7 250 MWh, soit 7,25 GWh',
  texte: "Selon qu'on prend le chiffre de Google (0,24 Wh) ou celui de l'EPRI (2,9 Wh), cette carte se range dans la colonne MWh ou dans la colonne GWh. Elle est la seule de tout le jeu qu'on ne peut pas classer. Ce n'est pas une erreur du jeu : c'est ce que veut dire « les chiffres sont contestés ».",
  sans_lien: "Comme les deux autres cartes calculées, ce chiffre est un calcul du jeu, il n'existe nulle part ailleurs.",
  plus: { url: 'https://techcrunch.com/2025/07/21/chatgpt-users-send-2-5-billion-prompts-a-day/', quoi: 'la seule donnée réelle du calcul : 2,5 milliards de questions par jour, chiffre donné par OpenAI (en anglais)' },
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
